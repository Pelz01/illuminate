import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, Route } from "lucide-react";
import { useTonWalletSession } from "@/hooks/use-ton-wallet-session";
import { useStonWalletPositions } from "@/hooks/use-ston-wallet-positions";
import { useEffect, useRef, useState } from "react";
import { streamPollinationsChat } from "@/lib/pollinations";

const RebalancePage = () => {
  const { connected, address, connect } = useTonWalletSession();
  const { data: positions = [], isLoading } = useStonWalletPositions(address);
  const [aiSummary, setAiSummary] = useState("");
  const [aiError, setAiError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleGenerateSummary = async () => {
    const apiKey = (import.meta.env.VITE_POLLINATIONS_API_KEY as string | undefined) ?? "";
    if (!apiKey) {
      setAiError("Set VITE_POLLINATIONS_API_KEY to enable streamed recommendations.");
      return;
    }

    if (!connected || !positions.length) {
      setAiError("Connect wallet and load at least one LP position first.");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setAiSummary("");
    setAiError("");
    setIsStreaming(true);

    try {
      const positionContext = positions
        .slice(0, 12)
        .map((position) => {
          const value = position.valueUsd === null ? "Unavailable" : `$${position.valueUsd.toFixed(2)}`;
          const net = position.netVsHoldUsd === null ? "Unavailable" : `$${position.netVsHoldUsd.toFixed(2)}`;
          const apy = position.apyPct === null ? "Unavailable" : `${position.apyPct.toFixed(2)}%`;
          return `${position.pair} | Value: ${value} | APY: ${apy} | Net vs hold: ${net}`;
        })
        .join("\n");

      await streamPollinationsChat({
        apiKey,
        model: "openai",
        signal: controller.signal,
        messages: [
          {
            role: "system",
            content:
              "You are a concise DeFi LP assistant for TON and STON.fi. Use plain language. Avoid hype. If data is missing, say it clearly.",
          },
          {
            role: "user",
            content: `Create a short rebalance recommendation from these live wallet LP positions.\n\nWallet positions:\n${positionContext}\n\nReturn:\n1) Current risk snapshot\n2) Best next action\n3) What data is still missing`,
          },
        ],
        onToken: (_token, fullText) => {
          setAiSummary(fullText);
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to stream recommendation.";
      if (controller.signal.aborted) {
        setAiError("Generation stopped.");
      } else {
        setAiError(message);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleStopSummary = () => {
    abortRef.current?.abort();
  };

  return (
    <AppLayout
      title="Rebalance"
      subtitle="Live route execution is enabled only after recommendation logic is computed from wallet-level attribution."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-accent/30 opacity-60 blur" />
          <div className="relative glass-card rounded-3xl p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90 font-mono">
              Rebalance status
            </div>
            <h2 className="mt-2 font-serif-display text-3xl">Live recommendations unavailable</h2>

            {!connected && (
              <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5">
                <p className="text-sm text-muted-foreground">
                  Connect wallet to prepare live rebalance suggestions once attribution is enabled.
                </p>
                <Button variant="glass" className="mt-4" onClick={connect}>
                  Connect wallet
                </Button>
              </div>
            )}

            {connected && isLoading && (
              <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5 text-sm text-muted-foreground">
                Loading wallet positions...
              </div>
            )}

            {connected && !isLoading && positions.length === 0 && (
              <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5 text-sm text-muted-foreground">
                No STON.fi positions found for this wallet.
              </div>
            )}

            {connected && !isLoading && positions.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                  Positions detected
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {positions.map((position) => (
                    <li key={position.poolAddress}>{position.pair}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Rebalance execution stays disabled until live IL and fee attribution produce an actual recommendation.
                </p>

                <div className="mt-5 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                    AI recommendation
                  </div>
                  <div className="mt-2 min-h-24 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {aiSummary || "Generate a streamed recommendation from your current LP positions."}
                  </div>
                  {aiError && (
                    <p className="mt-3 text-xs text-destructive">{aiError}</p>
                  )}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={handleGenerateSummary}
                      disabled={isStreaming}
                    >
                      Stream recommendation
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleStopSummary}
                      disabled={!isStreaming}
                    >
                      Stop stream
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="luminous" size="lg" className="flex-1" disabled>
                <Zap className="h-4 w-4" /> Execute rebalance
              </Button>
              <Button variant="glass" size="lg" disabled>
                Customize route
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Info
            icon={Route}
            title="Route engine"
            body="STON.fi SDK route building is available. It will be activated after recommendations are computed from live wallet data."
          />
          <Info
            icon={ShieldCheck}
            title="Non-custodial execution"
            body="Transactions are signed in your wallet through TonConnect. No custody layer is introduced."
          />
          <Info
            icon={Zap}
            title="Activation requirement"
            body="Rebalance actions become available only when a recommendation is derived from real attribution, not static examples."
          />
        </div>
      </div>
    </AppLayout>
  );
};

const Info = ({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Zap;
  title: string;
  body: string;
}) => (
  <div className="glass-card rounded-2xl p-6">
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-amber text-primary-foreground shadow-glow-sm">
      <Icon className="h-4 w-4" />
    </span>
    <h3 className="mt-4 font-serif-display text-xl">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

export default RebalancePage;
