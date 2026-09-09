import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db, isConfigured } from "@/lib/firebase";
import type { Chat, StudyProfile } from "@/types";

// Persists study profile (university/major/year) and chat history, either
// to Firestore (when Firebase is configured) or to localStorage keyed by
// uid (local dev / demo mode). Both branches share the same uid-based
// shape, so a guest's data "carries over" for free once the same uid keeps
// getting used after signup — see AuthContext.

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode, etc.) — degrade silently
  }
}

export function getLocalUid(): string {
  const key = "manhaj:localUid";
  let uid = safeGet(key);
  if (!uid) {
    uid = crypto.randomUUID();
    safeSet(key, uid);
  }
  return uid;
}

export async function loadProfile(uid: string): Promise<StudyProfile | null> {
  if (isConfigured && db) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.data();
      if (data?.universityId && data?.majorId && data?.year) {
        return { universityId: data.universityId, majorId: data.majorId, year: data.year };
      }
      return null;
    } catch {
      return null;
    }
  }
  const raw = safeGet(`manhaj:profile:${uid}`);
  return raw ? (JSON.parse(raw) as StudyProfile) : null;
}

export async function saveProfile(uid: string, profile: StudyProfile): Promise<void> {
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, "users", uid), { ...profile, updatedAt: Date.now() }, { merge: true });
    } catch {
      // best effort
    }
    return;
  }
  safeSet(`manhaj:profile:${uid}`, JSON.stringify(profile));
}

export async function loadChats(uid: string): Promise<Chat[]> {
  if (isConfigured && db) {
    try {
      const q = query(collection(db, "users", uid, "chats"), orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Chat);
    } catch {
      return [];
    }
  }
  const raw = safeGet(`manhaj:chats:${uid}`);
  return raw ? (JSON.parse(raw) as Chat[]) : [];
}

async function saveAllLocalChats(uid: string, chats: Chat[]) {
  safeSet(`manhaj:chats:${uid}`, JSON.stringify(chats));
}

export async function saveChat(uid: string, chat: Chat, allChats: Chat[]): Promise<void> {
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, "users", uid, "chats", chat.id), {
        subject: chat.subject,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      });
    } catch {
      // best effort
    }
    return;
  }
  await saveAllLocalChats(uid, allChats);
}

export async function deleteChat(uid: string, chatId: string, remainingChats: Chat[]): Promise<void> {
  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, "users", uid, "chats", chatId));
    } catch {
      // best effort
    }
    return;
  }
  await saveAllLocalChats(uid, remainingChats);
}

/** Best-effort copy of one uid's chats/profile into another uid's storage. */
export async function migrateUserData(fromUid: string, toUid: string): Promise<void> {
  if (fromUid === toUid) return;
  const [profile, chats] = await Promise.all([loadProfile(fromUid), loadChats(fromUid)]);
  if (profile) await saveProfile(toUid, profile);
  for (const chat of chats) {
    await saveChat(toUid, chat, chats);
  }
}
