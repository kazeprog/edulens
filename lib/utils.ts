import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSクラスをマージするユーティリティ関数
 * clsxで条件付きクラスを処理し、tailwind-mergeで競合を解決
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 日付を「YYYY-MM-DD」形式でフォーマット
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}

/**
 * 日付を「M月D日」形式でフォーマット（日本語表示用）
 */
export function formatDateJP(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 今日の日付を取得（YYYY-MM-DD形式）
 */
export function getToday(): string {
    return formatDate(new Date());
}

/**
 * N日前の日付を取得
 */
export function getDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

/**
 * ワーク進捗率を計算（0-100）
 */
export function calculateProgress(current: number, target: number): number {
    if (target <= 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
}

/**
 * 締め切りまでの残り日数を計算
 */
export function getDaysUntilDeadline(deadline: string | null): number | null {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 日割り目標ページを計算
 */
export function calculateDailyTarget(
    currentPage: number,
    targetPage: number,
    deadline: string | null
): number | null {
    const daysLeft = getDaysUntilDeadline(deadline);
    if (daysLeft === null || daysLeft <= 0) return null;
    const pagesRemaining = targetPage - currentPage;
    if (pagesRemaining <= 0) return 0;
    return Math.ceil(pagesRemaining / daysLeft);
}
