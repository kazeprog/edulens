import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import type { Metadata } from 'next';

function getTargetExamYear() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return currentMonth >= 4 ? currentYear + 1 : currentYear;
}

export async function generateMetadata(): Promise<Metadata> {
  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;
  const title = `大学入試カウントダウン${targetYear} - 共通テスト・国公立日程 | EduLens`;
  const description = `${targetYear}年度（令和${reiwaYear}年度）の大学入学共通テスト、国公立大学2次試験（前期・後期）の日程と残り日数を表示します。`;
  const url = 'https://edulens.jp/countdown/university';
  const imageUrl = 'https://edulens.jp/Xcard.png';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'website',
      siteName: 'EduLens',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: `大学入試カウントダウン${targetYear}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function UniversityTopPage() {
  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;

  const { data: events } = await supabase
    .from('university_events')
    .select('*')
    .eq('year', targetYear)
    .order('date', { ascending: true });

  const now = new Date();
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = new Date(jstNow.toISOString().split('T')[0]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            大学入試カウントダウン
            <span className="block text-indigo-600 mt-2 text-3xl sm:text-4xl">
              {targetYear} (令和{reiwaYear}年度)
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            大学入学共通テストおよび国公立大学2次試験の<br className="hidden sm:inline" />
            主要日程までのカウントダウンです。
          </p>
        </div>

        <div className="grid gap-6">
          {events && events.length > 0 ? (
            events.map((event) => {
              const examDate = new Date(event.date);
              const diffTime = examDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isFinished = diffDays < 0;
              const isCommonTest = event.slug.includes('common');

              return (
                // ▼▼▼ ここを div ではなく Link にしています ▼▼▼
                <Link 
                  key={event.id} 
                  href={`/countdown/university/${event.slug}/${targetYear}`}
                  className={`block relative bg-white rounded-xl p-6 sm:p-8 shadow-sm border transition-all 
                    ${isCommonTest ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50 hover:ring-indigo-200 hover:shadow-lg' : 'border-slate-100 hover:shadow-md hover:border-blue-200'}
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 
                        ${isCommonTest ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}
                      `}>
                        {isCommonTest ? '共通テスト' : '個別試験'}
                      </span>
                      
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
                        {event.name}
                      </h2>
                      <div className="text-slate-500 font-medium flex items-center gap-2">
                        {/* アイコン */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {event.date.replace(/-/g, '.')}
                        {event.description && (
                          <span className="text-sm text-slate-400 border-l border-slate-300 pl-2 ml-2 hidden sm:inline">
                            {event.description}
                          </span>
                        )}
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
                          <span className={`text-4xl sm:text-5xl font-black tracking-tight ${isCommonTest ? 'text-indigo-600' : 'text-blue-600'}`}>
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
              まだ日程データが登録されていません。
            </div>
          )}
        </div>

        {/* 戻るリンク（アイコン付き） */}
        <div className="mt-12 text-center">
           <Link href="/countdown" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline inline-flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             カテゴリ選択に戻る
           </Link>
        </div>

      </div>
    </div>
  );
}