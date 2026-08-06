import { ImageOff } from "lucide-react";
import { getCategory } from "@/lib/categories";
import type { MarketLog } from "@/hooks/useMarketplace";
import { useCurrency } from "@/hooks/useCurrency";

export function LogCard({ log }: { log: MarketLog }) {
  const category = getCategory(log.category);
  const Icon = category.icon;
  const { format } = useCurrency();
  const seller = log.seller?.display_name?.trim() || log.seller?.email?.split("@")[0] || "Seller";

  return (
    <article className="group overflow-hidden rounded-3xl glass transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl rounded-b-none bg-surface-2">
        {log.imageUrl ? (
          <img
            src={log.imageUrl}
            alt={`${category.label} log — ${log.description.slice(0, 60) || "listing"}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
          <Icon className="size-4" />
          {category.label}
        </span>

        <p className="line-clamp-2 min-h-10 rounded-2xl bg-secondary/60 p-3 text-sm text-muted-foreground">
          {log.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">
            {log.price > 0 ? format(log.price) : "Free"}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {log.status}
          </span>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-3">
          <span className="grid size-7 place-items-center rounded-full wallet-gradient text-[11px] font-bold text-primary-foreground">
            {seller.charAt(0).toUpperCase()}
          </span>
          <span className="truncate text-xs text-muted-foreground">{seller}</span>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {new Date(log.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </article>
  );
}
