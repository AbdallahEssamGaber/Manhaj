"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Logo, { LogoMark } from "@/components/Logo";
import type { Chat, Subject, University } from "@/types";

interface SidebarProps {
  subjects: Subject[];
  university: University | null;
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: (subject: string) => void;
  onDeleteChat: (chatId: string) => void;
  onSubmitMaterial: () => void;
}

export default function Sidebar({
  subjects,
  university,
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onSubmitMaterial,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const activeSubject = chats.find((c) => c.id === activeChat)?.subject;
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(activeSubject ? [activeSubject] : [subjects[0]?.name].filter(Boolean) as string[]));
  const [collapsed, setCollapsed] = useState(false);

  function toggle(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const chatsBySubject = subjects.map((subject) => ({
    ...subject,
    chats: chats.filter((c) => c.subject === subject.name).sort((a, b) => b.updatedAt - a.updatedAt),
  }));

  if (collapsed) {
    return (
      <aside className="w-14 border-l border-border bg-background flex flex-col items-center py-3 gap-1 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-md hover:bg-surface-hover text-muted transition-colors cursor-pointer"
          title="توسيع القائمة"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-6 border-t border-border my-1" />
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => onNewChat(s.name)}
            className="w-8 h-8 rounded-md bg-teal-soft text-teal text-[11px] font-bold flex items-center justify-center hover:bg-teal hover:text-white transition-colors cursor-pointer"
            title={s.name}
          >
            {s.monogram}
          </button>
        ))}
      </aside>
    );
  }

  return (
    <aside className="w-64 border-l border-border bg-background flex flex-col shrink-0 h-full">
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-border-light">
        <div className="flex items-center gap-2 min-w-0">
          <Logo withWordmark={false} size={22} />
          {university && (
            <>
              <span className="w-px h-4 bg-border shrink-0" />
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden"
                style={{ backgroundColor: university.bg, color: university.text }}
                title={university.name}
              >
                {university.logo ? (
                  <img src={university.logo} alt={university.name} className="w-full h-full object-contain" />
                ) : (
                  university.shortName
                )}
              </span>
              <span className="text-xs font-medium text-muted truncate">{university.shortName}</span>
            </>
          )}
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded-md hover:bg-surface-hover text-muted-light transition-colors cursor-pointer shrink-0"
          title="طي القائمة"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {chatsBySubject.map((subject) => {
          const isOpen = expanded.has(subject.name);
          return (
            <div key={subject.id} className="mb-0.5">
              <button
                onClick={() => toggle(subject.name)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-hover transition-colors cursor-pointer group"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  className={`text-muted-light shrink-0 transition-transform ${isOpen ? "-rotate-90" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="w-5 h-5 rounded bg-teal-soft text-teal text-[9px] font-bold flex items-center justify-center shrink-0">
                  {subject.monogram}
                </span>
                <span className="flex-1 min-w-0 text-right text-[13px] font-medium text-foreground truncate">{subject.name}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNewChat(subject.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted-light hover:text-teal p-0.5 rounded transition-opacity shrink-0"
                  title={`محادثة جديدة في ${subject.name}`}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="pr-[26px] space-y-px py-0.5">
                  {subject.chats.length === 0 ? (
                    <button
                      onClick={() => onNewChat(subject.name)}
                      className="text-xs text-muted-light hover:text-teal px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      + ابدأ محادثة
                    </button>
                  ) : (
                    subject.chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-[13px] transition-colors ${
                          activeChat === chat.id
                            ? "bg-teal-soft text-teal font-medium"
                            : "text-foreground/70 hover:bg-surface-hover hover:text-foreground"
                        }`}
                        onClick={() => onSelectChat(chat.id)}
                      >
                        <span className="truncate flex-1">{chat.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-light hover:text-incorrect transition-opacity cursor-pointer"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-border-light px-3 py-2.5">
        <button
          onClick={onSubmitMaterial}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md border border-dashed border-border text-muted hover:border-teal hover:text-teal transition-colors cursor-pointer text-[12.5px] font-medium"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0-12l-4 4m4-4l4 4M4 18h16" />
          </svg>
          قدّم جامعتك أو مادتك
        </button>
      </div>

      <div className="px-3 py-2.5 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-navy-soft text-navy flex items-center justify-center text-xs font-semibold shrink-0">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <LogoMark size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">
              {user?.displayName || (user?.isAnonymous ? "جلسة تجريبية" : "طالب")}
            </p>
          </div>
          {user?.isAnonymous ? (
            <span className="text-[10px] font-semibold text-teal bg-teal-soft px-1.5 py-0.5 rounded shrink-0">تجربة</span>
          ) : (
            <button
              onClick={signOut}
              className="p-1 rounded-md hover:bg-surface-hover text-muted-light hover:text-foreground transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
