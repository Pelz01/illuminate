import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="absolute inset-x-0 top-0 hairline" />
      <div className="container py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-gradient-amber shadow-glow-sm" />
            <span className="font-serif-display text-xl">ILuminate</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            STON.fi shows you numbers. ILuminate tells you what to do — the decision layer for TON liquidity.
          </p>
          <p className="mt-6 text-xs text-muted-foreground/70 font-mono">
            illuminate.app · TON · 2026
          </p>
        </div>

        <FooterCol title="Product" links={[
          { to: "/features", label: "Features" },
          { to: "/simulator", label: "IL Simulator" },
          { to: "/how-it-works", label: "How it works" },
        ]} />

        <FooterCol title="Resources" links={[
          { to: "#", label: "Documentation" },
          { to: "#", label: "GitHub" },
          { to: "#", label: "Demo video" },
        ]} />

        <FooterCol title="Built on" links={[
          { to: "#", label: "STON.fi" },
          { to: "#", label: "Omniston" },
          { to: "#", label: "TonConnect" },
        ]} />
      </div>

      <div className="container pb-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-6">
        <span>© 2026 ILuminate. STON.fi Hackathon.</span>
        <span className="font-mono">v1.0 · TON Mainnet</span>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, links }: { title: string; links: { to: string; label: string }[] }) => (
  <div>
    <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 mb-4">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.label}>
          <Link to={l.to} className="text-sm text-foreground/80 hover:text-primary transition-colors">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default SiteFooter;
