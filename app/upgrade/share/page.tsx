"use client";

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';

function UpgradeShareContent() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('uid');
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!userId) {
            alert('ユーザーIDが見つかりません。リンクが正しいかご確認ください。');
            return;
        }

        setLoading(true);
        try {
            // 戻り先は今のページ、またはトップページ
            const returnUrl = typeof window !== 'undefined' ? window.location.href : '/';

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    returnUrl,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('決済ページのURLが取得できませんでした。');
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('エラーが発生しました。もう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <p className="text-red-500 font-bold mb-4">無効なリンクです</p>
                    <p className="text-slate-600 text-sm">
                        URLに必要な情報が含まれていません。お子様から送られたリンクをもう一度ご確認ください。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-white text-xl font-bold tracking-wider">EduLens Pro</h1>
                    <p className="text-blue-100 text-sm mt-1">保護者様用 お支払いページ</p>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 relative mx-auto mb-4 rounded-full overflow-hidden shadow-sm">
                            <Image
                                src="/EdulensPro.jpg"
                                alt="EduLens Pro"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Proプランへアップグレード</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            お子様のアカウント（ID: ...{userId.slice(-4)}）<br />
                            でPro機能を利用できるようにします。
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-600 font-bold">月額料金</span>
                            <span className="text-2xl font-bold text-slate-800">¥500<span className="text-sm font-normal text-slate-500">/月</span></span>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-4 mt-6">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <div>
                                    <strong className="block text-slate-800">Mistapの全機能（出題数制限の解除など）</strong>
                                    <span className="text-xs text-slate-500 leading-relaxed block mt-1">
                                        単語テストアプリ「Mistap」の出題数制限が解除され、すべての機能が使い放題になります。
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <div>
                                    <strong className="block text-slate-800">ナルホドレンズ 毎日20問質問可能</strong>
                                    <span className="text-xs text-slate-500 leading-relaxed block mt-1">
                                        24時間いつでもAIに質問可能。わからない問題をスマホで撮るだけで、詳細な解説が受けられます。
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <div>
                                    <strong className="block text-slate-800">AI英作文添削（英検®・大学入試）</strong>
                                    <span className="text-xs text-slate-500 leading-relaxed block mt-1">
                                        合格レベルの採点基準で何度でも添削。英検対策や難関大学の二次試験対策に最適です。
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <div>
                                    <strong className="block text-slate-800">サイト内の広告を非表示</strong>
                                    <span className="text-xs text-slate-500 leading-relaxed block mt-1">
                                        学習を妨げる全ての広告を非表示にし、集中できる環境を提供します。
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 pt-2 border-t border-slate-100">
                                <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <div className="text-slate-500 text-xs mt-0.5">
                                    いつでもWeb上から簡単に解約可能です
                                </div>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                処理中...
                            </>
                        ) : (
                            'お支払い手続きへ進む'
                        )}
                    </button>

                    <p className="text-xs text-center text-slate-400 mt-6">
                        決済はStripeによって安全に処理されます。<br />
                        EduLensがカード情報を保存することはありません。
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function UpgradeSharePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>}>
            <UpgradeShareContent />
        </Suspense>
    );
}
