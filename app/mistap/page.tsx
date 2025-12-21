'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
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
  const { user, loading: authLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const router = useRouter();

  // Carousel state
  const carouselOuterRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isManual, setIsManual] = useState(false);
  const manualResumeTimerRef = useRef<number | null>(null);

  // ログイン済みユーザーは自動的にホームへリダイレクト
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/mistap/home');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === '1') {
      setIsSignup(true);
      setShowLoginForm(true);
      window.history.replaceState({}, '', '/');
    }
    if (params.get('login') === '1') {
      setIsSignup(false);
      setShowLoginForm(true);
      window.history.replaceState({}, '', '/');
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

  // 認証確認中またはログイン済み（リダイレクト待ち）の場合はローディング表示
  if (authLoading || user) {
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
        {/* ヘッダー */}
        <header className="pt-6 pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative">
              <div className="absolute right-0 top-0 md:top-2">
                <button
                  onClick={() => {
                    // EduLensの統一ログイン画面へリダイレクト（ログイン後にMistapホームへ戻る）
                    router.push('/login?redirect=/mistap/home');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                >
                  ログイン
                </button>
              </div>
            </div>
          </div>
        </header>

        <HeroSection onSignupClick={handleSignupClick} />

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
      </div>
    </Background>
  );
}