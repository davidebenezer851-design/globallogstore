import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, useShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useTransactions } from "@/hooks/useMarketplace";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — GlobalLogStore" },
      {
        name: "description",
        content: "Check your GlobalLogStore balance, add funds and review your funding history.",
      },
      { property: "og:title", content: "Wallet — GlobalLogStore" },
      {
        property: "og:description",
        content: "Check your balance, add funds and review funding history.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <WalletPage />
    </AppShell>
  ),
});

function WalletPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: transactions } = useTransactions();
  const { openFund } = useShell();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-surface/60 p-12 text-center">
        <p className="text-sm text-muted-foreground">Sign in to view your wallet.</p>
        <Button asChild className="rounded-full">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Wallet</h1>

      <div className="rounded-3xl wallet-gradient p-6 text-primary-foreground shadow-glow">
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">Available balance</p>
        <p className="mt-2 font-display text-4xl font-bold">
          ${Number(profile?.wallet_balance ?? 0).toFixed(2)}
        </p>
        <Button variant="secondary" className="mt-5 rounded-full" onClick={openFund}>
          Fund wallet
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Recent activity</h2>
        {transactions && transactions.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between p-4 text-sm">
                <span className="capitalize">{t.type}</span>
                <span className="text-muted-foreground">
                  {new Date(t.created_at).toLocaleString()}
                </span>
                <span className="font-display font-bold text-primary">
                  +${Number(t.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No funding activity yet.</p>
        )}
      </section>
    </div>
  );
}
