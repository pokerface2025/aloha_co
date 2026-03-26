"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { networkFetch, TokenExpiredError } from "@/lib/network/networkManager";
import { ApiRoute } from "@/lib/network/apiroute";

export function useAuthenticatedFetch() {
  const router = useRouter();

  const fetch = useCallback(
    async <T,>(route: ApiRoute, body?: any): Promise<T> => {
      try {
        const data = await networkFetch(route, body);
        return data as T;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          // Redirigir a login si el token expiró
          router.push("/login");
          throw error;
        }
        throw error;
      }
    },
    [router]
  );

  return { fetch };
}
