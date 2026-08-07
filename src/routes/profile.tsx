import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { LogCard } from "@/components/LogCard";
import { useAuth } from "@/hooks/useAuth";
import { useLogs, useProfile, useUpdateProfile } from "@/hooks/useMarketplace";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — GlobalLogStore" },
      {
        name: "description",
        content: "Your GlobalLogStore account details, wallet balance and uploaded log listings.",
      },
      { property: "og:title", content: "Profile — GlobalLogStore" },
      {
        property: "og:description",
        content: "Your account details, wallet balance and uploaded listings.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: logs } = useLogs(user?.id);
  const updateProfile = useUpdateProfile();
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLocation(profile?.location ?? "");
  }, [profile?.location]);

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-surface/60 p-12 text-center">
        <p className="text-sm text-muted-foreground">Sign in to view your profile.</p>
        <Button asChild className="rounded-full">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  const name = profile?.display_name ?? user.email ?? "Member";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-6 shadow-float">
        <span className="grid size-16 place-items-center rounded-2xl wallet-gradient font-display text-2xl font-bold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">{name}</h1>
          <p className="truncate text-sm text-muted-foreground">{profile?.email ?? user.email}</p>
          <p className="mt-1 text-sm text-primary">
            Balance ${Number(profile?.wallet_balance ?? 0).toFixed(2)}
          </p>
        </div>
        <Button
          variant="secondary"
          className="ml-auto rounded-full"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </div>

      <section className="rounded-3xl glass p-6">
        <h2 className="font-display text-lg font-bold">Your location</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Buyers see this on your listings so they know where you are selling from.
        </p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile.mutate(
              { location: location.trim() },
              { onSuccess: () => toast.success("Location updated") },
            );
          }}
        >
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Lagos, Nigeria"
            className="h-11 rounded-full bg-surface"
          />
          <Button type="submit" className="h-11 rounded-full" disabled={updateProfile.isPending}>
            Save
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold">Your uploads ({logs?.length ?? 0})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(logs ?? []).map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      </section>
    </div>
  );
}
