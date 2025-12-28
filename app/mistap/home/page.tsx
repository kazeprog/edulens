'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import { getLoginInfo, updateLoginStreak } from '@/lib/mistap/loginTracker';
import { getActiveAnnouncements, Announcement } from '@/lib/mistap/announcements';
import Background from '@/components/mistap/Background';
import GroupRanking from '@/components/GroupRanking';
import ProgressDashboard from '@/components/mistap/ProgressDashboard';
import MistapFooter from '@/components/mistap/Footer';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

interface BlogPost {
    id: string;
    title: string;
    publishedAt: string;
    eyecatch?: {
        url: string;
        height: number;
        width: number;
    };
}

interface UserProfile {
    fullName: string;
    grade: string;
    lastLoginAt: string | null;
    consecutiveLoginDays: number;
    totalTestsTaken: number;
    dailyGoal?: number;
    startDate?: string;
    selectedTextbook?: string;
}

interface TodayGoal {
    textbook: string;
    start: number;
    end: number;
}

interface IncorrectWord {
    word_number: number;
    word: string;
    meaning: string;
}

interface TestResult {
    id: string;
    user_id: string;
    selected_text: string | null;
    start_num: number | null;
    end_num: number | null;
    total: number;
    correct: number;
    incorrect_count: number;
    incorrect_words: IncorrectWord[] | null;
    created_at: string;
}

export default function HomePage() {
    const router = useRouter();
    const { user, profile: authProfile, loading: authLoading } = useAuth();
    // デフォルト値を設定してすぐにUIを表示。AuthContextからの情報を優先使用
    const [profile, setProfile] = useState<UserProfile>({
        fullName: authProfile?.full_name || 'ゲスト',
        grade: authProfile?.grade || '未設定',
        lastLoginAt: authProfile?.last_login_at || null,
        consecutiveLoginDays: authProfile?.consecutive_login_days || 0,
        totalTestsTaken: authProfile?.test_count || 0,
        dailyGoal: authProfile?.daily_goal,
        startDate: authProfile?.start_date || undefined,
        selectedTextbook: authProfile?.selected_textbook || undefined
    });
    const [todayGoal, setTodayGoal] = useState<TodayGoal | null>(null);
    const [recentResults, setRecentResults] = useState<TestResult[]>([]);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // useRefを使用して最新の値を参照（依存配列に含めずに最新値を参照するため）
    const isUpdatingStreakRef = useRef(false);
    // 読み込み中フラグ（重複読み込み防止）
    const isLoadingProfileRef = useRef(false);
    // debounce用タイマー
    const loadDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // お知らせを取得
    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getActiveAnnouncements();
            setAnnouncements(data);
        };
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const res = await fetch('/mistap/api/blog-posts');
                if (res.ok) {
                    const data = await res.json();
                    setBlogPosts(data.contents);
                }
            } catch {
                // Failed to fetch blog posts
            } finally {
                setBlogLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    // 認証状態の変化を監視してリダイレクト
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/mistap');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        // PWA Install prompt detection
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
        const isiOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
        setIsIos(isiOS);

        function onBeforeInstall(e: Event) {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallButton(true);
        }

        window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);

        // For iOS, show button if not in standalone mode
        const isStandalone = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
        if (isiOS && !isStandalone) {
            setShowInstallButton(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
        };
    }, []);

    // AuthContextのプロフィールが更新されたら反映
    useEffect(() => {
        if (authProfile) {
            setProfile(prev => ({
                ...prev,
                fullName: authProfile.full_name || prev.fullName,
                grade: authProfile.grade || prev.grade,
                lastLoginAt: authProfile.last_login_at || prev.lastLoginAt,
                consecutiveLoginDays: authProfile.consecutive_login_days || prev.consecutiveLoginDays,
                totalTestsTaken: authProfile.test_count || prev.totalTestsTaken,
                dailyGoal: authProfile.daily_goal || prev.dailyGoal,
                startDate: authProfile.start_date || prev.startDate,
                selectedTextbook: authProfile.selected_textbook || prev.selectedTextbook
            }));
            // ここではロード完了としない（追加データの取得を待つ）
        }
    }, [authProfile]);

    // 追加データの読み込み（ストリーク更新、今日の目標、履歴）
    useEffect(() => {
        // ユーザーがいない、または初期ロード中はスキップ
        if (authLoading || !user) {
            return;
        }

        // プロフィールがまだロードされていない場合は待機（AuthContextで必ずセットされるはず）
        if (!authProfile) {
            return;
        }

        const supabase = getSupabase();
        if (!supabase) {
            setError('データベース接続エラー');
            return;
        }

        let mounted = true;
        // データ取得中は前回のエラーをクリア
        setError(null);

        const loadAdditionalData = async () => {
            const userId = user.id;

            // 1. ログインストリークの更新 (副作用なのでここで実行)
            if (!isUpdatingStreakRef.current) {
                isUpdatingStreakRef.current = true;
                // バックグラウンド実行（待たない）
                updateLoginStreak(userId).then(streak => {
                    if (mounted && streak) {
                        setProfile(prev => ({
                            ...prev,
                            lastLoginAt: streak.lastLogin,
                            consecutiveLoginDays: streak.consecutiveDays
                        }));
                    }
                }).catch(err => {
                    console.error('Streak update failed:', err);
                }).finally(() => {
                    // 再実行防止期間
                    setTimeout(() => {
                        if (mounted) isUpdatingStreakRef.current = false;
                    }, 5000);
                });
            }

            // 2. 今日の目標計算 (プロフィール情報が必要)
            // AuthContextの最新プロフィールを使用
            const currentProfile = authProfile;
            if (currentProfile?.daily_goal && currentProfile?.start_date && currentProfile?.selected_textbook) {
                try {
                    const { data: maxWordData } = await supabase
                        .from('words')
                        .select('word_number')
                        .eq('text', currentProfile.selected_textbook)
                        .order('word_number', { ascending: false })
                        .limit(1)
                        .single();

                    if (maxWordData && mounted) {
                        const maxWords = maxWordData.word_number;
                        const dailyGoal = currentProfile.daily_goal;
                        const startDate = new Date(currentProfile.start_date);
                        const today = new Date();
                        startDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        const diffTime = today.getTime() - startDate.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays >= 0) {
                            let currentStartNum = 1;
                            for (let i = 0; i <= diffDays; i++) {
                                let endNum = currentStartNum + dailyGoal - 1;
                                if (endNum > maxWords) {
                                    endNum = maxWords;
                                }

                                if (i === diffDays) {
                                    setTodayGoal({
                                        textbook: currentProfile.selected_textbook!,
                                        start: currentStartNum,
                                        end: endNum
                                    });
                                    break;
                                }

                                if (endNum === maxWords) {
                                    currentStartNum = 1;
                                } else {
                                    currentStartNum = endNum + 1;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Goal calculation error:', e);
                }
            }

            // 3. 最近の成績取得
            try {
                const { data: resultsData, error: resultsError } = await supabase
                    .from('results')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (mounted && !resultsError) {
                    setRecentResults(resultsData || []);
                }
            } catch (e) {
                console.error('Recent results fetch error:', e);
            }

            if (mounted) {
                setProfileLoaded(true);
            }
        };

        loadAdditionalData();

        // 可視性変更時のリロードハンドラ
        const handleVisibilityChange = () => {
            // 認証があり、タブがアクティブになった場合のみデータ更新
            if (document.visibilityState === 'visible' && !authLoading && user) {
                loadAdditionalData();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            mounted = false;
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [authLoading, user, user?.id, authProfile]);

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '記録なし';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${year}年${month}月${day}日 ${hours}:${minutes}`;
        } catch {
            return '記録なし';
        }
    };

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            try {
                await deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    // PWA installed
                }
                setDeferredPrompt(null);
                setShowInstallButton(false);
            } catch {
                // Install prompt failed
            }
        }
        // iOS の場合はボタンクリックしても指示を表示するだけ（自動インストール不可）
    };

    // 1. 認証ロード中
    if (authLoading) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-medium mb-2">読み込み中</p>
                            <p className="text-white/60 text-sm">認証情報を確認してます...</p>
                        </div>
                    </div>
                </Background>
            </div>
        );
    }

    // 2. エラーがある場合（最優先で表示）
    if (error) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-center min-h-screen p-4">
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 text-center max-w-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">エラーが発生しました</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={() => router.push('/mistap')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full">
                            ホームに戻る
                        </button>
                    </div>
                </Background>
            </div>
        );
    }

    // 3. ユーザーがいない場合（リダイレクト待ち）
    if (!user) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white text-xl font-medium">リダイレクト中...</p>
                    </div>
                </Background>
            </div>
        );
    }

    // 4. データ準備中（ここまで来ればユーザーは必ずいる）
    if (!profileLoaded) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-medium mb-2">読み込み中</p>
                            <p className="text-white/60 text-sm">学習データを準備しています...</p>
                        </div>
                    </div>
                </Background>
            </div>
        );
    }

    const isProfileIncomplete = profile.fullName === 'ゲスト' || profile.grade === '未設定';

    return (
        <main className="min-h-screen bg-gray-50">
            <Background className="min-h-screen">
                <div className="max-w-5xl mx-auto px-4 pb-8" style={{ marginTop: '25px' }}>

                    {/* Welcome Header */}
                    {profile.fullName !== 'ゲスト' && (
                        <div className="mb-8 md:mb-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                                おかえりなさい<br />
                                <span className="text-gray-900">{profile.fullName}</span>さん
                            </h1>
                            {announcements.length > 0 ? (
                                <div className="space-y-1">
                                    {announcements.slice(0, 2).map((announcement) => (
                                        <p key={announcement.id} className="text-gray-600 text-lg">
                                            {announcement.message.split(/\\n|\n/).map((line, i, arr) => (
                                                <span key={i}>
                                                    {line}
                                                    {i < arr.length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-lg">
                                    今日も目標に向かって頑張りましょう！
                                    {!isProfileIncomplete && <span className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{profile.grade}</span>}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: Stats & Profile */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* Incomplete Profile Alert */}
                            {isProfileIncomplete && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                                    <div className="relative z-10">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">プロフィール未設定</h3>
                                        <p className="text-sm text-gray-600 mb-4">学年や名前を設定して、学習体験を向上させましょう。</p>
                                        <button
                                            onClick={() => router.push('/mistap/profile')}
                                            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                                        >
                                            設定する
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                {/* Consecutive Days */}
                                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg shadow-red-200 relative overflow-hidden">
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
                                        <span className="text-3xl font-bold text-gray-900">{profile.totalTestsTaken}</span>
                                        <span className="text-sm text-gray-500">回</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions (Desktop/Tablet) */}
                            <div className="hidden lg:block space-y-3">
                                <button
                                    onClick={() => router.push('/mistap/test-setup')}
                                    className="w-full group relative flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-2xl transition-all shadow-md hover:shadow-lg overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative font-semibold">新しいテストを作成</span>
                                    <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => router.push('/mistap/history')}
                                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 p-3 rounded-xl transition-colors font-medium"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    学習履歴を確認
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Recent Activity */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Today's Goal Card */}
                            {todayGoal ? (
                                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-xl shadow-red-200 p-6 md:p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4 opacity-90">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            <span className="font-bold tracking-wide">今日の目標</span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{todayGoal.textbook}</h3>
                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="text-lg opacity-90">No.</span>
                                            <span className="text-4xl font-bold">{todayGoal.start}</span>
                                            <span className="text-xl opacity-80">〜</span>
                                            <span className="text-4xl font-bold">{todayGoal.end}</span>
                                            <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                                                全{todayGoal.end - todayGoal.start + 1}語
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const query = new URLSearchParams({
                                                    selectedText: todayGoal.textbook,
                                                    startNum: todayGoal.start.toString(),
                                                    endNum: todayGoal.end.toString(),
                                                    count: Math.min(10, todayGoal.end - todayGoal.start + 1).toString()
                                                }).toString();
                                                router.push(`/mistap/test-setup?${query}`);
                                            }}
                                            className="bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            テストを開始する
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg p-6 md:p-8 text-gray-700 relative overflow-hidden border border-gray-300">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4 opacity-70">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            <span className="font-bold tracking-wide">今日の目標</span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">目標がまだ設定されていません</h3>
                                        <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                                            学習目標を設定すると、毎日の進捗が自動で計算され、効率的な学習ができます。
                                        </p>

                                        <button
                                            onClick={() => router.push('/mistap/goals')}
                                            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            目標を設定する
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Learning Progress Dashboard */}
                            <ProgressDashboard />

                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </span>
                                        最近の学習
                                    </h2>
                                    {recentResults.length > 0 && (
                                        <button
                                            onClick={() => router.push('/mistap/history')}
                                            className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            すべて見る
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {recentResults.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">まだ履歴がありません</h3>
                                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">最初のテストを受けて、学習の第一歩を踏み出しましょう！</p>
                                        <button
                                            onClick={() => router.push('/mistap/test-setup')}
                                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-0.5"
                                        >
                                            テストを始める
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentResults.map((result) => {
                                            const scorePercentage = Math.round((result.correct / result.total) * 100);
                                            const isHighScore = scorePercentage >= 80;

                                            return (
                                                <div
                                                    key={result.id}
                                                    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-red-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                                                    onClick={() => router.push('/mistap/history')}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${isHighScore ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                                                }`}>
                                                                {scorePercentage}<span className="text-xs ml-0.5">%</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                                                    {result.selected_text || '小テスト'}
                                                                </h4>
                                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        {new Date(result.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                                                                    </span>
                                                                    {result.start_num && result.end_num && (
                                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                                            No. {result.start_num} - {result.end_num}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                <span className="text-lg">{result.correct}</span>
                                                                <span className="text-gray-400 mx-1">/</span>
                                                                <span className="text-gray-500">{result.total}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">正解</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Quick Actions (Bottom Fixed or just below) */}
                    <div className="lg:hidden mt-8 grid grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/mistap/test-setup')}
                            className="col-span-2 bg-gray-900 text-white p-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            テストを作成
                        </button>
                        <button
                            onClick={() => router.push('/mistap/history')}
                            className="bg-white text-gray-700 border border-gray-200 p-3 rounded-xl font-medium flex flex-col items-center justify-center gap-1 shadow-sm"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-sm">履歴</span>
                        </button>
                        <button
                            onClick={() => router.push('/mistap/goals')}
                            className="bg-white text-gray-700 border border-gray-200 p-3 rounded-xl font-medium flex flex-col items-center justify-center gap-1 shadow-sm"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm">目標管理</span>
                        </button>
                    </div>

                    {/* Group Ranking Section */}
                    <div className="mt-8">
                        <GroupRanking />
                    </div>

                    {/* Blog Section */}
                    {!blogLoading && blogPosts.length > 0 && (
                        <div className="mt-12 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-2xl">📝</span>
                                    おすすめの記事
                                </h3>
                                <Link
                                    href="/mistap/blog"
                                    className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                                >
                                    すべて見る
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {blogPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/mistap/blog/${post.id}`}
                                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full"
                                    >
                                        {post.eyecatch && (
                                            <div className="relative w-full aspect-video overflow-hidden">
                                                <Image
                                                    src={post.eyecatch.url}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                {post.title}
                                            </h4>
                                            <div className="mt-auto pt-2">
                                                <p className="text-xs text-gray-500">
                                                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Background>
            <MistapFooter />
        </main>
    );
}
