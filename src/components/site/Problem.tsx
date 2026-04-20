import { Section } from "./Section";
import { EyeOff, TrendingDown, BellOff, ArrowRightLeft } from "lucide-react";

const problems = [
  {
    icon: EyeOff,
    title: "Losses build up invisibly",
    body: "Impermanent loss accumulates every time the price ratio shifts. No dashboard, no notification, no running total. By the time you check, it's irreversible.",
  },
  {
    icon: TrendingDown,
    title: "APY isn't the full picture",
    body: "Every pool shows an APY. None of them tell you whether it's actually beating what you'd earn by simply holding. For many positions, the honest answer is: no.",
  },
  {
    icon: BellOff,
    title: "No early warning system",
    body: "Wallet level LP alerts are still missing for most users on TON. Teams still need faster warnings before losses compound.",
  },
  {
    icon: ArrowRightLeft,
    title: "Acting requires leaving",
    body: "Even when you spot a problem, you still jump across tools, compare routes manually, and execute multiple steps. Friction wins.",
  },
];

export const Problem = () => (
  <Section
    eyebrow="The Problem"
    title={<>Liquidity providers on TON <em className="italic text-primary/90">are flying blind.</em></>}
    description="Here is what providing liquidity on STON.fi looks like today, and why most providers only discover losses when they withdraw."
  >
    <div className="mt-16 grid gap-px rounded-2xl overflow-hidden border border-border/60 md:grid-cols-2 bg-border/40">
      {problems.map(({ icon: Icon, title, body }) => (
        <div key={title} className="group relative bg-card/40 p-8 md:p-10 transition-colors hover:bg-card/70">
          <div className="flex items-start gap-5">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-border/80 bg-secondary/40 transition-colors group-hover:border-primary/40 group-hover:text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-2xl">{title}</h3>
              <p className="mt-2.5 text-[15px] text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

export default Problem;
