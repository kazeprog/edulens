'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import {
    GEMINI_MODEL_CONFIG_DEFINITIONS,
    GEMINI_MODEL_CONFIG_KEYS,
    getDefaultGeminiModelSettings,
    resolveGeminiModelSettings,
    type GeminiModelSettings,
} from '@/lib/gemini-model-config';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 統計データの型定義
interface DashboardStats {
    userCount: number;
    examCount: number;
    announcementCount: number;
    blackPostCount: number;
    pomodoroSessionCount: number;
    testResultCount: number;
    todayNewUsers: number;
    weeklyNewExams: number;
    thisMonthNewUsers: number;
    lastMonthNewUsers: number;
    referralEnabled: boolean;
    dau: number;
    wau: number;
    mau: number;
    engagement?: DashboardEngagementStats;
    naruhodoUsage?: NaruhodoStats;
}

// 月別登録データの型
interface MonthlyRegistration {
    month: string;
    count: number;
}

// 日別登録データの型
interface DailyRegistration {
    date: string;
    count: number;
}

type ChartViewMode = 'daily' | 'monthly';

// アクティブユーザー推移の型
interface ActiveUserTrend {
    trend_date: string;
    dau: number;
    wau: number;
    mau: number;
}

// エンゲージメント指標の型
interface DashboardEngagementStats {
    retention_rate_7d: number;
    first_test_rate: number;
    heavy_user_rate: number;
}

// ナルホドレンズ利用状況
interface NaruhodoStats {
    today: number;
    total: number;
}



// アクティビティの型定義
interface RecentActivity {
    type: 'user' | 'exam' | 'post';
    title: string;
    subtitle: string;
    timestamp: string;
}

// 日付計算ヘルパー
const getStartOfToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
};

const getStartOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    now.setDate(diff);
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        userCount: 0,
        examCount: 0,
        announcementCount: 0,
        blackPostCount: 0,
        pomodoroSessionCount: 0,
        testResultCount: 0,
        todayNewUsers: 0,
        weeklyNewExams: 0,
        thisMonthNewUsers: 0,
        lastMonthNewUsers: 0,
        referralEnabled: true,
        dau: 0,
        wau: 0,
        mau: 0,
    });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [monthlyRegistrations, setMonthlyRegistrations] = useState<MonthlyRegistration[]>([]);
    const [dailyRegistrations, setDailyRegistrations] = useState<DailyRegistration[]>([]);
    const [activeUserTrends, setActiveUserTrends] = useState<ActiveUserTrend[]>([]);
    const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('monthly');
    const [loading, setLoading] = useState(true);
    const [geminiModelSettings, setGeminiModelSettings] = useState<GeminiModelSettings>(getDefaultGeminiModelSettings());
    const [isSavingGeminiSettings, setIsSavingGeminiSettings] = useState(false);

    // 月初を取得するヘルパー
    const getStartOfMonth = (date: Date) => {
        const d = new Date(date);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
    };

    const getStartOfLastMonth = () => {
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        return now.toISOString();
    };

    const getEndOfLastMonth = () => {
        const now = new Date();
        now.setDate(0); // 先月の最終日
        now.setHours(23, 59, 59, 999);
        return now.toISOString();
    };

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);

            // 並列でデータ取得
            const [
                { count: userCount },
                { count: examCount },
                { count: announcementCount },
                { count: blackPostCount },
                { count: pomodoroSessionCount },
                { count: testResultCount },
                { count: todayNewUsers },
                { count: weeklyNewExams },
                { count: thisMonthNewUsers },
                { count: lastMonthNewUsers },
                { data: recentUsers },
                { data: recentExams },
                { data: recentPosts },
                { data: allProfiles },
                { data: configRows },
                { data: dauCount },
                { data: wauCount },
                { data: mauCount },
                { data: trendData },
                { data: engagementStats },
                { count: naruhodoToday },
                { count: naruhodoTotal },
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('exam_schedules').select('*', { count: 'exact', head: true }),
                supabase.from('announcements').select('*', { count: 'exact', head: true }),
                supabase.from('black_posts').select('*', { count: 'exact', head: true }),
                supabase.from('pomodoro_sessions').select('*', { count: 'exact', head: true }),
                supabase.from('results').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfToday()),
                supabase.from('exam_schedules').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfWeek()),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfMonth(new Date())),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfLastMonth()).lte('created_at', getEndOfLastMonth()),
                supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(15),
                supabase.from('exam_schedules').select('id, exam_name, session_name, created_at').order('created_at', { ascending: false }).limit(15),
                supabase.from('black_posts').select('id, nickname, content, created_at').order('created_at', { ascending: false }).limit(15),
                supabase.from('profiles').select('created_at').order('created_at', { ascending: false }),
                supabase.from('app_config').select('key, value').in('key', ['referral_campaign_enabled', ...GEMINI_MODEL_CONFIG_KEYS]),
                supabase.rpc('get_active_test_user_count', { p_days: 1 }),
                supabase.rpc('get_active_test_user_count', { p_days: 7 }),
                supabase.rpc('get_active_test_user_count', { p_days: 30 }),
                supabase.rpc('get_active_user_trends', { p_days: 30 }),
                supabase.rpc('get_dashboard_engagement_stats'),
                supabase.from('naruhodo_usage_logs').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfToday()),
                supabase.from('naruhodo_usage_logs').select('*', { count: 'exact', head: true }),
            ]);
            // 月別登録データを集計（過去12ヶ月）
            if (allProfiles) {
                const monthlyData: { [key: string]: number } = {};
                const dailyData: { [key: string]: number } = {};
                const today = new Date();

                // 過去12ヶ月分を初期化
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(today);
                    d.setMonth(d.getMonth() - i);
                    const monthStr = `${d.getFullYear()}/${d.getMonth() + 1}`;
                    monthlyData[monthStr] = 0;
                }

                // 過去30日分を初期化
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
                    dailyData[dateStr] = 0;
                }

                // 登録日/月をカウント
                allProfiles.forEach((p: { created_at: string }) => {
                    const d = new Date(p.created_at);

                    // 月別
                    const monthStr = `${d.getFullYear()}/${d.getMonth() + 1}`;
                    if (monthlyData[monthStr] !== undefined) {
                        monthlyData[monthStr]++;
                    }

                    // 日別（過去30日以内）
                    const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays < 30 && diffDays >= 0) {
                        const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
                        if (dailyData[dateStr] !== undefined) {
                            dailyData[dateStr]++;
                        }
                    }
                });

                setMonthlyRegistrations(Object.entries(monthlyData).map(([month, count]) => ({ month, count })));
                setDailyRegistrations(Object.entries(dailyData).map(([date, count]) => ({ date, count })));
            }

            const referralConfig = configRows?.find((row) => row.key === 'referral_campaign_enabled');
            const resolvedGeminiModelSettings = resolveGeminiModelSettings(configRows);

            setStats({
                userCount: userCount || 0,
                examCount: examCount || 0,
                announcementCount: announcementCount || 0,
                blackPostCount: blackPostCount || 0,
                pomodoroSessionCount: pomodoroSessionCount || 0,
                testResultCount: testResultCount || 0,
                todayNewUsers: todayNewUsers || 0,
                weeklyNewExams: weeklyNewExams || 0,
                thisMonthNewUsers: thisMonthNewUsers || 0,
                lastMonthNewUsers: lastMonthNewUsers || 0,
                referralEnabled: referralConfig ? (referralConfig.value as boolean) : true,
                dau: dauCount || 0,
                wau: wauCount || 0,
                mau: mauCount || 0,
                engagement: engagementStats || undefined,
                naruhodoUsage: {
                    today: naruhodoToday || 0,
                    total: naruhodoTotal || 0
                }
            });
            setGeminiModelSettings(resolvedGeminiModelSettings);

            if (trendData) {
                setActiveUserTrends(trendData);
            }

            // アクティビティをマージ&ソート
            const activities: RecentActivity[] = [];

            recentUsers?.forEach((u) => {
                activities.push({
                    type: 'user',
                    title: u.full_name || '新規ユーザー',
                    subtitle: 'ユーザー登録',
                    timestamp: u.created_at,
                });
            });

            recentExams?.forEach((e) => {
                activities.push({
                    type: 'exam',
                    title: e.session_name || e.exam_name,
                    subtitle: '試験追加',
                    timestamp: e.created_at,
                });
            });

            recentPosts?.forEach((p) => {
                activities.push({
                    type: 'post',
                    title: p.nickname || '匿名',
                    subtitle: p.content?.substring(0, 30) + (p.content?.length > 30 ? '...' : ''),
                    timestamp: p.created_at,
                });
            });

            // 日時でソート
            activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setRecentActivity(activities.slice(0, 20));

            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes}`;
    };

    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'user':
                return '👤';
            case 'exam':
                return '📝';
            case 'post':
                return '💬';
        }
    };

    const getActivityColor = () => {
        // 全てニュートラルな色に統一
        return 'bg-slate-100 text-slate-600';
    };

    const saveGeminiModelSettings = async () => {
        const defaultSettings = getDefaultGeminiModelSettings();
        const sanitizedSettings = GEMINI_MODEL_CONFIG_DEFINITIONS.reduce<GeminiModelSettings>((acc, definition) => {
            acc[definition.key] = geminiModelSettings[definition.key].trim() || defaultSettings[definition.key];
            return acc;
        }, getDefaultGeminiModelSettings());

        setGeminiModelSettings(sanitizedSettings);
        setIsSavingGeminiSettings(true);

        try {
            const { error } = await supabase
                .from('app_config')
                .upsert(
                    GEMINI_MODEL_CONFIG_DEFINITIONS.map((definition) => ({
                        key: definition.key,
                        value: sanitizedSettings[definition.key],
                    })),
                );

            if (error) throw error;
        } catch (err) {
            console.error('Failed to update Gemini model settings', err);
            alert('Gemini settings could not be updated.');
        } finally {
            setIsSavingGeminiSettings(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">ダッシュボード</h2>

            {/* メイン統計カード */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">総ユーザー数</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.userCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">登録試験数</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.examCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">お知らせ数</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.announcementCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">BlackLens投稿</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.blackPostCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">単語テスト数</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.testResultCount}</p>
                </div>
            </div>

            {/* アクティブユーザー統計 */}
            <h3 className="text-lg font-bold mb-4 text-slate-800">📈 アクティブユーザー（単語テスト）</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1 truncate">DAU (24時間内)</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.dau}人</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1 truncate">WAU (7日間内)</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.wau}人</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1 truncate">MAU (30日間内)</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.mau}人</p>
                </div>
            </div>

            {/* アクティブユーザー推移グラフ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">📈 アクティブユーザー推移</h3>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                            <span className="text-slate-600">MAU</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span className="text-slate-600">WAU</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-slate-600">DAU</span>
                        </div>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={activeUserTrends}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <XAxis
                                dataKey="trend_date"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    const d = new Date(value);
                                    return `${d.getMonth() + 1}/${d.getDate()}`;
                                }}
                            />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelFormatter={(value) => {
                                    const d = new Date(value);
                                    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                itemSorter={(item: any) => {
                                    const order: { [key: string]: number } = { 'MAU': 0, 'WAU': 1, 'DAU': 2 };
                                    return order[item.name] ?? 99;
                                }}
                            />
                            <Line type="monotone" dataKey="mau" name="MAU" stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="wau" name="WAU" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="dau" name="DAU" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">過去30日間のアクティブユーザー推移</p>
            </div>

            {/* エンゲージメント指標 */}
            <h3 className="text-lg font-bold mb-4 text-slate-800">📊 エンゲージメント詳細</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">7日後継続率</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-emerald-600">
                            {stats.engagement?.retention_rate_7d != null ? `${stats.engagement.retention_rate_7d.toFixed(1)}%` : '-'}
                        </p>
                        <span className="text-xs text-slate-400">登録7日後に利用</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">初回テスト完了率</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-blue-600">
                            {stats.engagement?.first_test_rate != null ? `${stats.engagement.first_test_rate.toFixed(1)}%` : '-'}
                        </p>
                        <span className="text-xs text-slate-400">最低1回完了</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">ヘビーユーザー率</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-indigo-600">
                            {stats.engagement?.heavy_user_rate != null ? `${stats.engagement.heavy_user_rate.toFixed(1)}%` : '-'}
                        </p>
                        <span className="text-xs text-slate-400">10回以上完了</span>
                    </div>
                </div>
            </div>

            {/* ナルホドレンズ利用状況 */}{/* ナルホドレンズ利用状況 */}
            <h3 className="text-lg font-bold mb-4 text-slate-800">🔍 ナルホドレンズ利用状況</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">今日の利用数</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.naruhodoUsage?.today ?? '-'}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">総利用数</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.naruhodoUsage?.total ?? '-'}</p>
                </div>
            </div>



            {/* サブ統計カード */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">ポモドーロ完了</p>
                    <p className="text-xl font-bold text-slate-700">{stats.pomodoroSessionCount}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">本日の新規登録</p>
                    <p className="text-xl font-bold text-slate-700">{stats.todayNewUsers}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">今週追加の試験</p>
                    <p className="text-xl font-bold text-slate-700">{stats.weeklyNewExams}</p>
                </div>
            </div>

            {/* 登録者推移 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">📈 登録者推移</h3>

                {/* 月次統計 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium">今月の登録者</p>
                        <p className="text-xl font-bold text-blue-700">{stats.thisMonthNewUsers}人</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">先月の登録者</p>
                        <p className="text-xl font-bold text-slate-700">{stats.lastMonthNewUsers}人</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${stats.lastMonthNewUsers > 0
                        ? (stats.thisMonthNewUsers >= stats.lastMonthNewUsers
                            ? 'bg-green-50 border-green-100'
                            : 'bg-red-50 border-red-100')
                        : 'bg-slate-50 border-slate-200'
                        }`}>
                        <p className={`text-xs font-medium ${stats.lastMonthNewUsers > 0
                            ? (stats.thisMonthNewUsers >= stats.lastMonthNewUsers
                                ? 'text-green-600'
                                : 'text-red-600')
                            : 'text-slate-500'
                            }`}>月次増加率</p>
                        <p className={`text-xl font-bold ${stats.lastMonthNewUsers > 0
                            ? (stats.thisMonthNewUsers >= stats.lastMonthNewUsers
                                ? 'text-green-700'
                                : 'text-red-700')
                            : 'text-slate-700'
                            }`}>
                            {stats.lastMonthNewUsers > 0
                                ? `${stats.thisMonthNewUsers >= stats.lastMonthNewUsers ? '+' : ''}${(((stats.thisMonthNewUsers - stats.lastMonthNewUsers) / stats.lastMonthNewUsers) * 100).toFixed(1)}%`
                                : '-'}
                        </p>
                    </div>
                </div>

                {/* 表示切り替えボタン */}
                <div className="flex justify-end mb-4">
                    <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50">
                        <button
                            onClick={() => setChartViewMode('daily')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${chartViewMode === 'daily'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            日別 (30日)
                        </button>
                        <button
                            onClick={() => setChartViewMode('monthly')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${chartViewMode === 'monthly'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            月別 (12ヶ月)
                        </button>
                    </div>
                </div>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartViewMode === 'monthly' ? monthlyRegistrations : dailyRegistrations}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <XAxis
                                dataKey={chartViewMode === 'monthly' ? 'month' : 'date'}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                interval={chartViewMode === 'daily' ? 4 : 0}
                            />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`${value ?? 0}人`, '新規登録']}
                                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                            />
                            <Line type="linear" dataKey="count" name="新規登録" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">
                    {chartViewMode === 'monthly' ? '過去12ヶ月の月別登録者数' : '過去30日間の日別登録者数'}
                </p>
            </div>


            {/* クイックメニュー */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">クイックメニュー</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Link href="/admin/exams" prefetch={false} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm">
                        📝 試験日程管理
                    </Link>
                    <Link href="/admin/announcements" prefetch={false} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm">
                        📢 お知らせ配信
                    </Link>
                    <Link href="/admin/affiliates" prefetch={false} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm">
                        💰 アフィリエイト管理
                    </Link>
                    <Link href="/admin/blacklens" prefetch={false} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm">
                        💬 BlackLens管理
                    </Link>
                    <Link href="/admin/tests" prefetch={false} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm">
                        📊 テスト履歴
                    </Link>
                    <button
                        onClick={() => document.getElementById('referral-settings')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm"
                    >
                        🎁 招待キャンペーン
                    </button>
                    <Link href="/countdown" prefetch={false} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition text-center font-bold text-sm" target="_blank">
                        🔗 サイトを見る
                    </Link>
                </div>
            </div>

            {/* システム設定 */}
            <div id="referral-settings" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">⚙️ システム設定</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-bold text-slate-800">友達招待キャンペーン</p>
                        <p className="text-xs text-slate-500">キャンペーンを有効にすると、ユーザーは招待コードを発行・入力できます。</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={stats.referralEnabled}
                            onChange={async (e) => {
                                const newValue = e.target.checked;
                                // Optimistic update
                                setStats(prev => ({ ...prev, referralEnabled: newValue }));
                                try {
                                    const { error } = await supabase
                                        .from('app_config')
                                        .upsert({ key: 'referral_campaign_enabled', value: newValue });

                                    if (error) throw error;
                                } catch (err) {
                                    console.error('Failed to update config', err);
                                    setStats(prev => ({ ...prev, referralEnabled: !newValue }));
                                    alert('設定の更新に失敗しました');
                                }
                            }}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 p-4">
                    <div className="mb-4">
                        <p className="font-bold text-slate-800">Gemini モデル設定</p>
                        <p className="text-xs text-slate-500">ナルホドレンズ、英作文採点、詳細分析、管理画面の URL 検索で使うモデルをここでまとめて変更できます。</p>
                    </div>
                    <div className="space-y-4">
                        {GEMINI_MODEL_CONFIG_DEFINITIONS.map((definition) => (
                            <div key={definition.key}>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{definition.label}</label>
                                <p className="text-xs text-slate-500 mb-2">{definition.description}</p>
                                <input
                                    type="text"
                                    value={geminiModelSettings[definition.key]}
                                    onChange={(e) => {
                                        const nextValue = e.target.value;
                                        setGeminiModelSettings((prev) => ({
                                            ...prev,
                                            [definition.key]: nextValue,
                                        }));
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="gemini-2.5-flash"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={saveGeminiModelSettings}
                            disabled={isSavingGeminiSettings}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSavingGeminiSettings ? '保存中...' : 'Gemini設定を保存'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 最新アクティビティ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800">最新アクティビティ</h3>
                {recentActivity.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">アクティビティがありません</p>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor()}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{activity.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{activity.subtitle}</p>
                                </div>
                                <div className="text-xs text-slate-400 whitespace-nowrap">
                                    {formatDate(activity.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
