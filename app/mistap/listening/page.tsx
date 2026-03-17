'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Headphones,
    Languages,
    Lock,
    Pause,
    Play,
    RotateCcw,
    Square,
    Volume2,
} from 'lucide-react';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/mistap/supabaseClient';
import { AVAILABLE_TEXTBOOKS, getJsonTextbookData } from '@/lib/mistap/jsonTextbookData';
import { detectSpeechLanguage, pickSpeechVoice, sanitizeSpeechText } from '@/lib/mistap/speech';

type RangeWord = {
    word_number: number;
    word: string;
    meaning: string;
};

type PlaybackStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error';
type PlaybackPart = 'word' | 'meaning' | null;
type PlaybackOrder = 'en-ja' | 'ja-en';

const isKobunTextbook = (textbook: string) => {
    const normalized = textbook.toLowerCase();
    return normalized.includes('kobun') || normalized.includes('madonna') || normalized.includes('group30') || textbook.includes('古文');
};

const LISTENING_TEXTBOOKS = AVAILABLE_TEXTBOOKS.filter((textbook) => !isKobunTextbook(textbook));

const DEFAULT_TEXTBOOK =
    LISTENING_TEXTBOOKS.find((textbook) => textbook.toLowerCase().includes('target') && textbook.includes('1900')) ||
    LISTENING_TEXTBOOKS[0] ||
    '';

export default function ListeningPage() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const [selectedTextbook, setSelectedTextbook] = useState(DEFAULT_TEXTBOOK);
    const [startNum, setStartNum] = useState(1);
    const [endNum, setEndNum] = useState(20);
    const [words, setWords] = useState<RangeWord[]>([]);
    const [loadedKey, setLoadedKey] = useState('');
    const [status, setStatus] = useState<PlaybackStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPart, setCurrentPart] = useState<PlaybackPart>(null);
    const [includeMeaning, setIncludeMeaning] = useState(true);
    const [playbackOrder, setPlaybackOrder] = useState<PlaybackOrder>('en-ja');
    const [loopPlayback, setLoopPlayback] = useState(false);
    const [speechRate, setSpeechRate] = useState(1);
    const [gapMs, setGapMs] = useState(1200);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const timeoutRef = useRef<number | null>(null);
    const tokenRef = useRef(0);
    const rangeRequestRef = useRef(0);
    const scheduledActionRef = useRef<(() => void) | null>(null);
    const wordsRef = useRef<RangeWord[]>([]);

    const isPro = profile?.is_pro === true;
    const requestKey = `${selectedTextbook}:${startNum}:${endNum}`;
    const isLoadedForCurrentRange = loadedKey === requestKey && words.length > 0;
    const currentWord = words[currentIndex] ?? null;

    useEffect(() => {
        wordsRef.current = words;
    }, [words]);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            return;
        }

        const syncVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

        syncVoices();
        window.speechSynthesis.addEventListener('voiceschanged', syncVoices);

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', syncVoices);
        };
    }, []);

    useEffect(() => {
        return () => {
            tokenRef.current += 1;
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            scheduledActionRef.current = null;

            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/mistap');
        }
    }, [authLoading, router, user]);

    const previewWords = useMemo(() => words.slice(0, 8), [words]);

    const clearPendingTimeout = useCallback(() => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const scheduleAction = (action: () => void, delay: number) => {
        clearPendingTimeout();
        scheduledActionRef.current = action;
        timeoutRef.current = window.setTimeout(() => {
            const nextAction = scheduledActionRef.current;
            scheduledActionRef.current = null;
            timeoutRef.current = null;
            nextAction?.();
        }, delay);
    };

    const stopPlayback = useCallback((resetPosition = true) => {
        tokenRef.current += 1;
        clearPendingTimeout();
        scheduledActionRef.current = null;

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        setStatus(wordsRef.current.length > 0 ? 'ready' : 'idle');
        setCurrentPart(null);

        if (resetPosition) {
            setCurrentIndex(0);
        }
    }, [clearPendingTimeout]);

    const playSequence = (index: number, token: number) => {
        const nextWords = wordsRef.current;
        if (token !== tokenRef.current) return;

        if (index >= nextWords.length) {
            if (loopPlayback && nextWords.length > 0) {
                playSequence(0, token);
                return;
            }

            setStatus('ready');
            setCurrentPart(null);
            return;
        }

        const targetWord = nextWords[index];
        setCurrentIndex(index);
        setStatus('playing');
        setCurrentPart(null);

        const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        if (!synth) {
            setStatus('error');
            setError('このブラウザでは読み上げ機能を利用できません。');
            return;
        }

        const playbackParts: Array<'word' | 'meaning'> =
            includeMeaning && targetWord.meaning.trim()
                ? playbackOrder === 'ja-en'
                    ? ['meaning', 'word']
                    : ['word', 'meaning']
                : ['word'];

        const queueNextWord = () => {
            scheduleAction(() => playSequence(index + 1, token), gapMs);
        };

        const speakPartAt = (partIndex: number) => {
            if (token !== tokenRef.current) return;

            const part = playbackParts[partIndex];
            if (!part) {
                queueNextWord();
                return;
            }

            const rawText = part === 'word' ? targetWord.word : targetWord.meaning;
            const text = sanitizeSpeechText(rawText);
            if (!text.trim()) {
                if (partIndex < playbackParts.length - 1) {
                    scheduleAction(() => speakPartAt(partIndex + 1), 350);
                    return;
                }

                queueNextWord();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = speechRate;
            utterance.pitch = 1;
            utterance.lang = detectSpeechLanguage(text);

            const voice = pickSpeechVoice(voices, text);
            if (voice) {
                utterance.voice = voice;
            }

            utterance.onstart = () => {
                if (token !== tokenRef.current) return;
                setCurrentPart(part);
                setStatus('playing');
            };

            utterance.onerror = () => {
                if (token !== tokenRef.current) return;
                setError('読み上げ中にエラーが発生しました。もう一度お試しください。');
                setStatus('error');
                setCurrentPart(null);
            };

            utterance.onend = () => {
                if (token !== tokenRef.current) return;

                if (partIndex < playbackParts.length - 1) {
                    scheduleAction(() => speakPartAt(partIndex + 1), 350);
                    return;
                }

                queueNextWord();
            };

            synth.speak(utterance);
        };

        speakPartAt(0);
    };

    const loadWordsForRange = useCallback(async () => {
        const requestId = ++rangeRequestRef.current;
        const normalizedStart = Number(startNum);
        const normalizedEnd = Number(endNum);

        if (!selectedTextbook) {
            setError('教材を選択してください。');
            setStatus('error');
            return null;
        }

        if (!Number.isFinite(normalizedStart) || !Number.isFinite(normalizedEnd) || normalizedStart < 1 || normalizedEnd < normalizedStart) {
            setError('範囲は 1 以上、かつ 開始 <= 終了 で指定してください。');
            setStatus('error');
            return null;
        }

        setError(null);
        setStatus('loading');
        setCurrentIndex(0);
        setCurrentPart(null);

        let nextWords: RangeWord[] = [];

        const localData = getJsonTextbookData(selectedTextbook);
        if (localData && localData.length > 0) {
            nextWords = localData
                .filter((word) => word.word_number >= normalizedStart && word.word_number <= normalizedEnd)
                .map((word) => ({
                    word_number: word.word_number,
                    word: word.word,
                    meaning: word.meaning,
                }));
        }

        if (nextWords.length === 0) {
            const { data, error: fetchError } = await supabase
                .from('words')
                .select('word_number, word, meaning')
                .eq('text', selectedTextbook)
                .gte('word_number', normalizedStart)
                .lte('word_number', normalizedEnd)
                .order('word_number', { ascending: true });

            if (requestId !== rangeRequestRef.current) {
                return null;
            }

            if (fetchError) {
                setError('単語データの取得に失敗しました。');
                setStatus('error');
                return null;
            }

            nextWords = (data ?? []) as RangeWord[];
        }

        if (nextWords.length === 0) {
            setWords([]);
            wordsRef.current = [];
            setLoadedKey('');
            setStatus('error');
            setError('指定した範囲に単語が見つかりませんでした。');
            return null;
        }

        if (requestId !== rangeRequestRef.current) {
            return null;
        }

        setWords(nextWords);
        wordsRef.current = nextWords;
        setLoadedKey(requestKey);
        setCurrentIndex(0);
        setCurrentPart(null);
        setStatus('ready');

        return nextWords;
    }, [requestKey, selectedTextbook, startNum, endNum]);

    useEffect(() => {
        if (authLoading || !user || !isPro) {
            return;
        }

        tokenRef.current += 1;
        clearPendingTimeout();
        scheduledActionRef.current = null;

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        const timeoutId = window.setTimeout(() => {
            void loadWordsForRange();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [authLoading, clearPendingTimeout, isPro, loadWordsForRange, selectedTextbook, startNum, endNum, user]);

    const handlePlay = async () => {
        if (status === 'paused') {
            const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
            if (synth?.paused) {
                synth.resume();
                setStatus('playing');
                return;
            }

            if (scheduledActionRef.current) {
                const nextAction = scheduledActionRef.current;
                scheduledActionRef.current = null;
                setStatus('playing');
                nextAction();
                return;
            }
        }

        const targetWords = isLoadedForCurrentRange ? wordsRef.current : await loadWordsForRange();
        if (!targetWords || targetWords.length === 0) return;

        stopPlayback(false);
        tokenRef.current += 1;
        playSequence(0, tokenRef.current);
    };

    const handlePause = () => {
        if (status !== 'playing') return;

        const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        if (synth?.speaking && !synth.paused) {
            synth.pause();
        }

        clearPendingTimeout();
        setStatus('paused');
    };

    const handleRestart = async () => {
        stopPlayback();
        const targetWords = isLoadedForCurrentRange ? wordsRef.current : await loadWordsForRange();
        if (!targetWords || targetWords.length === 0) return;

        tokenRef.current += 1;
        playSequence(0, tokenRef.current);
    };

    if (authLoading) {
        return (
            <main className="min-h-screen">
                <Background className="flex items-center justify-center min-h-screen">
                    <div className="text-white text-lg font-medium">読み込み中...</div>
                </Background>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Background className="min-h-screen">
                <div className="max-w-5xl mx-auto px-4 pb-10" style={{ marginTop: '25px' }}>
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/mistap/home')}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            ホームに戻る
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-200">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">聞き流し英単語</h1>
                                <p className="text-sm text-gray-500">指定した範囲の単語を連続で読み上げます</p>
                            </div>
                        </div>
                    </div>

                    {!isPro ? (
                        <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto text-center shadow-xl border border-gray-100">
                            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="w-8 h-8 text-sky-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Pro プラン限定機能</h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                聞き流し英単語は、Word Stock や Mistappers&apos; Mistake と同じく
                                Pro 会員向けの機能です。教材と範囲を指定して、移動中やスキマ時間に連続再生できます。
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/upgrade"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-sky-200"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Pro プランを見る
                                </Link>
                                <button
                                    onClick={() => router.push('/mistap/home')}
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    ホームに戻る
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
                            <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-gray-900">再生する範囲を選ぶ</h2>
                                        <p className="text-sm text-gray-500 mt-1">教材を選んで、開始番号と終了番号を設定します</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-2 rounded-full">
                                        <Volume2 className="w-4 h-4" />
                                        連続再生
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">教材</label>
                                        <select
                                            value={selectedTextbook}
                                            onChange={(e) => setSelectedTextbook(e.target.value)}
                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-300"
                                        >
                                            {LISTENING_TEXTBOOKS.map((textbook) => (
                                                <option key={textbook} value={textbook}>
                                                    {textbook}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">開始 No.</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={startNum}
                                                onChange={(e) => setStartNum(Math.max(1, Number(e.target.value) || 1))}
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">終了 No.</label>
                                            <input
                                                type="number"
                                                min={startNum}
                                                value={endNum}
                                                onChange={(e) => setEndNum(Math.max(startNum, Number(e.target.value) || startNum))}
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                        <div className="flex items-center gap-2">
                                            <Languages className="w-4 h-4 text-sky-500" />
                                            <div className="font-bold text-gray-900">再生順</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            意味も読み上げるときの順番を選べます。意味の読み上げをOFFにすると英語のみ再生します。
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setPlaybackOrder('en-ja')}
                                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                                                    playbackOrder === 'en-ja'
                                                        ? 'bg-sky-500 text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                英語→日本語
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPlaybackOrder('ja-en')}
                                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                                                    playbackOrder === 'ja-en'
                                                        ? 'bg-sky-500 text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                日本語→英語
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <label className="rounded-2xl border border-gray-200 bg-gray-50 p-4 cursor-pointer">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        <Languages className="w-4 h-4 text-sky-500" />
                                                        意味も読み上げる
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">英語のあとに日本語の意味も再生します</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={includeMeaning}
                                                    onChange={(e) => setIncludeMeaning(e.target.checked)}
                                                    className="mt-1 h-4 w-4"
                                                />
                                            </div>
                                        </label>

                                        <label className="rounded-2xl border border-gray-200 bg-gray-50 p-4 cursor-pointer">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        <RotateCcw className="w-4 h-4 text-cyan-500" />
                                                        ループ再生
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">最後まで流れたら先頭からもう一度再生します</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={loopPlayback}
                                                    onChange={(e) => setLoopPlayback(e.target.checked)}
                                                    className="mt-1 h-4 w-4"
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-gray-200 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-bold text-gray-700">再生速度</label>
                                                <span className="text-sm font-semibold text-sky-600">{speechRate.toFixed(1)}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={0.7}
                                                max={1.3}
                                                step={0.1}
                                                value={speechRate}
                                                onChange={(e) => setSpeechRate(Number(e.target.value))}
                                                className="w-full accent-sky-500"
                                            />
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-bold text-gray-700">単語間の間隔</label>
                                                <span className="text-sm font-semibold text-cyan-600">{(gapMs / 1000).toFixed(1)}秒</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={600}
                                                max={2500}
                                                step={100}
                                                value={gapMs}
                                                onChange={(e) => setGapMs(Number(e.target.value))}
                                                className="w-full accent-cyan-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-6">{/*
                                        範囲を読み込む
                                    */}<button
                                        onClick={handlePlay}
                                        disabled={status === 'loading'}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-lg shadow-sky-200 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-60 transition-all"
                                    >
                                        <Play className="w-4 h-4" />
                                        読み上げ開始
                                    </button>
                                    <button
                                        onClick={handlePause}
                                        disabled={status !== 'playing'}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        <Pause className="w-4 h-4" />
                                        一時停止
                                    </button>
                                    <button
                                        onClick={() => stopPlayback()}
                                        disabled={status !== 'playing' && status !== 'paused'}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        <Square className="w-4 h-4" />
                                        停止
                                    </button>
                                    <button
                                        onClick={handleRestart}
                                        disabled={status === 'loading' || (!isLoadedForCurrentRange && words.length === 0)}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        先頭から
                                    </button>
                                </div>

                                {error && (
                                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}
                            </section>

                            <section className="space-y-6">
                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-extrabold text-gray-900">再生状況</h2>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-600">
                                            {status === 'playing'
                                                ? 'Playing'
                                                : status === 'paused'
                                                    ? 'Paused'
                                                    : status === 'loading'
                                                        ? 'Loading'
                                                        : status === 'ready'
                                                            ? 'Ready'
                                                            : 'Idle'}
                                        </span>
                                    </div>

                                    <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white p-5 shadow-lg shadow-sky-200 mb-4">
                                        <div className="text-xs uppercase tracking-[0.2em] text-white/75 mb-2">Now Playing</div>
                                        <div className="text-3xl font-extrabold tracking-tight break-words">
                                            {currentWord?.word || '範囲を読み込んでください'}
                                        </div>
                                        <div className="mt-2 text-sm text-white/85 min-h-5">
                                            {includeMeaning && currentWord?.meaning ? currentWord.meaning : '意味の読み上げは OFF です'}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">教材</span>
                                            <span className="font-semibold text-gray-900">{selectedTextbook || '-'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">範囲</span>
                                            <span className="font-semibold text-gray-900">
                                                No.{startNum} - No.{endNum}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">進捗</span>
                                            <span className="font-semibold text-gray-900">
                                                {words.length > 0 ? `${Math.min(currentIndex + 1, words.length)} / ${words.length}` : '0 / 0'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">現在の読み上げ</span>
                                            <span className="font-semibold text-gray-900">
                                                {currentPart === 'word' ? '英単語' : currentPart === 'meaning' ? '意味' : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-extrabold text-gray-900 mb-4">プレビュー</h2>
                                    {previewWords.length > 0 ? (
                                        <div className="space-y-3">
                                            {previewWords.map((word) => (
                                                <div
                                                    key={word.word_number}
                                                    className={`rounded-2xl border px-4 py-3 transition-colors ${
                                                        currentWord?.word_number === word.word_number
                                                            ? 'border-sky-300 bg-sky-50'
                                                            : 'border-gray-100 bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-gray-900 break-words">
                                                            {word.word}
                                                            <span className="ml-2 text-xs font-semibold text-gray-400">No.{word.word_number}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-500 break-words">{word.meaning}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {words.length > previewWords.length && (
                                                <p className="text-xs text-gray-400 text-center pt-1">
                                                    他にも {words.length - previewWords.length} 語あります
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                            教材と範囲を選ぶと、ここに再生予定の単語が自動で表示されます。
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </Background>
            <MistapFooter />
        </main>
    );
}
