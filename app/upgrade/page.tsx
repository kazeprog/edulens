'use client';

import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import UpgradeButton from '@/components/UpgradeButton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Star, Zap, Share2, Copy } from 'lucide-react';

export default function UpgradePage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            // If not logged in, redirect to login page with return url
            setIsRedirecting(true);
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `/login?redirect=${returnUrl}`;
        }
    }, [user, loading, router]);

    if (loading || isRedirecting) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <SiteHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-pulse text-slate-500 font-medium">読み込み中...</div>
                </div>
            </div>
        );
    }

    if (!user) return null; // Should be redirected

    const isPro = !!profile?.is_pro;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                            Proプランへアップグレード
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            学習の制限を解除して、AI添削と質問機能をフル活用しよう。
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                                <div className="space-y-6 flex-1">
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        EduLens Pro
                                    </h2>
                                    <ul className="space-y-4">
                                        {[
                                            'サイト内の広告非表示',
                                            'Mistapのすべての機能を利用可能',
                                            'ナルホドレンズ質問回数 1日20回',
                                            '英検AI添削 回数無制限',
                                            '大学入試英作文添削 無制限',
                                            '優先的なサポート',
                                            '新機能への早期アクセス'
                                        ].map((item, idx) => {
                                            const isHighlight = item === 'サイト内の広告非表示' || item === 'Mistapのすべての機能を利用可能';
                                            return (
                                                <li key={idx} className={`flex items-center gap-3 font-medium ${isHighlight ? 'text-blue-600 text-xl font-bold' : 'text-slate-700'}`}>
                                                    <div className={`flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center ${isHighlight ? 'w-8 h-8' : 'w-6 h-6'}`}>
                                                        <CheckCircle2 className={`${isHighlight ? 'w-5 h-5' : 'w-4 h-4'} text-blue-600`} />
                                                    </div>
                                                    {item}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="text-center mb-6">
                                        <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">月額プラン</span>
                                        <div className="flex items-baseline justify-center mt-1">
                                            <span className="text-4xl font-extrabold text-slate-900">¥500</span>
                                            <span className="text-slate-500 ml-1">/月</span>
                                        </div>
                                    </div>

                                    {isPro ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
                                                <CheckCircle2 className="w-5 h-5" />
                                                Proプラン契約中
                                            </div>
                                            <a href="/portal" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
                                                契約の管理はこちら
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <UpgradeButton userId={user.id} />
                                            <p className="text-xs text-center text-slate-400 mt-4">
                                                いつでもキャンセル可能です
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!isPro && (
                                <div className="mt-10 pt-10 border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
                                        保護者の方に決済をお願いする場合
                                    </h3>
                                    <p className="text-sm text-slate-500 text-center mb-6 max-w-lg mx-auto">
                                        ご自身のスマホで決済できない場合は、下記のリンクを保護者の方に送ることで、保護者様のスマホで決済手続きを行えます。
                                    </p>

                                    <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                const url = `${window.location.origin}/upgrade/share?uid=${user.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert("リンクをコピーしました！保護者の方に送ってください。");
                                            }}
                                            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            <Copy className="w-5 h-5 text-slate-500" />
                                            リンクをコピー
                                        </button>

                                        <button
                                            onClick={() => {
                                                const url = `${window.location.origin}/upgrade/share?uid=${user.id}`;
                                                const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`EduLens Proへのアップグレードをお願いします！\nこちらのリンクから決済できます：\n${url}`)}`;
                                                window.open(lineUrl, '_blank');
                                            }}
                                            className="flex items-center justify-center gap-2 bg-[#06C755] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#05b34c] transition-colors shadow-sm"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            LINEで送る
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/" className="text-slate-500 hover:text-slate-800 font-medium transition-colors">
                            ← ホームに戻る
                        </a>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}
