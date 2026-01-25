'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('認証情報を処理中...');

    useEffect(() => {
        const supabase = getSupabase();
        if (!supabase) {
            setMessage('エラー: 認証サービスを初期化できませんでした');
            return;
        }

        const redirectUrl = searchParams.get('redirect') || '/';

        // セッションの確立を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                if (session) {
                    setMessage('認証に成功しました。リダイレクト中...');
                    // 少し待ってからリダイレクト（確実にCookieなどをセットさせるため）
                    setTimeout(() => {
                        router.replace(redirectUrl);
                    }, 500);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 max-w-sm w-full text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h1 className="text-lg font-bold text-slate-800 mb-2">認証処理を実行中</h1>
                <p className="text-sm text-slate-600">{message}</p>
            </div>
        </div>
    );
}
