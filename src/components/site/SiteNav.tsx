import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Overview" },
  { to: "/features", label: "Features" },
  { to: "/simulator", label: "Simulator" },
  { to: "/how-it-works", label: "How it works" },
];

export const SiteNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let rafId = 0;

    const updateScrolled = () => {
      const next = window.scrollY > 12;
      setScrolled((prev) => (prev === next ? prev : next));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative inline-flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gradient-amber blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="relative h-3 w-3 rounded-full bg-gradient-amber shadow-glow-sm" />
          </span>
          <span className="font-serif-display text-xl tracking-tight">
            ILuminate
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-1.5 text-sm rounded-full transition-colors",
                  isActive
                    ? "text-foreground bg-secondary/60"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {l.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </Button>
          <Button variant="luminous" size="sm" asChild>
            <Link to="/app">Launch app</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <RouterNavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-lg text-sm",
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )
                }
              >
                {l.label}
              </RouterNavLink>
            ))}
            <Button variant="luminous" className="mt-2" asChild>
              <Link to="/app">Launch app</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteNav;
