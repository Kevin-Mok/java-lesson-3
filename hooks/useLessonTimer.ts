"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PersistedTimerState } from "@/types/lesson";

export interface TimerApi {
  timer: PersistedTimerState;
  elapsedSeconds: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useLessonTimer(
  initialTimer: PersistedTimerState,
  onPersistTimer: (timer: PersistedTimerState) => void
): TimerApi {
  const [timer, setTimer] = useState<PersistedTimerState>(initialTimer);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimer((current) => {
      if (current.accumulatedSeconds === initialTimer.accumulatedSeconds &&
          current.isRunning === initialTimer.isRunning &&
          current.lastStartedAt === initialTimer.lastStartedAt) {
        return current;
      }
      return initialTimer;
    });
  }, [initialTimer]);

  useEffect(() => {
    if (!timer.isRunning) {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.isRunning]);

  useEffect(() => {
    onPersistTimer(timer);
  }, [timer, onPersistTimer]);

  const elapsedSeconds =
    timer.accumulatedSeconds +
    (timer.isRunning && timer.lastStartedAt !== null
      ? Math.max(0, Math.floor((Date.now() - timer.lastStartedAt) / 1000))
      : 0);

  const start = useCallback(() => {
    setTimer((current) => {
      if (current.isRunning) {
        return current;
      }

      const next: PersistedTimerState = {
        ...current,
        isRunning: true,
        lastStartedAt: Date.now()
      };
      onPersistTimer(next);
      return next;
    });
  }, [onPersistTimer]);

  const pause = useCallback(() => {
    setTimer((current) => {
      if (!current.isRunning || current.lastStartedAt === null) {
        return current;
      }

      const now = Date.now();
      const extraSeconds = Math.max(0, Math.floor((now - current.lastStartedAt) / 1000));
      const next: PersistedTimerState = {
        accumulatedSeconds: current.accumulatedSeconds + extraSeconds,
        isRunning: false,
        lastStartedAt: null
      };
      onPersistTimer(next);
      return next;
    });
  }, [onPersistTimer]);

  const resume = useCallback(() => {
    setTimer((current) => {
      if (current.isRunning) {
        return current;
      }

      const next: PersistedTimerState = {
        ...current,
        isRunning: true,
        lastStartedAt: Date.now()
      };
      onPersistTimer(next);
      return next;
    });
  }, [onPersistTimer]);

  const reset = useCallback(() => {
    const next: PersistedTimerState = {
      accumulatedSeconds: 0,
      isRunning: false,
      lastStartedAt: null
    };
    setTimer(next);
    onPersistTimer(next);
  }, [onPersistTimer]);

  return {
    timer,
    elapsedSeconds,
    start,
    pause,
    resume,
    reset
  };
}
