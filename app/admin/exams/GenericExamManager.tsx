'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type Exam = {
    id: string;
    slug: string;
    session_slug: string;
    exam_name: string;
    session_name: string;
    primary_exam_date: string;
    result_date: string | null;
    is_active: boolean;
    category?: string | null;
};

import { categories } from '@/app/constants/examCategories';

export default function GenericExamManager() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [editingExam, setEditingExam] = useState<Partial<Exam> | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

    // データ取得
    const fetchExams = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('exam_schedules')
            .select('*')
            .order('primary_exam_date', { ascending: false });

        if (error) {
            console.error(error);
            alert('データ取得に失敗しました');
        } else {
            setExams(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExams();
    }, []);

    // 保存処理 (INSERT or UPDATE)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExam) return;

        try {
            const { error } = await supabase
                .from('exam_schedules')
                .upsert(editingExam)
                .select();

            if (error) throw error;

            alert('保存しました');
            setEditingExam(null); // 編集モード終了
            fetchExams(); // リスト更新
        } catch (err: unknown) {
            alert(`保存エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    // 削除処理
    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？この操作は取り消せません。')) return;

        try {
            const { error } = await supabase
                .from('exam_schedules')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchExams();
        } catch (err: unknown) {
            alert(`削除エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const getFilteredExams = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return exams.filter(exam => {
            const examDate = new Date(exam.primary_exam_date);
            // examDate自体は0:00なのでそのまま比較
            if (filter === 'upcoming') {
                return examDate >= today;
            } else if (filter === 'past') {
                return examDate < today;
            }
            return true;
        });
    };

    const filteredExams = getFilteredExams();

    return (
        <div>
            {/* 編集フォーム */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="font-bold mb-4">{editingExam?.id ? '既存の試験を編集' : '新規試験を登録'}</h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URLの一部)</label>
                        <input
                            type="text"
                            placeholder="doctor, takken, etc."
                            className="w-full border p-2 rounded"
                            value={editingExam?.slug || ''}
                            onChange={e => setEditingExam({ ...editingExam, slug: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Session Slug (URLの一部)</label>
                        <input
                            type="text"
                            placeholder="2026-02-07"
                            className="w-full border p-2 rounded"
                            value={editingExam?.session_slug || ''}
                            onChange={e => setEditingExam({ ...editingExam, session_slug: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">試験名 (大分類)</label>
                        <input
                            type="text"
                            placeholder="医師国家試験"
                            className="w-full border p-2 rounded"
                            value={editingExam?.exam_name || ''}
                            onChange={e => setEditingExam({ ...editingExam, exam_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">セッション名 (具体的な回)</label>
                        <input
                            type="text"
                            placeholder="第120回 医師国家試験"
                            className="w-full border p-2 rounded"
                            value={editingExam?.session_name || ''}
                            onChange={e => setEditingExam({ ...editingExam, session_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">試験日 (YYYY-MM-DD)</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={editingExam?.primary_exam_date || ''}
                            onChange={e => setEditingExam({ ...editingExam, primary_exam_date: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">合格発表日 (任意)</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={editingExam?.result_date || ''}
                            onChange={e => setEditingExam({ ...editingExam, result_date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">カテゴリ (未選択は一覧非表示)</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={editingExam?.category || ''}
                            onChange={e => setEditingExam({ ...editingExam, category: e.target.value || null })}
                        >
                            <option value="">未分類 (一覧に表示しない)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setEditingExam(null)}
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

            {/* 一覧リスト */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'upcoming'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        これからの試験
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'past'
                            ? 'bg-slate-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        終了した試験
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'all'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        すべて
                    </button>
                </div>

                <button
                    onClick={() => setEditingExam({ is_active: true })}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">試験日</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">試験名</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">残り日数</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredExams.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        データがありません
                                    </td>
                                </tr>
                            ) : (
                                filteredExams.map((exam) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const examDate = new Date(exam.primary_exam_date);
                                    const diffTime = examDate.getTime() - today.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    const isPast = diffDays < 0;

                                    return (
                                        <tr key={exam.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{exam.primary_exam_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {exam.session_name}
                                                </div>
                                                <div className="text-sm text-slate-500">{exam.exam_name}</div>
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
                                                {exam.slug} / {exam.session_slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setEditingExam(exam)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // IDを除外してコピー（新規作成モードにする）
                                                        const { id, ...rest } = exam;
                                                        setEditingExam({ ...rest, session_slug: '', session_name: '', primary_exam_date: '' });
                                                    }}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    複製
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(exam.id)}
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
