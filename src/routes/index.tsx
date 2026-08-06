import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Store, Upload } from "lucide-react";
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
      <section className="overflow-hidden rounded-3xl wallet-gradient p-6 text-primary-foreground shadow-glow md:p-8">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] opacity-80">Available balance</p>
        <p className="mt-1 font-display text-4xl font-bold md:text-5xl">
          $
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" className="rounded-full" onClick={openFund}>
            <Plus className="size-4" /> Fund wallet
          </Button>
          {user && (
            <Button
              variant="ghost"
              className="rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 hover:text-primary-foreground"
              onClick={openUpload}
            >
              <Upload className="size-4" /> Upload a log
            </Button>
          )}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={<Upload className="size-5" />}
          label="Your listings"
          value={String(myLogs?.length ?? 0)}
        />
        <StatCard
          icon={<Store className="size-5" />}
          label="Marketplace logs"
          value={String(allLogs?.length ?? 0)}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Your listings</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
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
    <div className="flex items-center gap-3 rounded-3xl glass p-4">
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
    <div className="flex flex-col items-center gap-4 rounded-3xl glass p-10 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}
