'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import Background from "@/components/mistap/Background";
import Link from "next/link";
import MistapFooter from "@/components/mistap/Footer";

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

export default function ReviewTestSetupPage() {
  const [textbooks, setTextbooks] = useState<TextbookWeakWords[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState<string>("");
  const [includeRecent, setIncludeRecent] = useState<boolean>(true);
  const [includeFrequent, setIncludeFrequent] = useState<boolean>(true);
  const [includeSingle, setIncludeSingle] = useState<boolean>(false);
  const [useRange, setUseRange] = useState<boolean>(false);
  const [startNum, setStartNum] = useState<number>(1);
  const [endNum, setEndNum] = useState<number>(100);
  const [testCount, setTestCount] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    document.title = '復習テスト作成 - Mistap';
    loadWeakWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadWeakWords() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (!userId) {
        router.push('/mistap');
        return;
      }

      // 間違えた単語の履歴を取得（仮データ生成）
      // 実際は results テーブルから incorrect_words を集約
      const { data: results } = await supabase
        .from('results')
        .select('incorrect_words, selected_text, created_at')
        .eq('user_id', userId)
        .not('incorrect_words', 'is', null);

      // 間違えた単語を集約
      const weakWordsMap = new Map<string, Map<number, WeakWord>>();

      // 教材名を正規化して、復習テスト付与で別名扱いにならないようにする
      const normalizeTextbookName = (name: string) => {
        if (!name) return name;
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

          if (daysSinceWrong <= 30) {
            word.difficulty_level = 'recent';
            recentCount++;
          } else if (word.wrong_count >= 2) {
            word.difficulty_level = 'frequent';
            frequentCount++;
          } else {
            word.difficulty_level = 'single';
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

    } catch (error) {
      console.error('苦手単語の取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }

  function getSelectedWords(): WeakWord[] {
    const selectedTextbookData = textbooks.find(t => t.textbook === selectedTextbook);
    if (!selectedTextbookData) return [];

    let filteredWords = selectedTextbookData.words.filter(word => {
      if (word.difficulty_level === 'recent' && includeRecent) return true;
      if (word.difficulty_level === 'frequent' && includeFrequent) return true;
      if (word.difficulty_level === 'single' && includeSingle) return true;
      return false;
    });

    // 範囲指定がある場合はさらにフィルター
    if (useRange) {
      filteredWords = filteredWords.filter(word =>
        word.word_number >= startNum && word.word_number <= endNum
      );
    }

    return filteredWords;
  }

  async function startReviewTest() {
    const selectedWords = getSelectedWords();
    if (selectedWords.length === 0) {
      alert('選択された条件の苦手単語がありません');
      return;
    }

    const actualCount = Math.min(testCount, selectedWords.length);
    const shuffledWords = selectedWords.sort(() => Math.random() - 0.5);
    const testWords = shuffledWords.slice(0, actualCount);

    const testData = {
      words: testWords,
      selectedText: `${selectedTextbook} (復習テスト)`,
      startNum: null,
      endNum: null,
      isReview: true
    };

    const dataParam = encodeURIComponent(JSON.stringify(testData));
    // Increment profiles.test_count for review test creation
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (userId) {
        await supabase.rpc('increment_profile_test_count', { p_user_id: userId });
      }
    } catch (err) {
      console.error('profile test_count increment error:', err);
    }

    router.push(`/mistap/test?data=${dataParam}`);
  }

  const selectedTextbookData = textbooks.find(t => t.textbook === selectedTextbook);
  const availableWords = getSelectedWords();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background className="flex justify-center items-start min-h-screen">
          <div className="text-white text-xl" style={{ marginTop: 'calc(64px + 48px)' }}>Loading...</div>
        </Background>
      </div>
    );
  }

  if (textbooks.length === 0) {
    return (
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-xl border border-white/50" style={{ marginTop: 'calc(64px + 48px)' }}>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">復習テスト作成</h1>

          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-lg mb-4 text-gray-700">まだ苦手な単語がありません</p>
            <p className="text-sm mb-6 text-gray-600">
              通常のテストで間違えた単語が<br />
              こちらに蓄積されます
            </p>

            <div className="space-y-3">
              <Link href="/mistap/test-setup" className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-lg font-semibold transition-colors duration-200">
                通常テストを作成
              </Link>
              <button onClick={() => router.back()} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200">
                戻る
              </button>
            </div>
          </div>
        </div>
      </Background>
    );
  }

  return (
    <Background className="flex justify-center items-start min-h-screen p-4">
      <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-xl border border-white/50" style={{ marginTop: 'calc(64px + 48px)' }}>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">復習テスト作成</h1>

        {/* タブナビゲーション */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <Link href="/mistap/test-setup" className="flex-1 text-center py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors rounded-lg">
            通常テスト
          </Link>
          <div className="flex-1 text-center py-2 px-4 bg-red-600 text-white rounded-lg font-medium">
            復習テスト
          </div>
        </div>

        {/* 教材選択 */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">教材:</label>
          <select
            value={selectedTextbook}
            onChange={(e) => setSelectedTextbook(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl text-base"
          >
            {textbooks.map((textbook) => (
              <option key={textbook.textbook} value={textbook.textbook}>
                {textbook.textbook} ({textbook.words.length}個の苦手単語)
              </option>
            ))}
          </select>
        </div>

        {/* 苦手レベル選択 */}
        {selectedTextbookData && (
          <div className="mb-4">
            <label className="block mb-3 text-gray-700 font-medium">苦手レベル:</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeRecent}
                  onChange={(e) => setIncludeRecent(e.target.checked)}
                  className="mr-3 w-4 h-4 text-red-600"
                />
                <span className="text-sm">
                  最近間違えた ({selectedTextbookData.recentCount}個)
                  <span className="text-gray-500 ml-2">過去30日以内</span>
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeFrequent}
                  onChange={(e) => setIncludeFrequent(e.target.checked)}
                  className="mr-3 w-4 h-4 text-red-600"
                />
                <span className="text-sm">
                  よく間違える ({selectedTextbookData.frequentCount}個)
                  <span className="text-gray-500 ml-2">2回以上間違い</span>
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSingle}
                  onChange={(e) => setIncludeSingle(e.target.checked)}
                  className="mr-3 w-4 h-4 text-red-600"
                />
                <span className="text-sm">
                  1回だけ間違い ({selectedTextbookData.singleCount}個)
                  <span className="text-gray-500 ml-2">復習済みかも</span>
                </span>
              </label>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useRange}
                    onChange={(e) => setUseRange(e.target.checked)}
                    className="mr-3 w-4 h-4 text-red-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    範囲を指定
                    <span className="text-gray-500 ml-2">単語番号で絞り込み</span>
                  </span>
                </label>
              </div>
            </div>

            {/* 範囲指定フォーム */}
            {useRange && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block mb-2 text-gray-700 font-medium text-sm">単語範囲:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={startNum}
                    onChange={(e) => setStartNum(Math.max(1, Number(e.target.value)))}
                    className="border border-gray-300 p-2 w-20 text-center rounded-lg text-sm"
                    placeholder="開始"
                    min="1"
                  />
                  <span className="text-gray-500 text-sm">〜</span>
                  <input
                    type="number"
                    value={endNum}
                    onChange={(e) => setEndNum(Math.max(startNum, Number(e.target.value)))}
                    className="border border-gray-300 p-2 w-20 text-center rounded-lg text-sm"
                    placeholder="終了"
                    min={startNum}
                  />
                  <span className="text-gray-500 text-sm">番</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  指定した範囲内の苦手単語のみが対象になります
                </p>
              </div>
            )}
          </div>
        )}

        {/* 出題数設定 */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">
            出題数: (選択中: {availableWords.length}個)
          </label>
          <input
            type="number"
            value={testCount}
            onChange={(e) => setTestCount(Math.max(1, Math.min(availableWords.length, Number(e.target.value))))}
            min="1"
            max={availableWords.length}
            className="w-full border border-gray-300 p-3 rounded-xl text-base"
          />
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          <button
            onClick={startReviewTest}
            disabled={availableWords.length === 0}
            className={`w-full py-3 px-4 rounded-xl text-lg font-semibold transition-colors duration-200 ${availableWords.length > 0
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            復習テスト開始 ({Math.min(testCount, availableWords.length)}個)
          </button>

          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
          >
            戻る
          </button>
        </div>
      </div>
      <MistapFooter />
    </Background>
  );
}