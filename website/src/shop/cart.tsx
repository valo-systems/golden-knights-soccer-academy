import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  key: string; // productId-variantId
  productId: number;
  variantId: number;
  slug: string;
  name: string;
  variantLabel: string;
  tone: "red" | "dark" | "light";
  photo?: string;
  unit_cents: number;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal_cents: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "gksa-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextType>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal_cents = items.reduce((n, i) => n + i.qty * i.unit_cents, 0);
    return {
      items,
      count,
      subtotal_cents,
      open,
      setOpen,
      add: (item, qty = 1) => {
        const key = `${item.productId}-${item.variantId}`;
        setItems((prev) => {
          const existing = prev.find((p) => p.key === key);
          if (existing) {
            return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + qty } : p));
          }
          return [...prev, { ...item, key, qty }];
        });
        setOpen(true);
      },
      remove: (key) => setItems((prev) => prev.filter((p) => p.key !== key)),
      setQty: (key, qty) =>
        setItems((prev) =>
          prev
            .map((p) => (p.key === key ? { ...p, qty: Math.max(1, qty) } : p))
            .filter((p) => p.qty > 0)
        ),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
