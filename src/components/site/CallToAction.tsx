import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToAction = () => (
  <section className="relative py-32">
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 px-6 py-20 md:py-28 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-aurora" />
        <div className="absolute inset-0 -z-10 bg-card/40" />
        <div className="absolute -bottom-32 left-1/2 -z-10 h-64 w-[80%] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />

        <p className="text-xs uppercase tracking-[0.3em] text-primary/90 font-mono">Get started</p>
        <h2 className="mt-5 mx-auto max-w-3xl font-serif-display text-4xl md:text-6xl leading-[1.05] text-gradient">
          Stop reading numbers. <em className="italic">Start making moves.</em>
        </h2>
        <p className="mt-5 mx-auto max-w-xl text-muted-foreground">
          Connect your TON wallet. ILuminate reads your STON.fi positions, surfaces the truth, and lets you act — in under ten seconds.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="luminous" size="xl" className="group" asChild>
            <Link to="/app">
              Launch app <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button variant="glass" size="xl" asChild>
            <Link to="/how-it-works">See how it works</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground/70 font-mono">Non-custodial · TonConnect · No sign-up</p>
      </div>
    </div>
  </section>
);

export default CallToAction;
