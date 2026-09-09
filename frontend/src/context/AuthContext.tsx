"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, isConfigured } from "@/lib/firebase";
import { getLocalUid, loadChats, saveChat } from "@/lib/store";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  /** Creates a trial identity (Firebase anonymous auth, or a local uid in demo mode). */
  startGuest: () => Promise<AppUser>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function fromFirebaseUser(u: User): AppUser {
  return { uid: u.uid, email: u.email, displayName: u.displayName, isAnonymous: u.isAnonymous };
}

/** Local (unconfigured-Firebase) identity lives in one shared browser uid so
 * a guest's data trivially "carries over" once they sign up — same storage key
 * the whole time, see lib/store.ts. */
function localUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    uid: getLocalUid(),
    email: null,
    displayName: null,
    isAnonymous: true,
    ...overrides,
  };
}

// In demo mode, only resume a session if this browser already has a local
// identity — a first-time visitor should still see onboarding. Resolved via
// a lazy useState initializer (not an effect) since it's synchronous.
function initialDemoUser(): AppUser | null {
  if (isConfigured) return null;
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
  const [user, setUser] = useState<AppUser | null>(initialDemoUser);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ? fromFirebaseUser(u) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function startGuest(): Promise<AppUser> {
    if (!isConfigured || !auth) {
      const u = localUser();
      setUser(u);
      return u;
    }
    if (auth.currentUser) return fromFirebaseUser(auth.currentUser);
    const cred = await signInAnonymously(auth);
    return fromFirebaseUser(cred.user);
  }

  async function signIn(email: string, password: string) {
    if (!isConfigured || !auth) {
      try {
        localStorage.setItem("manhaj:localEmail", email);
      } catch {
        // ignore
      }
      setUser(localUser({ email, displayName: email.split("@")[0], isAnonymous: false }));
      return;
    }

    const guestUid = auth.currentUser?.isAnonymous ? auth.currentUser.uid : null;
    const cred = await signInWithEmailAndPassword(auth, email, password);

    if (guestUid && guestUid !== cred.user.uid) {
      try {
        const guestChats = await loadChats(guestUid);
        for (const chat of guestChats) {
          await saveChat(cred.user.uid, chat, guestChats);
        }
      } catch {
        // best-effort chat carry-over; never block sign-in on it
      }
    }
  }

  async function signUp(name: string, email: string, password: string) {
    if (!isConfigured || !auth) {
      try {
        localStorage.setItem("manhaj:localName", name);
        localStorage.setItem("manhaj:localEmail", email);
      } catch {
        // ignore
      }
      setUser(localUser({ email, displayName: name, isAnonymous: false }));
      return;
    }

    if (auth.currentUser?.isAnonymous) {
      const credential = EmailAuthProvider.credential(email, password);
      const linked = await linkWithCredential(auth.currentUser, credential);
      await updateProfile(linked.user, { displayName: name });
      if (db) {
        try {
          await setDoc(doc(db, "users", linked.user.uid), { name, email }, { merge: true });
        } catch {
          // best effort
        }
      }
      setUser(fromFirebaseUser(linked.user));
      return;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    if (db) {
      try {
        await setDoc(doc(db, "users", cred.user.uid), { name, email, createdAt: Date.now() }, { merge: true });
      } catch {
        // best effort
      }
    }
  }

  async function signOut() {
    if (!isConfigured || !auth) {
      try {
        localStorage.removeItem("manhaj:localUid");
        localStorage.removeItem("manhaj:localName");
        localStorage.removeItem("manhaj:localEmail");
      } catch {
        // ignore
      }
      setUser(null);
      return;
    }
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, startGuest, signIn, signUp, signOut, isDemo: !isConfigured }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
