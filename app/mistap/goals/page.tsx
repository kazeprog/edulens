'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { useRouter } from 'next/navigation';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { useAuth } from '@/context/AuthContext';

interface Goal {
  id: string;
  textbook_name: string;
  daily_goal: number;
  start_date: string;
  goal_start_word: number;
  goal_end_word: number;
  words_per_test?: number;
}

export default function GoalsPage() {
  const router = useRouter();
  const { profile } = useAuth();

  // フォーム状態
  const [dailyGoal, setDailyGoal] = useState<string>('100');
  const [wordsPerTest, setWordsPerTest] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [selectedTextbook, setSelectedTextbook] = useState<string>('');
  const [startWord, setStartWord] = useState<string>('1');
  const [endWord, setEndWord] = useState<string>('');

  // アプリ状態
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 新規作成 or 編集モード
  const [textbooks, setTextbooks] = useState<string[]>([]);
  const [maxWords, setMaxWords] = useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // データ
  const [myGoals, setMyGoals] = useState<Goal[]>([]);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // 初期ロード：ユーザー確認 & 教材リスト取得 & 既存目標取得
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

        // 1. 教材リストの取得
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
          // デフォルト選択
          if (uniqueTexts.length > 0) {
            setSelectedTextbook(uniqueTexts.includes('ターゲット1900') ? 'ターゲット1900' : uniqueTexts[0]);
          }
        }

        // 2. 既存の目標を取得（新テーブルから）
        const { data: goalsData, error: goalsError } = await supabase
          .from('mistap_textbook_goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (goalsError) {
          console.error('Error fetching goals:', goalsError);
          // テーブルがまだないなどのエラーハンドリング（旧データの移行はSQLで行われる前提）
        } else if (mounted) {
          setMyGoals(goalsData || []);
        }

      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
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
        // 新規作成モードで、かつ手動入力されていない場合のみリセット
        if (isEditing && !editingGoalId && !endWord) {
          // setStartWord('1'); // startWordはユーザーが入力している可能性があるので維持
          setEndWord(data.word_number.toString());
        }
      }
    }
    fetchMaxWords();
  }, [selectedTextbook, isEditing, editingGoalId, endWord]);

  // 目標の編集を開始
  const handleEdit = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setSelectedTextbook(goal.textbook_name);
    setDailyGoal(goal.daily_goal.toString());
    setWordsPerTest(goal.words_per_test ? goal.words_per_test.toString() : '');
    setStartDate(goal.start_date);
    setStartWord(goal.goal_start_word.toString());
    setEndWord(goal.goal_end_word.toString());
    setIsEditing(true);
    setError(null);
  };

  // 新規作成モードへ
  const handleCreateNew = () => {
    setEditingGoalId(null);
    setDailyGoal('100');
    setWordsPerTest('');
    // 日付リセット
    const today = new Date();
    const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setStartDate(defaultDate);

    setStartWord('1');
    setEndWord(''); // maxWords取得時にセットされる
    setIsEditing(true);
    setError(null);
  };

  // 削除確認
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  // 削除実行
  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('mistap_textbook_goals')
        .delete()
        .eq('id', deleteTargetId);

      if (error) throw error;

      setMyGoals(prev => prev.filter(g => g.id !== deleteTargetId));

      // もし編集中のものが削除されたらリセット
      if (editingGoalId === deleteTargetId) {
        setIsEditing(false);
        setEditingGoalId(null);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '削除に失敗しました');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  // 保存（新規・更新）
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

      // バリデーション
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
        user_id: userId,
        textbook_name: selectedTextbook,
        daily_goal: parseInt(dailyGoal) || 0,
        start_date: startDate,
        goal_start_word: startWordNum,
        goal_end_word: endWordNum,
        words_per_test: wordsPerTest ? parseInt(wordsPerTest) : null
      };

      let result;
      if (editingGoalId) {
        // 更新
        result = await supabase
          .from('mistap_textbook_goals')
          .update(payload)
          .eq('id', editingGoalId)
          .select()
          .single();
      } else {
        // 新規作成 (upsertにして重複を防ぐ)
        result = await supabase
          .from('mistap_textbook_goals')
          .upsert(payload, { onConflict: 'user_id, textbook_name' })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // ローカル更新
      if (editingGoalId) {
        setMyGoals(prev => prev.map(g => g.id === editingGoalId ? result.data : g));
      } else {
        // 新規追加（または上書き）
        setMyGoals(prev => {
          // 同じ教科書があれば削除してから追加（最新を上に）
          const filtered = prev.filter(g => g.textbook_name !== selectedTextbook);
          return [result.data, ...filtered];
        });
      }

      setIsEditing(false);
      setEditingGoalId(null);

    } catch (e: unknown) {
      console.error('save goals error', e);
      setError(e instanceof Error ? e.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  // スケジュール計算（現在編集中の内容に基づく）
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

      if (endNum > rangeEnd) {
        endNum = rangeEnd;
      }

      schedule.push({
        date: `${current.getMonth() + 1}/${current.getDate()}`,
        start: currentStartNum,
        end: endNum
      });

      if (endNum === rangeEnd) {
        currentStartNum = rangeStart;
      } else {
        currentStartNum = endNum + 1;
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Background className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pb-8" style={{ marginTop: '25px' }}>
          {/* Header */}
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  目標管理
                </h1>
                <p className="text-gray-600 text-lg">
                  複数の教材で学習目標を設定し、毎日の習慣を作りましょう。
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleCreateNew}
                  className="hidden md:flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新しい目標を追加
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column: List or Settings */}
            <div className="lg:col-span-1 space-y-6">

              {/* モバイル用追加ボタン */}
              {!isEditing && (
                <button
                  onClick={handleCreateNew}
                  className="md:hidden w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新しい目標を追加
                </button>
              )}

              {/* 編集モード: 設定フォーム */}
              {isEditing ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 max-h-[calc(100vh-200px)] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    {editingGoalId ? '目標の編集' : '新しい目標'}
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

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          単語帳
                        </label>
                        <select
                          value={selectedTextbook}
                          onChange={(e) => setSelectedTextbook(e.target.value)}
                          disabled={!!editingGoalId} // 編集時は変更不可
                          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50 disabled:bg-gray-100 disabled:text-gray-500"
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
                          最大: {maxWords}語 まで
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
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          1回あたりのテスト語数 <span className="text-xs font-normal text-gray-500 ml-1">(任意)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={wordsPerTest}
                            onChange={(e) => setWordsPerTest(e.target.value)}
                            placeholder={dailyGoal ? (profile?.is_pro ? `${dailyGoal} (全問)` : (parseInt(dailyGoal) > 50 ? '50 (Proプラン制限)' : `${dailyGoal} (全問)`)) : '未設定'}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white/50"
                            min="1"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                            語
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {profile?.is_pro ? "設定しない場合は、その日の目標範囲すべてが出題されます。" : "設定しない場合は、その日の目標範囲から（最大50語）出題されます。"}
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
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditingGoalId(null);
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
                    </div>
                  )}
                </div>
              ) : (
                // 一覧モード: 目標リスト
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-10 text-gray-500">読み込み中...</div>
                  ) : myGoals.length === 0 ? (
                    <div className="bg-white/80 rounded-3xl p-8 text-center text-gray-500 border border-white/50 shadow-sm">
                      <p className="mb-4">目標がまだ設定されていません。</p>
                      <p className="text-sm">「新しい目標を追加」から<br />学習を始めましょう！</p>
                    </div>
                  ) : (
                    myGoals.map(goal => (
                      <div
                        key={goal.id}
                        onClick={() => handleEdit(goal)}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all cursor-pointer group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                            {goal.textbook_name}
                          </h3>
                          <button
                            onClick={(e) => handleDeleteClick(goal.id, e)}
                            className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                            title="削除"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">1日の目標</span>
                            <span className="font-semibold text-red-600">{goal.daily_goal}語</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">範囲</span>
                            <span className="font-semibold">{goal.goal_start_word} 〜 {goal.goal_end_word}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">開始日</span>
                            <span className="font-semibold">{goal.start_date.replace(/-/g, '/')}</span>
                          </div>
                        </div>
                        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Schedule Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  {isEditing ? `「${selectedTextbook}」のスケジュール` : '選択中の目標スケジュール'}
                </h2>

                {(!isEditing && myGoals.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>目標がありません。</p>
                  </div>
                ) : (!isEditing && !editingGoalId) ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>左のリストから目標を選択すると、スケジュールが表示されます。</p>
                    <p className="text-sm mt-2 opacity-70">（編集モードで確認できます）</p>
                  </div>
                ) : schedule.length > 0 ? (
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

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">目標を削除しますか？</h3>
            <p className="text-gray-600 mb-6">
              この目標設定を削除します。<br />
              学習履歴は削除されません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
      <MistapFooter />
    </main>
  );
}
