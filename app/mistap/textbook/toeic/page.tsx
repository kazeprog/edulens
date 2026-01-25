import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, Briefcase, ArrowLeft } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: 'TOEIC・資格試験単語帳一覧｜Mistap 無料単語テストアプリ',
    description: 'TOEIC L&R 金のフレーズなど、資格試験対策の単語帳に対応。スコアアップに直結する重要語彙を効率的に学習できます。',
    openGraph: {
        title: 'TOEIC・資格試験単語帳一覧｜Mistap',
        description: '金のフレーズ、DUO 3.0などに対応。目標スコア達成をサポート。',
        url: 'https://edulens.jp/mistap/textbook/toeic',
    },
};

const textbooks = [
    {
        name: "TOEIC L&R 金のフレーズ",
        description: "TOEIC対策のバイブル。目標スコア別に頻出単語を攻略。",
        path: "/mistap/textbook/toeic-gold",
        color: "orange",
        badge: "TOEIC必須"
    },
    {
        name: "DUO 3.0",
        description: "ビジネス英語の基礎もしっかり身につく、実用的な単語帳。",
        path: "/mistap/textbook/duo-30",
        color: "blue"
    }
];

export default function ToeicIndexPage() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main className="pb-20">
                <section className="bg-white py-12 border-b border-slate-200">
                    <div className="container mx-auto px-4">
                        <Link href="/mistap/textbook" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            教材一覧に戻る
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-orange-500" />
                            TOEIC・資格試験
                        </h1>
                        <p className="mt-4 text-slate-600">
                            TOEICや資格試験の対策に必要な単語帳に対応しています。
                            頻出語彙を重点的に学習し、最短でスコアアップを目指せます。
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {textbooks.map((book, idx) => (
                            <TextbookCard key={idx} {...book} />
                        ))}
                    </div>
                </div>
            </main>
            <MistapFooter />
        </div>
    );
}

function TextbookCard({ name, description, path, color, badge }: any) {
    const colorClasses = {
        orange: "from-orange-500 to-amber-600",
        blue: "from-blue-500 to-indigo-600",
    }[color] || "from-slate-500 to-slate-600";

    const bgColors = {
        orange: "bg-orange-50",
        blue: "bg-blue-50",
    }[color] || "bg-slate-50";

    const textColors = {
        orange: "text-orange-600",
        blue: "text-blue-600",
    }[color] || "text-slate-600";

    return (
        <Link
            href={path}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
        >
            {badge && (
                <span className={`absolute -top-3 -right-3 ${colorClasses} bg-gradient-to-r text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10`}>
                    {badge}
                </span>
            )}
            <div className={`w-12 h-12 ${bgColors} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <BookOpen className={`w-6 h-6 ${textColors}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{name}</h3>
            <p className="text-sm text-slate-500 flex-grow leading-relaxed mb-4">{description}</p>
            <div className={`flex items-center text-sm font-bold ${textColors} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                テストを開始 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </Link>
    );
}
