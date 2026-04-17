import { Section } from "./Section";

const integrations = [
  { api: "STON.fi REST /v1/pools", powers: "Live pool prices and APY for every position and the simulator" },
  { api: "STON.fi REST /v1/wallets/{address}/lp_positions", powers: "Active LP positions on wallet connect" },
  { api: "STON.fi REST /v1/stats/fee_accruals", powers: "Real fees earned per position for net return" },
  { api: "Omniston SDK (React + WebSocket)", powers: "Best-route discovery across every TON DEX" },
  { api: "STON.fi DEX SDK · buildSwapTransaction", powers: "Building and sending the rebalance on-chain" },
  { api: "TonConnect UI", powers: "Non-custodial wallet connection — no sign-up, no custody" },
];

export const Integrations = () => (
  <Section
    eyebrow="Technical"
    title={<>Built directly on STON.fi <em className="italic text-primary/90">production rails.</em></>}
    description="No estimates, no synthetic data. Every figure is computed from on-chain history and live API responses."
  >
    <div className="mt-14 mx-auto max-w-4xl space-y-px rounded-2xl overflow-hidden border border-border/60 bg-border/40">
      {integrations.map(({ api, powers }) => (
        <div key={api} className="grid gap-2 md:grid-cols-[1.1fr_1.4fr] bg-card/50 px-6 py-5 transition-colors hover:bg-card">
          <code className="text-sm text-primary/90 font-mono">{api}</code>
          <span className="text-sm text-muted-foreground">{powers}</span>
        </div>
      ))}
    </div>
  </Section>
);

export default Integrations;
