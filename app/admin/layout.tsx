'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/mistap/supabaseClient'; // Ensure this matches your project's client import
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white fixed h-full hidden md:block z-10">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">EduLens Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        ダッシュボード
                    </Link>
                    <Link href="/admin/naruhodo-logs" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        ナルホドレンズ履歴
                    </Link>
                    <Link href="/admin/contacts" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        お問い合わせ
                    </Link>
                    <Link href="/admin/exams" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        試験日程管理
                    </Link>
                    <Link href="/admin/announcements" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        お知らせ管理
                    </Link>
                    <Link href="/admin/affiliates" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        アフィリエイト管理
                    </Link>
                    <Link href="/admin/analytics" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        📊 データ分析
                    </Link>
                    <Link href="/admin#referral-settings" prefetch={false} className="block px-4 py-2 rounded hover:bg-slate-700 transition">
                        招待キャンペーン管理
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
                    <Link href="/" prefetch={false} className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition">
                        &larr; サイトに戻る
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
