import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import MonthlyList from './MonthlyList';
import OtherQualifications from './OtherQualifications';

// ISR設定
export const revalidate = 86400;

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // 年の取得
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const year = jstNow.getFullYear();

  // 代表的な試験名を取得するために1件取得
  const { data: nextExam } = await supabase
    .from('exam_schedules')
    .select('exam_name')
    .eq('slug', slug)
    .limit(1)
    .single();

  // データ取得ができなかった場合などはslugを大文字化して代用
  const displayExamName = nextExam?.exam_name || slug.toUpperCase();

  // 検索意図「いつ？あと何日？」をそのままタイトルに反映 + 年号
  const title = `${displayExamName}の日程・カウントダウン【${year}年最新】 | EduLens`;

  // 問いかけと解決策（リアルタイムカウントダウン）を提示
  const description = `【${year}年～${year + 1}年】${displayExamName}の試験日はいつ？本番まであと何日かをリアルタイムでカウントダウン。日程、出願期間、合格発表日まで最新情報を一覧で掲載。`;

  const url = `https://edulens.jp/countdown/${slug}`;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: title,
    description: description,
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      `${displayExamName} ${year}`,
      `${displayExamName} 試験日`,
      `${displayExamName} いつ`,
      `${displayExamName} あと何日`,
      `${displayExamName} 日程`,
      "カウントダウン",
      "合格発表",
      "申し込み期間"
    ],
    alternates: { canonical: url },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      images: previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: previousImages,
    },
  };
}

export default async function ExamListPage({ params }: { params: Params }) {
  const { slug } = await params;

  // 今日の日付を取得
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const todayStr = jstNow.toISOString().split('T')[0];
  const today = new Date(todayStr);

  // 試験日程を取得（日付順）
  const { data: exams } = await supabase
    .from('exam_schedules')
    .select('*')
    .eq('slug', slug)
    .order('primary_exam_date', { ascending: true });

  // フィルタリング: Web合否発表日（なければ試験日）が過ぎたものは除外
  const filteredExams = exams?.filter(exam => {
    const compareDate = exam.result_date || exam.primary_exam_date;
    return compareDate >= todayStr;
  }) || [];

  // リダイレクトを廃止：親ページを常に表示してインデックス可能にする
  // 試験が1件の場合も一覧ページを表示（1クリックで詳細へ移動可能）

  // 表示用の試験名を取得（データがあればその1件目から）
  let examName = filteredExams.length > 0 ? filteredExams[0].exam_name : (exams && exams.length > 0 ? exams[0].exam_name : slug);

  // 英検の場合の表示調整
  if (slug === 'eiken') {
    examName = '英検（実用英語技能検定）';
  }

  // 月ごとにグループ化（TOEFLの場合など）
  let monthlyGroups = null;
  if ((slug === 'toefl' || slug === 'toeic') && filteredExams.length > 0) {
    monthlyGroups = filteredExams.reduce((acc, exam) => {
      const d = new Date(exam.primary_exam_date);
      const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(exam);
      return acc;
    }, {} as { [key: string]: typeof filteredExams });
  }

  // 表示すべきデータがない場合はトップへリダイレクト
  if (filteredExams.length === 0 && !monthlyGroups) {
    notFound();
  }

  // 構造化データ (JSON-LD)
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "EduLens", "item": "https://edulens.jp" },
          { "@type": "ListItem", "position": 2, "name": "入試選択", "item": "https://edulens.jp/countdown" },
          { "@type": "ListItem", "position": 3, "name": "資格試験一覧", "item": "https://edulens.jp/countdown/qualification" },
          { "@type": "ListItem", "position": 4, "name": examName, "item": `https://edulens.jp/countdown/${slug}` }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": `${examName}の日程・カウントダウン`,
        "description": `${examName}の試験日程とカウントダウン一覧。`,
        "url": `https://edulens.jp/countdown/${slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": filteredExams.map((exam, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://edulens.jp/countdown/${exam.slug}/${exam.session_slug}`,
            "name": exam.session_name
          }))
        }
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

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
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <Link href="/countdown/qualification" className="hover:text-blue-600 transition-colors ml-1">資格試験一覧</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <span className="ml-1 text-slate-700 font-medium">{examName}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            {examName}の日程・カウントダウン <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text text-xl sm:text-2xl">{jstNow.getFullYear()}年版</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            {examName}の試験日程と<br className="hidden sm:inline" />
            試験日までのカウントダウンです。
          </p>
        </div>

        <div className="grid gap-6">
          {monthlyGroups ? (
            <MonthlyList groups={monthlyGroups} slug={slug} />
          ) : (
            filteredExams.map((exam) => {
              const examDate = new Date(exam.primary_exam_date);
              const diffTime = examDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isFinished = diffDays < 0;

              return (
                <Link
                  key={exam.id}
                  href={`/countdown/${exam.slug}/${exam.session_slug}`}
                  prefetch={false}
                  className={`block relative bg-white rounded-xl p-6 sm:p-8 shadow-sm border transition-all border-slate-100 hover:shadow-md hover:border-blue-200`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-100 text-blue-700">
                        {exam.exam_name}
                      </span>

                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
                        {exam.session_name}
                      </h2>
                      <div className="text-slate-500 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <time dateTime={exam.primary_exam_date}>
                          {exam.primary_exam_date.replace(/-/g, '.')}
                        </time>
                      </div>
                    </div>

                    <div className="text-right min-w-[120px]">
                      {isFinished ? (
                        <span className="inline-block border-2 border-slate-200 text-slate-400 font-bold px-4 py-2 rounded-lg bg-slate-50">
                          終了
                        </span>
                      ) : (
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Remaining</span>
                          <span className="text-4xl sm:text-5xl font-black tracking-tight text-blue-600">
                            {diffDays}
                          </span>
                          <span className="text-sm text-slate-500 font-bold ml-1">Days</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* SEO用テキストセクション */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">{examName}の日程と対策について</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              このページでは、{examName}の最新試験日程を確認し、試験当日までの残り日数をカウントダウン形式で把握することができます。
              定期的なスケジュールの確認や、学習計画の立案にお役立てください。
            </p>
            <p>
              各詳細ページでは、出願期間（申し込み開始日・締切日）や合格発表日などの重要なマイルストーンも掲載。
              うっかり申し込みを忘れないよう、早めのチェックをおすすめします。
              EduLensはあなたの{examName}合格を応援しています。
            </p>
          </div>
        </div>

        {/* 他の資格試験リンク */}
        <OtherQualifications currentSlug={slug} />

        <div className="mt-12 text-center">
          <Link href="/countdown" prefetch={false} className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
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
