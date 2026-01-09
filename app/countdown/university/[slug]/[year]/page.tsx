import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CountdownWithActions from './CountdownWithActions';
import ActionButtons from './ActionButtons';
import AmazonExamLink from '@/components/AmazonExamLink';
import ServiceList from '@/components/ServiceList';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 360;

type Params = Promise<{ slug: string; year: string }>;

// ... (generateMetadata は変更なしのため省略。元のまま残してください) ...
export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, year } = await params;

  const { data: event } = await supabase
    .from('university_events')
    .select('*')
    .eq('slug', slug)
    .eq('year', parseInt(year))
    .single();

  if (!event) return {};

  const d = new Date(event.date);
  const dateText = `${d.getMonth() + 1}月${d.getDate()}日`;
  const previousImages = (await parent).openGraph?.images || [];
  const title = `${event.name}日程${year}｜あと何日？いつ？カウントダウン | EduLens`;
  const description = `${event.name}日程${year}年度版。試験日はいつ？${dateText}実施。試験日まであと何日かをリアルタイムでカウントダウン。出願期間や合格発表日など${event.name}の最新情報を網羅。`;
  const url = `https://edulens.jp/countdown/university/${slug}/${year}`;

  return {
    title: title,
    description: description,
    keywords: [`${event.name} いつ`, `${event.name} あと何日`, `${event.name} ${year}`, `${event.name} 日程`, "大学入試 カウントダウン", "共通テスト"],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: 'EduLens' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function UniversityExamPage({ params }: { params: Params }) {
  const { slug, year } = await params;

  const { data: event } = await supabase
    .from('university_events')
    .select('*')
    .eq('slug', slug)
    .eq('year', parseInt(year))
    .single();

  if (!event) return notFound();

  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = new Date(jstNow.toISOString().split('T')[0]);
  const examDate = new Date(event.date);
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;
  const isCommonTest = event.name.includes('共通テスト');
  const isSecondaryExam = event.name.includes('2次試験');

  // Amazon検索用キーワード
  const cleanName = event.name.replace(/\s*[\(（].*?[\)）]/g, '').trim();

  // 構造化データ
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": event.name,
        "startDate": event.date,
        "location": { "@type": "Place", "name": "全国各試験会場" },
        "description": event.description || `${event.name}の試験日程`,
        "eventStatus": "https://schema.org/EventScheduled"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "試験日はいつですか？",
            "acceptedAnswer": { "@type": "Answer", "text": `${event.name}は、${event.date.split('-')[0]}年${parseInt(event.date.split('-')[1])}月${parseInt(event.date.split('-')[2])}日に実施されます。` }
          },
          {
            "@type": "Question",
            "name": "合格発表はいつですか？",
            "acceptedAnswer": { "@type": "Answer", "text": "合格発表の日程は各大学の公式発表をご確認ください。" }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">

        {/* ヘッダーエリア */}
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

        {/* カウントダウンエリア */}
        <CountdownWithActions
          eventName={event.name}
          year={year}
          eventDateDots={event.date.split('-').join('.')}
          eventDate={event.date}
          isExpired={isExpired}
        />

        {/* 共通テスト説明 */}
        {isCommonTest && event.description && (
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <p className="text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-100 inline-block">
              {event.description}
            </p>
          </div>
        )}

        {/* アクションボタンエリア */}
        <ActionButtons
          eventName={event.name}
          slug={slug}
          year={year}
          diffDays={diffDays}
        />





        {/* ▼▼▼ 大学入試英作文添削おすすめカード ▼▼▼ */}
        {isSecondaryExam && (
          <div className="w-full max-w-2xl mx-auto mb-12 mt-16">
            <Link
              href="/writing/university"
              className="group relative block bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* おすすめバッジ */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-sm z-10">
                おすすめ
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* 画像エリア */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-indigo-50 rounded-full scale-90 opacity-50"></div>
                  <Image
                    src="/EduLensWriting.png"
                    alt="AI大学入試英作文添削"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>

                {/* テキストエリア */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                    志望校の英作文対策は万全？
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-4">
                    <span className="font-bold text-indigo-600">最短10秒でAIが添削！</span><br />
                    難関大合格レベルの採点基準で、あなたの解答を厳格に評価します。
                  </p>
                  <span className="inline-flex items-center gap-2 text-indigo-600 font-bold border-b border-indigo-200 group-hover:border-indigo-500 pb-0.5 transition-all">
                    今すぐ添削を試す
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* ▲▲▲ おすすめカード終了 ▲▲▲ */}

        {/* ▼▼▼ EduLensサービス一覧 ▼▼▼ */}
        <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
          <ServiceList currentService="Countdown" />
        </div>
        {/* ▲▲▲ サービス一覧終了 ▲▲▲ */}

        {/* Amazonリンク */}
        <AmazonExamLink
          keyword={cleanName}
          suffix={`過去問 ${year}`}
        />

        {/* SEO解説セクション */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {event.name}はいつ？{year}年度の試験日程
          </h2>
          <div className="prose text-slate-500 text-sm leading-relaxed space-y-4">
            <p className="text-base font-semibold text-slate-700">
              {event.name}{year}年度の試験日は<strong className="text-indigo-600">{event.date.split('-')[0]}年{parseInt(event.date.split('-')[1])}月{parseInt(event.date.split('-')[2])}日</strong>です。
              試験日まであと<strong className="text-indigo-600">{diffDays}日</strong>です。
            </p>
            <p>
              {year}年度の{event.name}は、{event.date.split('-')[0]}年{parseInt(event.date.split('-')[1])}月{parseInt(event.date.split('-')[2])}日に実施されます。
              本サイト「EduLens」では、試験当日までの残り日数をカウントダウン形式で提供し、受験生の皆さんが計画的に学習を進められるようサポートしています。
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

          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{event.name} よくある質問</h3>
            <dl className="space-y-6">
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {event.name}はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {year}年度の{event.name}は、<strong>{event.date.split('-')[0]}年{parseInt(event.date.split('-')[1])}月{parseInt(event.date.split('-')[2])}日</strong>に実施されます。
                  試験日まであと<strong>{diffDays}日</strong>です。
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {event.name}まであと何日ですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. 試験日まで、本日時点で<strong className="text-indigo-600">あと{diffDays}日</strong>です。
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. 合格発表はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. 合格発表の日程は各大学の公式発表をご確認ください。
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 戻るリンク */}
        <div className="mt-12 text-center pb-8">
          <Link href="/countdown/university" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            大学入試一覧に戻る
          </Link>
          <div className="mt-8">
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              GOOD LUCK TO <span className="text-indigo-600">ALL STUDENTS</span>
            </p>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </div>
    </div>
  );
}