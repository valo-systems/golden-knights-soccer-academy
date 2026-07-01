import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Eye,
  ImagePlus,
  PackageCheck,
  Pencil,
  Plus,
  RotateCcw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { getPendingOrders, useAdmin } from "@/admin/store";
import type { AdminOrder } from "@/admin/types";
import {
  CATEGORIES,
  toneForCategory,
  type Category,
  type Product,
  type Variant,
} from "@/data/products";
import { ProductTile } from "@/components/shop/ProductTile";
import {
  AdminActionGroup,
  AdminHeader,
  AdminIconButton,
  Card,
  Modal,
  formatDate,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { cn, formatZAR } from "@/lib/utils";

type Tab = "inventory" | "orders";

type ProductForm = {
  id?: number;
  slug?: string;
  name: string;
  description: string;
  category: Category;
  price: string;
  photo: string;
  active: boolean;
  variantMode: "sizes" | "one";
  stockQty: string;
  variants: Array<{
    id: number;
    sku: string;
    size: string;
    stockQty: string;
  }>;
};

const emptyProductForm: ProductForm = {
  name: "",
  description: "",
  category: "apparel",
  price: "",
  photo: "",
  active: true,
  variantMode: "sizes",
  stockQty: "10",
  variants: [],
};

export function AdminOrders() {
  const { products, orders, addProduct, updateProduct, updateOrderStatus } = useAdmin();
  const [tab, setTab] = useState<Tab>("inventory");
  const [draft, setDraft] = useState<ProductForm | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const activeProducts = products.filter((product) => product.active !== false);
  const totalStock = products.reduce((sum, product) => sum + productStock(product), 0);
  const pendingOrders = getPendingOrders(orders);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  function openAdd() {
    setDraft({ ...emptyProductForm });
  }

  function openEdit(product: Product) {
    setDraft(formFromProduct(product));
  }

  function closeForm() {
    setDraft(null);
  }

  function saveProduct(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (draft.id) {
      updateProduct(productFromForm(draft));
    } else {
      addProduct({
        name: draft.name,
        description: draft.description,
        category: draft.category,
        priceCents: randToCents(draft.price),
        photo: draft.photo || undefined,
        active: draft.active,
        variantMode: draft.variantMode,
        stockQty: Number(draft.stockQty) || 0,
      });
    }
    closeForm();
  }

  return (
    <>
      <AdminHeader
        title="Shop"
        subtitle="Manage inventory, prices and shop orders."
        actions={
          <>
            <Button asChild type="button" variant="outline" className="border-[#e7e2dc] bg-white">
              <Link to="/shop" target="_blank">
                <ShoppingBag /> View live shop
              </Link>
            </Button>
            <Button type="button" onClick={openAdd}>
              <Plus /> Add item
            </Button>
          </>
        }
      />

      <Card className="mb-5 border-[#e7e2dc] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(17,18,23,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#34363d]">
            {activeProducts.length} live items - {totalStock} units in stock -{" "}
            {pendingOrders.length} {pendingOrders.length === 1 ? "order needs" : "orders need"} review
          </p>
          <div className="flex rounded-full border border-[#e7e2dc] bg-[#fbfaf8] p-1">
            {(["inventory", "orders"] as Tab[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-black capitalize transition",
                  tab === item ? "bg-[#111217] text-white" : "text-[#6b6f76] hover:text-[#111217]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {tab === "inventory" ? (
        <InventoryView products={products} onEdit={openEdit} />
      ) : (
        <OrdersView
          orders={orders}
          onOpen={setSelectedOrderId}
          onStatus={updateOrderStatus}
        />
      )}

      <Modal
        title={draft?.id ? "Edit inventory item" : "Add inventory item"}
        open={!!draft}
        onClose={closeForm}
      >
        {draft && (
          <ProductFormModal
            draft={draft}
            onChange={setDraft}
            onSubmit={saveProduct}
          />
        )}
      </Modal>

      <Modal
        title={selectedOrder?.orderNumber ?? "Order"}
        open={!!selectedOrder}
        onClose={() => setSelectedOrderId(null)}
      >
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onStatus={(status) => updateOrderStatus(selectedOrder.id, status)}
          />
        )}
      </Modal>
    </>
  );
}

function InventoryView({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
}) {
  return (
    <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
            <tr>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Variants</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee8e2]">
            {products.map((product) => (
              <tr
                key={product.id}
                data-product-id={product.id}
                className="hover:bg-[#fbfaf8]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ProductTile
                      tone={product.tone}
                      photo={product.photo}
                      alt={product.name}
                      className="size-14 rounded-xl"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#111217]">{product.name}</p>
                      <p className="mt-1 text-xs capitalize text-[#6b6f76]">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-bold text-[#111217]">
                  {formatZAR(product.price_cents)}
                </td>
                <td className="px-5 py-4 text-[#6b6f76]">{variantSummary(product)}</td>
                <td className="px-5 py-4">
                  <StockText product={product} />
                </td>
                <td className="px-5 py-4">
                  <ProductStatus active={product.active !== false} />
                </td>
                <td className="px-5 py-4 text-right">
                  <AdminIconButton
                    label="Edit item"
                    icon={Pencil}
                    data-product-edit={product.id}
                    onClick={() => onEdit(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-[#e7e2dc] bg-white p-4 shadow-[0_10px_26px_rgba(17,18,23,0.04)]"
          >
            <div className="flex gap-3">
              <ProductTile
                tone={product.tone}
                photo={product.photo}
                alt={product.name}
                className="size-20 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#111217]">{product.name}</p>
                <p className="mt-1 text-xs capitalize text-[#6b6f76]">{product.category}</p>
                <p className="mt-2 font-heading text-xl font-black text-[#111217]">
                  {formatZAR(product.price_cents)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#6b6f76]">
              <span>{variantSummary(product)}</span>
              <span>·</span>
              <StockText product={product} />
              <ProductStatus active={product.active !== false} />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>
          </article>
        ))}
      </div>
    </Card>
  );
}

function OrdersView({
  orders,
  onOpen,
  onStatus,
}: {
  orders: AdminOrder[];
  onOpen: (id: string) => void;
  onStatus: (id: string, status: AdminOrder["status"]) => void;
}) {
  const totalPending = getPendingOrders(orders).reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
      <div className="border-b border-[#eee8e2] px-5 py-4">
        <p className="text-sm font-semibold text-[#34363d]">
          {orders.length} orders - {formatZAR(totalPending)} pending
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="sticky right-0 bg-[#fbfaf8] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee8e2]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#fbfaf8]">
                <td className="px-4 py-4 font-bold text-[#111217]">{order.orderNumber}</td>
                <td className="px-4 py-4 text-[#111217]">{order.customerName}</td>
                <td className="px-4 py-4 text-[#6b6f76]">
                  <OrderItems order={order} />
                </td>
                <td className="px-4 py-4 font-bold text-[#111217]">
                  {formatZAR(order.totalCents)}
                </td>
                <td className="px-4 py-4">
                  <OrderStatusBadge order={order} />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-[#6b6f76]">
                  {formatDate(order.createdAt)}
                </td>
                <td className="sticky right-0 bg-white px-4 py-4 shadow-[-12px_0_18px_rgba(255,255,255,0.85)]">
                  <OrderActions
                    order={order}
                    onOpen={() => onOpen(order.id)}
                    onStatus={(status) => onStatus(order.id, status)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OrderActions({
  order,
  onOpen,
  onStatus,
  showView = true,
}: {
  order: AdminOrder;
  onOpen: () => void;
  onStatus: (status: AdminOrder["status"]) => void;
  showView?: boolean;
}) {
  const hasLifecycleAction =
    order.status === "pending" || order.status === "paid" || order.status === "cancelled";
  if (!hasLifecycleAction && !showView) {
    return <span className="text-xs font-bold text-[#6b6f76]">Complete</span>;
  }

  return (
    <AdminActionGroup>
      {order.status === "pending" && (
        <>
          <AdminIconButton
            label="Mark paid"
            icon={CreditCard}
            tone="primary"
            onClick={() => onStatus("paid")}
          />
          <AdminIconButton
            label="Cancel order"
            icon={XCircle}
            tone="danger"
            onClick={() => onStatus("cancelled")}
          />
        </>
      )}
      {order.status === "paid" && (
        <AdminIconButton
          label="Fulfil order"
          icon={PackageCheck}
          tone="success"
          onClick={() => onStatus("fulfilled")}
        />
      )}
      {order.status === "cancelled" && (
        <AdminIconButton
          label="Reopen order"
          icon={RotateCcw}
          onClick={() => onStatus("pending")}
        />
      )}
      {showView && <AdminIconButton label="View order" icon={Eye} onClick={onOpen} />}
    </AdminActionGroup>
  );
}

function OrderDetail({
  order,
  onStatus,
}: {
  order: AdminOrder;
  onStatus: (status: AdminOrder["status"]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-[#e7e2dc] bg-[#fbfaf8] p-5 text-sm sm:grid-cols-2">
        <Info label="Customer" value={order.customerName} />
        <Info label="Status" value={<OrderStatusBadge order={order} />} />
        <Info label="Created" value={formatDate(order.createdAt)} />
        <Info label="Total" value={formatZAR(order.totalCents)} />
      </div>

      <div>
        <p className="text-sm font-bold text-[#111217]">Items</p>
        <div className="mt-2 divide-y divide-[#eee8e2] rounded-2xl border border-[#e7e2dc] bg-white">
          {(order.items ?? []).map((item) => (
            <div
              key={`${order.id}-${item.productId}-${item.variantLabel}`}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-bold text-[#111217]">{item.productName}</p>
                <p className="text-xs text-[#6b6f76]">
                  {item.variantLabel} x {item.qty}
                </p>
              </div>
              <p className="font-bold text-[#111217]">{formatZAR(item.qty * item.unitCents)}</p>
            </div>
          ))}
          {!order.items?.length && (
            <div className="px-4 py-3 text-sm text-[#6b6f76]">{order.itemsCount} items</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#e7e2dc] bg-white p-4">
        <p className="text-sm font-bold text-[#111217]">Fulfilment</p>
        <OrderActions
          order={order}
          showView={false}
          onOpen={() => undefined}
          onStatus={onStatus}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b6f76]">{label}</p>
      <div className="mt-1 font-semibold text-[#111217]">{value}</div>
    </div>
  );
}

function ProductFormModal({
  draft,
  onChange,
  onSubmit,
}: {
  draft: ProductForm;
  onChange: (draft: ProductForm) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const isEditing = draft.id != null;

  function update(patch: Partial<ProductForm>) {
    onChange({ ...draft, ...patch });
  }

  function updateVariant(id: number, stockQty: string) {
    update({
      variants: draft.variants.map((variant) =>
        variant.id === id ? { ...variant, stockQty } : variant
      ),
    });
  }

  function usePhotoFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") update({ photo: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[11rem_1fr]">
        <ProductTile
          tone={toneForCategory(draft.category)}
          photo={draft.photo || undefined}
          alt={draft.name}
          className="aspect-square w-full rounded-2xl"
        />
        <div className="space-y-4">
          <Field label="Item name" required>
            <Input
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Match day scarf"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <Select
                value={draft.category}
                onChange={(e) => update({ category: e.target.value as Category })}
              >
                {CATEGORIES.filter((category) => category.value !== "all").map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Price (R)" required>
              <Input
                inputMode="decimal"
                value={draft.price}
                onChange={(e) => update({ price: e.target.value })}
                placeholder="250"
              />
            </Field>
          </div>
        </div>
      </div>

      <Field label="Short description" required>
        <Textarea
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="A simple description for the live shop."
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="Photo URL" optional>
          <Input
            value={draft.photo}
            onChange={(e) => update({ photo: e.target.value })}
            placeholder="https://..."
          />
        </Field>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#e7e2dc] bg-white px-5 text-sm font-semibold text-[#111217] transition hover:bg-[#f8f5f2]">
          <ImagePlus className="size-4" />
          Choose photo
          <input type="file" accept="image/*" className="sr-only" onChange={usePhotoFile} />
        </label>
      </div>

      {!isEditing && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Variant type" required>
            <Select
              value={draft.variantMode}
              onChange={(e) => update({ variantMode: e.target.value as ProductForm["variantMode"] })}
            >
              <option value="sizes">Clothing sizes</option>
              <option value="one">One size</option>
            </Select>
          </Field>
          <Field label="Starting stock" required>
            <Input
              inputMode="numeric"
              value={draft.stockQty}
              onChange={(e) => update({ stockQty: e.target.value })}
            />
          </Field>
        </div>
      )}

      {isEditing && (
        <div>
          <p className="mb-2 text-sm font-bold text-[#111217]">Stock</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {draft.variants.map((variant) => (
              <label
                key={variant.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#e7e2dc] bg-[#fbfaf8] px-4 py-3"
              >
                <span>
                  <span className="block text-sm font-bold text-[#111217]">{variant.size}</span>
                  <span className="block text-xs text-[#6b6f76]">{variant.sku}</span>
                </span>
                <Input
                  inputMode="numeric"
                  value={variant.stockQty}
                  onChange={(e) => updateVariant(variant.id, e.target.value)}
                  className="w-24 bg-white text-right"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-semibold text-[#34363d]">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(e) => update({ active: e.target.checked })}
          className="size-4 accent-[#111217]"
        />
        Show this item in the live shop
      </label>

      <Button type="submit" size="lg" className="w-full">
        {isEditing ? "Save live shop update" : "Add item to shop"}
      </Button>
    </form>
  );
}

function ProductStatus({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-black",
        active ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"
      )}
    >
      {active ? "Live" : "Hidden"}
    </span>
  );
}

function StockText({ product }: { product: Product }) {
  const stock = productStock(product);
  return (
    <span className={cn("font-bold", stock === 0 ? "text-[#b91c1c]" : "text-[#34363d]")}>
      {stock} in stock
    </span>
  );
}

function OrderItems({ order }: { order: AdminOrder }) {
  if (!order.items?.length) return <span>{order.itemsCount} items</span>;
  return (
    <div className="space-y-1">
      {order.items.map((item) => (
        <p key={`${order.id}-${item.productId}-${item.variantLabel}`}>
          {item.qty} x {item.productName} ({item.variantLabel})
        </p>
      ))}
    </div>
  );
}

function OrderStatusBadge({ order }: { order: AdminOrder }) {
  const cls: Record<AdminOrder["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-blue-100 text-blue-700",
    fulfilled: "bg-green-100 text-green-700",
    cancelled: "bg-zinc-200 text-zinc-600",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-black", cls[order.status])}>
      {statusLabel(order.status)}
    </span>
  );
}

function statusLabel(status: AdminOrder["status"]) {
  if (status === "pending") return "Pending";
  if (status === "paid") return "Paid";
  if (status === "fulfilled") return "Fulfilled";
  return "Cancelled";
}

function formFromProduct(product: Product): ProductForm {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    price: centsToRandInput(product.price_cents),
    photo: product.photo ?? "",
    active: product.active !== false,
    variantMode: product.variants.length > 1 ? "sizes" : "one",
    stockQty: "10",
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      stockQty: String(variant.stock_qty),
    })),
  };
}

function productFromForm(form: ProductForm): Product {
  return {
    id: form.id ?? 0,
    slug: form.slug ?? "",
    name: form.name,
    description: form.description,
    category: form.category,
    price_cents: randToCents(form.price),
    active: form.active,
    tone: toneForCategory(form.category),
    photo: form.photo || undefined,
    variants: form.variants.map((variant): Variant => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      stock_qty: Math.max(0, Math.round(Number(variant.stockQty) || 0)),
    })),
  };
}

function productStock(product: Product) {
  return product.variants.reduce((sum, variant) => sum + variant.stock_qty, 0);
}

function variantSummary(product: Product) {
  return product.variants.map((variant) => variant.size).join(", ");
}

function centsToRandInput(cents: number) {
  return String(cents / 100);
}

function randToCents(value: string) {
  const amount = Number(value.replace(",", "."));
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}
