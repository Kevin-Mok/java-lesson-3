import { CodeRequirement, ConceptRequirement } from "@/types/lesson";

export interface CheckResult {
  passed: boolean;
  matched: string[];
  missing: string[];
  feedback: string;
}

export interface CodeCheckResult extends CheckResult {
  patternMatches: Record<string, boolean>;
}

const PUNCTUATION_RE = /[^\p{L}\p{N}\s<>*/+=().-]/gu;

export function normalizeTextAnswer(text: string): string {
  if (!text) {
    return "";
  }

  const cleaned = text
    .toLowerCase()
    .replace(/\r\n?/g, " ")
    .replace(PUNCTUATION_RE, " ")
    .replace(/\s+/g, " ")
    .trim();

  const javaAliases: Array<[RegExp, string]> = [
    [ /\bdoes not/gi, "doesnt" ],
    [ /\bdo not/gi, "dont" ],
    [ /\bbattery level/gi, "battery" ],
    [ /\bnot enough/gi, "insufficient" ],
    [ /\bless than/gi, "<" ],
    [ /\bat least/gi, ">=" ],
    [ /\bdrive step/gi, "drive step" ],
    [ /\bdrive-step/gi, "drive step" ]
  ];

  return javaAliases.reduce((next, [pattern, replacement]) => next.replace(pattern, replacement), cleaned);
}

export function stripJavaComments(source: string): string {
  const withoutBlock = source.replace(/\/\*[\s\S]*?\*\//g, " ");
  return withoutBlock.replace(/(^|[^:])\/\/.*$/gm, "$1");
}

export function checkConceptAnswer(
  input: string,
  concepts: ConceptRequirement[],
  minimumConceptMatches: number
): CheckResult {
  const normalized = normalizeTextAnswer(input);
  const matched: string[] = [];
  const missing: string[] = [];

  concepts.forEach((concept) => {
    const found = concept.aliases.some((alias) =>
      normalized.includes(normalizeTextAnswer(alias))
    );

    if (found) {
      matched.push(concept.label);
    } else {
      missing.push(concept.label);
    }
  });

  if (matched.length >= minimumConceptMatches) {
    return {
      passed: true,
      matched,
      missing: missing.filter((item, index) => {
        const missingIndex = missing.indexOf(item);
        return missingIndex !== index;
      }),
      feedback:
        `Strong match. You covered ${matched.length} key idea${matched.length === 1 ? "" : "s"}: ` +
        `${matched.join(", ")}`
    };
  }

  if (matched.length >= 1) {
    return {
      passed: false,
      matched,
      missing,
      feedback:
        `Good start, but you are still missing a few ideas: ${missing.join(", ")}. Try connecting your answer to the robot safety behavior.`
    };
  }

  return {
    passed: false,
    matched,
    missing,
    feedback:
      "Your answer is directionally close, but not enough yet. Think about what makes the action safe before state changes happen."
  };
}

function compilePattern(patternText: string): RegExp {
  return new RegExp(patternText, "i");
}

export function checkCodeRequirements(
  source: string,
  requirements: CodeRequirement[]
): CodeCheckResult {
  const normalized = stripJavaComments(source)
    .replace(/\r\n?/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  const matched = new Set<string>();
  const patternMatches: Record<string, boolean> = {};

  requirements.forEach((req) => {
    const matches = req.patterns.map((patternText) => {
      const regex = compilePattern(patternText);
      return regex.test(normalized);
    });

    const allMode = req.mode === "all" || !req.mode;
    const satisfied = allMode ? matches.every(Boolean) : matches.some(Boolean);
    patternMatches[req.id] = satisfied;

    if (satisfied) {
      matched.add(req.id);
    }
  });

  const missed = requirements
    .filter((req) => !patternMatches[req.id])
    .map((req) => req.description);

  const matchedLabels = requirements
    .filter((req) => patternMatches[req.id])
    .map((req) => req.description);

  const passed = missed.length === 0;

  return {
    passed,
    matched: matchedLabels,
    missing: missed,
    patternMatches,
    feedback: passed
      ? "Great structure detected. Your solution includes the required pieces."
      : `I found ${matchedLabels.length} of ${requirements.length} required parts. Missing: ${missed.join(", ")}.`
  };
}

export function checkPredictOutputAnswer(input: string, expected: string[]): CheckResult {
  const normalized = normalizeTextAnswer(input);
  const matched = expected.filter((line) =>
    normalized.includes(normalizeTextAnswer(line))
  );

  return {
    passed: matched.length >= Math.ceil(expected.length * 0.75),
    matched,
    missing: expected.filter((line) => !normalized.includes(normalizeTextAnswer(line))),
    feedback:
      matched.length === expected.length
        ? "That prediction matches the expected flow."
        : "Try the simulation step-by-step with the battery and loop rule."
  };
}
