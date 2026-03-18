"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, CreditCard, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/lib/store";
import { formatPrice, COLOMBIAN_DEPARTMENTS, getProductById } from "@/lib/products";

type CheckoutStep = "information" | "shipping" | "payment";

const ORDER_STORAGE_PREFIX = "aloha:order:";
const LAST_ORDER_KEY = "aloha:lastOrder";

const buildOrderId = () =>
  `ALOHA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export function CheckoutForm() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    department: "",
    postalCode: "",
    saveInfo: false,
    shippingMethod: "standard",
    notes: "",
  });

  const subtotal = getSubtotal();
  const shippingMode = subtotal >= 150000 ? "free" : "flat_rate";
  const shippingCost = shippingMode === "free" ? 0 : 15000;
  const shippingNote =
    shippingMode === "free"
      ? "Envío gratis"
      : "Envío $15.000 COP";
  const totalDueNow = subtotal + shippingCost;
  const checkoutItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId);
          if (!product) {
            return null;
          }

          return {
            product,
            productId: item.productId,
            variantSku: item.variantSku,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: product.price,
            lineTotal: product.price * item.quantity,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [items]
  );

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateInformationStep = () => {
    if (!formData.email.trim()) return "El email es obligatorio.";
    if (!formData.phone.trim()) return "El teléfono es obligatorio.";
    if (!formData.firstName.trim()) return "El nombre es obligatorio.";
    if (!formData.lastName.trim()) return "El apellido es obligatorio.";
    if (!formData.address.trim()) return "La dirección es obligatoria.";
    if (!formData.city.trim()) return "La ciudad es obligatoria.";
    if (!formData.department.trim()) return "Selecciona un departamento.";
    return "";
  };

  const handleSubmit = async () => {
    setCheckoutError("");
    setIsProcessing(true);

    try {
      const validationError = validateInformationStep();
      if (validationError) {
        setStep("information");
        throw new Error(validationError);
      }

      if (checkoutItems.length === 0) {
        throw new Error("Tu carrito no tiene productos válidos para procesar.");
      }

      const orderId = buildOrderId();
      const callbackUrl = "https://google.com";
      const primaryImage = checkoutItems[0]?.product.media[0]?.url;
      const orderRecord = {
        _id: orderId,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          neighborhood: formData.department || "N/A",
          addressLine: formData.address,
          notes: [formData.apartment, formData.postalCode, formData.notes]
            .filter(Boolean)
            .join(" | "),
        },
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
        productsSubtotal: subtotal,
        shippingCost,
        shippingMode,
        shippingNote,
        totalDueNow,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(
          `${ORDER_STORAGE_PREFIX}${orderId}`,
          JSON.stringify(orderRecord)
        );
        localStorage.setItem(LAST_ORDER_KEY, orderId);
      } catch (storageError) {
        console.warn("No se pudo guardar la orden en localStorage", storageError);
      }

      const orderResponse = await fetch("/api/orders/reg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          address: formData.address.trim(),
          apartment: formData.apartment.trim(),
          city: formData.city.trim(),
          department: formData.department,
          postalCode: formData.postalCode.trim(),
          saveInfo: formData.saveInfo,
          shippingMethod: shippingMode === "free" ? "Envío Estándar Gratis" : "Envío Estándar",
          productsSubtotal: subtotal,
          shippingCost,
          shippingMode,
          shippingNote,
          notes: formData.notes.trim(),
          callbackUrl,
          imgUrl: primaryImage ? `${window.location.origin}${primaryImage}` : window.location.origin,
          items: checkoutItems.map((item) => ({
            productId: item.productId,
            variantSku: item.variantSku,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        }),
      });

      const orderData = await orderResponse.json().catch(() => null);
      if (!orderResponse.ok) {
        throw new Error(orderData?.error || orderData?.message || "No se pudo registrar la orden.");
      }

      clearCart();

      if (typeof orderData?.link === "string" && orderData.link) {
        window.location.href = orderData.link;
        return;
      }

      throw new Error("La orden fue creada pero no llegó el link de pago.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado";
      setCheckoutError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Tu carrito está vacío</h1>
          <Link href="/shop">
            <Button>Ir a la tienda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Column - Form */}
          <div className="p-6 lg:p-12 order-2 lg:order-1">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
                ALOHA
              </Link>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                Carrito
              </Link>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => setStep("information")}
                className={step === "information" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}
              >
                Información
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => step !== "information" && setStep("shipping")}
                className={step === "shipping" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}
                disabled={step === "information"}
              >
                Envío
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => step === "payment" && setStep("payment")}
                className={step === "payment" ? "text-foreground font-medium" : "text-muted-foreground"}
                disabled={step !== "payment"}
              >
                Pago
              </button>
            </nav>

            {/* Information Step */}
            {step === "information" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Información de contacto</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+57 300 123 4567"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Dirección de envío</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        placeholder="Calle 72 #10-25"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apartment">Apartamento, suite, etc. (opcional)</Label>
                      <Input
                        id="apartment"
                        placeholder="Apto 301"
                        value={formData.apartment}
                        onChange={(e) => updateField("apartment", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          placeholder="Barranquilla"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Departamento</Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) => updateField("department", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLOMBIAN_DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Código postal (opcional)</Label>
                      <Input
                        id="postalCode"
                        placeholder="080001"
                        value={formData.postalCode}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="saveInfo"
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) => updateField("saveInfo", checked as boolean)}
                      />
                      <Label htmlFor="saveInfo" className="text-sm font-normal">
                        Guardar esta información para la próxima vez
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al carrito
                  </Link>
                  <Button onClick={() => setStep("shipping")} size="lg">
                    Continuar a envío
                  </Button>
                </div>
              </div>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Método de envío</h2>
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-medium text-foreground">
                      {shippingMode === "free" ? "Envío gratis" : "Envío $15.000 COP"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {shippingNote}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Envío gratis desde $150.000 COP.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep("information")}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a información
                  </button>
                  <Button onClick={() => setStep("payment")} size="lg">
                    Continuar a pago
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Pago seguro</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Powered by Bold
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-5 w-5 text-foreground" />
                      <span className="font-medium text-foreground">
                        Serás redirigido a Bold para pagar
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No ingreses tu tarjeta aquí. Al continuar, Bold abrirá su página segura
                      para completar el pago.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-border p-4">
                  <Label htmlFor="notes">Notas del pedido (opcional)</Label>
                  <Input
                    id="notes"
                    placeholder="Indicaciones de entrega, referencia, etc."
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                  />
                </div>

                {/* Security badges */}
                <div className="flex items-center gap-4 py-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Envío rastreado</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a envío
                  </button>
                  <div className="flex flex-col items-end gap-2">
                    {checkoutError && (
                      <p className="text-sm text-destructive">{checkoutError}</p>
                    )}
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      disabled={isProcessing}
                    >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </span>
                    ) : (
                      `Pagar ${formatPrice(totalDueNow)}`
                    )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-secondary/30 p-6 lg:p-12 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Resumen del pedido</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                return (
                <div key={item.variantSku} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.media[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <p className="font-medium text-foreground text-sm">
                    {formatPrice(
                      product.price * item.quantity
                    )}
                  </p>
                </div>
              )})}
            </div>

            {/* Discount Code */}
            <div className="flex gap-2 mb-6">
              <Input placeholder="Código de descuento" className="flex-1" />
              <Button variant="outline">Aplicar</Button>
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal productos</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-foreground">
                  {shippingMode === "free" ? "Gratis" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                <span className="text-foreground">Total a pagar ahora</span>
                <span className="text-foreground">{formatPrice(totalDueNow)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Incluye {formatPrice(Math.round(totalDueNow * 0.19))} de IVA
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-8 p-4 bg-background rounded-lg">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Garantía de satisfacción
                  </p>
                  <p className="text-xs text-muted-foreground">
                    30 días para cambios o devoluciones sin complicaciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
