'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

// ===== 型定義 =====
interface ProfileData {
    created_at: string;
    grade: string | null;
    role: string;
    test_count: number | null;
    level: number | null;
    pro_expires_at: string | null;
    referral_code: string | null;
}

interface ResultData {
    user_id: string | null;
    selected_text: string | null;
    total: number;
    correct: number;
    mode: string | null;
    created_at: string;
}

interface PomodoroData {
    user_id: string;
    work_duration: number;
    session_count: number;
    created_at: string;
}

interface NaruhodoData {
    user_id: string | null;
    guest_id: string | null;
    has_image: boolean;
    created_at: string;
}

interface ReferralData {
    referrer_id: string;
    referred_id: string;
    status: string;
    created_at: string;
}

// 期間タイプ
type PeriodType = '30d' | '90d' | '1y' | 'all';

// チャートのカラーパレット
const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

export default function AnalyticsPage() {
    const [profiles, setProfiles] = useState<ProfileData[]>([]);
    const [results, setResults] = useState<ResultData[]>([]);
    const [pomodoros, setPomodoros] = useState<PomodoroData[]>([]);
    const [naruhodoLogs, setNaruhodoLogs] = useState<NaruhodoData[]>([]);
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<PeriodType>('90d');

    useEffect(() => {
        async function fetchAllData() {
            setLoading(true);

            const [
                { data: profilesData },
                { data: resultsData },
                { data: pomodoroData },
                { data: naruhodoData },
                { data: referralData },
            ] = await Promise.all([
                supabase.from('profiles').select('created_at, grade, role, test_count, level, pro_expires_at, referral_code').order('created_at', { ascending: true }),
                supabase.from('results').select('user_id, selected_text, total, correct, mode, created_at').order('created_at', { ascending: true }),
                supabase.from('pomodoro_sessions').select('user_id, work_duration, session_count, created_at').order('created_at', { ascending: true }),
                supabase.from('naruhodo_usage_logs').select('user_id, guest_id, has_image, created_at').order('created_at', { ascending: true }),
                supabase.from('referrals').select('referrer_id, referred_id, status, created_at').order('created_at', { ascending: true }),
            ]);

            setProfiles(profilesData || []);
            setResults(resultsData || []);
            setPomodoros(pomodoroData || []);
            setNaruhodoLogs(naruhodoData || []);
            setReferrals(referralData || []);
            setLoading(false);
        }

        fetchAllData();
    }, []);

    // ===== ヘルパー関数 =====
    const getPeriodStart = (): Date | null => {
        const now = new Date();
        if (period === '30d') { now.setDate(now.getDate() - 30); return now; }
        if (period === '90d') { now.setDate(now.getDate() - 90); return now; }
        if (period === '1y') { now.setFullYear(now.getFullYear() - 1); return now; }
        return null; // all
    };

    const filterByPeriod = <T extends { created_at: string }>(data: T[]): T[] => {
        const start = getPeriodStart();
        if (!start) return data;
        return data.filter(d => new Date(d.created_at) >= start);
    };

    const formatDateShort = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    const formatMonthKey = (d: Date) => `${d.getFullYear()}/${d.getMonth() + 1}`;

    // ===== セクション1: 登録者推移 =====
    const getRegistrationData = () => {
        const filtered = filterByPeriod(profiles);
        if (filtered.length === 0) return { cumulative: [], daily: [] };

        const dailyMap: { [key: string]: number } = {};
        const allDates: string[] = [];
        const start = getPeriodStart() || new Date(filtered[0].created_at);
        const end = new Date();

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().split('T')[0];
            dailyMap[key] = 0;
            allDates.push(key);
        }

        filtered.forEach(p => {
            const key = new Date(p.created_at).toISOString().split('T')[0];
            if (dailyMap[key] !== undefined) dailyMap[key]++;
        });

        // 累計前のユーザー数（この期間以前に登録されたユーザー数）
        const priorCount = profiles.filter(p => new Date(p.created_at) < start).length;
        let cumTotal = priorCount;

        const cumulative = allDates.map(date => {
            cumTotal += dailyMap[date];
            const d = new Date(date);
            return { date: formatDateShort(d), cumulative: cumTotal };
        });

        // 日別は間引き（長い場合は7日間隔、短い場合はそのまま）
        const interval = period === '30d' ? 1 : period === '90d' ? 3 : 7;
        const daily = allDates
            .filter((_, i) => i % interval === 0 || i === allDates.length - 1)
            .map(date => {
                const d = new Date(date);
                return { date: formatDateShort(d), count: dailyMap[date] };
            });

        return { cumulative, daily };
    };

    // 前期間比の算出
    const getPeriodComparison = () => {
        const now = new Date();
        let currentStart: Date, previousStart: Date, previousEnd: Date;

        if (period === '30d') {
            currentStart = new Date(now); currentStart.setDate(now.getDate() - 30);
            previousEnd = new Date(currentStart);
            previousStart = new Date(previousEnd); previousStart.setDate(previousEnd.getDate() - 30);
        } else if (period === '90d') {
            currentStart = new Date(now); currentStart.setDate(now.getDate() - 90);
            previousEnd = new Date(currentStart);
            previousStart = new Date(previousEnd); previousStart.setDate(previousEnd.getDate() - 90);
        } else {
            currentStart = new Date(now); currentStart.setFullYear(now.getFullYear() - 1);
            previousEnd = new Date(currentStart);
            previousStart = new Date(previousEnd); previousStart.setFullYear(previousEnd.getFullYear() - 1);
        }

        const currentCount = profiles.filter(p => {
            const d = new Date(p.created_at);
            return d >= currentStart && d <= now;
        }).length;

        const previousCount = profiles.filter(p => {
            const d = new Date(p.created_at);
            return d >= previousStart && d < previousEnd;
        }).length;

        const changeRate = previousCount > 0
            ? ((currentCount - previousCount) / previousCount * 100).toFixed(1)
            : null;

        return { currentCount, previousCount, changeRate };
    };

    // ===== セクション2: コホート分析 =====
    const getCohortData = () => {
        const cohorts: { month: string; total: number; retention: number[] }[] = [];
        const periods = [7, 14, 30, 60, 90]; // 日単位

        // 過去6ヶ月のコホート
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const cohortStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const cohortEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

            const cohortUsers = profiles.filter(p => {
                const d = new Date(p.created_at);
                return d >= cohortStart && d <= cohortEnd;
            });

            if (cohortUsers.length === 0) {
                cohorts.push({ month: formatMonthKey(cohortStart), total: 0, retention: periods.map(() => 0) });
                continue;
            }

            const cohortUserDates = cohortUsers.map(u => new Date(u.created_at));
            const retention = periods.map(days => {
                const retainedCount = cohortUsers.filter((_, idx) => {
                    const regDate = cohortUserDates[idx];
                    const checkDate = new Date(regDate);
                    checkDate.setDate(checkDate.getDate() + days);

                    // checkDateが未来なら計算不能
                    if (checkDate > now) return false;

                    return results.some(r => {
                        if (!r.user_id) return false;
                        const rDate = new Date(r.created_at);
                        return rDate >= checkDate;
                    });
                }).length;

                // checkDateが未来の場合はN/A (-1)
                const earliestReg = cohortUserDates[0];
                const checkEnd = new Date(earliestReg);
                checkEnd.setDate(checkEnd.getDate() + days);
                if (checkEnd > now) return -1;

                return cohortUsers.length > 0 ? Math.round((retainedCount / cohortUsers.length) * 100) : 0;
            });

            cohorts.push({ month: formatMonthKey(cohortStart), total: cohortUsers.length, retention });
        }

        return { cohorts, periodLabels: ['1週間後', '2週間後', '1ヶ月後', '2ヶ月後', '3ヶ月後'] };
    };

    // ===== セクション3: ユーザー属性分析 =====
    const getUserAttributes = () => {
        // 学年別
        const gradeMap: { [key: string]: number } = {};
        profiles.forEach(p => {
            const grade = p.grade || '未設定';
            gradeMap[grade] = (gradeMap[grade] || 0) + 1;
        });
        const gradeData = Object.entries(gradeMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // ロール別
        const roleMap: { [key: string]: number } = {};
        profiles.forEach(p => {
            roleMap[p.role] = (roleMap[p.role] || 0) + 1;
        });
        const roleData = Object.entries(roleMap).map(([name, value]) => ({ name, value }));

        // Pro率
        const now = new Date();
        const proCount = profiles.filter(p => p.pro_expires_at && new Date(p.pro_expires_at) > now).length;
        const proRate = profiles.length > 0 ? (proCount / profiles.length * 100).toFixed(1) : '0';

        // レベル分布
        const levelBuckets: { [key: string]: number } = {
            'Lv.1': 0, 'Lv.2-5': 0, 'Lv.6-10': 0, 'Lv.11-20': 0, 'Lv.21+': 0
        };
        profiles.forEach(p => {
            const lv = p.level || 1;
            if (lv === 1) levelBuckets['Lv.1']++;
            else if (lv <= 5) levelBuckets['Lv.2-5']++;
            else if (lv <= 10) levelBuckets['Lv.6-10']++;
            else if (lv <= 20) levelBuckets['Lv.11-20']++;
            else levelBuckets['Lv.21+']++;
        });
        const levelData = Object.entries(levelBuckets).map(([name, value]) => ({ name, value }));

        return { gradeData, roleData, proCount, proRate, levelData };
    };

    // ===== セクション4: テスト利用分析 =====
    const getTestAnalysis = () => {
        // テスト回数別分布
        const buckets: { [key: string]: number } = {
            '0回': 0, '1-5回': 0, '6-10回': 0, '11-50回': 0, '51-100回': 0, '101回以上': 0
        };
        profiles.forEach(p => {
            const tc = p.test_count || 0;
            if (tc === 0) buckets['0回']++;
            else if (tc <= 5) buckets['1-5回']++;
            else if (tc <= 10) buckets['6-10回']++;
            else if (tc <= 50) buckets['11-50回']++;
            else if (tc <= 100) buckets['51-100回']++;
            else buckets['101回以上']++;
        });
        const testDistribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));

        // モード別利用率
        const modeMap: { [key: string]: number } = {};
        results.forEach(r => {
            const mode = r.mode || 'word-meaning';
            const label = mode === 'word-meaning' ? '単語→意味' : '意味→単語';
            modeMap[label] = (modeMap[label] || 0) + 1;
        });
        const modeData = Object.entries(modeMap).map(([name, value]) => ({ name, value }));

        // 平均正答率推移（過去30日）
        const now = new Date();
        const accuracyTrend: { date: string; rate: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayResults = results.filter(r => r.created_at.startsWith(dateStr));
            const totalQ = dayResults.reduce((s, r) => s + r.total, 0);
            const totalC = dayResults.reduce((s, r) => s + r.correct, 0);
            accuracyTrend.push({
                date: formatDateShort(d),
                rate: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
            });
        }

        // 平均問題数
        const avgQuestions = results.length > 0
            ? (results.reduce((s, r) => s + r.total, 0) / results.length).toFixed(1)
            : '0';

        return { testDistribution, modeData, accuracyTrend, avgQuestions };
    };

    // ===== セクション5: 単語帳別利用状況 =====
    const getTextbookAnalysis = () => {
        const textbookMap: { [key: string]: { tests: number; users: Set<string> } } = {};
        results.forEach(r => {
            const tb = r.selected_text || '小テスト';
            if (!textbookMap[tb]) textbookMap[tb] = { tests: 0, users: new Set() };
            textbookMap[tb].tests++;
            if (r.user_id) textbookMap[tb].users.add(r.user_id);
        });

        const textbookData = Object.entries(textbookMap)
            .map(([name, { tests, users }]) => ({ name: name.length > 15 ? name.substring(0, 15) + '...' : name, fullName: name, tests, users: users.size }))
            .sort((a, b) => b.tests - a.tests)
            .slice(0, 10);

        return textbookData;
    };

    // ===== セクション6: ポモドーロ分析 =====
    const getPomodoroAnalysis = () => {
        const uniqueUsers = new Set(pomodoros.map(p => p.user_id)).size;
        const usageRate = profiles.length > 0 ? (uniqueUsers / profiles.length * 100).toFixed(1) : '0';
        const totalMinutes = pomodoros.reduce((s, p) => s + p.work_duration * p.session_count, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        // 日別推移（過去30日）
        const now = new Date();
        const dailyTrend: { date: string; count: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = pomodoros.filter(p => p.created_at.startsWith(dateStr)).length;
            dailyTrend.push({ date: formatDateShort(d), count });
        }

        return { uniqueUsers, usageRate, totalHours, dailyTrend };
    };

    // ===== セクション7: ナルホドレンズ分析 =====
    const getNaruhodoAnalysis = () => {
        // 日別推移（過去30日）
        const now = new Date();
        const dailyTrend: { date: string; count: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = naruhodoLogs.filter(l => l.created_at.startsWith(dateStr)).length;
            dailyTrend.push({ date: formatDateShort(d), count });
        }

        // 画像付き率
        const withImage = naruhodoLogs.filter(l => l.has_image).length;
        const imageRate = naruhodoLogs.length > 0 ? (withImage / naruhodoLogs.length * 100).toFixed(1) : '0';

        // 登録ユーザー vs ゲスト
        const registeredCount = naruhodoLogs.filter(l => l.user_id).length;
        const guestCount = naruhodoLogs.length - registeredCount;
        const userVsGuest = [
            { name: '登録ユーザー', value: registeredCount },
            { name: 'ゲスト', value: guestCount },
        ];

        return { dailyTrend, imageRate, withImage, userVsGuest, total: naruhodoLogs.length };
    };

    // ===== セクション8: 招待キャンペーン分析 =====
    const getReferralAnalysis = () => {
        const codesIssued = profiles.filter(p => p.referral_code).length;
        const totalReferrals = referrals.length;
        const completedReferrals = referrals.filter(r => r.status === 'completed').length;
        const conversionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals * 100).toFixed(1) : '0';

        // Pro獲得数
        const now = new Date();
        const proFromReferral = profiles.filter(p => p.pro_expires_at && new Date(p.pro_expires_at) > now && p.referral_code).length;

        return { codesIssued, totalReferrals, completedReferrals, conversionRate, proFromReferral };
    };

    // ===== ローディング =====
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const registrationData = getRegistrationData();
    const comparison = getPeriodComparison();
    const cohortData = getCohortData();
    const userAttrs = getUserAttributes();
    const testAnalysis = getTestAnalysis();
    const textbookData = getTextbookAnalysis();
    const pomodoroAnalysis = getPomodoroAnalysis();
    const naruhodoAnalysis = getNaruhodoAnalysis();
    const referralAnalysis = getReferralAnalysis();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">📊 データ分析</h2>
                <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50">
                    {[
                        { value: '30d' as PeriodType, label: '30日' },
                        { value: '90d' as PeriodType, label: '90日' },
                        { value: '1y' as PeriodType, label: '1年' },
                        { value: 'all' as PeriodType, label: '全期間' },
                    ].map(p => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${period === p.value
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== セクション1: 登録者推移 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">📈 登録者推移</h3>

                {/* 前期間比サマリー */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium">期間内の新規登録</p>
                        <p className="text-2xl font-bold text-blue-700">{comparison.currentCount}人</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">前期間の登録</p>
                        <p className="text-2xl font-bold text-slate-700">{comparison.previousCount}人</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${comparison.changeRate !== null
                        ? (parseFloat(comparison.changeRate) >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100')
                        : 'bg-slate-50 border-slate-200'
                        }`}>
                        <p className={`text-xs font-medium ${comparison.changeRate !== null
                            ? (parseFloat(comparison.changeRate) >= 0 ? 'text-green-600' : 'text-red-600')
                            : 'text-slate-500'
                            }`}>増減率</p>
                        <p className={`text-2xl font-bold ${comparison.changeRate !== null
                            ? (parseFloat(comparison.changeRate) >= 0 ? 'text-green-700' : 'text-red-700')
                            : 'text-slate-700'
                            }`}>
                            {comparison.changeRate !== null ? `${parseFloat(comparison.changeRate) >= 0 ? '+' : ''}${comparison.changeRate}%` : '-'}
                        </p>
                    </div>
                </div>

                {/* 累計推移グラフ */}
                <p className="text-sm font-semibold text-slate-600 mb-2">累計ユーザー数</p>
                <div className="h-[250px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={registrationData.cumulative} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} interval={Math.max(Math.floor(registrationData.cumulative.length / 10), 1)} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${value}人`, '累計']} />
                            <Area type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCum)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* 日別新規登録グラフ */}
                <p className="text-sm font-semibold text-slate-600 mb-2">新規登録者数</p>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={registrationData.daily} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} interval={Math.max(Math.floor(registrationData.daily.length / 10), 1)} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${value}人`, '新規登録']} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ===== セクション2: コホート分析 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">📊 コホート分析（継続率）</h3>
                <p className="text-xs text-slate-500 mb-4">各月に登録したユーザーが、登録後の各期間においてテストを実施した割合</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">登録月</th>
                                <th className="text-center py-3 px-4 font-semibold text-slate-700">登録数</th>
                                {cohortData.periodLabels.map(label => (
                                    <th key={label} className="text-center py-3 px-4 font-semibold text-slate-700">{label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cohortData.cohorts.map(cohort => (
                                <tr key={cohort.month} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="py-3 px-4 font-medium text-slate-800">{cohort.month}</td>
                                    <td className="py-3 px-4 text-center text-slate-600">{cohort.total}人</td>
                                    {cohort.retention.map((rate, i) => (
                                        <td key={i} className="py-3 px-4 text-center">
                                            {rate === -1 ? (
                                                <span className="text-slate-300">-</span>
                                            ) : (
                                                <span
                                                    className="inline-block px-2 py-1 rounded text-xs font-bold"
                                                    style={{
                                                        backgroundColor: rate >= 50 ? '#dcfce7' : rate >= 30 ? '#fef9c3' : rate >= 10 ? '#fee2e2' : '#f1f5f9',
                                                        color: rate >= 50 ? '#166534' : rate >= 30 ? '#854d0e' : rate >= 10 ? '#991b1b' : '#94a3b8',
                                                    }}
                                                >
                                                    {rate}%
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== セクション3: ユーザー属性分析 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">👥 ユーザー属性分析</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 学年別分布 */}
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-3">学年別ユーザー分布</p>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userAttrs.gradeData} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={60} />
                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value) => [`${value}人`]} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ロール別分布 */}
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-3">ロール別分布</p>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={userAttrs.roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false} fontSize={12}>
                                        {userAttrs.roleData.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}人`]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Proユーザー & レベル分布 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium mb-1">Proユーザー</p>
                        <p className="text-2xl font-bold text-indigo-600">{userAttrs.proCount}人 <span className="text-sm font-normal text-slate-500">({userAttrs.proRate}%)</span></p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-3">レベル分布</p>
                        <div className="h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userAttrs.levelData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <Tooltip formatter={(value) => [`${value}人`]} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== セクション4: テスト利用分析 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">📝 テスト利用分析</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* テスト回数別分布 */}
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-3">テスト実施回数別ユーザー分布</p>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={testAnalysis.testDistribution} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <Tooltip formatter={(value) => [`${value}人`]} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* モード別利用率 */}
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-3">テストモード別利用率</p>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={testAnalysis.modeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false} fontSize={12}>
                                        {testAnalysis.modeData.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}回`]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 平均正答率の推移 */}
                <div className="mb-4">
                    <div className="flex items-center gap-4 mb-3">
                        <p className="text-sm font-semibold text-slate-600">平均正答率推移（過去30日）</p>
                        <span className="text-xs text-slate-400">1回あたりの平均問題数: {testAnalysis.avgQuestions}問</span>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={testAnalysis.accuracyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} interval={4} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value) => [`${value}%`, '平均正答率']} />
                                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ===== セクション5: 単語帳別利用状況 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">📚 単語帳別利用状況（Top 10）</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">#</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">単語帳</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-700">テスト回数</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-700">ユニークユーザー</th>
                            </tr>
                        </thead>
                        <tbody>
                            {textbookData.map((tb, idx) => (
                                <tr key={tb.fullName} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="py-3 px-4 text-slate-400 font-medium">{idx + 1}</td>
                                    <td className="py-3 px-4 font-medium text-slate-800" title={tb.fullName}>{tb.name}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{tb.tests.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{tb.users.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== セクション6: ポモドーロ分析 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">⏱️ ポモドーロ利用分析</h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">利用ユーザー数</p>
                        <p className="text-2xl font-bold text-slate-700">{pomodoroAnalysis.uniqueUsers}人 <span className="text-sm font-normal text-slate-500">({pomodoroAnalysis.usageRate}%)</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">総学習時間</p>
                        <p className="text-2xl font-bold text-slate-700">{pomodoroAnalysis.totalHours}時間</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">総セッション数</p>
                        <p className="text-2xl font-bold text-slate-700">{pomodoros.length.toLocaleString()}</p>
                    </div>
                </div>

                <p className="text-sm font-semibold text-slate-600 mb-2">日別セッション数推移（過去30日）</p>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pomodoroAnalysis.dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} interval={4} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip formatter={(value) => [`${value}回`, 'セッション数']} />
                            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ===== セクション7: ナルホドレンズ分析 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">🔍 ナルホドレンズ利用分析</h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">総利用回数</p>
                        <p className="text-2xl font-bold text-slate-700">{naruhodoAnalysis.total.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">画像付き利用</p>
                        <p className="text-2xl font-bold text-slate-700">{naruhodoAnalysis.withImage} <span className="text-sm font-normal text-slate-500">({naruhodoAnalysis.imageRate}%)</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">登録ユーザー利用率</p>
                        <p className="text-2xl font-bold text-slate-700">
                            {naruhodoAnalysis.total > 0
                                ? `${((naruhodoAnalysis.userVsGuest[0].value / naruhodoAnalysis.total) * 100).toFixed(1)}%`
                                : '-'
                            }
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">日別利用回数推移（過去30日）</p>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={naruhodoAnalysis.dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} interval={4} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <Tooltip formatter={(value) => [`${value}回`, '利用回数']} />
                                    <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">登録ユーザー vs ゲスト</p>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={naruhodoAnalysis.userVsGuest} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false} fontSize={12}>
                                        <Cell fill="#06b6d4" />
                                        <Cell fill="#94a3b8" />
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}回`]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== セクション8: 招待キャンペーン分析 ===== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">🎁 招待キャンペーン分析</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">招待コード発行数</p>
                        <p className="text-2xl font-bold text-slate-700">{referralAnalysis.codesIssued}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">招待総数</p>
                        <p className="text-2xl font-bold text-slate-700">{referralAnalysis.totalReferrals}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <p className="text-xs text-green-600 font-medium">招待成功数</p>
                        <p className="text-2xl font-bold text-green-700">{referralAnalysis.completedReferrals}</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-xs text-indigo-600 font-medium">コンバージョン率</p>
                        <p className="text-2xl font-bold text-indigo-700">{referralAnalysis.conversionRate}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
