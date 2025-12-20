'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import EduLensLoginForm from '@/components/EduLensLoginForm';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();

    const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const redirect = searchParams.get('redirect') || '/';

    // ログイン済みならリダイレクト
    useEffect(() => {
        if (!loading && user) {
            router.push(redirect);
        }
    }, [user, loading, redirect, router]);

    // ローディング中またはログイン済み（リダイレクト待ち）
    if (loading || user) {
        return (
            <main className="min-h-[calc(100vh-160px)] flex items-center justify-center">
                <div className="text-slate-500">読み込み中...</div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-white to-slate-50 py-12 px-4">
            <EduLensLoginForm initialMode={mode} redirectUrl={redirect} />
        </main>
    );
}

export default function LoginPage() {
    return (
        <>
            <SiteHeader />
            <Suspense fallback={
                <main className="min-h-[calc(100vh-160px)] flex items-center justify-center">
                    <div className="text-slate-500">読み込み中...</div>
                </main>
            }>
                <LoginContent />
            </Suspense>
            <SiteFooter />
        </>
    );
}
