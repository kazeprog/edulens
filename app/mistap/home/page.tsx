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
import ContributionGrid from '@/components/mistap/ContributionGrid';
import AddToHomeScreen from '@/components/mistap/AddToHomeScreen';
import MistapFooter from '@/components/mistap/Footer';
import GoogleAdsense from '@/components/GoogleAdsense';
import { BookMarked, Headphones, TrendingUp } from 'lucide-react';

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
    // 旧フィールドは互換性のために残すが、目標表示には使用しない
    dailyGoal?: number;
    startDate?: string;
    selectedTextbook?: string;
    exp: number;
    level: number;
}

interface TodayGoal {
    id: string;
    textbook: string;
    start: number;
    end: number;
    daily_goal: number;
    words_per_test?: number;
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
    unit: string | null;
    total: number;
    correct: number;
    incorrect_count: number;
    incorrect_words: IncorrectWord[] | null;
    created_at: string;
}

// 登録ユーザー数表示コンポーネント
function UserCountDisplay() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [displayCount, setDisplayCount] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchUserCount = async () => {
            const supabase = getSupabase();
            if (!supabase) return;

            const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (count !== null) {
                setUserCount(count);
            }
        };

        fetchUserCount();
    }, []);

    // Intersection Observerの設定
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // 一度表示されたら監視終了
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [userCount]);

    // カウントアップアニメーション
    useEffect(() => {
        if (userCount === null || !isVisible) return;

        const duration = 2000; // 2秒でカウントアップ
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const increment = userCount / totalFrames;

        let currentCount = 0;
        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= userCount) {
                setDisplayCount(userCount);
                clearInterval(timer);
            } else {
                setDisplayCount(Math.floor(currentCount));
            }
        }, frameDuration);

        return () => clearInterval(timer);
    }, [userCount, isVisible]);

    if (userCount === null) {
        return (
            <div ref={elementRef} className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={elementRef} className="mt-8 relative group">
            {/* 背景の装飾効果 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>

            <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                {/* 背景パターン */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-orange-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-50 to-orange-50 rounded-full -ml-8 -mb-8 opacity-50"></div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 transform group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-0.5">Mistap メンバー数</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                                    {displayCount.toLocaleString()}
                                </span>
                                <span className="text-sm font-bold text-gray-400">人</span>
                            </div>
                        </div>
                    </div>

                    {/* 参加ボタン的な装飾 */}
                    <div className="hidden md:flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-red-100 transition-colors">
                        <span>現在拡大中!</span>
                        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
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
        selectedTextbook: authProfile?.selected_textbook || undefined,
        exp: authProfile?.exp || 0,
        level: authProfile?.level || 1
    });

    // 複数の目標を管理
    const [todayGoals, setTodayGoals] = useState<TodayGoal[]>([]);

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
    const [referralEnabled, setReferralEnabled] = useState(true);

    // お知らせを取得
    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getActiveAnnouncements();
            setAnnouncements(data);
        };
        fetchAnnouncements();
    }, []);

    // 招待キャンペーンの有効状態を取得
    useEffect(() => {
        const fetchReferralStatus = async () => {
            const supabase = getSupabase();
            if (!supabase) return;

            const { data } = await supabase
                .from('app_config')
                .select('value')
                .eq('key', 'referral_campaign_enabled')
                .single();

            if (data && typeof data.value === 'boolean') {
                setReferralEnabled(data.value);
            }
        };
        fetchReferralStatus();
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

    // Referral Code Auto-Claim (Ensure it's claimed upon landing on Home)
    useEffect(() => {
        const claimReferral = async () => {
            if (!user) return;
            const storedCode = localStorage.getItem('mistap_referral_code');
            if (!storedCode) return;

            try {
                const supabase = getSupabase();
                if (!supabase) return;

                // Check config
                const { data: config } = await supabase
                    .from('app_config')
                    .select('value')
                    .eq('key', 'referral_campaign_enabled')
                    .single();

                if (config && config.value === false) return;

                const { data } = await supabase.rpc('claim_referral_code', { p_code: storedCode });

                // If success or already handled, clear storage
                if (data?.success || data?.message?.includes('済み') || data?.message?.includes('自分')) {
                    localStorage.removeItem('mistap_referral_code');
                }
            } catch (err) {
                console.error('Referral claim error:', err);
            }
        };
        claimReferral();
    }, [user]);

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
                selectedTextbook: authProfile.selected_textbook || prev.selectedTextbook,
                exp: authProfile.exp !== undefined ? authProfile.exp : prev.exp,
                level: authProfile.level !== undefined ? authProfile.level : prev.level
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

            // 2. 今日の目標計算（複数対応）
            try {
                // まず goals テーブルから全ての目標を取得
                const { data: goalsData, error: goalsError } = await supabase
                    .from('mistap_textbook_goals')
                    .select('*')
                    .eq('user_id', userId);

                if (goalsError) {
                    console.error('Goals fetch error:', goalsError);
                }

                if (mounted && goalsData && goalsData.length > 0) {
                    const todayGoalsList: TodayGoal[] = [];

                    // 並列で最大単語数を取得して計算
                    await Promise.all(goalsData.map(async (goal) => {
                        try {
                            // 単語帳の最大数を取得
                            const { data: maxWordData } = await supabase
                                .from('words')
                                .select('word_number')
                                .eq('text', goal.textbook_name)
                                .order('word_number', { ascending: false })
                                .limit(1)
                                .single();

                            if (maxWordData) {
                                const maxWords = maxWordData.word_number;
                                const dailyGoal = goal.daily_goal;
                                const startDate = new Date(goal.start_date);
                                const today = new Date();
                                startDate.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);

                                const diffTime = today.getTime() - startDate.getTime();
                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                                // 設定範囲
                                const rangeStart = goal.goal_start_word ?? 1;
                                const rangeEnd = (goal.goal_end_word && goal.goal_end_word > 0) ? goal.goal_end_word : maxWords;

                                if (diffDays >= 0) {
                                    let currentStartNum = rangeStart;

                                    // ループ計算（簡易シミュレーション）
                                    for (let i = 0; i <= diffDays; i++) {
                                        let endNum = currentStartNum + dailyGoal - 1;
                                        if (endNum > rangeEnd) {
                                            endNum = rangeEnd;
                                        }

                                        if (i === diffDays) {
                                            todayGoalsList.push({
                                                id: goal.id,
                                                textbook: goal.textbook_name,
                                                start: currentStartNum,
                                                end: endNum,
                                                daily_goal: dailyGoal,
                                                words_per_test: goal.words_per_test
                                            });
                                            break;
                                        }

                                        if (endNum === rangeEnd) {
                                            currentStartNum = rangeStart;
                                        } else {
                                            currentStartNum = endNum + 1;
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            console.error(`Error calculating goal for ${goal.textbook_name}:`, e);
                        }
                    }));

                    setTodayGoals(todayGoalsList);
                } else if (mounted) {
                    setTodayGoals([]);
                }
            } catch (e) {
                console.error('Goal calculation error:', e);
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

    const handleStartGoalTest = (goal: TodayGoal) => {
        const count = (goal.words_per_test && goal.words_per_test > 0) ? goal.words_per_test : (goal.end - goal.start + 1);

        // Pro limit check
        if (!authProfile?.is_pro && count > 50) {
            alert("目標設定テストで一度に出題できる単語数は50語までです。\n50語以上のテストを作成するにはProプランへのアップグレードが必要です。");
            return;
        }

        router.push(`/mistap/test?text=${encodeURIComponent(goal.textbook)}&start=${goal.start}&end=${goal.end}&count=${count}`);
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
                                            {announcement.message.split(/\\n|\n/).map((line, i, arr) => {
                                                // Handle $...$ for red text
                                                const parts = line.split(/(\$.*?\$)/g);
                                                return (
                                                    <span key={i}>
                                                        {parts.map((part, index) => {
                                                            if (part.startsWith('$') && part.endsWith('$')) {
                                                                return (
                                                                    <span key={index} className="text-red-500 font-bold">
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

                            {/* Pro plan promotion button */}
                            {!authProfile?.is_pro && !authLoading && (
                                <Link
                                    href="/upgrademistap"
                                    prefetch={false}
                                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-between group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                                    <div className="flex items-center gap-4 relative z-10 w-full">
                                        <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-lg leading-tight truncate">広告を非表示＆有料機能解放</p>
                                            <p className="text-white/90 text-xs font-medium mt-0.5 truncate">集中力を高めて学習効率UP</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform ml-2 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            )}

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                {/* Level and EXP Card */}
                                <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full -mr-10 -mt-10 opacity-70 pointer-events-none"></div>
                                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        <span className="text-sm font-medium">現在のレベル</span>
                                    </div>
                                    <div className="relative z-10 flex justify-between items-end mb-3">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold text-gray-400">Lv.</span>
                                            <span className="text-4xl font-extrabold text-gray-800">{profile.level}</span>
                                        </div>
                                        <div className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm mb-1">
                                            次まで <span className="text-gray-800 px-0.5">{1000 - (profile.exp % 1000)}</span> <span className="text-gray-400">EXP</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(profile.exp % 1000) / 10}%` }}></div>
                                    </div>
                                    <p className="text-right text-xs text-gray-400 font-semibold h-[18px]">累計 {profile.exp} EXP</p>
                                </div>

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

                            {/* Mobile: 1 Year Record (Contribution Graph) */}
                            <div className="lg:hidden">
                                <ContributionGrid />
                            </div>


                            {/* Mobile: AdSense above Today's Goals */}
                            <GoogleAdsense
                                slot="9969163744"
                                format="rectangle"
                                responsive="true"
                                style={{ display: 'block', width: '100%' }}
                                className="lg:hidden mb-6"
                            />

                            {/* Today's Goals (Visible on both desktop and mobile) */}
                            {todayGoals.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 px-1">今日の目標</h3>
                                    {todayGoals.map((goal) => (
                                        <div key={goal.id} className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-xl shadow-red-200 p-6 md:p-8 text-white relative overflow-hidden hover:scale-[1.01] transition-transform">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-4 opacity-90">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                    </svg>
                                                    <span className="font-bold tracking-wide">{goal.textbook}</span>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-sm opacity-80 mb-1">本日の範囲</p>
                                                        <p className="text-3xl font-bold tracking-tight">
                                                            No. {goal.start} <span className="text-xl mx-1 font-normal opacity-80">〜</span> {goal.end}
                                                        </p>
                                                    </div>
                                                    <div className="hidden sm:block h-12 w-px bg-white/30"></div>
                                                    <div className="hidden sm:block">
                                                        <p className="text-sm opacity-80 mb-1">目標語数</p>
                                                        <p className="text-2xl font-bold">
                                                            {(goal.words_per_test && goal.words_per_test > 0) ? goal.words_per_test : (goal.end - goal.start + 1)}
                                                            <span className="text-base font-normal ml-1 opacity-80">words</span>
                                                            {(goal.words_per_test && goal.words_per_test > 0 && goal.words_per_test < (goal.end - goal.start + 1)) && (
                                                                <span className="text-sm font-normal ml-2 opacity-70">/ 全{goal.end - goal.start + 1}語から</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex gap-3">
                                                    <button
                                                        onClick={() => handleStartGoalTest(goal)}
                                                        className="flex-1 bg-white text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                                                    >
                                                        テストする
                                                    </button>
                                                    <button
                                                        onClick={() => router.push('/mistap/goals')}
                                                        className="bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-colors backdrop-blur-md"
                                                    >
                                                        設定
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">目標がまだ設定されていません</h3>
                                    <p className="text-gray-500 mb-6">
                                        学習目標を設定すると、毎日の進捗が自動で計算され、<br className="hidden md:block" />
                                        効率的な学習ができます。まずは1つ目標を作ってみましょう！
                                    </p>
                                    <button
                                        onClick={() => router.push('/mistap/goals')}
                                        className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        目標を設定する
                                    </button>
                                </div>
                            )}

                            {/* Mobile Quick Actions (lg:hidden) */}
                            <div className="lg:hidden grid grid-cols-1 gap-3 mb-8">
                                <button
                                    onClick={() => router.push('/mistap/word-stock')}
                                    className="md:hidden group relative bg-white hover:bg-orange-50/50 p-4 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md border border-gray-100 transition-all active:scale-[0.98] hover:-translate-y-0.5 overflow-hidden"
                                >
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-rose-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>

                                    <div className="flex items-center gap-4 relative z-10 w-full">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl text-white flex items-center justify-center shadow-inner shadow-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                            <BookMarked className="w-6 h-6" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-extrabold text-lg text-gray-800 flex items-center gap-2 tracking-tight">
                                                Word Stock
                                            </div>
                                            <div className="text-xs font-bold text-orange-500">育てる単語帳</div>
                                        </div>
                                        <div className="bg-orange-50 p-2 rounded-full group-hover:bg-orange-100 transition-colors group-hover:translate-x-1 duration-300">
                                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/mistap/mistappers-mistake')}
                                    className="md:hidden group relative bg-white hover:bg-red-50/50 p-4 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md border border-gray-100 transition-all active:scale-[0.98] hover:-translate-y-0.5 overflow-hidden"
                                >
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-pink-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>

                                    <div className="flex items-center gap-4 relative z-10 w-full">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl text-white flex items-center justify-center shadow-inner shadow-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-extrabold text-lg text-gray-800 flex items-center gap-2 tracking-tight">
                                                Mistappers&apos; Mistake
                                            </div>
                                            <div className="text-xs font-bold text-red-500">みんながミスる単語ランキング</div>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded-full group-hover:bg-red-100 transition-colors group-hover:translate-x-1 duration-300">
                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/mistap/listening')}
                                    className="md:hidden group relative bg-white hover:bg-sky-50/50 p-4 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md border border-gray-100 transition-all active:scale-[0.98] hover:-translate-y-0.5 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-cyan-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>

                                    <div className="flex items-center gap-4 relative z-10 w-full">
                                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl text-white flex items-center justify-center shadow-inner shadow-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                            <Headphones className="w-6 h-6" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-extrabold text-lg text-gray-800 flex items-center gap-2 tracking-tight">
                                                聞き流し英単語
                                            </div>
                                            <div className="text-xs font-bold text-sky-500">範囲指定で連続読み上げ</div>
                                        </div>
                                        <div className="bg-sky-50 p-2 rounded-full group-hover:bg-sky-100 transition-colors group-hover:translate-x-1 duration-300">
                                            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => router.push('/mistap/test-setup')}
                                        className="flex flex-col items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-2xl shadow-md active:scale-95 transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="font-bold text-sm">作成</span>
                                    </button>
                                    <button
                                        onClick={() => router.push('/mistap/history')}
                                        className="flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 p-4 rounded-2xl active:scale-95 transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span className="font-bold text-sm">履歴</span>
                                    </button>
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
                                <button
                                    onClick={() => router.push('/mistap/mistappers-mistake')}
                                    className="w-full group relative flex items-center justify-between gap-3 bg-white hover:bg-red-50/30 border border-gray-200 p-3 rounded-2xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-50 to-pink-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white flex items-center justify-center shadow-inner shadow-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <span className="font-extrabold text-gray-800 tracking-tight">Mistappers&apos; Mistake</span>
                                    </div>
                                    <div className="relative z-10 bg-red-50 p-1.5 rounded-full group-hover:bg-red-100 group-hover:translate-x-1 transition-all">
                                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/mistap/listening')}
                                    className="w-full group relative flex items-center justify-between gap-3 bg-white hover:bg-sky-50/30 border border-gray-200 p-3 rounded-2xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-inner shadow-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform shrink-0">
                                            <Headphones className="w-4 h-4" />
                                        </div>
                                        <span className="font-extrabold text-gray-800 tracking-tight">聞き流し英単語</span>
                                    </div>
                                    <div className="relative z-10 bg-sky-50 p-1.5 rounded-full group-hover:bg-sky-100 group-hover:translate-x-1 transition-all">
                                        <svg className="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                        </div>

                        {/* Right Column: Recent Activity */}
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            {/* デスクトップ版: 左カラムから移動した「過去1年間の学習記録」を最上部に配置 */}
                            <div className="hidden lg:block">
                                <ContributionGrid />
                            </div>

                            <div className="hidden md:block mb-8 relative group cursor-pointer" onClick={() => router.push('/mistap/word-stock')}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-rose-500 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden transform group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-100/50 to-rose-50/50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-700 blur-3xl"></div>

                                    <div className="relative z-10">
                                        <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-inner shadow-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                                <BookMarked className="w-5 h-5" />
                                            </span>
                                            Word Stock
                                        </h2>
                                        <p className="text-gray-600 mb-5 text-sm font-medium">
                                            日々の学習で気になった単語をストックして、あなただけの単語帳を作りましょう。
                                        </p>
                                        <button
                                            className="w-full relative overflow-hidden bg-white text-orange-600 font-bold py-3.5 px-4 rounded-xl border-2 border-orange-100 group-hover:border-orange-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-rose-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></div>
                                            <span className="relative z-10 flex items-center gap-2">
                                                単語帳を開く
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mistappers' Mistake Banner (Tablet/Desktop) */}
                            <div className="hidden md:block mb-8 relative group cursor-pointer" onClick={() => router.push('/mistap/mistappers-mistake')}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden transform group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-100/50 to-pink-50/50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-700 blur-3xl"></div>

                                    <div className="relative z-10">
                                        <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-inner shadow-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                                <TrendingUp className="w-5 h-5" />
                                            </span>
                                            Mistappers&apos; Mistake
                                        </h2>
                                        <p className="text-gray-600 mb-5 text-sm font-medium">
                                            みんなが間違いやすい単語をランキング形式で確認して、弱点を克服しましょう。
                                        </p>
                                        <button
                                            className="w-full relative overflow-hidden bg-white text-red-600 font-bold py-3.5 px-4 rounded-xl border-2 border-red-100 group-hover:border-red-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-pink-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></div>
                                            <span className="relative z-10 flex items-center gap-2">
                                                ランキングを見る
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block mb-8 relative group cursor-pointer" onClick={() => router.push('/mistap/listening')}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden transform group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-sky-100/50 to-cyan-50/50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-700 blur-3xl"></div>

                                    <div className="relative z-10">
                                        <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-inner shadow-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                                <Headphones className="w-5 h-5" />
                                            </span>
                                            聞き流し英単語
                                        </h2>
                                        <p className="text-gray-600 mb-5 text-sm font-medium">
                                            教材と範囲を指定して、英単語を連続で読み上げます。移動中やスキマ時間の耳学習にそのまま使えます。
                                        </p>
                                        <button
                                            className="w-full relative overflow-hidden bg-white text-sky-600 font-bold py-3.5 px-4 rounded-xl border-2 border-sky-100 group-hover:border-sky-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></div>
                                            <span className="relative z-10 flex items-center gap-2">
                                                ページを開く
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Banner */}
                            {referralEnabled && (
                                <div
                                    onClick={() => router.push('/mistap/referral')}
                                    className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-lg shadow-pink-200 p-6 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold">
                                                <span>🎁 キャンペーン中</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-1">友達招待でProプラン無料！</h3>
                                            <p className="text-pink-100 text-sm">3人招待すると1ヶ月分プレゼント。<br />タップして招待リンクをコピー。</p>
                                        </div>
                                        <div className="bg-white/20 p-3 rounded-full">
                                            <span className="text-2xl">🚀</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 学習進捗ダッシュボード */}
                            <div>
                                <AddToHomeScreen />
                                <h2 className="text-lg font-bold text-gray-900 px-1 mb-4">
                                    学習単語の管理
                                </h2>
                                <ProgressDashboard />
                            </div>





                            {/* Recent Results */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        最近の学習記録
                                    </h2>
                                    <Link href="/mistap/history" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                                        すべて見る
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {recentResults.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentResults.map((result) => (
                                            <div key={result.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100 group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${result.correct === result.total ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {Math.round((result.correct / result.total) * 100)}%
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm md:text-base mb-0.5">
                                                            {result.selected_text || 'Unknown Textbook'}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>
                                                                {result.start_num && result.end_num
                                                                    ? `No. ${result.start_num} - ${result.end_num}`
                                                                    : result.unit}
                                                            </span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span>{formatDate(result.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {result.incorrect_count > 0 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            waiting: {result.incorrect_count}
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
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="mb-4">まだ履歴がありません</p>
                                        <button
                                            onClick={() => router.push('/mistap/test-setup')}
                                            className="text-red-600 font-medium hover:underline"
                                        >
                                            最初のテストに挑戦！
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Count Display (Moved here) */}
                    <UserCountDisplay />

                    {/* Blog Section (Restored) */}
                    {!blogLoading && blogPosts.length > 0 && (
                        <div className="mt-12 mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </span>
                                最新の学習情報
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {blogPosts.map((post) => (
                                    <Link key={post.id} href={`/mistap/blog/${post.id}`} prefetch={false} className="group cursor-pointer">
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md h-full flex flex-col">
                                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                                                {post.eyecatch ? (
                                                    <Image
                                                        src={post.eyecatch.url}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="text-xs text-gray-500 mb-2">{formatDate(post.publishedAt).split(' ')[0]}</div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                                                    {post.title}
                                                </h4>
                                                <div className="mt-auto pt-2 text-sm text-red-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    詳細を見る
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
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

