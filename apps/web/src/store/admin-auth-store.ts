import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_TOKEN_KEY = "fh-admin-token";

interface AdminAuthState {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      username: null,
      login: (token, username) => set({ token, username }),
      logout: () => set({ token: null, username: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    { name: "fh-admin-auth" }
  )
);

export function getAdminToken(): string | null {
  return useAdminAuthStore.getState().token;
}

export function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(path, { ...init, headers });
}
