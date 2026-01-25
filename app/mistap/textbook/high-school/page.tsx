import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: '大学受験・高校英語単語帳一覧｜Mistap 無料単語テストアプリ',
    description: 'システム英単語、ターゲット1900、LEAPなど、大学受験の定番英単語帳に対応。入試頻出の英単語を効率的に学習できます。',
    openGraph: {
        title: '大学受験・高校英語単語帳一覧｜Mistap',
        description: 'システム英単語、ターゲット1900などに対応。共通テストから難関大まで。',
        url: 'https://edulens.jp/mistap/textbook/high-school',
    },
};

const textbooks = [
    {
        name: "システム英単語",
        description: "共通テストから難関大まで対応。頻出順に効率よく学習できます。",
        path: "/mistap/textbook/system-words",
        color: "sky",
        badge: "人気No.1"
    },
    {
        name: "ターゲット1900",
        description: "大学受験のド定番。頻出1900語をランク順にマスター。",
        path: "/mistap/textbook/target-1900",
        color: "blue",
        badge: "定番"
    },
    {
        name: "LEAP",
        description: "4技能対応の必修英単語。竹岡広信先生のメソッドを凝縮。",
        path: "/mistap/textbook/leap",
        color: "sky"
    },
    {
        name: "DUO 3.0",
        description: "現代英語の重要単語・熟語を560本の例文で一気に攻略。",
        path: "/mistap/textbook/duo-30",
        color: "blue"
    },
    {
        name: "ターゲット1200",
        description: "高校英語の基礎固めに最適。共通テストの土台を作ります。",
        path: "/mistap/textbook/target-1200",
        color: "emerald"
    }
];

export default function HighSchoolIndexPage() {
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
                            <GraduationCap className="w-8 h-8 text-blue-500" />
                            大学受験・高校英語
                        </h1>
                        <p className="mt-4 text-slate-600">
                            大学入試対策に必須の英単語帳に対応しています。
                            自分の持っている単語帳を選んで、章やセクションごとにテストできます。
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
        sky: "from-sky-500 to-blue-600",
        blue: "from-blue-500 to-indigo-600",
        emerald: "from-emerald-500 to-teal-600",
    }[color] || "from-slate-500 to-slate-600";

    const bgColors = {
        sky: "bg-sky-50",
        blue: "bg-blue-50",
        emerald: "bg-emerald-50",
    }[color] || "bg-slate-50";

    const textColors = {
        sky: "text-sky-600",
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
