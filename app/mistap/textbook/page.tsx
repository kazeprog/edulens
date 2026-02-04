import type { Metadata } from 'next';
import Link from 'next/link';
import GoogleAdsense from '@/components/GoogleAdsense';
import { BookOpen, ChevronRight, School, GraduationCap, Briefcase, HelpCircle, CheckCircle2 } from 'lucide-react';
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

interface Textbook {
    name: string;
    description: string;
    path: string;
    color: string;
    badge?: string;
}

// データ定義（JSON-LDと描画の両方で使用）
const universityTextbooks: Textbook[] = [
    {
        name: "鉄緑会 鉄壁",
        description: "東大受験生のバイブル。鉄緑会のメソッドで難関大英単語を完全攻略。",
        path: "/mistap/textbook/teppeki",
        color: "rose",
        badge: "東大必須"
    },
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
        name: "ターゲット1400",
        description: "大学受験の必須単語。共通テスト・中堅大対策に最適。",
        path: "/mistap/textbook/target-1400",
        color: "blue"
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
    },
    {
        name: "核心古文単語351",
        description: "「意味のつながり」で理解を深める。尚文出版の入試必携単語帳。",
        path: "/mistap/textbook/kobun-351",
        color: "blue"
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
    },
    {
        name: "ターゲット1800",
        description: "中学・高校入試合格のための1800語を完全収録。基礎から応用まで。",
        path: "/mistap/textbook/target-1800",
        color: "blue",
        badge: "人気"
    },
    {
        name: "英単語150",
        description: "中学英語で最初に覚えるべき超重要150語。土台作りに最適。",
        path: "/mistap/textbook/absolute-150",
        color: "emerald"
    },
    {
        name: "不規則動詞（過去形）",
        description: "中学・高校英語に必須の不規則動詞。過去形を完璧にマスター。",
        path: "/mistap/textbook/past-tense",
        color: "blue"
    },
    {
        name: "不規則動詞（過去分詞）",
        description: "完了形や受け身に欠かせない過去分詞形。活用をセットで攻略。",
        path: "/mistap/textbook/past-participle",
        color: "indigo"
    }
];

// すべての教科書データをフラットにする（JSON-LD用）
const allTextbooks = [
    ...universityTextbooks,
    ...toeicTextbooks,
    ...kobunTextbooks,
    ...juniorTextbooks
];

export default function TextbookIndexPage() {
    // 構造化データ: ItemList (教材一覧)
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Mistap対応教材一覧",
        "description": "Mistapでテスト可能な英単語帳・教科書の一覧です。",
        "numberOfItems": allTextbooks.length,
        "itemListElement": allTextbooks.map((book, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": book.name,
            "description": book.description,
            "url": `https://edulens.jp${book.path}`
        }))
    };

    // 構造化データ: FAQ
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Mistapは無料で使えますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "はい、Mistapの基本的な単語テスト機能や学習記録機能はすべて無料でご利用いただけます。"
                }
            },
            {
                "@type": "Question",
                "name": "対応していない単語帳はありますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "現在、主要な英単語帳や教科書に対応していますが、未対応の教材も順次追加予定です。リクエスト機能からご要望をお寄せください。"
                }
            },
            {
                "@type": "Question",
                "name": "テストの結果は保存されますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "はい、間違えた単語は自動的に「苦手リスト」に保存され、後から重点的に復習テストを行うことができます。"
                }
            }
        ]
    };

    // 構造化データ: BreadcrumbList
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "EduLens",
                "item": "https://edulens.jp"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Mistap",
                "item": "https://edulens.jp/mistap"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "対応教材一覧",
                "item": "https://edulens.jp/mistap/textbook"
            }
        ]
    };

    // 構造化データ: SoftwareApplication (Individual Textbooks)
    const systemWordsAppJsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "システム英単語 テスト (Mistap)",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
        }
    };

    const target1900AppJsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ターゲット1900 テスト (Mistap)",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
        }
    };

    // 構造化データ: EducationalAudience
    const audienceJsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalAudience",
        "educationalLevel": "HighSchool",
        "audienceType": "Student"
    };

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

                <div className="container mx-auto px-4 max-w-5xl py-8">
                    {/* University / Wordbooks */}
                    <Section
                        title="大学受験・高校英語"
                        icon={<GraduationCap className="w-8 h-8 text-blue-500" />}
                        description="共通テスト、二次試験対策の決定版。システム英単語、ターゲットなど主要単語帳を網羅。"
                    >
                        {universityTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* TOEIC / Business */}
                    <Section
                        title="TOEIC・資格"
                        icon={<Briefcase className="w-8 h-8 text-orange-500" />}
                        description="スコアアップに直結する重要語彙を効率的に強化。金のフレーズ等に対応。"
                    >
                        {toeicTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* Classical Japanese */}
                    <Section
                        title="古文単語"
                        icon={<BookOpen className="w-8 h-8 text-rose-500" />}
                        description="苦手な古文単語も単語カード形式ならサクサク覚えられる。イラスト付きの解説で定着度アップ。"
                    >
                        {kobunTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* Junior High */}
                    <Section
                        title="中学生・教科書"
                        icon={<School className="w-8 h-8 text-emerald-500" />}
                        description="New Horizonなど中学校の教科書に対応。定期テスト前のUnit別対策に最適。"
                    >
                        {juniorTextbooks.map((textbook, idx) => (
                            <TextbookCard key={idx} {...textbook} />
                        ))}
                    </Section>

                    {/* SEO Content Section */}
                    <section className="mt-24 pt-16 border-t border-slate-200">
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="text-blue-600">Mistap</span>で単語学習を効率化しよう
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
                                により、学習者は自分の弱点を客観的に認識し、効率的な復習サイクルを回すことができます。
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

                            {/* AdSense Section */}
                            <div className="py-8 flex justify-center border-t border-slate-100 my-8">
                                <div className="w-full max-w-4xl px-4">
                                    <GoogleAdsense
                                        style={{ display: 'block', minHeight: '280px', textAlign: 'center' }}
                                    />
                                </div>
                            </div>

                            {/* FAQ Area */}
                            <div className="mt-16 pt-10 border-t border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-slate-400" />
                                    よくある質問
                                </h3>
                                <div className="space-y-4">
                                    {faqJsonLd.mainEntity.map((faq, i) => (
                                        <div key={i} className="bg-slate-50 rounded-lg p-5">
                                            <h4 className="font-bold text-slate-800 text-sm md:text-base mb-2">Q. {faq.name}</h4>
                                            <p className="text-sm text-slate-600">{faq.acceptedAnswer.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <MistapFooter />
        </div>
    );
}

function Section({ title, icon, description, children }: { title: string, icon: React.ReactNode, description: string, children: React.ReactNode }) {
    return (
        <section className="py-12 border-b border-slate-100 last:border-0">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-shrink-0 p-3 bg-slate-50 rounded-xl h-fit w-fit">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
                        {title}
                    </h2>
                    <p className="text-slate-600 max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </section>
    );
}

function TextbookCard({ name, description, path, color, badge }: Textbook) {
    const colorClasses: Record<string, string> = {
        emerald: "border-l-4 border-emerald-500 hover:shadow-emerald-100",
        blue: "border-l-4 border-blue-500 hover:shadow-blue-100",
        rose: "border-l-4 border-rose-500 hover:shadow-rose-100",
        orange: "border-l-4 border-orange-500 hover:shadow-orange-100",
        sky: "border-l-4 border-sky-500 hover:shadow-sky-100",
        indigo: "border-l-4 border-indigo-500 hover:shadow-indigo-100",
    };

    const className = colorClasses[color] || "border-l-4 border-slate-500";

    return (
        <Link
            href={path}
            className={`block bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className} relative overflow-hidden group`}
        >
            {badge && (
                <span className="absolute top-3 right-3 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    {badge}
                </span>
            )}
            <div className="pr-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                    {name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                    {description}
                </p>
            </div>
            <div className="mt-4 flex justify-end">
                <span className="text-xs font-bold text-slate-400 flex items-center group-hover:text-blue-500 transition-colors">
                    テストする <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
            </div>
        </Link>
    );
}
