'use client';

import { useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type ExtractedExam = {
    category: string;
    name: string;
    date: string;
    result_date: string | null;
    application_start: string | null;
    application_end: string | null;
};

type ImportResult = {
    prefecture: string;
    prefecture_id: number | null;
    year: number;
    exams: ExtractedExam[];
};

const prefectures = [
    { id: 1, name: '北海道' }, { id: 2, name: '青森県' }, { id: 3, name: '岩手県' },
    { id: 4, name: '宮城県' }, { id: 5, name: '秋田県' }, { id: 6, name: '山形県' },
    { id: 7, name: '福島県' }, { id: 8, name: '茨城県' }, { id: 9, name: '栃木県' },
    { id: 10, name: '群馬県' }, { id: 11, name: '埼玉県' }, { id: 12, name: '千葉県' },
    { id: 13, name: '東京都' }, { id: 14, name: '神奈川県' }, { id: 15, name: '新潟県' },
    { id: 16, name: '富山県' }, { id: 17, name: '石川県' }, { id: 18, name: '福井県' },
    { id: 19, name: '山梨県' }, { id: 20, name: '長野県' }, { id: 21, name: '岐阜県' },
    { id: 22, name: '静岡県' }, { id: 23, name: '愛知県' }, { id: 24, name: '三重県' },
    { id: 25, name: '滋賀県' }, { id: 26, name: '京都府' }, { id: 27, name: '大阪府' },
    { id: 28, name: '兵庫県' }, { id: 29, name: '奈良県' }, { id: 30, name: '和歌山県' },
    { id: 31, name: '鳥取県' }, { id: 32, name: '島根県' }, { id: 33, name: '岡山県' },
    { id: 34, name: '広島県' }, { id: 35, name: '山口県' }, { id: 36, name: '徳島県' },
    { id: 37, name: '香川県' }, { id: 38, name: '愛媛県' }, { id: 39, name: '高知県' },
    { id: 40, name: '福岡県' }, { id: 41, name: '佐賀県' }, { id: 42, name: '長崎県' },
    { id: 43, name: '熊本県' }, { id: 44, name: '大分県' }, { id: 45, name: '宮崎県' },
    { id: 46, name: '鹿児島県' }, { id: 47, name: '沖縄県' }
];

export default function ExamImporter() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [saving, setSaving] = useState(false);

    // 手動修正用
    const [editedPrefectureId, setEditedPrefectureId] = useState<number | null>(null);
    const [editedYear, setEditedYear] = useState<number | null>(null);

    const handleFetch = async () => {
        if (!url) {
            setError('URLを入力してください');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/admin/import-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'データ取得に失敗しました');
            }

            setResult(data.data);
            setEditedPrefectureId(data.data.prefecture_id);
            setEditedYear(data.data.year);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result || !editedPrefectureId || !editedYear) {
            setError('都道府県と年度を選択してください');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const examsToInsert = result.exams.map(exam => ({
                prefecture_id: editedPrefectureId,
                year: editedYear,
                category: exam.category,
                name: exam.name,
                date: exam.date,
                result_date: exam.result_date,
                application_start: exam.application_start,
                application_end: exam.application_end
            }));

            const { error: insertError } = await supabase
                .from('official_exams')
                .insert(examsToInsert);

            if (insertError) throw insertError;

            alert(`${examsToInsert.length}件のデータを保存しました`);
            setResult(null);
            setUrl('');
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* URL入力 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-800">URLからデータをインポート</h3>
                <p className="text-sm text-slate-500 mb-4">
                    都道府県の公式サイトURL（PDF/HTML）を入力すると、AIが試験日程を自動で抽出します。
                </p>
                <div className="flex gap-3">
                    <input
                        type="url"
                        placeholder="https://www2.hyogo-c.ed.jp/hpe/uploads/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleFetch}
                        disabled={loading || !url}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition"
                    >
                        {loading ? '解析中...' : 'データ取得'}
                    </button>
                </div>
                {error && (
                    <div className="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        {error}
                    </div>
                )}
            </div>

            {/* 結果プレビュー */}
            {result && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">抽出結果プレビュー</h3>

                    {/* 検出情報の編集 */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                都道府県 <span className="text-slate-400">(自動検出: {result.prefecture})</span>
                            </label>
                            <select
                                value={editedPrefectureId || ''}
                                onChange={(e) => setEditedPrefectureId(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            >
                                <option value="">選択してください</option>
                                {prefectures.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                年度 <span className="text-slate-400">(自動検出: {result.year}年度)</span>
                            </label>
                            <select
                                value={editedYear || ''}
                                onChange={(e) => setEditedYear(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            >
                                {[2025, 2026, 2027, 2028].map(y => (
                                    <option key={y} value={y}>{y}年度</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 試験データテーブル */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">カテゴリ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">試験名</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">試験日</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">合格発表日</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">出願期間</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {result.exams.map((exam, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${exam.category === 'public_general'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {exam.category === 'public_general' ? '一般' : '推薦・特色'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{exam.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{exam.date}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{exam.result_date || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {exam.application_start && exam.application_end
                                                ? `${exam.application_start} 〜 ${exam.application_end}`
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 保存ボタン */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setResult(null)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !editedPrefectureId || !editedYear}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition"
                        >
                            {saving ? '保存中...' : `${result.exams.length}件を一括保存`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
