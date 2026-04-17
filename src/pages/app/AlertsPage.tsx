import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { BellRing, AlertTriangle, CheckCircle2 } from "lucide-react";

const fired = [
  { pair: "USDT / DOGS", level: "critical", time: "12 min ago", body: "Net loss vs hold crossed −15% threshold. Suggested action: exit or rebalance." },
  { pair: "TON / NOT", level: "warning", time: "3 hours ago", body: "IL approaching −13%. Fees still net positive but margin is thinning." },
  { pair: "TON / USDT", level: "ok", time: "1 day ago", body: "Position recovered above hold benchmark. Alert auto-resolved." },
];

const AlertsPage = () => {
  const [threshold, setThreshold] = useState(10);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [tg, setTg] = useState(true);

  return (
    <AppLayout title="Alerts" subtitle="Set the moment you want to know. We'll watch your positions on-chain and notify you instantly.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Settings */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Threshold</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif-display text-4xl">−{threshold}%</span>
              <span className="text-xs text-muted-foreground">Net loss vs hold</span>
            </div>
            <Slider className="mt-5" min={2} max={30} step={1} value={[threshold]} onValueChange={(v) => setThreshold(v[0])} />
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Alert fires when (fees − IL) ÷ deposit drops below this percentage. Most LPs set this between 5% and 15%.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Channels</div>
            <Channel label="In-app push" desc="Browser & mobile" checked={push} onChange={setPush} />
            <Channel label="Telegram bot" desc="@iluminate_bot" checked={tg} onChange={setTg} />
            <Channel label="Email digest" desc="Daily summary" checked={email} onChange={setEmail} />
            <Button variant="luminous" className="w-full mt-2">Save preferences</Button>
          </div>
        </div>

        {/* Feed */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Recent activity</div>
              <h2 className="mt-1 font-serif-display text-2xl">Alert feed</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> Monitoring 3 positions
            </span>
          </div>

          <div className="space-y-3">
            {fired.map((a, i) => {
              const meta =
                a.level === "critical"
                  ? { Icon: AlertTriangle, cls: "text-destructive bg-destructive/10 border-destructive/30" }
                  : a.level === "warning"
                  ? { Icon: BellRing, cls: "text-primary bg-primary/10 border-primary/30" }
                  : { Icon: CheckCircle2, cls: "text-success bg-success/10 border-success/30" };
              return (
                <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-5 transition-colors hover:bg-background/60">
                  <div className="flex items-start gap-4">
                    <span className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border ${meta.cls}`}>
                      <meta.Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{a.pair}</div>
                        <span className="text-[11px] font-mono text-muted-foreground">{a.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const Channel = ({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default AlertsPage;
