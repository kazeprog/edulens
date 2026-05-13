import { normalizeTextbookName } from "@/lib/mistap/textbookUtils";

export type ReviewMode = "word-meaning" | "meaning-word";
export type ReviewResultStatus = "correct" | "incorrect";

export interface ReviewWord {
  word_number: number;
  word: string;
  meaning: string;
  textbook?: string;
}

export interface ReviewHistoryResult {
  selected_text: string | null;
  created_at: string;
  mode: ReviewMode | null;
  incorrect_words: ReviewWord[] | null;
  correct_words: ReviewWord[] | null;
}

export interface DueReviewWord extends ReviewWord {
  textbook: string;
  mode: ReviewMode;
  wrong_count: number;
  correct_count: number;
  correct_streak: number;
  last_seen_at: string;
  last_result: ReviewResultStatus;
  interval_days: number;
  due_at: string;
  overdue_days: number;
  retention: number;
  priority: number;
}

export interface DueReviewOptions {
  referenceDate?: Date;
  retentionThreshold?: number;
  maxWords?: number;
}

interface WordProgress extends ReviewWord {
  textbook: string;
  mode: ReviewMode;
  wrong_count: number;
  correct_count: number;
  correct_streak: number;
  last_seen_at: string;
  last_result: ReviewResultStatus;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const DEFAULT_REVIEW_RETENTION_THRESHOLD = 0.75;
export const DEFAULT_DUE_REVIEW_LIMIT = 20;
const CORRECT_STREAK_INTERVALS = [1, 3, 7, 14, 30, 60, 120];

const startOfLocalDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const diffCalendarDays = (later: Date, earlier: Date) => {
  return Math.floor((startOfLocalDay(later).getTime() - startOfLocalDay(earlier).getTime()) / MS_PER_DAY);
};

const getWordIdentity = (word: ReviewWord, fallbackTextbook: string, mode: ReviewMode) => {
  const normalizedWord = (word.word || "").trim().toLowerCase();
  return `${fallbackTextbook}|${word.word_number}|${normalizedWord}|${mode}`;
};

const getIntervalDays = (progress: WordProgress) => {
  if (progress.last_result === "incorrect") {
    return progress.wrong_count >= 2 ? 1 : 2;
  }

  const intervalIndex = Math.min(Math.max(progress.correct_streak - 1, 0), CORRECT_STREAK_INTERVALS.length - 1);
  const baseInterval = CORRECT_STREAK_INTERVALS[intervalIndex];

  if (progress.wrong_count >= 3) {
    return Math.max(1, Math.round(baseInterval * 0.6));
  }

  if (progress.wrong_count > 0) {
    return Math.max(1, Math.round(baseInterval * 0.8));
  }

  return baseInterval;
};

export const buildDueReviewWords = (
  results: ReviewHistoryResult[],
  options: DueReviewOptions | Date = {}
) => {
  const normalizedOptions = options instanceof Date ? { referenceDate: options } : options;
  const referenceDate = normalizedOptions.referenceDate ?? new Date();
  const retentionThreshold = normalizedOptions.retentionThreshold ?? DEFAULT_REVIEW_RETENTION_THRESHOLD;
  const maxWords = normalizedOptions.maxWords ?? DEFAULT_DUE_REVIEW_LIMIT;
  const progressMap = new Map<string, WordProgress>();
  const sortedResults = [...results].sort((a, b) => (
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ));

  const applyWord = (
    result: ReviewHistoryResult,
    word: ReviewWord,
    status: ReviewResultStatus
  ) => {
    if (!result.selected_text || !word?.word || !Number.isFinite(word.word_number)) return;

    const mode: ReviewMode = result.mode === "meaning-word" ? "meaning-word" : "word-meaning";
    const textbook = normalizeTextbookName(word.textbook || result.selected_text);
    const identity = getWordIdentity(word, textbook, mode);
    const existing = progressMap.get(identity);

    const next: WordProgress = existing
      ? {
        ...existing,
        word: word.word,
        meaning: word.meaning,
        last_seen_at: result.created_at,
        last_result: status,
        wrong_count: existing.wrong_count + (status === "incorrect" ? 1 : 0),
        correct_count: existing.correct_count + (status === "correct" ? 1 : 0),
        correct_streak: status === "correct" ? existing.correct_streak + 1 : 0,
      }
      : {
        word_number: word.word_number,
        word: word.word,
        meaning: word.meaning,
        textbook,
        mode,
        wrong_count: status === "incorrect" ? 1 : 0,
        correct_count: status === "correct" ? 1 : 0,
        correct_streak: status === "correct" ? 1 : 0,
        last_seen_at: result.created_at,
        last_result: status,
      };

    progressMap.set(identity, next);
  };

  sortedResults.forEach((result) => {
    result.incorrect_words?.forEach((word) => applyWord(result, word, "incorrect"));
    result.correct_words?.forEach((word) => applyWord(result, word, "correct"));
  });

  const today = startOfLocalDay(referenceDate);

  return Array.from(progressMap.values())
    .map<DueReviewWord>((progress) => {
      const lastSeenDate = new Date(progress.last_seen_at);
      const intervalDays = getIntervalDays(progress);
      const dueDate = addDays(startOfLocalDay(lastSeenDate), intervalDays);
      const daysSinceSeen = Math.max(0, diffCalendarDays(referenceDate, lastSeenDate));
      const overdueDays = Math.max(0, diffCalendarDays(today, dueDate));
      const memoryStrengthDays = intervalDays / -Math.log(retentionThreshold);
      const retention = Math.max(0, Math.min(1, Math.exp(-daysSinceSeen / memoryStrengthDays)));
      const priority = (1 - retention) * 100
        + progress.wrong_count * 8
        + (progress.last_result === "incorrect" ? 20 : 0)
        + overdueDays * 1.5;

      return {
        ...progress,
        interval_days: intervalDays,
        due_at: dueDate.toISOString(),
        overdue_days: overdueDays,
        retention,
        priority,
      };
    })
    .filter((word) => {
      const lastSeenDay = startOfLocalDay(new Date(word.last_seen_at)).getTime();
      if (lastSeenDay === today.getTime()) return false;

      return word.retention < retentionThreshold || word.last_result === "incorrect";
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.due_at !== b.due_at) return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      return a.word_number - b.word_number;
    })
    .slice(0, maxWords);
};
