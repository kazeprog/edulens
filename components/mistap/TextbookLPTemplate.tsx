'use client';

import GoogleAdsense from '@/components/GoogleAdsense';

import Link from 'next/link';
import Image from 'next/image';
import { Zap, ChevronRight, CheckSquare } from 'lucide-react';
import TestSetupContent from '@/components/mistap/TestSetupContent';
import MistapFooter from '@/components/mistap/Footer';
import AmazonTextbookLink from '@/components/mistap/AmazonTextbookLink';
import { getJsonTextbookData } from "@/lib/mistap/jsonTextbookData";

interface TextbookLPTemplateProps {
    textbookName: string;
    textbookNameJa: string;
    publisherName: string;
    themeColor: 'sky' | 'emerald' | 'orange' | 'blue' | 'indigo' | 'green' | 'yellow' | 'rose' | 'silver';
    presetTextbook: string;
    canonicalUrl: string;
    unitLabel?: string;
    initialGrade?: string;
    audience?: 'junior' | 'senior' | 'general';
    bookType?: 'textbook' | 'wordbook';
    overrideCoverTitle?: string;
    overrideDescriptionSubject?: string;
    seoSettings?: {
        heroTitle?: React.ReactNode;
        heroDescription?: string;
        heroSecondaryCta?: React.ReactNode;
        testSectionTitle?: string;
        testSectionDescription?: React.ReactNode;
        featuresTitle?: string;
        featuresDescription?: React.ReactNode;
        feature1?: { title: string; description: string };
        feature2?: { title: string; description: string };
        feature3?: { title: string; description: string };
        extraContent?: React.ReactNode;
        extraFaqs?: { question: string; answer: string }[];
    };
}


export default function TextbookLPTemplate({
    textbookName,
    textbookNameJa,
    publisherName,
    themeColor,
    presetTextbook,
    canonicalUrl,
    unitLabel = "Unit",
    initialGrade,
    audience = 'junior',
    bookType = 'textbook',
    overrideCoverTitle,
    overrideDescriptionSubject,
    seoSettings
}: TextbookLPTemplateProps) {
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
            case 'indigo':
                return {
                    bgGradient: 'from-indigo-50 to-white',
                    bgGradientAccent: 'from-indigo-100/50 to-transparent',
                    badgeBg: 'bg-indigo-100',
                    badgeText: 'text-indigo-700',
                    ping: 'bg-indigo-400',
                    dot: 'bg-indigo-500',
                    textAccent: 'text-indigo-600',
                    textHighlight: 'text-indigo-500',
                    buttonGradient: 'from-indigo-500 to-blue-600',
                    buttonShadow: 'shadow-indigo-200',
                    iconColor: 'text-indigo-500',
                    faqQ: 'bg-indigo-500',
                    ctaGradient: 'from-indigo-600 to-blue-700',
                    ctaText: 'text-indigo-100',
                };
            case 'green':
                return {
                    bgGradient: 'from-green-50 to-white',
                    bgGradientAccent: 'from-green-100/50 to-transparent',
                    badgeBg: 'bg-green-100',
                    badgeText: 'text-green-700',
                    ping: 'bg-green-400',
                    dot: 'bg-green-500',
                    textAccent: 'text-green-600',
                    textHighlight: 'text-green-500',
                    buttonGradient: 'from-green-500 to-emerald-600',
                    buttonShadow: 'shadow-green-200',
                    iconColor: 'text-green-500',
                    faqQ: 'bg-green-500',
                    ctaGradient: 'from-green-600 to-emerald-700',
                    ctaText: 'text-green-100',
                };
            case 'yellow':
                return {
                    bgGradient: 'from-yellow-50 to-white',
                    bgGradientAccent: 'from-yellow-100/50 to-transparent',
                    badgeBg: 'bg-yellow-100',
                    badgeText: 'text-yellow-700',
                    ping: 'bg-yellow-400',
                    dot: 'bg-yellow-500',
                    textAccent: 'text-yellow-600',
                    textHighlight: 'text-yellow-500',
                    buttonGradient: 'from-yellow-500 to-orange-600',
                    buttonShadow: 'shadow-yellow-200',
                    iconColor: 'text-yellow-500',
                    faqQ: 'bg-yellow-500',
                    ctaGradient: 'from-yellow-500 to-orange-600',
                    ctaText: 'text-yellow-100',
                };
            case 'rose':
                return {
                    bgGradient: 'from-rose-50 to-white',
                    bgGradientAccent: 'from-rose-100/50 to-transparent',
                    badgeBg: 'bg-rose-100',
                    badgeText: 'text-rose-700',
                    ping: 'bg-rose-400',
                    dot: 'bg-rose-500',
                    textAccent: 'text-rose-600',
                    textHighlight: 'text-rose-500',
                    buttonGradient: 'from-rose-500 to-pink-600',
                    buttonShadow: 'shadow-rose-200',
                    iconColor: 'text-rose-500',
                    faqQ: 'bg-rose-500',
                    ctaGradient: 'from-rose-600 to-pink-700',
                    ctaText: 'text-rose-100',
                };
            case 'silver':
                return {
                    bgGradient: 'from-zinc-100 to-white',
                    bgGradientAccent: 'from-slate-200/60 to-transparent',
                    badgeBg: 'bg-zinc-200',
                    badgeText: 'text-zinc-700',
                    ping: 'bg-zinc-400',
                    dot: 'bg-zinc-500',
                    textAccent: 'text-zinc-700',
                    textHighlight: 'text-slate-500',
                    buttonGradient: 'from-zinc-500 to-slate-700',
                    buttonShadow: 'shadow-zinc-300',
                    iconColor: 'text-zinc-500',
                    faqQ: 'bg-zinc-600',
                    ctaGradient: 'from-zinc-600 to-slate-800',
                    ctaText: 'text-zinc-100',
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

    const educationalLevel =
        audience === 'senior' ? "HighSchool" :
            audience === 'general' ? "AdultEducation" :
                "MiddleSchool";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalApplication",
        "name": `Mistap ${textbookNameJa} 英単語テスト`,
        "educationalLevel": educationalLevel,
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

    const isSameName = textbookName === textbookNameJa;
    const defaultSubject = isSameName ? textbookNameJa : `${textbookNameJa}（${textbookName}）`;
    const subject = overrideDescriptionSubject || defaultSubject;

    const descriptionText = seoSettings?.heroDescription || (bookType === 'wordbook'
        ? `${subject}は、${publisherName}の英単語帳です。`
        : `${subject}は、${publisherName}の中学英語教科書です。`);

    const faqQuestion =
        bookType === 'wordbook' || audience === 'general'
            ? `${textbookNameJa}に対応していますか？`
            : `${textbookNameJa}の全学年に対応していますか？`;

    const faqAnswer =
        bookType === 'wordbook' || audience === 'general'
            ? `はい、${textbookNameJa}に対応しています。収録英単語の復習や定着確認に使える小テストを無料で作成できます。`
            : `はい、中学1年生から3年生までのすべての${textbookNameJa}に対応しています。${unitLabel}ごとに細かく分かれているので、テスト範囲だけをピンポイントで学習できます。`;

    const faqItems = [
        {
            question: faqQuestion,
            answer: faqAnswer,
        },
        {
            question: "無料で使えますか？",
            answer: "はい、すべての機能を無料でご利用いただけます。会員登録をしなくてもテストを試すことができますが、学習履歴の保存や苦手単語の管理には無料の会員登録をおすすめしています。",
        },
        {
            question: "スマートフォン以外でも使えますか？",
            answer: "はい、PC、タブレット、スマートフォンなど、ブラウザが使える端末であればどれでもご利用いただけます。自宅ではタブレット、通学中はスマホといった使い分けも可能です。",
        },
        ...(seoSettings?.extraFaqs || []),
    ];

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    };

    // ローカルJSONからデータを取得
    const localWords = presetTextbook ? getJsonTextbookData(presetTextbook) : null;
    const initialData = localWords ? localWords : undefined;
    const graphPaperBackground = "bg-white bg-fixed bg-[linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(rgba(220,38,38,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.08)_1px,transparent_1px)] [background-size:24px_24px,24px_24px,120px_120px,120px_120px] [background-position:-1px_-1px,-1px_-1px,-1px_-1px,-1px_-1px]";

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <main className={`${graphPaperBackground} min-h-screen`}>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                    <div className="absolute inset-0 z-0 bg-white/35 pointer-events-none" />

                    <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                        <div className="grid items-center gap-12 md:gap-14 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]">
                            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
                                {seoSettings?.heroTitle || (
                                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                                        <span className={`block text-lg md:text-2xl font-bold ${theme.textAccent} mb-4 tracking-normal`}>
                                            {isSameName ? textbookNameJa : `${textbookNameJa}（${textbookName}）`}完全対応
                                        </span>
                                        {bookType === 'wordbook' ? '収録英単語を' : '教科書の英単語を'}<br />
                                        <span className={theme.textHighlight}>ゲーム感覚で完全攻略</span>
                                    </h1>
                                )}
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {descriptionText}<br />
                                    {!seoSettings?.heroDescription && (
                                        <>
                                            本ページでは{textbookNameJa}の英単語テストを{unitLabel}別に無料で提供しています。<br />
                                            通学時間やスキマ時間に、スマホひとつで予習・復習が完了します。
                                        </>
                                    )}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                                    <Link
                                        href="#test-demo"
                                        className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${theme.buttonGradient} text-white rounded-xl font-bold text-lg shadow-xl ${theme.buttonShadow} hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                                    >
                                        <Zap className="w-6 h-6" />
                                        今すぐテストしてみる (無料)
                                    </Link>
                                </div>
                                {seoSettings?.heroSecondaryCta && (
                                    <div className="pt-4">
                                        {seoSettings.heroSecondaryCta}
                                    </div>
                                )}
                                <div className="flex flex-col items-center lg:items-start gap-2">
                                    <AmazonTextbookLink textbookName={textbookNameJa} allowSearchFallback={false} />
                                    <p className="text-sm text-slate-400 font-medium">
                                        ※ 登録不要で試せます
                                    </p>
                                </div>
                            </div>

                            <div className="w-full max-w-md md:max-w-full relative animate-in slide-in-from-right-5 fade-in duration-1000 delay-150">
                                <div className="pointer-events-none absolute -bottom-10 -right-3 z-20 w-32 sm:-bottom-12 sm:-right-4 sm:w-40 md:-bottom-16 md:-right-5 md:w-52 lg:-bottom-20">
                                    <Image
                                        src="/mistap/mascot/mistap-mascot-pointing.png"
                                        alt=""
                                        width={447}
                                        height={558}
                                        className="h-auto w-full"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-slate-100">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-700">対応教材</h3>
                                        {overrideCoverTitle ? (
                                            <div className="mt-2 text-2xl font-black text-slate-800 tracking-wider">
                                                {overrideCoverTitle}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mt-2 text-2xl font-black text-slate-800 tracking-wider">
                                                    {textbookName}
                                                </div>
                                                {!isSameName && (
                                                    <div className="text-sm text-slate-500 font-medium">({textbookNameJa})</div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {audience === 'junior' ? (
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
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl p-3">
                                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                                            <span>全範囲をカバー</span>
                                        </div>
                                    )}

                                    <div className="mt-6 flex items-center justify-center">
                                        <p className="text-slate-500 text-sm">全単元・全レッスンを網羅！</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Desktop AdSense below hero */}
                <section className="hidden lg:block bg-white/65 py-6 border-y border-slate-100/80 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <GoogleAdsense
                            placement="mistap-textbook-lp-desktop-top"
                            className="w-full"
                            style={{ display: 'block', width: '100%', minHeight: '90px', textAlign: 'center' }}
                            format="horizontal"
                            responsive="true"
                            reserveSpace
                            reserveHeight={120}
                        />
                    </div>
                </section>

                {/* Test Demo Section */}
                <section id="test-demo" className="py-20 bg-white/70 border-t border-slate-100/80 border-b backdrop-blur-[1px]">
                    <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">{seoSettings?.testSectionTitle || '実際のテストを試してみる'}</h2>
                            <div className="text-slate-600">
                                {seoSettings?.testSectionDescription || (
                                    <p>
                                        学年と単元を選ぶだけで、すぐにテストが始まります。<br />
                                        選択肢から「教科書テスト」を選んで、<strong>{textbookNameJa}</strong>を選択してください。
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            <TestSetupContent
                                embedMode={true}
                                presetTextbook={presetTextbook}
                                initialGrade={initialGrade}
                                initialData={initialData}
                            />
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

                {seoSettings?.extraContent}

                {/* Features Section */}
                <section className="py-20 bg-white/60 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{seoSettings?.featuresTitle || '定期テストの点数が上がる理由'}</h2>
                            <div className="text-slate-600 text-lg">
                                {seoSettings?.featuresDescription || (
                                    <p>
                                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                                        {textbookNameJa}のテスト範囲に合わせて、効率的に点数を伸ばすための機能が詰まっています。
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<span className={`text-3xl font-black ${theme.textAccent}`}>01</span>}
                                title={seoSettings?.feature1?.title || '教科書のレッスン通り'}
                                description={seoSettings?.feature1?.description || `${textbookName}のページ順・レッスン順に単語が収録されているので、学校の授業の進度に合わせて予習・復習ができます。`}
                            />
                            <FeatureCard
                                icon={<span className={`text-3xl font-black ${theme.textAccent}`}>02</span>}
                                title={seoSettings?.feature2?.title || '苦手な単語を自動リスト化'}
                                description={seoSettings?.feature2?.description || "間違えた単語は自動的に「苦手リスト」に登録されます。テスト直前にそのリストだけを見直せば、効率よく弱点を克服できます。"}
                            />
                            <FeatureCard
                                icon={<span className={`text-3xl font-black ${theme.textAccent}`}>03</span>}
                                title={seoSettings?.feature3?.title || 'タップするだけで復習リスト作成'}
                                description={seoSettings?.feature3?.description || "分からなかった単語をタップするだけで、あなただけの復習リストが自動で完成。覚えた単語はリストから消していくことで、効率的に学習できます。"}
                            />
                        </div>
                    </div>
                </section>

                {/* AdSense Section */}
                <section className="py-8 bg-white/65 flex justify-center border-t border-slate-100/80 backdrop-blur-[1px]">
                    <div className="w-full max-w-4xl px-4">
                        <GoogleAdsense
                            placement="mistap-textbook-lp"
                            style={{ display: 'block', minHeight: '280px', textAlign: 'center' }}
                        />
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white/70 border-t border-slate-100/80 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">よくある質問</h2>

                        <div className="space-y-6">
                            {faqItems.map((item) => (
                                <FAQItem
                                    key={item.question}
                                    question={item.question}
                                    answer={item.answer}
                                    badgeColor={theme.faqQ}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="py-20 bg-white/70 text-center border-y border-slate-100/80 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">{textbookNameJa}の単語をマスターしよう！</h2>
                        <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-600">
                            もう、英単語の暗記で悩む必要はありません。<br />
                            Mistapで効率よく、楽しく学習を始めましょう。
                        </p>
                        <Link
                            href="/mistap"
                            className={`inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r ${theme.buttonGradient} text-white rounded-full font-bold text-xl shadow-lg ${theme.buttonShadow} hover:shadow-xl hover:scale-105 transition-all duration-300`}
                        >
                            今すぐ始める
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Disclaimer */}
                <div className="py-8 bg-white/70 text-center px-4 border-t border-slate-100/80 backdrop-blur-[1px]">
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
        <div className="bg-white/85 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
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
        <div className="bg-white/85 rounded-xl p-6 border border-slate-200">
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
