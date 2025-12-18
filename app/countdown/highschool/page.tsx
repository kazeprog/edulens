import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

// 年度自動計算
function getTargetExamYear() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return currentMonth >= 4 ? currentYear + 1 : currentYear;
}

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

export async function generateMetadata(): Promise<Metadata> {
  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;

  const pageTitle = `全国公立高校入試カウントダウン${targetYear} - 都道府県から探す | EduLens`;
  const pageDescription = `【${targetYear}年度/令和${reiwaYear}年度対応】全国47都道府県の公立高校入試日程と試験までの残り日数を一覧で確認できます。`;
  const url = `https://edulens.jp/countdown/highschool`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "高校入試 カウントダウン",
      "公立高校入試 日程",
      `高校受験 ${targetYear}`,
      `令和${reiwaYear}年度 高校入試`,
      "都道府県別",
    ],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: 'website',
      url: url,
      siteName: 'EduLens',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      site: '@EduLensjp',
      creator: '@EduLensjp',
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PrefectureSelectPage() {
  // 1. 全都道府県データを取得
  const { data: prefectures } = await supabase
    .from('prefectures')
    .select('*')
    .order('id', { ascending: true });

  if (!prefectures) {
    return <div className="p-8 text-center">データを取得できませんでした。</div>;
  }

  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;

  // ▼▼▼ 追加: 地域自動推定ロジック ▼▼▼
  // headers() は非同期関数なので await が必要です（Next.jsのバージョンによるが安全のため）
  const headersList = await headers();

  // Vercelが付与する地域コード (例: 東京="13", 大阪="27")
  const regionCode = headersList.get('x-vercel-ip-country-region');

  // DBのIDとJISコードが一致していることを確認済みなので、そのまま検索します
  const detectedPref = regionCode
    ? prefectures.find(p => p.id === parseInt(regionCode))
    : null;
  // ▲▲▲ 追加ここまで ▲▲▲

  const groupedPrefs = prefectures.reduce((acc, pref) => {
    if (!acc[pref.region]) {
      acc[pref.region] = [];
    }
    acc[pref.region].push(pref);
    return acc;
  }, {} as Record<string, typeof prefectures>);

  const jsonLd = {
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
        "name": "入試選択",
        "item": "https://edulens.jp/countdown"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "高校入試一覧",
        "item": "https://edulens.jp/countdown/highschool"
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            全国公立高校入試カウントダウン
            <span className="block text-blue-600 mt-2 text-3xl sm:text-4xl">
              {targetYear} (令和{reiwaYear}年度)
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            {targetYear}年春に受験を迎える皆さんへ。<br className="hidden sm:inline" />
            志望校の都道府県を選んで、試験日程と残り日数を確認しましょう。
          </p>
        </div>

        {/* ▼▼▼ 追加: 推定地域の提案バナー ▼▼▼ */}
        {/* 地域が特定できた場合のみ表示されます（Vercel環境でのみ動作） */}
        {detectedPref && (
          <div className="mb-12 max-w-xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white rounded-2xl shadow-md border-2 border-blue-100 p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

              <div className="flex items-center justify-center gap-2 mb-3 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                あなたにおすすめのカウントダウン
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-6">
                <span className="text-blue-600 text-2xl mr-1">{detectedPref.name}</span>
                の入試日程を見ますか？
              </h2>

              <Link
                href={`/countdown/highschool/${detectedPref.slug}/${targetYear}`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 hover:shadow-lg transition-all"
              >
                {detectedPref.name}のカウントダウンへ
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        )}
        {/* ▲▲▲ 追加ここまで ▲▲▲ */}

        <div className="space-y-8">
          {Object.keys(REGION_NAMES).map((regionKey) => {
            const prefs = groupedPrefs[regionKey];
            if (!prefs || prefs.length === 0) return null;

            return (
              <div key={regionKey} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                  {REGION_NAMES[regionKey]}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {prefs.map((pref: any) => (
                    <Link
                      key={pref.id}
                      href={`/countdown/highschool/${pref.slug}/${targetYear}`}
                      className="block text-center py-3 px-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:font-bold transition-all border border-slate-100 text-slate-600 text-sm sm:text-base"
                    >
                      {pref.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/countdown" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
            ← カテゴリ選択に戻る
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

      </div>
    </div>
  );
}