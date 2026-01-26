import type { Metadata } from 'next';
import Link from 'next/link';
import GoogleAdsense from '@/components/GoogleAdsense';
import { BookOpen, ChevronRight, School, GraduationCap, Briefcase, HelpCircle, CheckCircle2 } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const metadata: Metadata = {
    title: 'Mistap対応教材一覧｜英単語帳・教科書の単語テストアプリ',
    description: 'Mistap（ミスタップ）で利用できる英単語帳・古文単語帳・教科書の一覧ページです。システム英単語、ターゲット、LEAP、New Horizonなど、主要な教材に完全対応。自分だけの単語テストを無料で作成できます。',
    keywords: [
        'Mistap 教材',
        '英単語帳 テスト アプリ',
        'システム英単語 アプリ',
        'ターゲット1900 テスト',
        'New Horizon 単語一覧',
        '古文単語 暗記 アプリ',
        '単語テスト 自動作成'
    ],
    openGraph: {
        title: 'Mistap対応教材一覧｜英単語帳・教科書の単語テストアプリ',
        description: 'システム英単語、ターゲット、LEAP、New Horizonなど主要教材に完全対応。Mistapで効率的な単語学習を始めよう。',
        url: 'https://edulens.jp/mistap/textbook',
        type: 'website',
        siteName: 'Mistap',
        images: [
            {
                url: '/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap対応教材一覧',
            },
        ],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook',
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(systemWordsAppJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(target1900AppJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(audienceJsonLd) }}
            />

            <main className="pb-20">
                {/* Hero */}
                <section className="bg-white py-16 border-b border-slate-200">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
                            Mistap対応教材一覧｜<br className="sm:hidden" />英単語帳・教科書の単語テスト
                        </h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Mistapは、市販の人気単語帳や学校の教科書に完全対応した無料アプリです。<br />
                            お手持ちの教材を選んで、今すぐ効率的な暗記学習を始めましょう。
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 space-y-16 max-w-5xl">

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
                        description="苦手な古文単語もクイズ形式ならサクサク覚えられる。イラスト付きの解説で定着度アップ。"
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
                            <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-700 mb-3">市販の単語帳・教科書に完全対応</h3>
                                    <p>
                                        Mistapは、<strong>システム英単語、ターゲット1900、LEAP</strong>といった大学受験の定番英単語帳から、
                                        <strong>New Horizon、New Crown</strong>などの中学校検定教科書、さらには<strong>古文単語帳</strong>まで幅広く対応しています。
                                        各教材の目次や章立てに沿ってテストが作られているため、学校の授業の進度や、試験範囲に合わせたピンポイントな学習が可能です。
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-700 mb-3">「間違えた単語」だけを自動記録</h3>
                                    <p>
                                        紙の単語帳で学習する際、付箋を貼ったりチェックを入れたりするのが面倒ではありませんか？
                                        Mistapなら、アプリ上でテストを行い、間違えた単語をタップするだけで<strong>自動的に「苦手リスト」に登録</strong>されます。
                                        復習時はこの苦手リストから出題されるため、覚えている単語を飛ばして、効率的に知識の穴を埋めることができます。
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-700 mb-3">こんな人におすすめ</h3>
                                    <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>通学中のスキマ時間を有効活用したい高校生</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>定期テストの範囲を指定して一気に復習したい中学生</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>TOEICの頻出単語をゲーム感覚で覚えたい社会人</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>古文単語の助動詞や敬語など、紛らわしい語句を整理したい受験生</span>
                                        </li>
                                    </ul>
                                </div>
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
        <section>
            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        {icon}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                </div>
                <p className="text-slate-500 text-sm md:text-base md:pb-1 md:pl-2 leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            prefetch={false}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
        >
            {badge && (
                <span className={`absolute -top-3 -right-3 ${colorClasses.replace('hover:', '')} bg-gradient-to-r text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10`}>
                    {badge}
                </span>
            )}

            <div className={`w-12 h-12 ${bgColors} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <BookOpen className={`w-6 h-6 ${textColors}`} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">
                {name}<span className="text-sm font-normal ml-1.5 opacity-80">単語テスト</span>
            </h3>

            <p className="sr-only">
                {name} 単語テスト 無料 アプリ 暗記 問題集 自動生成
            </p>

            <p className="text-sm text-slate-500 flex-grow leading-relaxed mb-4">
                {description}
            </p>

            {/* Keyword tags (SEO doping) */}
            <div className="mt-auto mb-4 flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">テスト</span>
                <span className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">無料</span>
                <span className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">アプリ</span>
            </div>

            <div className={`flex items-center text-sm font-bold ${textColors} opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                {name} 単語テストを開始 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </Link>
    );
}
