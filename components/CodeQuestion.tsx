"use client";

import { useState } from "react";
import { CheckResult } from "@/lib/answer-check";
import Hint from "./Hint";
import ModelAnswer from "./ModelAnswer";
import CodeBlock from "./CodeBlock";

interface CodeQuestionProps {
  id: string;
  prompt: string;
  hint?: string;
  modelAnswer: string;
  note?: string;
  value: string;
  questionState: {
    checkAttempted: boolean;
    attempts: number;
    latestFeedback: CheckResult | null;
    hintRevealed: boolean;
    solutionRevealed: boolean;
  };
  onChange: (value: string) => void;
  onCheck: () => void;
  onRevealHint: () => void;
  onRevealSolution: () => void;
}

export default function CodeQuestion({
  id,
  prompt,
  hint,
  modelAnswer,
  note,
  value,
  questionState,
  onChange,
  onCheck,
  onRevealHint,
  onRevealSolution
}: CodeQuestionProps) {
  const [localValue, setLocalValue] = useState(value);

  return (
    <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <h4 className="text-lg font-semibold text-slate-100">Code writing task ({id})</h4>
      <p className="text-slate-200">{prompt}</p>
      {note ? <p className="rounded-md border border-cyan-700 bg-cyan-950/30 p-2 text-sm">{note}</p> : null}
      <label htmlFor={`code-${id}`} className="sr-only">{prompt}</label>
      <textarea
        id={`code-${id}`}
        value={localValue}
        onChange={(event) => {
          const text = event.currentTarget.value;
          setLocalValue(text);
          onChange(text);
        }}
        rows={10}
        className="w-full rounded-md border border-slate-600 bg-slate-950 p-3 font-mono text-sm text-slate-100"
        placeholder="Write your Java code here..."
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCheck}
          className="rounded-md border border-cyan-400 bg-cyan-600 px-3 py-2 font-medium text-cyan-950 transition hover:bg-cyan-500"
        >
          Check answer
        </button>
        <Hint hint={hint} open={questionState.hintRevealed} onOpen={onRevealHint} />
        <button
          type="button"
          disabled={!questionState.checkAttempted}
          onClick={onRevealSolution}
          className={`rounded-md border px-3 py-2 text-sm transition ${
            questionState.checkAttempted
              ? "border-amber-400 hover:bg-amber-400/20"
              : "cursor-not-allowed border-slate-700 text-slate-500"
          }`}
        >
          Compare with model answer
        </button>
      </div>
      <div aria-live="polite" className="space-y-2">
        <p
          className={`rounded-md border p-3 text-sm ${
            questionState.latestFeedback?.passed
              ? "border-emerald-400 bg-emerald-950/40 text-emerald-100"
              : "border-amber-500 bg-amber-950/40 text-amber-100"
          }`}
        >
          {questionState.checkAttempted
            ? questionState.latestFeedback?.feedback
            : "Run the checker for quick structural feedback (no Java compiler needed)."}
        </p>
      </div>
      <ModelAnswer
        answer={modelAnswer}
        visible={questionState.solutionRevealed}
        hiddenLabel="Model Java solution"
      />
    </section>
  );
}
