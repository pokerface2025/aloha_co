"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { formatPrice } from "@/lib/products";

type AdminOrderItem = {
  productId: string;
  variantSku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type AdminOrder = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  department: string;
  postalCode: string;
  saveInfo?: boolean;
  shippingMethod: string;
  productsSubtotal: number;
  shippingCost: number;
  shippingMode?: string;
  shippingNote?: string;
  status: string;
  notes?: string;
  items: AdminOrderItem[];
  paymentReferenceId?: string;
  callbackUrl?: string;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

const getStatusTone = (status: string) => {
  switch (status.toUpperCase()) {
    case "APPROVED":
    case "PAID":
      return "bg-emerald-500/12 text-emerald-700 border-emerald-600/20";
    case "PENDING":
    case "PENDING_PAYMENT":
      return "bg-amber-500/12 text-amber-700 border-amber-600/20";
    case "REJECTED":
    case "FAILED":
      return "bg-rose-500/12 text-rose-700 border-rose-600/20";
    default:
      return "bg-slate-500/10 text-slate-700 border-slate-600/20";
  }
};

export function OrdersConsole() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const isExpired = useAuthStore((state) => state.isExpired);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || isExpired()) {
      clearSession();
      router.replace("/login?redirect=/admin");
    }
  }, [clearSession, isExpired, router, session]);

  const loadOrders = async () => {
    if (!session?.token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders/list", {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "No se pudo cargar la lista de órdenes.");
      }

      const nextOrders = Array.isArray(data) ? (data as AdminOrder[]) : [];
      setOrders(nextOrders);
      setSelectedId((current) => current || nextOrders[0]?._id || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, [session?.token]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return orders;
    }

    return orders.filter((order) =>
      [
        order._id,
        order.firstName,
        order.lastName,
        order.email,
        order.phone,
        order.status,
        order.paymentReferenceId || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [orders, search]);

  const selectedOrder =
    filteredOrders.find((order) => order._id === selectedId) || filteredOrders[0] || null;

  useEffect(() => {
    if (selectedOrder && selectedOrder._id !== selectedId) {
      setSelectedId(selectedOrder._id);
    }
  }, [selectedId, selectedOrder]);

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Admin Console</p>
          <h1 className="font-serif text-4xl text-foreground">Control de órdenes</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Consola conectada a `orders/list` para revisar pedidos, pagos y datos de entrega.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => void loadOrders()} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              clearSession();
              router.push("/login?redirect=/admin");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur">
          <p className="text-sm text-muted-foreground">Total órdenes</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{orders.length}</p>
        </div>
        <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur">
          <p className="text-sm text-muted-foreground">Aprobadas</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {orders.filter((order) => ["APPROVED", "PAID"].includes(order.status.toUpperCase())).length}
          </p>
        </div>
        <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {
              orders.filter((order) =>
                ["PENDING", "PENDING_PAYMENT"].includes(order.status.toUpperCase())
              ).length
            }
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por ID, cliente, email, teléfono, estado..."
          className="md:max-w-md"
        />
        <p className="text-sm text-muted-foreground">
          Sesión: {session.username} ({session.email})
        </p>
      </div>

      {error ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-[2rem] border border-white/20 bg-white/60 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Pedidos</h2>
            <span className="text-sm text-muted-foreground">{filteredOrders.length} visibles</span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <p className="rounded-2xl border border-border/60 p-4 text-sm text-muted-foreground">
                Cargando órdenes...
              </p>
            ) : null}

            {!isLoading && filteredOrders.length === 0 ? (
              <p className="rounded-2xl border border-border/60 p-4 text-sm text-muted-foreground">
                No hay órdenes para mostrar.
              </p>
            ) : null}

            {filteredOrders.map((order) => (
              <button
                key={order._id}
                type="button"
                onClick={() => setSelectedId(order._id)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedOrder?._id === order._id
                    ? "border-foreground/20 bg-foreground/5"
                    : "border-border/60 hover:bg-background/70"
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${getStatusTone(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{order._id}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatDate(order.updatedAt)}</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(order.productsSubtotal + order.shippingCost)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/20 bg-white/60 p-6 backdrop-blur">
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Orden seleccionada
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{selectedOrder._id}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Creada {formatDate(selectedOrder.createdAt)}. Actualizada {formatDate(selectedOrder.updatedAt)}.
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${getStatusTone(selectedOrder.status)}`}
                  >
                    {selectedOrder.status}
                  </span>
                  {selectedOrder.paymentReferenceId ? (
                    <p className="text-sm text-muted-foreground">
                      Ref pago: {selectedOrder.paymentReferenceId}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 rounded-2xl border border-border/60 p-4">
                  <p className="font-medium text-foreground">Cliente</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.firstName} {selectedOrder.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                </div>

                <div className="space-y-3 rounded-2xl border border-border/60 p-4">
                  <p className="font-medium text-foreground">Entrega</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.address}
                    {selectedOrder.apartment ? `, ${selectedOrder.apartment}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.city}, {selectedOrder.department}
                  </p>
                  <p className="text-sm text-muted-foreground">CP: {selectedOrder.postalCode || "N/A"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">Items</p>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={`${selectedOrder._id}-${item.variantSku}`}
                      className="grid gap-2 rounded-2xl border border-border/60 p-4 md:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.productId}</p>
                        <p className="text-xs text-muted-foreground">{item.variantSku}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Talla: {item.size}</p>
                      <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 p-4">
                  <p className="font-medium text-foreground">Totales</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatPrice(selectedOrder.productsSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-foreground">{formatPrice(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/60 pt-2 font-medium">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.productsSubtotal + selectedOrder.shippingCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 p-4">
                  <p className="font-medium text-foreground">Meta</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>Método: {selectedOrder.shippingMethod}</p>
                    <p>Modo envío: {selectedOrder.shippingMode || "N/A"}</p>
                    <p>Nota envío: {selectedOrder.shippingNote || "N/A"}</p>
                    <p>Notas: {selectedOrder.notes || "Sin notas"}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.callbackUrl ? (
                <div className="rounded-2xl border border-border/60 p-4 text-sm text-muted-foreground">
                  Callback:{" "}
                  <Link href={selectedOrder.callbackUrl} className="text-primary hover:underline">
                    {selectedOrder.callbackUrl}
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-border/70">
              <p className="text-sm text-muted-foreground">Selecciona una orden para ver sus detalles.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
