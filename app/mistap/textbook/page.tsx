import type { Metadata } from 'next';
import Link from 'next/link';
import { School, GraduationCap, Briefcase, BookOpen, ChevronRight } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: 'Mistap教材ハブ｜学習理論に基づく単語テストプラットフォーム',
    description: 'Mistapの教材ハブページです。私たちが提供する単語テストの設計思想、学習理論、対応教材のカテゴリ一覧を掲載しています。効率的な暗記学習を支えるMistapの教育方針をご確認ください。',
    openGraph: {
        title: 'Mistap教材ハブ｜学習設計と対応教材一覧',
        description: '学習理論に基づいた効率的な単語テスト。各学年・目的別の教材へはこちらから。',
        url: 'https://edulens.jp/mistap/textbook',
    },
};

export default function TextbookHubPage() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main>
                {/* Hero Section */}
                <section className="bg-white py-20 border-b border-slate-200">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
                            Textbook Hub
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            学習を「科学」する<br />
                            Mistapの教材ライブラリ
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8">
                            Mistapは単なる単語帳アプリではありません。<br />
                            認知心理学に基づく記憶メカニズム応用し、<br />
                            「知識の定着」を最大化するために設計された学習プラットフォームです。
                        </p>
                    </div>
                </section>

                {/* Category Links */}
                <section className="py-16 container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">教材カテゴリを選択</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <CategoryCard
                            title="中学生・教科書"
                            description="New Horizon, New Crownなど、中学校の検定教科書に対応。定期テスト対策に。"
                            href="/mistap/textbook/junior"
                            icon={<School className="w-8 h-8 text-emerald-500" />}
                            color="emerald"
                        />
                        <CategoryCard
                            title="大学受験・高校英語"
                            description="システム英単語、ターゲットなど。共通テストから難関大入試までをカバー。"
                            href="/mistap/textbook/high-school"
                            icon={<GraduationCap className="w-8 h-8 text-blue-500" />}
                            color="blue"
                        />
                        <CategoryCard
                            title="古文単語"
                            description="重要古文単語315など。苦手な古文単語をイラスト解説付きで克服。"
                            href="/mistap/textbook/kobun"
                            icon={<BookOpen className="w-8 h-8 text-rose-500" />}
                            color="rose"
                        />
                        <CategoryCard
                            title="TOEIC・資格"
                            description="金のフレーズ、DUO 3.0。スコアアップに直結する語彙力を養成。"
                            href="/mistap/textbook/toeic"
                            icon={<Briefcase className="w-8 h-8 text-orange-500" />}
                            color="orange"
                        />
                    </div>
                </section>

                {/* Philosophy Section (E-E-A-T Core) */}
                <section className="bg-white py-20 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="prose prose-lg prose-slate mx-auto">
                            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                                Mistapの学習設計思想
                            </h2>

                            <h3 className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                1. 「検索練習」による記憶の強化
                            </h3>
                            <p>
                                認知心理学の研究において、記憶を定着させる最も効果的な方法は、情報を繰り返し読むことではなく、
                                「思い出そうとする（検索する）」プロセスにあることが分かっています（Roediger & Karpicke, 2006）。
                                Mistapは、単語を見るだけでなく「4択から選ぶ」「意味を答える」というテスト形式（検索練習）を主軸にすることで、
                                読むだけの学習よりも高い定着率を実現します。
                            </p>

                            <h3 className="flex items-center gap-3 text-xl font-bold text-slate-800 mt-12">
                                2. メタ認知の促進と「苦手」の可視化
                            </h3>
                            <p>
                                学習において「自分が何を分かっていて、何を分かっていないか」を把握すること（メタ認知）は極めて重要です。
                                しかし、紙の単語帳では自分の苦手な単語を正確に把握・管理するのは困難です。
                                Mistapは、間違えた単語を即座にデータベース化し、「苦手リスト」として可視化します。
                                これにより、学習者は自分の弱点を客観的に認識し、効率的な復習サイクルを回すことができます。
                            </p>

                            <h3 className="flex items-center gap-3 text-xl font-bold text-slate-800 mt-12">
                                3. スモールステップの学習体験
                            </h3>
                            <p>
                                巨大な目標（例：「英単語2000語を覚える」）は、学習者のモチベーションを低下させることがあります。
                                Mistapでは、各教材を「Part」「Section」「Unit」といった小さな単位（チャンク）に分割しています。
                                1回数分のテストを積み重ねることで、達成感を得ながら、無理なく継続的な学習習慣を形成できるように設計されています。
                            </p>

                            <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-500">
                                <h4 className="font-bold text-slate-700 mb-2">運営・監修について</h4>
                                <p>
                                    Mistapは、教育工学とWeb技術を融合させたEdTechプロジェクト「EduLens」によって運営されています。
                                    私たちは、テクノロジーの力で学習の「不便」や「非効率」を解消し、誰もが質の高い学習環境にアクセスできる社会を目指しています。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <MistapFooter />
        </div>
    );
}

function CategoryCard({ title, description, href, icon, color }: any) {
    const colorClasses: Record<string, string> = {
        emerald: "border-l-4 border-emerald-500 hover:shadow-emerald-100",
        blue: "border-l-4 border-blue-500 hover:shadow-blue-100",
        rose: "border-l-4 border-rose-500 hover:shadow-rose-100",
        orange: "border-l-4 border-orange-500 hover:shadow-orange-100",
    };

    const className = colorClasses[color] || "border-l-4 border-slate-500";

    return (
        <Link
            href={href}
            className={`block bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
        >
            <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-lg shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
                        {title}
                        <ChevronRight className="w-5 h-5 ml-1 text-slate-400" />
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
