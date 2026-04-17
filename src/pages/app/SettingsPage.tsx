import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Copy, LogOut } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
  const [theme] = useState("Midnight");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  return (
    <AppLayout title="Settings" subtitle="Wallet, display preferences, and data sources.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Wallet">
          <div className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Connected address</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-sm">EQAb9X…k4Ld7sJp</span>
              <button className="text-muted-foreground hover:text-primary" aria-label="Copy">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Connected via TonConnect · Non-custodial</div>
          </div>
          <Button variant="glass" className="w-full">
            <LogOut className="h-4 w-4" /> Disconnect wallet
          </Button>
        </Card>

        <Card title="Display">
          <Field label="Theme" value={theme} sub="Midnight is the only theme. By design." />
          <Field label="Currency" value="USD" sub="More fiat displays soon." />
          <Toggle label="Auto-refresh prices" desc="Re-poll STON.fi every 30s" checked={autoRefresh} onChange={setAutoRefresh} />
          <Toggle label="Advanced metrics" desc="Show on-chain block numbers, raw fees, and route hops" checked={advanced} onChange={setAdvanced} />
        </Card>

        <Card title="Notifications">
          <Field label="Telegram" value="@your_handle" sub="Connected to @iluminate_bot" />
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Email</label>
            <Input className="mt-2 bg-background/40" placeholder="you@domain.com" />
          </div>
        </Card>

        <Card title="Data sources">
          <Source name="STON.fi /v1/pools" desc="Live prices · APY" status="ok" />
          <Source name="STON.fi /v1/wallets/.../lp_positions" desc="Active LPs" status="ok" />
          <Source name="STON.fi /v1/stats/fee_accruals" desc="Fees earned" status="ok" />
          <Source name="Omniston SDK · WebSocket" desc="Best-route discovery" status="ok" />
          <Source name="TON RPC" desc="Deposit block lookup" status="ok" />
        </Card>
      </div>
    </AppLayout>
  );
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-6 md:p-8 space-y-5">
    <h2 className="font-serif-display text-2xl">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="rounded-xl border border-border/60 bg-background/40 p-4">
    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">{label}</div>
    <div className="mt-1.5 font-mono">{value}</div>
    {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
  </div>
);

const Toggle = ({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const Source = ({ name, desc, status }: { name: string; desc: string; status: "ok" | "down" }) => (
  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3">
    <div className="min-w-0">
      <div className="font-mono text-xs truncate">{name}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${status === "ok" ? "text-success" : "text-destructive"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "ok" ? "bg-success animate-pulse-glow" : "bg-destructive"}`} />
      {status === "ok" ? "Operational" : "Down"}
    </span>
  </div>
);

export default SettingsPage;
