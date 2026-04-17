import AppLayout from "@/components/app/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, BellRing, Repeat, TrendingUp, TrendingDown } from "lucide-react";

const positions = [
  { pair: "TON / USDT", value: 12847.2, il: -386.5, ilPct: -3.0, fees: 1204.8, net: 818.7, apy: 18.4, status: "outperform" },
  { pair: "TON / NOT", value: 6420.0, il: -812.4, ilPct: -12.6, fees: 980.1, net: 167.7, apy: 42.1, status: "watch" },
  { pair: "USDT / DOGS", value: 3210.6, il: -640.2, ilPct: -19.9, fees: 412.0, net: -228.2, apy: 64.0, status: "exit" },
];

const DashboardPage = () => {
  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalIL = positions.reduce((s, p) => s + p.il, 0);
  const totalFees = positions.reduce((s, p) => s + p.fees, 0);
  const totalNet = totalIL + totalFees;

  return (
    <AppLayout
      title="Welcome back"
      subtitle="Here's the honest picture of every LP position you hold on STON.fi — live, on-chain, no estimates."
    >
      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPI label="Portfolio value" value={fmt(totalValue)} sub="3 active positions" tone="neutral" />
        <KPI label="Impermanent loss" value={fmt(totalIL)} sub={`${((totalIL / totalValue) * 100).toFixed(2)}%`} tone="bad" />
        <KPI label="Fees earned" value={fmt(totalFees)} sub="last 30 days" tone="good" />
        <KPI label="Net return" value={fmt(totalNet)} sub={totalNet >= 0 ? "vs hold +6.4%" : "vs hold −2.1%"} tone={totalNet >= 0 ? "good" : "bad"} highlight />
      </div>

      {/* Hold vs LP chart */}
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hold vs LP · 30 days</div>
              <div className="mt-1 font-serif-display text-2xl">Your LP is outperforming hold by <span className="text-gradient-amber">+6.4%</span></div>
            </div>
            <div className="hidden sm:flex gap-2">
              {["7D", "30D", "90D", "ALL"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                    i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <BigChart />
          <div className="mt-4 flex flex-wrap gap-6 text-xs">
            <Legend color="hsl(var(--primary))" label="LP position" />
            <Legend color="hsl(var(--muted-foreground))" label="Hold scenario" dashed />
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <ActionCard
            icon={BellRing}
            title="2 alerts active"
            body="USDT / DOGS just crossed your 15% net loss threshold."
            cta="Review alerts"
            to="/app/alerts"
          />
          <ActionCard
            icon={Repeat}
            title="Suggested rebalance"
            body="Exit USDT / DOGS, redeploy into TON / USDT. +$412 projected over 30d."
            cta="Open rebalance"
            to="/app/rebalance"
            highlight
          />
        </div>
      </div>

      {/* Positions */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary/90 font-mono">Active positions</div>
            <h2 className="mt-2 font-serif-display text-3xl">Live from STON.fi</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/positions">All positions <ArrowRight /></Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 glass-card">
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] px-6 py-3 border-b border-border/60 bg-secondary/30 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>Pool</span>
            <span className="text-right">Value</span>
            <span className="text-right">IL</span>
            <span className="text-right">Fees</span>
            <span className="text-right">Net</span>
            <span className="w-24 text-right">Status</span>
          </div>
          {positions.map((p) => (
            <PositionRow key={p.pair} {...p} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

const fmt = (n: number) =>
  `${n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const KPI = ({ label, value, sub, tone, highlight }: { label: string; value: string; sub: string; tone: "good" | "bad" | "neutral"; highlight?: boolean }) => (
  <div className={`relative rounded-2xl p-6 ${highlight ? "glass-card border border-primary/30" : "glass-card"}`}>
    {highlight && <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/30 to-transparent opacity-50 blur -z-10" />}
    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    <div className={`mt-2 font-serif-display text-3xl ${tone === "good" ? "text-success" : tone === "bad" ? "text-destructive" : "text-foreground"}`}>
      {value}
    </div>
    <div className="mt-1 text-xs font-mono text-muted-foreground/80">{sub}</div>
  </div>
);

const Legend = ({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    <span
      className="h-0.5 w-6"
      style={{ background: dashed ? `repeating-linear-gradient(90deg, ${color}, ${color} 3px, transparent 3px, transparent 6px)` : color }}
    />
    {label}
  </div>
);

const ActionCard = ({ icon: Icon, title, body, cta, to, highlight }: { icon: typeof BellRing; title: string; body: string; cta: string; to: string; highlight?: boolean }) => (
  <Link
    to={to}
    className={`group block rounded-2xl p-6 transition-all hover:-translate-y-0.5 ${highlight ? "glass-card border border-primary/30" : "glass-card"}`}
  >
    <div className="flex items-center gap-3">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${highlight ? "bg-gradient-amber text-primary-foreground shadow-glow-sm" : "bg-secondary/60 text-foreground"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-serif-display text-xl">{title}</span>
      <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </div>
    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
    <span className="mt-4 inline-block text-xs font-mono uppercase tracking-[0.2em] text-primary/90">{cta} →</span>
  </Link>
);

const PositionRow = ({ pair, value, il, ilPct, fees, net, apy, status }: typeof positions[number]) => {
  const statusMap = {
    outperform: { label: "Healthy", cls: "bg-success/10 text-success border-success/30" },
    watch: { label: "Watch", cls: "bg-primary/10 text-primary border-primary/30" },
    exit: { label: "Consider exit", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  } as const;
  const s = statusMap[status as keyof typeof statusMap];
  return (
    <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-0 items-center px-6 py-5 border-t border-border/60 first:border-t-0 hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-amber border-2 border-card" />
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary-deep border-2 border-card" />
        </div>
        <div>
          <div className="font-medium">{pair}</div>
          <div className="text-xs font-mono text-muted-foreground">{apy}% APY</div>
        </div>
      </div>
      <div className="md:text-right font-mono">{fmt(value)}</div>
      <div className="md:text-right">
        <div className="font-mono text-destructive">{fmt(il)}</div>
        <div className="text-[11px] font-mono text-muted-foreground">{ilPct}%</div>
      </div>
      <div className="md:text-right font-mono text-success">{fmt(fees)}</div>
      <div className="md:text-right">
        <span className={`inline-flex items-center gap-1 font-mono ${net >= 0 ? "text-success" : "text-destructive"}`}>
          {net >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {fmt(net)}
        </span>
      </div>
      <div className="md:text-right">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-mono ${s.cls}`}>{s.label}</span>
      </div>
    </div>
  );
};

const BigChart = () => (
  <svg viewBox="0 0 800 240" className="mt-6 w-full h-56">
    <defs>
      <linearGradient id="lpFillBig" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(38 95% 60%)" stopOpacity="0.35" />
        <stop offset="100%" stopColor="hsl(38 95% 60%)" stopOpacity="0" />
      </linearGradient>
    </defs>
    {[40, 90, 140, 190].map((y) => (
      <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.4" />
    ))}
    <path
      d="M0,180 C80,170 140,150 220,140 C300,130 360,100 440,90 C520,80 580,70 660,55 C720,45 770,38 800,32 L800,240 L0,240 Z"
      fill="url(#lpFillBig)"
    />
    <path
      d="M0,180 C80,170 140,150 220,140 C300,130 360,100 440,90 C520,80 580,70 660,55 C720,45 770,38 800,32"
      stroke="hsl(38 95% 60%)"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M0,185 C100,178 200,168 300,158 C400,148 500,140 600,130 C680,122 760,118 800,115"
      stroke="hsl(40 12% 62%)"
      strokeWidth="1.5"
      strokeDasharray="5 5"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

export default DashboardPage;
