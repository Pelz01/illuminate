import SiteLayout from "@/components/site/SiteLayout";
import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { Input } from "@/components/ui/input";

const pools = [
  { name: "TON / USDT", apy: 18.4 },
  { name: "TON / NOT", apy: 42.1 },
  { name: "TON / STON", apy: 27.6 },
  { name: "USDT / DOGS", apy: 64.0 },
];

const SimulatorPage = () => {
  const [pool, setPool] = useState(pools[0]);
  const [amount, setAmount] = useState(10000);
  const [pct, setPct] = useState(0);
  const [days, setDays] = useState(90);

  const { il, ilPct, fees, net } = useMemo(() => {
    const r = 1 + pct / 100;
    const ilPct = (2 * Math.sqrt(r)) / (1 + r) - 1;
    const il = amount * ilPct;
    const fees = amount * (pool.apy / 100) * (days / 365);
    return { il, ilPct, fees, net: il + fees };
  }, [amount, pct, pool, days]);

  const fmt = (n: number) =>
    `${n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <SiteLayout>
      <Section
        eyebrow="IL Simulator"
        title={<>Model any STON.fi position <em className="italic text-primary/90">in seconds.</em></>}
        description="No DeFi knowledge required. Designed for someone who's never heard of impermanent loss — and for someone who has."
      />

      <div className="container -mt-10 pb-12">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Inputs */}
          <div className="glass-card rounded-3xl p-8 space-y-8">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Select pool</label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {pools.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPool(p)}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      pool.name === p.name
                        ? "border-primary/60 bg-primary/10 shadow-glow-sm"
                        : "border-border/60 bg-background/40 hover:border-border"
                    }`}
                  >
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs font-mono text-muted-foreground mt-0.5">{p.apy}% APY</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Deposit amount</label>
              <div className="mt-3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="pl-8 h-12 text-lg font-mono bg-background/40"
                />
              </div>
              <Slider className="mt-4" min={500} max={100000} step={500} value={[amount]} onValueChange={(v) => setAmount(v[0])} />
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Price change</label>
                <span className={`font-mono text-sm ${pct >= 0 ? "text-success" : "text-destructive"}`}>{pct > 0 ? "+" : ""}{pct}%</span>
              </div>
              <Slider className="mt-4" min={-90} max={300} step={1} value={[pct]} onValueChange={(v) => setPct(v[0])} />
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Time horizon</label>
                <span className="font-mono text-sm">{days} days</span>
              </div>
              <Slider className="mt-4" min={7} max={365} step={1} value={[days]} onValueChange={(v) => setDays(v[0])} />
            </div>
          </div>

          {/* Output */}
          <div className="relative">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-accent/30 opacity-70 blur" />
            <div className="relative glass-card rounded-3xl p-8 md:p-10 h-full flex flex-col">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Projected outcome</div>
              <div className="mt-2 text-sm text-muted-foreground/80">
                {pool.name} · ${amount.toLocaleString()} · {days}d · price {pct > 0 ? "+" : ""}{pct}%
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <Metric label="Impermanent loss" value={fmt(il)} sub={`${(ilPct * 100).toFixed(2)}%`} tone="bad" />
                <Metric label="Fees earned" value={fmt(fees)} sub={`${pool.apy}% APY`} tone="good" />
              </div>

              <div className="mt-8 rounded-2xl border border-border/60 bg-background/40 p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Net P&L</div>
                <div className={`mt-2 font-serif-display text-5xl md:text-6xl ${net >= 0 ? "text-gradient-amber" : "text-destructive"}`}>
                  {fmt(net)}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {net >= 0 ? "Position outperforms holding." : "Holding would have outperformed this position."}
                </div>
              </div>

              <Button variant="luminous" size="lg" className="mt-auto pt-3 mt-8">Open position on STON.fi</Button>
            </div>
          </div>
        </div>

        <p className="mt-8 mx-auto max-w-3xl text-center text-xs text-muted-foreground font-mono">
          IL = 2√r / (1 + r) − 1, where r = current / deposit price ratio. Standard CPMM formula.
        </p>
      </div>
    </SiteLayout>
  );
};

const Metric = ({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "good" | "bad" }) => (
  <div className="rounded-xl border border-border/60 bg-background/40 p-5">
    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    <div className={`mt-2 font-serif-display text-2xl ${tone === "good" ? "text-success" : "text-destructive"}`}>{value}</div>
    <div className="mt-1 text-xs font-mono text-muted-foreground">{sub}</div>
  </div>
);

export default SimulatorPage;
