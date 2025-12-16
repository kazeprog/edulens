'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Exam = {
  id: string;
  slug: string;
  session_slug: string;
  exam_name: string;
  session_name: string;
  primary_exam_date: string;
};

type Props = {
  groups: { [key: string]: Exam[] };
  slug: string;
};

export default function MonthlyList({ groups, slug }: Props) {
  // 今日の日付を取得（クライアントサイドでの計算用）
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 月のキーを日付順にソートして取得
  const sortedKeys = useMemo(() => {
    return Object.keys(groups).sort((a, b) => {
      const parseKey = (key: string) => {
        const match = key.match(/(\d+)年(\d+)月/);
        if (!match) return 0;
        return parseInt(match[1]) * 100 + parseInt(match[2]);
      };
      return parseKey(a) - parseKey(b);
    });
  }, [groups]);

  // 初期状態: ソート後の最初の月（直近の月）だけ開く
  const initialOpenState = useMemo(() => {
    return sortedKeys.reduce((acc, key, index) => {
      acc[key] = index === 0;
      return acc;
    }, {} as { [key: string]: boolean });
  }, [sortedKeys]);

  const [openMonths, setOpenMonths] = useState<{ [key: string]: boolean }>(initialOpenState);

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  return (
    <div className="space-y-4">
      {sortedKeys.map((month) => {
        const exams = groups[month];
        return (
          <div key={month} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleMonth(month)}
              className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {month}
                <span className="text-sm font-normal text-slate-500 ml-2">({exams.length}件)</span>
              </h3>
              <span className={`transform transition-transform duration-200 ${openMonths[month] ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openMonths[month] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 grid gap-3">
                {exams.map((exam) => {
                  const examDate = new Date(exam.primary_exam_date);
                  const diffTime = examDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const isFinished = diffDays < 0;

                  return (
                    <Link
                      key={exam.id}
                      href={`/countdown/${slug}/${exam.session_slug}`}
                      className="block bg-white border border-slate-100 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors">
                            {exam.session_name}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {exam.primary_exam_date.replace(/-/g, '/')}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {isFinished ? (
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">終了</span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-slate-400 font-bold uppercase">Remaining</span>
                              <span className="text-xl font-black text-blue-600 leading-none">
                                {diffDays}<span className="text-xs ml-0.5">days</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
