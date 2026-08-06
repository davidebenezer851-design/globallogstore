import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type MarketLog = {
  id: string;
  user_id: string;
  image_path: string;
  imageUrl: string | null;
  category: string;
  description: string;
  price: number;
  status: string;
  created_at: string;
  seller: { display_name: string | null; avatar_url: string | null } | null;
};

async function signPaths(paths: string[]) {
  const map = new Map<string, string>();
  if (paths.length === 0) return map;
  const { data } = await supabase.storage.from("log-images").createSignedUrls(paths, 60 * 60 * 24);
  data?.forEach((entry) => {
    if (entry.path && entry.signedUrl) map.set(entry.path, entry.signedUrl);
  });
  return map;
}

export function useLogs(userId?: string) {
  return useQuery({
    queryKey: ["logs", userId ?? "all"],
    queryFn: async (): Promise<MarketLog[]> => {
      let query = supabase
        .from("logs")
        .select("id,user_id,image_url,category,description,price,status,created_at")
        .order("created_at", { ascending: false });
      if (userId) query = query.eq("user_id", userId);
      const { data, error } = await query;
      if (error) throw error;
      const rows = data ?? [];

      const signed = await signPaths(rows.map((r) => r.image_url));
      const sellerIds = [...new Set(rows.map((r) => r.user_id))];
      const sellers = new Map<string, { display_name: string | null; avatar_url: string | null }>();
      if (sellerIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,display_name,avatar_url")
          .in("id", sellerIds);
        profiles?.forEach((p) =>
          sellers.set(p.id, { display_name: p.display_name, avatar_url: p.avatar_url }),
        );
      }

      return rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        image_path: r.image_url,
        imageUrl: signed.get(r.image_url) ?? null,
        category: r.category,
        description: r.description,
        price: Number(r.price),
        status: r.status,
        created_at: r.created_at,
        seller: sellers.get(r.user_id) ?? null,
      }));
    },
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,display_name,avatar_url,wallet_balance")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useFundWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      const { data, error } = await supabase.rpc("fund_wallet", { _amount: amount });
      if (error) throw error;
      return Number(data);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile"] });
      void qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id,amount,type,created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateLog() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      file: File;
      category: string;
      description: string;
      price: number;
    }) => {
      if (!user) throw new Error("You need to sign in first.");
      const ext = input.file.name.split(".").pop() ?? "png";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("log-images")
        .upload(path, input.file, { upsert: false });
      if (uploadError) throw uploadError;

      const { error } = await supabase.from("logs").insert({
        user_id: user.id,
        image_url: path,
        category: input.category,
        description: input.description,
        price: input.price,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}
