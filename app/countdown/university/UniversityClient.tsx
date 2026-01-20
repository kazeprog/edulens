'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { getTargetExamYear } from '@/lib/date-utils';

type UniversityEvent = {
    id: number;
    year: number;
    slug: string;
    name: string;
    date: string;
    description: string | null;
};

function EventCard({ event, today }: { event: UniversityEvent; today: Date }) {
    const examDate = new Date(event.date);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isFinished = diffDays < 0;
    const isCommonTest = event.slug.includes('common');

    return (
        <Link
            href={`/countdown/university/${event.slug}/${event.year}`}
            prefetch={false}
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
}

// YearSection コンポーネント削除


export default function UniversityClientPage() {
    const searchParams = useSearchParams();
    const yearParam = searchParams.get('year');

    const [allEvents, setAllEvents] = useState<UniversityEvent[]>([]);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState<Date>(new Date());

    const targetYear = getTargetExamYear();
    const specificYear = yearParam ? parseInt(yearParam, 10) : null;

    useEffect(() => {
        const now = new Date();
        const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
        const todayDate = new Date(jstNow.toISOString().split('T')[0]);
        setToday(todayDate);

        const fetchEvents = async () => {
            setLoading(true);

            // 全イベントを取得
            const { data } = await supabase
                .from('university_events')
                .select('*')
                .order('date', { ascending: true });

            if (data) {
                setAllEvents(data);

                // 利用可能な年度を計算（全試験終了から3日後まで表示）
                const years = [...new Set(data.map(e => e.year))].sort((a, b) => a - b);
                const activeYears = years.filter(year => {
                    const yearEvents = data.filter(e => e.year === year);
                    // その年度の最後の試験日を取得
                    const lastExamDate = new Date(Math.max(...yearEvents.map(e => new Date(e.date).getTime())));
                    // 最後の試験日から3日後
                    const hideAfterDate = new Date(lastExamDate);
                    hideAfterDate.setDate(hideAfterDate.getDate() + 3);
                    // 今日がhideAfterDateより前なら表示
                    return todayDate <= hideAfterDate;
                });

                setAvailableYears(activeYears);
            }

            setLoading(false);
        };

        fetchEvents();
    }, []);

    // 表示する年度を決定
    const displayYear = specificYear || targetYear;
    const reiwaYear = displayYear - 2018;

    // 現在の年度のイベント
    const currentYearEvents = allEvents.filter(e => e.year === displayYear);

    // 他の年度リンク（現在表示している年度以外で、利用可能な年度のみ - タブにある年度は除外）
    const otherYears = availableYears.filter(y => {
        // タブに表示されている年度は除外
        if (y === targetYear || y === targetYear + 1) return false;

        return y !== displayYear;
    });

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">

                {/* ▼▼▼ 年度切り替えタブ ▼▼▼ */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm inline-flex">
                        {[targetYear, targetYear + 1].map((y) => {
                            const isActive = (specificYear || targetYear) === y;
                            // その年度のデータがあるか、またはターゲット年度(未来含む)なら表示
                            return (
                                <Link
                                    key={y}
                                    href={y === targetYear ? '/countdown/university' : `/countdown/university?year=${y}`}
                                    prefetch={false}
                                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${isActive
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {y}年度
                                </Link>
                            );
                        })}
                    </div>
                </div>
                {/* ▲▲▲ 年度切り替えタブ ▲▲▲ */}

                <div className="text-center mb-12">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                        大学入試カウントダウン
                        <span className="block text-indigo-600 mt-2 text-3xl sm:text-4xl">
                            {specificYear ? `${specificYear} (令和${reiwaYear}年度)` : `${targetYear} (令和${reiwaYear}年度)`}
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        大学入学共通テストおよび国公立大学2次試験の<br className="hidden sm:inline" />
                        主要日程までのカウントダウンです。
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">読み込み中...</div>
                ) : (
                    <>
                        {/* 選択された年度の日程 */}
                        {currentYearEvents.length > 0 ? (
                            <div className="grid gap-6 mb-12">
                                {currentYearEvents.map((event) => (
                                    <EventCard key={event.id} event={event} today={today} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-400 mb-12">
                                {`${displayYear}年度の日程データが登録されていません。`}
                            </div>
                        )}
                    </>
                )}

                <div className="mt-12 text-center">
                    <Link href="/countdown" prefetch={false} className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        カテゴリ選択に戻る
                    </Link>
                </div>

            </div>
        </div>
    );
}
