'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function MathtapHeader() {
    const router = useRouter();
    const { user, profile, loading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
        router.push('/mathtap');
    }

    return (
        <header className="w-full py-3 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
            <Link href="/mathtap" prefetch={false} className="flex items-center gap-2 group hover:opacity-80 transition-opacity" aria-label="Mathtap Home">
                <NextImage
                    src="/mathtapheader.png"
                    alt="Mathtap"
                    width={200}
                    height={60}
                    className="h-10 sm:h-14 w-auto object-contain"
                    style={{ width: 'auto' }}
                    priority
                    unoptimized
                />
            </Link>

            {/* ログイン済み: ハンバーガーメニュー */}
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

                    {/* ドロップダウンメニュー */}
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
                                    href="/mathtap/home"
                                    prefetch={false}
                                    className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ホーム
                                </Link>
                                {name && (
                                    <div className="py-3 px-4 text-slate-500 text-sm">
                                        こんにちは {name}さん
                                    </div>
                                )}
                                <Link
                                    href="/mathtap/test-setup"
                                    prefetch={false}
                                    className="block py-3 px-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    テスト作成
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
                        href="/login?redirect=/mathtap/home"
                        prefetch={false}
                        className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        ログイン
                    </Link>
                    <Link
                        href="/login?mode=signup&redirect=/mathtap/home"
                        prefetch={false}
                        className="text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    >
                        新規登録
                    </Link>
                </div>
            )}
        </header>
    );
}
