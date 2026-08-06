import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  LayoutList,
  Plus,
  ShoppingCart,
  Store,
  Upload,
} from "lucide-react";
import { AppShell, useShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLogs, useProfile } from "@/hooks/useMarketplace";
import { CurrencyToggle, useCurrency } from "@/hooks/useCurrency";

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
  const { data: myLogs } = useLogs(user?.id);
  const { data: allLogs } = useLogs();
  const { openUpload, openFund } = useShell();
  const { format } = useCurrency();
  const balance = Number(profile?.wallet_balance ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-accent/50 p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          This platform provides digital tools for legitimate use only. Users are responsible for
          how they use them.
        </p>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={openFund}
          className="flex shrink-0 items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold"
        >
          <Plus className="size-4 text-primary" /> Fund Account
        </button>
        <Link
          to="/marketplace"
          className="flex shrink-0 items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold"
        >
          <ShoppingCart className="size-4 text-primary" /> Buy Logs
        </Link>
        <Link
          to="/listings"
          className="flex shrink-0 items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold"
        >
          <LayoutList className="size-4 text-primary" /> My Listings
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl wallet-gradient p-6 text-primary-foreground shadow-glow md:p-8">
        <h1 className="font-display text-xl font-bold md:text-2xl">
          Dashboard Overview{profile?.display_name ? `, ${profile.display_name}` : ""} 👋
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">Account balance</p>
          <CurrencyToggle />
        </div>
        <p className="mt-1 font-display text-4xl font-bold md:text-5xl">{format(balance)}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" className="rounded-full" onClick={openFund}>
            <Plus className="size-4" /> Add Funds
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 hover:text-primary-foreground"
          >
            <Link to="/wallet">
              History <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-3xl glass p-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl wallet-gradient text-primary-foreground shadow-glow">
          <Store className="size-8" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-primary">
          Social Media Marketplace
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Access premium verified logs across Google, Facebook, TikTok, X, Instagram and Outlook.
        </p>
        <Button asChild className="mt-5 w-full rounded-full">
          <Link to="/marketplace">Explore Marketplace</Link>
        </Button>
      </section>

      <section className="rounded-3xl glass p-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl wallet-gradient text-primary-foreground shadow-glow">
          <Upload className="size-8" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-primary">Seller Hub</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload new logs and manage everything you have listed for sale.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button className="rounded-full" onClick={openUpload} disabled={!user}>
            <Upload className="size-4" /> Upload log
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/listings">
              Manage listings <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {!user && (
          <p className="mt-3 text-xs text-muted-foreground">
            <Link to="/auth" className="text-primary underline">
              Sign in
            </Link>{" "}
            to start selling.
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={<LayoutList className="size-5" />}
          label="Your listings"
          value={String(myLogs?.length ?? 0)}
        />
        <StatCard
          icon={<Store className="size-5" />}
          label="Marketplace logs"
          value={String(allLogs?.length ?? 0)}
        />
      </div>
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
