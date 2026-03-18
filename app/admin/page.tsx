import type { Metadata } from "next";
import { OrdersConsole } from "@/components/admin/orders-console";

export const metadata: Metadata = {
  title: "Admin | ALOHA",
  description: "Consola de administración para revisar órdenes de la tienda.",
};

export default function AdminPage() {
  return <OrdersConsole />;
}
