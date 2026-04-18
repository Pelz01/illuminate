import { Section } from "./Section";
import { LayoutDashboard, LineChart, Target, BellRing } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Position dashboard",
    body: "Connect via TonConnect. Every active STON.fi LP position loads from the live API — token pair, deposited value, current value, IL %. One screen, everything.",
    span: "md:col-span-2",
  },
  {
    icon: LineChart,
    title: "Hold vs LP chart",
    body: "Two lines: your live LP value vs what your tokens would be worth if you'd just held. The gap is your impermanent loss, made visible — sourced from on-chain deposit timestamp + STON.fi pool price history.",
    span: "md:col-span-1",
  },
  {
    icon: Target,
    title: "Net return score",
    body: "IL alone is half the picture. We pull real fees from STON.fi's fee accruals API and net them against IL. Not '12% IL' — but 'after fees, you're up $35 or down $8'.",
    span: "md:col-span-1",
  },
  {
    icon: BellRing,
    title: "Smart exit alert + one-click rebalance",
    body: "When IL begins to exceed fees earned, the position gets flagged. Trigger a rebalance — Omniston finds the best route across every TON DEX, STON.fi DEX SDK builds the swap. One wallet approval. Done.",
    span: "md:col-span-2",
  },
];

export const Features = () => (
  <Section
    eyebrow="The Product · V1"
    title={<>Four features. <em className="italic text-primary/90">One outcome.</em></>}
    description="Built on top of STON.fi, not instead of it. Real data only — every metric is sourced from live STON.fi APIs or on-chain history. No mock data, no estimates."
  >
    <div className="mt-16 grid gap-4 md:grid-cols-3 md:auto-rows-fr">
      {features.map(({ icon: Icon, title, body, span }, i) => (
        <article
          key={title}
          className={`group relative overflow-hidden rounded-2xl glass-card p-7 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant ${span}`}
        >
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-amber text-primary-foreground shadow-glow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs text-muted-foreground/60">0{i + 1}</span>
            </div>
            <h3 className="mt-6 font-serif-display text-2xl md:text-3xl">{title}</h3>
            <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{body}</p>
          </div>
        </article>
      ))}
    </div>
  </Section>
);

export default Features;
