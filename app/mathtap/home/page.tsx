'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import Background from '@/components/mistap/Background';
import ContributionGrid from '@/components/mistap/ContributionGrid';
import { updateLoginStreak } from '@/lib/mistap/loginTracker';
import { getActiveAnnouncements, Announcement } from '@/lib/mistap/announcements';
interface TestResult {
    id: string;
    user_id: string;
    selected_text: string | null;
    unit: string | null;
    total: number;
    correct: number;
    incorrect_count: number;
    created_at: string;
}

export default function MathtapHomePage() {
    const router = useRouter();
    const { user, profile: authProfile, loading: authLoading } = useAuth();

    // State
    const [profile, setProfile] = useState<{
        fullName: string;
        grade: string;
        consecutiveLoginDays: number;
        totalTestsTaken: number;
    }>({
        fullName: 'ゲスト',
        grade: '未設定',
        consecutiveLoginDays: 0,
        totalTestsTaken: 0
    });

    const [recentResults, setRecentResults] = useState<TestResult[]>([]);
    const [testCount, setTestCount] = useState(0); // This will sync with profile.totalTestsTaken but kept for now
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const isUpdatingStreakRef = useRef(false);

    // Initial Auth Profile Sync
    useEffect(() => {
        if (authProfile) {
            setProfile(prev => ({
                ...prev,
                fullName: authProfile.full_name || prev.fullName,
                grade: authProfile.grade || prev.grade,
                consecutiveLoginDays: authProfile.consecutive_login_days || prev.consecutiveLoginDays,
                totalTestsTaken: authProfile.test_count || prev.totalTestsTaken
            }));
        }
    }, [authProfile]);

    // Fetch Announcements
    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getActiveAnnouncements();
            setAnnouncements(data);
        };
        fetchAnnouncements();
    }, []);

    // Load Data & Update Streak
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace('/mathtap/test-setup');
            return;
        }

        const loadData = async () => {
            const supabase = getSupabase();
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            // 1. Update Streak
            if (!isUpdatingStreakRef.current && user) {
                isUpdatingStreakRef.current = true;
                updateLoginStreak(user.id).then(streak => {
                    if (streak) {
                        setProfile(prev => ({
                            ...prev,
                            consecutiveLoginDays: streak.consecutiveDays
                        }));
                    }
                }).finally(() => {
                    // lock for 5s
                    setTimeout(() => { isUpdatingStreakRef.current = false; }, 5000);
                });
            }

            try {
                // Mathtap Results
                const { data: results, error } = await supabase
                    .from('results')
                    .select('*')
                    .eq('user_id', user.id)
                    .like('selected_text', 'Mathtap:%')
                    .order('created_at', { ascending: false })
                    .limit(5);

                const { count, error: countError } = await supabase
                    .from('results')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .like('selected_text', 'Mathtap:%');

                if (!error && results) {
                    setRecentResults(results);
                }

                if (!countError && count !== null) {
                    setTestCount(count);
                }
            } catch (e) {
                console.error('Failed to load data:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [authLoading, user, router]);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${month}/${day} ${hours}:${minutes}`;
        } catch {
            return '不明';
        }
    };

    const isProfileIncomplete = profile.fullName === 'ゲスト' || profile.grade === '未設定';

    if (authLoading || isLoading) {
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

    return (
        <main className="min-h-screen bg-gray-50">
            <Background className="min-h-screen">
                <div className="max-w-5xl mx-auto px-4 pb-8" style={{ marginTop: '25px' }}>

                    {/* Welcome Header */}
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                            {user ? (
                                <>おかえりなさい<br /><span className="text-gray-900">{profile.fullName}</span>さん</>
                            ) : (
                                <>Mathtapへ<br /><span className="text-blue-600">ようこそ！</span></>
                            )}
                        </h1>

                        {announcements.length > 0 ? (
                            <div className="space-y-1">
                                {announcements.slice(0, 2).map((announcement) => (
                                    <p key={announcement.id} className="text-gray-600 text-lg">
                                        {announcement.message.split(/\\n|\n/).map((line, i, arr) => {
                                            const parts = line.split(/(\$.*?\$)/g);
                                            return (
                                                <span key={i}>
                                                    {parts.map((part, index) => {
                                                        if (part.startsWith('$') && part.endsWith('$')) {
                                                            return (
                                                                <span key={index} className="text-blue-500 font-bold">
                                                                    {part.slice(1, -1)}
                                                                </span>
                                                            );
                                                        }
                                                        return part;
                                                    })}
                                                    {i < arr.length - 1 && <br />}
                                                </span>
                                            );
                                        })}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-lg">
                                計算問題をマスターしよう！
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* Incomplete Profile Alert */}
                            {user && isProfileIncomplete && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                                    <div className="relative z-10">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">プロフィール未設定</h3>
                                        <p className="text-sm text-gray-600 mb-4">学年や名前を設定して、学習体験を向上させましょう。</p>
                                        <button
                                            onClick={() => router.push('/mistap/profile')}
                                            className="w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                                        >
                                            設定する
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stats Cards */}
                            {user && (
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                    {/* Consecutive Days */}
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-1 opacity-90">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                                </svg>
                                                <span className="text-sm font-medium">連続ログイン</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold tracking-tight">{profile.consecutiveLoginDays}</span>
                                                <span className="text-lg opacity-80">日</span>
                                            </div>
                                            {profile.consecutiveLoginDays >= 7 && (
                                                <div className="mt-2 inline-flex items-center bg-white/20 rounded-full px-2 py-0.5 text-xs font-medium">
                                                    <span className="mr-1">🎉</span> Great Job!
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total Tests */}
                                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            <span className="text-sm font-medium">累計テスト回数</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-gray-900">{testCount}</span>
                                            <span className="text-sm text-gray-500">回</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile: 1 Year Record (Contribution Graph) */}
                            <div className="lg:hidden">
                                <ContributionGrid colorTheme="blue" filterSubject="math" />
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/mathtap/test-setup')}
                                    className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all shadow-md hover:shadow-lg overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative font-semibold text-lg">テストを作成</span>
                                    <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => router.push('/mathtap/history')}
                                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 p-3 rounded-xl transition-colors font-medium"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    学習履歴
                                </button>

                                {!user && (
                                    <button
                                        onClick={() => router.push('/login?mode=signup&redirect=/mathtap/home')}
                                        className="w-full bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 p-3 rounded-xl transition-colors font-medium"
                                    >
                                        アカウント登録で成績を記録
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Recent Results & Desktop Grid */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Desktop: Contribution Grid */}
                            <div className="hidden lg:block">
                                <ContributionGrid colorTheme="blue" filterSubject="math" />
                            </div>

                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        最近の学習記録
                                    </h2>
                                </div>

                                {user && recentResults.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentResults.map((result) => (
                                            <div key={result.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${result.correct === result.total ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {Math.round((result.correct / result.total) * 100)}%
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm md:text-base mb-0.5">
                                                            {result.selected_text?.replace('Mathtap: ', '') || '計算テスト'}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{result.unit || '範囲不明'}</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span>{formatDate(result.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {result.incorrect_count > 0 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            ミス: {result.incorrect_count}問
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Perfect!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <p className="mb-4 text-lg font-medium">まだ履歴がありません</p>
                                        <p className="text-sm text-gray-400 mb-6">テストを受けると、ここに結果が表示されます</p>
                                        <button
                                            onClick={() => router.push('/mathtap/test-setup')}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            最初のテストに挑戦！
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">計算練習</h3>
                            <p className="text-sm text-gray-600">四則演算から分数まで、様々な計算問題に挑戦できます</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">成績記録</h3>
                            <p className="text-sm text-gray-600">テスト結果を自動で記録し、苦手な問題を確認できます</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">学年別対応</h3>
                            <p className="text-sm text-gray-600">中学1年から3年まで、学年に合わせた問題を用意</p>
                        </div>
                    </div>

                </div>
            </Background>
        </main>
    );
}
