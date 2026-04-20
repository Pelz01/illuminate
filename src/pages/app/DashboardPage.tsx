import AppLayout from "@/components/app/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTonWalletSession } from "@/hooks/use-ton-wallet-session";
import { useStonWalletPositions } from "@/hooks/use-ston-wallet-positions";

const DashboardPage = () => {
  const { connected, address, connect } = useTonWalletSession();
  const { data: positions = [], isLoading } = useStonWalletPositions(address);

  const positionsWithValue = positions.filter(
    (position) => position.valueUsd !== null
  );
  const totalValue = positionsWithValue.reduce(
    (sum, position) => sum + (position.valueUsd ?? 0),
    0
  );
  const positionsWithNetVsHold = positions.filter(
    (position) => position.netVsHoldUsd !== null
  );
  const totalNetVsHold = positionsWithNetVsHold.reduce(
    (sum, position) => sum + (position.netVsHoldUsd ?? 0),
    0
  );

  const hasPortfolioValue = positionsWithValue.length > 0;
  const hasNetVsHold = positionsWithNetVsHold.length > 0;
  const portfolioSub = !connected
    ? "Connect wallet to load live data"
    : isLoading
    ? "Loading wallet data..."
    : `${positions.length} active position${positions.length === 1 ? "" : "s"}`;
  const ilSub = !connected
    ? "Connect wallet to load live data"
    : isLoading
    ? "Loading wallet data..."
    : "Not available in live API yet";
  const feesSub = !connected
    ? "Connect wallet to load live data"
    : isLoading
    ? "Loading wallet data..."
    : "Not available in live API yet";
  const netSub = !connected
    ? "Connect wallet to load live data"
    : isLoading
    ? "Loading wallet data..."
    : hasNetVsHold
      ? "From recent add/withdraw history"
      : "Need more liquidity history";

  const dashboardPositions = [...positions].sort((a, b) => {
    const aValue = a.valueUsd ?? -1;
    const bValue = b.valueUsd ?? -1;
    return bValue - aValue;
  });

  return (
    <AppLayout
      title="Welcome back"
      subtitle="Live STON.fi wallet pools from on-chain API endpoints."
    >
      {!connected && (
        <div className="glass-card rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-serif-display text-2xl">Connect wallet</div>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your TON wallet to load live STON.fi liquidity positions.
            </p>
          </div>
          <Button variant="luminous" onClick={connect}>
            Connect wallet
          </Button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPI
          label="Portfolio value"
          value={hasPortfolioValue ? fmt(totalValue) : "Unavailable"}
          sub={portfolioSub}
          tone="neutral"
        />
        <KPI
          label="Impermanent loss"
          value="Unavailable"
          sub={ilSub}
          tone="neutral"
        />
        <KPI
          label="Fees earned"
          value="Unavailable"
          sub={feesSub}
          tone="neutral"
        />
        <KPI
          label="Net return"
          value={hasNetVsHold ? fmt(totalNetVsHold) : "Unavailable"}
          sub={netSub}
          tone={
            hasNetVsHold
              ? totalNetVsHold >= 0
                ? "good"
                : "bad"
              : "neutral"
          }
          highlight
        />
      </div>

      {/* Live status */}
      <div className="mt-8">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Live data status
            </div>
            <div className="mt-1 font-serif-display text-2xl">
              {isLoading
                ? "Loading STON.fi wallet positions..."
                : connected
                ? "Wallet positions loaded"
                : "Connect wallet to start live position tracking"}
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Unavailable metrics
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Hold vs LP chart needs historical snapshots.</li>
              <li>IL and fees attribution are not live yet.</li>
              <li>Net vs hold uses recent add/withdraw history.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary/90 font-mono">
              Active positions
            </div>
            <h2 className="mt-2 font-serif-display text-3xl">Live from STON.fi</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/positions">
              All positions <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/60 glass-card">
          <div className="min-w-[980px]">
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] px-6 py-3 border-b border-border/60 bg-secondary/30 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Pool</span>
              <span className="text-right">Value</span>
              <span className="text-right">IL</span>
              <span className="text-right">Fees</span>
              <span className="text-right">Net</span>
              <span className="w-24 text-right">Status</span>
            </div>

            {isLoading && (
              <div className="px-6 py-5 text-sm text-muted-foreground">
                Loading wallet positions...
              </div>
            )}

            {!isLoading && connected && dashboardPositions.length === 0 && (
              <div className="px-6 py-5 text-sm text-muted-foreground">
                No STON.fi liquidity positions found for this wallet.
              </div>
            )}

            {!isLoading &&
              dashboardPositions.map((position) => (
                <PositionRow key={position.poolAddress} position={position} />
              ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const fmt = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const KPI = ({
  label,
  value,
  sub,
  tone,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "good" | "bad" | "neutral";
  highlight?: boolean;
}) => (
  <div
    className={`relative rounded-2xl p-6 ${
      highlight ? "glass-card border border-primary/30" : "glass-card"
    }`}
  >
    {highlight && (
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/30 to-transparent opacity-50 blur -z-10" />
    )}
    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      {label}
    </div>
    <div
      className={`mt-2 font-serif-display text-3xl ${
        tone === "good"
          ? "text-success"
          : tone === "bad"
          ? "text-destructive"
          : "text-foreground"
      }`}
    >
      {value}
    </div>
    <div className="mt-1 min-h-10 text-xs font-mono leading-relaxed text-muted-foreground/80 whitespace-normal break-words">
      {sub}
    </div>
  </div>
);

const PositionRow = ({
  position,
}: {
  position: {
    pair: string;
    valueUsd: number | null;
    apyPct: number | null;
    netVsHoldUsd: number | null;
    deprecated: boolean;
  };
}) => {
  const status = position.deprecated ? "exit" : "live";
  const statusMap = {
    live: { label: "Live", cls: "bg-success/10 text-success border-success/30" },
    watch: { label: "Watch", cls: "bg-primary/10 text-primary border-primary/30" },
    exit: {
      label: "Deprecated",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
    },
  } as const;
  const s = statusMap[status];

  return (
    <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-0 items-center px-6 py-5 border-t border-border/60 first:border-t-0 hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-amber border-2 border-card" />
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary-deep border-2 border-card" />
        </div>
        <div>
          <div className="font-medium">{position.pair}</div>
          <div className="text-xs font-mono text-muted-foreground">
            {position.apyPct === null ? "APY unavailable" : `${position.apyPct.toFixed(2)}% APY`}
          </div>
        </div>
      </div>
      <div className="md:text-right font-mono">
        {position.valueUsd === null ? "Unavailable" : fmt(position.valueUsd)}
      </div>
      <div className="md:text-right">
        <div className="font-mono text-muted-foreground">Unavailable</div>
        <div className="text-[11px] font-mono text-muted-foreground">Requires attribution</div>
      </div>
      <div className="md:text-right font-mono text-muted-foreground">Unavailable</div>
      <div className="md:text-right font-mono text-muted-foreground">
        {position.netVsHoldUsd === null ? "Unavailable" : fmt(position.netVsHoldUsd)}
      </div>
      <div className="md:text-right">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-mono ${s.cls}`}
        >
          {s.label}
        </span>
      </div>
    </div>
  );
};

export default DashboardPage;
