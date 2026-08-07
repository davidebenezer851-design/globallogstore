import { Link } from "@tanstack/react-router";
import {
  Home,
  LayoutList,
  LogOut,
  MessageCircle,
  Store,
  Upload,
  User,
  Wallet,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadSenderCount } from "@/hooks/useMessages";

type Props = {
  open: boolean;
  onClose: () => void;
  onFund: () => void;
  onUpload: () => void;
};

const rowClass =
  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary";

export function SideNav({ open, onClose, onFund, onUpload }: Props) {
  const { user, signOut } = useAuth();
  const unread = useUnreadSenderCount();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-background/40 backdrop-blur-md animate-fade-in"
      />
      <aside className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs animate-slide-in-left flex-col gap-2 glass p-4">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="font-display text-lg font-bold">GlobalLogStore</span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-secondary text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <Link to="/" onClick={onClose} className={rowClass}>
          <Home className="size-5 text-primary" /> Dashboard
        </Link>
        <Link to="/marketplace" onClick={onClose} className={rowClass}>
          <Store className="size-5 text-primary" /> Marketplace
        </Link>
        <Link to="/listings" onClick={onClose} className={rowClass}>
          <LayoutList className="size-5 text-primary" /> My listings
        </Link>
        <Link to="/messages" onClick={onClose} className={rowClass}>
          <MessageCircle className="size-5 text-primary" /> Messages
          {unread > 0 && (
            <span className="ml-auto grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </Link>
        <Link to="/wallet" onClick={onClose} className={rowClass}>
          <Wallet className="size-5 text-primary" /> Wallet
        </Link>
        <Link to="/profile" onClick={onClose} className={rowClass}>
          <User className="size-5 text-primary" /> Profile
        </Link>

        {user && (
          <>
            <button
              type="button"
              className={rowClass}
              onClick={() => {
                onClose();
                onFund();
              }}
            >
              <Plus className="size-5 text-primary" /> Fund account
            </button>
            <button
              type="button"
              className={rowClass}
              onClick={() => {
                onClose();
                onUpload();
              }}
            >
              <Upload className="size-5 text-primary" /> Upload log
            </button>
            <button
              type="button"
              className={`${rowClass} mt-auto`}
              onClick={() => {
                onClose();
                void signOut();
              }}
            >
              <LogOut className="size-5 text-primary" /> Sign out
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
