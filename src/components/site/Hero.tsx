import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroGlow from "@/assets/hero-glow.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-28 md:pb-40">
      {/* Hero glow image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroGlow}
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="reveal inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-foreground/80">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="font-mono tracking-wide">STON.fi Hackathon · TON Blockchain</span>
          </div>

          <h1 className="reveal reveal-delay-1 mt-8 font-serif-display text-5xl leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            STON.fi shows you <em className="text-gradient-amber not-italic">numbers.</em>
            <br />
            <span className="italic text-foreground/90">ILuminate tells you what to do.</span>
          </h1>

          <p className="reveal reveal-delay-2 mx-auto mt-7 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            The decision layer on top of STON.fi — combining IL, fees, and net returns into one
            clear picture, with one-click action via Omniston.
          </p>

          <div className="reveal reveal-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="luminous" size="lg" className="group" asChild>
              <Link to="/app">
                Launch app
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/simulator">Try the simulator</Link>
            </Button>
          </div>

          <div className="reveal reveal-delay-4 mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            <span>Hold vs LP chart</span>
            <Dot />
            <span>Net return score</span>
            <Dot />
            <span>Smart exit alerts</span>
            <Dot />
            <span>One-click rebalance</span>
          </div>
        </div>

        {/* Floating dashboard preview */}
        <div className="reveal reveal-delay-5 mt-20 mx-auto max-w-5xl">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
};

const Dot = () => <span className="h-1 w-1 rounded-full bg-primary/60" />;

const DashboardPreview = () => (
  <div className="relative">
    <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-primary/30 via-transparent to-transparent opacity-60 blur-md" />
    <div className="relative glass-card rounded-3xl p-1.5 shadow-elegant">
      <div className="rounded-[20px] bg-card/80 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">LIVE · TON / USDT</span>
          </div>
          <div className="hidden md:flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Stat label="Position value" value="$12,847.20" delta="+$1,204" positive />
          <Stat label="Impermanent loss" value="−$386.50" delta="−3.0%" />
          <Stat label="Net return" value="+$818.70" delta="vs hold +6.4%" positive />
        </div>

        <div className="mt-8 rounded-xl border border-border/60 bg-background/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Hold vs LP — 30D</span>
            <span className="text-xs text-success">LP outperforming</span>
          </div>
          <MiniChart />
        </div>
      </div>
    </div>
  </div>
);

const Stat = ({ label, value, delta, positive }: { label: string; value: string; delta: string; positive?: boolean }) => (
  <div>
    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70">{label}</div>
    <div className="mt-2 font-serif-display text-3xl">{value}</div>
    <div className={`mt-1 text-xs font-mono ${positive ? "text-success" : "text-destructive"}`}>{delta}</div>
  </div>
);

const MiniChart = () => (
  <svg viewBox="0 0 600 140" className="w-full h-32">
    <defs>
      <linearGradient id="lpFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(38 95% 60%)" stopOpacity="0.4" />
        <stop offset="100%" stopColor="hsl(38 95% 60%)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0,100 C60,90 100,70 160,72 C220,74 260,55 320,48 C380,42 430,35 490,28 C540,22 580,18 600,15 L600,140 L0,140 Z" fill="url(#lpFill)" />
    <path d="M0,100 C60,90 100,70 160,72 C220,74 260,55 320,48 C380,42 430,35 490,28 C540,22 580,18 600,15" stroke="hsl(38 95% 60%)" strokeWidth="2" fill="none" />
    <path d="M0,105 C80,100 160,92 240,82 C320,72 400,68 480,60 C540,55 580,52 600,50" stroke="hsl(40 12% 62%)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />
  </svg>
);

export default Hero;
