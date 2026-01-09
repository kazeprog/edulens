'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // 認証状態から派生
  const isLoggedIn = !loading && !!user;
  const name = profile?.full_name ?? user?.email?.split('@')[0] ?? null;

  // メニューの外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('header')) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  async function handleLogout() {
    await signOut();
    router.push('/mistap');
  }

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    if (isLoggedIn) {
      // 既にログイン済みの場合はホームへ
      router.push('/mistap/home');
    } else {
      // EduLensの統一ログイン画面へリダイレクト（ログイン後にMistapホームへ戻る）
      router.push('/login?redirect=/mistap/home');
    }
  };

  // Logo now links to the home page via Next.js Link below.

  return (
    <header className="w-full py-2 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50">
      <Link href="/mistap" prefetch={false} className="flex items-center group relative hover:opacity-80 transition-opacity" aria-label="Mistap Home">
        <Image
          src="/mistap-logo.png?v=new"
          alt="Mistap"
          width={200}
          height={60}
          className="h-10 sm:h-14 w-auto object-contain"
          style={{ width: 'auto' }}
          priority
          unoptimized
        />
      </Link>

      {/* ログイン済み: ハンバーガーメニュー / 未ログイン: ログイン・新規登録ボタン */}
      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="メニュー"
          >
            <span className={`block w-6 h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* ドロップダウンメニュー（ハンバーガーメニューの下に表示） */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
              <div className="py-1">
                {/* EduLens トップへ */}
                <Link
                  href="/"
                  prefetch={false}
                  className="block py-3 px-4 text-blue-600 hover:bg-blue-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  EduLens トップへ
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                {/* ホーム */}
                <Link
                  href="/mistap/home"
                  prefetch={false}
                  className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('close-login-form'));
                    }
                  }}
                >
                  ホーム
                </Link>
                {/* Show profile link even when name is not set so users can edit their info */}
                <Link
                  href="/mistap/profile"
                  prefetch={false}
                  className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {name ? `こんにちは ${name}さん` : 'プロフィールを編集'}
                </Link>
                <Link
                  href="/mistap/test-setup"
                  prefetch={false}
                  className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  テスト作成
                </Link>
                <Link
                  href="/mistap/history"
                  prefetch={false}
                  className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  これまでの成績
                </Link>
                <Link
                  href="/mistap/contact"
                  prefetch={false}
                  className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  お問い合わせ
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                >
                  ログアウト
                </button>
              </div>
            </div>
          )}
        </div>
      ) : loading ? (
        /* ローディング中 */
        <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        /* 未ログイン: ログイン・新規登録ボタン */
        <div className="flex items-center gap-3">
          <Link
            href="/login?redirect=/mistap/home"
            prefetch={false}
            className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/login?mode=signup&redirect=/mistap/home"
            prefetch={false}
            className="text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            新規登録
          </Link>
        </div>
      )}
    </header>
  );
}

/*

-- 認証ユーザーが自分の profile を INSERT/UPDATE できるようにする例
CREATE POLICY "Insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

*/