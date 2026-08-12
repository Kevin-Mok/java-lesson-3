import { PersistedLessonState } from "@/types/lesson";

export const LESSON_STORAGE_KEY = "java-robotics-lesson-v2";
export const LESSON_SCHEMA_VERSION = 1;

export const DEFAULT_LESSON_STATE: PersistedLessonState = {
  schemaVersion: LESSON_SCHEMA_VERSION,
  currentSectionId: "section-1",
  completedSectionIds: [],
  timer: {
    accumulatedSeconds: 0,
    isRunning: false,
    lastStartedAt: null
  },
  textAnswers: {},
  codeAnswers: {},
  checkAttempts: {},
  latestFeedback: {},
  revealedHints: {},
  revealedSolutions: {},
  completedInteractions: {},
  lessonCompleted: false
};

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function coerceTimer(value: unknown): PersistedLessonState["timer"] {
  if (!isObject(value)) {
    return DEFAULT_LESSON_STATE.timer;
  }

  return {
    accumulatedSeconds: Number((value as any).accumulatedSeconds) || 0,
    isRunning: Boolean((value as any).isRunning),
    lastStartedAt: (value as any).lastStartedAt != null ? Number((value as any).lastStartedAt) : null
  };
}

function sanitizeLoadedState(raw: unknown): PersistedLessonState {
  if (!isObject(raw)) {
    return DEFAULT_LESSON_STATE;
  }

  const hasValidVersion = Number(raw.schemaVersion) === LESSON_SCHEMA_VERSION;

  const hydrated: PersistedLessonState = {
    schemaVersion: hasValidVersion ? LESSON_SCHEMA_VERSION : LESSON_SCHEMA_VERSION,
    currentSectionId:
      typeof raw.currentSectionId === "string" && raw.currentSectionId.length > 0
        ? raw.currentSectionId
        : DEFAULT_LESSON_STATE.currentSectionId,
    completedSectionIds: Array.isArray((raw as any).completedSectionIds)
      ? (raw as any).completedSectionIds.filter((entry: unknown) => typeof entry === "string")
      : [],
    timer: coerceTimer((raw as any).timer),
    textAnswers: isObject((raw as any).textAnswers) ? (raw as any).textAnswers : {},
    codeAnswers: isObject((raw as any).codeAnswers) ? (raw as any).codeAnswers : {},
    checkAttempts: isObject((raw as any).checkAttempts)
      ? (raw as any).checkAttempts
      : {},
    latestFeedback: isObject((raw as any).latestFeedback)
      ? (raw as any).latestFeedback
      : {},
    revealedHints: isObject((raw as any).revealedHints)
      ? (raw as any).revealedHints
      : {},
    revealedSolutions: isObject((raw as any).revealedSolutions)
      ? (raw as any).revealedSolutions
      : {},
    completedInteractions: isObject((raw as any).completedInteractions)
      ? (raw as any).completedInteractions
      : {},
    lessonCompleted: Boolean((raw as any).lessonCompleted)
  };

  return hydrated;
}

export function loadLessonState(): PersistedLessonState {
  if (typeof window === "undefined") {
    return DEFAULT_LESSON_STATE;
  }

  try {
    const raw = window.localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_LESSON_STATE;
    }

    return sanitizeLoadedState(JSON.parse(raw));
  } catch {
    return DEFAULT_LESSON_STATE;
  }
}

export function saveLessonState(state: PersistedLessonState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignored by design
  }
}

export function resetLessonState(): PersistedLessonState {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LESSON_STORAGE_KEY);
  }

  return DEFAULT_LESSON_STATE;
}
