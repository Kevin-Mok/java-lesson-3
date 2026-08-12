export type BlockType =
  | "explanation"
  | "code-example"
  | "concept"
  | "code"
  | "predict-output"
  | "callout"
  | "transition";

export interface ConceptRequirement {
  id: string;
  label: string;
  aliases: string[];
}

export interface ConceptQuestion {
  id: string;
  type: "concept";
  prompt: string;
  concepts: ConceptRequirement[];
  minimumConceptMatches: number;
  modelAnswer: string;
  hint?: string;
}

export interface PredictOutputQuestion {
  id: string;
  type: "predict-output";
  prompt: string;
  javaSnippet: string;
  expectedLines: string[];
  modelAnswer: string;
  hint?: string;
}

export interface CodeRequirement {
  id: string;
  description: string;
  patterns: string[];
  mode?: "all" | "any";
}

export interface CodeQuestion {
  id: string;
  type: "code";
  prompt: string;
  requirements: CodeRequirement[];
  modelAnswer: string;
  hint?: string;
  note?: string;
}

export interface LessonCodeBlock {
  id: string;
  type: "code-example";
  title?: string;
  code: string;
}

export interface ExplanationBlock {
  id: string;
  type: "explanation";
  title?: string;
  markdown: string;
}

export interface CalloutBlock {
  id: string;
  type: "callout";
  tone: "important" | "tip" | "challenge";
  content: string;
}

export interface TransitionBlock {
  id: string;
  type: "transition";
  content: string;
}

export type LessonBlock =
  | ConceptQuestion
  | CodeQuestion
  | PredictOutputQuestion
  | LessonCodeBlock
  | ExplanationBlock
  | CalloutBlock
  | TransitionBlock;

export interface LessonSection {
  id: string;
  title: string;
  start: string;
  end: string;
  minutes: number;
  objectives: string[];
  blocks: LessonBlock[];
}

export interface PersistedTimerState {
  accumulatedSeconds: number;
  isRunning: boolean;
  lastStartedAt: number | null;
}

export interface PersistedLessonState {
  schemaVersion: number;
  currentSectionId: string;
  completedSectionIds: string[];
  timer: PersistedTimerState;
  textAnswers: Record<string, string>;
  codeAnswers: Record<string, string>;
  checkAttempts: Record<string, number>;
  latestFeedback: Record<string, any>;
  revealedHints: Record<string, boolean>;
  revealedSolutions: Record<string, boolean>;
  completedInteractions: Record<string, boolean>;
  lessonCompleted: boolean;
}
