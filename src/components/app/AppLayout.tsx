import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  BellRing,
  Repeat,
  Settings,
  Calculator,
  Menu,
  X,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTonWalletSession } from "@/hooks/use-ton-wallet-session";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/positions", label: "Positions", icon: Wallet },
  { to: "/app/alerts", label: "Alerts", icon: BellRing },
  { to: "/app/rebalance", label: "Rebalance", icon: Repeat },
  { to: "/app/simulator", label: "Simulator", icon: Calculator },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export const AppLayout = ({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) => {
  const [open, setOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const location = useLocation();
  const { connected, shortAddress, connect, disconnect } = useTonWalletSession();

  const handleWalletAction = () => {
    if (connected) {
      disconnect();
      return;
    }

    connect();
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-60 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/[0.06] blur-3xl" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 transform border-r border-border/60 bg-background/80 backdrop-blur-xl transition-all duration-300",
            desktopCollapsed ? "lg:w-20" : "lg:w-72",
            open ? "translate-x-0 w-72" : "-translate-x-full w-72 lg:translate-x-0"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border/60 px-6">
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="relative inline-flex h-7 w-7 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-gradient-amber blur-md opacity-70" />
                <span className="relative h-3 w-3 rounded-full bg-gradient-amber shadow-glow-sm" />
              </span>
              <span className={cn("font-serif-display text-xl tracking-tight", desktopCollapsed && "lg:hidden")}>ILuminate</span>
            </Link>
            <button
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full glass"
              onClick={() => setDesktopCollapsed((value) => !value)}
              aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {desktopCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <button
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full glass"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1">
            <p
              className={cn(
                "px-3 mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-mono",
                desktopCollapsed && "lg:hidden"
              )}
            >
              Workspace
            </p>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    desktopCollapsed && "lg:justify-center lg:px-2",
                    isActive
                      ? "bg-secondary/70 text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                        isActive
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 bg-background/40 text-muted-foreground group-hover:text-foreground"
                      )}
                        >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className={cn("font-medium", desktopCollapsed && "lg:hidden")}>{item.label}</span>
                    {isActive && <span className={cn("ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm", desktopCollapsed && "lg:hidden")} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className={cn("absolute inset-x-4 bottom-6", desktopCollapsed && "lg:inset-x-2")}>
            <div className={cn("rounded-2xl glass-card p-4", desktopCollapsed && "lg:p-3")}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-amber text-primary-foreground text-xs font-mono">
                  {connected ? "EQ" : "--"}
                </div>
                <div className={cn("min-w-0", desktopCollapsed && "lg:hidden")}>
                  <div className="text-xs text-muted-foreground">{connected ? "Connected" : "Not connected"}</div>
                  <div className="font-mono text-xs truncate">{connected ? shortAddress : "Connect wallet"}</div>
                </div>
              </div>
              <Button variant="glass" size="sm" className={cn("mt-3 w-full", desktopCollapsed && "lg:hidden")} asChild>
                <Link to="/">
                  Back to site <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                variant="glass"
                size="icon"
                className={cn("mt-3 hidden w-full", desktopCollapsed ? "lg:inline-flex" : "lg:hidden")}
                asChild
              >
                <Link to="/">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className={cn("flex-1 transition-[padding] duration-300", desktopCollapsed ? "lg:pl-20" : "lg:pl-72")}>
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 sm:px-8 backdrop-blur-xl">
            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
              <span>TON Mainnet · Live</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/how-it-works">Docs</Link>
              </Button>
              <Button variant="luminous" size="sm" onClick={handleWalletAction}>
                <Wallet className="h-4 w-4" /> {connected ? "Connected" : "Connect wallet"}
              </Button>
            </div>
          </header>

          <main className="px-4 sm:px-8 py-8 md:py-12">
            <div className="mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary/90 font-mono">
                {location.pathname === "/app" ? "Overview" : title}
              </p>
              <h1 className="mt-2 font-serif-display text-4xl md:text-5xl text-gradient">{title}</h1>
              {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
            </div>

            {children}
          </main>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}
    </div>
  );
};

export default AppLayout;
