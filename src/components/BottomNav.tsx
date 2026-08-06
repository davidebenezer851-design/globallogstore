import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/marketplace", label: "Marketplace", icon: Store },
] as const;

export function BottomNav() {
  const { openUpload } = useShell();
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const left = items.slice(0, 1);
  const right = items.slice(1);

  const renderItem = ({ to, label, icon: Icon }: (typeof items)[number]) => {
    const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return (
      <Link
        key={to}
        to={to}
        className={cn(
          "flex w-20 flex-col items-center gap-1 rounded-full py-1 text-[11px] font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className="size-5" />
        {label}
      </Link>
    );
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto flex items-center gap-2 rounded-full glass px-3 py-2 shadow-float">
        {left.map(renderItem)}

        {user && (
          <button
            type="button"
            onClick={openUpload}
            aria-label="Upload log"
            className="mx-1 grid size-14 -translate-y-4 place-items-center rounded-full wallet-gradient text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="size-7" strokeWidth={2.5} />
          </button>
        )}

        {right.map(renderItem)}
      </nav>
    </div>
  );
}
