import { decodeJwt } from "jose";
import { useState } from "nuxt/app";
import { computed } from "vue";

export type AuthUser = { id: number; email: string } | null;
type JwtPayload = { uid: number; email: string };

const TOKEN_KEY = "auth_token";

export function useAuth() {
  // 1) Init fra localStorage når composable først brukes (client only)
  const token = useState<string | null>("auth_token", () =>
    import.meta.client ? localStorage.getItem(TOKEN_KEY) : null
  );
  const user = useState<AuthUser>("auth_user", () => null);

  // 2) Hvis vi har token men mangler user, forsøk å dekode
  if (import.meta.client && token.value && !user.value) {
    try {
      const payload = decodeJwt(token.value) as JwtPayload;
      user.value = payload?.uid
        ? { id: payload.uid, email: payload.email }
        : null;
    } catch {
      token.value = null;
      user.value = null;
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  const setToken = (t: string | null) => {
    console.log("[auth] setToken", !!t);
    token.value = t;
    if (import.meta.client) {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    }
  };

  // Valgfri «manuell refresh» fra storage om du trenger:
  const loadFromStorage = () => {
    if (!import.meta.client) return;
    const t = localStorage.getItem(TOKEN_KEY);
    setToken(t);
    if (t) {
      try {
        const payload = decodeJwt(t) as JwtPayload;
        user.value = payload?.uid
          ? { id: payload.uid, email: payload.email }
          : null;
      } catch {
        setToken(null);
        user.value = null;
      }
    } else {
      user.value = null;
    }
  };

  const login = async (email: string, password: string) => {
    const res = await $fetch<{
      token: string;
      user: { id: number; email: string };
    }>("/api/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(res.token);
    user.value = res.user;
  };

  const logout = () => {
    setToken(null);
    user.value = null;
  };

  const isAuthenticated = computed(() => !!token.value);

  // Liten helper for API-kall uten plugin:
  const authHeaders = () =>
    token.value ? { Authorization: `Bearer ${token.value}` } : {};

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    loadFromStorage,
    authHeaders,
  };
}
