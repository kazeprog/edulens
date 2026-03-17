'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import UpgradeButton from '@/components/UpgradeButton';
import { useAuth } from '@/context/AuthContext';
import {
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle2,
    Copy,
    Headphones,
    Share2,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';

const mistapBenefits = [
    {
        icon: Sparkles,
        title: '広告なしで集中',
        description: '学習中に広告が表示されないので、Mistapをテンポよく使い続けられます。',
    },
    {
        icon: Headphones,
        title: '聞き流し英単語',
        description: '通学中やスキマ時間に、指定した範囲の単語を英語と日本語で流しっぱなしにできます。',
    },
    {
        icon: Brain,
        title: "Mistappers' Mistake",
        description: 'みんなが間違えた単語をランキングで表示し、そのままテストできる、ライバルに差をつけるための機能です。',
    },
    {
        icon: BookOpen,
        title: 'Word Stock',
        description: '覚えたい単語を自分専用にためて、模試前やテスト前にすばやく見直せます。',
    },
];

const broaderBenefits = [
    'サイト内の広告非表示',
    'Mistapのすべての機能を利用可能',
    'ナルホドレンズ質問回数 1日20回',
    '英検AI添削 回数無制限',
    '大学入試英作文添削 無制限',
    '新機能への優先アクセス',
];

export default function UpgradeMistapPage() {
    const { user, profile, loading } = useAuth();
    const shouldRedirectToLogin = !loading && !user;

    useEffect(() => {
        if (shouldRedirectToLogin) {
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `/login?redirect=${returnUrl}`;
        }
    }, [shouldRedirectToLogin]);

    if (loading || shouldRedirectToLogin) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <SiteHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-pulse text-slate-500 font-medium">読み込み中...</div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const isPro = !!profile?.is_pro;

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#fff1f2,_#f8fafc_45%,_#f8fafc_100%)]">
            <SiteHeader />
            <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center space-y-5">
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                                Mistapを広告なしで
                                <br />
                                もっと便利に、もっと快適に。
                            </h1>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                                聞き流し英単語、Mistappers&apos; Mistake、Word Stockに加えて、
                                <br className="hidden sm:block" />
                                英検AI添削やナルホドレンズなどの有料機能もまとめて利用できます。
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-xl">
                            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-rose-500 via-orange-400 to-pink-500" />
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-100/60 blur-2xl" />
                            <div className="relative p-8 md:p-10 space-y-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">EduLensProの特徴</h2>
                                            <p className="text-sm text-slate-500">広告なしの快適さも含めて、英単語学習を一気に使いやすくします</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {mistapBenefits.map(({ icon: Icon, title, description }) => (
                                            <div
                                                key={title}
                                                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5"
                                            >
                                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-bold text-slate-900">{title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-rose-200">
                                        <Zap className="w-4 h-4" />
                                        EduLens Proで使えるほかの有料機能
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {[
                                            '英検AI添削を回数無制限で利用可能',
                                            '大学入試英作文添削を回数無制限で利用可能',
                                            'ナルホドレンズを1日20回まで質問可能',
                                            '広告非表示や新機能への優先アクセスも対象',
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-100">
                                                <CheckCircle2 className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <aside className="rounded-3xl border border-rose-100 bg-white shadow-xl">
                            <div className="p-8 md:p-10">
                                <div className="text-center">
                                    <h2 className="text-3xl font-extrabold text-slate-900">EduLens Pro</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                        Mistapだけでなく、EduLens全体の有料機能をまとめて使えるプランです。
                                    </p>
                                </div>

                                <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-center">
                                    <div className="text-sm font-bold text-rose-700">広告なしで勉強に集中</div>
                                    <p className="mt-1 text-xs leading-relaxed text-rose-600">
                                        MistapもEduLens内の学習も、広告を気にせずテンポよく進められます。
                                    </p>
                                </div>

                                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
                                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">月額プラン</div>
                                    <div className="mt-2 flex items-end justify-center gap-1">
                                        <span className="text-5xl font-extrabold text-slate-900">¥500</span>
                                        <span className="pb-1 text-slate-500">/月</span>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-500">
                                        いつでもキャンセル可能です
                                    </p>
                                </div>

                                <div className="mt-8 space-y-4">
                                    {broaderBenefits.map((item) => (
                                        <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    {isPro ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 px-4 py-3 font-bold text-green-700">
                                                <CheckCircle2 className="w-5 h-5" />
                                                すでにEduLens Proをご利用中です
                                            </div>
                                            <div className="grid gap-3">
                                                <Link
                                                    href="/mistap/home"
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-3 font-semibold text-white transition-all hover:opacity-95"
                                                >
                                                    Mistapホームへ戻る
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href="/portal"
                                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                                >
                                                    契約内容を確認する
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <UpgradeButton userId={user.id} />
                                            <p className="text-center text-xs leading-relaxed text-slate-400">
                                                決済後はMistapの有料機能に加えて、英検AI添削やナルホドレンズも利用できます。
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {!isPro && (
                        <div className="rounded-3xl border border-rose-100 bg-white px-6 py-8 shadow-xl">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
                                保護者にリンクを共有する
                            </h3>
                            <p className="text-sm text-slate-500 text-center mb-6 max-w-2xl mx-auto">
                                保護者のスマホから決済してもらいたい場合は、このリンクを共有するとそのまま手続きしてもらえます。
                            </p>

                            <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/upgrade/share?uid=${user.id}`;
                                        navigator.clipboard.writeText(url);
                                        alert('リンクをコピーしました。保護者の方にそのまま送れます。');
                                    }}
                                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <Copy className="w-5 h-5 text-slate-500" />
                                    リンクをコピー
                                </button>

                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/upgrade/share?uid=${user.id}`;
                                        const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`EduLens Proへのアップグレードはこちらからできます。\n${url}`)}`;
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

                    <div className="text-center">
                        <Link href="/mistap/home" className="text-slate-500 hover:text-slate-800 font-medium transition-colors">
                            Mistapホームに戻る
                        </Link>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}
