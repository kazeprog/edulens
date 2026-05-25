import TestSetupContent from '@/components/mistap/TestSetupContent';
import MistapFooter from '@/components/mistap/Footer';
import FeaturesSection from '@/components/mistap/FeaturesSection';
import Link from 'next/link';

interface TextbookUnitLPTemplateProps {
    textbookName: string;
    textbookNameJa?: string;
    publisherName?: string;
    themeColor: 'sky' | 'emerald' | 'orange' | 'blue' | 'indigo' | 'green' | 'yellow' | 'silver';
    presetTextbook: string;
    unitLabel: string;
    unitValue: number | string;
    gradeLabel?: string;
    initialGrade?: string;
    initialStartNum?: number;
    initialEndNum?: number;
    initialLesson?: number;
    description?: string;
    audience?: 'junior' | 'senior' | 'general';
    parentHref?: string;
}

export default function TextbookUnitLPTemplate({
    textbookName,
    textbookNameJa,
    publisherName,
    themeColor,
    presetTextbook,
    unitLabel,
    unitValue,
    gradeLabel,
    initialGrade,
    initialStartNum,
    initialEndNum,
    initialLesson,
    description,
    parentHref,
}: TextbookUnitLPTemplateProps) {

    // テーマカラーの設定
    const getThemeClasses = () => {
        switch (themeColor) {
            case 'sky': return { bg: 'bg-sky-50', text: 'text-sky-600', button: 'bg-sky-500', border: 'border-sky-200' };
            case 'emerald': return { bg: 'bg-emerald-50', text: 'text-emerald-600', button: 'bg-emerald-500', border: 'border-emerald-200' };
            case 'orange': return { bg: 'bg-orange-50', text: 'text-orange-600', button: 'bg-orange-500', border: 'border-orange-200' };
            case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-600', button: 'bg-blue-500', border: 'border-blue-200' };
            case 'indigo': return { bg: 'bg-indigo-50', text: 'text-indigo-600', button: 'bg-indigo-500', border: 'border-indigo-200' };
            case 'green': return { bg: 'bg-green-50', text: 'text-green-600', button: 'bg-green-500', border: 'border-green-200' };
            case 'yellow': return { bg: 'bg-yellow-50', text: 'text-yellow-600', button: 'bg-yellow-500', border: 'border-yellow-200' };
            case 'silver': return { bg: 'bg-zinc-50', text: 'text-zinc-700', button: 'bg-zinc-600', border: 'border-zinc-200' };
            default: return { bg: 'bg-blue-50', text: 'text-blue-600', button: 'bg-blue-500', border: 'border-blue-200' };
        }
    };
    const theme = getThemeClasses();

    const titleText = `${textbookNameJa || textbookName} ${gradeLabel ? gradeLabel + ' ' : ''}${unitLabel} ${unitValue}`;
    const subTitleText = publisherName ? `${publisherName}対応` : '対応テスト';

    // Heroセクション用タイトル
    const heroTitle = (
        <>
            {textbookNameJa || textbookName} {gradeLabel} <br className="md:hidden" />
            <span className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                {unitLabel} {unitValue}
            </span>
            <br />
            <span className="text-gray-900 mt-2 block md:inline text-lg md:text-2xl">{subTitleText}</span>
        </>
    );

    const heroDescription = description || `${titleText}の英単語テストを無料で実施できます。アプリのインストール不要で、今すぐブラウザから練習を始められます。`;
    const graphPaperBackground = "bg-white bg-fixed bg-[linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(rgba(220,38,38,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.08)_1px,transparent_1px)] [background-size:24px_24px,24px_24px,120px_120px,120px_120px] [background-position:-1px_-1px,-1px_-1px,-1px_-1px,-1px_-1px]";

    return (
        <div className={`${graphPaperBackground} min-h-screen flex flex-col`}>
            <main className="flex-grow">
                <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
                    <div className="absolute inset-0 z-0 bg-white/35 pointer-events-none" />
                    <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]">
                            <div className="text-center lg:text-left space-y-6">
                                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                                    {heroTitle}
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {heroDescription}
                                </p>
                                <div className="flex justify-center lg:justify-start">
                                    <Link
                                        href="#test-setup"
                                        className={`${theme.button} inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]`}
                                    >
                                        テストを開始する
                                    </Link>
                                </div>
                            </div>

                            <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
                                <p className={`mb-3 text-sm font-bold ${theme.text}`}>{subTitleText}</p>
                                <div className="text-2xl font-black text-slate-900 md:text-3xl">{textbookNameJa || textbookName}</div>
                                <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-center">
                                    <div className="text-sm font-semibold text-slate-500">{gradeLabel || '範囲指定'}</div>
                                    <div className="mt-1 text-4xl font-black text-slate-900">
                                        {unitLabel} {unitValue}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-10 px-2 sm:px-4 bg-white/70 border-y border-slate-100/80 backdrop-blur-[1px]" id="test-setup">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">📚 {unitLabel} {unitValue} のテストを開始</h2>
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                            <TestSetupContent
                                embedMode={true}
                                presetTextbook={presetTextbook}
                                initialGrade={initialGrade}
                                initialLesson={typeof initialLesson === 'number' ? initialLesson : undefined}
                                initialStartNum={initialStartNum}
                                initialEndNum={initialEndNum}
                            />
                        </div>
                    </div>
                </section>

                <div className="bg-white/60 backdrop-blur-[1px]">
                    <FeaturesSection />
                </div>

                <section className="py-12 bg-white/70 text-gray-800 border-t border-slate-100/80 backdrop-blur-[1px]">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="prose prose-blue mx-auto bg-white/85 p-6 rounded-lg text-sm text-gray-700 mb-12 shadow-sm border border-slate-200">
                            <h3 className="text-base font-bold text-slate-800 mb-2">{titleText} の完全攻略</h3>
                            <p className="mb-2">
                                このページでは、<strong>{textbookNameJa}</strong> の <strong>{unitLabel} {unitValue}</strong> に出てくる重要単語をピンポイントでテストできます。
                                間違えた単語だけを効率的に復習し、定期テストや受験に向けて基礎を固めましょう。
                            </p>
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                href={parentHref || `/mistap/textbook/${presetTextbook === 'New Crown' ? 'new-crown' : presetTextbook === 'New Horizon' ? 'new-horizon' : presetTextbook === 'Target 1900' ? 'target-1900' : 'system-words'}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                教科書トップに戻る
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <MistapFooter />
        </div>
    );
}
