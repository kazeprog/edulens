'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { useRouter } from 'next/navigation';
import Background from '@/components/mistap/Background';

export default function GoalsPage() {
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState<string>('100');
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoalSaved, setIsGoalSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [textbooks, setTextbooks] = useState<string[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState<string>('');
  const [maxWords, setMaxWords] = useState<number>(0);
  const [startWord, setStartWord] = useState<string>('1');
  const [endWord, setEndWord] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;
        if (!userId) {
          router.push('/mistap');
          return;
        }

        // 教材リストの取得
        const { data: textsData, error: textsError } = await supabase.rpc('get_unique_texts');
        let uniqueTexts: string[] = [];
        if (!textsError && textsData) {
          if (Array.isArray(textsData) && textsData.length > 0) {
            if (typeof textsData[0] === 'string') {
              uniqueTexts = textsData;
            } else if (typeof textsData[0] === 'object' && 'text' in textsData[0]) {
              uniqueTexts = textsData.map((item: { text: string }) => item.text);
            }
          }
        } else {
          // フォールバック
          const { data: fallbackData } = await supabase
            .from("words")
            .select("text")
            .not("text", "is", null)
            .limit(1000);
          uniqueTexts = [...new Set(fallbackData?.map((d) => d.text) || [])];
        }

        if (mounted) {
          setTextbooks(uniqueTexts);
          if (uniqueTexts.length > 0 && !selectedTextbook) {
            // デフォルトはターゲット1900、なければ最初
            if (uniqueTexts.includes('ターゲット1900')) {
              setSelectedTextbook('ターゲット1900');
            } else {
              setSelectedTextbook(uniqueTexts[0]);
            }
          }
        }

        const { data, error } = await supabase.from('profiles').select('daily_goal, start_date, selected_textbook, goal_start_word, goal_end_word').eq('id', userId).single();
        if (error) {
          console.error('Error fetching profile:', error);
          // カラムが存在しない場合でも基本データは取得
          const { data: basicData } = await supabase.from('profiles').select('daily_goal, start_date, selected_textbook').eq('id', userId).single();
          if (basicData && mounted) {
            setDailyGoal(basicData?.daily_goal?.toString() ?? '100');
            const today = new Date();
            const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            setStartDate(basicData?.start_date ?? defaultDate);
            if (basicData?.selected_textbook && uniqueTexts.includes(basicData.selected_textbook)) {
              setSelectedTextbook(basicData.selected_textbook);
            }
            if (basicData?.daily_goal && basicData?.start_date) {
              setIsGoalSaved(true);
            }
          }
        } else if (mounted) {
          setDailyGoal(data?.daily_goal?.toString() ?? '100');
          const today = new Date();
          const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          setStartDate(data?.start_date ?? defaultDate);
          if (data?.selected_textbook && uniqueTexts.includes(data.selected_textbook)) {
            setSelectedTextbook(data.selected_textbook);
          }
          setStartWord(data?.goal_start_word?.toString() ?? '1');
          // endWordは保存済みの値があればそれを使う、なければmaxWords取得後に設定
          if (data?.goal_end_word) {
            setEndWord(data.goal_end_word.toString());
          }
          // 目標が既に保存されているか確認（daily_goalとstart_dateが両方存在する場合）
          if (data?.daily_goal && data?.start_date) {
            setIsGoalSaved(true);
          }
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, [router]);

  // 選択された教材の最大語数を取得
  useEffect(() => {
    async function fetchMaxWords() {
      if (!selectedTextbook) return;

      const { data, error } = await supabase
        .from('words')
        .select('word_number')
        .eq('text', selectedTextbook)
        .order('word_number', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setMaxWords(data.word_number);
        // 単語帳変更時は常に範囲をリセット
        setStartWord('1');
        setEndWord(data.word_number.toString());
      }
    }
    fetchMaxWords();
  }, [selectedTextbook]);

  async function handleClear() {
    setShowClearConfirm(true);
  }

  async function confirmClear() {
    setShowClearConfirm(false);
    setSaving(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (!userId) {
        setError('未ログインです');
        setSaving(false);
        return;
      }

      const payload = {
        id: userId,
        daily_goal: null,
        start_date: null,
        selected_textbook: null,
        goal_start_word: null,
        goal_end_word: null
      };

      const { error } = await supabase.from('profiles').upsert(payload).select();

      if (error) {
        console.error('Supabase upsert error:', error);
        setError(error.message || 'クリアに失敗しました');
        setSaving(false);
        return;
      }

      // stateもリセット
      setDailyGoal('100');
      const today = new Date();
      const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      setStartDate(defaultDate);
      setStartWord('1');
      setEndWord('');
      setIsGoalSaved(false);
      setIsEditing(false);

      router.push('/mistap/home');
    } catch (e: unknown) {
      console.error('clear goals error', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (!userId) {
        setError('未ログインです');
        setSaving(false);
        return;
      }

      // バリデーション: 終了番号が最大語数を超えていないかチェック
      const endWordNum = endWord ? parseInt(endWord) : 0;
      const startWordNum = startWord ? parseInt(startWord) : 1;

      if (endWordNum > maxWords) {
        setError(`存在しない単語番号です。${selectedTextbook}の最大単語番号は${maxWords}です。`);
        setSaving(false);
        return;
      }

      if (startWordNum < 1) {
        setError('開始番号は1以上である必要があります。');
        setSaving(false);
        return;
      }

      if (startWordNum > endWordNum) {
        setError('開始番号は終了番号以下である必要があります。');
        setSaving(false);
        return;
      }

      const payload = {
        id: userId,
        daily_goal: parseInt(dailyGoal) || 0,
        start_date: startDate || null,
        selected_textbook: selectedTextbook || null,
        goal_start_word: startWordNum,
        goal_end_word: endWordNum
      };

      const { error } = await supabase.from('profiles').upsert(payload).select();

      if (error) {
        console.error('Supabase upsert error:', error);
        setError(error.message || '保存に失敗しました');
        setSaving(false);
        return;
      }

      setIsGoalSaved(true);
      setIsEditing(false);
      // 画面を更新（router.push削除）
    } catch (e: unknown) {
      console.error('save goals error', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  // スケジュール計算
  const schedule = [];
  const goalNum = parseInt(dailyGoal) || 0;
  const rangeStart = startWord ? parseInt(startWord) : 1;
  const rangeEnd = endWord ? parseInt(endWord) : maxWords;

  if (startDate && goalNum > 0 && rangeEnd > 0) {
    const start = new Date(startDate);
    let currentStartNum = rangeStart;

    for (let i = 0; i < 30; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);

      let endNum = currentStartNum + goalNum - 1;

      // 範囲が目標範囲を超える場合の処理
      if (endNum > rangeEnd) {
        endNum = rangeEnd;
      }

      schedule.push({
        date: `${current.getMonth() + 1}/${current.getDate()}`,
        start: currentStartNum,
        end: endNum
      });

      // 次の開始番号を設定（範囲内でループ）
      if (endNum === rangeEnd) {
        currentStartNum = rangeStart;
      } else {
        currentStartNum = endNum + 1;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Background className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pb-8" style={{ marginTop: '25px' }}>
          {/* Header with Back Button */}
          <div className="mb-8 md:mb-12">
            <button
              onClick={() => router.push('/mistap/home')}
              className="mb-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ホームに戻る
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              目標管理
            </h1>
            <p className="text-gray-600 text-lg">
              毎日の学習目標を設定して、継続的な学習習慣を身につけましょう。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column: Settings */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  設定
                </h2>

                {loading ? (
                  <div className="text-center py-8 text-gray-600">読み込み中...</div>
                ) : (
                  <div className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    {isGoalSaved && !isEditing ? (
                      <div className="text-center py-4">
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-1">選択中の単語帳</p>
                          <p className="text-lg font-bold text-gray-900">{selectedTextbook || '未設定'}</p>
                        </div>
                        {(startWord || endWord) && (
                          <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-1">目標範囲</p>
                            <p className="text-lg font-bold text-gray-900">
                              {startWord || '1'} 〜 {endWord || maxWords}
                            </p>
                          </div>
                        )}
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-1">現在の目標</p>
                          <p className="text-3xl font-bold text-gray-900">{dailyGoal}<span className="text-base font-normal text-gray-500 ml-1">語 / 日</span></p>
                        </div>
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-1">開始日</p>
                          <p className="text-lg font-bold text-gray-900">{startDate}</p>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-medium transition-colors shadow-lg"
                          >
                            目標を変更
                          </button>
                          <button
                            onClick={handleClear}
                            className="w-full bg-white border border-red-300 hover:bg-red-50 text-red-600 py-3 px-6 rounded-xl font-medium transition-colors"
                            disabled={saving}
                          >
                            目標をクリア
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            単語帳
                          </label>
                          <select
                            value={selectedTextbook}
                            onChange={(e) => setSelectedTextbook(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50"
                          >
                            {textbooks.map((text) => (
                              <option key={text} value={text}>
                                {text}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            目標範囲
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={startWord}
                              onChange={(e) => setStartWord(e.target.value)}
                              className="w-24 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50 text-center"
                              min="1"
                            />
                            <span className="text-gray-500 font-medium flex-shrink-0">〜</span>
                            <input
                              type="number"
                              value={endWord}
                              onChange={(e) => setEndWord(e.target.value)}
                              className="w-24 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50 text-center"
                              min="1"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            この範囲内で毎日の目標をループします
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            1日の目標語数
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={dailyGoal}
                              onChange={(e) => setDailyGoal(e.target.value)}
                              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50"
                              min="1"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                              語
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            推奨: 50〜100語
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            スタート日
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            学習を開始する日、または目標の基準日を設定します
                          </p>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <button
                            onClick={() => {
                              if (isGoalSaved) {
                                setIsEditing(false);
                              } else {
                                router.back();
                              }
                            }}
                            className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                            disabled={saving}
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-red-200 disabled:opacity-70"
                            disabled={saving}
                          >
                            {saving ? '保存中...' : '保存する'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Schedule */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  学習スケジュール（30日分）
                </h2>

                {schedule.length > 0 ? (
                  <div className="bg-white/60 rounded-2xl overflow-hidden border border-gray-200 max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-4">日付</th>
                          <th className="px-6 py-4">学習範囲</th>
                          <th className="px-6 py-4">語数</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {schedule.map((item, index) => (
                          <tr key={index} className="hover:bg-white/80 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{item.date}</td>
                            <td className="px-6 py-4 text-gray-600">
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                No. {item.start} 〜 {item.end}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{item.end - item.start + 1}語</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>目標を設定するとスケジュールが表示されます</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Background>

      {/* クリア確認モーダル */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">目標クリアの確認</h3>
            <p className="text-gray-600 mb-6">
              目標設定をクリアしますか？<br />
              この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                クリアする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
