import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import ExamSchedule from './ExamSchedule';
import AddToHomeButton from './AddToHomeButton';
import type { Metadata } from 'next';

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

  const title = `${prefName}公立高校入試${year} いつ？あと何日？｜試験日カウントダウン | EduLens`;
  const description = `${prefName}公立高校入試${year}年度はいつ？${examDateText ? `一般選抜は${examDateText}実施。` : ""}試験日まであと何日かをリアルタイムでカウントダウン。受験生必見の${prefName}入試日程情報。`;
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
    manifest: `/countdown/highschool/${prefecture}/${year}/manifest.json`,
  };
}

export default async function CountdownPage({ params }: { params: Params }) {
  const { prefecture, year } = await params;

  const { data: allPrefectures } = await supabase
    .from('prefectures')
    .select('*')
    .order('id', { ascending: true });

  if (!allPrefectures) return notFound();

  const prefData = allPrefectures.find(p => p.slug === prefecture);
  if (!prefData) return notFound();

  let exams: any[] = [];
  const { data: examData } = await supabase
    .from('official_exams')
    .select('*')
    .eq('prefecture_id', prefData.id)
    .eq('year', parseInt(year))
    .order('date', { ascending: true });
  exams = examData || [];

  const mainExam = exams.find((e: any) => e.category === 'public_general') || exams[0] || null;
  const displayPrefName = prefData.name;
  const displayExamDate = mainExam?.date || `${year}-03-12`;
  const displayExamName = mainExam?.name || "公立高校入試 (仮)";
  const displayExamDateDots = displayExamDate.split('-').join('.');
  const displayExamDateJap = (() => {
    const p = displayExamDate.split('-');
    return p.length === 3 ? `${p[0]}年${p[1]}月${p[2]}日` : displayExamDate;
  })();

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
        "location": { "@type": "Place", "name": displayPrefName },
        "description": e?.name || "",
        "eventStatus": "https://schema.org/EventScheduled"
      })),
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "入試日はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${displayExamName}は、${displayExamDate}に実施されます。`
            }
          },
          {
            "@type": "Question",
            "name": "合格発表はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `詳細な日程は${displayPrefName}教育委員会の公式発表をご確認ください。通常、試験の1週間〜10日後に行われます。`
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {displayPrefName}
          </h1>
          <p className="text-2xl text-slate-500 font-medium">{year}年度 {displayExamName}</p>
        </div>

        <div className="mb-16">
          <div className="inline-block border-b-2 border-blue-600 pb-1 mb-12">
            <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Examination Date</span>
            <span className="ml-4 text-xl font-bold text-slate-800">{displayExamDateDots}</span>
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

        {exams.length > 0 && (
          <div>
            {/* @ts-ignore-next-line Server Component importing Client Component (allowed) */}
            <ExamSchedule exams={exams} />
          </div>
        )}

        <AddToHomeButton />

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
                  className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                >
                  {pref.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ▼▼▼ 追加：SEO用の解説セクション（デザインは控えめに） ▼▼▼ */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {displayPrefName}公立高校入試はいつ？{year}年度の試験日程
          </h2>
          <div className="prose text-slate-500 text-sm leading-relaxed space-y-4">
            <p className="text-base font-semibold text-slate-700">
              {displayPrefName}公立高校入試{year}年度の試験日は<strong className="text-blue-600">{displayExamDateJap}</strong>です。
              試験日まであと<strong className="text-blue-600">{diffDays}日</strong>です。
            </p>
            <p>
              {year}年度（令和{parseInt(year) - 2018}年度）の{displayPrefName}公立高等学校入学者選抜は、
              主に「{exams.map(e => e.name).join('」「')}」の日程で実施されます。
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

          {/* よくある質問（SEOの宝庫） */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{displayPrefName}公立高校入試 よくある質問</h3>
            <dl className="space-y-6">
              <div>
                <dt className="font-bold text-slate-700 text-base mb-2">Q. {displayPrefName}公立高校入試はいつですか？</dt>
                <dd className="text-slate-600 text-sm">
                  A. {year}年度の{displayPrefName}公立高校入試（{displayExamName}）は、<strong>{displayExamDate}</strong>に実施されます。
                  試験日まであと<strong>{diffDays}日</strong>です。
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
                  A. 詳細な日程は{displayPrefName}教育委員会の公式発表をご確認ください。通常、試験の1週間〜10日後に行われます。
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {/* ▲▲▲ 追加ここまで ▲▲▲ */}

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-3 text-center">このカウントダウンをシェアする</p>
            <div className="flex justify-center gap-4">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${displayPrefName}公立高校入試まで、あと${diffDays}日！ #高校入試 #カウントダウン`)}&url=${encodeURIComponent(`https://edulens.jp/countdown/highschool/${prefecture}/${year}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                X (Twitter) でシェア
              </a>
            </div>
          </div>

        {/* ▼▼▼ 追加: カテゴリ選択に戻るリンク ▼▼▼ */}
        <div className="mt-12 text-center">
           <Link href="/countdown/highschool" className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             都道府県一覧に戻る
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