'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function ExamSchedule({ exams }: { exams: any[] }) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const msPerDay = 1000 * 60 * 60 * 24;

  // Precompute target times to avoid reparsing on every render
  const examsWithTimes = useMemo(() => {
    return exams.map((e) => ({ ...e, __targetMs: Date.parse(`${e.date}T00:00:00+09:00`) }));
  }, [exams]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-16 text-left">
      <h2 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-4">
        年間入試スケジュール
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {examsWithTimes.map((exam) => {
            const thisDiffTime = exam.__targetMs - nowMs;
            const thisDiffDays = Math.max(0, Math.ceil((exam.__targetMs - nowMs) / msPerDay));
            const isFinished = thisDiffTime <= 0;

            return (
              <div
                key={exam.id}
                className={`p-4 flex items-center justify-between ${isFinished ? 'bg-slate-50 text-slate-400' : 'hover:bg-slate-50 transition-colors'}`}>
                
                {/* 左側：試験名と日程 */}
                <div className="flex-1 pr-2">
                  <div className={`font-bold text-sm sm:text-base mb-1.5 ${isFinished ? 'text-slate-500' : 'text-slate-800'}`}>
                    {exam.name}
                  </div>
                  
                  {/* ▼▼▼ 修正: 日程表示エリア ▼▼▼ */}
                  <div className="flex flex-col gap-1">
                    {/* 試験日 */}
                    <div className="text-xs sm:text-sm flex items-center">
                       <span className={`inline-block w-8 text-[10px] text-center rounded px-1 py-0.5 mr-2 font-bold ${isFinished ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-600'}`}>
                         試験
                       </span>
                       <span className={isFinished ? 'opacity-70' : ''}>
                         {exam.date.replace(/-/g, '/')}
                       </span>
                    </div>

                    {/* 合格発表日（データがある場合のみ表示） */}
                    {exam.result_date && (
                      <div className="text-xs sm:text-sm flex items-center">
                        <span className={`inline-block w-8 text-[10px] text-center rounded px-1 py-0.5 mr-2 font-bold ${isFinished ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                          発表
                        </span>
                        <span className={isFinished ? 'opacity-70' : ''}>
                          {exam.result_date.replace(/-/g, '/')}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* ▲▲▲ 修正ここまで ▲▲▲ */}

                </div>

                {/* 右側：カウントダウン */}
                <div className="text-right whitespace-nowrap pl-2">
                  {isFinished ? (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-200 text-slate-500">終了</span>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 mb-[-2px]">今日をいれて</span>
                      <span className="text-blue-600 font-bold text-lg">
                         あと {thisDiffDays} 日
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}