import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type PeerProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  location: string | null;
};

export function peerName(p?: PeerProfile | null) {
  return p?.display_name?.trim() || p?.email?.split("@")[0] || "Member";
}

async function fetchProfiles(ids: string[]) {
  const map = new Map<string, PeerProfile>();
  if (!ids.length) return map;
  const { data } = await supabase
    .from("profiles")
    .select("id,display_name,email,avatar_url,location")
    .in("id", ids);
  data?.forEach((p) => map.set(p.id, p as PeerProfile));
  return map;
}

export function useProfileById(id?: string) {
  return useQuery({
    queryKey: ["peer-profile", id],
    enabled: !!id,
    queryFn: async () => (await fetchProfiles([id!])).get(id!) ?? null,
  });
}

/** All messages involving the current user, newest first. */
export function useInbox() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["messages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id,sender_id,recipient_id,body,read_at,created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = (data ?? []) as Message[];
      const peers = [
        ...new Set(rows.map((m) => (m.sender_id === user!.id ? m.recipient_id : m.sender_id))),
      ];
      const profiles = await fetchProfiles(peers);
      return { rows, profiles };
    },
  });
}

export type Conversation = {
  peerId: string;
  peer: PeerProfile | null;
  last: Message;
  unread: number;
};

export function useConversations() {
  const { user } = useAuth();
  const { data, isLoading } = useInbox();

  const conversations: Conversation[] = [];
  if (data && user) {
    const byPeer = new Map<string, Message[]>();
    data.rows.forEach((m) => {
      const peerId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      const list = byPeer.get(peerId) ?? [];
      list.push(m);
      byPeer.set(peerId, list);
    });
    byPeer.forEach((list, peerId) => {
      conversations.push({
        peerId,
        peer: data.profiles.get(peerId) ?? null,
        last: list[list.length - 1]!,
        unread: list.filter((m) => m.recipient_id === user.id && !m.read_at).length,
      });
    });
    conversations.sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
  }

  return { conversations, isLoading };
}

/** Number of distinct people with unread messages. */
export function useUnreadSenderCount() {
  const { conversations } = useConversations();
  return conversations.filter((c) => c.unread > 0).length;
}

export function useThread(peerId?: string) {
  const { user } = useAuth();
  const { data, isLoading } = useInbox();
  const messages = (data?.rows ?? []).filter(
    (m) =>
      !!peerId &&
      !!user &&
      ((m.sender_id === user.id && m.recipient_id === peerId) ||
        (m.sender_id === peerId && m.recipient_id === user.id)),
  );
  return { messages, peer: peerId ? (data?.profiles.get(peerId) ?? null) : null, isLoading };
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { recipientId: string; body: string }) => {
      if (!user) throw new Error("Sign in to send messages.");
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: input.recipientId,
        body: input.body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useMarkThreadRead(peerId?: string) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { messages } = useThread(peerId);
  const unreadIds = messages
    .filter((m) => m.recipient_id === user?.id && !m.read_at)
    .map((m) => m.id);
  const key = unreadIds.join(",");

  useEffect(() => {
    if (!key) return;
    void supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", key.split(","))
      .then(() => qc.invalidateQueries({ queryKey: ["messages"] }));
  }, [key, qc]);
}

/** Keeps message data live for the signed-in user. */
export function useMessagesRealtime() {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`messages-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        void qc.invalidateQueries({ queryKey: ["messages"] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, qc]);
}
