'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Background from '@/components/mistap/Background';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

interface ResultData {
    grade: string;
    unit: string;
    total: number;
    correct: number;
    incorrects: {
        word_number: number; // problem_number
        word: string; // question
        meaning: string; // answer
    }[];
}

export default function MathResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 保存済みフラグ（React Strict Mode対策）
    const hasSavedRef = useRef(false);

    // テスト試行IDをコンポーネントマウント時に固定
    const [attemptId] = useState(() => searchParams.get('t') || Date.now().toString());

    useEffect(() => {
        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                const parsed = JSON.parse(decodeURIComponent(dataParam));
                setResultData(parsed);
            } catch (e) {
                console.error(e);
                router.push('/mathtap/test-setup');
            }
        } else {
            router.push('/mathtap/test-setup');
        }
    }, [searchParams, router]);

    // 認証チェックとデータ保存
    useEffect(() => {
        // resultDataがない、または認証ローディング中は何もしない
        if (!resultData || authLoading) return;

        // すでに保存処理が実行済みなら何もしない
        if (hasSavedRef.current) return;

        // フラグを即座に立てる（同期的に）
        hasSavedRef.current = true;

        const saveResult = async () => {
            if (!user) {
                setIsLoggedIn(false);
                setMessage("アカウント登録後はあなたの成績が\n記録されていきます！\n一緒に勉強を始めましょう！");
                return;
            }

            setIsLoggedIn(true);
            setIsSaving(true);

            const supabase = getSupabase();
            if (!supabase) return;

            try {
                const { grade, unit, total, correct, incorrects } = resultData;
                const incorrectCount = incorrects.length;

                // test_keyの生成: Mathtap:{grade}:{unit}:{incorrect_ids}:{timestamp}
                // attemptIdはstateで固定されているため、常に同じキーになる
                const incorrectIds = incorrects.map(i => i.word_number).join(',');
                const testKey = `Mathtap:${grade}:${unit}:${incorrectIds}:${attemptId}`;

                console.log('Saving with testKey:', testKey); // デバッグ用

                const payload = {
                    user_id: user.id,
                    selected_text: `Mathtap: ${grade}`,
                    unit: unit,
                    start_num: null,
                    end_num: null,
                    total: total,
                    correct: correct,
                    incorrect_count: incorrectCount,
                    incorrect_words: incorrects,
                    correct_words: [],
                    test_key: testKey,
                    mode: 'mathtap',
                };

                const { error } = await supabase
                    .from('results')
                    .upsert([payload], { onConflict: 'user_id,test_key' });

                if (error) {
                    console.error('Failed to save result:', error);
                } else {
                    console.log('Result saved successfully');
                }

            } catch (e) {
                console.error('Error saving result:', e);
            } finally {
                setIsSaving(false);
            }
        };

        saveResult();
    }, [resultData, authLoading]); // user, searchParams, attemptIdを依存から除外（hasSavedRefでガード済み）

    if (!resultData) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-start min-h-screen">
                    <div className="text-white text-xl" style={{ marginTop: 'calc(64px + 48px)' }}>Loading...</div>
                </Background>
            </div>
        );
    }

    const { grade, unit, total, correct, incorrects } = resultData;
    const percentage = Math.round((correct / total) * 100);

    // Helper to render math safely
    // Helper to render mixed text (LaTeX + Normal Text) safely
    const renderMath = (text: string) => {
        if (!text) return '';
        const parts = text.split(/(\$[^$]+\$)/g);
        return parts.map(part => {
            if (part.startsWith('$') && part.endsWith('$')) {
                const content = part.slice(1, -1);
                try {
                    return katex.renderToString(content, { throwOnError: false, displayMode: false });
                } catch {
                    return content;
                }
            }
            return part.replace(/\r?\n/g, '<br />');
        }).join('');
    };

    return (
        <div className="min-h-screen">
            <Background className="flex items-start justify-center min-h-screen p-4">
                <div className="bg-white/40 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-xl w-full max-w-3xl border border-white/50" style={{ marginTop: '25px' }}>
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">テスト結果</h1>

                    {/* 実施した教材・範囲 */}
                    <div className="text-center mb-4">
                        <div className="text-sm text-gray-600">教材: <span className="font-semibold text-gray-800">{grade}</span></div>
                        <div className="text-sm text-gray-600">範囲: <span className="font-semibold text-gray-800">{unit}</span></div>
                    </div>

                    {/* 正答率の大きな表示 */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-4">
                            <span className="text-3xl font-bold text-white">{percentage}%</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-700">正答率</p>
                    </div>

                    {/* 詳細スコア */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-blue-200">
                            <div className="text-2xl font-bold text-gray-600">{total}</div>
                            <div className="text-sm text-gray-600">総問題数</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-300">
                            <div className="text-2xl font-bold text-blue-600">{correct}</div>
                            <div className="text-sm text-gray-600">正答数</div>
                        </div>
                        <div className="bg-red-100 rounded-xl p-4 text-center border-2 border-red-400">
                            <div className="text-2xl font-bold text-red-700">{incorrects.length}</div>
                            <div className="text-sm text-gray-600">誤答数</div>
                        </div>
                    </div>

                    <h2 className="font-semibold mb-2 text-gray-800">間違えた問題</h2>
                    <div className="space-y-3 mb-6">
                        {incorrects.length > 0 ? (
                            incorrects.map((item, idx) => (
                                <div key={idx} className="border rounded-xl p-3 bg-white/50">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span
                                            className="font-semibold text-lg text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: renderMath(item.word) }}
                                        />
                                        <span className="text-sm text-gray-500">({item.word_number})</span>
                                    </div>
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        <span className="font-medium text-gray-600">答え: </span>
                                        <span dangerouslySetInnerHTML={{ __html: renderMath(item.meaning) }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center py-4">ありません（全問正解！）</div>
                        )}
                    </div>

                    {/* スマホ用: 縦並びボタン */}
                    <div className="block md:hidden space-y-3">
                        {!isLoggedIn && (
                            <>
                                <div className="text-center text-sm text-blue-600 whitespace-pre-line mb-2">
                                    {message}
                                </div>
                                <button
                                    onClick={() => router.push('/login?mode=signup&redirect=/mathtap/home')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-lg font-semibold"
                                >
                                    アカウント登録
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => router.push('/mathtap/test-setup')}
                            className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 px-4 rounded-xl text-lg"
                        >
                            新しいテスト
                        </button>
                        {isLoggedIn && (
                            <button
                                onClick={() => router.push('/mathtap/home')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl text-lg"
                            >
                                ホーム画面に戻る
                            </button>
                        )}
                    </div>

                    {/* タブレット・PC用: 横並びボタン */}
                    <div className="hidden md:block">
                        {!isLoggedIn && (
                            <div className="text-center text-sm text-blue-600 whitespace-pre-line mb-3">
                                {message}
                            </div>
                        )}
                        <div className="flex justify-center space-x-4">
                            {!isLoggedIn && (
                                <button
                                    onClick={() => router.push('/login?mode=signup&redirect=/mathtap/home')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                                >
                                    アカウント登録
                                </button>
                            )}
                            <button
                                onClick={() => router.push('/mathtap/test-setup')}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl"
                            >
                                新しいテスト
                            </button>
                            {isLoggedIn && (
                                <button
                                    onClick={() => router.push('/mathtap/home')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl"
                                >
                                    ホーム画面に戻る
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Background>
        </div>
    );
}
