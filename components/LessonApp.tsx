"use client";

import { useEffect, useMemo } from "react";
import { LessonSection as LessonSectionType } from "@/types/lesson";
import { useLessonState } from "@/hooks/useLessonState";
import LessonSection from "./LessonSection";
import LessonTimeline from "./LessonTimeline";
import LessonTimer from "./LessonTimer";
import ProgressBar from "./ProgressBar";

interface LessonAppProps {
  lesson: LessonSectionType[];
}

export default function LessonApp({ lesson }: LessonAppProps) {
  const {
    state,
    hydrated,
    elapsedSeconds,
    timerActions,
    setCurrentSection,
    markSectionComplete,
    setTextAnswer,
    setCodeAnswer,
    revealHint,
    revealSolution,
    checkConcept,
    checkCode,
    checkPredict,
    getQuestionState,
    resetLesson
  } = useLessonState(lesson);

  const completedCount = state.completedSectionIds.length;
  const completedPercent = Math.round((completedCount / lesson.length) * 100);

  const byId = useMemo(() => {
    const map = new Map<string, boolean>();
    lesson.forEach((section) => map.set(section.id, state.currentSectionId === section.id));
    return map;
  }, [lesson, state.currentSectionId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aTop = Math.abs(a.boundingClientRect.top);
            const bTop = Math.abs(b.boundingClientRect.top);
            return aTop - bTop;
          })[0];

        if (best?.target && best.target.id) {
          setCurrentSection(best.target.id);
        }
      },
      { threshold: 0.25 }
    );

    const ids = lesson.map((section) => section.id);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, [hydrated, lesson, setCurrentSection]);

  if (!hydrated) {
    return <p className="text-slate-200">Preparing lesson state…</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Java Robotics · 2-Hour Lesson</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-50">Robot Systems 2.0: Composition, Safety, and Autonomous Control</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          A high-school robotics lesson that evolves the existing Robot class into a small robot system.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        <div className="lg:col-span-1">
          <LessonTimer
            isRunning={state.timer.isRunning}
            elapsedSeconds={elapsedSeconds}
            onStart={timerActions.start}
            onPause={timerActions.pause}
            onResume={timerActions.resume}
            onReset={timerActions.reset}
          />
          <div className="mt-4">
            <button
              type="button"
              onClick={resetLesson}
              className="rounded-md border border-rose-400 bg-rose-700 px-3 py-2 text-sm font-medium text-rose-100"
            >
              Reset lesson progress
            </button>
          </div>
          <div className="mt-4">
            <ProgressBar value={completedCount} max={lesson.length} label={`Progress ${completedPercent}%`} />
          </div>
          <div className="mt-4">
            <LessonTimeline
              sections={lesson}
              completedSectionIds={state.completedSectionIds}
              currentSectionId={state.currentSectionId}
              onJump={(sectionId) => {
                const target = document.getElementById(sectionId);
                setCurrentSection(sectionId);
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              compact={false}
            />
          </div>
        </div>

        <main className="space-y-8 lg:col-span-1">
          <LessonTimeline
            sections={lesson}
            completedSectionIds={state.completedSectionIds}
            currentSectionId={state.currentSectionId}
            onJump={(sectionId) => {
              const target = document.getElementById(sectionId);
              setCurrentSection(sectionId);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            compact={true}
          />

          {lesson.map((section) => (
            <LessonSection
              key={section.id}
              section={section}
              isComplete={state.completedSectionIds.includes(section.id)}
              textAnswers={state.textAnswers}
              codeAnswers={state.codeAnswers}
              onMarkComplete={() => markSectionComplete(section.id)}
              getQuestionState={getQuestionState}
              onUpdateText={(id, value) => setTextAnswer(id, value)}
              onUpdateCode={(id, value) => setCodeAnswer(id, value)}
              onCheckConcept={(question, answer) => {
                const result = checkConcept(section, question, answer);
                return result;
              }}
              onCheckCode={(question, answer) => {
                const result = checkCode(section, question, answer);
                return result;
              }}
              onCheckPredict={(question, answer) => {
                const result = checkPredict(section, question, answer);
                return result;
              }}
              onRevealHint={revealHint}
              onRevealSolution={revealSolution}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
