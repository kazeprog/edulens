import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: '古文単語帳一覧｜Mistap 無料単語テストアプリ',
    description: '重要古文単語315、古文単語330など、入試頻出の古文単語帳に対応。助動詞や敬語など、苦手な古文単語をクイズ形式で克服できます。',
    openGraph: {
        title: '古文単語帳一覧｜Mistap',
        description: '重要古文315、古文330などに対応。イラスト解説で分かりやすく暗記。',
        url: 'https://edulens.jp/mistap/textbook/kobun',
    },
};

const textbooks = [
    {
        name: "重要古文単語315",
        description: "イラストと解説で分かりやすい、古文単語帳のベストセラー。",
        path: "/mistap/textbook/kobun-315",
        color: "rose",
        badge: "古文No.1"
    },
    {
        name: "古文単語330",
        description: "入試頻出の330語をキーポイントで効率よく整理。",
        path: "/mistap/textbook/kobun-330",
        color: "emerald"
    },
    {
        name: "ベストセレクション325",
        description: "共通テストから中堅大まで。頻出語を厳選した一冊。",
        path: "/mistap/textbook/kobun-325",
        color: "orange"
    }
];

export default function KobunIndexPage() {
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
                            <BookOpen className="w-8 h-8 text-rose-500" />
                            古文単語
                        </h1>
                        <p className="mt-4 text-slate-600">
                            大学受験に必要な古文単語帳に対応しています。
                            多義語や識別が難しい語も、繰り返しテストすることで定着させることができます。
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
        rose: "from-rose-500 to-pink-600",
        emerald: "from-emerald-500 to-teal-600",
        orange: "from-orange-500 to-amber-600",
    }[color] || "from-slate-500 to-slate-600";

    const bgColors = {
        rose: "bg-rose-50",
        emerald: "bg-emerald-50",
        orange: "bg-orange-50",
    }[color] || "bg-slate-50";

    const textColors = {
        rose: "text-rose-600",
        emerald: "text-emerald-600",
        orange: "text-orange-600",
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
