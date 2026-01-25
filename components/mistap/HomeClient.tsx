'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { Zap, BookOpen, ChevronRight } from 'lucide-react';

import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/mistap/LoginForm";
import ScreenshotCarousel from "@/components/mistap/ScreenshotCarousel";
import TextbooksSection from "@/components/mistap/TextbooksSection";
import TestimonialsSection from "@/components/mistap/TestimonialsSection";
import BlogSection from "@/components/mistap/BlogSection";
import TestSetupContent from "@/components/mistap/TestSetupContent";
import MistapFooter from "@/components/mistap/Footer";

// ブログ記事の型定義
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

export default function HomeClient() {
    const { user, profile, loading: authLoading } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    // Carousel state
    const carouselOuterRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [isManual, setIsManual] = useState(false);
    const manualResumeTimerRef = useRef<number | null>(null);

    // テーマカラー設定 (Rose - 赤/ピンク系)
    const theme = {
        bgGradient: 'from-rose-50 to-white',
        bgGradientAccent: 'from-rose-100/50 to-transparent',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-700',
        ping: 'bg-rose-400',
        dot: 'bg-rose-500',
        textAccent: 'text-rose-600',
        textHighlight: 'text-rose-500',
        buttonGradient: 'from-rose-500 to-pink-600',
        buttonShadow: 'shadow-rose-200',
        iconColor: 'text-rose-500',
        ctaGradient: 'from-rose-600 to-pink-700',
        ctaText: 'text-rose-100',
    };

    // ログイン済みユーザーは自動的にホームへリダイレクト
    useEffect(() => {
        // 認証完了 & ユーザーありの場合
        if (!authLoading && user && profile) {
            setIsRedirecting(true);

            // 1. Next.jsルーターでの遷移（スマホの負荷を考慮して0.5秒待つ）
            const timer = setTimeout(() => {
                router.replace('/mistap/home');
            }, 500);

            // 2. それでもダメなら3秒後にブラウザ標準機能で強制移動（最終手段）
            const fallbackTimer = setTimeout(() => {
                // フラグを戻すのではなく、強制的にURLを書き換えて移動させる
                window.location.href = '/mistap/home';
            }, 3000);

            return () => {
                clearTimeout(timer);
                clearTimeout(fallbackTimer);
            };
        }
    }, [authLoading, user, profile, router]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('signup') === '1') {
            router.push('/login?mode=signup&redirect=/mistap/home');
            return;
        }
        if (params.get('login') === '1') {
            setIsSignup(false);
            setShowLoginForm(true);
            window.history.replaceState({}, '', '/mistap');
        }

        const handleOpenLogin = () => {
            setIsSignup(false);
            setShowLoginForm(true);
        };

        const handleCloseLogin = () => {
            setShowLoginForm(false);
        };

        window.addEventListener('open-login-form', handleOpenLogin);
        window.addEventListener('close-login-form', handleCloseLogin);

        return () => {
            window.removeEventListener('open-login-form', handleOpenLogin);
            window.removeEventListener('close-login-form', handleCloseLogin);
        };
    }, []);

    // ブログ記事を取得
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch('/mistap/api/blog-posts');
                if (response.ok) {
                    const data = await response.json();
                    setBlogPosts(data.contents || []);
                }
            } catch {
                // ブログ記事の取得に失敗
            } finally {
                setBlogLoading(false);
            }
        };
        fetchBlogPosts();
    }, []);

    const handleSignupClick = () => {
        // EduLensの統一新規登録画面へリダイレクト（ログイン後にMistapホームへ戻る）
        router.push('/login?mode=signup&redirect=/mistap/home');
    };

    // ローディング中またはリダイレクト中は統一したローディング画面を表示
    if (authLoading || isRedirecting || (user && profile)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rose-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                    <div className="text-rose-600 text-lg font-bold">読み込み中...</div>
                </div>
            </div>
        );
    }

    if (showLoginForm) {
        return <LoginForm initialIsSignup={isSignup} />;
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Mistap",
                        "applicationCategory": "EducationalApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "JPY"
                        },
                        "description": "間違えた単語を自動で記録し、効率的に復習できる単語学習システム。",
                        "featureList": "間違えた単語の自動記録, 分散学習法に基づく復習, 市販の単語帳に対応",
                        "screenshot": "https://edulens.jp/MistapLP.png"
                    })
                }}
            />

            <main>
                {/* === Hero Section === */}
                <section className={`relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b ${theme.bgGradient}`}>
                    <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${theme.bgGradientAccent} skew-x-12 transform origin-top-right z-0 pointer-events-none`} />

                    <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                            <div className="flex-1 text-center md:text-left space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 ${theme.badgeBg} ${theme.badgeText} rounded-full text-sm font-bold mb-2`}>
                                    <span className="relative flex h-3 w-3">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.ping} opacity-75`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${theme.dot}`}></span>
                                    </span>
                                    間違えた単語だけを自動記録
                                </div>

                                {/* H1改善: ユーザー訴求とSEOの両立 */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                                    <span className={`block text-lg md:text-2xl font-bold ${theme.textAccent} mb-4 tracking-normal`}>
                                        Mistap｜英単語帳対応の単語テストアプリ
                                    </span>
                                    「間違えた単語」に<br />
                                    <span className={theme.textHighlight}>集中する学習システム。</span>
                                </h1>

                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                                    『システム英単語』『ターゲット1900』『DUO3.0』『New Horizon』など、主要な単語帳に完全対応。<br />
                                    知識の穴を埋めて、最短ルートで定着させます。
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                                    <button
                                        onClick={handleSignupClick}
                                        className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${theme.buttonGradient} text-white rounded-xl font-bold text-lg shadow-xl ${theme.buttonShadow} hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                                    >
                                        <Zap className="w-6 h-6" />
                                        アカウント作成 (無料)
                                    </button>
                                    <Link
                                        href="#demo-test"
                                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        テストを試す
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">
                                    ※ クレジットカード登録不要・完全無料で利用開始
                                </p>
                            </div>

                            <div className="flex-1 w-full max-w-md md:max-w-full relative animate-in slide-in-from-right-5 fade-in duration-1000 delay-150">
                                {/* メインビジュアル: スマホ画面風 or ロゴ */}
                                <div className="relative w-full max-w-lg mx-auto">
                                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-400 rounded-full opacity-20 blur-xl animate-pulse delay-700"></div>
                                    <div className="relative bg-white rounded-3xl shadow-2xl p-4 border border-rose-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <Image
                                            src="/MistapLP.png"
                                            alt="Mistap App Interface"
                                            width={600}
                                            height={400}
                                            className="rounded-xl w-full h-auto shadow-inner"
                                            priority
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === Test Demo Section === */}
                <section id="demo-test" className="py-20 bg-slate-50 border-t border-slate-100 border-b relative">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">実際のテストを体験</h2>
                            <p className="text-slate-600">
                                下のフォームから好きな単語帳を選んで、すぐにテストを始められます。<br />
                                間違えた単語は、アカウント作成後に「苦手リスト」として自動保存されます。
                            </p>
                        </div>

                        {/* SEO改善: Demoセクションの隠しテキスト */}
                        <div className="sr-only">
                            英単語テスト 無料 アプリ システム英単語 ターゲット1900 New Horizon
                            間違えた単語 自動生成 テスト作成 シス単 DUO 3.0
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative z-10">
                            <TestSetupContent embedMode={true} />
                        </div>
                    </div>
                </section>

                {/* === Screenshot Carousel === */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">使いやすいインターフェース</h2>
                        <p className="text-slate-600">
                            シンプルで直感的な操作性。学習の妨げになるものは一切ありません。
                        </p>
                    </div>
                    <ScreenshotCarousel
                        isManual={isManual}
                        setIsManual={setIsManual}
                        carouselOuterRef={carouselOuterRef}
                        trackRef={trackRef}
                        manualResumeTimerRef={manualResumeTimerRef}
                    />
                </section>

                {/* === Features Section (Rich Cards) === */}
                <section className="py-20 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Mistapが選ばれる3つの理由</h2>
                            <p className="text-slate-600 text-lg">
                                ただ単語を覚えるだけではありません。Mistapは「定着させる」ことに特化したシステムです。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                                <div className={`mb-6 w-16 h-16 ${theme.badgeBg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <span className={`text-3xl font-black ${theme.iconColor}`}>01</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">タップで簡単記録</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    分からなかった単語をタップするだけ。面倒な入力は一切不要で、誰でも直感的に「苦手リスト」を作成できます。
                                </p>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                                <div className={`mb-6 w-16 h-16 ${theme.badgeBg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <span className={`text-3xl font-black ${theme.iconColor}`}>02</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">自動で復習生成</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    記録された苦手単語は、最適なタイミングで復習テストとして出題。忘却曲線に基づいた効率的な学習が可能です。
                                </p>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                                <div className={`mb-6 w-16 h-16 ${theme.badgeBg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <span className={`text-3xl font-black ${theme.iconColor}`}>03</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">豊富な教材対応</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    システム英単語、ターゲット、DUO3.0など、受験生や学習者に人気の単語帳に完全対応しています。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === Textbooks Section === */}
                <TextbooksSection />

                {/* === Testimonials Section === */}
                <TestimonialsSection />

                {/* === Blog Section === */}
                <BlogSection blogPosts={blogPosts} blogLoading={blogLoading} />

                {/* === CTA Section (Styled) === */}
                <section className={`py-20 bg-gradient-to-br ${theme.ctaGradient} text-white text-center`}>
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">今日から、効率的な学習を始めよう</h2>
                        <p className={`text-xl mb-10 max-w-2xl mx-auto ${theme.ctaText}`}>
                            登録は無料。クレジットカードも必要ありません。<br />
                            あなたの単語学習を、Mistapがサポートします。
                        </p>
                        <button
                            onClick={handleSignupClick}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-rose-600 rounded-full font-bold text-xl shadow-lg hover:shadow-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300"
                        >
                            無料で始める
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* SEO強化ブロック: 非指名検索対策 */}
                <section className="py-16 bg-slate-50 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-slate mx-auto text-slate-600">
                            <h3 className="text-2xl font-bold text-slate-800 text-center mb-6">Mistapについて</h3>
                            <p className="mb-4">
                                Mistap（ミスタップ）は、市販の英単語帳や学校の教科書に対応した無料の単語テスト作成・学習アプリです。
                                『システム英単語』や『ターゲット1900』、『DUO 3.0』といった大学受験対策の定番教材から、
                                『New Horizon』『New Crown』などの中学校検定教科書まで幅広く対応しています。
                            </p>
                            <p className="mb-4">
                                最大の特徴は、「間違えた単語」だけを自動的に記録し、効率的に復習できる点です。
                                自分で単語カードを作る手間は一切不要。アプリ上でテストを行い、分からなかった単語をタップするだけで、あなた専用の「苦手リスト」が完成します。
                            </p>
                            <p>
                                高校生の大学入試対策、中学生の定期テスト対策、そして社会人のTOEICや英語学習のやり直しまで。
                                Mistapは、効率的に英単語を暗記したいすべての学習者をサポートします。
                                登録は完全無料。今すぐあなたの持っている単語帳でテストを始めましょう。
                            </p>
                        </div>
                    </div>
                </section>

                <MistapFooter />
            </main>
        </div>
    );
}
