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

  // JST midnight for "today" based on current client time
    const todayJstMidnightMs = useMemo(() => {
    // keep the value for compatibility but not used for included-today logic
    const now = new Date(nowMs);
    const offsetMinutes = now.getTimezoneOffset(); // minutes behind UTC
    const jstOffset = 9 * 60; // JST in minutes
    const jstNowMs = now.getTime() + (offsetMinutes + jstOffset) * 60 * 1000;
    const jst = new Date(jstNowMs);
    const yyyy = jst.getFullYear();
    const mm = String(jst.getMonth() + 1).padStart(2, '0');
    const dd = String(jst.getDate()).padStart(2, '0');
    return Date.parse(`${yyyy}-${mm}-${dd}T00:00:00+09:00`);
  }, [nowMs]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-16 text-left">
      <h2 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-4">
        年間入試スケジュール
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {examsWithTimes.map((exam) => {
            const thisDiffTime = exam.__targetMs - nowMs;
            // include today: use ceil on remaining ms to count today as 1
            const thisDiffDays = Math.max(0, Math.ceil((exam.__targetMs - nowMs) / msPerDay));
            const isFinished = thisDiffTime <= 0;

            return (
              <div
                key={exam.id}
                className={`p-4 flex items-center justify-between ${isFinished ? 'bg-slate-50 text-slate-400' : 'hover:bg-slate-50 transition-colors'}`}>
                <div>
                  <div className={`font-bold text-sm sm:text-base ${isFinished ? 'text-slate-500' : 'text-slate-800'}`}>{exam.name}</div>
                  <div className="text-xs sm:text-sm mt-1 opacity-80">{exam.date.replace(/-/g, '/')}</div>
                </div>
                <div className="text-right">
                  {isFinished ? (
                    <span className="text-xs font-bold px-2 py-1 rounded text-slate-400">終了</span>
                  ) : (
                    <span className="text-blue-600 font-bold text-lg">
                      <span className="text-slate-400">今日をいれて</span>あと {thisDiffDays} 日
                    </span>
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
