import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Demo-only authentication.
 *
 * WARNING: these credentials are hardcoded and shipped in the client bundle.
 * This is fine for the Thursday demo, but the real build must use proper
 * server-side authentication. Do not treat this as secure.
 */
const ADMIN_EMAIL = "sibusiso.mashita@goldenknightsfc.co.za";
const ADMIN_PASSWORD = "Pass@123";

const STORAGE_KEY = "gksa-admin-auth";

interface AuthContextValue {
  email: string | null;
  isAuthed: boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (email) localStorage.setItem(STORAGE_KEY, email);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [email]);

  const value: AuthContextValue = {
    email,
    isAuthed: !!email,
    signIn: (e, p) => {
      if (e.trim().toLowerCase() === ADMIN_EMAIL && p === ADMIN_PASSWORD) {
        setEmail(ADMIN_EMAIL);
        return true;
      }
      return false;
    },
    signOut: () => setEmail(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const DEMO_ADMIN_EMAIL = ADMIN_EMAIL;
