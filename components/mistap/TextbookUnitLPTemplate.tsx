import Head from 'next/head';
import Header from '@/components/mistap/Header';
import TestSetupContent from '@/components/mistap/TestSetupContent';
import MistapFooter from '@/components/mistap/Footer';
import FeaturesSection from '@/components/mistap/FeaturesSection';
import HeroSection from '@/components/mistap/HeroSection';
import Background from '@/components/mistap/Background';
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
    audience = 'junior',
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

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                    <HeroSection
                        title={heroTitle}
                        description={heroDescription}
                        showButtons={false}
                    />

                    <section className="py-6 px-4" id="test-setup">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">📚 {unitLabel} {unitValue} のテストを開始</h2>
                            <TestSetupContent
                                embedMode={true}
                                presetTextbook={presetTextbook}
                                initialGrade={initialGrade}
                                initialLesson={typeof initialLesson === 'number' ? initialLesson : undefined}
                                initialStartNum={initialStartNum}
                                initialEndNum={initialEndNum}
                            />
                        </div>
                    </section>

                    <FeaturesSection />

                    <section className="py-12 bg-white/95 backdrop-blur-sm rounded-t-3xl text-gray-800 mt-8">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="prose prose-blue mx-auto bg-slate-50 p-6 rounded-lg text-sm text-gray-700 mb-12 shadow-sm border border-slate-200">
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
        </Background>
    );
}
