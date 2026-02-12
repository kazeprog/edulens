'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { normalizeTextbookName } from '@/lib/mistap/textbookUtils';

// カラー設定
const COLORS = {
    learned: '#9CA3AF', // 覚えた単語 (Gray)
    toCheck: '#F472B6', // 要チェック (Pink)
    notLearned: '#EF4444', // 覚えていない (Red)
};

// 単語データの型
interface WordData {
    word: string;
    meaning: string;
    word_number: number;
    wrong_count: number;
    correct_count: number;
    last_wrong_date: string;
    textbook: string;
    mode: 'word-meaning' | 'meaning-word' | null; // テストモード
}

interface ProgressItem {
    name: string;
    value: number;
    color: string;
}

interface TrendDataPoint {
    date: string;
    learned: number;
    toCheck: number;
    notLearned: number;
}

interface DailyStatsMap {
    [textbook: string]: Map<string, { learned: number; toCheck: number; notLearned: number }>;
}

export default function ProgressDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [showTestMenu, setShowTestMenu] = useState(false);
    const [loading, setLoading] = useState(true);

    // 全単語データ（教材情報を含む）
    const [allWords, setAllWords] = useState<WordData[]>([]);

    // 利用可能な教材リスト
    const [textbooks, setTextbooks] = useState<string[]>([]);

    // 選択中の教材（null = 全て）
    const [selectedTextbook, setSelectedTextbook] = useState<string | null>(null);

    // 日別統計（教材ごと）
    const [dailyStatsMap, setDailyStatsMap] = useState<DailyStatsMap>({});

    // 選択中のモード（null = 全て）
    const [selectedMode, setSelectedMode] = useState<'word-meaning' | 'meaning-word' | null>(null);

    // データ取得
    const loadWordData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        const supabase = getSupabase();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // 全テスト結果を取得（correct_wordsも含む）
            const { data: results, error } = await supabase
                .from('results')
                .select('incorrect_words, correct_words, correct, total, selected_text, created_at, mode')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error loading word data:', error);
                setLoading(false);
                return;
            }

            // 単語ごとの正解・不正解を追跡
            const wordMap = new Map<string, WordData>();
            const textbookSet = new Set<string>();
            const dailyStats: DailyStatsMap = {};

            results?.forEach(result => {
                const dateKey = new Date(result.created_at).toISOString().split('T')[0];
                const textbookRaw = result.selected_text || '不明';
                const resultMode = result.mode || 'word-meaning'; // デフォルトは word-meaning
                // カテゴリ名や復習テストのサフィックスを除去して、元の教材名（レッスン情報含む）に寄せる
                const textbook = textbookRaw
                    .replace(/[\s]*[（(][^）)]*復習[^)）]*[)）][\s]*$/u, '')
                    .replace(/[\s]*[（(][^）)]*(覚えた|要チェック|覚えていない)[^)）]*[)）][\s]*$/u, '')
                    .trim();

                textbookSet.add(textbook);

                // 日別統計の初期化
                if (!dailyStats[textbook]) {
                    dailyStats[textbook] = new Map();
                }
                if (!dailyStats[textbook].has(dateKey)) {
                    dailyStats[textbook].set(dateKey, { learned: 0, toCheck: 0, notLearned: 0 });
                }

                const stats = dailyStats[textbook].get(dateKey)!;

                // 不正解の単語を処理
                if (result.incorrect_words && Array.isArray(result.incorrect_words)) {
                    result.incorrect_words.forEach((word: { word_number: number; word: string; meaning: string }) => {
                        const key = `${textbook}|${word.word_number}|${resultMode}`;

                        if (wordMap.has(key)) {
                            const existing = wordMap.get(key)!;
                            existing.wrong_count += 1;
                            existing.last_wrong_date = result.created_at;
                        } else {
                            wordMap.set(key, {
                                word: word.word,
                                meaning: word.meaning,
                                word_number: word.word_number,
                                wrong_count: 1,
                                correct_count: 0,
                                last_wrong_date: result.created_at,
                                textbook: textbook,
                                mode: resultMode,
                            });
                        }
                    });
                    stats.notLearned += result.incorrect_words.length;
                }

                // 正解の単語を処理（correct_wordsから直接取得）
                if (result.correct_words && Array.isArray(result.correct_words)) {
                    result.correct_words.forEach((word: { word_number: number; word: string; meaning: string }) => {
                        const key = `${textbook}|${word.word_number}|${resultMode}`;

                        if (wordMap.has(key)) {
                            wordMap.get(key)!.correct_count += 1;
                        } else {
                            wordMap.set(key, {
                                word: word.word,
                                meaning: word.meaning,
                                word_number: word.word_number,
                                wrong_count: 0,
                                correct_count: 1,
                                last_wrong_date: '',
                                textbook: textbook,
                                mode: resultMode,
                            });
                        }
                    });
                    stats.learned += result.correct_words.length;
                }
            });

            // ステート更新
            setAllWords(Array.from(wordMap.values()));
            setTextbooks(Array.from(textbookSet).sort());
            setDailyStatsMap(dailyStats);

        } catch (e) {
            console.error('Error loading word data:', e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadWordData();
    }, [loadWordData]);

    // 表示用の教科書リスト（重複を除去した基本教科書名）
    const displayTextbooks = useMemo(() => {
        const baseNames = new Set<string>();
        textbooks.forEach(tb => baseNames.add(normalizeTextbookName(tb)));
        return Array.from(baseNames).sort();
    }, [textbooks]);

    // 選択された教材とモードでフィルタリングされた単語
    const filteredWords = useMemo(() => {
        let words = allWords;
        // 教材フィルタ
        if (selectedTextbook) {
            words = words.filter(w => normalizeTextbookName(w.textbook) === selectedTextbook);
        }
        // モードフィルタ
        if (selectedMode) {
            words = words.filter(w => w.mode === selectedMode);
        }
        return words;
    }, [allWords, selectedTextbook, selectedMode]);

    // フィルタリングされた単語を分類
    const { wordLists, progressData } = useMemo(() => {
        const learnedWords: WordData[] = [];
        const toCheckWords: WordData[] = [];
        const notLearnedWords: WordData[] = [];

        filteredWords.forEach(word => {
            if (word.correct_count > word.wrong_count) {
                learnedWords.push(word);
            } else if (word.correct_count > 0) {
                toCheckWords.push(word);
            } else if (word.wrong_count > 0) {
                notLearnedWords.push(word);
            }
        });

        learnedWords.sort((a, b) => b.correct_count - a.correct_count);
        toCheckWords.sort((a, b) => b.wrong_count - a.wrong_count);
        notLearnedWords.sort((a, b) => b.wrong_count - a.wrong_count);

        return {
            wordLists: {
                '覚えた単語': learnedWords,
                '要チェックの単語': toCheckWords,
                '覚えていない単語': notLearnedWords,
            },
            progressData: [
                { name: '覚えた単語', value: learnedWords.length, color: COLORS.learned },
                { name: '要チェックの単語', value: toCheckWords.length, color: COLORS.toCheck },
                { name: '覚えていない単語', value: notLearnedWords.length, color: COLORS.notLearned },
            ],
        };
    }, [filteredWords]);

    // トレンドデータを生成
    const trendData = useMemo(() => {
        const now = new Date();
        const trend: TrendDataPoint[] = [];

        // 選択された教材の日別統計を取得（または全教材を合算）
        const relevantTextbooks = selectedTextbook
            ? Object.keys(dailyStatsMap).filter(tb => normalizeTextbookName(tb) === selectedTextbook)
            : Object.keys(dailyStatsMap);

        for (let i = 59; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

            let learned = 0, toCheck = 0, notLearned = 0;

            relevantTextbooks.forEach(tb => {
                const stats = dailyStatsMap[tb]?.get(dateKey);
                if (stats) {
                    learned += stats.learned;
                    toCheck += stats.toCheck;
                    notLearned += stats.notLearned;
                }
            });

            trend.push({ date: dateStr, learned, toCheck, notLearned });
        }

        return trend;
    }, [dailyStatsMap, selectedTextbook]);

    // 初回レンダリング時に右端までスクロール
    useEffect(() => {
        if (scrollRef.current && !loading) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [loading, trendData]);

    const handleCardClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setShowTestMenu(false);
    };

    const selectedWords = selectedCategory ? (wordLists as Record<string, WordData[]>)[selectedCategory] || [] : [];

    const handleCreateTest = async (count: number | 'all') => {
        if (selectedWords.length === 0) return;

        try {
            const actualCount = count === 'all' ? selectedWords.length : Math.min(count, selectedWords.length);
            const shuffled = [...selectedWords].sort(() => Math.random() - 0.5).slice(0, actualCount);

            // もし選ばれた単語がすべて同じ教材なら、その教材名を使用する
            const uniqueTextbooks = new Set(shuffled.map(w => w.textbook));
            let targetTextbook = selectedTextbook || '全範囲';

            if (!selectedTextbook && uniqueTextbooks.size === 1) {
                targetTextbook = Array.from(uniqueTextbooks)[0];
            }

            const testData = {
                words: shuffled.map((w) => ({
                    word: w.word,
                    word_number: w.word_number,
                    meaning: w.meaning
                })),
                selectedText: `${targetTextbook} (${selectedCategory})`,
                startNum: null,
                endNum: null,
                isReview: true,
                mode: selectedMode || shuffled[0]?.mode || 'word-meaning'
            };

            const supabase = getSupabase();
            if (user && supabase) {
                // 回数カウント (エラーでも続行)
                supabase.rpc('increment_profile_test_count', { p_user_id: user.id })
                    .then(({ error }) => {
                        if (error) console.error('Failed to increment test count:', error);
                    });
            }

            const dataParam = encodeURIComponent(JSON.stringify(testData));
            router.push(`/mistap/test?data=${dataParam}`);
        } catch (error) {
            console.error('Test creation failed:', error);
            alert('テスト作成に失敗しました');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-12"></div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-64 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
                    <div className="h-40 bg-gray-100 rounded-full w-40 mx-auto"></div>
                </div>
            </div>
        );
    }

    const totalWords = progressData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="flex flex-col gap-6">

            {/* 教材タブ */}
            {displayTextbooks.length > 0 && (
                <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300">
                        {displayTextbooks.map((tb) => (
                            <button
                                key={tb}
                                onClick={() => setSelectedTextbook(tb)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedTextbook === tb
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tb}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* モードタブ */}
            <div className="flex gap-2 px-1">
                <button
                    onClick={() => setSelectedMode(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedMode === null
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    すべて
                </button>
                <button
                    onClick={() => setSelectedMode('word-meaning')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedMode === 'word-meaning'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    単語→意味
                </button>
                <button
                    onClick={() => setSelectedMode('meaning-word')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedMode === 'meaning-word'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    意味→単語
                </button>
            </div>

            {/* 0. サマリーカード */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                {progressData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item.name)}
                        className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md hover:border-red-100 transition-all active:scale-95"
                    >
                        <span className="text-xs md:text-sm font-medium text-gray-500 mb-1">{item.name}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl md:text-2xl font-bold" style={{ color: item.color }}>
                                {item.value}
                            </span>
                            <span className="text-xs text-gray-400">語</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* カウントの定義説明リンク */}
            <div className="flex justify-end px-2">
                <button
                    onClick={() => setIsHelpModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    単語のカウントについて
                </button>
            </div>

            {/* 1. 学習進捗状況 (ドーナツグラフ) */}
            {totalWords > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                    <h3 className="text-gray-700 font-bold mb-4">単語学習の進捗状況</h3>
                    <div className="w-full h-64 relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={progressData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {progressData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="rect"
                                    formatter={(value) => (
                                        <span className="text-gray-600 text-sm ml-1 mr-2">{value}</span>
                                    )}
                                />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ top: 'calc(50% - 20px)' }}>
                            <span className="text-2xl font-bold text-gray-800">{totalWords}</span>
                            <span className="block text-xs text-gray-500">語</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center h-64">
                    <div className="text-gray-400 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm">
                            {selectedTextbook
                                ? `「${selectedTextbook}」のテスト履歴がありません`
                                : 'テストを受けると進捗が表示されます'
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* 2. 学習推移グラフ (折れ線グラフ) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-gray-700 font-bold mb-4 text-center sm:text-left">単語学習の推移 (過去60日間)</h3>

                <div
                    ref={scrollRef}
                    className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                >
                    <div className="h-72 min-w-[200%] sm:min-w-[1200px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart
                                data={trendData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    interval={4}
                                    angle={-45}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    label={{ value: '単語数', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 } }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="learned"
                                    name="正解数"
                                    stroke={COLORS.learned}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="notLearned"
                                    name="間違い数"
                                    stroke={COLORS.notLearned}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2 md:hidden">
                    ← スクロールして過去の推移を確認 →
                </p>
            </div>

            {/* 単語リストモーダル */}
            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedCategory}</h3>
                                {selectedTextbook && (
                                    <p className="text-xs text-gray-500">{selectedTextbook}</p>
                                )}
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4 flex-1">
                            {selectedWords.length > 0 ? (
                                <ul className="space-y-3">
                                    {selectedWords.map((word, idx) => (
                                        <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <div>
                                                <span className="font-bold text-gray-900">{word.word || `#${word.word_number}`}</span>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                                        誤: {word.wrong_count}
                                                    </span>
                                                    <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                                                        正: {word.correct_count}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-600">{word.meaning}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    単語がありません
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                            {!showTestMenu ? (
                                <>
                                    <button
                                        onClick={() => setShowTestMenu(true)}
                                        disabled={selectedWords.length === 0}
                                        className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-red-100"
                                    >
                                        この中からテスト作成
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        閉じる
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <p className="text-center text-sm font-bold text-gray-700">出題数を選択</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[10, 20, 30, 50, 100].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => handleCreateTest(num)}
                                                disabled={selectedWords.length < num}
                                                className="bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 text-gray-700 py-2 rounded-lg text-sm font-bold disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:hover:bg-white transition-all"
                                            >
                                                {num}問
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handleCreateTest('all')}
                                            className="bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 text-gray-700 py-2 rounded-lg text-sm font-bold transition-all"
                                        >
                                            全て({selectedWords.length})
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowTestMenu(false)}
                                        className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isHelpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsHelpModalOpen(false)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-gray-800 text-lg mb-4 text-center">単語のカウントについて</h3>
                        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.learned }}></span>
                                    <span className="font-bold text-gray-800">覚えた単語</span>
                                </div>
                                <p className="pl-5">
                                    過去の学習で、正解した回数が間違えた回数を上回っている単語です。
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.toCheck }}></span>
                                    <span className="font-bold text-gray-800">要チェックの単語</span>
                                </div>
                                <p className="pl-5">
                                    正解したことはありますが、まだ間違えた回数の方が多いか、同じ回数の単語です。
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.notLearned }}></span>
                                    <span className="font-bold text-gray-800">覚えていない単語</span>
                                </div>
                                <p className="pl-5">
                                    まだ一度も正解できていない単語です。
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsHelpModalOpen(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
