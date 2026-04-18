import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTonWalletSession } from "@/hooks/use-ton-wallet-session";
import { useStonWalletPositions } from "@/hooks/use-ston-wallet-positions";

const fmt = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const PositionsPage = () => {
  const { connected, address, connect } = useTonWalletSession();
  const { data: positions = [], isLoading } = useStonWalletPositions(address);

  return (
    <AppLayout
      title="Positions"
      subtitle="Wallet LP positions from /v1/wallets/{address}/pools with net-vs-hold attribution from /v1/wallets/{address}/operations."
    >
      {!connected && (
        <div className="glass-card rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-serif-display text-2xl">Connect wallet</div>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your TON wallet to load live STON.fi positions.
            </p>
          </div>
          <Button variant="luminous" onClick={connect}>
            Connect wallet
          </Button>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {["All", "Live", "Deprecated"].map((t, i) => (
            <button
              key={t}
              className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                i === 0
                  ? "bg-secondary/70 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button variant="luminous" size="sm" disabled>
          <Plus className="h-4 w-4" /> Add liquidity
        </Button>
      </div>

      {isLoading && (
        <div className="glass-card rounded-2xl p-6 text-sm text-muted-foreground">
          Loading wallet positions...
        </div>
      )}

      {!isLoading && connected && positions.length === 0 && (
        <div className="glass-card rounded-2xl p-6 text-sm text-muted-foreground">
          No STON.fi liquidity positions found for this wallet.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {positions.map((position) => (
          <article
            key={position.poolAddress}
            className="group glass-card rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full bg-gradient-amber border-2 border-card" />
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary-deep border-2 border-card" />
                </div>
                <div>
                  <div className="font-serif-display text-xl">{position.pair}</div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {position.apyPct === null
                      ? "APY unavailable"
                      : `${position.apyPct.toFixed(2)}% APY`}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {position.deprecated ? "Deprecated" : "Live"}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
              <Metric
                label="Hold baseline"
                value={
                  position.holdValueUsd === null
                    ? "Unavailable"
                    : fmt(position.holdValueUsd)
                }
              />
              <Metric
                label="Current value"
                value={
                  position.valueUsd === null ? "Unavailable" : fmt(position.valueUsd)
                }
              />
              <Metric label="Impermanent loss" value="Unavailable" tone="bad" />
              <Metric label="Fees earned" value="Unavailable" tone="good" />
            </div>

            <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Net vs hold
                  </div>
                  <div
                    className={`mt-1 font-serif-display text-2xl ${
                      position.netVsHoldUsd === null
                        ? "text-muted-foreground"
                        : position.netVsHoldUsd >= 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {position.netVsHoldUsd === null
                      ? "Unavailable"
                      : fmt(position.netVsHoldUsd)}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-muted-foreground">
                    {position.attributionOpsCount > 0
                      ? `${position.attributionOpsCount} liquidity operation${
                          position.attributionOpsCount === 1 ? "" : "s"
                        } attributed`
                      : "No attributable add/withdraw operations found"}
                  </div>
                </div>
                <Button variant="glass" size="sm" disabled>
                  Rebalance
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppLayout>
  );
};

const Metric = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </div>
    <div
      className={`mt-1 font-mono text-sm ${
        tone === "good"
          ? "text-success"
          : tone === "bad"
          ? "text-destructive"
          : "text-foreground"
      }`}
    >
      {value}
    </div>
  </div>
);

export default PositionsPage;
