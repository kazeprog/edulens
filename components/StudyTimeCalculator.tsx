'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

type Props = {
  initialDateStr?: string | null;
  initialExamName?: string | null;
  backUrl?: string;
};

export default function StudyTimeCalculator({
  initialDateStr,
  initialExamName,
  backUrl = '/',
}: Props) {
  const [isConfigMode, setIsConfigMode] = useState(!initialDateStr);

  const [examDateStr, setExamDateStr] = useState<string>(initialDateStr || '');
  const [examName, setExamName] = useState<string>(initialExamName || '試験');

  const [weekdayHours, setWeekdayHours] = useState<number>(3);
  const [holidayHours, setHolidayHours] = useState<number>(8);
  const [subjectCount, setSubjectCount] = useState<number>(5);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (initialDateStr) setExamDateStr(initialDateStr);
    if (initialExamName) setExamName(initialExamName);
  }, [initialDateStr, initialExamName]);

  const { weekdayCount, holidayCount, diffDays } = useMemo(() => {
    if (!examDateStr) return { weekdayCount: 0, holidayCount: 0, diffDays: 0 };

    const now = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const today = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate());

    const targetDate = new Date(examDateStr);
    const exam = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    let wCount = 0;
    let hCount = 0;
    let dCount = 0;
    const current = new Date(today);

    while (current < exam) {
      dCount++;
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        hCount++;
      } else {
        wCount++;
      }
      current.setDate(current.getDate() + 1);
    }
    return { weekdayCount: wCount, holidayCount: hCount, diffDays: dCount };
  }, [examDateStr]);

  if (!isClient) return null;

  const totalRemainingHours = Math.floor(weekdayCount * weekdayHours + holidayCount * holidayHours);

  const hoursPerSubject = subjectCount > 0 ? (totalRemainingHours / subjectCount).toFixed(1) : totalRemainingHours.toFixed(1);

  return (
    <div className="w-full max-w-lg mx-auto mb-16 px-4">
      <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl p-6 sm:p-8 transition-all hover:shadow-2xl ring-1 ring-slate-900/5">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            勉強時間シミュレーター
          </h3>
          <button 
            onClick={() => setIsConfigMode(!isConfigMode)} 
            className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-full hover:bg-indigo-50"
          >
            {isConfigMode ? '閉じる' : '設定変更'}
          </button>
        </div>

        {isConfigMode && (
          <div className="bg-slate-50 p-5 rounded-2xl mb-8 animate-fade-in border border-slate-100">
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">目標とする試験名</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white shadow-sm"
                placeholder="例: 期末テスト"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">試験日</label>
              <input
                type="date"
                value={examDateStr}
                onChange={(e) => setExamDateStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white shadow-sm"
              />
            </div>
          </div>
        )}

        {diffDays > 0 ? (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 font-bold mb-2">{examName}まで</p>
              <div className="flex justify-center items-center gap-6 text-sm text-slate-600 bg-slate-50/80 py-3 px-6 rounded-2xl border border-slate-100 shadow-inner">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Remaining</span>
                  <span className="font-bold text-slate-800 text-lg">{diffDays}<span className="text-xs ml-0.5 font-normal text-slate-500">日</span></span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Weekdays</span>
                  <span className="font-bold text-slate-800 text-lg">{weekdayCount}<span className="text-xs ml-0.5 font-normal text-slate-500">日</span></span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Holidays</span>
                  <span className="font-bold text-slate-800 text-lg">{holidayCount}<span className="text-xs ml-0.5 font-normal text-slate-500">回</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-8 mb-10">
               {/* 平日スライダー */}
               <div>
                <label htmlFor="weekday-slider" className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    平日の勉強時間
                  </span>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                    <span className="text-xl mr-1">{weekdayHours}</span>時間
                  </span>
                </label>
                <div className="relative w-full h-6 flex items-center group">
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-150" style={{ width: `${(weekdayHours / 10) * 100}%` }}></div>
                  </div>
                  <input
                    id="weekday-slider"
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={weekdayHours}
                    onChange={(e) => setWeekdayHours(parseFloat(e.target.value))}
                    className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute h-5 w-5 bg-white border-2 border-indigo-500 rounded-full shadow-md pointer-events-none transition-all duration-150 group-hover:scale-110"
                    style={{ left: `calc(${(weekdayHours / 10) * 100}% - 10px)` }}
                  ></div>
                </div>
              </div>

              {/* 土日スライダー */}
              <div>
                <label htmlFor="holiday-slider" className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    土日の勉強時間
                  </span>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                    <span className="text-xl mr-1">{holidayHours}</span>時間
                  </span>
                </label>
                <div className="relative w-full h-6 flex items-center group">
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-150" style={{ width: `${(holidayHours / 16) * 100}%` }}></div>
                  </div>
                  <input
                    id="holiday-slider"
                    type="range"
                    min="0"
                    max="16"
                    step="0.5"
                    value={holidayHours}
                    onChange={(e) => setHolidayHours(parseFloat(e.target.value))}
                    className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute h-5 w-5 bg-white border-2 border-indigo-500 rounded-full shadow-md pointer-events-none transition-all duration-150 group-hover:scale-110"
                    style={{ left: `calc(${(holidayHours / 16) * 100}% - 10px)` }}
                  ></div>
                </div>
              </div>

              {/* 科目数スライダー */}
              <div>
                <label htmlFor="subject-slider" className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    勉強する科目数
                  </span>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                    <span className="text-xl mr-1">{subjectCount}</span>科目
                  </span>
                </label>
                <div className="relative w-full h-6 flex items-center group">
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-150" style={{ width: `${((subjectCount - 1) / 9) * 100}%` }}></div>
                  </div>
                  <input
                    id="subject-slider"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={subjectCount}
                    onChange={(e) => setSubjectCount(parseInt(e.target.value))}
                    className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute h-5 w-5 bg-white border-2 border-indigo-500 rounded-full shadow-md pointer-events-none transition-all duration-150 group-hover:scale-110"
                    style={{ left: `calc(${((subjectCount - 1) / 9) * 100}% - 10px)` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 結果表示（グラデーションボックス） */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-center shadow-lg shadow-indigo-200 mb-8 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

              <div className="relative z-10 grid grid-cols-2 gap-6 divide-x divide-white/20">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-indigo-100 uppercase mb-1 tracking-wider">TOTAL TIME</p>
                  <p className="text-xs text-indigo-100/80 mb-2">確保できる総時間</p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {totalRemainingHours}
                    <span className="text-sm font-bold text-indigo-200 ml-1">h</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-indigo-100 uppercase mb-1 tracking-wider">PER SUBJECT</p>
                  <p className="text-xs text-indigo-100/80 mb-2">1科目あたり</p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {hoursPerSubject}
                    <span className="text-sm font-bold text-indigo-200 ml-1">h</span>
                  </div>
                </div>
              </div>
            </div>
            {/* アクションボタンは完全に削除しました */}
          </>
        ) : (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-slate-600 font-bold mb-1">試験日が設定されていません</p>
            <p className="text-sm text-slate-400">上の「設定変更」から試験日を入力してください</p>
          </div>
        )}

        <Link href={backUrl} className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          元のページに戻る
        </Link>
      </div>
    </div>
  );
}