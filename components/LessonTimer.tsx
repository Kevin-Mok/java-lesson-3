"use client";

interface LessonTimerProps {
  isRunning: boolean;
  elapsedSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

function formatSeconds(totalSeconds: number): string {
  const total = Math.max(0, totalSeconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function LessonTimer({ isRunning, elapsedSeconds, onStart, onPause, onResume, onReset }: LessonTimerProps) {
  const totalLessonSeconds = 2 * 60 * 60;
  const remainingSeconds = Math.max(0, totalLessonSeconds - elapsedSeconds);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Start 2-Hour Lesson</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-300">Elapsed</p>
          <p className="text-2xl font-semibold text-cyan-200">{formatSeconds(elapsedSeconds)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-300">Remaining</p>
          <p className="text-2xl font-semibold text-cyan-200">{formatSeconds(remainingSeconds)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onStart}
          disabled={isRunning || elapsedSeconds > 0}
          className="rounded-md border border-emerald-500 bg-emerald-600 px-3 py-2 text-sm font-medium text-emerald-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Start
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!isRunning}
          className="rounded-md border border-amber-500 px-3 py-2 text-sm font-medium text-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={onResume}
          disabled={isRunning || elapsedSeconds === 0}
          className="rounded-md border border-cyan-400 bg-cyan-600 px-3 py-2 text-sm font-medium text-cyan-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Resume
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-rose-400 bg-rose-700 px-3 py-2 text-sm font-medium text-rose-100"
        >
          Reset timer
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-300">Timer is preserved in browser storage. Resetting the timer only clears time state.</p>
    </section>
  );
}
