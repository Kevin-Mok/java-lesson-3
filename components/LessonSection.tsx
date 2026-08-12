"use client";

import { LessonSection as LessonSectionModel, ConceptQuestion as ConceptQuestionModel, CodeQuestion as CodeQuestionModel, PredictOutputQuestion as PredictQuestionModel } from "@/types/lesson";
import CodeBlock from "./CodeBlock";
import ConceptQuestion from "./ConceptQuestion";
import CodeQuestion from "./CodeQuestion";
import PredictOutputQuestion from "./PredictOutputQuestion";
import { CheckResult } from "@/lib/answer-check";

type QuestionState = {
  checkAttempted: boolean;
  attempts: number;
  latestFeedback: CheckResult | null;
  hintRevealed: boolean;
  solutionRevealed: boolean;
};

interface LessonSectionProps {
  section: LessonSectionModel;
  onMarkComplete: () => void;
  isComplete: boolean;
  textAnswers: Record<string, string>;
  codeAnswers: Record<string, string>;
  getQuestionState: (id: string) => QuestionState;
  onUpdateText: (id: string, value: string) => void;
  onUpdateCode: (id: string, value: string) => void;
  onCheckConcept: (question: ConceptQuestionModel, answer: string) => CheckResult;
  onCheckCode: (question: CodeQuestionModel, answer: string) => CheckResult;
  onCheckPredict: (question: PredictQuestionModel, answer: string) => CheckResult;
  onRevealHint: (id: string) => void;
  onRevealSolution: (id: string) => void;
}

const blockTypeClass = "space-y-3 rounded-xl border border-slate-700 bg-slate-900/40 p-4";

export default function LessonSection({
  section,
  onMarkComplete,
  isComplete,
  textAnswers,
  codeAnswers,
  getQuestionState,
  onUpdateText,
  onUpdateCode,
  onCheckConcept,
  onCheckCode,
  onCheckPredict,
  onRevealHint,
  onRevealSolution
}: LessonSectionProps) {
  return (
    <section id={section.id} className="space-y-6 rounded-xl border border-slate-700 bg-slate-900/30 p-5" aria-labelledby={`${section.id}-title`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            {section.start}–{section.end} · {section.minutes} min
          </p>
          <h2 id={`${section.id}-title`} className="text-2xl font-bold text-slate-50">{section.title}</h2>
        </div>
        <button
          type="button"
          onClick={onMarkComplete}
          className={`rounded-md border px-3 py-2 text-sm ${
            isComplete
              ? "border-emerald-400 bg-emerald-700/50 text-emerald-100"
              : "border-cyan-400 bg-cyan-700/30 text-cyan-100"
          }`}
        >
          {isComplete ? "Section complete" : "Mark section complete"}
        </button>
      </div>

      <ul className="list-disc pl-5 text-sm text-slate-200">
        {section.objectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>

      <div className="space-y-4">
        {section.blocks.map((block) => {
          if (block.type === "explanation") {
            return (
              <article key={block.id} className={blockTypeClass}>
                {block.title ? <h3 className="font-semibold text-cyan-200">{block.title}</h3> : null}
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-100">{block.markdown}</p>
              </article>
            );
          }

          if (block.type === "code-example") {
            return (
              <article key={block.id} className={blockTypeClass}>
                <CodeBlock code={block.code} fileName="Robot.java" />
              </article>
            );
          }

          if (block.type === "callout") {
            return (
              <article key={block.id} className="rounded-lg border border-amber-400 bg-amber-950/20 p-4">
                <p className="text-sm font-medium text-amber-200">{block.content}</p>
              </article>
            );
          }

          if (block.type === "transition") {
            return (
              <article key={block.id} className="rounded-lg border border-cyan-500 bg-cyan-950/20 p-4">
                <p className="text-sm text-cyan-100">{block.content}</p>
              </article>
            );
          }

          if (block.type === "concept") {
            const questionState = getQuestionState(block.id);
            const value = textAnswers[block.id] ?? "";
            return (
              <ConceptQuestion
                key={block.id}
                id={block.id}
                prompt={block.prompt}
                hint={block.hint}
                modelAnswer={block.modelAnswer}
                value={value}
                questionState={questionState}
                onChange={(next) => onUpdateText(block.id, next)}
                onCheck={() => onCheckConcept(block, value)}
                onRevealHint={() => onRevealHint(block.id)}
                onRevealSolution={() => onRevealSolution(block.id)}
              />
            );
          }

          if (block.type === "code") {
            const questionState = getQuestionState(block.id);
            const value = codeAnswers[block.id] ?? "";
            return (
              <CodeQuestion
                key={block.id}
                id={block.id}
                prompt={block.prompt}
                hint={block.hint}
                modelAnswer={block.modelAnswer}
                note={block.note}
                value={value}
                questionState={questionState}
                onChange={(next) => onUpdateCode(block.id, next)}
                onCheck={() => onCheckCode(block, value)}
                onRevealHint={() => onRevealHint(block.id)}
                onRevealSolution={() => onRevealSolution(block.id)}
              />
            );
          }

          if (block.type === "predict-output") {
            const questionState = getQuestionState(block.id);
            const value = textAnswers[block.id] ?? "";
            return (
              <PredictOutputQuestion
                key={block.id}
                id={block.id}
                prompt={block.prompt}
                javaSnippet={block.javaSnippet}
                hint={block.hint}
                modelAnswer={block.modelAnswer}
                value={value}
                questionState={questionState}
                onChange={(next) => onUpdateText(block.id, next)}
                onCheck={() => onCheckPredict(block, value)}
                onRevealHint={() => onRevealHint(block.id)}
                onRevealSolution={() => onRevealSolution(block.id)}
              />
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}
