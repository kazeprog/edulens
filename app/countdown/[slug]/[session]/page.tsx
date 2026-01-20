import { supabase } from '@/utils/supabase/client';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CountdownWithActions from './CountdownWithActions';
import ActionButtons from './ActionButtons';
// ▼ 1. Amazonリンクコンポーネントをインポート
import AmazonExamLink from '@/components/AmazonExamLink';
import ServiceList from '@/components/ServiceList';
import BannerDisplay from '@/components/AffiliateBanners/BannerDisplay';
import type { Metadata, ResolvingMetadata } from 'next';
import OtherQualifications from '../OtherQualifications';

// ISR設定: 1分ごとにキャッシュを更新
export const revalidate = 86400;

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
  const examYear = d.getFullYear(); // 試験自体の年
  const examDateText = `${d.getMonth() + 1}月${d.getDate()}日`;
  const previousImages = (await parent).openGraph?.images || [];

  // タイトルに「年」と具体的な日付を含める
  const title = `${exam.exam_name} ${exam.session_name}の日程・試験日【${examYear}年】あと何日？ | EduLens`;

  const description = `【${examYear}年最新】${exam.exam_name} ${exam.session_name}の試験日は${examYear}年${examDateText}。本番まであと何日かをリアルタイムカウントダウン。出願期間（申し込み開始・締切）、合格発表日など重要日程を完全網羅。`;

  const url = `https://edulens.jp/countdown/${slug}/${session}`;

  return {
    title: title,
    description: description,
    keywords: [
      `${exam.exam_name} ${examYear}`,
      `${exam.exam_name} ${exam.session_name}`,
      `${exam.exam_name} 試験日`,
      `${exam.exam_name} あと何日`,
      "日程",
      "出願期間",
      "合格発表日"
    ],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: 'EduLens', images: previousImages },
    twitter: { card: 'summary_large_image', title, description, images: previousImages },
    robots: {
      // TOEFLとTOEICの日付形式ページのみnoindex
      index: !((['toefl', 'toeic'].includes(slug)) && /^\d{4}-\d{2}-\d{2}$/.test(session)),
      follow: true,
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

  const { data: banners } = await supabase
    .from('affiliate_banners')
    .select('position, content')
    .eq('slug', slug)
    .eq('is_active', true);

  const countdownBottomContent = banners?.find(b => b.position === 'countdown_bottom')?.content;
  const shareBottomContent = banners?.find(b => b.position === 'share_bottom')?.content;

  if (!exam) redirect('/');

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

  // ▼ Amazon検索用キーワードの最適化ロジック
  // TOEICなら「公式問題集」、英検なら「過去問 問題集」、それ以外は「過去問」をデフォルトに
  let amazonSuffix = "過去問";
  if (displayExamName.toUpperCase().includes("TOEIC")) {
    amazonSuffix = "公式問題集";
  } else if (displayExamName.includes("英検")) {
    amazonSuffix = "過去問 問題集";
  }

  // 構造化データ
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
        "location": { "@type": "Place", "name": "日本全国の試験会場", "address": { "@type": "PostalAddress", "addressCountry": "JP" } }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">

        {/* パンくずリスト */}
        <nav className="flex text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">EduLens</Link>
            </li>
            <li className="inline-flex items-center">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <Link href="/countdown" className="hover:text-blue-600 transition-colors ml-1">入試選択</Link>
              </div>
            </li>
            <li className="inline-flex items-center">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <Link href="/countdown/qualification" className="hover:text-blue-600 transition-colors ml-1">資格試験一覧</Link>
              </div>
            </li>
            <li className="inline-flex items-center">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <Link href={`/countdown/${slug}`} className="hover:text-blue-600 transition-colors ml-1">{displayExamName}</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <span className="ml-1 text-slate-700 font-medium">{displaySessionName}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {displayExamName}
            <span className="block text-xl sm:text-3xl text-slate-500 font-medium mt-3">
              {displaySessionName} <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-lg sm:text-2xl align-middle ml-2">{new Date(displayExamDate).getFullYear()}年</span>
            </span>
          </h1>
        </div>

        <CountdownWithActions
          examName={displayExamName}
          sessionName={displaySessionName}
          displayExamDateDots={displayExamDateDots}
          displayExamDate={displayExamDate}
          isExpired={isExpired}
        />

        {/* 日程詳細リスト */}
        {countdownBottomContent && <BannerDisplay content={countdownBottomContent} />}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12 text-left">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              試験日程詳細
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(exam.application_start || exam.application_end) && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">申込期間</span>
                <span className="text-slate-700 font-medium">
                  <time dateTime={exam.application_start}>{formatDateJap(exam.application_start)}</time>
                  {' '}〜{' '}
                  <time dateTime={exam.application_end}>{formatDateJap(exam.application_end)}</time>
                </span>
              </div>
            )}
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">一次試験 (試験日)</span>
              <span className="text-lg font-bold text-slate-800">
                <time dateTime={displayExamDate}>{displayExamDateJap}</time>
              </span>
            </div>
            {exam.secondary_exam_date_a && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">二次試験 (A日程)</span>
                <span className="text-slate-700 font-medium">
                  <time dateTime={exam.secondary_exam_date_a}>{formatDateJap(exam.secondary_exam_date_a)}</time>
                </span>
              </div>
            )}
            {exam.secondary_exam_date_b && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-500 w-36 flex-shrink-0">二次試験 (B日程)</span>
                <span className="text-slate-700 font-medium">
                  <time dateTime={exam.secondary_exam_date_b}>{formatDateJap(exam.secondary_exam_date_b)}</time>
                </span>
              </div>
            )}
            {exam.result_date && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/60">
                <span className="text-sm font-bold text-blue-600 w-36 flex-shrink-0">Web合否発表</span>
                <span className="text-lg font-bold text-blue-700">
                  <time dateTime={exam.result_date}>{formatDateJap(exam.result_date)}</time>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* アクションボタンエリア */}
        <ActionButtons
          examName={displayExamName}
          sessionName={displaySessionName}
          slug={slug}
          sessionSlug={session}
          diffDays={diffDays}
          shareBannerContent={shareBottomContent}
        />



        {/* ▼▼▼ 英検用ライティング添削おすすめカード ▼▼▼ */}
        {displayExamName.includes('英検') && (
          <div className="w-full max-w-2xl mx-auto mb-12 mt-16">
            <Link
              href="/writing"
              prefetch={false}
              className="group relative block bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* おすすめバッジ */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-sm z-10">
                おすすめ
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* 画像エリア */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-emerald-50 rounded-full scale-90 opacity-50"></div>
                  <Image
                    src="/EduLensWriting.png"
                    alt="AI英作文添削"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>

                {/* テキストエリア */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                    英検ライティング対策は万全？
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-4">
                    <span className="font-bold text-emerald-600">最短10秒でAIが添削！</span><br />
                    スコア予測と詳細なフィードバックで、合格への最短ルートをサポートします。
                  </p>
                  <span className="inline-flex items-center gap-2 text-emerald-600 font-bold border-b border-emerald-200 group-hover:border-emerald-500 pb-0.5 transition-all">
                    今すぐ添削を試す
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* ▲▲▲ 英検カード終了 ▲▲▲ */}

        {/* ▼▼▼ EduLensサービス一覧 ▼▼▼ */}
        <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
          <ServiceList currentService="Countdown" />
        </div>
        {/* ▲▲▲ サービス一覧終了 ▲▲▲ */}

        {/* ▼▼▼ 2. Amazonリンク追加（キーワードを工夫して表示） ▼▼▼ */}
        <AmazonExamLink
          keyword={displayExamName}
          suffix={amazonSuffix}
        />
        {/* ▲▲▲ 追加エリア終了 ▲▲▲ */}

        {/* SEO用コンテンツエリア */}
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
          <Link href={`/countdown/${slug}`} prefetch={false} className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {displayExamName}の日程一覧に戻る
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />

        {/* 他の資格試験リンク */}
        <OtherQualifications currentSlug={slug} />

        <div className="text-center mt-16 pb-8 border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            GOOD LUCK TO <span className="text-blue-600">ALL EXAMINEES</span>
          </p>
        </div>
      </div>
    </div>
  );
}