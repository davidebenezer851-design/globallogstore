import { Link } from "@tanstack/react-router";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { useShell } from "@/components/AppShell";

const navLinkClass =
  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

export function AppHeader() {
  const { data: profile } = useProfile();
  const { user, signOut } = useAuth();
  const { openFund } = useShell();
  const balance = Number(profile?.wallet_balance ?? 0);

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl wallet-gradient font-display text-lg font-bold text-primary-foreground">
              G
            </span>
            <span className="font-display text-lg font-bold tracking-tight">GlobalLogStore</span>
          </Link>

          <nav className="flex items-center gap-1 md:hidden">
            <Link to="/" activeProps={{ className: "text-foreground" }} className={navLinkClass}>
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              activeProps={{ className: "text-foreground" }}
              className={navLinkClass}
            >
              Marketplace
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 rounded-full bg-secondary/60 p-1 md:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-surface-2 text-foreground shadow-float" }}
              className={navLinkClass}
            >
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              activeProps={{ className: "bg-surface-2 text-foreground shadow-float" }}
              className={navLinkClass}
            >
              Marketplace
            </Link>
          </nav>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-2.5 shadow-float">
            <div className="grid size-9 place-items-center rounded-xl wallet-gradient text-primary-foreground">
              <Wallet className="size-4" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Available balance
              </p>
              <p className="font-display text-lg font-bold">
                $
                {balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Button size="sm" className="rounded-full" onClick={openFund}>
              <Plus className="size-4" /> Fund Wallet
            </Button>
          </div>

          {user ? (
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => void signOut()}>
              Sign out
            </Button>
          ) : (
            <Button asChild variant="secondary" size="sm" className="rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
