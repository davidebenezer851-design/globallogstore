import { createContext, useContext, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { UploadLogModal } from "@/components/UploadLogModal";
import { FundWalletModal } from "@/components/FundWalletModal";
import { QuickMenu } from "@/components/QuickMenu";
import { CurrencyProvider } from "@/hooks/useCurrency";

type ShellContextValue = {
  openUpload: () => void;
  openFund: () => void;
  openMenu: () => void;
};

const ShellContext = createContext<ShellContextValue>({
  openUpload: () => {},
  openFund: () => {},
  openMenu: () => {},
});

export const useShell = () => useContext(ShellContext);

export function AppShell({ children }: { children: ReactNode }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ShellContext.Provider
      value={{
        openUpload: () => setUploadOpen(true),
        openFund: () => setFundOpen(true),
        openMenu: () => setMenuOpen(true),
      }}
    >
      <CurrencyProvider>
        <div className="min-h-screen pb-32">
          <AppHeader />
          <main className="mx-auto w-full max-w-6xl px-4 pt-6">{children}</main>
          <BottomNav />
          <QuickMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onFund={() => setFundOpen(true)}
            onUpload={() => setUploadOpen(true)}
          />
          <UploadLogModal open={uploadOpen} onOpenChange={setUploadOpen} />
          <FundWalletModal open={fundOpen} onOpenChange={setFundOpen} />
        </div>
      </CurrencyProvider>
    </ShellContext.Provider>
  );
}
