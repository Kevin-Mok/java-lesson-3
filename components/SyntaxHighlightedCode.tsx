"use client";

interface SyntaxHighlightedCodeProps {
  code: string;
  className?: string;
}

type TokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "type"
  | "number"
  | "boolean"
  | "literal"
  | "text";

interface Segment {
  kind: TokenKind;
  text: string;
}

const JAVA_KEYWORDS = new Set([
  "abstract",
  "class",
  "else",
  "extends",
  "final",
  "for",
  "if",
  "import",
  "new",
  "public",
  "private",
  "protected",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "void",
  "while",
  "break",
  "continue",
  "package"
]);

const JAVA_TYPES = new Set([
  "int",
  "boolean",
  "String",
  "double",
  "float",
  "long",
  "char",
  "byte",
  "short",
  "Object"
]);

function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

function isWordStart(char: string): boolean {
  return /[A-Za-z_]/.test(char);
}

function isWordPart(char: string): boolean {
  return /[A-Za-z0-9_]/.test(char);
}

function tokenize(code: string): Segment[] {
  const segments: Segment[] = [];
  const text = code;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const next = text[i + 1] ?? "";

    if (char === "/" && next === "/") {
      const start = i;
      i += 2;
      while (i < text.length && text[i] !== "\n") {
        i += 1;
      }
      segments.push({ kind: "comment", text: text.slice(start, i) });
      continue;
    }

    if (char === "#") {
      const start = i;
      i += 1;
      while (i < text.length && text[i] !== "\n") {
        i += 1;
      }
      segments.push({ kind: "comment", text: text.slice(start, i) });
      continue;
    }

    if (char === "\"" || char === "'") {
      const quote = char;
      const start = i;
      i += 1;
      while (i < text.length) {
        const current = text[i];
        if (current === "\\") {
          i += 2;
          continue;
        }

        if (current === quote) {
          i += 1;
          break;
        }

        i += 1;
      }
      segments.push({ kind: "string", text: text.slice(start, i) });
      continue;
    }

    if (/[0-9]/.test(char)) {
      const start = i;
      i += 1;
      while (i < text.length && /[0-9.]/.test(text[i])) {
        i += 1;
      }
      segments.push({ kind: "number", text: text.slice(start, i) });
      continue;
    }

    if (isWordStart(char)) {
      const start = i;
      i += 1;
      while (i < text.length && isWordPart(text[i])) {
        i += 1;
      }

      const token = text.slice(start, i);
      const lower = token.toLowerCase();

      if (JAVA_KEYWORDS.has(lower) || JAVA_KEYWORDS.has(token)) {
        segments.push({ kind: "keyword", text: token });
        continue;
      }

      if (JAVA_TYPES.has(token)) {
        segments.push({ kind: "type", text: token });
        continue;
      }

      if (token === "System" || token === "Robot" || token === "Motor") {
        segments.push({ kind: "type", text: token });
        continue;
      }

      if (token === "true" || token === "false") {
        segments.push({ kind: "boolean", text: token });
        continue;
      }

      if (token === "null") {
        segments.push({ kind: "literal", text: token });
        continue;
      }

      segments.push({ kind: "text", text: token });
      continue;
    }

    if (isWhitespace(char)) {
      segments.push({ kind: "text", text: char });
      i += 1;
      continue;
    }

    segments.push({ kind: "text", text: char });
    i += 1;
  }

  return segments;
}

function segmentClass(kind: TokenKind): string {
  switch (kind) {
    case "comment":
      return "text-emerald-300";
    case "string":
      return "text-amber-300";
    case "keyword":
      return "text-violet-300 font-medium";
    case "type":
      return "text-cyan-300";
    case "number":
      return "text-pink-300";
    case "boolean":
    case "literal":
      return "text-purple-300";
    default:
      return "text-slate-100";
  }
}

export default function SyntaxHighlightedCode({ code, className = "" }: SyntaxHighlightedCodeProps) {
  const segments = tokenize(code);

  return (
    <pre className={`overflow-x-auto whitespace-pre-wrap rounded-md border border-slate-700 bg-slate-950 p-3 text-sm ${className}`}>
      <code>
        {segments.map((segment, index) => (
          <span key={`${segment.text}-${index}`} className={segmentClass(segment.kind)}>
            {segment.text}
          </span>
        ))}
      </code>
    </pre>
  );
}
