# Shop / Merchandise, Page Content Spec (MySQL-backed)

| | |
|---|---|
| **Slug** | `/shop` (product at `/shop/{slug}`, cart `/cart`, checkout `/checkout`) |
| **In nav** | Yes |
| **Priority** | Phase 2/3, but built on a **real MySQL backend** from the start (mocked data now) |
| **Primary audience** | Community (parents, supporters) |
| **Page goal** | Showcase and sell academy merchandise; grow brand reach and a small revenue stream. |
| **Primary CTA** | Add to cart → Checkout |

GKSA already sells merchandise to parents and community members at tournaments and league games. This brings that online. **The store runs on MySQL.** For now we **mock the data** (seeded products, fake inventory, simulated checkout) but everything should *feel real*, real product pages, working cart, order confirmation, so it can flip to live with minimal change.

---

## Page sections

### Section 1, Hero
**Heading:** GKSA Shop · **Sub:** *Wear the crest. Back the academy.*

### Section 2, Product grid
- Cards: product image, name, price (ZAR), "Add to cart". Filter by category (Apparel, Training, Accessories) and sort by price/newest.
- "Out of stock" badge driven by inventory.

### Section 3, Product detail (`/shop/{slug}`)
- Image gallery, name, price, description, **variant selectors** (size, colour), quantity, "Add to cart", stock status, related products.

### Section 4, Cart (`/cart`)
- Line items (image, name, variant, qty, line total), update qty / remove, subtotal, "Proceed to checkout". Cart persists in session.

### Section 5, Checkout (`/checkout`)
- Customer details (name, email, phone), delivery vs. collect-at-academy, order summary, place order.
- **Mock payment:** simulated success (no real gateway yet). On submit → create order, show confirmation + order number, decrement stock.
- **Go-live note:** swap the mock step for a real SA gateway (Payfast / Yoco / Ozow) later, the rest stays.

### Section 6, Order confirmation
- Order number, summary, next steps (collection/delivery), contact line.

---

## Data model (MySQL)

Suggested schema. Engine InnoDB, charset utf8mb4. Prices stored in **cents (INT)** to avoid float errors; display as `R{value/100}`.

```sql
CREATE TABLE products (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(160) NOT NULL UNIQUE,
  name          VARCHAR(160) NOT NULL,
  description   TEXT,
  category      ENUM('apparel','training','accessories') NOT NULL DEFAULT 'apparel',
  price_cents   INT UNSIGNED NOT NULL,
  currency      CHAR(3) NOT NULL DEFAULT 'ZAR',
  image_url     VARCHAR(255),
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    INT UNSIGNED NOT NULL,
  sku           VARCHAR(64) NOT NULL UNIQUE,
  size          VARCHAR(20),            -- e.g. S, M, L, XL, '7','8'
  colour        VARCHAR(40),
  stock_qty     INT NOT NULL DEFAULT 0,
  price_cents   INT UNSIGNED,           -- NULL = inherit product price
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(20) NOT NULL UNIQUE,   -- e.g. GKSA-2026-000123
  customer_name   VARCHAR(160) NOT NULL,
  customer_email  VARCHAR(160) NOT NULL,
  customer_phone  VARCHAR(40),
  fulfilment      ENUM('collect','delivery') NOT NULL DEFAULT 'collect',
  subtotal_cents  INT UNSIGNED NOT NULL,
  status          ENUM('pending','paid','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
  payment_ref     VARCHAR(80),                   -- mock now, real gateway later
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      INT UNSIGNED NOT NULL,
  variant_id    INT UNSIGNED NOT NULL,
  product_name  VARCHAR(160) NOT NULL,   -- snapshot at purchase time
  variant_label VARCHAR(80),             -- e.g. "L / Red"
  unit_cents    INT UNSIGNED NOT NULL,
  quantity      INT UNSIGNED NOT NULL,
  line_cents    INT UNSIGNED NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);
```

**Relationships:** a product has many variants; an order has many order_items; each order_item points to a variant. Order items snapshot name/price so historical orders stay correct even if products change.

---

## Mock-but-real approach
- **Seed data:** 6–10 products with variants and believable stock (e.g. home/away jersey, training tee, tracksuit, hoodie, cap, scarf, drawstring bag, water bottle). Use the brand red and crest on mockup product images.
- **Real behaviour:** cart math, stock decrement on order, generated order numbers, confirmation emails (or simulated), all run for real against MySQL.
- **Simulated only:** payment capture. Mark orders `paid` via the mock step; keep `payment_ref` ready for the real gateway.
- **Admin (lightweight):** a simple protected view to list orders and toggle stock/active, even a read-only list makes it feel operational.
- **Config:** keep DB credentials in environment variables, never in code. Seed via a `seed.sql` script so the demo store can be rebuilt anytime.

---

## SEO
- **Title tag:** GKSA Shop | Golden Knights Soccer Academy Merchandise
- **Meta description:** Official Golden Knights Soccer Academy merchandise, jerseys, training wear, and accessories. Wear the crest and back the academy.
- Per-product title tags + descriptions; structured data (Product schema) for rich results later.

## Assets checklist
- [ ] Product list + prices (ZAR)
- [ ] Product images / mockups (branded)
- [ ] Variant options (sizes/colours) per product
- [ ] Fulfilment: collect-at-academy and/or delivery
- [ ] Payment gateway choice for go-live (Payfast / Yoco / Ozow)
- [ ] `seed.sql` with mock catalogue
