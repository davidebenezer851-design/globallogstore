import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  peerName,
  useConversations,
  useMarkThreadRead,
  useSendMessage,
  useThread,
} from "@/hooks/useMessages";
import { cn } from "@/lib/utils";

type Search = { peer?: string | undefined };

export const Route = createFileRoute("/messages")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    peer: typeof search['peer'] === "string" ? (search['peer'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Messages — GlobalLogStore" },
      {
        name: "description",
        content: "Chat in real time with buyers and sellers on GlobalLogStore.",
      },
      { property: "og:title", content: "Messages — GlobalLogStore" },
      {
        property: "og:description",
        content: "Chat in real time with buyers and sellers on GlobalLogStore.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <MessagesPage />
    </AppShell>
  ),
});

function MessagesPage() {
  const { user } = useAuth();
  const { peer } = Route.useSearch();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl glass p-12 text-center">
        <p className="text-sm text-muted-foreground">Sign in to use messages.</p>
        <Button asChild className="rounded-full">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  return peer ? <Thread peerId={peer} /> : <ConversationList />;
}

function ConversationList() {
  const { conversations, isLoading } = useConversations();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl font-bold">Messages</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading chats…</p>
      ) : conversations.length === 0 ? (
        <div className="rounded-3xl glass p-12 text-center text-sm text-muted-foreground">
          No conversations yet. Open a listing and message the seller to start one.
        </div>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => {
            const name = peerName(c.peer);
            return (
              <li key={c.peerId}>
                <Link
                  to="/messages"
                  search={{ peer: c.peerId }}
                  className="flex items-center gap-3 rounded-3xl glass p-4 transition-transform hover:-translate-y-0.5"
                >
                  <span className="grid size-11 place-items-center rounded-full wallet-gradient font-bold text-primary-foreground">
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{name}</p>
                    <p className="truncate text-sm text-muted-foreground">{c.last.body}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {c.unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Thread({ peerId }: { peerId: string }) {
  const { user } = useAuth();
  const { messages, peer } = useThread(peerId);
  const send = useSendMessage();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useMarkThreadRead(peerId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const name = peerName(peer);

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col gap-4">
      <div className="flex items-center gap-3 rounded-3xl glass p-4">
        <button
          type="button"
          aria-label="Back to conversations"
          onClick={() => void navigate({ to: "/messages", search: {} })}
          className="grid size-9 place-items-center rounded-full bg-secondary"
        >
          <ArrowLeft className="size-4" />
        </button>
        <span className="grid size-10 place-items-center rounded-full wallet-gradient font-bold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{name}</p>
          {peer?.location && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {peer.location}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto rounded-3xl glass p-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Say hello — messages appear instantly.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-float",
                  mine
                    ? "wallet-gradient text-primary-foreground"
                    : "bg-secondary text-foreground",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className={cn("mt-1 text-[10px]", mine ? "opacity-75" : "text-muted-foreground")}>
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const body = text.trim();
          if (!body) return;
          setText("");
          send.mutate({ recipientId: peerId, body });
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          className="h-12 rounded-full bg-surface"
        />
        <Button type="submit" size="icon" className="size-12 shrink-0 rounded-full">
          <Send className="size-5" />
        </Button>
      </form>
    </div>
  );
}
