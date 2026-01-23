import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, School, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: '対応教材一覧（単語帳・教科書）｜Mistap（ミスタップ）',
    description: 'Mistap（ミスタップ）で利用できる英単語帳・古文単語帳・教科書の一覧ページです。システム英単語、ターゲット、LEAP、New Horizonなど、主要な教材に完全対応しています。',
    keywords: [
        'Mistap 教材',
        'Mistap 対応単語帳',
        'システム英単語 Mistap',
        'ターゲット Mistap',
        'New Horizon Mistap',
        '英単語 テスト アプリ',
        '古文単語 テスト アプリ'
    ],
    openGraph: {
        title: '対応教材一覧（単語帳・教科書）｜Mistap',
        description: 'Mistapで完全無料でテストできる単語帳・教科書をチェック！シス単、ターゲット、LEAP、New Horizonなど続々追加中。',
        url: 'https://edulens.jp/mistap/textbook',
        type: 'website',
        siteName: 'Mistap',
    },
};

interface Textbook {
    name: string;
    description: string;
    path: string;
    color: string;
    badge?: string;
}

export default function TextbookIndexPage() {
    const universityTextbooks: Textbook[] = [
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

    const toeicTextbooks: Textbook[] = [
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

    const kobunTextbooks: Textbook[] = [
        {
            name: "重要古文単語315",
            description: "イラストと解説で分かりやすい、古文単語帳のベストセラー。",
            path: "/mistap/textbook/kobun-315",
            color: "rose", // Assuming reddish color for Kobun
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

    const juniorTextbooks: Textbook[] = [
        {
            name: "New Horizon",
            description: "中学校の定番教科書。Unitごとの単語テストで定期テスト対策。",
            path: "/mistap/textbook/new-horizon",
            color: "emerald",
            badge: "教科書"
        },
        {
            name: "New Crown",
            description: "中学校英語のスタンダード。Lessonごとの予習・復習に最適。",
            path: "/mistap/textbook/new-crown",
            color: "blue",
            badge: "教科書"
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">

            <main className="pb-20">
                {/* Hero */}
                <section className="bg-white py-16 border-b border-slate-200">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                            対応教材一覧
                        </h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Mistapは、市販の人気単語帳や学校の教科書に完全対応しています。<br />
                            あなたの持っている教材を選んで、今すぐテストを始めましょう。
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 space-y-16 max-w-5xl">

                    {/* University / Wordbooks */}
                    <Section
                        title="大学受験・高校英語"
                        icon={<GraduationCap className="w-8 h-8 text-blue-500" />}
                        description="主要な英単語帳を網羅。共通テストや二次試験対策に。"
                    >
                        {universityTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* TOEIC / Business */}
                    <Section
                        title="TOEIC・資格"
                        icon={<Briefcase className="w-8 h-8 text-orange-500" />}
                        description="スコアアップに直結する語彙力を効率的に強化。"
                    >
                        {toeicTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* Classical Japanese */}
                    <Section
                        title="古文単語"
                        icon={<BookOpen className="w-8 h-8 text-rose-500" />}
                        description="苦手な古文単語も、クイズ形式ならサクサク覚えられる。"
                    >
                        {kobunTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* Junior High */}
                    <Section
                        title="中学生・教科書"
                        icon={<School className="w-8 h-8 text-emerald-500" />}
                        description="教科書の進度に合わせて、Unit/Lessonごとにテスト可能。"
                    >
                        {juniorTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                </div>
            </main>

            <MistapFooter />
        </div>
    );
}

function Section({ title, icon, description, children }: { title: string, icon: React.ReactNode, description: string, children: React.ReactNode }) {
    return (
        <section>
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        {icon}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                </div>
                <p className="text-slate-500 text-sm md:text-base md:pb-1 md:pl-2">
                    {description}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {children}
            </div>
        </section>
    );
}

function TextbookCard({ name, description, path, color, badge }: Textbook) {
    const colorClasses = {
        sky: "from-sky-500 to-blue-600 hover:shadow-sky-200",
        blue: "from-blue-500 to-indigo-600 hover:shadow-blue-200",
        emerald: "from-emerald-500 to-teal-600 hover:shadow-emerald-200",
        orange: "from-orange-500 to-amber-600 hover:shadow-orange-200",
        rose: "from-rose-500 to-pink-600 hover:shadow-rose-200",
    }[color] || "from-slate-500 to-slate-600";

    const textColors = {
        sky: "text-sky-600",
        blue: "text-blue-600",
        emerald: "text-emerald-600",
        orange: "text-orange-600",
        rose: "text-rose-600",
    }[color] || "text-slate-600";

    const bgColors = {
        sky: "bg-sky-50",
        blue: "bg-blue-50",
        emerald: "bg-emerald-50",
        orange: "bg-orange-50",
        rose: "bg-rose-50",
    }[color] || "bg-slate-50";

    return (
        <Link
            href={path}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
        >
            {badge && (
                <span className={`absolute -top-3 -right-3 ${colorClasses.replace('hover:', '')} bg-gradient-to-r text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                    {badge}
                </span>
            )}

            <div className={`w-12 h-12 ${bgColors} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <BookOpen className={`w-6 h-6 ${textColors}`} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">
                {name}
            </h3>

            <p className="text-sm text-slate-500 flex-grow leading-relaxed">
                {description}
            </p>

            <div className={`mt-4 flex items-center text-sm font-bold ${textColors} opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                テストへ進む <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </Link>
    );
}
