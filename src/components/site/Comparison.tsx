import { Section } from "./Section";
import { Check } from "lucide-react";

type Cell = "live" | "soon";

const rows: Array<[string, string, Cell]> = [
  ["Wallet connect", "TonConnect session and wallet identity", "live"],
  ["Live LP positions", "STON.fi wallet pools are loaded in app", "live"],
  ["Portfolio value and APY", "Calculated from live pool and token data where available", "live"],
  ["Impermanent loss attribution", "Historical entry snapshots still in progress", "soon"],
  ["Fees attribution", "Realized fee attribution still in progress", "soon"],
  ["Net vs hold score", "Depends on IL and fee attribution rollout", "soon"],
  ["Smart alerts", "UI is present, live firing logic is pending", "soon"],
  ["Rebalance actions", "Module is present, live routing output is pending", "soon"],
];

export const Comparison = () => (
  <Section
    eyebrow="Product Status"
    title={<>What you can use now. <em className="italic text-primary/90">What ships next.</em></>}
    description="This is the current ILuminate build status from the app itself."
  >
    <div className="mt-12 md:hidden space-y-3">
      {rows.map(([capability, detail, status]) => (
        <article key={capability} className="rounded-2xl border border-border/60 glass-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium text-foreground/90">{capability}</h3>
            <Mark val={status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
        </article>
      ))}
    </div>

    <div className="hidden md:block mt-14 mx-auto max-w-5xl overflow-x-auto rounded-2xl border border-border/60 glass-card">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[1.3fr_2fr_0.6fr] text-xs uppercase tracking-[0.18em] text-muted-foreground/80 border-b border-border/60 px-6 py-4 bg-secondary/30">
          <span>Capability</span>
          <span>Current status</span>
          <span className="text-right text-primary">State</span>
        </div>
        {rows.map(([capability, detail, status], i) => (
          <div
            key={capability}
            className={`grid grid-cols-[1.3fr_2fr_0.6fr] items-center px-6 py-4 text-sm gap-4 ${i % 2 ? "bg-background/30" : ""}`}
          >
            <span className="text-foreground/90">{capability}</span>
            <span className="text-muted-foreground text-[13px]">{detail}</span>
            <span className="flex justify-end">
              <Mark val={status} />
            </span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const Mark = ({ val }: { val: Cell }) => {
  if (val === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-mono text-success">
        <Check className="h-3.5 w-3.5" />
        Live
      </span>
    );
  }
  return <span className="text-xs font-mono text-muted-foreground">Coming soon</span>;
};

export default Comparison;
