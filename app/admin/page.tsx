'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import Link from 'next/link';

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
    });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

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
                { data: recentUsers },
                { data: recentExams },
                { data: recentPosts },
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('exam_schedules').select('*', { count: 'exact', head: true }),
                supabase.from('announcements').select('*', { count: 'exact', head: true }),
                supabase.from('black_posts').select('*', { count: 'exact', head: true }),
                supabase.from('pomodoro_sessions').select('*', { count: 'exact', head: true }),
                supabase.from('results').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfToday()),
                supabase.from('exam_schedules').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfWeek()),
                supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(15),
                supabase.from('exam_schedules').select('id, exam_name, session_name, created_at').order('created_at', { ascending: false }).limit(15),
                supabase.from('black_posts').select('id, nickname, content, created_at').order('created_at', { ascending: false }).limit(15),
            ]);

            setStats({
                userCount: userCount || 0,
                examCount: examCount || 0,
                announcementCount: announcementCount || 0,
                blackPostCount: blackPostCount || 0,
                pomodoroSessionCount: pomodoroSessionCount || 0,
                testResultCount: testResultCount || 0,
                todayNewUsers: todayNewUsers || 0,
                weeklyNewExams: weeklyNewExams || 0,
            });

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

    const getActivityColor = (type: RecentActivity['type']) => {
        switch (type) {
            case 'user':
                return 'bg-green-100 text-green-600';
            case 'exam':
                return 'bg-blue-100 text-blue-600';
            case 'post':
                return 'bg-purple-100 text-purple-600';
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
                    <p className="text-2xl font-bold text-blue-600">{stats.examCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">お知らせ数</p>
                    <p className="text-2xl font-bold text-orange-500">{stats.announcementCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">BlackLens投稿</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.blackPostCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-500 font-medium mb-1">単語テスト数</p>
                    <p className="text-2xl font-bold text-green-600">{stats.testResultCount}</p>
                </div>
            </div>

            {/* サブ統計カード */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-medium">ポモドーロ完了</p>
                    <p className="text-xl font-bold text-green-700">{stats.pomodoroSessionCount}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">本日の新規登録</p>
                    <p className="text-xl font-bold text-blue-700">{stats.todayNewUsers}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium">今週追加の試験</p>
                    <p className="text-xl font-bold text-amber-700">{stats.weeklyNewExams}</p>
                </div>
            </div>

            {/* クイックメニュー */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-800">クイックメニュー</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Link href="/admin/exams" prefetch={false} className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition text-center font-bold text-sm">
                        📝 試験日程管理
                    </Link>
                    <Link href="/admin/announcements" prefetch={false} className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 transition text-center font-bold text-sm">
                        📢 お知らせ配信
                    </Link>
                    <Link href="/admin/blacklens" prefetch={false} className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition text-center font-bold text-sm">
                        💬 BlackLens管理
                    </Link>
                    <Link href="/admin/tests" prefetch={false} className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition text-center font-bold text-sm">
                        📊 テスト履歴
                    </Link>
                    <Link href="/countdown" prefetch={false} className="bg-slate-50 text-slate-700 p-4 rounded-lg hover:bg-slate-100 transition text-center font-bold text-sm" target="_blank">
                        🔗 サイトを見る
                    </Link>
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
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
        </div>
    );
}
