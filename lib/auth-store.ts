"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  roles: number[];
  phone: string | null;
  prefix: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession extends AuthUser {
  token: string;
  expireTokenAt: string;
}

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  isExpired: () => boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setSession: (session: AuthSession) => {
        set({ session });
        // Verificar si el token está expirado después de setear
        if (session && new Date(session.expireTokenAt).getTime() <= Date.now()) {
          set({ session: null });
        }
      },
      clearSession: () => set({ session: null }),
      isExpired: () => {
        const session = get().session;
        if (!session?.expireTokenAt) {
          return true;
        }

        return new Date(session.expireTokenAt).getTime() <= Date.now();
      },
    }),
    {
      name: "aloha-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
