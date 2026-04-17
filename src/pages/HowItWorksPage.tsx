import SiteLayout from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";

import CallToAction from "@/components/site/CallToAction";

const steps = [
  {
    n: "01",
    title: "Connect your wallet",
    body: "TonConnect handles auth. Non-custodial — we never touch your keys, never store private data, never charge a sign-up.",
  },
  {
    n: "02",
    title: "We pull your live positions",
    body: "STON.fi's lp_positions API returns every active LP you hold. We parse them, find the deposit blocks on-chain, and compute your true entry price.",
  },
  {
    n: "03",
    title: "Exact IL — no approximations",
    body: "Standard CPMM formula applied to real on-chain price ratios. Deposit price comes from the historical pool chart at your exact deposit block.",
  },
  {
    n: "04",
    title: "Fees are netted in",
    body: "STON.fi's fee_accruals API gives us actual claimable fees per position. Net return = fees − IL. The number you should have always been seeing.",
  },
  {
    n: "05",
    title: "Alerts fire at thresholds",
    body: "Set a tolerance — say 5% net loss vs hold. The moment your position crosses it, you get notified. No more checking dashboards every few days.",
  },
  {
    n: "06",
    title: "Rebalance in one click",
    body: "Omniston finds the best route across every TON DEX. STON.fi DEX SDK builds and sends the swap. You stay in the app the whole time.",
  },
];

const HowItWorksPage = () => (
  <SiteLayout>
    <Section
      eyebrow="How it works"
      title={<>From wallet connect to one-click rebalance, <em className="italic text-primary/90">end to end.</em></>}
      description="Six steps. No estimates, no shortcuts, no friction."
    />

    <div className="container">
      <div className="mx-auto max-w-4xl">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="group relative grid grid-cols-[auto_1fr] gap-8 py-10 border-t border-border/60 first:border-t-0"
          >
            <div className="flex flex-col items-center">
              <span className="font-serif-display text-3xl text-primary">{s.n}</span>
              {i < steps.length - 1 && (
                <span className="mt-4 h-full w-px bg-gradient-to-b from-primary/40 to-transparent" />
              )}
            </div>
            <div>
              <h3 className="font-serif-display text-3xl md:text-4xl">{s.title}</h3>
              <p className="mt-3 text-[15px] md:text-base text-muted-foreground leading-relaxed max-w-2xl">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <CallToAction />
  </SiteLayout>
);

export default HowItWorksPage;
