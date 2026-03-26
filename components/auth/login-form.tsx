"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore, type AuthSession } from "@/lib/auth-store";
import { networkFetch, TokenExpiredError, NetworkError } from "@/lib/network/networkManager";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const setSession = useAuthStore((state) => state.setSession);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await networkFetch("login", {
        username: username.trim(),
        password,
      });

      setSession(data as AuthSession);
      router.push(redirectTo);
      router.refresh();
    } catch (submitError) {
      if (submitError instanceof TokenExpiredError) {
        setError(submitError.message);
        router.push("/login");
      } else if (submitError instanceof NetworkError) {
        setError(submitError.message);
      } else {
        setError(
          submitError instanceof Error ? submitError.message : "Error inesperado al iniciar sesión."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-white/20 bg-white/65 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(18,73,83,0.95),rgba(53,123,114,0.88),rgba(220,171,93,0.82))] p-8 text-white sm:p-10">
          <div className="relative z-10 max-w-md space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">ALOHA Access</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              Entra a tu consola de órdenes.
            </h1>
            <p className="text-sm leading-6 text-white/80 sm:text-base">
              Usamos el login del backend para abrir la administración y reutilizar la sesión en checkout.
            </p>
            <div className="space-y-3 text-sm text-white/85">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4" />
                <span>Token persistido localmente hasta su expiración.</span>
              </div>
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-4 w-4" />
                <span>La autenticación queda lista para revisar órdenes y usar checkout.</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_58%)]" />
        </section>

        <section className="p-8 sm:p-10">
          <div className="max-w-md space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Login</p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">Iniciar sesión</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa con tu usuario del backend para abrir la consola administrativa.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="admin"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Entrar"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Si prefieres seguir sin sesión, puedes ir directo al{" "}
              <Link className="text-primary hover:underline" href="/checkout">
                checkout
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
