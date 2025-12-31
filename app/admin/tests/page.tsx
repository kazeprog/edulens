'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TestResult {
    id: string;
    user_id: string | null;
    selected_text: string | null;
    start_num: number | null;
    end_num: number | null;
    total: number;
    correct: number;
    incorrect_count: number;
    created_at: string;
}

interface UserProfile {
    id: string;
    full_name: string | null;
}

export default function TestHistoryPage() {
    const [results, setResults] = useState<TestResult[]>([]);
    const [profiles, setProfiles] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTextbook, setSelectedTextbook] = useState('all');
    const [textbooks, setTextbooks] = useState<string[]>([]);

    const fetchResults = async () => {
        setLoading(true);

        // テスト結果とプロファイルを並列取得
        const [resultsRes, profilesRes] = await Promise.all([
            supabase
                .from('results')
                .select('*')
                .order('created_at', { ascending: false }),
            supabase
                .from('profiles')
                .select('id, full_name')
        ]);

        if (resultsRes.error) {
            console.error(resultsRes.error);
        } else {
            setResults(resultsRes.data || []);

            // ユニークな単語帳リストを抽出
            const uniqueTextbooks = [...new Set(
                (resultsRes.data || []).map(r => r.selected_text).filter(Boolean)
            )] as string[];
            setTextbooks(uniqueTextbooks);
        }

        // プロファイルをMapに変換（高速ルックアップ用）
        if (profilesRes.data) {
            const profileMap = new Map<string, string>();
            profilesRes.data.forEach((p: UserProfile) => {
                if (p.full_name) {
                    profileMap.set(p.id, p.full_name);
                }
            });
            setProfiles(profileMap);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const h = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${y}/${m}/${d} ${h}:${min}`;
    };

    // ユーザー表示名を取得
    const getUserDisplayName = (userId: string) => {
        const name = profiles.get(userId);
        return name || userId.substring(0, 8) + '...';
    };

    // フィルタリング
    const filteredResults = results.filter(result => {
        const userId = result.user_id || '';
        const userName = (result.user_id ? profiles.get(result.user_id) : '') || '';

        const matchesSearch = searchQuery === '' ||
            (result.selected_text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            userId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTextbook = selectedTextbook === 'all' || result.selected_text === selectedTextbook;
        return matchesSearch && matchesTextbook;
    });

    // 統計計算
    const totalTests = filteredResults.length;
    const totalQuestions = filteredResults.reduce((sum, r) => sum + r.total, 0);
    const totalCorrect = filteredResults.reduce((sum, r) => sum + r.correct, 0);
    const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // ユニークユーザー数
    const uniqueUserIds = new Set(filteredResults.map(r => r.user_id).filter(Boolean));
    const uniqueUserCount = uniqueUserIds.size;

    // 前日比データの計算
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 今日のデータ
    const todayResults = filteredResults.filter(r => r.created_at.startsWith(todayStr));
    const todayTests = todayResults.length;
    const todayQuestions = todayResults.reduce((sum, r) => sum + r.total, 0);
    const todayCorrect = todayResults.reduce((sum, r) => sum + r.correct, 0);
    // 今日の新規ユニークユーザー（今日初めて実施したユーザーではなく、単純に今日実施したユニーク数）
    const todayUniqueUsers = new Set(todayResults.map(r => r.user_id).filter(Boolean)).size;

    // 昨日のデータ（正答率比較用）
    const yesterdayResults = filteredResults.filter(r => r.created_at.startsWith(yesterdayStr));
    const yesterdayQuestions = yesterdayResults.reduce((sum, r) => sum + r.total, 0);
    const yesterdayCorrect = yesterdayResults.reduce((sum, r) => sum + r.correct, 0);

    // 平均正答率の比較 (今日の平均 - 昨日の平均)
    // もし今日データがない場合は0、昨日データがない場合は今日の平均をそのまま表示(比較対象なし)または0
    const todayAvg = todayQuestions > 0 ? (todayCorrect / todayQuestions) * 100 : 0;
    const yesterdayAvg = yesterdayQuestions > 0 ? (yesterdayCorrect / yesterdayQuestions) * 100 : 0;
    const diffAvg = todayQuestions > 0 && yesterdayQuestions > 0 ? todayAvg - yesterdayAvg : 0;

    const renderDiff = (value: number, isPercentage: boolean = false) => {
        if (value === 0) return <span className="text-xs text-slate-400 font-medium ml-2">±0</span>;
        const isPositive = value > 0;
        const colorClass = isPositive ? 'text-green-600' : 'text-red-600'; // 増加は緑、減少は赤（ただし正答率以外は単純な増加量なので常に正）

        // カウント系は常にプラス表示（今日の増加分なので）
        // 正答率のみマイナスがあり得る

        if (isPercentage) {
            return (
                <span className={`text-xs font-bold ml-2 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{value.toFixed(1)}%
                </span>
            );
        }

        // カウント用 (今日の増加数)
        return (
            <span className="text-xs font-bold ml-2 text-green-600">
                +{value.toLocaleString()}
            </span>
        );
    };

    // グラフデータ作成 (過去14日間)
    const getChartData = () => {
        const today = new Date();
        const data = [];
        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;

            // その日のデータを抽出
            const dailyResults = results.filter(r => r.created_at.startsWith(dateStr));
            const dailyUniqueUsers = new Set(dailyResults.map(r => r.user_id).filter(Boolean)).size;

            data.push({
                date: displayDate,
                users: dailyUniqueUsers,
                tests: dailyResults.length
            });
        }
        return data;
    };

    const chartData = getChartData();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">単語テスト履歴</h2>
                <button
                    onClick={fetchResults}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    🔄 更新
                </button>
            </div>

            {/* 統計サマリー */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">テスト回数</p>
                    <div className="flex items-end">
                        <p className="text-xl font-bold text-blue-700">{totalTests}</p>
                        {renderDiff(todayTests)}
                    </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium">実施ユーザー数</p>
                    <div className="flex items-end">
                        <p className="text-xl font-bold text-indigo-700">{uniqueUserCount}</p>
                        {renderDiff(todayUniqueUsers)}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-medium">総問題数</p>
                    <div className="flex items-end">
                        <p className="text-xl font-bold text-green-700">{totalQuestions}</p>
                        {renderDiff(todayQuestions)}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium">正解数</p>
                    <div className="flex items-end">
                        <p className="text-xl font-bold text-purple-700">{totalCorrect}</p>
                        {renderDiff(todayCorrect)}
                    </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-medium">平均正答率</p>
                    <div className="flex items-end">
                        <p className="text-xl font-bold text-orange-700">{avgScore}%</p>
                        {renderDiff(diffAvg, true)}
                    </div>
                </div>
            </div>

            {/* フィルター */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">検索</label>
                        <input
                            type="text"
                            placeholder="ユーザー名や単語帳で検索..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">単語帳</label>
                        <select
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 min-w-[200px]"
                            value={selectedTextbook}
                            onChange={(e) => setSelectedTextbook(e.target.value)}
                        >
                            <option value="all">すべて</option>
                            {textbooks.map((tb) => (
                                <option key={tb} value={tb}>{tb}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* チャート */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">推移グラフ (過去14日間)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="tests" name="テスト回数" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTests)" />
                            <Area type="monotone" dataKey="users" name="実施ユーザー" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 履歴一覧 */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredResults.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
                    テスト履歴がありません
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">日時</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ユーザー</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">単語帳</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">範囲</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">結果</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">正答率</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredResults.map((result) => {
                                const scorePercent = Math.round((result.correct / result.total) * 100);
                                const isHighScore = scorePercent >= 80;
                                const hasName = profiles.has(result.user_id);

                                return (
                                    <tr key={result.id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                                            {formatDate(result.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-800">
                                            {result.user_id ? (
                                                hasName ? (
                                                    <span className="font-medium">{profiles.get(result.user_id!)}</span>
                                                ) : (
                                                    <span className="text-slate-400 font-mono text-xs">{result.user_id.substring(0, 8)}...</span>
                                                )
                                            ) : (
                                                <span className="text-slate-300 text-xs italic">Guest</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                                            {result.selected_text || '小テスト'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">
                                            {result.start_num && result.end_num
                                                ? `No.${result.start_num} - ${result.end_num}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-medium text-slate-800">
                                                {result.correct}/{result.total}
                                            </span>
                                            {result.incorrect_count > 0 && (
                                                <span className="ml-1 text-xs text-red-500">
                                                    (✗{result.incorrect_count})
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${isHighScore
                                                ? 'bg-green-100 text-green-700'
                                                : scorePercent >= 60
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {scorePercent}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
