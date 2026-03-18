"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (session) => set({ session }),
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
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);
