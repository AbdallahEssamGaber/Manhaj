import type { Chat, StudyProfile } from "@/types";

// Persists study profile (university/major/year) and chat history to
// localStorage, keyed by uid. A guest's data "carries over" for free once
// the same uid keeps getting used after signup — see AuthContext.

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
  const raw = safeGet(`manhaj:profile:${uid}`);
  return raw ? (JSON.parse(raw) as StudyProfile) : null;
}

export async function saveProfile(uid: string, profile: StudyProfile): Promise<void> {
  safeSet(`manhaj:profile:${uid}`, JSON.stringify(profile));
}

export async function loadChats(uid: string): Promise<Chat[]> {
  const raw = safeGet(`manhaj:chats:${uid}`);
  return raw ? (JSON.parse(raw) as Chat[]) : [];
}

export async function saveChat(uid: string, chat: Chat, allChats: Chat[]): Promise<void> {
  safeSet(`manhaj:chats:${uid}`, JSON.stringify(allChats));
}

export async function deleteChat(uid: string, chatId: string, remainingChats: Chat[]): Promise<void> {
  safeSet(`manhaj:chats:${uid}`, JSON.stringify(remainingChats));
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
