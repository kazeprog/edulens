'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, BookOpen, Zap, Trophy, ChevronRight, GraduationCap, School, ClipboardList, CheckSquare } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import TestSetupContent from '@/components/mistap/TestSetupContent';
import MistapFooter from '@/components/mistap/Footer';

interface TextbookLPTemplateProps {
    textbookName: string;
    textbookNameJa: string;
    publisherName: string;
    themeColor: 'sky' | 'emerald' | 'orange' | 'blue';
    presetTextbook: string;
    canonicalUrl: string;
    unitLabel?: string;
    initialGrade?: string;
}

export default function TextbookLPTemplate({ textbookName, textbookNameJa, publisherName, themeColor, presetTextbook, canonicalUrl, unitLabel = "Unit", initialGrade }: TextbookLPTemplateProps) {
    const getThemeClasses = () => {
        // ... (theme logic remains same)
        switch (themeColor) {
            case 'emerald':
                return {
                    bgGradient: 'from-emerald-50 to-white',
                    bgGradientAccent: 'from-emerald-100/50 to-transparent',
                    badgeBg: 'bg-emerald-100',
                    badgeText: 'text-emerald-700',
                    ping: 'bg-emerald-400',
                    dot: 'bg-emerald-500',
                    textAccent: 'text-emerald-600',
                    textHighlight: 'text-emerald-500',
                    buttonGradient: 'from-emerald-500 to-teal-600',
                    buttonShadow: 'shadow-emerald-200',
                    iconColor: 'text-emerald-500',
                    faqQ: 'bg-emerald-500',
                    ctaGradient: 'from-emerald-600 to-teal-700',
                    ctaText: 'text-emerald-100',
                };
            case 'orange':
                return {
                    bgGradient: 'from-orange-50 to-white',
                    bgGradientAccent: 'from-orange-100/50 to-transparent',
                    badgeBg: 'bg-orange-100',
                    badgeText: 'text-orange-700',
                    ping: 'bg-orange-400',
                    dot: 'bg-orange-500',
                    textAccent: 'text-orange-600',
                    textHighlight: 'text-orange-500',
                    buttonGradient: 'from-orange-500 to-amber-600',
                    buttonShadow: 'shadow-orange-200',
                    iconColor: 'text-orange-500',
                    faqQ: 'bg-orange-500',
                    ctaGradient: 'from-orange-600 to-amber-700',
                    ctaText: 'text-orange-100',
                };
            case 'blue':
                return {
                    bgGradient: 'from-blue-50 to-white',
                    bgGradientAccent: 'from-blue-100/50 to-transparent',
                    badgeBg: 'bg-blue-100',
                    badgeText: 'text-blue-700',
                    ping: 'bg-blue-400',
                    dot: 'bg-blue-500',
                    textAccent: 'text-blue-600',
                    textHighlight: 'text-blue-500',
                    buttonGradient: 'from-blue-500 to-indigo-600',
                    buttonShadow: 'shadow-blue-200',
                    iconColor: 'text-blue-500',
                    faqQ: 'bg-blue-500',
                    ctaGradient: 'from-blue-600 to-indigo-700',
                    ctaText: 'text-blue-100',
                };
            case 'sky':
            default:
                return {
                    bgGradient: 'from-sky-50 to-white',
                    bgGradientAccent: 'from-sky-100/50 to-transparent',
                    badgeBg: 'bg-sky-100',
                    badgeText: 'text-sky-700',
                    ping: 'bg-sky-400',
                    dot: 'bg-sky-500',
                    textAccent: 'text-sky-600',
                    textHighlight: 'text-sky-500',
                    buttonGradient: 'from-sky-500 to-blue-600',
                    buttonShadow: 'shadow-sky-200',
                    iconColor: 'text-sky-500',
                    faqQ: 'bg-sky-500',
                    ctaGradient: 'from-sky-600 to-blue-700',
                    ctaText: 'text-sky-100',
                };
        }
    };

    const theme = getThemeClasses();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalApplication",
        "name": `Mistap ${textbookNameJa} 英単語テスト`,
        "educationalLevel": "MiddleSchool",
        "about": `${textbookNameJa} 英単語 テスト`,
        "url": canonicalUrl,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="bg-white min-h-screen">
                {/* Hero Section */}
                <section className={`relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b ${theme.bgGradient}`}>
                    <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${theme.bgGradientAccent} skew-x-12 transform origin-top-right z-0 pointer-events-none`} />

                    <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                            <div className="flex-1 text-center md:text-left space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 ${theme.badgeBg} ${theme.badgeText} rounded-full text-sm font-bold mb-2`}>
                                    <span className="relative flex h-3 w-3">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.ping} opacity-75`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${theme.dot}`}></span>
                                    </span>
                                    中学生の定期テスト対策に
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                                    <span className={`block text-xl md:text-2xl font-bold ${theme.textAccent} mb-4 tracking-normal`}>{textbookNameJa}（{textbookName}）完全対応</span>
                                    教科書の英単語を<br />
                                    <span className={theme.textHighlight}>ゲーム感覚で完全攻略</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                                    {textbookNameJa}（{textbookName}）は、{publisherName}の中学英語教科書です。<br />
                                    本ページでは{textbookNameJa}の英単語テストを{unitLabel}別に無料で提供しています。<br />
                                    全学年・全単元に対応し、通学時間やスキマ時間にスマホひとつで予習・復習が完了します。
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                                    <Link
                                        href="#test-demo"
                                        className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${theme.buttonGradient} text-white rounded-xl font-bold text-lg shadow-xl ${theme.buttonShadow} hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                                    >
                                        <Zap className="w-6 h-6" />
                                        今すぐテストしてみる (無料)
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">
                                    ※ 登録不要で試せます
                                </p>
                            </div>

                            <div className="flex-1 w-full max-w-md md:max-w-full relative animate-in slide-in-from-right-5 fade-in duration-1000 delay-150">
                                <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-slate-100">
                                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-400 rounded-full opacity-20 blur-xl animate-pulse delay-700"></div>

                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-700">対応教科書</h3>
                                        <div className="mt-2 text-2xl font-black text-slate-800 tracking-wider">
                                            {textbookName}
                                        </div>
                                        <div className="text-sm text-slate-500 font-medium">({textbookNameJa})</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl p-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-xs">1</span>
                                            <span>中1</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-xs">2</span>
                                            <span>中2</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-xs">3</span>
                                            <span>中3</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center">
                                        <p className="text-slate-500 text-sm">全単元・全レッスンを網羅！</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Test Demo Section */}
                <section id="test-demo" className="py-20 bg-slate-50 border-t border-slate-100 border-b">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">実際のテストを試してみる</h2>
                            <p className="text-slate-600">
                                学年と単元を選ぶだけで、すぐにテストが始まります。<br />
                                選択肢から「教科書テスト」を選んで、<strong>{textbookNameJa}</strong>を選択してください。
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            <TestSetupContent embedMode={true} presetTextbook={presetTextbook} initialGrade={initialGrade} />
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/login?mode=signup"
                                className="inline-flex items-center gap-2 text-sky-600 font-bold hover:underline"
                            >
                                学習履歴を保存するには無料登録が必要です <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">定期テストの点数が上がる理由</h2>
                            <p className="text-slate-600 text-lg">
                                Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                                {textbookNameJa}のテスト範囲に合わせて、効率的に点数を伸ばすための機能が詰まっています。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<span className={`text-3xl font-black ${theme.textAccent}`}>01</span>}
                                title="教科書のレッスン通り"
                                description={`${textbookName}のページ順・レッスン順に単語が収録されているので、学校の授業の進度に合わせて予習・復習ができます。`}
                            />
                            <FeatureCard
                                icon={<span className={`text-3xl font-black ${theme.textAccent}`}>02</span>}
                                title="苦手な単語を自動リスト化"
                                description="間違えた単語は自動的に「苦手リスト」に登録されます。テスト直前にそのリストだけを見直せば、効率よく弱点を克服できます。"
                            />
                            <FeatureCard
                                icon={<span className={`text-3xl font-black ${theme.textAccent}`}>03</span>}
                                title="タップするだけで復習リスト作成"
                                description="分からなかった単語をタップするだけで、あなただけの復習リストが自動で完成。覚えた単語はリストから消していくことで、効率的に学習できます。"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-slate-50 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">よくある質問</h2>

                        <div className="space-y-6">
                            <FAQItem
                                question={`${textbookNameJa}の全学年に対応していますか？`}
                                answer={`はい、中学1年生から3年生までのすべての${textbookNameJa}に対応しています。${unitLabel}ごとに細かく分かれているので、テスト範囲だけをピンポイントで学習できます。`}
                                badgeColor={theme.faqQ}
                            />
                            <FAQItem
                                question="無料で使えますか？"
                                answer="はい、すべての機能を無料でご利用いただけます。会員登録をしなくてもテストを試すことができますが、学習履歴の保存や苦手単語の管理には無料の会員登録をおすすめしています。"
                                badgeColor={theme.faqQ}
                            />
                            <FAQItem
                                question="スマートフォン以外でも使えますか？"
                                answer="はい、PC、タブレット、スマートフォンなど、ブラウザが使える端末であればどれでもご利用いただけます。自宅ではタブレット、通学中はスマホといった使い分けも可能です。"
                                badgeColor={theme.faqQ}
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className={`py-20 bg-gradient-to-br ${theme.ctaGradient} text-white text-center`}>
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">{textbookNameJa}の単語をマスターしよう！</h2>
                        <p className={`text-xl mb-10 max-w-2xl mx-auto ${theme.ctaText}`}>
                            もう、英単語の暗記で悩む必要はありません。<br />
                            Mistapで効率よく、楽しく学習を始めましょう。
                        </p>
                        <Link
                            href="/mistap"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-800 rounded-full font-bold text-xl shadow-lg hover:shadow-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300"
                        >
                            今すぐ始める
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Disclaimer */}
                <div className="py-8 bg-slate-50 text-center px-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        本サービスは{publisherName}などの出版社と提携しておらず、独自に作成した学習コンテンツを提供しています。<br />
                        教科書名・出版社名は説明のために使用しています。
                    </p>
                </div>
            </main>
            <MistapFooter />
        </>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-6 w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function FAQItem({ question, answer, badgeColor }: { question: string, answer: string, badgeColor: string }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-start gap-3 mb-3">
                <span className={`${badgeColor} text-white text-xs px-2 py-1 rounded mt-0.5 shrink-0`}>Q</span>
                {question}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed pl-9">
                {answer}
            </p>
        </div>
    );
}
