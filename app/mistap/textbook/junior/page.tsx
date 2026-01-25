import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, School, ArrowLeft } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: '中学生向け英語教科書一覧｜Mistap 無料単語テストアプリ',
    description: '中学校の検定教科書（New Horizon, New Crownなど）に対応した無料単語テストアプリMistap。定期テストの範囲を指定して効率的に暗記学習ができます。',
    openGraph: {
        title: '中学生向け英語教科書一覧｜Mistap',
        description: 'New Horizon, New Crownなど主要教科書に対応。定期テスト対策に最適。',
        url: 'https://edulens.jp/mistap/textbook/junior',
    },
};

const textbooks = [
    {
        name: "New Horizon",
        description: "Unitごとの単語テストで定期テスト対策。",
        path: "/mistap/textbook/junior/new-horizon",
        color: "emerald",
        badge: "教科書"
    },
    {
        name: "New Crown",
        description: "Lessonごとの予習・復習に最適。",
        path: "/mistap/textbook/junior/new-crown",
        color: "blue",
        badge: "教科書"
    }
];

export default function JuniorIndexPage() {
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
                            <School className="w-8 h-8 text-emerald-500" />
                            中学生・教科書
                        </h1>
                        <p className="mt-4 text-slate-600">
                            中学校で使われている英語の教科書に対応しています。
                            定期テストの試験範囲に合わせて、UnitやLessonごとにテストを作成できます。
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
        blue: "from-blue-500 to-indigo-600",
        emerald: "from-emerald-500 to-teal-600",
    }[color] || "from-slate-500 to-slate-600";

    const bgColors = {
        blue: "bg-blue-50",
        emerald: "bg-emerald-50",
    }[color] || "bg-slate-50";

    const textColors = {
        blue: "text-blue-600",
        emerald: "text-emerald-600",
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
