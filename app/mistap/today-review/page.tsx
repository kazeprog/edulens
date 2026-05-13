'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    BookOpenCheck,
    CheckCircle2,
    Clock3,
    Lock,
    Play,
    RefreshCcw,
} from 'lucide-react';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/mistap/supabaseClient';
import {
    buildDueReviewWords,
    DEFAULT_DUE_REVIEW_LIMIT,
    DueReviewWord,
    ReviewHistoryResult,
    ReviewMode,
} from '@/lib/mistap/spacedReview';
import { saveSessionPayload } from '@/lib/mistap/sessionPayload';

const FREE_TEST_LIMIT = 50;

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getPriorityLabel = (word: DueReviewWord) => {
    if (word.last_result === 'incorrect' || word.overdue_days >= 7 || word.wrong_count >= 3 || word.retention <= 0.55) {
        return '高';
    }

    if (word.overdue_days > 0 || word.wrong_count > 0 || word.retention <= 0.75) {
        return '中';
    }

    return '低';
};

const getPriorityBadgeClass = (priorityLabel: string) => {
    if (priorityLabel === '高') return 'bg-red-50 text-red-600';
    if (priorityLabel === '中') return 'bg-amber-50 text-amber-700';
    return 'bg-emerald-50 text-emerald-600';
};

export default function TodayReviewPage() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const [words, setWords] = useState<DueReviewWord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTextbook, setSelectedTextbook] = useState('');
    const [testMode, setTestMode] = useState<ReviewMode>('word-meaning');
    const [testCount, setTestCount] = useState(DEFAULT_DUE_REVIEW_LIMIT);
    const [isStarting, setIsStarting] = useState(false);

    const isPro = profile?.is_pro === true;

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/mistap');
        }
    }, [authLoading, router, user]);

    useEffect(() => {
        const savedMode = localStorage.getItem('mistap_test_mode');
        if (savedMode === 'word-meaning' || savedMode === 'meaning-word') {
            setTestMode(savedMode);
        }
    }, []);

    const loadReviewWords = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('results')
                .select('incorrect_words, correct_words, selected_text, created_at, mode')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            const dueWords = buildDueReviewWords((data ?? []) as ReviewHistoryResult[], {
                maxWords: Number.MAX_SAFE_INTEGER,
            });
            const nextTextbooks = Array.from(new Set(dueWords.map((word) => word.textbook))).sort();
            setWords(dueWords);
            setSelectedTextbook((current) => (
                current && dueWords.some((word) => word.textbook === current)
                    ? current
                    : nextTextbooks[0] ?? ''
            ));
        } catch (loadError) {
            console.error('Today review fetch error:', loadError);
            setError('今日の復習リストを読み込めませんでした。');
            setWords([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && user) {
            if (!isPro) {
                setLoading(false);
                return;
            }

            loadReviewWords();
        }
    }, [authLoading, isPro, loadReviewWords, user]);

    const textbooks = useMemo(() => {
        return Array.from(new Set(words.map((word) => word.textbook))).sort();
    }, [words]);

    const selectedTextbookWords = useMemo(() => {
        return words.filter((word) => word.textbook === selectedTextbook);
    }, [selectedTextbook, words]);

    const filteredWords = useMemo(() => {
        return selectedTextbookWords
            .filter((word) => word.mode === testMode)
            .slice(0, DEFAULT_DUE_REVIEW_LIMIT);
    }, [selectedTextbookWords, testMode]);

    const modeCounts = useMemo(() => ({
        wordMeaning: selectedTextbookWords.filter((word) => word.mode === 'word-meaning').length,
        meaningWord: selectedTextbookWords.filter((word) => word.mode === 'meaning-word').length,
    }), [selectedTextbookWords]);

    const overdueCount = selectedTextbookWords.filter((word) => word.overdue_days > 0).length;
    const averageRetention = filteredWords.length > 0
        ? Math.round(filteredWords.reduce((sum, word) => sum + word.retention, 0) / filteredWords.length * 100)
        : 0;
    const maxAllowedCount = isPro ? filteredWords.length : Math.min(filteredWords.length, FREE_TEST_LIMIT);
    const startCount = Math.min(Math.max(1, testCount), Math.max(1, maxAllowedCount));

    useEffect(() => {
        if (maxAllowedCount > 0) {
            setTestCount((current) => Math.min(Math.max(1, current), maxAllowedCount));
        }
    }, [maxAllowedCount]);

    const handleStartTest = async () => {
        if (filteredWords.length === 0) return;

        setIsStarting(true);

        try {
            const selectedWords = [...filteredWords]
                .sort((a, b) => {
                    if (b.priority !== a.priority) return b.priority - a.priority;
                    return Math.random() - 0.5;
                })
                .slice(0, startCount);

            const testData = {
                words: selectedWords.map((word) => ({
                    word: word.word,
                    word_number: word.word_number,
                    meaning: word.meaning,
                    textbook: word.textbook,
                })),
                selectedText: `${selectedTextbook} (今日の復習)`,
                startNum: null,
                endNum: null,
                isReview: true,
                mode: testMode,
            };

            try {
                localStorage.setItem('mistap_test_mode', testMode);
            } catch {
                // ignore
            }

            const dataKey = saveSessionPayload('mistap-test-data', testData);
            router.push(`/mistap/test?dataKey=${encodeURIComponent(dataKey)}`);
        } catch (startError) {
            console.error('Today review start error:', startError);
            setError('テストの作成に失敗しました。');
            setIsStarting(false);
        }
    };

    if (authLoading || (isPro && loading)) {
        return (
            <main className="min-h-screen">
                <Background className="flex min-h-screen items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-5 text-white">
                        <div className="h-14 w-14 rounded-full border-4 border-white/25 border-t-white animate-spin" />
                        <p className="text-lg font-bold">今日の復習を計算しています...</p>
                    </div>
                </Background>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    if (!isPro) {
        return (
            <main className="min-h-screen">
                <Background className="min-h-screen p-4">
                    <div className="mx-auto w-full max-w-5xl pt-6 md:pt-10">
                        <div className="mb-5">
                            <Link
                                href="/mistap/home"
                                prefetch={false}
                                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                ホーム
                            </Link>
                        </div>

                        <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                                <Lock className="h-8 w-8 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900">Pro プラン限定機能</h1>
                            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-600">
                                今日の復習は、忘却曲線に基づいてテスト履歴から復習すべき単語を自動で絞り込むPro会員向けの機能です。
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    href="/upgrademistap"
                                    prefetch={false}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
                                >
                                    <Lock className="h-5 w-5" />
                                    Pro プランを見る
                                </Link>
                                <button
                                    onClick={() => router.push('/mistap/home')}
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
                                >
                                    ホームに戻る
                                </button>
                            </div>
                        </div>
                    </div>
                </Background>
                <MistapFooter />
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Background className="min-h-screen p-4">
                <div className="mx-auto w-full max-w-5xl pt-6 md:pt-10">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <Link
                            href="/mistap/home"
                            prefetch={false}
                            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            ホーム
                        </Link>
                        <button
                            onClick={loadReviewWords}
                            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-white"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            更新
                        </button>
                    </div>

                    <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-xl backdrop-blur-xl">
                        <div className="bg-red-600 px-5 py-8 text-white md:px-8">
                            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight md:text-4xl">今日の復習</h1>
                                    <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/90 md:text-base">
                                        忘却曲線に基づいてテスト履歴から定着度を推定し、今日復習したい単語をリストアップします。
                                        下の単語リストを確認して、そのままテストに進めます。
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center md:min-w-[360px]">
                                    <div className="rounded-2xl bg-white/15 p-3">
                                        <div className="text-2xl font-black">{selectedTextbookWords.length}</div>
                                        <div className="text-xs font-bold text-white/80">今日の対象</div>
                                    </div>
                                    <div className="rounded-2xl bg-white/15 p-3">
                                        <div className="text-2xl font-black">{overdueCount}</div>
                                        <div className="text-xs font-bold text-white/80">遅れ気味</div>
                                    </div>
                                    <div className="rounded-2xl bg-white/15 p-3">
                                        <div className="text-2xl font-black">{averageRetention}%</div>
                                        <div className="text-xs font-bold text-white/80">推定定着</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 md:p-8">
                            {error && (
                                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                    {error}
                                </div>
                            )}

                            {words.length === 0 ? (
                                <div className="py-14 text-center">
                                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">今日の復習は完了です</h2>
                                    <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-gray-600">
                                        今の履歴では、今日復習すべき単語はありません。新しいテストを受けると、次の復習タイミングが自動で更新されます。
                                    </p>
                                    <button
                                        onClick={() => router.push('/mistap/test-setup')}
                                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-7 py-3 font-bold text-white shadow-lg transition hover:bg-gray-800"
                                    >
                                        新しいテストを作成
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-bold text-gray-700">単語帳</span>
                                            <select
                                                value={selectedTextbook}
                                                onChange={(event) => setSelectedTextbook(event.target.value)}
                                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            >
                                                {textbooks.map((textbook) => (
                                                    <option key={textbook} value={textbook}>{textbook}</option>
                                                ))}
                                            </select>
                                        </label>

                                        <div>
                                            <span className="mb-2 block text-sm font-bold text-gray-700">出題モード</span>
                                            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
                                                <button
                                                    onClick={() => setTestMode('word-meaning')}
                                                    className={`rounded-xl px-3 py-3 text-sm font-black transition ${testMode === 'word-meaning'
                                                        ? 'bg-white text-red-600 shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-800'
                                                        }`}
                                                >
                                                    単語→意味 ({modeCounts.wordMeaning})
                                                </button>
                                                <button
                                                    onClick={() => setTestMode('meaning-word')}
                                                    className={`rounded-xl px-3 py-3 text-sm font-black transition ${testMode === 'meaning-word'
                                                        ? 'bg-white text-red-600 shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-800'
                                                        }`}
                                                >
                                                    意味→単語 ({modeCounts.meaningWord})
                                                </button>
                                            </div>
                                        </div>

                                        <label className="block">
                                            <span className="mb-2 block text-sm font-bold text-gray-700">テスト語数</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={testCount}
                                                    onChange={(event) => {
                                                        const next = Number(event.target.value);
                                                        if (Number.isNaN(next)) return;
                                                        setTestCount(Math.max(1, Math.min(maxAllowedCount || 1, next)));
                                                    }}
                                                    min={1}
                                                    max={maxAllowedCount || 1}
                                                    className="w-24 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center font-black text-gray-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                                />
                                                <span className="text-sm font-bold text-gray-500">語</span>
                                            </div>
                                        </label>
                                    </div>

                                    {!isPro && filteredWords.length > FREE_TEST_LIMIT && (
                                        <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                                            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                                            無料プランでは一度に出題できる単語数は50語までです。
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-gray-500">選択中の復習単語</div>
                                            <div className="text-2xl font-black text-gray-900">{filteredWords.length}語</div>
                                        </div>
                                        <button
                                            onClick={handleStartTest}
                                            disabled={filteredWords.length === 0 || isStarting}
                                            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-black shadow-lg transition ${filteredWords.length === 0 || isStarting
                                                ? 'bg-gray-300 text-gray-500'
                                                : 'bg-red-600 text-white shadow-red-200 hover:bg-red-700 hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <Play className="h-5 w-5" />
                                            {isStarting ? '作成中...' : `テストする (${filteredWords.length === 0 ? 0 : startCount}語)`}
                                        </button>
                                    </div>

                                    {filteredWords.length === 0 ? (
                                        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center">
                                            <BookOpenCheck className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                            <h2 className="text-xl font-black text-gray-800">この条件の復習単語はありません</h2>
                                            <p className="mt-2 text-sm font-medium text-gray-500">
                                                単語帳や出題モードを切り替えて確認できます。
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                                            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-black text-gray-500 md:grid md:grid-cols-[1fr_150px_120px_170px] md:gap-3">
                                                <span>単語</span>
                                                <span className="hidden md:block">単語帳</span>
                                                <span className="hidden md:block text-right">定着度</span>
                                                <span className="hidden text-right md:block">復習目安</span>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {filteredWords.map((word) => {
                                                    const priorityLabel = getPriorityLabel(word);

                                                    return (
                                                        <div key={`${word.textbook}-${word.mode}-${word.word_number}-${word.word}`} className="px-4 py-4 md:grid md:grid-cols-[1fr_150px_120px_170px] md:items-center md:gap-3">
                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-black text-gray-500">No.{word.word_number}</span>
                                                                    {word.last_result === 'incorrect' && (
                                                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-black text-red-600">前回ミス</span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-2 text-lg font-black text-gray-900" translate="no">{word.word}</div>
                                                                <div className="mt-1 text-sm font-medium leading-relaxed text-gray-600">{word.meaning}</div>
                                                                <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
                                                                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-black text-gray-400">{word.textbook}</span>
                                                                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-black text-red-600">定着 {Math.round(word.retention * 100)}%</span>
                                                                    <span className={`inline-flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-xs font-black leading-tight ${getPriorityBadgeClass(priorityLabel)}`}>
                                                                        <Clock3 className="h-3.5 w-3.5 shrink-0" />
                                                                        <span className="flex flex-col items-start whitespace-nowrap">
                                                                            <span>前回 {formatDate(word.last_seen_at)}</span>
                                                                            <span>優先度 {priorityLabel}</span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="hidden min-w-0 text-sm font-bold text-gray-500 md:block">
                                                                <span className="block truncate">{word.textbook}</span>
                                                                <span className="mt-1 block text-xs text-gray-400">
                                                                    正解{word.correct_count} / ミス{word.wrong_count}
                                                                </span>
                                                            </div>
                                                            <div className="hidden text-right md:block">
                                                                <span className="text-lg font-black text-red-600">{Math.round(word.retention * 100)}%</span>
                                                            </div>
                                                            <div className="hidden justify-end md:flex">
                                                                <div className={`inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-black leading-tight ${getPriorityBadgeClass(priorityLabel)}`}>
                                                                    <Clock3 className="h-3.5 w-3.5 shrink-0" />
                                                                    <span className="flex flex-col items-start whitespace-nowrap">
                                                                        <span>前回 {formatDate(word.last_seen_at)}</span>
                                                                        <span>優先度 {priorityLabel}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </Background>
            <MistapFooter />
        </main>
    );
}
