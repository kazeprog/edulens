'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type UniversityEvent = {
    id: number;
    year: number;
    slug: string;
    name: string;
    date: string;
    description: string | null;
};

export default function UniversityExamManager() {
    const [events, setEvents] = useState<UniversityEvent[]>([]);
    const [editingEvent, setEditingEvent] = useState<Partial<UniversityEvent> | null>(null);
    const [loading, setLoading] = useState(true);
    const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + (new Date().getMonth() >= 3 ? 1 : 0));

    // データ取得
    const fetchEvents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('university_events')
            .select('*')
            .eq('year', targetYear)
            .order('date', { ascending: true });

        if (error) {
            console.error(error);
            alert('データ取得に失敗しました');
        } else {
            setEvents(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, [targetYear]);

    // 保存処理 (INSERT or UPDATE)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            const { error } = await supabase
                .from('university_events')
                .upsert(editingEvent)
                .select();

            if (error) throw error;

            alert('保存しました');
            setEditingEvent(null); // 編集モード終了
            fetchEvents(); // リスト更新
        } catch (err: unknown) {
            alert(`保存エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    // 削除処理
    const handleDelete = async (id: number) => {
        if (!confirm('本当に削除しますか？この操作は取り消せません。')) return;

        try {
            const { error } = await supabase
                .from('university_events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchEvents();
        } catch (err: unknown) {
            alert(`削除エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    return (
        <div>
            {/* 年選択 */}
            <div className="mb-6 flex items-center gap-4">
                <label className="font-bold text-slate-700">対象年度:</label>
                <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="border p-2 rounded bg-white"
                >
                    {[2024, 2025, 2026, 2027].map(y => (
                        <option key={y} value={y}>{y}年度</option>
                    ))}
                </select>
            </div>

            {/* 編集フォーム */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="font-bold mb-4">{editingEvent?.id ? '既存のイベントを編集' : '新規イベントを登録'}</h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">年度 (Year)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={editingEvent?.year || targetYear}
                            onChange={e => setEditingEvent({ ...editingEvent, year: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL用)</label>
                        <input
                            type="text"
                            placeholder="common-test-day1"
                            className="w-full border p-2 rounded"
                            value={editingEvent?.slug || ''}
                            onChange={e => setEditingEvent({ ...editingEvent, slug: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">イベント名</label>
                        <input
                            type="text"
                            placeholder="大学入学共通テスト 1日目"
                            className="w-full border p-2 rounded"
                            value={editingEvent?.name || ''}
                            onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">日程 (Date)</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={editingEvent?.date || ''}
                            onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">詳細 (Description)</label>
                        <input
                            type="text"
                            placeholder="地歴・公民、国語、外国語"
                            className="w-full border p-2 rounded"
                            value={editingEvent?.description || ''}
                            onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setEditingEvent(null)}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
                        >
                            保存
                        </button>
                    </div>
                </form>
            </div>

            {/* 新規追加ボタン */}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setEditingEvent({ year: targetYear })}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold text-sm shadow-sm transition"
                >
                    + 新規追加
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">日程</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">イベント名</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">残り日数</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        データがありません
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const examDate = new Date(event.date);
                                    const diffTime = examDate.getTime() - today.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    const isPast = diffDays < 0;

                                    return (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{event.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {event.name}
                                                </div>
                                                {event.description && <div className="text-xs text-slate-400">{event.description}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {!isPast && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        あと{diffDays}日
                                                    </span>
                                                )}
                                                {isPast && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                        終了
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {event.slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setEditingEvent(event)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    削除
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
