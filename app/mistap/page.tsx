'use client';

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import { updateLoginStreak } from "@/lib/mistap/loginTracker";
import Background from "@/components/mistap/Background";
import Link from "next/link";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();
  // carousel refs & state for manual swipe / nav
  const carouselOuterRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isManual, setIsManual] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startScrollRef = useRef<number | null>(null);
  const manualResumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === '1') {
      setIsSignup(true);
      setShowLoginForm(true);
      // Clean up URL to root without params using replaceState (avoids redirect detection)
      window.history.replaceState({}, '', '/');
    }
    if (params.get('login') === '1') {
      setIsSignup(false);
      setShowLoginForm(true);
      // Clean up URL to root without params using replaceState (avoids redirect detection)
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
      } catch (error) {
        console.error('ブログ記事の取得に失敗:', error);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setAwaitingConfirmation(false);
    setResendMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // show helpful message when email isn't confirmed
      if (/confirm/i.test(error.message || "")) {
        setError("Email not confirmed. Please check your email.");
        setAwaitingConfirmation(true);
        setLoading(false);
        return;
      }

      setError(error.message);
      setLoading(false);
      return;
    }

    // Update login streak after successful login
    if (data?.user?.id) {
      try {
        await updateLoginStreak(data.user.id);
      } catch (err) {
        console.error('Failed to update login streak:', err);
        // Don't block login flow if streak update fails
      }
    }

    // Login successful -> go to home
    router.push("/mistap/home");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    // Require all signup fields
    if (!fullName || !fullName.trim()) {
      setError('表示名を入力してください');
      return;
    }
    if (!grade) {
      setError('学年を選択してください');
      return;
    }
    if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Redirect to a dedicated confirmation landing page so we can show
      // a clear "メール認証が完了しました" screen after the user clicks
      // the link in their email.
      options: { emailRedirectTo: `${window.location.origin}/mistap/email-verified` },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      // create or update profile row (use upsert to avoid races/duplicates)
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: fullName || null,
        role: 'student',
        grade: grade || null,
      }).select();

      if (upsertError) {
        // log but continue
        console.error('profile upsert error:', upsertError);
      }
    }

    setLoading(false);
    // Respect confirmation flow: show message asking user to check their email
    setAwaitingConfirmation(true);
  }

  async function resendConfirmation() {
    setResendMessage(null);
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/mistap` },
    });
    setLoading(false);
    if (error) {
      setError("確認メールの再送に失敗しました: " + error.message);
      return;
    }
    setResendMessage("確認メールを再送しました。メール内のリンクで確認してください。");
  }

  if (showLoginForm) {
    return (
      <div className="min-h-screen">
        <Background className="flex items-start justify-center min-h-screen p-4">
          {/* ログインフォーム */}
          <div className="bg-white/40 backdrop-blur-lg p-4 md:p-8 rounded-xl shadow-xl relative z-10 border border-white/50 w-full max-w-md md:max-w-lg" style={{ marginTop: 'calc(64px + 48px)' }}>
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">{isSignup ? "新規登録" : "ログイン"}</h1>
            </div>
            <form onSubmit={isSignup ? handleSignup : handleLogin}>
              {isSignup && (
                <>
                  <label className="block mb-2 text-gray-700 text-sm md:text-base">表示名</label>
                  <input
                    className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    placeholder="お名前を入力してください"
                  />

                  <label className="block mb-2 text-gray-700 text-sm md:text-base">学年 <span className="text-red-600">*</span></label>
                  <select className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base" value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="中1">中1</option>
                    <option value="中2">中2</option>
                    <option value="中3">中3</option>
                    <option value="高1">高1</option>
                    <option value="高2">高2</option>
                    <option value="高3">高3</option>
                    <option value="既卒生">既卒生</option>
                    <option value="大学生・社会人">大学生・社会人</option>
                  </select>
                </>
              )}
              <label className="block mb-2 text-gray-700 text-sm md:text-base">メールアドレス</label>
              <input
                className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="example@email.com"
              />

              <label className="block mb-2 text-gray-700 text-sm md:text-base">パスワード</label>
              <input
                className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="パスワードを入力してください"
              />

              {error && <p className="text-red-600 mb-4 text-sm md:text-base">{error}</p>}
              {awaitingConfirmation && (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-gray-700 mb-2 text-sm md:text-base">登録ありがとうございます。確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。</p>
                  <button type="button" className="text-sm text-red-600 underline hover:text-red-700 block mb-2" onClick={resendConfirmation} disabled={loading}>
                    確認メールを再送する
                  </button>
                  {resendMessage && <p className="text-sm text-green-600">{resendMessage}</p>}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 md:py-2 rounded-xl text-base md:text-base font-semibold"
                disabled={loading}
              >
                {loading
                  ? isSignup
                    ? "登録中..."
                    : "ログイン中..."
                  : isSignup
                    ? "新規登録"
                    : "ログイン"}
              </button>

              <div className="mt-4 text-center">
                <button type="button" className="text-sm md:text-sm text-gray-600 underline hover:text-gray-800 p-2" onClick={() => setIsSignup((s) => !s)}>
                  {isSignup ? "すでにアカウントをお持ちの方はログイン" : "新規登録はこちら"}
                </button>
              </div>
            </form>
          </div>
        </Background>
      </div>
    );
  }

  return (
    <Background>
      <div className="min-h-screen">
        {/* ヘッダー */}
        <header className="pt-6 pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative">
              {/* 中央揃えの大見出し（削除済み: "Mistap"） */}

              {/* 右上のボタンは絶対配置で表示 */}
              <div className="absolute right-0 top-0 md:top-2">
                <button
                  onClick={async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      router.push('/mistap/home');
                    } else {
                      setIsSignup(false);
                      setShowLoginForm(true);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                >
                  ログイン
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* プロモーションカード（ヘッダー下）を削除しました */}

        {/* ヒーローセクション */}
        <section className="py-6 md:py-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-12 shadow-xl border border-white/50 mb-8">
              <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
                もう忘れない。<br />「間違えた単語」に集中する<br />新しい単語学習システム。
              </h1>
              <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
                『システム英単語』『ターゲット1900』『LEAP』『DUO3.0』、社会人・大学生向けの『TOEIC 金のフレーズ』、さらに古文単語帳など、主要な単語帳に幅広く対応。<br />
                全ての知識を確実に定着させます。
              </p>
              <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    setIsSignup(true);
                    setShowLoginForm(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
                >
                  アカウント作成(無料)
                </button>
                <button
                  onClick={async () => {
                    if (demoLoading) return;
                    setDemoLoading(true);
                    try {
                      const { data: { user } } = await supabase.auth.getUser();
                      if (user) {
                        router.push('/mistap/home');
                      } else {
                        router.push('/mistap/test-setup');
                      }
                    } catch (error) {
                      console.error('Error checking auth status:', error);
                      router.push('/mistap/test-setup');
                    } finally {
                      setDemoLoading(false);
                    }
                  }}
                  disabled={demoLoading}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {demoLoading ? '読み込み中...' : 'デモを試す'}
                </button>
                <Link
                  href="/mistap/about"
                  className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  詳しく見る
                </Link>
                <button
                  onClick={() => {
                    const element = document.getElementById('textbook-list');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  対応教材一覧
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* スクリーンショットカルーセルセクション (自動 + 手動スワイプ/ナビ) */}
        <section className="py-8 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              Mistap プレビュー
            </h3>
            {/* outer: switches between overflow-hidden (auto animation) and overflow-x-auto (manual swipe) */}
            <div
              ref={carouselOuterRef}
              className={`relative w-full ${isManual ? 'overflow-x-auto' : 'overflow-hidden'}`}
              onPointerDown={(e) => {
                // begin manual interaction
                setIsManual(true);
                // capture pointer to receive move/up events
                try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch (err) { }
                startXRef.current = e.clientX;
                if (carouselOuterRef.current) startScrollRef.current = carouselOuterRef.current.scrollLeft;
                // clear any existing resume timer
                if (manualResumeTimerRef.current) { clearTimeout(manualResumeTimerRef.current); manualResumeTimerRef.current = null; }
              }}
              onPointerMove={(e) => {
                if (startXRef.current == null) return;
                const dx = startXRef.current - e.clientX;
                if (carouselOuterRef.current && startScrollRef.current != null) {
                  carouselOuterRef.current.scrollLeft = startScrollRef.current + dx;
                }
              }}
              onPointerUp={(e) => {
                try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch (err) { }
                startXRef.current = null;
                startScrollRef.current = null;
                // resume auto after 4s of inactivity
                manualResumeTimerRef.current = window.setTimeout(() => setIsManual(false), 4000);
              }}
              onPointerCancel={() => {
                startXRef.current = null;
                startScrollRef.current = null;
                manualResumeTimerRef.current = window.setTimeout(() => setIsManual(false), 4000);
              }}
            >
              <div ref={trackRef} className={`flex whitespace-nowrap ${isManual ? '' : 'animate-scroll-x'}`}>
                {/** screenshots (duplicated for seamless loop) */}
                {['Screenshot1', 'Screenshot2', 'Screenshot3', 'Screenshot4', 'Screenshot5'].map((name) => (
                  <div key={name + '-a'} className="relative flex-shrink-0 w-48 md:w-64 h-96 md:h-[32rem] rounded-xl shadow-lg border border-gray-200 mr-4 overflow-hidden">
                    <Image src={`/mistap/${name}.png`} alt={`Mistapアプリの${name}`} fill className="object-contain" />
                  </div>
                ))}
                {['Screenshot1', 'Screenshot2', 'Screenshot3', 'Screenshot4', 'Screenshot5'].map((name) => (
                  <div key={name + '-b'} className="relative flex-shrink-0 w-48 md:w-64 h-96 md:h-[32rem] rounded-xl shadow-lg border border-gray-200 mr-4 overflow-hidden">
                    <Image src={`/mistap/${name}.png`} alt={`Mistapアプリの${name}`} fill className="object-contain" />
                  </div>
                ))}
              </div>

              {/* Prev / Next buttons (visible on desktop) */}
              <button
                aria-label="前へ"
                className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors z-10"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsManual(true);
                  if (carouselOuterRef.current && trackRef.current) {
                    const first = trackRef.current.children[0] as HTMLElement | undefined;
                    if (first) {
                      const style = window.getComputedStyle(first);
                      const mr = parseFloat(style.marginRight || '0');
                      const delta = -(first.offsetWidth + mr);
                      carouselOuterRef.current.scrollBy({ left: delta, behavior: 'smooth' });
                      if (manualResumeTimerRef.current) clearTimeout(manualResumeTimerRef.current);
                      manualResumeTimerRef.current = window.setTimeout(() => setIsManual(false), 4000);
                    }
                  }
                }}
              >
                ‹
              </button>
              <button
                aria-label="次へ"
                className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors z-10"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsManual(true);
                  if (carouselOuterRef.current && trackRef.current) {
                    const first = trackRef.current.children[0] as HTMLElement | undefined;
                    if (first) {
                      const style = window.getComputedStyle(first);
                      const mr = parseFloat(style.marginRight || '0');
                      const delta = first.offsetWidth + mr;
                      carouselOuterRef.current.scrollBy({ left: delta, behavior: 'smooth' });
                      if (manualResumeTimerRef.current) clearTimeout(manualResumeTimerRef.current);
                      manualResumeTimerRef.current = window.setTimeout(() => setIsManual(false), 4000);
                    }
                  }
                }}
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-8 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              なぜMistapが選ばれるのか
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

              {/* 特徴1 */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50 text-center">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">✏️</div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">タップで簡単記録</h4>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  間違えた単語をタップするだけで<br className="md:hidden" />簡単に記録できます
                </p>
              </div>

              {/* 特徴2 */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50 text-center">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🔄</div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">復習テスト機能</h4>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  間違えた単語のみで<br className="md:hidden" />復習テストを自動作成
                </p>
              </div>

              {/* 特徴3 */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50 text-center">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">📖</div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">豊富な教材対応</h4>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  LEAP、ターゲット、システム英単語<br className="md:hidden" />古文単語帳にも完全対応
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 対応教材リストセクション */}
        <section id="textbook-list" className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              対応教材一覧
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

              {/* 中学生向け教材 */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                <h4 className="text-xl md:text-2xl font-semibold mb-6 text-center text-blue-600">
                  📚 中学生向け
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">過去形</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">過去形、過去分詞形</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">絶対覚える英単語150</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">ターゲット1800</span>
                  </li>
                </ul>
              </div>

              {/* 高校生向け教材 */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                <h4 className="text-xl md:text-2xl font-semibold mb-6 text-center text-red-600">
                  🎓 高校生向け
                </h4>

                {/* 英単語帳 */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold mb-3 text-gray-800">英単語帳（小テスト対応）</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">LEAP 小テスト</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">ターゲット1200 小テスト</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">システム英単語 小テスト</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">ターゲット1900 小テスト</span>
                    </li>
                  </ul>
                </div>

                {/* 古文単語帳 */}
                <div>
                  <h5 className="text-lg font-semibold mb-3 text-gray-800">古文単語帳</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">重要古文単語315</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">Key＆Point古文単語330</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">ベストセレクション古文単語325</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 社会人・大学生向け教材 */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                <h4 className="text-xl md:text-2xl font-semibold mb-6 text-center text-purple-600">
                  💼 社会人・大学生向け
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">TOEIC L&R TEST 出る単特急金のフレーズ</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* 追加の説明 */}
            <div className="mt-8 md:mt-12 text-center">
              <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-4">
                その他の教材についても順次対応予定です。<br className="md:hidden" />
                ご要望があれば下記からリクエストください。
              </p>
              <Link
                href="/mistap/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-semibold transition-colors"
              >
                📚 単語帳リクエスト
              </Link>
            </div>
          </div>
        </section>

        {/* 利用者の声セクション */}
        <section className="py-8 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              利用者の声
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">高校2年生 A.Tさん</p>
                    <p className="text-xs md:text-sm text-gray-600">システム英単語使用</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  「間違えた単語をタップするだけで記録できるから便利！」
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">中学3年生 M.Sさん</p>
                    <p className="text-xs md:text-sm text-gray-600">ターゲット1900使用</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  「間違えた単語だけの復習テストが自動で作られるので効率的に覚えられます。」
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    R
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">高校3年生 R.Kさん</p>
                    <p className="text-xs md:text-sm text-gray-600">ターゲット1900使用</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  「受験勉強で愛用しています。苦手な単語を繰り返し復習できるので助かっています」
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    Y
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">高校1年生 Y.Hさん</p>
                    <p className="text-xs md:text-sm text-gray-600">システム英単語使用</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  「学校のテストの前に復習テストを何度も繰り返したら、毎回の単語テストで満点取れるようになりました！」
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">中学2年生 S.Nさん</p>
                    <p className="text-xs md:text-sm text-gray-600">ターゲット1800使用</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  「スマホで隙間時間に復習できるから、通学時間も無駄にならなくなりました！」
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    K
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">高校3年生 K.Mさん</p>
                    <p className="text-xs md:text-sm text-gray-600">LEAP使用</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  「自分専用の復習リストができるから、市販の単語帳より効率的。定期テストの単語の大問で満点取れるようになりました！」
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ブログ記事セクション */}
        {!blogLoading && blogPosts.length > 0 && (
          <section className="py-8 md:py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                📝 ブログ記事
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {blogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/mistap/blog/${post.id}`}
                    className="bg-white/40 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 overflow-hidden transition-shadow hover:shadow-2xl group"
                  >
                    {post.eyecatch && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={post.eyecatch.url}
                          alt={post.title}
                          width={post.eyecatch.width || 1200}
                          height={post.eyecatch.height || 630}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/mistap/blog"
                  className="inline-block bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  すべての記事を見る →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTAセクション */}
        <section className="py-8 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 md:p-12 shadow-xl text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                今すぐ英語力向上を<br className="md:hidden" />始めよう
              </h3>
              <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed">
                無料で始められます<br className="md:hidden" />
                アカウント登録は1分で完了！
              </p>
              <button
                onClick={() => {
                  setIsSignup(true);
                  setShowLoginForm(true);
                }}
                className="bg-white text-red-600 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-colors"
              >
                無料で始める
              </button>
            </div>
          </div>
        </section>
      </div>
    </Background>
  );
}