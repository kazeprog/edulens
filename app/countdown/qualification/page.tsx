import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import type { Metadata } from 'next';

// ISR設定
export const revalidate = 86400;

export const metadata: Metadata = {
    title: '資格試験日程一覧 | EduLens',
    description: '医師、宅建、簿記、基本情報技術者など、様々な資格試験の日程一覧。試験日までのカウントダウン、出願期間、合格発表日を確認できます。',
    keywords: [
        "資格試験 日程",
        "資格 カウントダウン",
        "国家資格",
        "公的資格",
        "民間資格",
        "宅建 試験日",
        "簿記 試験日",
        "ITパスポート 試験日"
    ],
    alternates: {
        canonical: 'https://edulens.jp/countdown/qualification',
    },
    openGraph: {
        title: '資格試験日程一覧 | EduLens',
        description: '医療・法律・IT・ビジネスなど様々な資格試験の日程まとめ。あと何日で試験などのカウントダウンも確認できます。',
        url: 'https://edulens.jp/countdown/qualification',
        type: 'website',
        siteName: 'EduLens',
    },
    twitter: {
        card: 'summary_large_image',
        title: '資格試験日程一覧 | EduLens',
        description: '様々な資格試験の日程とカウントダウン一覧。',
    },
};

type Exam = {
    id: string;
    slug: string;
    session_slug: string;
    exam_name: string;
    primary_exam_date: string;
    result_date: string | null;
}

// カテゴリ定義
const categories = [
    {
        id: 'medical',
        name: '医療・医薬品・健康',
        slugs: ['doctor', 'dentist', 'pharmacist', 'nurse', 'public-health-nurse', 'midwife', 'radiological-technologist', 'clinical-laboratory-technician', 'clinical-engineer', 'registered-dietitian'],
        color: 'bg-blue-50 border-blue-100 text-blue-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        )
    },
    {
        id: 'legal',
        name: '法律・不動産',
        slugs: ['takken', 'gyosei-shoshi', 'sharoushi', 'shiho-shoshi'],
        color: 'bg-red-50 border-red-100 text-red-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
        )
    },
    {
        id: 'business',
        name: '金融・ビジネス',
        slugs: ['fp', 'boki'],
        color: 'bg-amber-50 border-amber-100 text-amber-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
    },
    {
        id: 'it',
        name: 'IT・情報',
        slugs: ['ap'],
        color: 'bg-cyan-50 border-cyan-100 text-cyan-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        )
    },
    {
        id: 'construction',
        name: '建築・施工',
        slugs: ['kenchikushi-1', 'kenchikushi-2'],
        color: 'bg-orange-50 border-orange-100 text-orange-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        )
    },
    {
        id: 'rehab',
        name: 'リハビリ・技術',
        slugs: ['pt', 'ot', 'st', 'orthoptist', 'prosthetist-orthotist', 'paramedic', 'dental-hygienist', 'dental-technician'],
        color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
    },
    {
        id: 'welfare',
        name: '福祉・介護・その他',
        slugs: ['social-worker', 'care-worker', 'mental-health-social-worker', 'weather'],
        color: 'bg-indigo-50 border-indigo-100 text-indigo-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        )
    },
    {
        id: 'oriental',
        name: '東洋医学・柔整',
        slugs: ['judo-therapist', 'massage-shiatsu', 'acupuncturist', 'moxibustionist'],
        color: 'bg-stone-50 border-stone-100 text-stone-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
    }
];

export default async function QualificationPage() {
    // 今日の日付
    const now = new Date();
    const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const todayStr = jstNow.toISOString().split('T')[0];
    const today = new Date(todayStr);

    // 全試験データを取得
    const { data: allExams } = await supabase
        .from('exam_schedules')
        .select('*')
        .order('primary_exam_date', { ascending: true });

    if (!allExams) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-slate-500">試験データの取得に失敗しました。</p>
            </div>
        );
    }

    // カテゴリごとにデータをフィルタリングして整理
    const groupedExams = categories.map(cat => {
        // このカテゴリに属するスラグのみ抽出
        const categoryExams = allExams.filter(exam => cat.slugs.includes(exam.slug));

        // さらに、最新の有効な試験日（またはまだ終わっていない試験）を抽出するロジック
        // ここでは単純に、slugごとに1つ（直近または最新のもの）を表示するようにします。
        // 同じslugで複数ある場合は日付が新しいものを優先しつつ、今日以降のものを優先したいが、
        // 基本的に各slugにつき1レコード(今年の試験)が入っている前提で処理します。

        // slugごとにグループ化
        const examsBySlug: { [key: string]: Exam } = {};
        categoryExams.forEach(exam => {
            const existing = examsBySlug[exam.slug];
            if (!existing) {
                examsBySlug[exam.slug] = exam;
                return;
            }

            // 既存エントリーと新しいエントリーの比較 (リストは日付昇順で来る前提)
            const existingDate = new Date(existing.primary_exam_date);
            const newDate = new Date(exam.primary_exam_date);
            // 簡易的に終了判定（今日以降なら未来）
            // 正確には result_date も考慮すべきですが、ここでは primary_exam_date ベースで判断
            const isExistingFuture = existingDate >= today;
            const isNewFuture = newDate >= today;

            if (isNewFuture && !isExistingFuture) {
                // 新しいのが未来、既存が過去なら、未来を優先（上書き）
                examsBySlug[exam.slug] = exam;
            } else if (isNewFuture && isExistingFuture) {
                // 両方未来なら、より日付が近いほう（＝日付が小さいほう）を優先
                // リストは昇順なので、既存(existing)の方が近いはず。よって上書きしない。
            } else if (!isNewFuture && !isExistingFuture) {
                // 両方過去なら、より新しいほう（＝日付が大きいほう）を優先
                // リストは昇順なので、新しい(exam)の方が最近の過去。よって上書きする。
                examsBySlug[exam.slug] = exam;
            }
            // 新しいのが過去、既存が未来なら、未来を維持（何もしない）
        });

        return {
            category: cat,
            exams: Object.values(examsBySlug).sort((a, b) => a.primary_exam_date.localeCompare(b.primary_exam_date))
        };
    }).filter(group => group.exams.length > 0);

    // 構造化データ (JSON-LD)
    const ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "EduLens", "item": "https://edulens.jp" },
                    { "@type": "ListItem", "position": 2, "name": "入試選択", "item": "https://edulens.jp/countdown" },
                    { "@type": "ListItem", "position": 3, "name": "資格試験一覧", "item": "https://edulens.jp/countdown/qualification" }
                ]
            },
            {
                "@type": "CollectionPage",
                "name": "資格試験日程一覧",
                "description": "医師、宅建、簿記などの資格試験日程一覧。",
                "url": "https://edulens.jp/countdown/qualification",
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": groupedExams.flatMap(group =>
                        group.exams.map((exam, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://edulens.jp/countdown/${exam.slug}/${exam.session_slug}`,
                            "name": exam.exam_name
                        }))
                    )
                }
            }
        ]
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-wide">
                        資格試験日程一覧
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        国家・公的・民間など様々な資格試験の日程まとめ。<br className="hidden sm:inline" />
                        目指す資格の「カウントダウン」をチェックしよう。
                    </p>
                </div>

                <div className="space-y-12">
                    {groupedExams.map((group) => (
                        <section key={group.category.id}>
                            <div className={`flex items-center gap-3 mb-6 pb-2 border-b ${group.category.color.split(' ')[1].replace('bg-', 'border-')}`}>
                                <div className={`p-2 rounded-lg ${group.category.color.split(' ')[0]} ${group.category.color.split(' ')[2]}`}>
                                    {group.category.icon}
                                </div>
                                <h2 className="text-xl font-bold text-slate-700">
                                    {group.category.name}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {group.exams.map((exam) => {
                                    const examDate = new Date(exam.primary_exam_date);
                                    const diffTime = examDate.getTime() - today.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    const isFinished = diffDays < 0;

                                    return (
                                        <Link
                                            key={exam.id}
                                            href={`/countdown/${exam.slug}/${exam.session_slug}`}
                                            className="group bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all block relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1" title={exam.exam_name}>
                                                    {exam.exam_name}
                                                </h3>
                                                {/* 残り日数バッジ */}
                                                {!isFinished ? (
                                                    <span className="shrink-0 inline-flex items-center justify-center bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded">
                                                        あと{diffDays}日
                                                    </span>
                                                ) : (
                                                    <span className="shrink-0 inline-flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-bold px-2 py-1 rounded">
                                                        終了
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-slate-500 mb-1">
                                                <span className="block text-xs text-slate-400 mb-0.5">NEXT EXAM</span>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {exam.primary_exam_date.replace(/-/g, '/')}
                                                </div>
                                            </div>

                                            <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-16 text-center pt-8 border-t border-slate-200">
                    <Link href="/countdown" className="text-blue-600 hover:underline inline-flex items-center gap-2 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        カテゴリ選択に戻る
                    </Link>
                </div>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
                />

            </div>
        </div>
    );
}
