import { Section } from "./Section";
import { Check, Minus } from "lucide-react";

type Cell = boolean | "partial" | "scope";

const rows: Array<[string, string, Cell]> = [
  ["LP position tracking", "Yes — dashboard shows positions", true],
  ["Impermanent loss calculation", "Standalone calculator at tools.ston.fi", true],
  ["IL protection program", "Yes — USDT/STON pool only", "scope"],
  ["Hold vs LP comparison chart", "—", true],
  ["Net return: IL minus fees earned", "Shown separately, not combined", true],
  ["Smart exit alert (when IL exceeds fees)", "—", true],
  ["Pre-entry IL simulator (wallet + pool aware)", "Generic calculator, not wallet-specific", true],
  ["One-click rebalance via Omniston", "Manual process", true],
];

export const Comparison = () => (
  <Section
    eyebrow="What's missing today"
    title={<>STON.fi has the rails. <em className="italic text-primary/90">ILuminate is the decision layer.</em></>}
    description="STON.fi has invested seriously in LP tooling. Here's exactly what exists today — and the gap ILuminate fills, built on the same APIs."
  >
    <div className="mt-14 mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/60 glass-card">
      <div className="grid grid-cols-[1.6fr_1.6fr_0.8fr] text-xs uppercase tracking-[0.18em] text-muted-foreground/80 border-b border-border/60 px-6 py-4 bg-secondary/30">
        <span>Capability</span>
        <span>STON.fi today</span>
        <span className="text-right text-primary">ILuminate</span>
      </div>
      {rows.map(([cap, ston, ilum], i) => (
        <div
          key={cap}
          className={`grid grid-cols-[1.6fr_1.6fr_0.8fr] items-center px-6 py-4 text-sm gap-4 ${i % 2 ? "bg-background/30" : ""}`}
        >
          <span className="text-foreground/90">{cap}</span>
          <span className="text-muted-foreground text-[13px]">{ston}</span>
          <span className="flex justify-end"><Mark val={ilum} /></span>
        </div>
      ))}
    </div>

    <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground/70 italic">
      Nansen now covers TON, and trackers like Tonalytics offer wallet activity monitoring. Neither provides
      wallet-specific LP performance attribution combined with actionable execution on STON.fi. That is the
      specific gap ILuminate addresses.
    </p>
  </Section>
);

const Mark = ({ val }: { val: Cell }) => {
  if (val === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (val === "partial") {
    return <span className="text-xs font-mono text-muted-foreground">partial</span>;
  }
  if (val === "scope") {
    return <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">STON.fi owns</span>;
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive/80">
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
};

export default Comparison;
