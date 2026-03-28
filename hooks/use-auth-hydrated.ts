"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

/**
 * Hook que asegura que el store de autenticación se ha rehidratado desde localStorage
 * Útil para componentes que necesitan acceder al estado de sesión después de una recarga
 */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    // Esperar a que Zustand rehidrate desde localStorage
    if (_hasHydrated) {
      setHydrated(true);
    }
  }, [_hasHydrated]);

  return hydrated;
}
