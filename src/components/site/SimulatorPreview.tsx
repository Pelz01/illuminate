import { useState, useMemo } from "react";
import { Section } from "./Section";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const SimulatorPreview = () => {
  const [amount, setAmount] = useState(5000);
  const [pct, setPct] = useState(0); // -80 to +200

  const { il, fees, net } = useMemo(() => {
    const r = 1 + pct / 100;
    const ilPct = (2 * Math.sqrt(r)) / (1 + r) - 1; // negative
    const il = amount * ilPct;
    const fees = amount * 0.18 * (90 / 365); // 18% APY 90d
    const net = il + fees;
    return { il, fees, net };
  }, [amount, pct]);

  const fmt = (n: number) =>
    `${n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <Section
      eyebrow="IL Simulator"
      title={<>Model the outcome <em className="italic text-primary/90">before</em> you commit.</>}
      description="Pick a pool, set an amount, slide the price. See the exact impermanent loss, projected fees, and final P&L — instantly."
    >
      <div className="mt-16 mx-auto max-w-5xl">
        <div className="relative">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-accent/30 opacity-70 blur" />
          <div className="relative glass-card rounded-3xl p-6 md:p-10">
            <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
              {/* Controls */}
              <div className="space-y-8">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pool</label>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-amber border-2 border-card" />
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-primary-deep border-2 border-card" />
                      </div>
                      <span className="font-medium">TON / USDT</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">18.4% APY</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Deposit</label>
                    <span className="font-mono text-sm">${amount.toLocaleString()}</span>
                  </div>
                  <Slider
                    className="mt-4"
                    min={500}
                    max={50000}
                    step={500}
                    value={[amount]}
                    onValueChange={(v) => setAmount(v[0])}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Price change</label>
                    <span className={`font-mono text-sm ${pct >= 0 ? "text-success" : "text-destructive"}`}>
                      {pct > 0 ? "+" : ""}{pct}%
                    </span>
                  </div>
                  <Slider
                    className="mt-4"
                    min={-80}
                    max={200}
                    step={1}
                    value={[pct]}
                    onValueChange={(v) => setPct(v[0])}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground/60">
                    <span>−80%</span><span>0</span><span>+200%</span>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="rounded-2xl border border-border/60 bg-background/40 p-6 md:p-8">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Projected outcome · 90 days</div>

                <Row label="Impermanent loss" value={fmt(il)} tone="bad" />
                <Row label="Fees earned (est.)" value={fmt(fees)} tone="good" />
                <div className="my-5 hairline" />
                <div className="flex items-end justify-between">
                  <span className="text-sm text-muted-foreground">Net P&L</span>
                  <span className={`font-serif-display text-4xl ${net >= 0 ? "text-success" : "text-destructive"}`}>
                    {fmt(net)}
                  </span>
                </div>

                <Button variant="luminous" className="mt-8 w-full" asChild>
                  <Link to="/simulator">
                    Open full simulator <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const Row = ({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" }) => (
  <div className="mt-4 flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`font-mono text-base ${tone === "good" ? "text-success" : "text-destructive"}`}>{value}</span>
  </div>
);

export default SimulatorPreview;
