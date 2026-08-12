interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export default function ProgressBar({ value, max, label }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-200">{label}</p>
      <div className="h-3 w-full rounded-full border border-slate-600 bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all"
          style={{ width: `${normalized}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="text-xs text-slate-300">{value} / {max} sections</p>
    </div>
  );
}
