import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { BellRing } from "lucide-react";
import { useTonWalletSession } from "@/hooks/use-ton-wallet-session";
import { useStonWalletPositions } from "@/hooks/use-ston-wallet-positions";

const AlertsPage = () => {
  const [threshold, setThreshold] = useState(10);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [tg, setTg] = useState(true);
  const { connected, address, connect } = useTonWalletSession();
  const { data: positions = [], isLoading } = useStonWalletPositions(address);

  return (
    <AppLayout
      title="Alerts"
      subtitle="Configure threshold preferences. Live alert firing is unavailable until IL and fee attribution are enabled."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Threshold
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif-display text-4xl">-{threshold}%</span>
              <span className="text-xs text-muted-foreground">Net loss vs hold</span>
            </div>
            <Slider
              className="mt-5"
              min={2}
              max={30}
              step={1}
              value={[threshold]}
              onValueChange={(v) => setThreshold(v[0])}
            />
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Preference only. Alert firing starts after live IL and fee attribution is integrated.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Channels
            </div>
            <Channel label="In-app push" desc="Browser & mobile" checked={push} onChange={setPush} />
            <Channel label="Telegram bot" desc="Channel not configured yet" checked={tg} onChange={setTg} />
            <Channel label="Email digest" desc="Daily summary" checked={email} onChange={setEmail} />
            <Button variant="luminous" className="w-full mt-2" disabled>
              Coming soon
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                Alert status
              </div>
              <h2 className="mt-1 font-serif-display text-2xl">Live feed unavailable</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-mono text-muted-foreground">
              <BellRing className="h-3.5 w-3.5" />
              Awaiting attribution engine
            </span>
          </div>

          {!connected && (
            <div className="rounded-xl border border-border/60 bg-background/40 p-5">
              <p className="text-sm text-muted-foreground">
                Connect wallet to view monitored positions once live alert firing is enabled.
              </p>
              <Button variant="glass" className="mt-4" onClick={connect}>
                Connect wallet
              </Button>
            </div>
          )}

          {connected && isLoading && (
            <div className="rounded-xl border border-border/60 bg-background/40 p-5 text-sm text-muted-foreground">
              Loading wallet positions...
            </div>
          )}

          {connected && !isLoading && positions.length === 0 && (
            <div className="rounded-xl border border-border/60 bg-background/40 p-5 text-sm text-muted-foreground">
              No STON.fi positions found for this wallet.
            </div>
          )}

          {connected && !isLoading && positions.length > 0 && (
            <div className="space-y-3">
              {positions.map((position) => (
                <div
                  key={position.poolAddress}
                  className="rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{position.pair}</div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Monitoring inactive
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Alert event generation is unavailable until IL and fee attribution are live.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

const Channel = ({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default AlertsPage;
