import { Link } from "@tanstack/react-router";
import { Plus, LayoutList, Upload, User, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onFund: () => void;
  onUpload: () => void;
};

export function QuickMenu({ open, onClose, onFund, onUpload }: Props) {
  if (!open) return null;

  const item =
    "flex flex-col items-center gap-2 text-xs font-semibold text-foreground transition-transform active:scale-95";
  const bubble =
    "grid size-14 place-items-center rounded-2xl bg-secondary text-primary shadow-float";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-background/40 backdrop-blur-md"
      />
      <div className="absolute inset-x-0 bottom-28 px-4">
        <div className="mx-auto w-full max-w-md rounded-3xl glass p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Quick menu
            </p>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid size-7 place-items-center rounded-full bg-secondary text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-3">
            <button
              type="button"
              className={item}
              onClick={() => {
                onClose();
                onFund();
              }}
            >
              <span className={bubble}>
                <Plus className="size-6" />
              </span>
              Fund
            </button>

            <Link to="/listings" onClick={onClose} className={item}>
              <span className={bubble}>
                <LayoutList className="size-6" />
              </span>
              Listings
            </Link>

            <button
              type="button"
              className={item}
              onClick={() => {
                onClose();
                onUpload();
              }}
            >
              <span className={bubble}>
                <Upload className="size-6" />
              </span>
              Upload
            </button>

            <Link to="/profile" onClick={onClose} className={item}>
              <span className={bubble}>
                <User className="size-6" />
              </span>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}