import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type CurrencyCode = "USD" | "NGN";

const NGN_PER_USD = 1600;
const STORAGE_KEY = "gls-currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (next: CurrencyCode) => void;
  format: (amountUsd: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  format: (v) => `$${v.toFixed(2)}`,
  symbol: "$",
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "NGN" || stored === "USD") setCurrencyState(stored);
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const format = useCallback(
    (amountUsd: number) => {
      const value = currency === "NGN" ? amountUsd * NGN_PER_USD : amountUsd;
      const symbol = currency === "NGN" ? "₦" : "$";
      return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [currency],
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, format, symbol: currency === "NGN" ? "₦" : "$" }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div
      className={
        "inline-flex items-center rounded-full bg-primary-foreground/20 p-0.5 text-[11px] font-semibold " +
        (className ?? "")
      }
    >
      {(["USD", "NGN"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code)}
          className={
            "rounded-full px-2.5 py-1 transition-colors " +
            (currency === code ? "bg-primary-foreground/90 text-primary" : "opacity-80")
          }
        >
          {code === "USD" ? "$ USD" : "₦ NGN"}
        </button>
      ))}
    </div>
  );
}