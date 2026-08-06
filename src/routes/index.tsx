import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Upload, Wallet } from "lucide-react";
import { AppShell, useShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { LogCard } from "@/components/LogCard";
import { useAuth } from "@/hooks/useAuth";
import { useLogs, useProfile } from "@/hooks/useMarketplace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GlobalLogStore" },
      {
        name: "description",
        content:
          "Track your wallet balance, upload new logs and manage your GlobalLogStore listings from one dashboard.",
      },
      { property: "og:title", content: "Dashboard — GlobalLogStore" },
      {
        property: "og:description",
        content: "Track your wallet, upload logs and manage listings on GlobalLogStore.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: myLogs, isLoading } = useLogs(user?.id);
  const { data: allLogs } = useLogs();
  const { openUpload, openFund } = useShell();
  const balance = Number(profile?.wallet_balance ?? 0);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-float md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Dashboard</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Upload logs, route them into the right marketplace category and keep your wallet topped
          up.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Wallet className="size-5" />}
            label="Wallet balance"
            value={`$${balance.toFixed(2)}`}
          />
          <StatCard
            icon={<Upload className="size-5" />}
            label="Your logs"
            value={String(myLogs?.length ?? 0)}
          />
          <StatCard
            icon={<Store className="size-5" />}
            label="Marketplace logs"
            value={String(allLogs?.length ?? 0)}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="rounded-full" onClick={openUpload}>
            Upload a log
          </Button>
          <Button variant="secondary" className="rounded-full" onClick={openFund}>
            Fund wallet
          </Button>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold">Your listings</h2>
        {!user ? (
          <EmptyState
            text="Sign in to upload logs and track your listings."
            action={
              <Button asChild className="rounded-full">
                <Link to="/auth">Sign in</Link>
              </Button>
            }
          />
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading your logs…</p>
        ) : myLogs && myLogs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myLogs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <EmptyState
            text="No logs yet. Tap the + button to upload your first one."
            action={
              <Button className="rounded-full" onClick={openUpload}>
                Upload log
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-4">
      <span className="grid size-10 place-items-center rounded-xl wallet-gradient text-primary-foreground">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-surface/60 p-10 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}
