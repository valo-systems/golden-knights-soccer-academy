import { useMemo, useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SortSelect } from "@/components/ui/sort-select";
import { ProductTile } from "@/components/shop/ProductTile";
import { CATEGORIES, type Category } from "@/data/products";
import { formatZAR } from "@/lib/utils";

type Sort = "featured" | "low" | "high";

export function Shop() {
  const { products: inventory } = useAdmin();
  usePageMeta({
    title: "Official Merchandise",
    description:
      "Shop official Golden Knights Soccer Academy merchandise. Jerseys, tracksuits, hoodies, caps, and accessories. Every purchase backs our players.",
    path: "/shop",
  });
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");

  const products = useMemo(() => {
    const liveInventory = inventory.filter((p) => p.active !== false);
    let list = cat === "all" ? liveInventory : liveInventory.filter((p) => p.category === cat);
    if (sort === "low") list = [...list].sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "high") list = [...list].sort((a, b) => b.price_cents - a.price_cents);
    return list;
  }, [cat, inventory, sort]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={
          <>
            Wear the <span className="text-primary">crest</span>
          </>
        }
        subtitle="Official academy merchandise. Every purchase backs our players."
      />

      <section className="bg-background py-14 sm:py-16">
        <div className="container-gk">
          {/* controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs
              tabs={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              active={cat}
              onChange={setCat}
            />
            <SortSelect
              options={[
                { value: "featured", label: "Featured" },
                { value: "low", label: "Price: low to high" },
                { value: "high", label: "Price: high to low" },
              ]}
              value={sort}
              onChange={setSort}
            />
          </div>

          {/* grid */}
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {products.map((p, i) => {
              const inStock = p.variants.some((v) => v.stock_qty > 0);
              return (
                <Reveal key={p.id} delay={i % 4}>
                  <Link to={`/shop/${p.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-3xl">
                      <ProductTile
                        tone={p.tone}
                        photo={p.photo}
                        alt={p.name}
                        className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {!inStock && (
                        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">
                          Out of stock
                        </span>
                      )}
                      <span className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {p.category}
                        </p>
                      </div>
                      <p className="font-heading text-lg font-black text-primary">
                        {formatZAR(p.price_cents)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
