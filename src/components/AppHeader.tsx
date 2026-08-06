import { Link } from "@tanstack/react-router";
import { LogOut, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";

const navLinkClass =
  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

export function AppHeader() {
  const { data: profile } = useProfile();
  const { user, loading, signOut } = useAuth();
  const name = profile?.display_name ?? user?.email ?? "Member";

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl wallet-gradient font-display text-lg font-bold text-primary-foreground shadow-glow">
            G
          </span>
          <span className="font-display text-lg font-bold tracking-tight">GlobalLogStore</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-secondary/70 p-1 md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-surface text-foreground shadow-float" }}
            className={navLinkClass}
          >
            Dashboard
          </Link>
          <Link
            to="/marketplace"
            activeProps={{ className: "bg-surface text-foreground shadow-float" }}
            className={navLinkClass}
          >
            Marketplace
          </Link>
        </nav>

        {loading ? (
          <span className="size-9 animate-pulse rounded-full bg-secondary" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="grid size-9 place-items-center rounded-full wallet-gradient font-display text-sm font-bold text-primary-foreground shadow-glow"
              >
                {name.charAt(0).toUpperCase()}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl">
              <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/wallet">
                  <Wallet className="size-4" /> Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="size-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void signOut()}>
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="rounded-full">
            <Link to="/auth">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
