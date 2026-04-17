import { Section } from "./Section";
import { Check, Minus } from "lucide-react";

const rows = [
  ["Live LP position tracking", true, "partial", "DeBank / Zapper"],
  ["Impermanent loss per position", true, false, "Revert Finance"],
  ["Hold vs LP comparison chart", true, false, "APY.Vision"],
  ["Net return (IL minus fees)", true, false, "Revert Finance"],
  ["Smart exit alerts", true, false, "—"],
  ["Pre-entry IL simulator", true, false, "APY.Vision"],
  ["One-click rebalance", true, false, "1inch / Paraswap"],
] as const;

export const Comparison = () => (
  <Section
    eyebrow="Market Position"
    title={<>The first of its kind <em className="italic text-primary/90">on TON.</em></>}
    description="DeBank, Zapper, Revert and APY.Vision exist on Ethereum. None of them exist on TON. ILuminate is."
  >
    <div className="mt-14 mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/60 glass-card">
      <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] text-xs uppercase tracking-[0.18em] text-muted-foreground/80 border-b border-border/60 px-6 py-4 bg-secondary/30">
        <span>Capability</span>
        <span className="text-center text-primary">ILuminate</span>
        <span className="text-center">TON today</span>
        <span className="text-right">Ethereum</span>
      </div>
      {rows.map(([cap, ilum, ton, eth], i) => (
        <div
          key={cap}
          className={`grid grid-cols-[2fr_1fr_1fr_1.2fr] items-center px-6 py-4 text-sm ${i % 2 ? "bg-background/30" : ""}`}
        >
          <span className="text-foreground/90">{cap}</span>
          <span className="text-center"><Mark val={ilum} /></span>
          <span className="text-center"><Mark val={ton} /></span>
          <span className="text-right text-muted-foreground font-mono text-xs">{eth}</span>
        </div>
      ))}
    </div>
  </Section>
);

const Mark = ({ val }: { val: boolean | "partial" }) => {
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
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive/80">
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
};

export default Comparison;
