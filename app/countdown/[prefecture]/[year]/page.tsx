import { supabase } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';

// Next.js 15 (最新) では params が Promise になりました
type Params = Promise<{ prefecture: string; year: string }>;

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
  let examData = null;
  if (prefData) {
    const { data } = await supabase
      .from('official_exams')
      .select('*')
      .eq('prefecture_id', prefData.id)
      .eq('year', parseInt(year))
      .single();
    examData = data;
  }

  // --- もしDBにデータがなくても動くように、一時的なダミーデータを用意 ---
  // (SQLを実行済みの場合はDBデータが優先されます)
  const displayPrefName = prefData?.name || prefecture.toUpperCase(); // DBになければ英語のまま表示
  const displayExamDate = examData?.date || `${year}-03-12`; // DBになければ仮の日付
  const displayExamName = examData?.name || "公立高校入試 (仮)";
  // -------------------------------------------------------------

  // 3. 残り日数の計算
  const today = new Date();
  const examDate = new Date(displayExamDate);
  
  // 時間のズレを無視して「日付」だけで差分を計算
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 4. 画面の表示 (HTML/Tailwind CSS)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* ヘッダー部分 */}
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            {displayPrefName}
          </h1>
          <p className="text-blue-100 font-medium">{year}年度 {displayExamName}</p>
        </div>

        {/* カウントダウン部分 */}
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-2">試験日: {displayExamDate}</p>
          
          <div className="my-6">
            <span className="text-gray-400 text-lg font-bold">あと</span>
            <span className="text-8xl font-black text-blue-600 mx-2 tracking-tighter">
              {diffDays > 0 ? diffDays : 0}
            </span>
            <span className="text-gray-400 text-lg font-bold">日</span>
          </div>

          {diffDays <= 0 && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg font-bold">
              試験当日、または終了しました
            </div>
          )}

          <p className="text-sm text-gray-400 mt-4">
            がんばれ受験生！ EduLens
          </p>
        </div>
      </div>
    </div>
  );
}