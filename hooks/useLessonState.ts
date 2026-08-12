"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  checkCodeRequirements,
  checkConceptAnswer,
  checkPredictOutputAnswer,
  CheckResult
} from "@/lib/answer-check";
import {
  DEFAULT_LESSON_STATE,
  loadLessonState,
  resetLessonState as clearState,
  saveLessonState
} from "@/lib/storage";
import { useLessonTimer } from "./useLessonTimer";
import { CodeQuestion, ConceptQuestion, PersistedLessonState, PredictOutputQuestion, LessonSection } from "@/types/lesson";

export interface LessonStateApi {
  state: PersistedLessonState;
  hydrated: boolean;
  elapsedSeconds: number;
  timerActions: {
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
  };
  setCurrentSection: (sectionId: string) => void;
  markSectionComplete: (sectionId: string) => void;
  setTextAnswer: (questionId: string, value: string) => void;
  setCodeAnswer: (questionId: string, value: string) => void;
  revealHint: (questionId: string) => void;
  revealSolution: (questionId: string) => void;
  checkConcept: (
    section: LessonSection,
    question: ConceptQuestion,
    answer: string
  ) => CheckResult;
  checkCode: (section: LessonSection, question: CodeQuestion, answer: string) => CheckResult;
  checkPredict: (
    section: LessonSection,
    question: PredictOutputQuestion,
    answer: string
  ) => CheckResult;
  getQuestionState: (questionId: string) => {
    checkAttempted: boolean;
    attempts: number;
    latestFeedback: CheckResult | null;
    hintRevealed: boolean;
    solutionRevealed: boolean;
  };
  resetLesson: () => void;
}

export function useLessonState(lessons: LessonSection[]): LessonStateApi {
  const [state, setState] = useState<PersistedLessonState>(DEFAULT_LESSON_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const nextState = loadLessonState();
    setState(nextState);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveLessonState(state);
  }, [state, hydrated]);

  const timerActions = useLessonTimer(state.timer, (timerState) => {
    setState((current) => ({ ...current, timer: timerState }));
  });

  const elapsedSeconds = timerActions.elapsedSeconds;
  const allQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    lessons.forEach((section) => {
      section.blocks.forEach((block) => {
        if (
          block.type === "concept" ||
          block.type === "code" ||
          block.type === "predict-output"
        ) {
          ids.add(block.id);
        }
      });
    });
    return ids;
  }, [lessons]);

  const hydrateSectionCompletion = useCallback((next: PersistedLessonState) => {
    const requiredCount = allQuestionIds.size;
    const attemptedCount = Object.entries(next.completedInteractions).filter(
      ([, completed]) => completed
    ).length;

    const allSectionsComplete =
      next.completedInteractions &&
      requiredCount > 0 &&
      attemptedCount >= requiredCount &&
      next.completedSectionIds.length >= lessons.length;

    return {
      ...next,
      lessonCompleted: Boolean(allSectionsComplete)
    };
  }, [allQuestionIds, lessons.length]);

  const setCurrentSection = useCallback((sectionId: string) => {
    setState((current) =>
      hydrateSectionCompletion({ ...current, currentSectionId: sectionId })
    );
  }, [hydrateSectionCompletion]);

  const markSectionComplete = useCallback((sectionId: string) => {
    setState((current) => {
      if (current.completedSectionIds.includes(sectionId)) {
        return hydrateSectionCompletion(current);
      }

      const next = {
        ...current,
        completedSectionIds: [...current.completedSectionIds, sectionId]
      };
      return hydrateSectionCompletion(next);
    });
  }, [hydrateSectionCompletion]);

  const setTextAnswer = useCallback((questionId: string, value: string) => {
    setState((current) => hydrateSectionCompletion({
      ...current,
      textAnswers: {
        ...current.textAnswers,
        [questionId]: value
      }
    }));
  }, [hydrateSectionCompletion]);

  const setCodeAnswer = useCallback((questionId: string, value: string) => {
    setState((current) => hydrateSectionCompletion({
      ...current,
      codeAnswers: {
        ...current.codeAnswers,
        [questionId]: value
      }
    }));
  }, [hydrateSectionCompletion]);

  const revealHint = useCallback((questionId: string) => {
    setState((current) => hydrateSectionCompletion({
      ...current,
      revealedHints: {
        ...current.revealedHints,
        [questionId]: true
      }
    }));
  }, [hydrateSectionCompletion]);

  const revealSolution = useCallback((questionId: string) => {
    setState((current) => hydrateSectionCompletion({
      ...current,
      revealedSolutions: {
        ...current.revealedSolutions,
        [questionId]: !current.revealedSolutions[questionId]
      }
    }));
  }, [hydrateSectionCompletion]);

  const recordCheck = useCallback((
    questionId: string,
    result: CheckResult,
    sectionId: string
  ) => {
    setState((current) => {
      const next = {
        ...current,
        checkAttempts: {
          ...current.checkAttempts,
          [questionId]: (current.checkAttempts[questionId] ?? 0) + 1
        },
        latestFeedback: {
          ...current.latestFeedback,
          [questionId]: result
        },
        completedInteractions: {
          ...current.completedInteractions,
          [questionId]: true
        },
        currentSectionId: sectionId
      };
      return hydrateSectionCompletion(next);
    });
  }, [hydrateSectionCompletion]);

  const checkConcept = useCallback((
    section: LessonSection,
    question: ConceptQuestion,
    answer: string
  ): CheckResult => {
    const result = checkConceptAnswer(
      answer,
      question.concepts,
      question.minimumConceptMatches
    );
    recordCheck(question.id, result, section.id);
    return result;
  }, [recordCheck]);

  const checkCode = useCallback((
    section: LessonSection,
    question: CodeQuestion,
    answer: string
  ): CheckResult => {
    const result = checkCodeRequirements(answer, question.requirements);
    recordCheck(question.id, result, section.id);
    return result;
  }, [recordCheck]);

  const checkPredict = useCallback((
    section: LessonSection,
    question: PredictOutputQuestion,
    answer: string
  ): CheckResult => {
    const result = checkPredictOutputAnswer(answer, question.expectedLines);
    recordCheck(question.id, result, section.id);
    return result;
  }, [recordCheck]);

  const getQuestionState = useCallback((questionId: string) => {
    return {
      checkAttempted: Boolean(state.latestFeedback[questionId]),
      attempts: state.checkAttempts[questionId] ?? 0,
      latestFeedback: (state.latestFeedback[questionId] as CheckResult) ?? null,
      hintRevealed: Boolean(state.revealedHints[questionId]),
      solutionRevealed: Boolean(state.revealedSolutions[questionId])
    };
  }, [state]);

  const resetLesson = useCallback(() => {
    setState(hydrateSectionCompletion(clearState()));
  }, [hydrateSectionCompletion]);

  return {
    state,
    hydrated,
    elapsedSeconds,
    timerActions,
    setCurrentSection,
    markSectionComplete,
    setTextAnswer,
    setCodeAnswer,
    revealHint,
    revealSolution,
    checkConcept,
    checkCode,
    checkPredict,
    getQuestionState,
    resetLesson
  };
}
