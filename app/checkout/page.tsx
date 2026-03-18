import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | ALOHA",
  description: "Complete your purchase securely",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
