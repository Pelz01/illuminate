export type PollinationsChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

type PollinationsToolCallDelta = {
  index?: number;
  function?: {
    name?: string;
    arguments?: string;
  };
};

type PollinationsSseChunk = {
  choices?: Array<{
    delta?: {
      content?: string | null;
      tool_calls?: PollinationsToolCallDelta[] | null;
    };
  }>;
};

export type PollinationsToolCall = {
  index: number;
  name: string;
  argumentsText: string;
  argumentsJson: unknown | null;
};

export type StreamPollinationsChatParams = {
  apiKey: string;
  messages: PollinationsChatMessage[];
  model?: string;
  signal?: AbortSignal;
  onToken?: (token: string, fullText: string) => void;
  onToolCall?: (call: PollinationsToolCall) => void;
};

export type StreamPollinationsChatResult = {
  content: string;
  toolCalls: PollinationsToolCall[];
};

const POLLINATIONS_CHAT_URL = "https://gen.pollinations.ai/v1/chat/completions";

const parseJsonSafe = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseSseEventData = (eventBlock: string) => {
  const lines = eventBlock.split("\n");
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    dataLines.push(line.slice(5).trimStart());
  }

  return dataLines.join("\n");
};

const buildToolCallState = (
  buffers: Map<number, { name: string; args: string }>,
  deltas: PollinationsToolCallDelta[] | null | undefined
) => {
  if (!deltas?.length) return [];

  const completed: PollinationsToolCall[] = [];

  for (const delta of deltas) {
    const callIndex = delta.index ?? 0;
    const existing = buffers.get(callIndex) ?? { name: "unknown_function", args: "" };

    const nextName = delta.function?.name ?? existing.name;
    const nextArgs = existing.args + (delta.function?.arguments ?? "");
    buffers.set(callIndex, { name: nextName, args: nextArgs });

    const parsed = parseJsonSafe(nextArgs);
    if (parsed !== null) {
      completed.push({
        index: callIndex,
        name: nextName,
        argumentsText: nextArgs,
        argumentsJson: parsed,
      });
      buffers.delete(callIndex);
    }
  }

  return completed;
};

export const streamPollinationsChat = async ({
  apiKey,
  messages,
  model = "openai",
  signal,
  onToken,
  onToolCall,
}: StreamPollinationsChatParams): Promise<StreamPollinationsChatResult> => {
  if (!apiKey.trim()) {
    throw new Error("Missing Pollinations API key.");
  }

  const response = await fetch(POLLINATIONS_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      stream_options: {
        include_usage: true,
      },
    }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pollinations error (${response.status}): ${body || "Unknown error"}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const toolBuffers = new Map<number, { name: string; args: string }>();
  const completedToolCalls: PollinationsToolCall[] = [];
  let fullText = "";

  // Some upstream providers may return JSON even when stream=true.
  if (!contentType.includes("text/event-stream")) {
    const payload = parseJsonSafe(await response.text());
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.length > 0) {
      fullText = content;
      onToken?.(content, fullText);
    }
    return { content: fullText, toolCalls: completedToolCalls };
  }

  if (!response.body) {
    throw new Error("Streaming response body is empty.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventBlock of events) {
      const data = parseSseEventData(eventBlock);
      if (!data) continue;
      if (data === "[DONE]") {
        return { content: fullText, toolCalls: completedToolCalls };
      }

      const chunk = parseJsonSafe(data) as PollinationsSseChunk | null;
      if (!chunk) continue;

      const delta = chunk.choices?.[0]?.delta;
      const token = delta?.content;
      if (typeof token === "string" && token.length > 0) {
        fullText += token;
        onToken?.(token, fullText);
      }

      const readyCalls = buildToolCallState(toolBuffers, delta?.tool_calls);
      for (const call of readyCalls) {
        completedToolCalls.push(call);
        onToolCall?.(call);
      }
    }
  }

  return { content: fullText, toolCalls: completedToolCalls };
};

