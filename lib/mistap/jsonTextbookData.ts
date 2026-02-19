import newCrownData from "@/lib/data/json/new-crown.json";
import newHorizonData from "@/lib/data/json/new-horizon.json";
import target1900Data from "@/lib/data/json/ターゲット1900.json";
import target1200Data from "@/lib/data/json/ターゲット1200.json";
import target1400Data from "@/lib/data/json/ターゲット1400.json";
import target1800Data from "@/lib/data/json/ターゲット1800.json";
import systemWordsData from "@/lib/data/json/システム英単語.json";
import leapData from "@/lib/data/json/leap.json";
import toeicGoldData from "@/lib/data/json/toeic金のフレーズ.json";
import duo30Data from "@/lib/data/json/duo-30例文.json";
import kobun315Data from "@/lib/data/json/読んで見て聞いて覚える-重要古文単語315.json";
import kobun325Data from "@/lib/data/json/ベストセレクション古文単語325.json";
import kobun330Data from "@/lib/data/json/key＆point古文単語330.json";
import kobun351Data from "@/lib/data/json/理解を深める核心古文単語351.json";
import words150Data from "@/lib/data/json/絶対覚える英単語150.json";
import pastTenseData from "@/lib/data/json/過去形.json";
import pastParticipleData from "@/lib/data/json/過去形、過去分詞形.json";
import teppekiData from "@/lib/data/json/teppeki.json";
import systemWordsStage5Data from "@/lib/data/json/system-english-word-stage5.json";
import reformLeapData from "@/lib/data/json/reform_leap.json";

// 型定義
export interface TextbookWord {
    textbook: string;
    grade: string;
    section: number;
    unit: number;
    word_number: number;
    word: string;
    meaning: string;
}

const DATA_MAP: Record<string, TextbookWord[]> = {
    // 英語教科書
    "new-crown": newCrownData as TextbookWord[],
    "new crown": newCrownData as TextbookWord[],
    "new-horizon": newHorizonData as TextbookWord[],
    "new horizon": newHorizonData as TextbookWord[],

    // 英単語帳
    "target-1900": target1900Data as TextbookWord[],
    "ターゲット1900": target1900Data as TextbookWord[],
    "target-1800": target1800Data as TextbookWord[],
    "ターゲット1800": target1800Data as TextbookWord[],
    "target-1200": target1200Data as TextbookWord[],
    "ターゲット1200": target1200Data as TextbookWord[],
    "target-1400": target1400Data as TextbookWord[],
    "ターゲット1400": target1400Data as TextbookWord[],
    "system-words": systemWordsData as TextbookWord[],
    "システム英単語": systemWordsData as TextbookWord[],
    "system-words-stage5": systemWordsStage5Data as TextbookWord[],
    "システム英単語 stage5": systemWordsStage5Data as TextbookWord[],
    "システム英単語 Stage5": systemWordsStage5Data as TextbookWord[],
    "leap": leapData as TextbookWord[],
    "LEAP": leapData as TextbookWord[],
    "toeic-gold": toeicGoldData as TextbookWord[],
    "TOEIC L&R TEST 出る単特急 金のフレーズ": toeicGoldData as TextbookWord[],
    "toeic金のフレーズ": toeicGoldData as TextbookWord[],
    "duo-30": duo30Data as TextbookWord[],
    "duo 3.0": duo30Data as TextbookWord[],
    "duo-30例文": duo30Data as TextbookWord[],
    "teppeki": teppekiData as TextbookWord[],
    "改訂版 鉄緑会東大英単語熟語 鉄壁": teppekiData as TextbookWord[],
    "東大英単語熟語 鉄壁": teppekiData as TextbookWord[],
    "reform-leap": reformLeapData as TextbookWord[],
    "改訂版 必携英単語LEAP": reformLeapData as TextbookWord[],

    // 古文単語
    "kobun-315": kobun315Data as TextbookWord[],
    "読んで見て聞いて覚える 重要古文単語315": kobun315Data as TextbookWord[],
    "kobun-325": kobun325Data as TextbookWord[],
    "ベストセレクション古文単語325": kobun325Data as TextbookWord[],
    "kobun-330": kobun330Data as TextbookWord[],
    "key&point古文単語330": kobun330Data as TextbookWord[],
    "kobun-351": kobun351Data as TextbookWord[],
    "核心古文単語351": kobun351Data as TextbookWord[],
    "理解を深める核心古文単語351": kobun351Data as TextbookWord[],

    // 中学・基礎
    "absolute-150": words150Data as TextbookWord[],
    "絶対覚える英単語150": words150Data as TextbookWord[],
    "past-tense": pastTenseData as TextbookWord[],
    "過去形": pastTenseData as TextbookWord[],
    "past-participle": pastParticipleData as TextbookWord[],
    "過去形、過去分詞形": pastParticipleData as TextbookWord[],
};

export function getJsonTextbookData(textbookName: string): TextbookWord[] | null {
    if (!textbookName) return null;

    const normalized = textbookName.toLowerCase().replace(/\s+/g, '-');

    // 完全一致チェック
    if (DATA_MAP[normalized]) return DATA_MAP[normalized];
    if (DATA_MAP[textbookName]) return DATA_MAP[textbookName];

    // 部分一致や揺らぎ吸収ロジック
    if (normalized.includes("new-crown")) return DATA_MAP["new-crown"];
    if (normalized.includes("new-horizon")) return DATA_MAP["new-horizon"];
    if (normalized.includes("target-1900") || textbookName.includes("ターゲット1900")) return DATA_MAP["target-1900"];
    if (normalized.includes("target-1400") || textbookName.includes("ターゲット1400")) return DATA_MAP["target-1400"];
    if (normalized.includes("target-1800") || textbookName.includes("ターゲット1800")) return DATA_MAP["target-1800"];
    if (normalized.includes("target-1200") || textbookName.includes("ターゲット1200")) return DATA_MAP["target-1200"];
    if (normalized.includes("stage5") && (normalized.includes("system") || textbookName.includes("システム英単語"))) return DATA_MAP["system-words-stage5"];
    if (normalized.includes("system") || textbookName.includes("システム英単語")) return DATA_MAP["system-words"];
    if (normalized.includes("reform-leap") || textbookName.includes("改訂版 必携英単語LEAP")) return DATA_MAP["reform-leap"];
    if (normalized.includes("leap")) return DATA_MAP["leap"];
    if (normalized.includes("toeic") || textbookName.includes("金のフレーズ")) return DATA_MAP["toeic-gold"];
    if (normalized.includes("duo")) return DATA_MAP["duo-30"];
    if (normalized.includes("315")) return DATA_MAP["kobun-315"];
    if (normalized.includes("325")) return DATA_MAP["kobun-325"];
    if (normalized.includes("330")) return DATA_MAP["kobun-330"];
    if (normalized.includes("351")) return DATA_MAP["kobun-351"];
    if (normalized.includes("teppeki") || textbookName.includes("鉄壁")) return DATA_MAP["teppeki"];


    return null;
}

// 登録されている教科書名のリスト（ユニーク化・ソート済み）
export const AVAILABLE_TEXTBOOKS = Array.from(new Set(
    Object.values(DATA_MAP).map(data => data[0]?.textbook).filter(Boolean)
)).sort();
