"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingModal from "@/components/OnboardingModal";
import TrialBanner from "@/components/TrialBanner";
import SubmitMaterialModal from "@/components/SubmitMaterialModal";
import ReferencePanel from "@/components/ReferencePanel";
import { askQuestion } from "@/lib/api";
import { generateFlashcardDeck, generateQuiz, generateMockExam } from "@/lib/mockContent";
import { parseSlashCommand } from "@/lib/studyModes";
import { getUniversity } from "@/lib/universities";
import { subjectsFor } from "@/lib/subjects";
import { loadProfile, saveProfile, loadChats, saveChat, deleteChat } from "@/lib/store";
import type { Chat, Message, Reference, StudyProfile } from "@/types";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const TRIAL_NUDGE_THRESHOLD = 3;
const TRIAL_NUDGE_REPEAT_EVERY = 2;

export default function ChatPage() {
  const { user, loading: authLoading, startGuest } = useAuth();

  const [resolvedProfile, setResolvedProfile] = useState<{ uid: string; profile: StudyProfile | null } | null>(null);
  const [manualProfile, setManualProfile] = useState<StudyProfile | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  const [openReference, setOpenReference] = useState<Reference | null>(null);
  const [showSubmitMaterial, setShowSubmitMaterial] = useState(false);
  const [bannerDismissedAt, setBannerDismissedAt] = useState<number | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  // Resolve the study profile once we know who's asking. Derived (not
  // stored directly) so there's no user/no-fetch case never needs a
  // synchronous setState inside the effect body.
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    loadProfile(user.uid).then((p) => {
      if (!cancelled) setResolvedProfile({ uid: user.uid, profile: p });
    });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const profile =
    manualProfile ?? (user && resolvedProfile?.uid === user.uid ? resolvedProfile.profile : null);
  const profileLoading = authLoading || (!!user && !manualProfile && resolvedProfile?.uid !== user.uid);

  useEffect(() => {
    if (!user || !profile) return;
    let cancelled = false;
    loadChats(user.uid).then((loaded) => {
      if (!cancelled) {
        setChats(loaded);
        setChatsLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, profile]);

  async function handleOnboardingComplete(newProfile: StudyProfile) {
    const appUser = user ?? (await startGuest());
    await saveProfile(appUser.uid, newProfile);
    setManualProfile(newProfile);
  }

  function createChat(subject: string): Chat {
    const now = Date.now();
    const chat: Chat = { id: generateId(), subject, title: "New chat", messages: [], createdAt: now, updatedAt: now };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    return chat;
  }

  async function handleDeleteChat(chatId: string) {
    const remaining = chats.filter((c) => c.id !== chatId);
    setChats(remaining);
    if (activeChatId === chatId) setActiveChatId(null);
    if (!user) return;
    await deleteChat(user.uid, chatId, remaining);
  }

  async function handleSend(rawInput: string) {
    const chat = activeChat;
    if (!chat || !user) return;
    const { mode, topic } = parseSlashCommand(rawInput);

    const userMsg: Message = { id: generateId(), role: "user", content: rawInput, timestamp: Date.now() };
    const isFirst = chat.messages.length === 0;
    const title = isFirst ? rawInput.slice(0, 60) : chat.title;
    const updatedChat: Chat = { ...chat, title, messages: [...chat.messages, userMsg], updatedAt: Date.now() };
    setChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));
    setChatLoading(true);

    try {
      const response = await askQuestion({ subject: chat.subject, question: rawInput });

      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        mode,
        timestamp: Date.now(),
      };
      if (mode === "flashcards") assistantMsg.flashcards = generateFlashcardDeck(chat.subject, topic || chat.subject);
      if (mode === "quiz") assistantMsg.quiz = generateQuiz(chat.subject, topic || chat.subject);
      if (mode === "mockexam") assistantMsg.mockExam = generateMockExam(chat.subject, topic || chat.subject);

      const finalChat: Chat = { ...updatedChat, messages: [...updatedChat.messages, assistantMsg], updatedAt: Date.now() };
      setChats((prev) => prev.map((c) => (c.id === chat.id ? finalChat : c)));
      await saveChat(user.uid, finalChat, chats.map((c) => (c.id === chat.id ? finalChat : c)));
    } catch {
      const errorMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: "Sorry, something went wrong reaching the course material. Please try again.",
        timestamp: Date.now(),
      };
      const errorChat: Chat = { ...updatedChat, messages: [...updatedChat.messages, errorMsg], updatedAt: Date.now() };
      setChats((prev) => prev.map((c) => (c.id === chat.id ? errorChat : c)));
    } finally {
      setChatLoading(false);
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  if (!chatsLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  const university = getUniversity(profile.universityId) ?? null;
  const subjects = subjectsFor(profile.majorId, profile.year);
  const totalUserMessages = chats.reduce((sum, c) => sum + c.messages.filter((m) => m.role === "user").length, 0);
  const showTrialBanner =
    !!user?.isAnonymous &&
    totalUserMessages >= TRIAL_NUDGE_THRESHOLD &&
    (bannerDismissedAt === null || totalUserMessages - bannerDismissedAt >= TRIAL_NUDGE_REPEAT_EVERY);

  return (
    <div className="h-screen flex flex-col">
      {showTrialBanner && <TrialBanner onDismiss={() => setBannerDismissedAt(totalUserMessages)} />}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          subjects={subjects}
          university={university}
          chats={chats}
          activeChat={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setOpenReference(null);
          }}
          onNewChat={(subject) => {
            createChat(subject);
            setOpenReference(null);
          }}
          onDeleteChat={handleDeleteChat}
          onSubmitMaterial={() => setShowSubmitMaterial(true)}
        />
        {activeChat ? (
          <ChatWindow
            messages={activeChat.messages}
            subject={activeChat.subject}
            onSend={handleSend}
            loading={chatLoading}
            onOpenReference={setOpenReference}
            activeReferenceIndex={openReference?.index ?? null}
          />
        ) : (
          <WelcomeScreen subjects={subjects} onSelectSubject={createChat} />
        )}
        <ReferencePanel reference={openReference} onClose={() => setOpenReference(null)} />
      </div>
      {showSubmitMaterial && (
        <SubmitMaterialModal university={university} onClose={() => setShowSubmitMaterial(false)} />
      )}
    </div>
  );
}
