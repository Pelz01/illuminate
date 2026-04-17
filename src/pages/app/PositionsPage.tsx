import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";

const positions = [
  { pair: "TON / USDT", deposit: 12000, value: 12847.2, il: -386.5, ilPct: -3.0, fees: 1204.8, apy: 18.4, days: 124 },
  { pair: "TON / NOT", deposit: 5000, value: 6420.0, il: -812.4, ilPct: -12.6, fees: 980.1, apy: 42.1, days: 87 },
  { pair: "USDT / DOGS", deposit: 3000, value: 3210.6, il: -640.2, ilPct: -19.9, fees: 412.0, apy: 64.0, days: 41 },
];

const fmt = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const PositionsPage = () => (
  <AppLayout
    title="Positions"
    subtitle="Every LP position from your wallet — pulled live from STON.fi /v1/wallets/{address}/lp_positions."
  >
    <div className="mb-6 flex items-center justify-between">
      <div className="flex gap-2">
        {["All", "Healthy", "Watch", "Exit"].map((t, i) => (
          <button
            key={t}
            className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              i === 0 ? "bg-secondary/70 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <Button variant="luminous" size="sm">
        <Plus className="h-4 w-4" /> Add liquidity
      </Button>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {positions.map((p) => {
        const net = p.il + p.fees;
        return (
          <article key={p.pair} className="group glass-card rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full bg-gradient-amber border-2 border-card" />
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary-deep border-2 border-card" />
                </div>
                <div>
                  <div className="font-serif-display text-xl">{p.pair}</div>
                  <div className="text-xs font-mono text-muted-foreground">{p.apy}% APY · {p.days}d held</div>
                </div>
              </div>
              <a className="text-muted-foreground hover:text-primary" href="#" aria-label="Open on STON.fi">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
              <Metric label="Deposit" value={fmt(p.deposit)} />
              <Metric label="Current value" value={fmt(p.value)} />
              <Metric label="Impermanent loss" value={`${fmt(p.il)} (${p.ilPct}%)`} tone="bad" />
              <Metric label="Fees earned" value={fmt(p.fees)} tone="good" />
            </div>

            <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Net P&L</div>
                  <div className={`mt-1 font-serif-display text-2xl ${net >= 0 ? "text-success" : "text-destructive"}`}>
                    {fmt(net)}
                  </div>
                </div>
                <Button variant="glass" size="sm">Rebalance</Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </AppLayout>
);

const Metric = ({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    <div className={`mt-1 font-mono text-sm ${tone === "good" ? "text-success" : tone === "bad" ? "text-destructive" : "text-foreground"}`}>
      {value}
    </div>
  </div>
);

export default PositionsPage;
