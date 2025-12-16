import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CountdownWithActions from './CountdownWithActions';
import ActionButtons from './ActionButtons';
import type { Metadata, ResolvingMetadata } from 'next';

// ISR設定: 1分ごとにキャッシュを更新
export const revalidate = 60;

type Params = Promise<{ slug: string; session: string }>;

// 日付フォーマット用関数
const formatDateJap = (dateStr: string | null) => {
  if (!dateStr) return "";
  const p = dateStr.split('-');
  return p.length === 3 ? `${p[0]}年${parseInt(p[1])}月${parseInt(p[2])}日` : dateStr;
};

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, session } = await params;

  const { data: exam } = await supabase
    .from('exam_schedules')
    .select('*')
    .eq('slug', slug)
    .eq('session_slug', session)
    .single();

  if (!exam) {
    return { title: '試験が見つかりません | EduLens' };
  }

  const d = new Date(exam.primary_exam_date);
  const examDateText = `${d.getMonth() + 1}月${d.getDate()}日`;

  // 親（opengraph-image.png）の画像情報を取得
  const previousImages = (await parent).openGraph?.images || [];

  // ✅ タイトル：検索キーワード「いつ？」「あと何日？」を左側に配置してCTR向上を狙う
  const title = `${exam.exam_name}試験日はいつ？あと何日？${exam.session_name}日程カウントダウン | EduLens`;

  // ✅ ディスクリプション：具体的な日付とベネフィット（スケジュール管理）を提示
  const description = `【${exam.exam_name}】${exam.session_name}の試験日（${examDateText}）まであと何日？申し込み期間からWeb合格発表日まで、受験に必要な最新スケジュールを完全ガイド。直前対策や計画的な学習に役立つリアルタイムカウントダウン。`;

  const url = `https://edulens.jp/countdown/${slug}/${session}`;

  return {
    title: title,
    description: description,
    keywords: [
      `${exam.exam_name} 試験日`,
      `${exam.exam_name} いつ`,
      `${exam.exam_name} あと何日`,
      `${exam.exam_name} ${exam.session_name}`,
      "申し込み期間",
      "合格発表",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      siteName: 'EduLens',
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

export default async function QualificationCountdownPage({ params }: { params: Params }) {
  const { slug, session } = await params;

  const { data: exam } = await supabase
    .from('exam_schedules')
    .select('*')
    .eq('slug', slug)
    .eq('session_slug', session)
    .single();

  if (!exam) return notFound();

  const displayExamName = exam.exam_name;
  const displaySessionName = exam.session_name;
  const displayExamDate = exam.primary_exam_date;
  const displayExamDateDots = displayExamDate.split('-').join('.');
  const displayExamDateJap = formatDateJap(displayExamDate);
  const resultDateJap = formatDateJap(exam.result_date);

  // 日付計算
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = new Date(jstNow.toISOString().split('T')[0]);
  const examDate = new Date(displayExamDate);
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  // ✅ 構造化データ (FAQの内容を充実させる)
  const faqItems = [
    {
      question: `${displayExamName} ${displaySessionName}の試験日はいつですか？`,
      answer: `${displaySessionName}の一次試験（試験日）は、${displayExamDateJap}に実施されます。本番まであと${diffDays > 0 ? diffDays : 0}日です。`
    }
  ];

  if (exam.application_end) {
    faqItems.push({
      question: "申し込み期間（出願期間）はいつまでですか？",
      answer: `申し込みは${formatDateJap(exam.application_start)}から開始され、締め切りは${formatDateJap(exam.application_end)}です。`
    });
  }

  if (exam.result_date) {
    faqItems.push({
      question: "合格発表はいつですか？",
      answer: `Web合否発表（または結果発送）は${resultDateJap}に予定されています。`
    });
  }

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "EduLens", "item": "https://edulens.jp" },
          { "@type": "ListItem", "position": 2, "name": "入試選択", "item": "https://edulens.jp/countdown" },
          { "@type": "ListItem", "position": 3, "name": `${displayExamName}一覧`, "item": `https://edulens.jp/countdown/${slug}` },
          { "@type": "ListItem", "position": 4, "name": `${displaySessionName}`, "item": `https://edulens.jp/countdown/${slug}/${session}` }
        ]
      },
      {
        "@type": "Event",
        "name": `${displayExamName} ${displaySessionName}`,
        "startDate": displayExamDate,
        "endDate": displayExamDate,
        "eventStatus": "https://schema.org/EventScheduled",
        "description": `${displayExamName} ${displaySessionName}の試験日。${displayExamDateJap}実施。`,
        "location": {
          "@type": "Place",
          "name": "日本全国の試験会場",
          "address": { "@type": "PostalAddress", "addressCountry": "JP" }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">

        {/* ✅ H1タグの改善: 隠しテキストではなく、視覚的に見えるタイトルをH1にする */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {displayExamName}
            <span className="block text-2xl sm:text-3xl text-slate-500 font-medium mt-2">
              {displaySessionName}
            </span>
          </h1>
        </div>

        {/* カウントダウン表示エリア */}
        <CountdownWithActions 
          examName={displayExamName}
          sessionName={displaySessionName}
          displayExamDateDots={displayExamDateDots}
          displayExamDate={displayExamDate}
          isExpired={isExpired}
        />

        {/* 日程詳細リスト */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12 text-left">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              試験日程詳細
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {/* 申込期間 */}
            {(exam.application_start || exam.application_end) && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">申込期間</span>
                <span className="text-slate-700 font-medium">
                  {formatDateJap(exam.application_start)} 〜 {formatDateJap(exam.application_end)}
                </span>
              </div>
            )}

            {/* 一次試験 */}
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">一次試験 (試験日)</span>
              <span className="text-lg font-bold text-slate-800">
                {displayExamDateJap}
              </span>
            </div>

            {/* 二次試験 A/B */}
            {exam.secondary_exam_date_a && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">二次試験 (A日程)</span>
                <span className="text-slate-700 font-medium">{formatDateJap(exam.secondary_exam_date_a)}</span>
              </div>
            )}
            {exam.secondary_exam_date_b && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">二次試験 (B日程)</span>
                <span className="text-slate-700 font-medium">{formatDateJap(exam.secondary_exam_date_b)}</span>
              </div>
            )}

            {/* 合格発表日 */}
            {exam.result_date && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/60">
                <span className="text-sm font-bold text-blue-600 w-36 flex-shrink-0">Web合否発表</span>
                <span className="text-lg font-bold text-blue-700">{formatDateJap(exam.result_date)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ▼▼▼ アクションボタンエリア（縦並び） ▼▼▼ */}
        <ActionButtons 
          examName={displayExamName}
          sessionName={displaySessionName}
          slug={slug}
          sessionSlug={session}
          diffDays={diffDays}
        />
        {/* ▲▲▲ エリア終了 ▲▲▲ */}

        {/* ✅ SEO用コンテンツエリア（新規追加） */}
        <div className="w-full max-w-3xl mx-auto mt-16 text-left border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {displayExamName} {displaySessionName} 試験日程まとめ
          </h2>
          <div className="prose prose-slate text-slate-600 leading-relaxed space-y-4">
            <p>
              <strong>{displayExamName} {displaySessionName}</strong>の試験日は<strong className="text-blue-600">{displayExamDateJap}</strong>です。
              本番まで残り<strong className="text-blue-600">{diffDays}日</strong>となりました。
            </p>
            <p>
              このページでは、試験当日までのカウントダウンをリアルタイムで表示しています。
              {exam.application_end && `出願期間は${formatDateJap(exam.application_end)}までとなっており、`}
              {exam.result_date && `合格発表は${formatDateJap(exam.result_date)}に行われる予定です。`}
              受験生の皆さんは、この残り日数を意識して、計画的に学習を進めることが重要です。
            </p>
            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">よくある質問</h3>
            <dl className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index}>
                  <dt className="font-bold text-slate-700">Q. {item.question}</dt>
                  <dd className="text-slate-600 text-sm mt-1">A. {item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href={`/countdown/${slug}`} className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {displayExamName}の日程一覧に戻る
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        
        <div className="text-center mt-16 pb-8 border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            GOOD LUCK TO <span className="text-blue-600">ALL EXAMINEES</span>
          </p>
        </div>
      </div>
    </div>
  );
}