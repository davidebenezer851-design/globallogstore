import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ImageOff, MapPin, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/lib/categories";
import type { MarketLog } from "@/hooks/useMarketplace";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/hooks/useAuth";
import { useProfileById, peerName } from "@/hooks/useMessages";

export function LogDetailSheet({ log, onClose }: { log: MarketLog | null; onClose: () => void }) {
  const { format } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: seller } = useProfileById(log?.user_id);
  const [active, setActive] = useState(0);

  if (!log) return null;
  const category = getCategory(log.category);
  const Icon = category.icon;
  const images = [log.imageUrl].filter(Boolean) as string[];
  const name = peerName(seller) || log.seller?.display_name || "Seller";

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-background/40 backdrop-blur-md"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in-right-x flex-col overflow-y-auto glass p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
            <Icon className="size-4" /> {category.label}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-secondary text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 aspect-4/3 overflow-hidden rounded-3xl bg-surface-2 shadow-float">
          {images[active] ? (
            <img src={images[active]} alt={`${category.label} log preview`} className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <ImageOff className="size-8" />
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={`size-16 shrink-0 overflow-hidden rounded-2xl border ${
                  i === active ? "border-primary" : "border-border"
                }`}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 font-display text-2xl font-bold text-primary">
          {log.price > 0 ? format(log.price) : "Free"}
        </p>

        <p className="mt-3 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
          {log.description || "No description provided."}
        </p>

        <div className="mt-4 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full wallet-gradient font-bold text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                {seller?.location?.trim() || "Location not shared"}
              </p>
            </div>
          </div>

          {user?.id !== log.user_id && (
            <Button
              className="mt-4 w-full rounded-full"
              onClick={() => {
                onClose();
                void navigate({ to: "/messages", search: { peer: log.user_id } });
              }}
            >
              <MessageCircle className="size-4" /> Message seller
            </Button>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Listed {new Date(log.created_at).toLocaleString()} · {log.status}
        </p>
      </aside>
    </div>
  );
}
