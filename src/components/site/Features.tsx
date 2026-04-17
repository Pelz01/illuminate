import { Section } from "./Section";
import { LayoutDashboard, LineChart, Target, BellRing, Repeat } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Position dashboard",
    body: "Every active LP position from your wallet, surfaced in one continuous view. Live values, live fees, live IL.",
    span: "md:col-span-2",
  },
  {
    icon: LineChart,
    title: "Hold vs LP chart",
    body: "Compare what your position is doing now against what it would be doing if you'd just held the tokens.",
    span: "md:col-span-1",
  },
  {
    icon: Target,
    title: "Net return score",
    body: "One honest number per position. Fees minus IL minus opportunity cost. No spin.",
    span: "md:col-span-1",
  },
  {
    icon: BellRing,
    title: "Smart exit alerts",
    body: "Get notified the moment your IL crosses a threshold worth acting on — not after.",
    span: "md:col-span-1",
  },
  {
    icon: Repeat,
    title: "One-click rebalance",
    body: "Routed through Omniston for best execution across every TON DEX. Stay in the app.",
    span: "md:col-span-1",
  },
];

export const Features = () => (
  <Section
    eyebrow="The Product"
    title={<>Five features. <em className="italic text-primary/90">One outcome.</em></>}
    description="Move from 'I have no idea how my LP positions are doing' to full clarity — and know exactly what to do next."
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
