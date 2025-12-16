import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import MonthlyList from './MonthlyList';

// ISR設定
export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // 代表的な試験名を取得するために1件取得
  const { data: nextExam } = await supabase
    .from('exam_schedules')
    .select('exam_name')
    .eq('slug', slug)
    .limit(1)
    .single();

  // データ取得ができなかった場合などはslugを大文字化して代用
  const displayExamName = nextExam?.exam_name || slug.toUpperCase();

  // 検索意図「いつ？あと何日？」をそのままタイトルに反映
  const title = `${displayExamName}試験日はいつ？あと何日？日程・カウントダウン一覧 | EduLens`;
  
  // 問いかけと解決策（リアルタイムカウントダウン）を提示
  const description = `【${displayExamName}】試験日はいつ？本番まであと何日かをリアルタイムでカウントダウン。次回の日程、出願期間、合格発表日まで最新情報を一覧で掲載。受験生必見の${displayExamName}情報サイト。`;
  
  const url = `https://edulens.jp/countdown/${slug}`;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: title,
    description: description,
    keywords: [
      `${displayExamName} 試験日`,
      `${displayExamName} いつ`,
      `${displayExamName} あと何日`,
      `${displayExamName} 日程`,
      "カウントダウン",
      "合格発表",
      "申し込み期間"
    ],
    alternates: { canonical: url },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
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

export default async function ExamListPage({ params }: { params: Params }) {
  const { slug } = await params;

  // 今日の日付を取得
  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const todayStr = jstNow.toISOString().split('T')[0];
  const today = new Date(todayStr);

  // 試験日程を取得（日付順）
  const { data: exams } = await supabase
    .from('exam_schedules')
    .select('*')
    .eq('slug', slug)
    .order('primary_exam_date', { ascending: true });

  // フィルタリング: Web合否発表日（なければ試験日）が過ぎたものは除外
  const filteredExams = exams?.filter(exam => {
    const compareDate = exam.result_date || exam.primary_exam_date;
    return compareDate >= todayStr;
  }) || [];

  // 表示用の試験名を取得（データがあればその1件目から）
  let examName = filteredExams.length > 0 ? filteredExams[0].exam_name : (exams && exams.length > 0 ? exams[0].exam_name : slug);

  // 英検の場合の表示調整
  if (slug === 'eiken') {
    examName = '英検（実用英語技能検定）';
  }

  // 月ごとにグループ化（TOEFLの場合など）
  let monthlyGroups = null;
  if ((slug === 'toefl' || slug === 'toeic') && filteredExams.length > 0) {
    monthlyGroups = filteredExams.reduce((acc, exam) => {
      const d = new Date(exam.primary_exam_date);
      const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(exam);
      return acc;
    }, {} as { [key: string]: typeof filteredExams });
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            {examName}カウントダウン
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            {examName}の試験日程と<br className="hidden sm:inline" />
            試験日までのカウントダウンです。
          </p>
        </div>

        <div className="grid gap-6">
          {monthlyGroups ? (
            <MonthlyList groups={monthlyGroups} slug={slug} />
          ) : filteredExams.length > 0 ? (
            filteredExams.map((exam) => {
              const examDate = new Date(exam.primary_exam_date);
              const diffTime = examDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isFinished = diffDays < 0;

              return (
                <Link
                  key={exam.id}
                  href={`/countdown/${exam.slug}/${exam.session_slug}`}
                  className={`block relative bg-white rounded-xl p-6 sm:p-8 shadow-sm border transition-all border-slate-100 hover:shadow-md hover:border-blue-200`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-100 text-blue-700">
                        {exam.exam_name}
                      </span>

                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
                        {exam.session_name}
                      </h2>
                      <div className="text-slate-500 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {exam.primary_exam_date.replace(/-/g, '.')}
                      </div>
                    </div>

                    <div className="text-right min-w-[120px]">
                      {isFinished ? (
                        <span className="inline-block border-2 border-slate-200 text-slate-400 font-bold px-4 py-2 rounded-lg bg-slate-50">
                          終了
                        </span>
                      ) : (
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Remaining</span>
                          <span className="text-4xl sm:text-5xl font-black tracking-tight text-blue-600">
                            {diffDays}
                          </span>
                          <span className="text-sm text-slate-500 font-bold ml-1">Days</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-400">
              現在、表示できる試験日程がありません。
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/countdown" className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            カテゴリ選択に戻る
          </Link>
        </div>

      </div>
    </div>
  );
}
