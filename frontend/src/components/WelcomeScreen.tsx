"use client";

import Logo from "@/components/Logo";
import type { Subject } from "@/types";

interface WelcomeScreenProps {
  subjects: Subject[];
  onSelectSubject: (subject: string) => void;
}

export default function WelcomeScreen({ subjects, onSelectSubject }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <Logo withWordmark={false} size={40} className="mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-1.5">هنذاكر في أنهي مادة النهاردة؟</h2>
        <p className="text-muted text-sm mb-7 max-w-sm font-reading">
          إجابات، وكويزات، وفلاش كارد — كل ده مسحوب من مادة كورسك الحقيقية.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject.name)}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-right hover:border-teal hover:bg-teal-soft hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-soft text-teal text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-teal group-hover:text-white transition-colors">
                {subject.monogram}
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-teal transition-colors">{subject.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
