'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type Exam = {
    id: string; // Changed to string for UUID
    slug: string;
    session_slug: string;
    exam_name: string;
    session_name: string;
    primary_exam_date: string;
    result_date: string | null;
    is_active: boolean;
};

export default function ExamManagerPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [editingExam, setEditingExam] = useState<Partial<Exam> | null>(null);
    const [loading, setLoading] = useState(true);

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
    const handleDelete = async (id: string) => { // Changed to string
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

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">試験日程管理</h2>

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
            <button
                onClick={() => setEditingExam({ is_active: true })}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
            >
                + 新規追加
            </button>

            {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">試験日</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">試験名</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{exam.primary_exam_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{exam.session_name}</div>
                                        <div className="text-sm text-slate-500">{exam.exam_name}</div>
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
                                            onClick={() => handleDelete(exam.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
