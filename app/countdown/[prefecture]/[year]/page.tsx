import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // ★追加
import CountdownTimer from './CountdownTimer';
import ExamSchedule from './ExamSchedule';
import AddToHomeButton from './AddToHomeButton';
import type { Metadata } from 'next';

type Params = Promise<{ prefecture: string; year: string }>;

// ★追加: 地域名の定義（近隣県リンクの見出し用）
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

// ▼▼▼ SEO強化: メタデータ生成関数 ▼▼▼
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { prefecture, year } = await params;
  
  let prefName = prefecture.toUpperCase();
  let examDateText = "";

  const { data: prefData } = await supabase
    .from('prefectures')
    .select('id, name')
    .eq('slug', prefecture)
    .single();

  if (prefData?.name) {
    prefName = prefData.name;
    const { data: examData } = await supabase
      .from('official_exams')
      .select('date')
      .eq('prefecture_id', prefData.id)
      .eq('year', parseInt(year))
      .eq('category', 'public_general')
      .single();
    
    if (examData?.date) {
      const d = new Date(examData.date);
      examDateText = `${d.getMonth() + 1}月${d.getDate()}日`;
    }
  }

  const title = `${prefName}公立高校入試カウントダウン${year} - 試験日まであと何日？ | EduLens`;
  const description = `${year}年度（令和${parseInt(year) - 2018}年度）${prefName}公立高校入試の試験日はいつ？${examDateText ? `一般選抜は${examDateText}です。` : ""}試験当日まで「あと何日」かリアルタイムでカウントダウン表示します。`;
  const url = `https://edulens.jp/countdown/${prefecture}/${year}`;

  return {
    title: title,
    description: description,
    keywords: [
      `${prefName} 公立高校入試`,
      `${prefName} 高校入試 日程`,
      "高校入試 カウントダウン",
      "高校入試 あと何日",
      `${year} 高校入試`,
      "EduLens"
    ],
    alternates: {
      canonical: url,
    },
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
    manifest: `/countdown/${prefecture}/${year}/manifest.json`,
  };
}

export default async function CountdownPage({ params }: { params: Params }) {
  const { prefecture, year } = await params;

  // 1. 県データの取得
  const { data: prefData } = await supabase
    .from('prefectures')
    .select('*')
    .eq('slug', prefecture)
    .single();

  if (!prefData) {
    return notFound();
  }

  // 2. 入試日程の取得
  let exams: any[] = [];
  const { data: examData } = await supabase
    .from('official_exams')
    .select('*')
    .eq('prefecture_id', prefData.id)
    .eq('year', parseInt(year))
    .order('date', { ascending: true });
  exams = examData || [];

  // メイン試験の特定
  const mainExam = exams.find((e: any) => e.category === 'public_general') || exams[0] || null;
  const displayPrefName = prefData.name;
  const displayExamDate = mainExam?.date || `${year}-03-12`;
  const displayExamName = mainExam?.name || "公立高校入試 (仮)";

  // 3. 日数計算
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const todayStr = jstNow.toISOString().split('T')[0];
  const today = new Date(todayStr);
  const examDate = new Date(displayExamDate);
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  // ★追加: 近隣県（同じ地方の他の県）を取得する
  // 自分の県の region と同じで、かつ自分以外の県を取得
  const { data: neighborPrefs } = await supabase
    .from('prefectures')
    .select('*')
    .eq('region', prefData.region)
    .neq('id', prefData.id) // 自分自身は除外
    .order('id', { ascending: true });

  // 構造化データ
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            "name": "全国一覧",
            "item": "https://edulens.jp/countdown"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${displayPrefName}の入試`,
            "item": `https://edulens.jp/countdown/${prefecture}/${year}`
          }
        ]
      },
      ...exams.map((e: any) => {
        const startDate = e?.date || null;
        const isFuture = startDate ? new Date(`${startDate}T00:00:00+09:00`).getTime() > Date.now() : false;
        return {
          "@type": "Event",
          "name": e?.name || `${displayPrefName} 入試`,
          "startDate": startDate,
          "location": {
            "@type": "Place",
            "name": displayPrefName,
          },
          "description": e?.category ? `${e.name}（区分: ${e.category}）` : e?.name || "",
          "eventStatus": isFuture ? "https://schema.org/EventScheduled" : "https://schema.org/EventCompleted"
        };
      })
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">
        
        {/* ヘッダー */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {displayPrefName}
          </h1>
          <p className="text-2xl text-slate-500 font-medium">{year}年度 {displayExamName}</p>
        </div>

        {/* カウントダウン */}
        <div className="mb-16">
          <div className="inline-block border-b-2 border-blue-600 pb-1 mb-12">
            <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Examination Date</span>
            <span className="ml-4 text-xl font-bold text-slate-800">{displayExamDate.replace(/-/g, '.')}</span>
          </div>
          <div className="mb-8">
            <CountdownTimer targetDate={displayExamDate} />
          </div>
          {isExpired && (
            <div className="text-blue-600 font-bold mt-8 text-lg">
              試験当日、または終了しました
            </div>
          )}
        </div>

        {/* スケジュールリスト */}
        {exams.length > 0 && (
          <div>
            {/* @ts-ignore-next-line Server Component importing Client Component (allowed) */}
            <ExamSchedule exams={exams} />
          </div>
        )}

        {/* ホーム画面に追加ボタン */}
        <AddToHomeButton />

        {/* ★追加: 同じ地方の他県リンク（SEO強化: 内部リンク） */}
        {neighborPrefs && neighborPrefs.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mb-16 text-left mt-12">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider pl-1">
              {REGION_NAMES[prefData.region] || '近隣'}エリアの他の入試もチェック
            </h3>
            <div className="flex flex-wrap gap-2">
              {neighborPrefs.map((pref: any) => (
                <Link 
                  key={pref.id} 
                  href={`/countdown/${pref.slug}/${year}`}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                >
                  {pref.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SEOコンテンツエリア */}
        <div className="max-w-3xl mx-auto mt-8 pt-6 border-t text-left text-slate-500">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">{displayPrefName} 公立高校入試について</h3>
          <p className="mb-3">
            {year}年度の{displayPrefName}における公立高校入試は、以下のような日程で行われます。
            {exams.length > 0 ? (
              <>
                主要な試験は <strong className="text-slate-700">{displayExamName}（{displayExamDate.replace(/-/g, '.')}）</strong> で、その他の試験は次の通りです。
              </>
            ) : (
              <>最新の試験日はまだ登録されていません。公式発表・学校案内を参照してください。</>
            )}
          </p>

          {exams.length > 0 && (
            <ul className="list-disc pl-5 mb-4 text-slate-500">
              {exams.map((e: any) => (
                <li key={e.id} className="mb-1">
                  <span className="text-slate-700 font-medium">{e.name}</span>
                  <span className="ml-2">— {e.date.replace(/-/g, '.')}</span>
                </li>
              ))}
            </ul>
          )}

          {/* FAQ */}
          <div className="mt-6">
            <h4 className="font-semibold text-slate-800 mb-2">よくある質問（FAQ）</h4>
            <dl className="text-slate-500 space-y-3">
              <div>
                <dt className="font-medium text-slate-700">Q: 試験日はいつですか？</dt>
                <dd className="mt-1">
                  A: 主な試験日は <strong className="text-slate-700">{displayExamDate.replace(/-/g, '.')}</strong> です。その他の日程は上の「年間入試スケジュール」をご確認ください。
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Q: 合格発表日はいつですか？</dt>
                <dd className="mt-1">
                  A: 合格発表日は試験種別や自治体によって異なります。一般的には試験の数日〜数週間後に発表されますので、各都道府県・学校の公式発表を確認してください。
                </dd>
              </div>
            </dl>
          </div>

          {/* ★追加: シェアボタン */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-3 text-center">このカウントダウンをシェアする</p>
            <div className="flex justify-center gap-4">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${displayPrefName}公立高校入試まで、あと${diffDays}日！ #高校入試 #カウントダウン`)}&url=${encodeURIComponent(`https://edulens.jp/countdown/${prefecture}/${year}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                {/* Xロゴ */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                X (Twitter) でシェア
              </a>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />

        <div className="text-center mt-12 pb-8">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            GOOD LUCK TO ALL STUDENTS
          </p>
        </div>
      </div>
    </div>
  );
}