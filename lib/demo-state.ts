'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEMO_USER, PROBLEMS, type Difficulty } from '@/lib/mock-data';

const STORAGE_KEY = 'codeforge-demo-state';
const STATE_EVENT = 'codeforge-demo-state-updated';
const SESSION_COOKIE = 'codeforge-session';
const BASELINE_SOLVED_IDS = PROBLEMS.slice(0, 5).map((problem) => problem.id);

export type DemoSession = {
  email: string;
  name: string;
};

export type ProblemProgress = {
  attempts: number;
  answerViewed: boolean;
  solved: boolean;
  pointsAwarded: number;
};

type LocalAccount = {
  email: string;
  password: string;
  name: string;
};

type StoredState = {
  localAccounts: Record<string, LocalAccount>;
  session: DemoSession | null;
  problems: Record<string, ProblemProgress>;
  bonusPoints: number;
};

export type UserSummary = {
  points: number;
  totalSolved: number;
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
  streak: number;
  rank: number;
  name: string;
  email: string;
  avatar: string;
};

const DEFAULT_STATE: StoredState = {
  localAccounts: {},
  session: null,
  problems: {},
  bonusPoints: 0,
};

function createDefaultProblemProgress(): ProblemProgress {
  return {
    attempts: 0,
    answerViewed: false,
    solved: false,
    pointsAwarded: 0,
  };
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function readState(): StoredState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_STATE;

    if (!parsed.session) {
      const cookieSession = readCookie(SESSION_COOKIE);
      if (cookieSession) {
        parsed.session = JSON.parse(cookieSession);
      }
    }

    return {
      localAccounts: parsed.localAccounts || {},
      session: parsed.session || null,
      problems: parsed.problems || {},
      bonusPoints: parsed.bonusPoints || 0,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(nextState: StoredState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new Event(STATE_EVENT));
}

function updateState(updater: (current: StoredState) => StoredState) {
  const nextState = updater(readState());
  writeState(nextState);
  return nextState;
}

function getProblemDifficulty(problemId: string): Difficulty | null {
  return PROBLEMS.find((problem) => problem.id === problemId)?.difficulty ?? null;
}

export function getPointsForDifficulty(difficulty: Difficulty) {
  return {
    Easy: 10,
    Medium: 20,
    Hard: 30,
  }[difficulty];
}

export function getUserSummary(state: StoredState): UserSummary {
  const solvedProblemIds = Object.entries(state.problems)
    .filter(([, progress]) => progress.solved)
    .map(([problemId]) => problemId)
    .filter((problemId) => !BASELINE_SOLVED_IDS.includes(problemId));

  let solvedEasy = DEMO_USER.solvedEasy;
  let solvedMedium = DEMO_USER.solvedMedium;
  let solvedHard = DEMO_USER.solvedHard;

  for (const problemId of solvedProblemIds) {
    const difficulty = getProblemDifficulty(problemId);
    if (difficulty === 'Easy') solvedEasy += 1;
    if (difficulty === 'Medium') solvedMedium += 1;
    if (difficulty === 'Hard') solvedHard += 1;
  }

  return {
    ...DEMO_USER,
    name: state.session?.name || DEMO_USER.name,
    email: state.session?.email || DEMO_USER.email,
    points: DEMO_USER.points + state.bonusPoints,
    totalSolved: DEMO_USER.totalSolved + solvedProblemIds.length,
    solvedEasy,
    solvedMedium,
    solvedHard,
  };
}

export function useDemoAppState() {
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);

  useEffect(() => {
    const sync = () => setState(readState());
    sync();

    window.addEventListener('storage', sync);
    window.addEventListener(STATE_EVENT, sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(STATE_EVENT, sync);
    };
  }, []);

  const summary = useMemo(() => getUserSummary(state), [state]);

  const getProblemProgress = (problemId: string) =>
    state.problems[problemId] ?? createDefaultProblemProgress();

  const startSession = (session: DemoSession) => {
    const nextState = updateState((current) => ({
      ...current,
      session,
    }));
    setCookie(SESSION_COOKIE, JSON.stringify(session));
    setState(nextState);
  };

  const signOut = () => {
    const nextState = updateState((current) => ({
      ...current,
      session: null,
    }));
    clearCookie(SESSION_COOKIE);
    setState(nextState);
  };

  const registerLocalAccount = (account: LocalAccount) => {
    const key = account.email.toLowerCase();
    const nextState = updateState((current) => ({
      ...current,
      localAccounts: {
        ...current.localAccounts,
        [key]: {
          ...account,
          email: key,
        },
      },
    }));
    setState(nextState);
  };

  const validateLocalAccount = (email: string, password: string) => {
    const account = readState().localAccounts[email.toLowerCase()];
    if (!account) return { ok: false, message: 'No local account found for this email.' };
    if (account.password !== password) return { ok: false, message: 'Incorrect password.' };
    return { ok: true, account };
  };

  const incrementAttempts = (problemId: string) => {
    const nextState = updateState((current) => {
      const currentProgress = current.problems[problemId] ?? createDefaultProblemProgress();

      return {
        ...current,
        problems: {
          ...current.problems,
          [problemId]: {
            ...currentProgress,
            attempts: currentProgress.attempts + 1,
          },
        },
      };
    });

    setState(nextState);
    return nextState.problems[problemId];
  };

  const revealAnswer = (problemId: string) => {
    const nextState = updateState((current) => {
      const currentProgress = current.problems[problemId] ?? createDefaultProblemProgress();

      return {
        ...current,
        problems: {
          ...current.problems,
          [problemId]: {
            ...currentProgress,
            answerViewed: true,
          },
        },
      };
    });

    setState(nextState);
    return nextState.problems[problemId];
  };

  const markSolved = (problemId: string, difficulty: Difficulty) => {
    const nextState = updateState((current) => {
      const freshProgress = current.problems[problemId] ?? createDefaultProblemProgress();
      const shouldAwardPoints = !freshProgress.solved && !freshProgress.answerViewed;
      const points = shouldAwardPoints ? getPointsForDifficulty(difficulty) : 0;

      return {
        ...current,
        bonusPoints: current.bonusPoints + points,
        problems: {
          ...current.problems,
          [problemId]: {
            ...freshProgress,
            solved: true,
            pointsAwarded: points,
          },
        },
      };
    });

    setState(nextState);
    const updatedProgress = nextState.problems[problemId];

    return {
      awardedPoints: updatedProgress.pointsAwarded,
      earnedPoints: updatedProgress.pointsAwarded > 0,
    };
  };

  return {
    state,
    summary,
    hasSession: Boolean(state.session),
    getProblemProgress,
    startSession,
    signOut,
    registerLocalAccount,
    validateLocalAccount,
    incrementAttempts,
    revealAnswer,
    markSolved,
    baselineSolvedIds: BASELINE_SOLVED_IDS,
  };
}
