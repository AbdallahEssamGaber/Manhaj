"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { getLocalUid } from "@/lib/store";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  /** Creates a trial identity (a local uid). */
  startGuest: () => Promise<AppUser>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function localUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    uid: getLocalUid(),
    email: null,
    displayName: null,
    isAnonymous: true,
    ...overrides,
  };
}

// Only resume a session if this browser already has a local identity — a
// first-time visitor should still see onboarding. Resolved via a lazy
// useState initializer (not an effect) since it's synchronous.
function initialUser(): AppUser | null {
  try {
    const existing = localStorage.getItem("manhaj:localUid");
    if (!existing) return null;
    const savedName = localStorage.getItem("manhaj:localName");
    const savedEmail = localStorage.getItem("manhaj:localEmail");
    return localUser({ isAnonymous: !savedEmail, displayName: savedName, email: savedEmail });
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(initialUser);

  async function startGuest(): Promise<AppUser> {
    const u = localUser();
    setUser(u);
    return u;
  }

  async function signIn(email: string, _password: string) {
    try {
      localStorage.setItem("manhaj:localEmail", email);
    } catch {
      // ignore
    }
    setUser(localUser({ email, displayName: email.split("@")[0], isAnonymous: false }));
  }

  async function signUp(name: string, email: string, _password: string) {
    try {
      localStorage.setItem("manhaj:localName", name);
      localStorage.setItem("manhaj:localEmail", email);
    } catch {
      // ignore
    }
    setUser(localUser({ email, displayName: name, isAnonymous: false }));
  }

  async function signOut() {
    try {
      localStorage.removeItem("manhaj:localUid");
      localStorage.removeItem("manhaj:localName");
      localStorage.removeItem("manhaj:localEmail");
    } catch {
      // ignore
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, startGuest, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
