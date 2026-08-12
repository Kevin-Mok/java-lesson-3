"use client";

import { useState } from "react";
import { CheckResult } from "@/lib/answer-check";
import CodeBlock from "./CodeBlock";
import Hint from "./Hint";
import ModelAnswer from "./ModelAnswer";
import SyntaxReference from "./SyntaxReference";

interface PredictOutputQuestionProps {
  id: string;
  prompt: string;
  javaSnippet: string;
  hint?: string;
  modelAnswer: string;
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

export default function PredictOutputQuestion({
  id,
  prompt,
  javaSnippet,
  hint,
  modelAnswer,
  value,
  questionState,
  onChange,
  onCheck,
  onRevealHint,
  onRevealSolution
}: PredictOutputQuestionProps) {
  const [localValue, setLocalValue] = useState(value);

  return (
    <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <h4 className="text-lg font-semibold text-slate-100">Predict the output ({id})</h4>
      <p className="text-slate-200">{prompt}</p>
      <CodeBlock code={javaSnippet} fileName="Sample.java" />
      <SyntaxReference prompt={javaSnippet} />
      <label htmlFor={`predict-${id}`} className="sr-only">{prompt}</label>
      <textarea
        id={`predict-${id}`}
        value={localValue}
        onChange={(event) => {
          const text = event.currentTarget.value;
          setLocalValue(text);
          onChange(text);
        }}
        rows={6}
        className="w-full rounded-md border border-slate-600 bg-slate-950 p-3 font-mono text-sm text-slate-100"
        placeholder="Predict output lines here..."
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
          onClick={onRevealSolution}
          className={`rounded-md border px-3 py-2 text-sm transition ${
            questionState.solutionRevealed
              ? "border-amber-400 bg-amber-950/40 hover:bg-amber-900"
              : "border-amber-400 hover:bg-amber-400/20"
          }`}
        >
          {questionState.solutionRevealed ? "Hide model answer" : "Compare with model answer"}
        </button>
      </div>
      <div aria-live="polite">
        <p
          className={`rounded-md border p-3 text-sm ${
            questionState.latestFeedback?.passed
              ? "border-emerald-400 bg-emerald-950/40 text-emerald-100"
              : "border-amber-500 bg-amber-950/40 text-amber-100"
          }`}
        >
          {questionState.checkAttempted
            ? questionState.latestFeedback?.feedback
            : "Predict the next lines to show your robotics reasoning."}
        </p>
      </div>
      <p className="text-xs text-slate-300">Attempts: {questionState.attempts}</p>
      <ModelAnswer answer={modelAnswer} visible={questionState.solutionRevealed} hiddenLabel="Model output explanation" />
    </section>
  );
}
