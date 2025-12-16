import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import AddToHomeButton from './AddToHomeButton';
import type { Metadata, ResolvingMetadata } from 'next';

// ISR設定: 1分ごとにキャッシュを更新（Supabaseへの接続数を削減）
export const revalidate = 60;

type Params = Promise<{ slug: string; session: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, session } = await params;

  const { data: examSchedule } = await supabase
    .from('exam_schedules')
    .select('*')
    .eq('slug', slug)
    .eq('session_slug', session)
    .single();

  if (!examSchedule) return {};

  const primaryDate = new Date(examSchedule.primary_exam_date);
  const primaryDateText = `${primaryDate.getMonth() + 1}月${primaryDate.getDate()}日`;

  // 日程の詳細を生成
  let scheduleDetails = `一次試験は${primaryDateText}`;
  if (examSchedule.secondary_exam_date_a || examSchedule.secondary_exam_date_b) {
    scheduleDetails += '、二次試験は';
    const secondaryDates = [];
    if (examSchedule.secondary_exam_date_a) {
      const secA = new Date(examSchedule.secondary_exam_date_a);
      secondaryDates.push(`A日程${secA.getMonth() + 1}月${secA.getDate()}日`);
    }
    if (examSchedule.secondary_exam_date_b) {
      const secB = new Date(examSchedule.secondary_exam_date_b);
      secondaryDates.push(`B日程${secB.getMonth() + 1}月${secB.getDate()}日`);
    }
    scheduleDetails += secondaryDates.join('、');
  }
  scheduleDetails += '。';

  const previousImages = (await parent).openGraph?.images || [];

  const title = `${examSchedule.exam_name}カウントダウン ${examSchedule.session_name} | 試験日・日程・合格発表 | EduLens`;
  const description = `${examSchedule.exam_name} ${examSchedule.session_name}の試験日程。${scheduleDetails}試験日まであと何日かをリアルタイムでカウントダウン。`;
  const url = `https://edulens.jp/countdown/qualification/${slug}/${session}`;

  return {
    title: title,
    description: description,
    keywords: [
      `${examSchedule.exam_name} いつ`,
      `${examSchedule.exam_name} あと何日`,
      `${examSchedule.exam_name} ${examSchedule.session_name}`,
      `${examSchedule.exam_name} 日程`,
      "資格試験 カウントダウン",
      examSchedule.exam_name
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

  const { data: examSchedule } = await supabase
    .from('exam_schedules')
    .select('*')
    .eq('slug', slug)
    .eq('session_slug', session)
    .single();

  if (!examSchedule) {
    return notFound();
  }

  // 日数計算（一次試験日を基準に）
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = new Date(jstNow.toISOString().split('T')[0]);
  const primaryExamDate = new Date(examSchedule.primary_exam_date);
  const diffTime = primaryExamDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  // 日付フォーマット用関数
  const formatDateJP = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatDateDots = (dateStr: string) => {
    return dateStr.split('-').join('.');
  };

  // 構造化データ
  const events = [];
  
  // 一次試験
  events.push({
    "@type": "Event",
    "name": `${examSchedule.exam_name} ${examSchedule.session_name} 一次試験`,
    "startDate": examSchedule.primary_exam_date,
    "endDate": examSchedule.primary_exam_date,
    "location": { "@type": "Place", "name": "各試験会場" },
    "description": `${examSchedule.exam_name} ${examSchedule.session_name}の一次試験`,
    "eventStatus": "https://schema.org/EventScheduled"
  });

  // 二次試験A
  if (examSchedule.secondary_exam_date_a) {
    events.push({
      "@type": "Event",
      "name": `${examSchedule.exam_name} ${examSchedule.session_name} 二次試験A日程`,
      "startDate": examSchedule.secondary_exam_date_a,
      "endDate": examSchedule.secondary_exam_date_a,
      "location": { "@type": "Place", "name": "各試験会場" },
      "description": `${examSchedule.exam_name} ${examSchedule.session_name}の二次試験A日程`,
      "eventStatus": "https://schema.org/EventScheduled"
    });
  }

  // 二次試験B
  if (examSchedule.secondary_exam_date_b) {
    events.push({
      "@type": "Event",
      "name": `${examSchedule.exam_name} ${examSchedule.session_name} 二次試験B日程`,
      "startDate": examSchedule.secondary_exam_date_b,
      "endDate": examSchedule.secondary_exam_date_b,
      "location": { "@type": "Place", "name": "各試験会場" },
      "description": `${examSchedule.exam_name} ${examSchedule.session_name}の二次試験B日程`,
      "eventStatus": "https://schema.org/EventScheduled"
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
          { "@type": "ListItem", "position": 3, "name": "資格試験", "item": "https://edulens.jp/countdown/qualification" },
          { "@type": "ListItem", "position": 4, "name": `${examSchedule.exam_name} ${examSchedule.session_name}`, "item": `https://edulens.jp/countdown/qualification/${slug}/${session}` }
        ]
      },
      ...events,
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "試験日はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${examSchedule.exam_name} ${examSchedule.session_name}の一次試験は、${formatDateJP(examSchedule.primary_exam_date)}に実施されます。`
            }
          },
          {
            "@type": "Question",
            "name": "合格発表はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": examSchedule.result_date 
                ? `Web合否発表は${formatDateJP(examSchedule.result_date)}に予定されています。`
                : "合格発表の日程は公式発表をご確認ください。"
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">

        {/* SEO用 隠しH1 */}
        <h1 className="sr-only">
          {examSchedule.exam_name} {examSchedule.session_name} カウントダウン｜試験日程と合格発表
        </h1>

        {/* ヘッダー */}
        <div className="mb-12">
          <div className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {examSchedule.exam_name}
          </div>
          <p className="text-2xl text-slate-500 font-medium">{examSchedule.session_name}</p>
        </div>

        {/* カウントダウン */}
        <div className="mb-16">
          <div className="inline-block border-b-2 border-blue-500 pb-1 mb-12">
            <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Primary Exam Date</span>
            <span className="ml-4 text-xl font-bold text-slate-800">{formatDateDots(examSchedule.primary_exam_date)}</span>
          </div>
          
          <div className="mb-8">
            <CountdownTimer targetDate={examSchedule.primary_exam_date} />
          </div>

          {isExpired && (
            <div className="text-blue-600 font-bold mt-8 text-lg">
              試験当日、または終了しました
            </div>
          )}
        </div>

        {/* 日程詳細リスト */}
        <div className="w-full max-w-2xl mx-auto mb-16 text-left">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-4">
            試験日程詳細
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              
              {/* 申込期間 */}
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-sm sm:text-base mb-1.5 text-slate-800">
                      申込期間
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      {formatDateJP(examSchedule.application_start)} 〜 {formatDateJP(examSchedule.application_end)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 一次試験日 */}
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-sm sm:text-base mb-1.5 text-slate-800">
                      一次試験
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      {formatDateJP(examSchedule.primary_exam_date)}
                    </div>
                  </div>
                  {!isExpired && (
                    <div className="text-right">
                      <span className="text-blue-600 font-bold text-lg">
                        あと {diffDays} 日
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 二次試験日 A日程 */}
              {examSchedule.secondary_exam_date_a && (
                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-sm sm:text-base mb-1.5 text-slate-800">
                        二次試験 A日程
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600">
                        {formatDateJP(examSchedule.secondary_exam_date_a)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 二次試験日 B日程 */}
              {examSchedule.secondary_exam_date_b && (
                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-sm sm:text-base mb-1.5 text-slate-800">
                        二次試験 B日程
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600">
                        {formatDateJP(examSchedule.secondary_exam_date_b)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 合否発表日 - 青色背景で目立たせる */}
              {examSchedule.result_date && (
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-sm sm:text-base mb-1.5 text-blue-700">
                        Web合否発表
                      </div>
                      <div className="text-xs sm:text-sm text-blue-600 font-medium">
                        {formatDateJP(examSchedule.result_date)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ホーム画面に追加 */}
        <div className="mb-16">
          <AddToHomeButton />
        </div>

        {/* 解説セクション（SEOコンテンツ） */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {examSchedule.exam_name}はいつ？{examSchedule.session_name}の試験日程
          </h2>
          <div className="prose text-slate-500 text-sm leading-relaxed space-y-4">
            <p className="text-base font-semibold text-slate-700">
              {examSchedule.exam_name} {examSchedule.session_name}の一次試験日は<strong className="text-blue-600">{formatDateJP(examSchedule.primary_exam_date)}</strong>です。
              {!isExpired ? (
                <>試験日まであと<strong className="text-blue-600">{diffDays}日</strong>です。</>
              ) : (
                <>試験は終了しました。</>
              )}
            </p>
            <p>
              {examSchedule.session_name}の{examSchedule.exam_name}は、申込期間が{formatDateJP(examSchedule.application_start)}から{formatDateJP(examSchedule.application_end)}まで、
              一次試験が{formatDateJP(examSchedule.primary_exam_date)}に実施されます。
              本サイト「EduLens」では、試験当日までの残り日数をリアルタイムでカウントダウン表示し、受験者の皆さんが計画的に学習を進められるようサポートしています。
            </p>
            {(examSchedule.secondary_exam_date_a || examSchedule.secondary_exam_date_b) && (
              <p>
                二次試験は
                {examSchedule.secondary_exam_date_a && `A日程が${formatDateJP(examSchedule.secondary_exam_date_a)}`}
                {examSchedule.secondary_exam_date_a && examSchedule.secondary_exam_date_b && '、'}
                {examSchedule.secondary_exam_date_b && `B日程が${formatDateJP(examSchedule.secondary_exam_date_b)}`}
                に実施されます。
              </p>
            )}
            {examSchedule.result_date && (
              <p>
                Web合否発表は{formatDateJP(examSchedule.result_date)}に予定されています。
                公式サイトで結果を確認できますので、発表日には忘れずにチェックしてください。
              </p>
            )}
            <p>
              試験当日は時間に余裕を持って会場に到着し、受験票や筆記用具など必要なものを忘れずに持参してください。
              体調管理を万全にし、合格を目指して頑張ってください。
            </p>
          </div>

          {/* よくある質問 */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{examSchedule.exam_name} よくある質問</h3>
            <dl className="space-y-6">
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {examSchedule.exam_name} {examSchedule.session_name}の試験日はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {examSchedule.session_name}の一次試験は、<strong>{formatDateJP(examSchedule.primary_exam_date)}</strong>に実施されます。
                  {!isExpired ? (
                    <>試験日まであと<strong>{diffDays}日</strong>です。</>
                  ) : (
                    <>試験は終了しました。</>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. 試験日まであと何日ですか？</dt>
                <dd className="text-slate-600 text-sm">
                  {!isExpired ? (
                    <>
                      A. {formatDateJP(examSchedule.primary_exam_date)}の試験日まで、本日時点で<strong className="text-blue-600">あと{diffDays}日</strong>です。
                      このページでは残り日数をリアルタイムでカウントダウン表示しています。
                    </>
                  ) : (
                    <>
                      A. {formatDateJP(examSchedule.primary_exam_date)}の試験は終了しました。
                    </>
                  )}
                </dd>
              </div>
              {examSchedule.result_date && (
                <div>
                  <dt className="font-bold text-slate-700 text-base mb-2">Q. 合格発表はいつですか？</dt>
                  <dd className="text-slate-600 text-sm">
                    A. Web合否発表は<strong>{formatDateJP(examSchedule.result_date)}</strong>に予定されています。
                    公式サイトで結果を確認してください。
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. 申込期間はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. 申込期間は<strong>{formatDateJP(examSchedule.application_start)}</strong>から<strong>{formatDateJP(examSchedule.application_end)}</strong>までです。
                  締切日を過ぎると申込ができませんので、余裕を持って手続きを完了させてください。
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/countdown" className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            入試選択に戻る
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />

        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            GOOD LUCK TO <span className="text-blue-600">ALL STUDENTS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
