'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { Crown, TrendingUp, ArrowLeft, Lock, Play } from 'lucide-react';
import Link from 'next/link';

interface RankingItem {
    rank: number;
    word: string;
    meaning: string;
    mistake_count: number;
    total_tested: number;
    mistake_rate: number;
}

type CategoryTab = 'english' | 'kobun';

const FREE_VISIBLE_RANKS = 5;

export default function MistapersMistakePage() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const [rankings, setRankings] = useState<RankingItem[]>([]);
    const [activeTab, setActiveTab] = useState<CategoryTab>('english');
    const [dataLoading, setDataLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [testWordCount, setTestWordCount] = useState(10);

    const isPro = profile?.is_pro === true;

    // 学年判定
    const grade = profile?.grade || '';
    const isJunior = grade.startsWith('中');
    // 高校生以上は古文単語タブも表示
    const showKobunTab = !isJunior;

    // カテゴリをSupabaseのカテゴリ名に変換
    const getDbCategory = (tab: CategoryTab): string => {
        if (tab === 'kobun') return 'kobun';
        return isJunior ? 'junior_english' : 'senior_english';
    };

    // ランキングデータ取得
    useEffect(() => {
        const fetchRankings = async () => {
            setDataLoading(true);
            setError(null);

            const supabase = getSupabase();
            if (!supabase) {
                setError('データベース接続エラー');
                setDataLoading(false);
                return;
            }

            try {
                const dbCategory = getDbCategory(activeTab);
                const { data, error: rpcError } = await supabase.rpc('get_mistake_rankings', {
                    p_category: dbCategory,
                });

                if (rpcError) {
                    console.error('Ranking fetch error:', rpcError);
                    setError('ランキングデータの取得に失敗しました');
                } else {
                    setRankings(data || []);
                }

                // 最終更新日時取得
                const { data: updatedAt } = await supabase.rpc('get_mistake_rankings_last_updated');
                if (updatedAt) {
                    const date = new Date(updatedAt);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    setLastUpdated(`${year}年${month}月${day}日`);
                }
            } catch {
                setError('ランキングデータの取得に失敗しました');
            } finally {
                setDataLoading(false);
            }
        };

        fetchRankings();
    }, [activeTab, isJunior]);

    // 認証ロード中
    if (authLoading) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white text-xl font-medium">読み込み中...</p>
                    </div>
                </Background>
            </div>
        );
    }

    // ランキングのメダルカラー
    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-200';
            case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-200';
            case 3: return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '';
        }
    };

    // Pro制限のぼかしオーバーレイ
    const ProLockOverlay = () => (
        <div className="absolute inset-0 z-20 flex items-start justify-center pt-8" style={{ backdropFilter: 'blur(6px)' }}>
            <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro プラン限定機能</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Mistapers&apos; Mistakeは、全ユーザーのテスト結果を分析したプレミアムランキング機能です。<br />
                    Proプランに加入して、みんながミスる単語をチェックしましょう！
                </p>
                <Link
                    href="/upgrade"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.02]"
                >
                    <Crown className="w-5 h-5" />
                    Proプランを見る
                </Link>
            </div>
        </div>
    );

    // ランキング行コンポーネント
    const RankingRow = ({ item }: { item: RankingItem }) => (
        <div
            className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-50 items-center transition-colors hover:bg-gray-50 ${item.rank <= 3 ? 'bg-gradient-to-r from-red-50/50 to-transparent' : ''
                }`}
        >
            <div className="col-span-1 flex justify-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankStyle(item.rank)}`}>
                    {item.rank <= 3 ? getRankEmoji(item.rank) : item.rank}
                </span>
            </div>
            <div className="col-span-3">
                <span className="font-semibold text-gray-900 text-sm">{item.word}</span>
            </div>
            <div className="col-span-4">
                <span className="text-gray-600 text-xs leading-tight line-clamp-2">{item.meaning}</span>
            </div>
            <div className="col-span-2 text-center">
                <span className="text-red-600 font-bold text-sm">{item.mistake_count.toLocaleString()}</span>
                <span className="text-gray-400 text-xs ml-0.5">/ {item.total_tested.toLocaleString()}</span>
            </div>
            <div className="col-span-2">
                <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                            style={{ width: `${Math.min(item.mistake_rate, 100)}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-10 text-right">{item.mistake_rate}%</span>
                </div>
            </div>
        </div>
    );

    const freeRankings = rankings.filter(item => item.rank <= FREE_VISIBLE_RANKS);
    const proRankings = rankings.filter(item => item.rank > FREE_VISIBLE_RANKS);

    // ランキングからテストを作成
    const handleCreateTest = () => {
        if (rankings.length === 0) return;
        const wordsForTest = rankings.slice(0, testWordCount).map((item, index) => ({
            word_number: index + 1,
            word: item.word,
            meaning: item.meaning,
        }));
        const testData = {
            words: wordsForTest,
            selectedText: `Mistapers' Mistake (${activeTab === 'kobun' ? '古文単語' : isJunior ? '中学英単語' : '高校英単語'})`,
            startNum: null,
            endNum: null,
        };
        const dataParam = encodeURIComponent(JSON.stringify(testData));
        router.push(`/mistap/test?data=${dataParam}`);
    };

    const wordCountOptions = [10, 20, 30, 50, 100].filter(n => n <= Math.max(rankings.length, 10));

    return (
        <main className="min-h-screen bg-gray-50">
            <Background className="min-h-screen">
                <div className="max-w-3xl mx-auto px-4 pb-8" style={{ marginTop: '25px' }}>

                    {/* ヘッダー */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/mistap/home')}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            ホームに戻る
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                    Mistapers&apos; Mistake
                                </h1>
                                <p className="text-sm text-gray-500">みんながミスる単語ランキング</p>
                            </div>
                        </div>
                        {lastUpdated && (
                            <p className="text-xs text-gray-400 mt-2">最終集計: {lastUpdated}</p>
                        )}
                    </div>

                    {/* タブ切り替え */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('english')}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${activeTab === 'english'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {isJunior ? '中学英単語' : '高校英単語'}
                        </button>
                        {showKobunTab && (
                            <button
                                onClick={() => setActiveTab('kobun')}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${activeTab === 'kobun'
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                古文単語
                            </button>
                        )}
                    </div>

                    {/* テスト作成エリア */}
                    {rankings.length > 0 && (
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">上位</span>
                            <select
                                value={testWordCount}
                                onChange={(e) => setTestWordCount(Number(e.target.value))}
                                disabled={!isPro}
                                className={`bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 ${!isPro ? 'opacity-50' : ''}`}
                            >
                                {wordCountOptions.map(n => (
                                    <option key={n} value={n}>{n}語</option>
                                ))}
                            </select>
                            {isPro ? (
                                <button
                                    onClick={handleCreateTest}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                    <Play className="w-4 h-4" />
                                    テスト作成
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/upgrade')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-500 font-bold py-2.5 px-5 rounded-xl cursor-pointer hover:bg-gray-400 hover:text-gray-600 transition-all"
                                >
                                    <Lock className="w-4 h-4" />
                                    テスト作成
                                    <span className="text-xs bg-white/80 text-gray-500 px-1.5 py-0.5 rounded border border-gray-300">Pro</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* ランキングテーブル */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {dataLoading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500">ランキングを取得中...</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center">
                                <p className="text-red-500 mb-2">{error}</p>
                                <p className="text-gray-400 text-sm">しばらく経ってから再度お試しください</p>
                            </div>
                        ) : rankings.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 mb-2">ランキングデータがまだありません</p>
                                <p className="text-gray-400 text-sm">集計が完了するまでお待ちください</p>
                            </div>
                        ) : (
                            <div>
                                {/* テーブルヘッダー */}
                                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="col-span-1 text-center">#</div>
                                    <div className="col-span-3">単語</div>
                                    <div className="col-span-4">意味</div>
                                    <div className="col-span-2 text-center">ミス数</div>
                                    <div className="col-span-2 text-center">ミス率</div>
                                </div>

                                {/* TOP5: 全ユーザーに表示 */}
                                {freeRankings.map((item) => (
                                    <RankingRow key={`${item.rank}-${item.word}`} item={item} />
                                ))}

                                {/* 6位以降: Proのみ通常表示、非Proはぼかし+オーバーレイ */}
                                {proRankings.length > 0 && (
                                    <div className="relative">
                                        {!isPro && <ProLockOverlay />}
                                        <div className={!isPro ? 'pointer-events-none select-none' : ''}>
                                            {proRankings.map((item) => (
                                                <RankingRow key={`${item.rank}-${item.word}`} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 説明セクション */}
                    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                            Mistapers&apos; Mistakeとは？
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Mistapを利用するすべてのユーザーのテスト結果を集計し、最も間違いが多い単語をランキング形式で表示する機能です。
                            みんなが苦手な単語を把握して、重点的に対策しましょう！ランキングは毎日自動で更新されます。
                        </p>
                    </div>
                </div>
            </Background>
            <MistapFooter />
        </main>
    );
}
