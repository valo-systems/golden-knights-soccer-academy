import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Lock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { ProductTile } from "@/components/shop/ProductTile";
import { useCart } from "@/shop/cart";
import { formatZAR } from "@/lib/utils";

function makeOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `GKSA-${new Date().getFullYear()}-${n}`;
}

export function Checkout() {
  const { items, subtotal_cents, clear } = useCart();
  const [order, setOrder] = useState<string | null>(null);

  // success screen
  if (order) {
    return (
      <section className="bg-background pt-36 pb-28 sm:pt-44">
        <div className="container-gk max-w-xl text-center">
          <CheckCircle2 className="mx-auto size-16 text-primary" />
          <h1 className="mt-6 font-heading text-4xl font-black text-foreground">
            Order confirmed!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for supporting the academy. Your order number is
          </p>
          <p className="mt-2 font-heading text-2xl font-black text-primary">{order}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            We will be in touch about payment and collection at the academy or delivery.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  // empty cart
  if (items.length === 0) {
    return (
      <section className="bg-background pt-36 pb-28 text-center sm:pt-44">
        <div className="container-gk">
          <ShoppingBag className="mx-auto size-14 text-muted-foreground" />
          <h1 className="mt-6 text-3xl text-foreground">Your bag is empty</h1>
          <Button asChild className="mt-6" size="lg">
            <Link to="/shop">Browse the shop</Link>
          </Button>
        </div>
      </section>
    );
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    // Mock order creation. With the real backend this POSTs to the API,
    // writes to MySQL (orders + order_items), decrements stock, and returns
    // the order number.
    const num = makeOrderNumber();
    setOrder(num);
    clear();
    window.scrollTo(0, 0);
  }

  return (
    <section className="bg-background pt-32 pb-24 sm:pt-40">
      <div className="container-gk">
        <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl">Checkout</h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* form */}
          <form onSubmit={placeOrder} className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-7">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Your details
              </h2>
              <div className="mt-5 space-y-4">
                <Field label="Full name" required>
                  <Input required placeholder="Your name" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" required>
                    <Input type="email" required placeholder="you@email.com" />
                  </Field>
                  <Field label="Phone" required>
                    <Input required placeholder="0xx xxx xxxx" />
                  </Field>
                </div>
                <Field label="Fulfilment">
                  <Select defaultValue="collect">
                    <option value="collect">Collect at the academy</option>
                    <option value="delivery">Delivery</option>
                  </Select>
                </Field>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7">
              <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                <Lock className="size-4" /> Payment
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Secure online payment is enabled at launch. For now, place your order and the
                academy will arrange payment and collection or delivery with you.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Place order, {formatZAR(subtotal_cents)}
            </Button>
          </form>

          {/* summary */}
          <div className="h-fit rounded-3xl border border-border bg-secondary p-7">
            <h2 className="text-lg font-bold text-foreground">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((it) => (
                <div key={it.key} className="flex items-center gap-3">
                  <ProductTile tone={it.tone} photo={it.photo} alt={it.name} className="size-14 rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.variantLabel} · Qty {it.qty}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {formatZAR(it.unit_cents * it.qty)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-heading text-2xl font-black text-foreground">
                {formatZAR(subtotal_cents)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
