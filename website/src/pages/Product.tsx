import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTile } from "@/components/shop/ProductTile";
import { getProduct, CATALOG } from "@/data/products";
import { useCart } from "@/shop/cart";
import { formatZAR, cn } from "@/lib/utils";

export function Product() {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;
  const { add } = useCart();
  const [variantId, setVariantId] = useState<number | null>(
    product ? (product.variants.find((v) => v.stock_qty > 0)?.id ?? null) : null
  );

  if (!product) {
    return (
      <section className="container-gk py-40 text-center">
        <h1 className="text-3xl">Product not found</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </section>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const related = CATALOG.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  function addToCart() {
    if (!product || !variant) return;
    add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantLabel: variant.size,
      tone: product.tone,
      photo: product.photo,
      unit_cents: product.price_cents,
    });
  }

  return (
    <>
      <section className="bg-background pt-32 pb-20 sm:pt-40">
        <div className="container-gk">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to shop
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductTile
              tone={product.tone}
              photo={product.photo}
              alt={product.name}
              className="aspect-square w-full rounded-3xl"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {product.category}
              </p>
              <h1 className="mt-2 font-heading text-4xl font-black leading-tight text-foreground sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 font-heading text-3xl font-black text-primary">
                {formatZAR(product.price_cents)}
              </p>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* variants */}
              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground">
                  {product.variants[0].size === "One size" || product.variants.length === 1
                    ? "Option"
                    : "Size"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const oos = v.stock_qty <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={oos}
                        onClick={() => setVariantId(v.id)}
                        className={cn(
                          "min-w-12 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
                          v.id === variantId
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card text-foreground hover:border-primary",
                          oos && "cursor-not-allowed opacity-40 line-through"
                        )}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
                {variant && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {variant.stock_qty > 0 ? `${variant.stock_qty} in stock` : "Out of stock"}
                  </p>
                )}
              </div>

              <Button
                onClick={addToCart}
                size="lg"
                disabled={!variant || variant.stock_qty <= 0}
                className="mt-8 w-full sm:w-auto"
              >
                <ShoppingBag /> Add to bag
              </Button>

              <div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Truck className="size-4 text-primary" /> Collect at the academy or arrange
                  delivery.
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Official GKSA merchandise.
                </p>
                <p className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Every purchase supports our players.
                </p>
              </div>
            </div>
          </div>

          {/* related */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="text-2xl text-foreground">You might also like</h2>
              <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
                {related.map((p) => (
                  <Link key={p.id} to={`/shop/${p.slug}`} className="group block">
                    <ProductTile
                      tone={p.tone}
                      photo={p.photo}
                      alt={p.name}
                      className="aspect-square w-full rounded-3xl transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="mt-3 flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="font-heading text-lg font-black text-primary">
                        {formatZAR(p.price_cents)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
