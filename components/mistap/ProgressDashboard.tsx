import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

// カラー設定
const COLORS = {
    learned: '#9CA3AF', // 覚えた単語 (Gray)
    toCheck: '#F472B6', // 要チェック (Pink)
    notLearned: '#EF4444', // 覚えていない (Red)
};

// モックデータ: 学習進捗状況 (ドーナツグラフ用)
const PROGRESS_DATA = [
    { name: '覚えた単語', value: 450, color: COLORS.learned },
    { name: '要チェックの単語', value: 80, color: COLORS.toCheck },
    { name: '覚えていない単語', value: 120, color: COLORS.notLearned },
];

// モックデータ: 学習推移 (折れ線グラフ用 - 過去60日分)
const generateTrendData = () => {
    const data = [];
    const today = new Date();
    for (let i = 59; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

        // ランダムなデータ生成 (徐々に増える傾向 + ランダムな変動)
        const base = Math.floor(Math.random() * 5); // 0-4 words per day base
        const spike = Math.random() > 0.9 ? Math.floor(Math.random() * 10) + 5 : 0; // occasional spike

        data.push({
            date: dateStr,
            learned: Math.floor(Math.random() * 3),
            toCheck: Math.floor(Math.random() * 2),
            notLearned: base + spike,
        });
    }
    return data;
};

const TREND_DATA = generateTrendData();

import { useRef, useEffect } from 'react';

export default function ProgressDashboard() {
    const scrollRef = useRef<HTMLDivElement>(null);

    // 初回レンダリング時に右端（最新の日付）までスクロール
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, []);
    return (
        <div className="flex flex-col gap-6">

            {/* 1. 学習進捗状況 (ドーナツグラフ) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                <h3 className="text-gray-700 font-bold mb-4">単語学習の進捗状況</h3>
                <div className="w-full h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={PROGRESS_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {PROGRESS_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                iconType="rect"
                                formatter={(value, entry: any) => (
                                    <span className="text-gray-600 text-sm ml-1 mr-2">{value}</span>
                                )}
                            />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* 中央のテキスト（オプション） - ドーナツの真ん中 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-6">
                        {/* 必要であればここに合計数などを表示 */}
                    </div>
                </div>
            </div>

            {/* 2. 学習推移グラフ (折れ線グラフ) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-gray-700 font-bold mb-4 text-center sm:text-left">単語学習の推移 (過去60日間)</h3>

                {/* スクロール可能なコンテナ */}
                <div
                    ref={scrollRef}
                    className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                >
                    {/* グラフの幅を画面幅の約2倍（200%）に設定して、30日分を表示させる */}
                    <div className="h-72 min-w-[200%] sm:min-w-[1200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={TREND_DATA}
                                margin={{
                                    top: 5,
                                    right: 30, // 右端のpaddingを少し増やす
                                    left: 0, // 左端はスクロールで見切れるので0でOK
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    interval={4} // 5日ごとに表示（4つ飛ばす）
                                    angle={-45}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    label={{ value: '単語数', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 } }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="learned"
                                    name="覚えた単語"
                                    stroke={COLORS.learned}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="toCheck"
                                    name="要チェックの単語"
                                    stroke={COLORS.toCheck}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="notLearned"
                                    name="覚えていない単語"
                                    stroke={COLORS.notLearned}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2 md:hidden">
                    ← スクロールして過去の推移を確認 →
                </p>
            </div>
        </div>
    );
}
