import { Section } from "./Section";
import { LayoutDashboard, LineChart, Target, BellRing } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Live wallet dashboard",
    body: "Live now: connect with TonConnect and load active STON.fi LP positions, current value, and APY where the API returns it.",
    span: "md:col-span-2",
  },
  {
    icon: LineChart,
    title: "IL and fees attribution",
    body: "Coming soon: position level impermanent loss and fee attribution after historical entry snapshots are fully wired.",
    span: "md:col-span-1",
  },
  {
    icon: Target,
    title: "Net vs hold score",
    body: "Coming soon: a single net score that combines value, IL, and fees against hold.",
    span: "md:col-span-1",
  },
  {
    icon: BellRing,
    title: "Alerts and rebalance actions",
    body: "Coming soon: trigger alerts from wallet conditions and route rebalance actions directly from recommendations.",
    span: "md:col-span-2",
  },
];

export const Features = () => (
  <Section
    eyebrow="The Product · V1"
    title={<>Four features. <em className="italic text-primary/90">One outcome.</em></>}
    description="Built on top of STON.fi, not instead of it. What is live now is clear, and upcoming modules are labeled as coming soon."
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
