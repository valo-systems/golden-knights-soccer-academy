import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/shop/cart";
import { Button } from "@/components/ui/button";
import { ProductTile } from "./ProductTile";
import { formatZAR } from "@/lib/utils";

export function CartDrawer() {
  const { open, setOpen, items, subtotal_cents, setQty, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
                <ShoppingBag className="size-5 text-primary" /> Your bag
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 hover:bg-secondary"
              >
                <X />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="size-12 text-muted-foreground" />
                <p className="text-muted-foreground">Your bag is empty.</p>
                <Button onClick={() => setOpen(false)} asChild>
                  <Link to="/shop">Browse the shop</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((it) => (
                    <div key={it.key} className="flex gap-4">
                      <Link
                        to={`/shop/${it.slug}`}
                        onClick={() => setOpen(false)}
                        className="shrink-0"
                      >
                        <ProductTile tone={it.tone} photo={it.photo} alt={it.name} className="size-20 rounded-xl" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{it.name}</p>
                            <p className="text-xs text-muted-foreground">{it.variantLabel}</p>
                          </div>
                          <button
                            onClick={() => remove(it.key)}
                            className="text-muted-foreground hover:text-primary"
                            aria-label="Remove"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              onClick={() => setQty(it.key, it.qty - 1)}
                              className="px-2 py-1.5 hover:text-primary"
                              aria-label="Decrease"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{it.qty}</span>
                            <button
                              onClick={() => setQty(it.key, it.qty + 1)}
                              className="px-2 py-1.5 hover:text-primary"
                              aria-label="Increase"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {formatZAR(it.unit_cents * it.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-heading text-2xl font-black text-foreground">
                      {formatZAR(subtotal_cents)}
                    </span>
                  </div>
                  <Button asChild size="lg" className="mt-4 w-full" onClick={() => setOpen(false)}>
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
