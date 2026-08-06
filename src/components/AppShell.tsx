import { createContext, useContext, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { UploadLogModal } from "@/components/UploadLogModal";
import { FundWalletModal } from "@/components/FundWalletModal";

type ShellContextValue = {
  openUpload: () => void;
  openFund: () => void;
};

const ShellContext = createContext<ShellContextValue>({
  openUpload: () => {},
  openFund: () => {},
});

export const useShell = () => useContext(ShellContext);

export function AppShell({ children }: { children: ReactNode }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);

  return (
    <ShellContext.Provider
      value={{ openUpload: () => setUploadOpen(true), openFund: () => setFundOpen(true) }}
    >
      <div className="min-h-screen pb-32">
        <AppHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pt-6">{children}</main>
        <BottomNav />
        <UploadLogModal open={uploadOpen} onOpenChange={setUploadOpen} />
        <FundWalletModal open={fundOpen} onOpenChange={setFundOpen} />
      </div>
    </ShellContext.Provider>
  );
}
