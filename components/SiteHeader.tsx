'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function SiteHeader() {
    const { user, profile, loading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsMenuOpen(false);
        await signOut();
        window.location.reload();
    };

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
                {/* ユーザー情報がある場合はすぐに表示（ローディング中でも） */}
                {user ? (
                    /* ログイン済み: ハンバーガーメニュー */
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="メニュー"
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* ドロップダウンメニュー */}
                        {isMenuOpen && (
                            <>
                                {/* オーバーレイ */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                />

                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                    {/* ユーザー情報 */}
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-medium text-slate-800">
                                            {profile?.full_name || user.email?.split('@')[0] || 'ユーザー'}さん
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* メニュー項目 */}
                                    <div className="py-2">
                                        <Link
                                            href="/mistap/home"
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Mistap ホーム
                                        </Link>
                                        <Link
                                            href="/EduTimer"
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            EduTimer
                                        </Link>
                                    </div>

                                    {/* ログアウト */}
                                    <div className="border-t border-slate-100 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            ログアウト
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : loading ? (
                    /* ローディング中（ユーザー情報がまだ取得できていない場合のみ） */
                    <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
                ) : (
                    /* 未ログイン: ログイン・新規登録ボタン */
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            ログイン
                        </Link>
                        <Link
                            href="/login?mode=signup"
                            className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        >
                            新規登録
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}
