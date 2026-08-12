"use client";

import Link from "next/link";
import { LessonSection } from "@/types/lesson";

interface LessonTimelineProps {
  sections: LessonSection[];
  completedSectionIds: string[];
  currentSectionId: string;
  onJump: (sectionId: string) => void;
  compact?: boolean;
}

function statusSymbol(sectionId: string, completedSectionIds: string[], isActive: boolean) {
  if (completedSectionIds.includes(sectionId)) {
    return isActive ? "✅" : "✓";
  }

  return isActive ? "●" : "○";
}

export default function LessonTimeline({
  sections,
  completedSectionIds,
  currentSectionId,
  onJump,
  compact
}: LessonTimelineProps) {
  const completed = completedSectionIds.length;
  const percent = Math.round((completed / sections.length) * 100);

  if (compact) {
    return (
      <details className="rounded-xl border border-slate-600 bg-slate-900/60 p-3 md:hidden">
        <summary className="font-semibold text-cyan-200">Timeline · {percent}% complete</summary>
        <ul className="mt-3 space-y-2">
          {sections.map((section) => {
            const isActive = section.id === currentSectionId;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onJump(section.id)}
                  className={`w-full rounded-md border p-2 text-left ${
                    isActive
                      ? "border-cyan-400 bg-cyan-950/40"
                      : "border-slate-700"
                  }`}
                >
                  {statusSymbol(section.id, completedSectionIds, isActive)} {section.start} {section.title}
                </button>
              </li>
            );
          })}
        </ul>
      </details>
    );
  }

  return (
    <aside className="sticky top-4 space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <p className="text-sm font-semibold text-slate-200">
        Lesson progress {completed} / {sections.length} · {percent}%
      </p>
      <ul className="space-y-2">
        {sections.map((section) => {
          const isActive = section.id === currentSectionId;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onJump(section.id)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                  isActive
                    ? "border-cyan-400 bg-cyan-950/40"
                    : "border-slate-700 hover:bg-slate-800/60"
                }`}
              >
                {statusSymbol(section.id, completedSectionIds, isActive)} {section.start}–{section.end} 
                <span className="font-semibold">{section.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-slate-300">{completedSectionIds.length} / {sections.length} sections completed</p>
      <p className="text-xs text-slate-300">{percent}% complete</p>
    </aside>
  );
}
