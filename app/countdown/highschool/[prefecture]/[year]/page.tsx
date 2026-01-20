import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ExamSchedule from './ExamSchedule';
import CountdownWithActions from './CountdownWithActions';
import ActionButtons from './ActionButtons';
import AmazonExamLink from '@/components/AmazonExamLink';
import ServiceList from '@/components/ServiceList';
import type { Metadata, ResolvingMetadata } from 'next';
import { blogClient } from '@/lib/mistap/microcms';
import type { EduLensColumn } from '@/app/column/page';
import Image from 'next/image';
import NaruhodoLensPromoCard from '@/components/NaruhodoLensPromoCard';
import GoogleAdsense from '@/components/GoogleAdsense';
import BannerDisplay from '@/components/AffiliateBanners/BannerDisplay';

export const revalidate = 86400;

type Params = Promise<{ prefecture: string; year: string }>;

const REGION_NAMES: Record<string, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州",
  okinawa: "沖縄",
};

// ヘルパー関数: 日付に364日（52週）を加算
function add364Days(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    // UTCで計算して問題ない (日付部分のみ扱うため)
    d.setDate(d.getDate() + 364);
    return d.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { prefecture, year } = await params;
  const targetYearInt = parseInt(year);

  let prefName = prefecture.toUpperCase();
  let examDateText = "";
  let isProvisional = false;

  const { data: prefData } = await supabase
    .from('prefectures')
    .select('id, name, education_board_url')
    .eq('slug', prefecture)
    .single();

  if (prefData?.name) {
    prefName = prefData.name;

    // 今年度のデータを検索
    let { data: examData } = await supabase
      .from('official_exams')
      .select('date')
      .eq('prefecture_id', prefData.id)
      .eq('year', targetYearInt)
      .eq('category', 'public_general')
      .single();

    // データがない場合、前年度を検索して推測
    if (!examData?.date) {
      const { data: prevYearData } = await supabase
        .from('official_exams')
        .select('date')
        .eq('prefecture_id', prefData.id)
        .eq('year', targetYearInt - 1)
        .eq('category', 'public_general')
        .single();

      if (prevYearData?.date) {
        const provisionalDate = add364Days(prevYearData.date);
        if (provisionalDate) {
          examData = { date: provisionalDate };
          isProvisional = true;
        }
      }
    }

    if (examData?.date) {
      const d = new Date(examData.date);
      // メタデータ（検索結果）には (予想) を含めない
      examDateText = `${d.getMonth() + 1}月${d.getDate()}日`;
    }
  }

  const previousImages = (await parent).openGraph?.images || [];

  const title = `${prefName}公立高校入試日程${year} いつ？あと何日？｜試験日カウントダウン | EduLens`;
  const description = `${prefName}公立高校入試日程${year}年度版。試験日はいつ？${examDateText ? `一般選抜は${examDateText}に実施予定。` : ""}試験日まであと何日かをリアルタイムでカウントダウン。受験生必見の${prefName}入試日程情報。`;
  const url = `https://edulens.jp/countdown/highschool/${prefecture}/${year}`;

  return {
    title: title,
    description: description,
    keywords: [
      `${prefName}公立高校入試 いつ`,
      `${prefName}公立高校入試 あと何日`,
      `${prefName} 高校入試 ${year}`,
      `${prefName} 入試日程`,
      "高校入試 カウントダウン",
      `${prefName} 受験`
    ],
    alternates: { canonical: url },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      siteName: 'EduLens',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
    manifest: `/countdown/highschool/${prefecture}/${year}/manifest.json`,
  };
}

// EduLensコラム取得
async function getEduLensColumns() {
  try {
    const data = await blogClient.getList<EduLensColumn>({
      endpoint: "blogs",
      queries: {
        orders: "-publishedAt",
        limit: 3,
        fields: "id,title,publishedAt,eyecatch",
      },
      customRequestInit: {
        next: { tags: ['blog'] },
      },
    });
    return data.contents;
  } catch (error) {
    console.warn("Failed to fetch EduLens columns:", error);
    return [];
  }
}

export default async function CountdownPage({ params }: { params: Params }) {
  const { prefecture, year } = await params;
  const targetYearInt = parseInt(year);

  const { data: allPrefectures } = await supabase
    .from('prefectures')
    .select('*, education_board_url')
    .order('id', { ascending: true });

  const columnPosts = await getEduLensColumns();

  if (!allPrefectures) return notFound();

  const prefData = allPrefectures.find(p => p.slug === prefecture);
  if (!prefData) return notFound();

  let exams: any[] = [];
  let isProvisionalMode = false;

  // 1. 指定年度のデータを取得
  const { data: examData } = await supabase
    .from('official_exams')
    .select('*')
    .eq('prefecture_id', prefData.id)
    .eq('year', targetYearInt)
    .order('date', { ascending: true });

  if (examData && examData.length > 0) {
    exams = examData;
  } else {
    // 2. データがない場合、前年度を取得して推測
    const { data: prevExamData } = await supabase
      .from('official_exams')
      .select('*')
      .eq('prefecture_id', prefData.id)
      .eq('year', targetYearInt - 1)
      .order('date', { ascending: true });

    if (prevExamData && prevExamData.length > 0) {
      isProvisionalMode = true;
      exams = prevExamData.map(e => ({
        ...e,
        id: -e.id, // 一意なキーのため負の値にしておく（重要ではないが念のため）
        year: targetYearInt,
        name: `${e.name || ''} (仮)`,
        date: add364Days(e.date),
        result_date: add364Days(e.result_date),
      })).filter(e => e.date); // 日付計算できたものだけ
    }
  }

  const { data: banners } = await supabase
    .from('affiliate_banners')
    .select('position, content')
    .eq('slug', prefecture)
    .eq('is_active', true);

  const countdownBottomContent = banners?.find(b => b.position === 'countdown_bottom')?.content;
  const shareBottomContent = banners?.find(b => b.position === 'share_bottom')?.content;

  const mainExam = exams.find((e: any) => e.category === 'public_general') || exams[0] || null;
  const displayPrefName = prefData.name;

  // 仮データもなければデフォルトの日付
  const displayExamDate = mainExam?.date || `${year}-03-12`;
  const displayExamName = mainExam?.name || (isProvisionalMode ? "公立高校入試 (仮)" : "公立高校入試");

  const displayExamDateDots = displayExamDate.split('-').join('.');
  const displayExamDateJap = (() => {
    const p = displayExamDate.split('-');
    return p.length === 3 ? `${p[0]}年${parseInt(p[1])}月${parseInt(p[2])}日` : displayExamDate;
  })();

  // 以下、日付計算などは同じ
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = new Date(jstNow.toISOString().split('T')[0]);
  const examDate = new Date(displayExamDate);
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  const neighborPrefs = allPrefectures.filter(
    (p) => p.region === prefData.region && p.id !== prefData.id
  );

  const cleanResultDateStrings = exams
    .filter((e: any) => e.result_date)
    .map((e: any) => {
      const d = new Date(e.result_date);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const examYear = d.getFullYear();
      return `「${e.name}」の合格発表は${examYear}年${month}月${day}日${isProvisionalMode ? '(予想)' : ''}`;
    });

  let schemaResultAnswerText: string;
  let displayResultAnswerText: string;

  if (cleanResultDateStrings.length === 0) {
    const fallbackText = `詳細な日程は${displayPrefName}教育委員会の公式発表をご確認ください。`;
    schemaResultAnswerText = fallbackText;
    displayResultAnswerText = `A. ${fallbackText}通常、試験の1週間〜10日後に行われます。`;
  } else if (cleanResultDateStrings.length === 1) {
    schemaResultAnswerText = `${cleanResultDateStrings[0]}に予定されています。`;
    displayResultAnswerText = `A. ${schemaResultAnswerText}`;
  } else {
    const listItems = [...cleanResultDateStrings];
    const lastItem = listItems.pop();
    const listText = listItems.join('、');
    const multipleAnswerText = `複数の選抜区分があり、${listText}、そして${lastItem}に予定されています。`;
    schemaResultAnswerText = multipleAnswerText;
    displayResultAnswerText = `A. ${multipleAnswerText}`;
  }

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "EduLens", "item": "https://edulens.jp" },
          { "@type": "ListItem", "position": 2, "name": "入試選択", "item": "https://edulens.jp/countdown" },
          { "@type": "ListItem", "position": 3, "name": "高校入試一覧", "item": "https://edulens.jp/countdown/highschool" },
          { "@type": "ListItem", "position": 4, "name": `${displayPrefName}の入試`, "item": `https://edulens.jp/countdown/highschool/${prefecture}/${year}` }
        ]
      },
      ...exams.map((e: any) => ({
        "@type": "Event",
        "name": e?.name || `${displayPrefName} 入試`,
        "startDate": e?.date || null,
        "endDate": e?.date || null,
        "organizer": {
          "@type": "Organization",
          "name": `${displayPrefName}教育委員会`,
          "url": prefData.education_board_url || `https://edulens.jp/countdown/highschool/${prefecture}/${year}`
        },
        "location": { "@type": "Place", "name": displayPrefName },
        "description": e?.name || "",
        "eventStatus": isProvisionalMode ? "https://schema.org/EventTentative" : "https://schema.org/EventScheduled"
      })),
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "入試日はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${displayExamName}は、${displayExamDateJap}に実施されます。${isProvisionalMode ? '（※前年度実績に基づく予想日程です）' : ''}`
            }
          },
          {
            "@type": "Question",
            "name": "合格発表はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": schemaResultAnswerText
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">

        <h1 className="sr-only">
          {displayPrefName}公立高校入試{year} カウントダウン｜日程と合格発表
        </h1>

        <div className="mb-12">
          <div className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {displayPrefName}
          </div>

          <p className="text-2xl text-slate-500 font-medium">{year}年度 {displayExamName}</p>
          {isProvisionalMode && (
            <p className="text-sm text-amber-600 mt-2 font-bold bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-200">
              ※ 公式発表前のため、前年度実績に基づいた予想日程です
            </p>
          )}
        </div>

        <CountdownWithActions
          displayPrefName={displayPrefName}
          year={year}
          displayExamName={displayExamName}
          displayExamDateDots={displayExamDateDots}
          displayExamDate={displayExamDate}
          isExpired={isExpired}
        />

        {exams.length > 0 && (
          <div>
            {/* @ts-ignore-next-line Server Component importing Client Component (allowed) */}
            <ExamSchedule exams={exams} />
          </div>
        )}

        {countdownBottomContent && <BannerDisplay content={countdownBottomContent} />}

        <div className="w-full max-w-2xl mx-auto mb-4 mt-8">
          <NaruhodoLensPromoCard />
        </div>

        <ActionButtons
          displayPrefName={displayPrefName}
          year={year}
          prefecture={prefecture}
          diffDays={diffDays}
          displayExamDate={displayExamDate}
          displayExamName={displayExamName}
          shareBannerContent={shareBottomContent}
        />

        {columnPosts.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-16 mb-8">
            <GoogleAdsense />
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              EduLens 最新コラム
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columnPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/column/${post.id}`}
                  prefetch={false}
                  className="group block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[1200/630] relative bg-slate-100 overflow-hidden">
                    {post.eyecatch ? (
                      <Image
                        src={post.eyecatch.url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500 mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                    </p>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-right mt-4">
              <Link href="/column" prefetch={false} className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-1">
                もっと見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
          <ServiceList currentService="Countdown" />
        </div>

        <AmazonExamLink
          keyword={`${displayPrefName}高校入試`}
          suffix={`過去問 ${year}`}
          daysLeft={diffDays}
        />

        {neighborPrefs.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mb-16 text-left mt-16">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider pl-1">
              {REGION_NAMES[prefData.region] || '近隣'}エリアの他の入試もチェック
            </h3>
            <div className="flex flex-wrap gap-2">
              {neighborPrefs.map((pref: any) => (
                <Link
                  key={pref.id}
                  href={`/countdown/highschool/${pref.slug}/${year}`}
                  prefetch={false}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                >
                  {pref.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-slate-100 text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {displayPrefName}公立高校入試はいつ？{year}年度の試験日程
          </h2>
          <div className="prose text-slate-500 text-sm leading-relaxed space-y-4">
            <p className="text-base font-semibold text-slate-700">
              {displayPrefName}公立高校入試{year}年度の試験日は<strong className="text-blue-600">{displayExamDateJap}</strong>です。
              試験日まであと<strong className="text-blue-600">{diffDays}日</strong>です。
              {isProvisionalMode && <span className="block text-amber-600 text-xs mt-1">※本ページの日程は前年度の実績に基づく予想日です。</span>}
            </p>
            <p>
              {year}年度（令和{parseInt(year) - 2018}年度）の{displayPrefName}公立高等学校入学者選抜は、
              主に「{exams.map(e => e.name.replace(' (仮)', '')).join('」「')}」の日程で実施されます。
              {displayPrefName}の受験生は試験日までの残り日数を意識して、計画的に学習を進めることが重要です。
            </p>
            <p>
              本サイト「EduLens」では、{displayPrefName}公立高校入試日程を正確に把握し、試験当日まで「あと何日」かをリアルタイムでカウントダウン表示しています。
              受験生の皆さんが効率的に学習を進められるよう、一般選抜だけでなく、推薦選抜や特色選抜の日程も網羅しています。
            </p>
            <p>
              {displayPrefName}の高校入試は毎年多くの中学生が受験する重要な試験です。
              試験当日は時間に余裕を持って会場に到着し、体調管理を万全にして、志望校合格を目指して頑張ってください。
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{displayPrefName}公立高校入試 よくある質問</h3>
            <dl className="space-y-6">
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {displayPrefName}公立高校入試はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {year}年度の{displayPrefName}公立高校入試（{displayExamName}）は、<strong>{displayExamDateJap}</strong>に実施されます。
                  試験日まであと<strong>{diffDays}日</strong>です。
                  {isProvisionalMode && ' (※日程は予想です)'}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {displayPrefName}公立高校入試まであと何日ですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {displayExamDateJap}の試験日まで、本日時点で<strong className="text-blue-600">あと{diffDays}日</strong>です。
                  このページでは残り日数をリアルタイムでカウントダウン表示しています。
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. 合格発表はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  {displayResultAnswerText}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/countdown/highschool" prefetch={false} className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            都道府県一覧に戻る
          </Link>
        </div>

        {prefData.education_board_url && (
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500 mb-3">
              情報元: {displayPrefName}公立高校入試の正確な情報は、必ず公式ウェブサイトでご確認ください。
            </p>
            <a
              href={prefData.education_board_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-bold hover:bg-blue-100 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.828a2 2 0 00-2.828 0l-3.828 3.828a2 2 0 002.828 2.828l3.828-3.828a2 2 0 000-2.828zM15 14h-2M9 10h2M12 12V6M16 6H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2z" /></svg>
              {displayPrefName}教育委員会の公式ページへ
            </a>
          </div>
        )}

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