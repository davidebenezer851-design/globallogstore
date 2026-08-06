import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFundWallet } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";

const PRESETS = [10, 25, 50, 100];

export function FundWalletModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const fund = useFundWallet();
  const { user } = useAuth();

  const submit = async () => {
    if (!user) {
      toast.error("Sign in to fund your wallet.");
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    try {
      const balance = await fund.mutateAsync(value);
      toast.success(`Wallet funded. New balance $${balance.toFixed(2)}`);
      setAmount("");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Funding failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Fund wallet</DialogTitle>
          <DialogDescription>Add funds to buy logs on the marketplace.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p}
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={() => setAmount(String(p))}
              >
                ${p}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            className="w-full rounded-full"
            onClick={() => void submit()}
            disabled={fund.isPending}
          >
            {fund.isPending && <Loader2 className="size-4 animate-spin" />}
            Add funds
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
