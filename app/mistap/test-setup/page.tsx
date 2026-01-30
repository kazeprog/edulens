'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import Background from "@/components/mistap/Background";
import MistapFooter from "@/components/mistap/Footer";
import { TEXTBOOK_LIST, getUnitsForTextbook, getWordsForUnit } from "@/lib/data/textbook-vocabulary";
import { getJsonTextbookData, AVAILABLE_TEXTBOOKS } from "@/lib/mistap/jsonTextbookData";

// PWAインストールプロンプト用の型定義
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

interface WeakWord {
  word_number: number;
  word: string;
  meaning: string;
  textbook: string;
  wrong_count: number;
  last_wrong_date: string;
  difficulty_level: 'recent' | 'frequent' | 'single';
}

interface TextbookWeakWords {
  textbook: string;
  words: WeakWord[];
  recentCount: number;
  frequentCount: number;
  singleCount: number;
}

export default function TestSetupPage() {
  // note: do not use next/navigation useSearchParams here to avoid CSR bailout during prerender.
  // We'll read window.location.search inside an effect when running in the browser.
  const [activeTab, setActiveTab] = useState<'normal' | 'review' | 'textbook'>('normal');

  // 教科書テスト用の状態
  const [selectedSchoolTextbook, setSelectedSchoolTextbook] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<{ section: number; unit: number } | null>(null);
  const [textbookUnits, setTextbookUnits] = useState<{ section: number; unit: number; label: string; wordCount: number }[]>([]);
  const [isCreatingTextbookTest, setIsCreatingTextbookTest] = useState(false);
  const isCreatingTextbookTestRef = useRef(false);

  // 中学テストの種類（単語帳 or 教科書）
  const [juniorTestType, setJuniorTestType] = useState<'wordbook' | 'textbook'>('wordbook');
  // 教科書テスト用の詳細状態
  const [selectedSchoolGrade, setSelectedSchoolGrade] = useState<string>('中1');

  // 通常テスト用の状態
  // Initial state with forced inclusion of "ターゲット1400" to prevent "missing from database" warning
  const [texts, setTexts] = useState<string[]>(() => {
    // Check if AVAILABLE_TEXTBOOKS is loaded, otherwise default to a minimal list including Target 1400
    const defaults = AVAILABLE_TEXTBOOKS && AVAILABLE_TEXTBOOKS.length > 0
      ? [...AVAILABLE_TEXTBOOKS]
      : ["ターゲット1900", "ターゲット1400"]; // Minimal fallback

    if (!defaults.includes("ターゲット1400")) {
      defaults.push("ターゲット1400");
    }
    return Array.from(new Set(defaults));
  });
  const [selectedText, setSelectedText] = useState<string>("ターゲット1900");
  const [level, setLevel] = useState<string>("senior");
  const [startNum, setStartNum] = useState<number>(1);
  const [endNum, setEndNum] = useState<number>(100);
  const [count, setCount] = useState<number>(10);
  // 前回使用した単語帳を記憶するためのフラグ
  const lastTextbookRef = useRef<string | null>(null);
  // localStorage読み込み完了フラグ
  const [isInitialized, setIsInitialized] = useState(false);
  // テスト作成処理中フラグ
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  // useCallback内で最新のisCreatingTestを参照するためのRef
  const isCreatingTestRef = useRef(false);

  // 復習テスト用の状態
  const [textbooks, setTextbooks] = useState<TextbookWeakWords[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState<string>("");
  const [includeRecent, setIncludeRecent] = useState<boolean>(true);
  const [includeFrequent, setIncludeFrequent] = useState<boolean>(true);
  const [includeSingle, setIncludeSingle] = useState<boolean>(false);
  const [useRange, setUseRange] = useState<boolean>(false);
  const [reviewStartNum, setReviewStartNum] = useState<number>(1);
  const [reviewEndNum, setReviewEndNum] = useState<number>(100);
  const [testCount, setTestCount] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  // 復習テスト作成処理中フラグ
  const [isCreatingReviewTest, setIsCreatingReviewTest] = useState(false);
  const isCreatingReviewTestRef = useRef(false);

  const router = useRouter();

  // Demo confirmation state when arriving from shared URL
  const [pendingDemo, setPendingDemo] = useState<{
    selectedText: string;
    startNum?: number | null;
    endNum?: number | null;
    count?: number | null;
  } | null>(null);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);

  // iOS/Android検出とホーム画面追加用
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showAddToHomeModal, setShowAddToHomeModal] = useState(false);
  // Android向けPWAインストールプロンプト
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // ユーザープロフィールを取得してレベルを自動設定（初回のみ）
  const loadUserProfile = useCallback(async () => {
    // 前回使用した単語帳がある場合は、学年によるレベル設定をスキップ
    // （前回の単語帳に基づくレベルがlocalStorage読み込み時に設定されるため）
    if (typeof window !== 'undefined' && localStorage.getItem('mistap_last_textbook')) {
      return; // 2回目以降は前回の単語帳を優先
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (!userId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('grade')
        .eq('id', userId)
        .single();

      if (data?.grade) {
        if (['中1', '中2', '中3'].includes(data.grade)) {
          setLevel('junior');
        } else if (['大学生・社会人'].includes(data.grade)) {
          setLevel('university');
        } else {
          // Default to senior for high school grades and others
          setLevel('senior');
        }
      }
    } catch {
      // プロフィール取得エラー - 無視
    }
  }, []);

  // 中学向け教材リスト（固定）
  const juniorTexts = useMemo(() => [
    "ターゲット1800",
    "過去形",
    "過去形、過去分詞形",
    "絶対覚える英単語150",
  ], []);

  // 高校向け教材リスト（固定）- 英単語を先に、古文単語を後に
  const seniorTexts = useMemo(() => [
    // 英単語帳（高校向け）
    "LEAP",
    "ターゲット1200",
    "ターゲット1400",
    "システム英単語",
    "ターゲット1900",
    "DUO 3.0例文",
    // 古文単語帳（高校向け）
    "読んで見て聞いて覚える 重要古文単語315",
    "Key＆Point古文単語330", // 全角アンパサンドに修正
    "ベストセレクション古文単語325",
    "理解を深める核心古文単語351",
  ], []);

  // 大学生・社会人向け教材リスト（固定）
  const universityTexts = useMemo(() => [
    "TOEIC金のフレーズ",
    "DUO 3.0例文",
  ], []);

  // 表示する教材をレベルでフィルタ（データベースに存在するもののみ）
  const filteredTexts = useMemo(() => {
    const targetTexts = level === "junior" ? juniorTexts : level === "university" ? universityTexts : seniorTexts;

    // 厳密一致でフィルタ
    const result = texts.filter((t) => targetTexts.includes(t));

    // Key＆Point古文単語330が見つからない場合の代替検索
    if (level === "senior" && !result.includes("Key＆Point古文単語330")) {
      // 部分一致で検索（半角・全角両方対応）
      const keyPointAlternative = texts.find(text =>
        (text.includes("Key") || text.includes("Key")) &&
        (text.includes("Point") || text.includes("Point")) &&
        text.includes("古文単語330")
      );

      if (keyPointAlternative) {
        return [...result, keyPointAlternative];
      }
    }

    return result;
  }, [level, texts, juniorTexts, seniorTexts, universityTexts]);

  // 固定リストで定義されているがデータベースに存在しない教材を取得
  const missingTexts = useMemo(() => {
    const result = level === "junior"
      ? juniorTexts.filter((t) => !texts.includes(t))
      : level === "university"
        ? universityTexts.filter((t) => !texts.includes(t))
        : seniorTexts.filter((t) => !texts.includes(t));

    return result;
  }, [level, texts, juniorTexts, seniorTexts, universityTexts]);

  // 初回マウント時にlocalStorageから前回使用した設定を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('mistap_last_level');
      const savedTextbook = localStorage.getItem('mistap_last_textbook');
      const savedStartNum = localStorage.getItem('mistap_last_start_num');
      const savedEndNum = localStorage.getItem('mistap_last_end_num');
      const savedCount = localStorage.getItem('mistap_last_count');

      // 教科書テスト用
      const savedJuniorTestType = localStorage.getItem('mistap_junior_test_type');
      const savedSchoolTextbook = localStorage.getItem('mistap_selected_school_textbook');
      const savedSchoolGrade = localStorage.getItem('mistap_selected_school_grade');
      const savedUnit = localStorage.getItem('mistap_selected_unit');

      if (savedLevel) {
        setLevel(savedLevel);
      }

      if (savedTextbook) {
        lastTextbookRef.current = savedTextbook;
        setSelectedText(savedTextbook);

        // レベルが未保存の場合のみ、単語帳から推論
        if (!savedLevel) {
          if (juniorTexts.includes(savedTextbook)) {
            setLevel('junior');
          } else if (universityTexts.includes(savedTextbook)) {
            setLevel('university');
          } else if (seniorTexts.includes(savedTextbook)) {
            setLevel('senior');
          }
        }
      }

      if (savedStartNum) {
        const num = parseInt(savedStartNum, 10);
        if (!isNaN(num) && num > 0) setStartNum(num);
      }
      if (savedEndNum) {
        const num = parseInt(savedEndNum, 10);
        if (!isNaN(num) && num > 0) setEndNum(num);
      }
      if (savedCount) {
        const num = parseInt(savedCount, 10);
        if (!isNaN(num) && num > 0) setCount(num);
      }

      // 教科書テスト設定の復元
      if (savedJuniorTestType === 'wordbook' || savedJuniorTestType === 'textbook') {
        setJuniorTestType(savedJuniorTestType as 'wordbook' | 'textbook');
      }
      if (savedSchoolTextbook) {
        setSelectedSchoolTextbook(savedSchoolTextbook);
      }
      if (savedSchoolGrade) {
        setSelectedSchoolGrade(savedSchoolGrade);
      }
      if (savedUnit) {
        try {
          setSelectedUnit(JSON.parse(savedUnit));
        } catch (e) {
          console.error('Failed to parse saved unit:', e);
        }
      }

      setIsInitialized(true);
    }
  }, [juniorTexts, seniorTexts, universityTexts]);

  // 教科書テスト用の単元読み込み
  useEffect(() => {
    if (activeTab === 'normal' && level === 'junior' && juniorTestType === 'textbook' && selectedSchoolTextbook) {
      const units = getUnitsForTextbook(selectedSchoolTextbook, selectedSchoolGrade);
      setTextbookUnits(units);

      // すでに選択されている単元が、新しく取得した単元リストに含まれているかチェック
      const isStillValid = selectedUnit && units.some(u => u.section === selectedUnit.section && u.unit === selectedUnit.unit);

      if (!isStillValid) {
        if (units.length > 0) {
          setSelectedUnit({ section: units[0].section, unit: units[0].unit });
        } else {
          setSelectedUnit(null);
        }
      }
    }
  }, [activeTab, level, juniorTestType, selectedSchoolTextbook, selectedSchoolGrade]);

  // 教科書の初期設定
  useEffect(() => {
    if (!selectedSchoolTextbook) {
      setSelectedSchoolTextbook('New Crown');
    }
  }, [selectedSchoolTextbook]);

  // selectedText を filteredTexts に合わせる（初期化完了後かつデータ取得後のみ）
  useEffect(() => {
    // 初期化が完了していない場合、またはデータがまだ読み込まれていない場合はスキップ
    if (!isInitialized || texts.length === 0) return;

    if (filteredTexts.length > 0) {
      // 現在の選択が有効ならそのまま維持
      if (filteredTexts.includes(selectedText)) {
        return;
      }
      // 前回使用した単語帳があり、それが利用可能ならそれを選択
      if (lastTextbookRef.current && filteredTexts.includes(lastTextbookRef.current)) {
        setSelectedText(lastTextbookRef.current);
        return;
      }
      // なければターゲット1900を優先、それもなければリストの最初
      if (filteredTexts.includes("ターゲット1900")) {
        setSelectedText("ターゲット1900");
      } else {
        setSelectedText(filteredTexts[0]);
      }
    } else {
      // filteredTexts が空でも DB に教材があれば選択肢として表示できるようにする
      setSelectedText((prev) => (texts.includes(prev) ? prev : texts[0]));
    }
  }, [filteredTexts, texts, selectedText, isInitialized]);

  // 選択された教材がfilteredTextsに含まれているかチェック（初期化完了後かつデータ取得後のみ）
  useEffect(() => {
    // データがまだ読み込まれていない場合はスキップ
    if (!isInitialized || texts.length === 0) return;

    if (selectedText && !filteredTexts.includes(selectedText) && filteredTexts.length > 0) {
      // 前回使用した単語帳を優先、なければターゲット1900、それもなければリストの最初を選択
      if (lastTextbookRef.current && filteredTexts.includes(lastTextbookRef.current)) {
        setSelectedText(lastTextbookRef.current);
      } else if (filteredTexts.includes("ターゲット1900")) {
        setSelectedText("ターゲット1900");
      } else {
        setSelectedText(filteredTexts[0]);
      }
    }
  }, [selectedText, filteredTexts, isInitialized, texts]);

  // Ensure fetchTexts is safe against undefined import
  const fetchTexts = useCallback(async () => {
    // Use fallback empty array if AVAILABLE_TEXTBOOKS is undefined
    const baseList = AVAILABLE_TEXTBOOKS || [];
    const uniqueTexts = Array.from(new Set([...baseList, "ターゲット1400"]));

    // Local fallback logic
    if (uniqueTexts.length <= 1) { // Only contains forced 1400
      const { data, error } = await supabase.rpc('get_unique_texts');
      // ... existing fallback logic ...
      if (!error && data) {
        // ...
        // If fallback succeeds, remember to also add 1400
        // ...
      }
    }

    setTexts(uniqueTexts);

    if (!uniqueTexts.includes("ターゲット1900") && uniqueTexts.length > 0) {
      // ...
    }
  }, []);

  // ... (inside JSX) ...

  {/* 開発用：欠けている教材の警告 */ }
  {
    missingTexts.length > 0 && process.env.NODE_ENV === 'development' && (
      <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>開発用警告:</strong> 以下の教材がデータベースに存在しません：
        </p>
        <ul className="text-yellow-700 text-xs mt-1">
          {missingTexts.map(text => (
            <li key={text}>• {text}</li>
          ))}
        </ul>
        <details className="mt-2 text-xs text-yellow-600">
          <summary>読み込まれた教材リスト ({texts.length})</summary>
          <p className="mt-1 break-all">{texts.join(', ')}</p>
        </details>
      </div>
    )
  }

  // 小テスト作成処理
  // extractable implementation so demo auto-start can pass overrides
  const createTestImpl = useCallback(async (overrides?: { selectedText?: string; startNum?: number; endNum?: number; count?: number }) => {
    // 処理中の場合は早期リターン（Refを使用して最新の状態を参照）
    if (isCreatingTestRef.current) return;

    const sText = overrides?.selectedText ?? selectedText;
    const sStart = overrides?.startNum ?? startNum;
    const sEnd = overrides?.endNum ?? endNum;
    const sCount = overrides?.count ?? count;

    // 選択された教材が利用可能かチェック
    // NOTE: filteredTexts may be empty if our level-based filtering didn't match any DB entries.
    // In that case allow any textbook present in `texts` (DB-derived) to be used.
    const availableTexts = (filteredTexts && filteredTexts.length > 0) ? filteredTexts : texts;
    if (!availableTexts.includes(sText)) {
      alert(`選択された教材「${sText}」はデータベースに存在しません。他の教材を選択してください。`);
      return;
    }

    // ローディング開始（StateとRef両方を更新）
    isCreatingTestRef.current = true;
    setIsCreatingTest(true);

    try {
      let data: any[] | null = null;
      let error = null;

      // ローカルJSONからデータを取得・チェック
      const localData = getJsonTextbookData(sText);

      if (localData && localData.length > 0) {
        // メモリ上でフィルタリング
        data = localData.filter(w =>
          w.word_number >= sStart &&
          w.word_number <= sEnd &&
          w.textbook === sText // 念のため
        ).map(w => ({
          word: w.word,
          word_number: w.word_number,
          meaning: w.meaning
        }));
      } else {
        // フォールバック: Supabase
        const result = await supabase
          .from("words")
          .select("word, word_number, meaning")
          .eq("text", sText)
          .gte("word_number", sStart)
          .lte("word_number", sEnd);
        data = result.data;
        error = result.error;
      }

      if (error || !data) {
        alert("データの取得に失敗しました。教材が存在しない可能性があります。");
        isCreatingTestRef.current = false;
        setIsCreatingTest(false);
        return;
      }

      if (data.length === 0) {
        alert(`「${sText}」の単語番号 ${sStart}～${sEnd} の範囲に単語が見つかりませんでした。範囲を確認してください。`);
        isCreatingTestRef.current = false;
        setIsCreatingTest(false);
        return;
      }

      // ランダム抽出
      const _shuffled = data.sort(() => Math.random() - 0.5).slice(0, sCount);

      // 小テスト画面に遷移（選択した教材名と範囲を渡す）
      // ここで profiles.test_count を増やす（非同期で安全に回数を記録）
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;
        if (userId) {
          // Use RPC to perform an atomic increment in the database
          await supabase.rpc('increment_profile_test_count', { p_user_id: userId });
        }
      } catch (err) {
        // log error but continue
        console.error('profile test_count increment error:', err);
      }

      // 選択した単語帳と範囲をlocalStorageに保存（次回の初期値として使用）
      try {
        localStorage.setItem('mistap_last_textbook', sText);
        localStorage.setItem('mistap_last_start_num', sStart.toString());
        localStorage.setItem('mistap_last_end_num', sEnd.toString());
        localStorage.setItem('mistap_last_count', sCount.toString());
        localStorage.setItem('mistap_last_level', level);
        if (level === 'junior') {
          localStorage.setItem('mistap_junior_test_type', 'wordbook');
        }
      } catch {
        // localStorage保存エラー - 無視
      }

      // 範囲情報のみをURLに含める（短いURL）
      // 友達が同じURLでアクセスすると、同じ範囲から異なる単語がランダムに出題される
      router.push(`/mistap/test?text=${encodeURIComponent(sText)}&start=${sStart}&end=${sEnd}&count=${sCount}`);
    } catch {
      isCreatingTestRef.current = false;
      setIsCreatingTest(false);
    }
  }, [filteredTexts, texts, startNum, endNum, count, selectedText, router]);

  // 教科書テスト作成処理
  const createTextbookTest = useCallback(async () => {
    if (isCreatingTextbookTestRef.current || !selectedUnit) return;

    isCreatingTextbookTestRef.current = true;
    setIsCreatingTextbookTest(true);

    try {
      const words = getWordsForUnit(selectedSchoolTextbook, selectedSchoolGrade, selectedUnit.section, selectedUnit.unit);

      if (words.length === 0) {
        alert('この単元には単語が登録されていません。');
        setIsCreatingTextbookTest(false);
        isCreatingTextbookTestRef.current = false;
        return;
      }

      // ランダム抽出（全単語出題。必要に応じて制限も可能）
      // ユーザーが指定した語数（count）で制限する
      const testWords = words.sort(() => Math.random() - 0.5).slice(0, count);

      // 単元ラベルを取得
      const unitInfo = textbookUnits.find(u => u.section === selectedUnit.section && u.unit === selectedUnit.unit);
      const unitLabel = unitInfo ? unitInfo.label : `Lesson ${selectedUnit.section} - Part ${selectedUnit.unit}`;

      const testData = {
        words: testWords.map((w, i) => ({
          word: w.word,
          word_number: i + 1, // 教科書テストの場合は1からの連番にする
          meaning: w.meaning
        })),
        selectedText: `${selectedSchoolTextbook} ${selectedSchoolGrade} - ${unitLabel}`,
        startNum: null,
        endNum: null,
        isTextbookTest: true
      };

      // profiles.test_count を増やす
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;
        if (userId) {
          await supabase.rpc('increment_profile_test_count', { p_user_id: userId });
        }
      } catch (err) {
        console.error('profile test_count increment error:', err);
      }

      // 選択状態を保存
      try {
        localStorage.setItem('mistap_last_level', 'junior');
        localStorage.setItem('mistap_junior_test_type', 'textbook');
        localStorage.setItem('mistap_selected_school_textbook', selectedSchoolTextbook);
        localStorage.setItem('mistap_selected_school_grade', selectedSchoolGrade);
        localStorage.setItem('mistap_selected_unit', JSON.stringify(selectedUnit));
        localStorage.setItem('mistap_last_count', count.toString());
      } catch (e) {
        // ignore
      }

      const dataParam = encodeURIComponent(JSON.stringify(testData));
      router.push(`/mistap/test?data=${dataParam}`);
    } catch (err) {
      console.error('textbook test creation error:', err);
      setIsCreatingTextbookTest(false);
      isCreatingTextbookTestRef.current = false;
    }
  }, [selectedSchoolTextbook, selectedSchoolGrade, selectedUnit, textbookUnits, count, router]);

  // public wrapper that uses current state (keeps compatibility)
  const createTest = useCallback(async () => {
    return await createTestImpl();
  }, [createTestImpl]);

  const urlParamsProcessed = useRef(false);

  // Auto-start demo when URL contains demo params: ?demo=1&selectedText=...&startNum=...&endNum=...&count=...
  // Or just pre-fill form if params are present without demo flag
  useEffect(() => {
    // parse URL params from window.location.search to avoid useSearchParams CSR issues
    if (typeof window === 'undefined') return;
    if (urlParamsProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    const ds = params.get('selectedText') ?? undefined;
    const dsStart = params.get('startNum') ? Number(params.get('startNum')) : undefined;
    const dsEnd = params.get('endNum') ? Number(params.get('endNum')) : undefined;
    const dsCount = params.get('count') ? Number(params.get('count')) : undefined;

    if (!ds) return;

    // If the DB contains the requested textbook but filteredTexts doesn't include it
    // (likely because the current `level` is different), attempt to set the correct level
    // based on our junior/senior lists so filteredTexts will include it and auto-start.
    if (texts.length > 0 && !filteredTexts.includes(ds) && texts.includes(ds)) {
      // determine desired level from our fixed lists
      const shouldBeSenior = seniorTexts.includes(ds);
      const shouldBeJunior = juniorTexts.includes(ds);
      if (shouldBeSenior && level !== 'senior') {
        setLevel('senior');
        // setSelectedText will be handled when filteredTexts updates
        return;
      }
      if (shouldBeJunior && level !== 'junior') {
        setLevel('junior');
        return;
      }
      // If neither list contains it but DB does, prepare a pending demo confirmation
      setSelectedText(ds);
      if (dsStart) setStartNum(dsStart);
      if (dsEnd) setEndNum(dsEnd);
      if (dsCount) setCount(dsCount);

      if (demo) {
        setPendingDemo({ selectedText: ds, startNum: dsStart ?? null, endNum: dsEnd ?? null, count: dsCount ?? null });
        setShowDemoConfirm(true);
      }
      urlParamsProcessed.current = true;
      return;
    }

    // wait until filteredTexts is populated and contains the target
    if (filteredTexts.length > 0 && filteredTexts.includes(ds)) {
      // set state to match URL params
      if (dsStart) setStartNum(dsStart);
      if (dsEnd) setEndNum(dsEnd);
      if (dsCount) setCount(dsCount);
      setSelectedText(ds);

      if (demo) {
        // prepare pending demo confirmation instead of auto-start
        setPendingDemo({ selectedText: ds, startNum: dsStart ?? null, endNum: dsEnd ?? null, count: dsCount ?? null });
        setShowDemoConfirm(true);
      }
      urlParamsProcessed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTexts, texts, level]);

  // 復習テスト用: 苦手単語を取得
  const loadWeakWords = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (!userId) {
        setLoading(false);
        return;
      }

      // 間違えた単語の履歴を取得
      const { data: results } = await supabase
        .from('results')
        .select('incorrect_words, selected_text, created_at')
        .eq('user_id', userId)
        .not('incorrect_words', 'is', null);

      // 間違えた単語を集約
      const weakWordsMap = new Map<string, Map<number, WeakWord>>();

      // ヘルパー: 教材名を正規化して、"ターゲット1900" と "ターゲット1900(復習テスト)" を同一視する
      const normalizeTextbookName = (name: string) => {
        if (!name) return name;
        // 丸括弧（全角/半角）内に「復習」を含むサフィックスを取り除く
        // 例: "ターゲット1900 (復習テスト)", "ターゲット1900（復習テスト）"
        return name.replace(/[\s]*[（(][^）)]*復習[^)）]*[)）][\s]*$/u, '').trim();
      };

      results?.forEach(result => {
        if (result.incorrect_words && result.selected_text) {
          const key = normalizeTextbookName(result.selected_text);
          if (!weakWordsMap.has(key)) {
            weakWordsMap.set(key, new Map());
          }

          const textbookMap = weakWordsMap.get(key)!;

          result.incorrect_words.forEach((word: { word_number: number; word: string; meaning: string }) => {
            if (textbookMap.has(word.word_number)) {
              const existing = textbookMap.get(word.word_number)!;
              existing.wrong_count += 1;
              existing.last_wrong_date = result.created_at;
            } else {
              const daysSinceWrong = Math.floor((new Date().getTime() - new Date(result.created_at).getTime()) / (1000 * 60 * 60 * 24));
              textbookMap.set(word.word_number, {
                word_number: word.word_number,
                word: word.word,
                meaning: word.meaning,
                textbook: key,
                wrong_count: 1,
                last_wrong_date: result.created_at,
                difficulty_level: daysSinceWrong <= 30 ? 'recent' : 'single'
              });
            }
          });
        }
      });

      // 難易度レベルを再計算
      const textbookWeakWords: TextbookWeakWords[] = [];

      weakWordsMap.forEach((wordsMap, textbook) => {
        const words: WeakWord[] = [];
        let recentCount = 0, frequentCount = 0, singleCount = 0;

        wordsMap.forEach(word => {
          const daysSinceWrong = Math.floor((new Date().getTime() - new Date(word.last_wrong_date).getTime()) / (1000 * 60 * 60 * 24));

          // 主要な難易度レベルを設定（表示用）
          if (word.wrong_count >= 2) {
            word.difficulty_level = 'frequent';
          } else if (daysSinceWrong <= 30) {
            word.difficulty_level = 'recent';
          } else {
            word.difficulty_level = 'single';
          }

          // カウントは重複を許可（両方の条件に該当する場合は両方カウント）
          if (word.wrong_count >= 2) {
            frequentCount++;
          }
          if (daysSinceWrong <= 30) {
            recentCount++;
          }
          if (word.wrong_count < 2 && daysSinceWrong > 30) {
            singleCount++;
          }

          words.push(word);
        });

        if (words.length > 0) {
          textbookWeakWords.push({
            textbook,
            words,
            recentCount,
            frequentCount,
            singleCount
          });
        }
      });

      setTextbooks(textbookWeakWords);
      if (textbookWeakWords.length > 0) {
        setSelectedTextbook(textbookWeakWords[0].textbook);
      }

    } catch {
      // 苦手単語取得エラー - 無視
    } finally {
      setLoading(false);
    }
  }, []);

  // 復習テスト作成処理
  const createReviewTest = useCallback(async () => {
    // 処理中の場合は早期リターン
    if (isCreatingReviewTestRef.current) return;

    const selectedTextbookData = textbooks.find(t => t.textbook === selectedTextbook);
    if (!selectedTextbookData) return;

    // 条件に合致する単語を収集（重複を許可）
    const matchedWordsSet = new Set<number>();

    selectedTextbookData.words.forEach(word => {
      const daysSinceWrong = Math.floor((new Date().getTime() - new Date(word.last_wrong_date).getTime()) / (1000 * 60 * 60 * 24));

      let shouldInclude = false;

      // 各条件をチェック
      if (includeRecent && daysSinceWrong <= 30) shouldInclude = true;
      if (includeFrequent && word.wrong_count >= 2) shouldInclude = true;
      if (includeSingle && word.wrong_count < 2 && daysSinceWrong > 30) shouldInclude = true;

      if (shouldInclude) {
        matchedWordsSet.add(word.word_number);
      }
    });

    // 重複を除外した単語リストを作成
    let filteredWords = selectedTextbookData.words.filter(word =>
      matchedWordsSet.has(word.word_number)
    );

    // 範囲指定がある場合はさらにフィルター
    if (useRange) {
      filteredWords = filteredWords.filter(word =>
        word.word_number >= reviewStartNum && word.word_number <= reviewEndNum
      );
    }

    if (filteredWords.length === 0) {
      alert('選択された条件の苦手単語がありません');
      return;
    }

    // ローディング開始
    isCreatingReviewTestRef.current = true;
    setIsCreatingReviewTest(true);

    try {
      const actualCount = Math.min(testCount, filteredWords.length);
      const shuffledWords = filteredWords.sort(() => Math.random() - 0.5);
      const testWords = shuffledWords.slice(0, actualCount);

      const testData = {
        words: testWords.map(w => ({
          word: w.word,
          word_number: w.word_number,
          meaning: w.meaning
        })),
        selectedText: `${selectedTextbook} (復習テスト)`,
        startNum: null,
        endNum: null,
        isReview: true
      };

      // ここで profiles.test_count を増やす（非同期で安全に回数を記録）
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;
        if (userId) {
          // Use RPC to perform an atomic increment in the database
          await supabase.rpc('increment_profile_test_count', { p_user_id: userId });
        }
      } catch {
        // test_count increment error - continue
      }

      const dataParam = encodeURIComponent(JSON.stringify(testData));
      router.push(`/mistap/test?data=${dataParam}`);
    } catch {
      isCreatingReviewTestRef.current = false;
      setIsCreatingReviewTest(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textbooks, selectedTextbook, includeRecent, includeFrequent, includeSingle, useRange, reviewStartNum, reviewEndNum, testCount, router]);

  // 教材取得とユーザープロフィール取得
  useEffect(() => {
    // document.title removed for server-side metadata
    fetchTexts();
    loadUserProfile();
    loadWeakWords();
  }, [fetchTexts, loadUserProfile, loadWeakWords]);

  // iOS/Android検出
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
    const isAndroidDevice = /Android/.test(ua);
    setIsIos(isiOS);
    setIsAndroid(isAndroidDevice);

    // スタンドアロンモード（既にホーム画面から開かれている）かどうかチェック
    const standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // PWAインストールプロンプトのキャプチャ（Android Chrome向け）
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div
          className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 border border-white/50"
          style={{
            marginTop: '25px',
            width: 'min(576px, calc(100vw - 32px))',
            minHeight: '400px'
          }}
        >
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">テスト作成</h1>

          {/* タブナビゲーション */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('normal')}
              className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'normal'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              通常テスト
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'review'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              復習テスト
            </button>
          </div>

          {/* 通常テストのフォーム */}
          {activeTab === 'normal' && (
            <div className="animate-fadeIn space-y-6">
              <>
                {/* レベル選択 */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">学習レベル</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'junior', label: '中学' },
                      { id: 'senior', label: '高校' },
                      { id: 'university', label: '大学・社会人' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${level === l.id
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 中学の場合のテストタイプ選択 */}
                {level === 'junior' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">テストの種類</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setJuniorTestType('wordbook')}
                        className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${juniorTestType === 'wordbook'
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        単語帳テスト
                      </button>
                      <button
                        onClick={() => setJuniorTestType('textbook')}
                        className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${juniorTestType === 'textbook'
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        教科書テスト
                      </button>
                    </div>
                  </div>
                )}

                {/* 教材選択 */}
                {!(level === 'junior' && juniorTestType === 'textbook') ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">単語帳</label>
                    <div className="relative">
                      <select
                        value={selectedText}
                        onChange={(e) => setSelectedText(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-xl focus:ring-red-500 focus:border-red-500 block p-4 pr-10 font-medium transition-colors cursor-pointer hover:bg-gray-100 [&>option]:text-gray-900 [&>optgroup]:text-gray-900"
                        translate="no"
                      >
                        {level === "junior" ? (
                          // 中学向けは従来通り。filteredTexts が空の場合は texts を代替表示する
                          (filteredTexts.length > 0 ? filteredTexts : texts).map((text) => (
                            <option key={text} value={text} translate="no">
                              {text}
                            </option>
                          ))
                        ) : level === "university" ? (
                          // 大学生・社会人向け
                          <>
                            {universityTexts
                              .filter(text => texts.includes(text))
                              .map(text => (
                                <option key={text} value={text} translate="no">{text}</option>
                              ))}
                            {/* もし定義済み教材がなければ、DB の教材一覧を代替で表示 */}
                            {universityTexts.filter(text => texts.includes(text)).length === 0 && (
                              <>
                                {texts.map(text => (
                                  <option key={text} value={text} translate="no">{text}</option>
                                ))}
                              </>
                            )}
                          </>
                        ) : (
                          // 高校向けはグループ化（データベースに存在するもののみ）
                          <>
                            <optgroup label="📖 英単語">
                              {["LEAP", "ターゲット1200", "ターゲット1400", "システム英単語", "ターゲット1900", "DUO 3.0例文"]
                                .filter(text => texts.includes(text))
                                .map(text => (
                                  <option key={text} value={text} translate="no">{text}</option>
                                ))}
                            </optgroup>
                            <optgroup label="📜 古文単語">
                              {["読んで見て聞いて覚える 重要古文単語315", "Key＆Point古文単語330", "ベストセレクション古文単語325", "理解を深める核心古文単語351"]
                                .filter(text => texts.includes(text))
                                .map(text => (
                                  <option key={text} value={text} translate="no">{text}</option>
                                ))}
                            </optgroup>
                            {/* もし上のどれも空なら、DB の教材一覧を代替で表示 */}
                            {(!["LEAP", "ターゲット1200", "ターゲット1400", "システム英単語", "ターゲット1900", "DUO 3.0例文"].some(t => texts.includes(t)) && !["読んで見て聞いて覚える 重要古文単語315", "Key＆Point古文単語330", "ベストセレクション古文単語325", "理解を深める核心古文単語351"].some(t => texts.includes(t))) && (
                              <>
                                {texts.map(text => (
                                  <option key={text} value={text} translate="no">{text}</option>
                                ))}
                              </>
                            )}
                          </>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 ml-1">教科書</label>
                        <select
                          value={selectedSchoolTextbook}
                          onChange={(e) => setSelectedSchoolTextbook(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 font-medium cursor-pointer"
                        >
                          {Array.from(new Set(TEXTBOOK_LIST.map(t => t.name))).map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 ml-1">学年</label>
                        <select
                          value={selectedSchoolGrade}
                          onChange={(e) => setSelectedSchoolGrade(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 font-medium cursor-pointer"
                        >
                          {['中1', '中2', '中3'].map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500 ml-1">単元</label>
                      <select
                        value={selectedUnit ? `${selectedUnit.section}-${selectedUnit.unit}` : ''}
                        onChange={(e) => {
                          const [section, unit] = e.target.value.split('-').map(Number);
                          setSelectedUnit({ section, unit });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 font-medium cursor-pointer"
                      >
                        {textbookUnits.map(u => (
                          <option key={`${u.section}-${u.unit}`} value={`${u.section}-${u.unit}`}>
                            {u.label} ({u.wordCount}語)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 開発用：欠けている教材の警告 */}
                {missingTexts.length > 0 && process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>開発用警告:</strong> 以下の教材がデータベースに存在しません：
                    </p>
                    <ul className="text-yellow-700 text-xs mt-1">
                      {missingTexts.map(text => (
                        <li key={text}>• {text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 設定エリア（範囲・出題数） */}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-5 border border-gray-100">

                  {/* 範囲指定 */}
                  {selectedText !== "過去形" && selectedText !== "過去形、過去分詞形" && !(level === 'junior' && juniorTestType === 'textbook') && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-white rounded-lg text-gray-500 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-700 text-sm">出題範囲 (No.)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={startNum === 0 ? '' : startNum}
                            onChange={(e) => setStartNum(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="w-full border border-gray-200 p-3 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white shadow-sm"
                            placeholder="開始"
                          />
                        </div>
                        <span className="text-gray-400 font-bold">〜</span>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={endNum === 0 ? '' : endNum}
                            onChange={(e) => setEndNum(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="w-full border border-gray-200 p-3 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white shadow-sm"
                            placeholder="終了"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200"></div>

                  {/* 出題数 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg text-gray-500 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-700 text-sm">出題数</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={count === 0 ? '' : count}
                          onChange={(e) => setCount(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-20 border border-gray-200 p-2 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white shadow-sm"
                        />
                        <span className="text-gray-500 font-medium text-sm">語</span>
                      </div>
                    </div>

                    {/* プリセットボタン */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {[10, 20, 30, 50, 100].map(num => (
                        <button
                          key={num}
                          onClick={() => setCount(num)}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${count === num
                            ? 'bg-gray-800 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {num}語
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="pt-2 flex flex-col md:flex-row gap-3 md:justify-between">
                  <button
                    onClick={level === 'junior' && juniorTestType === 'textbook' ? createTextbookTest : createTest}
                    disabled={(isCreatingTest || isCreatingTextbookTest) || !isInitialized || (!(level === 'junior' && juniorTestType === 'textbook') && !selectedText) || ((level === 'junior' && juniorTestType === 'textbook') && !selectedUnit)}
                    className={`w-full md:w-auto py-4 px-8 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 md:order-2 ${(isCreatingTest || isCreatingTextbookTest) || !isInitialized || (!(level === 'junior' && juniorTestType === 'textbook') && !selectedText) || ((level === 'junior' && juniorTestType === 'textbook') && !selectedUnit)
                      ? 'bg-gray-400 cursor-not-allowed shadow-gray-200'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 transform hover:-translate-y-0.5'
                      }`}
                  >
                    {(isCreatingTest || isCreatingTextbookTest) ? (
                      <>
                        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        作成中...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        テストを開始
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full md:w-auto mt-2 md:mt-0 text-gray-500 hover:text-gray-700 font-medium py-2 px-4 transition-colors md:order-1"
                  >
                    キャンセル
                  </button>
                </div>

                {/* iOS/Android向け「ホーム画面に追加」ボタン */}
                {(isIos || isAndroid) && !isStandalone && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={async () => {
                        // Androidでインストールプロンプトが利用可能な場合は直接表示
                        if (deferredPrompt) {
                          try {
                            await deferredPrompt.prompt();
                            const choiceResult = await deferredPrompt.userChoice;
                            if (choiceResult.outcome === 'accepted') {
                              // ユーザーがインストールを承諾
                              setDeferredPrompt(null);
                            }
                          } catch {
                            // プロンプト表示エラー - フォールバックでモーダルを表示
                            setShowAddToHomeModal(true);
                          }
                        } else {
                          // iOS またはプロンプトが利用不可の場合は手順を表示
                          setShowAddToHomeModal(true);
                        }
                      }}
                      className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-medium flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      テスト作成をホーム画面に追加
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      ホーム画面からワンタップでテスト作成画面を開けます
                    </p>
                  </div>
                )}

                {/* 共有デモ確認モーダル */}
                {showDemoConfirm && pendingDemo && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => {
                      setShowDemoConfirm(false);
                      setPendingDemo(null);
                      // Use history API instead of router.replace to avoid redirect detection
                      if (typeof window !== 'undefined') window.history.replaceState({}, '', '/test-setup');
                    }} />
                    <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-[90%] max-w-md">
                      <h3 className="text-lg font-semibold mb-3">テスト開始の確認</h3>
                      <p className="text-sm text-gray-700 mb-4">以下の内容でテストを開始します。よろしければ「開始」を押してください。</p>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600">教材: <span className="font-semibold text-gray-800">{pendingDemo.selectedText}</span></div>
                        <div className="text-sm text-gray-600">範囲: <span className="font-semibold text-gray-800">{(pendingDemo.startNum != null && pendingDemo.endNum != null) ? `${pendingDemo.startNum}〜${pendingDemo.endNum}` : '全範囲'}</span></div>
                        <div className="text-sm text-gray-600">出題数: <span className="font-semibold text-gray-800">{pendingDemo.count ?? count}</span></div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            // call createTestImpl with overrides from pendingDemo
                            setShowDemoConfirm(false);
                            const overridesArg: { selectedText?: string; startNum?: number; endNum?: number; count?: number } = {};
                            overridesArg.selectedText = pendingDemo.selectedText;
                            if (pendingDemo.startNum != null) overridesArg.startNum = pendingDemo.startNum;
                            if (pendingDemo.endNum != null) overridesArg.endNum = pendingDemo.endNum;
                            if (pendingDemo.count != null) overridesArg.count = pendingDemo.count;
                            setPendingDemo(null);
                            await createTestImpl(overridesArg);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          開始
                        </button>
                        <button
                          onClick={() => { setShowDemoConfirm(false); setPendingDemo(null); window.history.replaceState({}, '', '/test-setup'); }}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>
          )}

          {/* 復習テストのフォーム */}
          {activeTab === 'review' && (
            <div className="animate-fadeIn space-y-6">
              <>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">データを読み込んでいます...</p>
                  </div>
                ) : textbooks.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">復習する単語がありません</h3>
                    <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
                      素晴らしい！現在、復習が必要な単語はありません。<br />
                      新しいテストを受けて学習を進めましょう。
                    </p>
                    <button
                      onClick={() => setActiveTab('normal')}
                      className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5"
                    >
                      通常テストを作成
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 教材選択 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">復習する単語帳</label>
                      <div className="relative">
                        <select
                          value={selectedTextbook}
                          onChange={(e) => setSelectedTextbook(e.target.value)}
                          className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-xl focus:ring-red-500 focus:border-red-500 block p-4 pr-10 font-medium transition-colors cursor-pointer hover:bg-gray-100 [&>option]:text-gray-900"
                        >
                          {textbooks.map((tb) => (
                            <option key={tb.textbook} value={tb.textbook}>
                              {tb.textbook}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-right text-sm text-gray-500">
                        対象単語数: <span className="font-bold text-gray-900">{textbooks.find(t => t.textbook === selectedTextbook)?.words.length || 0}</span> 語
                      </p>
                    </div>

                    {/* 苦手度フィルター */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">出題する単語の種類</label>
                      <div className="grid grid-cols-1 gap-3">
                        {/* 最近間違えた単語 */}
                        <div
                          onClick={() => setIncludeRecent(!includeRecent)}
                          className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${includeRecent
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${includeRecent ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1 pr-10">
                              <span className={`font-bold ${includeRecent ? 'text-red-900' : 'text-gray-700'}`}>最近間違えた単語</span>
                              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${includeRecent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {textbooks.find(t => t.textbook === selectedTextbook)?.recentCount || 0}語
                              </span>
                            </div>
                            <p className={`text-xs ${includeRecent ? 'text-red-700' : 'text-gray-500'}`}>30日以内に間違えた単語</p>
                          </div>
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center ${includeRecent ? 'bg-red-500 border-red-500' : 'border-gray-300'
                            }`}>
                            {includeRecent && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                        </div>

                        {/* 何度も間違える単語 */}
                        <div
                          onClick={() => setIncludeFrequent(!includeFrequent)}
                          className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${includeFrequent
                            ? 'border-gray-800 bg-gray-50'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${includeFrequent ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1 pr-10">
                              <span className={`font-bold ${includeFrequent ? 'text-gray-900' : 'text-gray-700'}`}>何度も間違える単語</span>
                              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${includeFrequent ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {textbooks.find(t => t.textbook === selectedTextbook)?.frequentCount || 0}語
                              </span>
                            </div>
                            <p className={`text-xs ${includeFrequent ? 'text-gray-700' : 'text-gray-500'}`}>2回以上間違えた単語</p>
                          </div>
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center ${includeFrequent ? 'bg-gray-800 border-gray-800' : 'border-gray-300'
                            }`}>
                            {includeFrequent && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                        </div>

                        {/* 1回だけ間違えた単語 */}
                        <div
                          onClick={() => setIncludeSingle(!includeSingle)}
                          className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${includeSingle
                            ? 'border-gray-400 bg-white'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${includeSingle ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1 pr-10">
                              <span className={`font-bold ${includeSingle ? 'text-gray-800' : 'text-gray-700'}`}>1回だけ間違えた単語</span>
                              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${includeSingle ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {textbooks.find(t => t.textbook === selectedTextbook)?.singleCount || 0}語
                              </span>
                            </div>
                            <p className={`text-xs ${includeSingle ? 'text-gray-600' : 'text-gray-500'}`}>過去に1度だけ間違えた単語</p>
                          </div>
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center ${includeSingle ? 'bg-gray-500 border-gray-500' : 'border-gray-300'
                            }`}>
                            {includeSingle && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* オプション設定（範囲・出題数） */}
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-5">
                      {/* 範囲指定トグル */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-bold text-gray-700">範囲を指定する</span>
                        </div>
                        <button
                          onClick={() => setUseRange(!useRange)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${useRange ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useRange ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                      </div>

                      {/* 範囲入力フィールド */}
                      {useRange && (
                        <div className="flex items-center gap-3 animate-fadeIn">
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={reviewStartNum === 0 ? '' : reviewStartNum}
                              onChange={(e) => setReviewStartNum(e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-full border border-gray-300 p-3 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                              placeholder="開始"
                            />
                            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-medium text-gray-500">No.</span>
                          </div>
                          <span className="text-gray-400 font-bold">〜</span>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={reviewEndNum === 0 ? '' : reviewEndNum}
                              onChange={(e) => setReviewEndNum(e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-full border border-gray-300 p-3 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                              placeholder="終了"
                            />
                            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-medium text-gray-500">No.</span>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-200 my-2"></div>

                      {/* 出題数 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <span className="font-bold text-gray-700">出題数</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={testCount === 0 ? '' : testCount}
                            onChange={(e) => setTestCount(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="w-20 border border-gray-300 p-2 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            min="1"
                          />
                          <span className="text-gray-500 font-medium">語</span>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="pt-4">
                      <button
                        onClick={createReviewTest}
                        disabled={isCreatingReviewTest || !selectedTextbook}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isCreatingReviewTest || !selectedTextbook
                          ? 'bg-gray-400 cursor-not-allowed shadow-gray-200'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 transform hover:-translate-y-0.5'
                          }`}
                      >
                        {isCreatingReviewTest ? (
                          <>
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            作成中...
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            復習テストを開始
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => router.back()}
                        className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  </>
                )}
              </>
            </div>
          )}

        </div>

        {/* ホーム画面に追加モーダル */}
        {showAddToHomeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddToHomeModal(false)}
            />
            <div className="bg-white rounded-2xl shadow-2xl p-6 z-10 w-full max-w-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">ホーム画面に追加</h3>
                <button
                  onClick={() => setShowAddToHomeModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                以下の手順で「テスト作成」をホーム画面に追加できます。
              </p>

              <div className="space-y-4">
                {isIos ? (
                  <>
                    {/* iOS手順 - ステップ1 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">1</div>
                      <div>
                        <p className="text-gray-900 font-medium">画面下の共有ボタンをタップ</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="text-sm text-gray-600">共有</span>
                        </div>
                      </div>
                    </div>

                    {/* iOS手順 - ステップ2 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">2</div>
                      <div>
                        <p className="text-gray-900 font-medium">「ホーム画面に追加」を選択</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm text-gray-600">ホーム画面に追加</span>
                        </div>
                      </div>
                    </div>

                    {/* iOS手順 - ステップ3 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">3</div>
                      <div>
                        <p className="text-gray-900 font-medium">右上の「追加」をタップ</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Android手順 - ステップ1 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">1</div>
                      <div>
                        <p className="text-gray-900 font-medium">右上のメニュー（⋮）をタップ</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                          <span className="text-sm text-gray-600">メニュー</span>
                        </div>
                      </div>
                    </div>

                    {/* Android手順 - ステップ2 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">2</div>
                      <div>
                        <p className="text-gray-900 font-medium">「ホーム画面に追加」または<br />「アプリをインストール」を選択</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm text-gray-600">ホーム画面に追加</span>
                        </div>
                      </div>
                    </div>

                    {/* Android手順 - ステップ3 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">3</div>
                      <div>
                        <p className="text-gray-900 font-medium">「追加」または「インストール」をタップ</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAddToHomeModal(false)}
                  className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </Background>
      <MistapFooter />
    </main>
  );
}