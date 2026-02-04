/**
 * 教科書名を正規化するユーティリティ関数
 */

/**
 * 教科書名から基本の教科書名を抽出（レッスン番号などを除去）
 * 例: "New Crown 中1 - Lesson1" -> "New Crown 中1"
 */
export const normalizeTextbookName = (textbook: string): string => {
    if (!textbook) return '';

    return textbook
        .replace(/\s*[-–—]\s*.*$/, '')  // ハイフン以降を除去
        .replace(/\s*(Lesson|Unit|Chapter|LESSON|UNIT|CHAPTER)\s*\d+.*$/i, '')  // Lesson等を除去
        .replace(/[\s]*[（(][^）)]*復習[^)）]*[)）][\s]*$/u, '') // (復習テスト)等を除去
        .replace(/[\s]*[（(][^）)]*(覚えた|要チェック|覚えていない)[^)）]*[)）][\s]*$/u, '') // 学習状況カテゴリを除去
        .replace(/[-–—\s]+$/, '')  // 末尾のハイフンやスペースを除去
        .trim();
};
