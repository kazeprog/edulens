'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function EmailVerifiedPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    // カウントダウン
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // カウントダウンが0になったらリダイレクト
    useEffect(() => {
        if (countdown === 0) {
            router.push('/');
        }
    }, [countdown, router]);

    return (
        <>
            <SiteHeader />
            <main className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            メール認証が完了しました
                        </h1>
                        <p className="text-slate-600 mb-6">
                            EduLensアカウントが有効化されました。<br />
                            全てのサービスをご利用いただけます。
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            {countdown > 0 ? `${countdown}秒後にトップページへ移動します...` : 'リダイレクト中...'}
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                        >
                            今すぐトップページへ
                        </Link>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </>
    );
}
