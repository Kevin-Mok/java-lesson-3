"use client";

interface ModelAnswerProps {
  answer: string;
  visible: boolean;
  hiddenLabel?: string;
}

export default function ModelAnswer({ answer, visible, hiddenLabel = "Model answer" }: ModelAnswerProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="rounded-lg border border-emerald-400 bg-emerald-950/40 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{hiddenLabel}</p>
      <pre className="whitespace-pre-wrap text-sm text-slate-100">{answer}</pre>
    </div>
  );
}
