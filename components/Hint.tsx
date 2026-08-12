"use client";

interface HintProps {
  hint?: string;
  open: boolean;
  onOpen: () => void;
}

export default function Hint({ hint, open, onOpen }: HintProps) {
  if (!hint) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="rounded-md border border-slate-600 px-3 py-2 text-sm transition hover:bg-slate-700"
        onClick={onOpen}
      >
        Hint
      </button>
      {open ? (
        <p className="rounded-md border border-amber-400 bg-amber-950/40 p-3 text-sm text-amber-100">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
