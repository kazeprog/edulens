'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SiteHeader() {
    const { user, profile, loading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        setIsMenuOpen(false);
        await signOut();
        // ホームへリダイレクト（リロードより確実に状態がリセットされる）
        window.location.href = '/';
    };

    // リダイレクト先URL（ログインページ自身の場合は付与しない）
    const redirectParam = pathname && pathname !== '/login'
        ? `redirect=${encodeURIComponent(pathname)}`
        : '';

    const loginUrl = redirectParam ? `/login?${redirectParam}` : '/login';
    const signupUrl = redirectParam ? `/login?mode=signup&${redirectParam}` : '/login?mode=signup';

    return (
        <header className="w-full py-4 px-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50 border-b border-slate-100">
            <Link href="/" className="w-48 h-12 block hover:opacity-80 transition-opacity relative">
                <Image
                    src="/logo.png"
                    alt="EduLens"
                    fill
                    className="object-contain"
                    priority
                />
            </Link>

            <nav className="flex items-center gap-4">
                {!loading && !user && (
                    <div className="hidden md:flex items-center gap-3 mr-4">
                        <Link
                            href={loginUrl}
                            className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            ログイン
                        </Link>
                        <Link
                            href={signupUrl}
                            className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        >
                            新規登録
                        </Link>
                    </div>
                )}

                {loading ? (
                    <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
                ) : (
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

                        {/* ドロップダウンメニュー */}
                        {isMenuOpen && (
                            <>
                                {/* オーバーレイ */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                />

                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                                    <div className="py-1">
                                        {/* ユーザー情報 (ログイン時のみ) */}
                                        {user && (
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="text-sm font-medium text-slate-800">
                                                    {profile?.full_name || user.email?.split('@')[0] || 'ユーザー'}さん
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        )}

                                        {/* 未ログイン時のモバイル用メニュー */}
                                        {!user && (
                                            <div className="md:hidden border-b border-slate-100 mb-1 pb-1">
                                                <Link
                                                    href={loginUrl}
                                                    className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    ログイン
                                                </Link>
                                                <Link
                                                    href={signupUrl}
                                                    className="block py-3 px-4 text-blue-600 hover:bg-slate-50 transition-colors font-bold border-l-4 border-transparent hover:border-blue-500"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    新規登録
                                                </Link>
                                            </div>
                                        )}

                                        {/* メニュー項目 */}
                                        <Link
                                            href="/countdown"
                                            className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            カウントダウン
                                        </Link>
                                        {user && (
                                            <Link
                                                href="/mistap/home"
                                                className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Mistap
                                            </Link>
                                        )}
                                        <Link
                                            href="/EduTimer"
                                            className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            EduTimer
                                        </Link>
                                        <Link
                                            href="/blacklens"
                                            className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-purple-500"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            BlackLens
                                        </Link>
                                        {user && (
                                            <Link
                                                href="/mistap/blog"
                                                className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-orange-500"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Mistapブログ
                                            </Link>
                                        )}

                                        {/* ログアウト (ログイン時のみ) */}
                                        {user && (
                                            <>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 transition-colors font-medium border-l-4 border-transparent hover:border-red-500"
                                                >
                                                    ログアウト
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
