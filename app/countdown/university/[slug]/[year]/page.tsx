import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import AddToHomeButton from './AddToHomeButton';
import type { Metadata } from 'next';

type Params = Promise<{ slug: string; year: string }>;

// ▼ メタデータ生成 ▼
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, year } = await params;
  
  // 試験データを取得
  const { data: event } = await supabase
    .from('university_events')
    .select('*')
    .eq('slug', slug)
    .eq('year', parseInt(year))
    .single();

  if (!event) return {};

  const d = new Date(event.date);
  const dateText = `${d.getMonth() + 1}月${d.getDate()}日`;
  
  const title = `${event.name}${year} いつ？あと何日？| 試験日カウントダウン | EduLens`;
  const description = `${event.name}${year}年度はいつ？${dateText}実施。試験日まであと何日かをリアルタイムでカウントダウン。受験生必見の${event.name}日程情報。`;
  const url = `https://edulens.jp/countdown/university/${slug}/${year}`;

  return {
    title: title,
    description: description,
    keywords: [
      `${event.name} いつ`,
      `${event.name} あと何日`,
      `${event.name} ${year}`,
      `${event.name} 日程`,
      "大学入試 カウントダウン",
      "共通テスト"
    ],
    alternates: { canonical: url },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      siteName: 'EduLens',
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      siteName: 'EduLens',
      images: [
        `${url}/Xcard.png`,
        'https://edulens.jp/logo.png'
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [
        `${url}/Xcard.png`,
        'https://edulens.jp/logo.png'
      ]
    },
  };
}

export default async function UniversityExamPage({ params }: { params: Params }) {
  const { slug, year } = await params;

  // 1. 試験データを取得
  const { data: event } = await supabase
    .from('university_events')
    .select('*')
    .eq('slug', slug)
    .eq('year', parseInt(year))
    .single();

  if (!event) {
    return notFound();
  }

  // 2. 日数計算
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = new Date(jstNow.toISOString().split('T')[0]);
  const examDate = new Date(event.date);
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  // ★ 共通テストかどうかの判定を追加
  const isCommonTest = event.name.includes('共通テスト');

  // 構造化データ（Event + FAQPage）
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": event.name,
        "startDate": event.date,
        "location": {
          "@type": "Place",
          "name": "全国各試験会場"
        },
        "description": event.description || `${event.name}の試験日程`,
        "eventStatus": "https://schema.org/EventScheduled"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "試験日はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${event.name}は、${event.date}に実施されます。`
            }
          },
          {
            "@type": "Question",
            "name": "合格発表はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "合格発表の日程は各大学の公式発表をご確認ください。通常、試験の数週間後に行われます。"
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">
        
        {/* ヘッダー */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-4">
            {year}年度 大学入試
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {event.name}
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            {event.date.split('-').join('/')} 実施
          </p>
        </div>

        {/* カウントダウン */}
        <div className="mb-16">
          <div className="inline-block border-b-2 border-indigo-500 pb-1 mb-12">
            <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Examination Date</span>
            <span className="ml-4 text-xl font-bold text-slate-800">{event.date.split('-').join('.')}</span>
          </div>
          
          <div className="mb-8">
            <CountdownTimer targetDate={event.date} />
          </div>

          {isExpired && (
            <div className="text-indigo-600 font-bold mt-8 text-lg">
              試験当日、または終了しました
            </div>
          )}
        </div>

        {/* 説明・詳細（共通テストの場合のみ表示） */}
        {isCommonTest && (
          <div className="max-w-2xl mx-auto mb-16 text-center">
             {event.description && (
               <p className="text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-100 inline-block">
                 {event.description}
               </p>
             )}
          </div>
        )}

        {/* ホーム画面に追加 */}
        <AddToHomeButton />

        {/* ▼▼▼ SEO用の解説セクション ▼▼▼ */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {event.name}はいつ？{year}年度の試験日程
          </h2>
          <div className="prose text-slate-500 text-sm leading-relaxed space-y-4">
            <p className="text-base font-semibold text-slate-700">
              {event.name}{year}年度の試験日は<strong className="text-indigo-600">{event.date.split('-').join('年').replace('年', '年').split('-').join('月')}日</strong>です。
              試験日まであと<strong className="text-indigo-600">{diffDays}日</strong>です。
            </p>
            <p>
              {year}年度の{event.name}は、{event.date.split('-').join('年').replace('年', '年').split('-').join('月')}日に実施されます。
              本サイト「EduLens」では、試験当日までの残り日数をカウントダウン形式で提供し、受験生の皆さんが計画的に学習を進められるようサポートしています。
              {event.name}まで「あと何日」かを常に意識することで、効率的な受験勉強が可能になります。
            </p>
            {isCommonTest && (
              <p>
                大学入学共通テストは、国公立大学および多くの私立大学の入学者選抜で利用される重要な試験です。
                試験科目は文系・理系によって異なりますが、受験する科目と配点を事前に確認し、効率的な学習計画を立てることが合格への鍵となります。
              </p>
            )}
            <p>
              試験当日は時間に余裕を持って会場に到着し、受験票や筆記用具など必要なものを忘れずに持参してください。
              体調管理を万全にし、志望校合格を目指して頑張ってください。
            </p>
          </div>

          {/* よくある質問 */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{event.name} よくある質問</h3>
            <dl className="space-y-6">
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {event.name}はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {year}年度の{event.name}は、<strong>{event.date}</strong>に実施されます。
                  試験日まであと<strong>{diffDays}日</strong>です。
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {event.name}まであと何日ですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {event.date.split('-').join('年').replace('年', '年').split('-').join('月')}日の試験日まで、本日時点で<strong className="text-indigo-600">あと{diffDays}日</strong>です。
                  このページでは残り日数をリアルタイムでカウントダウン表示しています。
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. 合格発表はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. 合格発表の日程は各大学の公式発表をご確認ください。通常、試験の数週間後に行われます。
                </dd>
              </div>
              {isCommonTest && (
                <div>
                  <dt className="font-bold text-slate-600 text-sm mb-1">共通テストの科目は？</dt>
                  <dd className="text-slate-500 text-sm">
                    国語、地理歴史・公民、数学、理科、外国語から、志望大学・学部が指定する科目を受験します。詳細は各大学の募集要項をご確認ください。
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        {/* ▲▲▲ SEO用の解説セクションここまで ▲▲▲ */}

        {/* シェア・フッターエリア */}
        <div className="max-w-3xl mx-auto mt-8 pt-6 border-t text-left text-slate-500">
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-3 text-center">このカウントダウンをシェアする</p>
            <div className="flex justify-center gap-4">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.name}まで、あと${diffDays}日！ #大学入試 #共通テスト #カウントダウン`)}&url=${encodeURIComponent(`https://edulens.jp/countdown/university/${slug}/${year}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                X (Twitter) でシェア
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <Link href="/countdown/university" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline inline-flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             大学入試一覧に戻る
           </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        
        <div className="text-center mt-12 pb-8">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            GOOD LUCK TO <span className="text-indigo-600">ALL STUDENTS</span>
          </p>
        </div>
      </div>
    </div>
  );
}