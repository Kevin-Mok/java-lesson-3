"use client";

import { useState } from "react";
import SyntaxHighlightedCode from "./SyntaxHighlightedCode";

interface CodeBlockProps {
  code: string;
  fileName?: string;
}

export default function CodeBlock({ code, fileName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative rounded-xl border border-slate-600 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        {fileName ? <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{fileName}</p> : null}
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-cyan-700 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlightedCode code={code} />
    </div>
  );
}
