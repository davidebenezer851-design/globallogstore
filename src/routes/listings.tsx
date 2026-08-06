import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, useShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { LogCard } from "@/components/LogCard";
import { useAuth } from "@/hooks/useAuth";
import { useLogs } from "@/hooks/useMarketplace";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Your Listings — GlobalLogStore" },
      {
        name: "description",
        content:
          "Manage every log you have listed on GlobalLogStore — images, categories, prices and status in one place.",
      },
      { property: "og:title", content: "Your Listings — GlobalLogStore" },
      {
        property: "og:description",
        content: "Manage every log you have listed on GlobalLogStore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <ListingsPage />
    </AppShell>
  ),
});

function ListingsPage() {
  const { user } = useAuth();
  const { data: logs, isLoading } = useLogs(user?.id);
  const { openUpload } = useShell();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Your account</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Your listings</h1>
        </div>
        {user && (
          <Button className="rounded-full" onClick={openUpload}>
            Upload log
          </Button>
        )}
      </header>

      {!user ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl glass p-10 text-center">
          <p className="text-sm text-muted-foreground">Sign in to manage your listings.</p>
          <Button asChild className="rounded-full">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading your logs…</p>
      ) : logs && logs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl glass p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No logs yet. Tap the + button to upload your first one.
          </p>
          <Button className="rounded-full" onClick={openUpload}>
            Upload log
          </Button>
        </div>
      )}
    </div>
  );
}