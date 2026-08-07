import { Link } from "@tanstack/react-router";
import { MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { useShell } from "@/components/AppShell";
import { useUnreadSenderCount } from "@/hooks/useMessages";

export function AppHeader() {
  const { data: profile } = useProfile();
  const { user, loading } = useAuth();
  const { openNav } = useShell();
  const unread = useUnreadSenderCount();
  const name = profile?.display_name ?? user?.email ?? "Member";

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={openNav}
          className="grid size-9 place-items-center rounded-full bg-secondary text-foreground transition-transform active:scale-95"
        >
          <Menu className="size-5" />
        </button>

        <Link to="/" className="flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl wallet-gradient font-display text-lg font-bold text-primary-foreground shadow-glow">
            G
          </span>
          <span className="font-display text-base font-bold tracking-tight sm:text-lg">
            GlobalLogStore
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <Link
              to="/messages"
              aria-label="Messages"
              className="relative grid size-9 place-items-center rounded-full bg-secondary text-foreground"
            >
              <MessageCircle className="size-5" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow-glow">
                  {unread}
                </span>
              )}
            </Link>
          )}

          {loading ? (
            <span className="size-9 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            <Link
              to="/profile"
              aria-label="Profile"
              className="grid size-9 place-items-center rounded-full wallet-gradient font-display text-sm font-bold text-primary-foreground shadow-glow"
            >
              {name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
