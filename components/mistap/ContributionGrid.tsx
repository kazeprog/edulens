'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
    format,
    subDays,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    parseISO,
    startOfMonth
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface ContributionDay {
    date: Date;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export default function ContributionGrid() {
    const { user } = useAuth();
    const [contributions, setContributions] = useState<Record<string, number>>({});
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributions = async () => {
            if (!user) return;
            const supabase = getSupabase();
            if (!supabase) return;

            try {
                // Fetch for the last 365 days
                const oneYearAgo = subDays(new Date(), 365).toISOString();
                const { data, error } = await supabase
                    .from('results')
                    .select('created_at')
                    .eq('user_id', user.id)
                    .gte('created_at', oneYearAgo);

                if (error) throw error;

                const counts: Record<string, number> = {};
                let total = 0;
                data?.forEach(row => {
                    const date = format(parseISO(row.created_at), 'yyyy-MM-dd');
                    counts[date] = (counts[date] || 0) + 1;
                    total++;
                });
                setContributions(counts);
                setTotalCount(total);
            } catch (err) {
                console.error('Failed to fetch contributions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [user]);

    const days = useMemo(() => {
        const end = new Date();
        const start = subDays(end, 364);
        // GitHub uses Sunday as start of week.
        const gridStart = startOfWeek(start, { weekStartsOn: 0 });
        const gridEnd = endOfWeek(end, { weekStartsOn: 0 });

        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, []);

    const gridData = useMemo(() => {
        return days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const count = contributions[dateStr] || 0;
            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (count > 5) level = 4;
            else if (count > 3) level = 3;
            else if (count > 1) level = 2;
            else if (count > 0) level = 1;

            return { date: day, count, level };
        });
    }, [days, contributions]);

    // Group into weeks (columns)
    const weeks = useMemo(() => {
        const result: ContributionDay[][] = [];
        for (let i = 0; i < gridData.length; i += 7) {
            result.push(gridData.slice(i, i + 7));
        }
        return result;
    }, [gridData]);

    const getColorClass = (level: number) => {
        switch (level) {
            case 1: return 'bg-red-100';
            case 2: return 'bg-red-300';
            case 3: return 'bg-red-500';
            case 4: return 'bg-red-700';
            default: return 'bg-gray-100';
        }
    };

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
    }, [loading]);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-32 mb-4"></div>
                <div className="h-24 bg-gray-50 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden relative group">
            <div className="flex items-center mb-4">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    過去1年間の学習記録
                </h3>
            </div>

            <div
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
            >
                <div className="inline-flex flex-col gap-1 min-w-max">
                    {/* Month Labels Row */}
                    <div className="flex gap-1">
                        {/* Spacer matching the day-of-week labels width (w-5 = 20px) */}
                        <div className="w-5" />

                        <div className="flex gap-1 text-[9px] text-gray-400 select-none pb-1">
                            {weeks.map((week, weekIdx) => {
                                const firstDayOfMonthInWeek = week.find(d => d.date.getDate() === 1);
                                let label = null;

                                if (firstDayOfMonthInWeek) {
                                    label = format(firstDayOfMonthInWeek.date, 'M月', { locale: ja });
                                } else if (weekIdx === 0) {
                                    // Only show the very first month if the next month is more than 2 weeks away
                                    const nextMonthStart = weeks.slice(1, 3).find(w => w.find(d => d.date.getDate() === 1));
                                    if (!nextMonthStart) {
                                        label = format(week[0].date, 'M月', { locale: ja });
                                    }
                                }

                                return (
                                    <div key={weekIdx} className="w-3 h-3 relative">
                                        {label && (
                                            <span className="absolute left-0 top-0 whitespace-nowrap">
                                                {label}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grid and Day Labels Row */}
                    <div className="flex gap-1">
                        {/* Day of week labels */}
                        <div className="flex flex-col gap-[3px] text-[9px] text-gray-400 select-none w-5 pt-[1px]">
                            <div className="h-3 leading-3"></div>
                            <div className="h-3 leading-3">月</div>
                            <div className="h-3 leading-3"></div>
                            <div className="h-3 leading-3">水</div>
                            <div className="h-3 leading-3"></div>
                            <div className="h-3 leading-3">金</div>
                            <div className="h-3 leading-3"></div>
                        </div>

                        {/* Columns of cubes */}
                        {weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="flex flex-col gap-[3px]">
                                {week.map((day, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        title={`${format(day.date, 'yyyy/MM/dd')}: ${day.count}回実施`}
                                        className={`w-3 h-3 rounded-[2px] ${getColorClass(day.level)} transition-all duration-300 hover:ring-2 hover:ring-red-200 hover:z-10 cursor-pointer`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-gray-400 select-none">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-100"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-red-100"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-red-300"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-red-700"></div>
                <span>More</span>
            </div>

        </div>
    );
}
