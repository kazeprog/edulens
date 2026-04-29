'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/mistap/supabaseClient'; // Ensure this matches your project's client import
import Link from 'next/link';

const adminNavItems = [
    { href: '/admin', label: 'ダッシュボード' },
    { href: '/admin/naruhodo-logs', label: 'ナルホドレンズ履歴' },
    { href: '/admin/contacts', label: 'お問い合わせ' },
    { href: '/admin/exams', label: '試験日程管理' },
    { href: '/admin/announcements', label: 'お知らせ管理' },
    { href: '/admin/affiliates', label: 'アフィリエイト管理' },
    { href: '/admin/analytics', label: '📊 データ分析' },
    { href: '/admin#referral-settings', label: '招待キャンペーン管理' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.replace('/login'); // Redirect to login if not authenticated
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    router.replace('/'); // Redirect to home if not admin
                }
            } catch (error) {
                console.error('Admin check failed:', error);
                router.replace('/');
            } finally {
                setLoading(false);
            }
        }

        checkAdmin();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-500">Authenticating...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
            {/* Mobile Header */}
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur md:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link
                        href="/admin"
                        prefetch={false}
                        className="text-base font-bold text-slate-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        EduLens Admin
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="admin-mobile-menu"
                    >
                        {isMobileMenuOpen ? '閉じる' : 'メニュー'}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <nav id="admin-mobile-menu" className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg">
                        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
                            {adminNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/"
                                prefetch={false}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                            >
                                &larr; サイトに戻る
                            </Link>
                        </div>
                    </nav>
                )}
            </header>

            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white fixed h-full hidden md:block z-10">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">EduLens Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    {adminNavItems.map((item) => (
                        <Link key={item.href} href={item.href} prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
                    <Link href="/" prefetch={false} className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition">
                        &larr; サイトに戻る
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-full min-w-0 flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
