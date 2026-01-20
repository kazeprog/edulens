'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type HighSchoolExam = {
    id: number;
    year: number;
    prefecture_id: number;
    category: string;
    name: string;
    date: string;
    result_date: string | null;
};

type Prefecture = {
    id: number;
    name: string;
    slug: string;
    region: string;
};

export default function HighSchoolExamManager() {
    const [exams, setExams] = useState<HighSchoolExam[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [editingExam, setEditingExam] = useState<Partial<HighSchoolExam> | null>(null);
    const [loading, setLoading] = useState(true);
    const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + (new Date().getMonth() >= 3 ? 1 : 0));
    const [regionFilter, setRegionFilter] = useState<string>('all');

    // 都道府県取得
    useEffect(() => {
        const fetchPrefectures = async () => {
            const { data } = await supabase
                .from('prefectures')
                .select('*')
                .order('id');
            setPrefectures(data || []);
        };
        fetchPrefectures();
    }, []);

    // 試験データ取得
    const fetchExams = async () => {
        setLoading(true);
        let query = supabase
            .from('official_exams')
            .select('*')
            .eq('year', targetYear)
            .order('date', { ascending: true });

        const { data, error } = await query;

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
    }, [targetYear]);

    // 保存処理
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExam) return;

        try {
            let error;
            if (editingExam.id) {
                // 既存レコードの更新
                const result = await supabase
                    .from('official_exams')
                    .update({
                        year: editingExam.year,
                        prefecture_id: editingExam.prefecture_id,
                        category: editingExam.category,
                        name: editingExam.name,
                        date: editingExam.date,
                        result_date: editingExam.result_date,
                    })
                    .eq('id', editingExam.id);
                error = result.error;
            } else {
                // 新規レコードの挿入
                const result = await supabase
                    .from('official_exams')
                    .insert({
                        year: editingExam.year,
                        prefecture_id: editingExam.prefecture_id,
                        category: editingExam.category,
                        name: editingExam.name,
                        date: editingExam.date,
                        result_date: editingExam.result_date,
                    });
                error = result.error;
            }

            if (error) throw error;

            alert('保存しました');
            setEditingExam(null);
            fetchExams();
        } catch (err: unknown) {
            const errorMessage = (err as { message?: string })?.message || JSON.stringify(err);
            alert(`保存エラー: ${errorMessage}`);
        }
    };

    // 削除処理
    const handleDelete = async (id: number) => {
        if (!confirm('本当に削除しますか？')) return;

        try {
            const { error } = await supabase
                .from('official_exams')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchExams();
        } catch (err: unknown) {
            alert(`削除エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    // フィルター用
    const filteredExams = regionFilter === 'all'
        ? exams
        : exams.filter(e => {
            const pref = prefectures.find(p => p.id === e.prefecture_id);
            return pref?.region === regionFilter;
        });

    return (
        <div>
            {/* フィルター類 */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div>
                    <label className="font-bold text-slate-700 mr-2">対象年度:</label>
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
                <div>
                    <label className="font-bold text-slate-700 mr-2">地域フィルター:</label>
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="border p-2 rounded bg-white"
                    >
                        <option value="all">すべて</option>
                        <option value="hokkaido">北海道</option>
                        <option value="tohoku">東北</option>
                        <option value="kanto">関東</option>
                        <option value="chubu">中部</option>
                        <option value="kinki">近畿</option>
                        <option value="chugoku">中国</option>
                        <option value="shikoku">四国</option>
                        <option value="kyushu">九州</option>
                        <option value="okinawa">沖縄</option>
                    </select>
                </div>
            </div>

            {/* 編集フォーム */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="font-bold mb-4">{editingExam?.id ? '既存の試験を編集' : '新規試験を登録'}</h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">年度 (Year)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={editingExam?.year || targetYear}
                            onChange={e => setEditingExam({ ...editingExam, year: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">都道府県</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={editingExam?.prefecture_id || ''}
                            onChange={e => setEditingExam({ ...editingExam, prefecture_id: Number(e.target.value) })}
                            required
                        >
                            <option value="">選択してください</option>
                            {prefectures.map(pref => (
                                <option key={pref.id} value={pref.id}>{pref.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">カテゴリー</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={editingExam?.category || ''}
                            onChange={e => setEditingExam({ ...editingExam, category: e.target.value })}
                            required
                        >
                            <option value="">選択してください</option>
                            <option value="public_general">公立高校 一般選抜</option>
                            <option value="public_recommendation">公立高校 推薦・特色</option>
                            <option value="other">その他</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">試験名</label>
                        <input
                            type="text"
                            placeholder="一般入学者選抜"
                            className="w-full border p-2 rounded"
                            value={editingExam?.name || ''}
                            onChange={e => setEditingExam({ ...editingExam, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">試験日</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={editingExam?.date || ''}
                            onChange={e => setEditingExam({ ...editingExam, date: e.target.value })}
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

            {/* 新規追加ボタン */}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setEditingExam({ year: targetYear })}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">都道府県</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">試験名</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">残り日数</th>
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
                                    const pref = prefectures.find(p => p.id === exam.prefecture_id);

                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const examDate = new Date(exam.date);
                                    const diffTime = examDate.getTime() - today.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    const isPast = diffDays < 0;

                                    return (
                                        <tr key={exam.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{exam.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                                                {pref?.name || exam.prefecture_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">
                                                    {exam.name}
                                                </div>
                                                <div className="text-xs text-slate-500">{exam.category}</div>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setEditingExam(exam)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const { id, ...rest } = exam;
                                                        setEditingExam({ ...rest, date: '', result_date: null });
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
                                    );
                                }))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
