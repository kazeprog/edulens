import { textbookVocabulary } from '@/lib/data/textbook-vocabulary';
import { getJsonTextbookData, type TextbookWord } from '@/lib/mistap/jsonTextbookData';

export interface WordbookConfig {
    name: string;
    jpName: string;
    unitLabel: string;
    totalUnits: number;
    getRange: (unit: number) => { start: number; end: number };
}

export const WORDBOOK_CONFIG: Record<string, WordbookConfig> = {
    'target-1900': {
        name: 'Target 1900',
        jpName: 'ターゲット1900',
        unitLabel: 'Section',
        totalUnits: 19,
        getRange: (unit) => ({ start: (unit - 1) * 100 + 1, end: unit * 100 }),
    },
    'target-1400': {
        name: 'Target 1400',
        jpName: 'ターゲット1400',
        unitLabel: 'Section',
        totalUnits: 14,
        getRange: (unit) => ({ start: (unit - 1) * 100 + 1, end: unit * 100 }),
    },
    'target-1200': {
        name: 'Target 1200',
        jpName: 'ターゲット1200',
        unitLabel: 'Section',
        totalUnits: 20,
        getRange: (unit) => ({ start: (unit - 1) * 100 + 1, end: unit * 100 }),
    },
    'target-1800': {
        name: 'Target 1800',
        jpName: 'ターゲット1800',
        unitLabel: 'Section',
        totalUnits: 18,
        getRange: (unit) => ({ start: (unit - 1) * 100 + 1, end: unit * 100 }),
    },
    'absolute-150': {
        name: 'Words 150',
        jpName: '絶対覚える英単語150',
        unitLabel: 'Part',
        totalUnits: 3,
        getRange: (unit) => ({ start: (unit - 1) * 50 + 1, end: unit * 50 }),
    },
    'past-tense': {
        name: 'Past Tense',
        jpName: '過去形',
        unitLabel: 'Part',
        totalUnits: 1,
        getRange: () => ({ start: 1, end: 100 }),
    },
    'past-participle': {
        name: 'Past Participle',
        jpName: '過去形、過去分詞形',
        unitLabel: 'Part',
        totalUnits: 1,
        getRange: () => ({ start: 1, end: 100 }),
    },
    'system-words': {
        name: 'System English Word',
        jpName: 'システム英単語',
        unitLabel: 'Chapter',
        totalUnits: 5,
        getRange: (unit) => {
            const ranges = [
                { start: 1, end: 600 },
                { start: 601, end: 1200 },
                { start: 1201, end: 1685 },
                { start: 1686, end: 2027 },
                { start: 2028, end: 2200 },
            ];
            return ranges[unit - 1] || { start: 1, end: 100 };
        },
    },
    'leap': {
        name: 'LEAP',
        jpName: 'LEAP',
        unitLabel: 'Part',
        totalUnits: 4,
        getRange: (unit) => ({ start: (unit - 1) * 400 + 1, end: unit * 400 }), // Approx
    },
    'duo-30': {
        name: 'DUO 3.0',
        jpName: 'DUO 3.0',
        unitLabel: 'Section',
        totalUnits: 45,
        getRange: (unit) => ({ start: unit, end: unit }), // DUO usually tests by Section ID, not word range? Or range of sections? Assuming 1 section.
        // Actually TestSetupContent for DUO usually uses "Section" mode if available, otherwise word number?
        // DUO word numbering is complex. Let's assume generic numbers for now or handle DUO specifically if needed.
        // For now we return dummy range, assuming user just lands on the page.
    },
    // Add others as needed with generic config
    'toeic-gold': {
        name: 'TOEIC金のフレーズ',
        jpName: '金のフレーズ',
        unitLabel: 'Level',
        totalUnits: 4,
        getRange: (unit) => ({ start: (unit - 1) * 200 + 1, end: unit * 200 }),
    },
    'kobun-315': {
        name: '重要古文単語315',
        jpName: '重要古文単語315',
        unitLabel: '章',
        totalUnits: 8,
        getRange: (unit) => ({ start: (unit - 1) * 40 + 1, end: unit * 40 }),
    },
    'kobun-330': {
        name: 'Key＆Point古文単語330',
        jpName: 'Key＆Point古文単語330',
        unitLabel: '章',
        totalUnits: 5,
        getRange: (unit) => ({ start: (unit - 1) * 60 + 1, end: unit * 60 }),
    },
    'kobun-325': {
        name: 'ベストセレクション古文単語325',
        jpName: 'ベストセレクション古文単語325',
        unitLabel: '章',
        totalUnits: 5,
        getRange: (unit) => ({ start: (unit - 1) * 60 + 1, end: unit * 60 }),
    },
    'kobun-351': {
        name: '理解を深める核心古文単語351',
        jpName: '核心古文単語351',
        unitLabel: '章',
        totalUnits: 7,
        getRange: (unit) => ({ start: (unit - 1) * 50 + 1, end: Math.min(unit * 50, 351) }),
    },
};

// 中学教科書のLesson一覧を取得する
export function getAvailableLessons(textbookName: string, grade: string): number[] {
    // 1. まずJSONデータからの取得を試みる
    const jsonData: TextbookWord[] | null = getJsonTextbookData(textbookName);
    if (jsonData && jsonData.length > 0) {
        let rawUnits: number[] = [];

        // 教科書ごとの特有のロジック
        // New Horizonは section が 0 のことが多く、unit を使うべき
        if (textbookName.toLowerCase().includes('horizon')) {
            rawUnits = jsonData
                .filter((w: TextbookWord) => w.grade === grade && w.unit > 0)
                .map((w: TextbookWord) => w.unit);
        }
        // New Crown は section (Lesson) を使うのが一般的だが、section=0 (Let's Startなど) もある
        // sitemapには section > 0 のみを含めるという既存ロジックを踏襲
        else if (textbookName.toLowerCase().includes('crown')) {
            rawUnits = jsonData
                .filter((w: TextbookWord) => w.grade === grade && w.section > 0)
                .map((w: TextbookWord) => w.section);
        }
        // その他（デフォルト）: section があれば section, なければ unit
        else {
            rawUnits = jsonData
                .filter((w: TextbookWord) => w.grade === grade)
                .map((w: TextbookWord) => w.section > 0 ? w.section : w.unit);
        }

        if (rawUnits.length > 0) {
            return Array.from(new Set(rawUnits)).sort((a, b) => a - b);
        }
    }

    // 2. JSONで取れなかった場合は、古い `textbookVocabulary` (`lib/data/textbook-vocabulary.ts`) から取得 (フォールバック)
    const rawUnits = textbookVocabulary
        .filter(w => w.textbook === textbookName && w.grade === grade)
        .map(w => w.section);

    // ユニークなSection(Lesson)番号を取得してソート
    return Array.from(new Set(rawUnits)).sort((a, b) => a - b).filter(s => s > 0);
}
