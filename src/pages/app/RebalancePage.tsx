import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowDown, Zap, ShieldCheck, Route } from "lucide-react";

const RebalancePage = () => (
  <AppLayout
    title="Rebalance"
    subtitle="Best-route execution across every TON DEX via Omniston. STON.fi DEX SDK builds and sends the swap. You stay in the app."
  >
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Swap card */}
      <div className="relative">
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-accent/30 opacity-60 blur" />
        <div className="relative glass-card rounded-3xl p-6 md:p-8">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90 font-mono">Suggested rebalance</div>
          <h2 className="mt-2 font-serif-display text-3xl">Exit USDT / DOGS → TON / USDT</h2>

          <div className="mt-8 space-y-3">
            <SwapBlock label="From" pair="USDT / DOGS" amount="$3,210.60" sub="Net loss −7.1%" tone="bad" />
            <div className="flex justify-center -my-2 relative z-10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full glass-card">
                <ArrowDown className="h-4 w-4 text-primary" />
              </span>
            </div>
            <SwapBlock label="To" pair="TON / USDT" amount="$3,210.60" sub="18.4% APY · healthy" tone="good" />
          </div>

          <div className="mt-8 rounded-2xl border border-border/60 bg-background/40 p-5 space-y-3 text-sm">
            <Row label="Best route via" value="Omniston · STON.fi → DeDust" />
            <Row label="Estimated price impact" value="0.12%" />
            <Row label="Network fee" value="≈ 0.18 TON" />
            <Row label="30-day projected upside" value="+$412" valueClass="text-success" />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="luminous" size="lg" className="flex-1">
              <Zap className="h-4 w-4" /> Execute rebalance
            </Button>
            <Button variant="glass" size="lg">Customize route</Button>
          </div>
        </div>
      </div>

      {/* Side info */}
      <div className="space-y-4">
        <Info icon={Route} title="Best route discovery" body="Omniston SDK queries every TON DEX in real time and returns the optimal multi-hop path. WebSocket keeps quotes fresh." />
        <Info icon={ShieldCheck} title="Non-custodial execution" body="The transaction is built locally with STON.fi DEX SDK and signed in your wallet. We never touch your funds." />
        <Info icon={Zap} title="One signature, end-to-end" body="Withdraw, swap, redeposit — bundled. No bouncing between apps, no manual route hunting." />
      </div>
    </div>
  </AppLayout>
);

const SwapBlock = ({ label, pair, amount, sub, tone }: { label: string; pair: string; amount: string; sub: string; tone: "good" | "bad" }) => (
  <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">{label}</span>
      <span className={`text-xs font-mono ${tone === "good" ? "text-success" : "text-destructive"}`}>{sub}</span>
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="h-9 w-9 rounded-full bg-gradient-amber border-2 border-card" />
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary-deep border-2 border-card" />
        </div>
        <span className="font-medium">{pair}</span>
      </div>
      <span className="font-serif-display text-2xl">{amount}</span>
    </div>
  </div>
);

const Row = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-mono ${valueClass ?? ""}`}>{value}</span>
  </div>
);

const Info = ({ icon: Icon, title, body }: { icon: typeof Zap; title: string; body: string }) => (
  <div className="glass-card rounded-2xl p-6">
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-amber text-primary-foreground shadow-glow-sm">
      <Icon className="h-4 w-4" />
    </span>
    <h3 className="mt-4 font-serif-display text-xl">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

export default RebalancePage;
