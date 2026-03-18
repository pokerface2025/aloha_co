import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | ALOHA",
  description: "Accede con tu cuenta para continuar con tu compra.",
};

export default function LoginPage() {
  return <LoginForm />;
}
