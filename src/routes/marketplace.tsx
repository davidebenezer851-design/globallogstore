import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LogCard } from "@/components/LogCard";
import { CATEGORIES } from "@/lib/categories";
import { useLogs } from "@/hooks/useMarketplace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — GlobalLogStore" },
      {
        name: "description",
        content:
          "Browse logs by category — Google, Facebook, TikTok, X, Instagram and Outlook — on the GlobalLogStore marketplace.",
      },
      { property: "og:title", content: "Marketplace — GlobalLogStore" },
      {
        property: "og:description",
        content: "Browse Google, Facebook, TikTok, X, Instagram and Outlook logs by category.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <Marketplace />
    </AppShell>
  ),
});

function Marketplace() {
  const [active, setActive] = useState<string>("all");
  const { data: logs, isLoading } = useLogs();
  const filtered = (logs ?? []).filter((l) => active === "all" || l.category === active);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Marketplace</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Browse logs</h1>
      </header>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <FilterTab
          label="All"
          active={active === "all"}
          onClick={() => setActive("all")}
          count={logs?.length ?? 0}
        />
        {CATEGORIES.filter((c) => c.id !== "other").map((c) => (
          <FilterTab
            key={c.id}
            label={c.label}
            icon={<c.icon className="size-4" />}
            active={active === c.id}
            onClick={() => setActive(c.id)}
            count={(logs ?? []).filter((l) => l.category === c.id).length}
          />
        ))}
        <FilterTab
          label="Other"
          active={active === "other"}
          onClick={() => setActive("other")}
          count={(logs ?? []).filter((l) => l.category === "other").length}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading marketplace…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
          No logs in this category yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  label,
  icon,
  active,
  onClick,
  count,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-surface text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-[11px]",
          active ? "bg-primary-foreground/20" : "bg-secondary",
        )}
      >
        {count}
      </span>
    </button>
  );
}
