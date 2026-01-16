import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ISR設定
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const now = new Date();
    const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const year = jstNow.getFullYear();

    return {
        title: `資格試験日程一覧・カウントダウン【${year}年最新】 | EduLens`,
        description: `【${year}年～${year + 1}年】医師、宅建、簿記、基本情報技術者など、様々な資格試験の日程一覧。試験日までのカウントダウン、出願期間、合格発表日を確認できます。`,
        keywords: [
            `資格試験 ${year}`,
            "資格試験 日程",
            "資格 カウントダウン",
            "国家資格",
            "公的資格",
            "民間資格",
            "宅建 試験日",
            "簿記 試験日",
            "ITパスポート 試験日",
            "基本情報技術者試験",
            "看護師国家試験",
            "行政書士 試験日",
            "社会福祉士 試験日"
        ],
        alternates: {
            canonical: 'https://edulens.jp/countdown/qualification',
        },
        openGraph: {
            title: `資格試験日程一覧・カウントダウン【${year}年最新】 | EduLens`,
            description: `【${year}年最新】医療・法律・IT・ビジネスなど様々な資格試験の日程まとめ。あと何日で試験などのカウントダウンも確認できます。`,
            url: 'https://edulens.jp/countdown/qualification',
            type: 'website',
            siteName: 'EduLens',
        },
        twitter: {
            card: 'summary_large_image',
            title: `資格試験日程一覧・カウントダウン【${year}年最新】 | EduLens`,
            description: `【${year}年最新】様々な資格試験の日程とカウントダウン一覧。`,
        },
    };
}

type Exam = {
    id: string;
    slug: string;
    session_slug: string;
    exam_name: string;
    primary_exam_date: string;
    result_date: string | null;
    category?: string | null;
}

import { categories } from '@/app/constants/examCategories';

export default async function QualificationPage() {
    // 今日の日付
    const now = new Date();
    const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const todayStr = jstNow.toISOString().split('T')[0];
    const today = new Date(todayStr);

    const year = jstNow.getFullYear();

    // 全試験データを取得 (categoryを含めて取得)
    const { data: allExams } = await supabase
        .from('exam_schedules')
        .select('*')
        .not('category', 'is', null) // カテゴリが設定されているものだけ取得
        .order('primary_exam_date', { ascending: true });

    if (!allExams) {
        notFound();
    }

    // カテゴリごとにデータをフィルタリングして整理
    const groupedExams = categories.map(cat => {
        // DBのcategoryカラムが一致するものを抽出
        const categoryExams = allExams.filter(exam => exam.category === cat.id);

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
                    "itemListElement": groupedExams.flatMap(group => group.exams).map((exam, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `https://edulens.jp/countdown/${exam.slug}/${exam.session_slug}`,
                        "name": exam.exam_name
                    }))
                }
            }
        ]
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* パンくずリスト */}
                <nav className="flex text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <Link href="/" className="hover:text-blue-600 transition-colors">EduLens</Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <Link href="/countdown" className="hover:text-blue-600 transition-colors ml-1">入試選択</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <span className="ml-1 text-slate-700 font-medium">資格試験一覧</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="text-center mb-16">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-wide">
                        資格試験日程一覧・カウントダウン <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{year}年版</span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        国家・公的・民間など様々な資格試験の日程まとめ。<br className="hidden sm:inline" />
                        目指す資格の「あと何日？」をチェックして学習計画を立てよう。
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
                                            prefetch={false}
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
                                                    <time dateTime={exam.primary_exam_date}>
                                                        {exam.primary_exam_date.replace(/-/g, '/')}
                                                    </time>
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

                {/* SEO用テキストセクション */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 mt-20 max-w-4xl mx-auto">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">EduLensの資格試験カウントダウンについて</h2>
                    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                        <p>
                            EduLens（エデュレンズ）の資格試験カウントダウンページでは、国家資格、公的資格、民間資格など、主要な資格試験の最新日程を一覧で確認できます。
                            「あと何日？」が一目でわかるカウントダウン機能により、試験日に向けた学習計画のペース配分やモチベーション維持に役立ちます。
                        </p>
                        <p>
                            医療（医師・看護師など）、法律（宅建・行政書士など）、IT（基本情報・ITパスポートなど）、ビジネス（簿記・FPなど）、建築など幅広いジャンルの試験を網羅。
                            各試験の詳細ページでは、試験日だけでなく、申込期間（出願期間）や合格発表日などの重要スケジュールも掲載。
                            資格取得を目指す受験生の毎日の学習をサポートします。
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center pt-8 border-t border-slate-200">
                    <Link href="/countdown" prefetch={false} className="text-blue-600 hover:underline inline-flex items-center gap-2 font-medium">
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
