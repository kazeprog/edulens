'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Background from "@/components/mistap/Background";
import LoginForm from "@/components/mistap/LoginForm";
import HeroSection from "@/components/mistap/HeroSection";
import ScreenshotCarousel from "@/components/mistap/ScreenshotCarousel";
import FeaturesSection from "@/components/mistap/FeaturesSection";
import TextbooksSection from "@/components/mistap/TextbooksSection";
import TestimonialsSection from "@/components/mistap/TestimonialsSection";
import BlogSection from "@/components/mistap/BlogSection";
import CTASection from "@/components/mistap/CTASection";
import TestSetupContent from "@/components/mistap/TestSetupContent";

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

export default function Home() {
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
      setIsSignup(true);
      setShowLoginForm(true);
      window.history.replaceState({}, '', '/mistap');
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
      <Background>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">読み込み中...</div>
        </div>
      </Background>
    );
  }

  if (showLoginForm) {
    return <LoginForm initialIsSignup={isSignup} />;
  }

  return (
    <Background>
      <div className="min-h-screen">
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

        {/* ヘッダー */}
        <header className="pt-6 pb-10">
          <div className="max-w-6xl mx-auto px-4">
          </div>
        </header>

        <main>
          <HeroSection onSignupClick={handleSignupClick} />

          {/* テスト作成セクション（デモ） */}
          <section className="py-12 px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📚 今すぐ試してみる</h2>
              <TestSetupContent embedMode={true} />
            </div>
          </section>

          <ScreenshotCarousel
            isManual={isManual}
            setIsManual={setIsManual}
            carouselOuterRef={carouselOuterRef}
            trackRef={trackRef}
            manualResumeTimerRef={manualResumeTimerRef}
          />

          <FeaturesSection />

          <TextbooksSection />

          <TestimonialsSection />

          <BlogSection blogPosts={blogPosts} blogLoading={blogLoading} />

          <CTASection onSignupClick={handleSignupClick} />
        </main>
      </div>
    </Background>
  );
}