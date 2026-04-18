import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, Route } from "lucide-react";
import { useTonWalletSession } from "@/hooks/use-ton-wallet-session";
import { useStonWalletPositions } from "@/hooks/use-ston-wallet-positions";

const RebalancePage = () => {
  const { connected, address, connect } = useTonWalletSession();
  const { data: positions = [], isLoading } = useStonWalletPositions(address);

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
