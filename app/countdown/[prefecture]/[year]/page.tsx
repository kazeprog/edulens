import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import CountdownTimer from './CountdownTimer';
import ExamSchedule from './ExamSchedule';
import AddToHomeButton from './AddToHomeButton';
import type { Metadata } from 'next';

// Next.js 15 (最新) では params が Promise になりました
type Params = Promise<{ prefecture: string; year: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { prefecture, year } = await params;
  
  // DBから県名を取得
  const { data: prefData } = await supabase
    .from('prefectures')
    .select('name')
    .eq('slug', prefecture)
    .single();

  const prefName = prefData?.name || prefecture;
  
  return {
    title: `${prefName} ${year}年度 入試カウントダウン | EduLens`,
    description: `${prefName}の${year}年度公立高校入試までのカウントダウン。試験日程と残り日数を確認できます。`,
    manifest: `/countdown/${prefecture}/${year}/manifest.json`,
  };
}

export default async function CountdownPage({ params }: { params: Params }) {
  // 1. URLからパラメータを取り出す (例: hyogo, 2026)
  const { prefecture, year } = await params;

  // 2. Supabaseから「県の情報」と「入試日程」を同時に取得する
  // (SQLを実行していない場合はエラーになるので、まずはダミーデータを表示させる仕組みも入れています)
  
  // A. 県データの取得
  const { data: prefData } = await supabase
    .from('prefectures')
    .select('*')
    .eq('slug', prefecture)
    .single();

  // B. 入試日程の取得（県データが取れたら実行）
  let exams: any[] = [];
  if (prefData) {
    const { data } = await supabase
      .from('official_exams')
      .select('*')
      .eq('prefecture_id', prefData.id)
      .eq('year', parseInt(year))
      .order('date', { ascending: true });
    exams = data || [];
  }

  // メイン試験の特定 (public_general または 最初の要素)
  const mainExam = exams.find((e) => e.category === 'public_general') || exams[0] || null;

  // --- もしDBにデータがなくても動くように、一時的なダミーデータを用意 ---
  // (SQLを実行済みの場合はDBデータが優先されます)
  const displayPrefName = prefData?.name || prefecture.toUpperCase(); // DBになければ英語のまま表示
  const displayExamDate = mainExam?.date || `${year}-03-12`; // DBになければ仮の日付
  const displayExamName = mainExam?.name || "公立高校入試 (仮)";
  // -------------------------------------------------------------

  // 3. 残り日数の計算 (サーバーサイドでの初期計算用 - 必要であれば使用)
  const today = new Date();
  // 日本時間 (JST) の00:00:00をターゲットにする
  const examDate = new Date(`${displayExamDate}T00:00:00+09:00`);
  const diffTime = examDate.getTime() - today.getTime();
  const isExpired = diffTime <= 0;

  // 構造化データ (JSON-LD) を生成
  const ld = {
    "@context": "https://schema.org",
    "@graph": exams.map((e: any) => {
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
  };

  // 4. 画面の表示 (HTML/Tailwind CSS)
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl text-center">
        
        {/* ヘッダー部分 */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            {displayPrefName}
          </h1>
          <p className="text-2xl text-slate-500 font-medium">{year}年度 {displayExamName}</p>
        </div>

        {/* カウントダウン部分 */}
        <div className="mb-16">
          <div className="inline-block border-b-2 border-blue-600 pb-1 mb-12">
            <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Examination Date</span>
            <span className="ml-4 text-xl font-bold text-slate-800">{displayExamDate.replace(/-/g, '.')}</span>
          </div>
          
          <div className="mb-8">
            {/* クライアントコンポーネントでリアルタイムカウントダウンを表示 */}
            <CountdownTimer targetDate={displayExamDate} />
          </div>

          {isExpired && (
            <div className="text-blue-600 font-bold mt-8 text-lg">
              試験当日、または終了しました
            </div>
          )}
        </div>

        {/* 年間入試スケジュール (クライアント側でリアルタイム更新) */}
        {exams.length > 0 && (
          <div>
            {/* ExamSchedule はクライアントコンポーネントで秒ごとに再計算します */}
            {/* @ts-ignore-next-line Server Component importing Client Component (allowed) */}
            <ExamSchedule exams={exams} />
          </div>
        )}

        {/* ホーム画面に追加ボタン */}
        <AddToHomeButton />

        {/* ====== SEO向けコンテンツエリア（中央寄せコンテナ内に左揃えテキスト） ====== */}
        <div className="max-w-3xl mx-auto mt-8 pt-6 border-t text-left text-slate-500">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">{displayPrefName} 公立高校入試について</h3>

          {/* 解説文（examsのデータを使って自然文を作る） */}
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

          {/* 簡易的な一覧（左揃え） */}
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
          <div className="mt-4">
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
              <div>
                <dt className="font-medium text-slate-700">Q: 試験情報はどこで確認できますか？</dt>
                <dd className="mt-1">
                  A: 各都道府県教育委員会や志望校の公式サイトが一次情報となります。本サイトは参考情報としてご利用ください。
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 構造化データ（JSON-LD）埋め込み（画面には表示されない） */}
        <script
          type="application/ld+json"
          // JSON-LD をそのまま埋め込む
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />

        <div className="text-center mt-8">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            GOOD LUCK TO ALL STUDENTS
          </p>
        </div>
      </div>
    </div>
  );
}