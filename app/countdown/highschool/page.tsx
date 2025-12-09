import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
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

  return {
    title: `全国公立高校入試カウントダウン${targetYear} - 都道府県から探す | EduLens`,
    description: `【${targetYear}年度/令和${reiwaYear}年度対応】全国47都道府県の公立高校入試日程と試験までの残り日数を一覧で確認できます。`,
    keywords: [
      "高校入試 カウントダウン", 
      "公立高校入試 日程", 
      `高校受験 ${targetYear}`, 
      `令和${reiwaYear}年度 高校入試`, 
      "都道府県別"
    ],
    openGraph: {
      title: `全国公立高校入試カウントダウン${targetYear} | EduLens`,
      description: `あと何日？全国47都道府県の入試日程を網羅。志望校の試験日をチェックしよう。`,
      type: 'website',
    },
  };
}

export default async function PrefectureSelectPage() {
  const { data: prefectures } = await supabase
    .from('prefectures')
    .select('*')
    .order('id', { ascending: true });

  if (!prefectures) {
    return <div className="p-8 text-center">データを取得できませんでした。</div>;
  }

  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;

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
                  {prefs.map((pref) => (
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

        {/* ▼▼▼ 追加: カテゴリ選択に戻るリンク ▼▼▼ */}
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