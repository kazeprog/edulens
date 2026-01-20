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

    // チェックボックス操作
    const [selectedExams, setSelectedExams] = useState<number[]>([]);

    // 自動検索モード用
    const [mode, setMode] = useState<'direct' | 'auto'>('auto');
    const [searchPrefectureId, setSearchPrefectureId] = useState<number | null>(null);
    const [searchYear, setSearchYear] = useState<number>(2026); // デフォルト翌年度
    const [searching, setSearching] = useState(false);
    const [candidateUrls, setCandidateUrls] = useState<any[]>([]);

    // チェックボックス操作関数
    const toggleExam = (index: number) => {
        setSelectedExams(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleAllExams = () => {
        if (!result) return;
        if (selectedExams.length === result.exams.length) {
            setSelectedExams([]);
        } else {
            setSelectedExams(result.exams.map((_, i) => i));
        }
    };

    // 自動検索処理
    const handleSearchUrls = async () => {
        if (!searchPrefectureId) {
            setError('都道府県を選択してください');
            return;
        }

        setSearching(true);
        setError(null);
        setCandidateUrls([]);

        try {
            const prefectureName = prefectures.find(p => p.id === searchPrefectureId)?.name;
            const response = await fetch('/api/admin/search-exam-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prefecture: prefectureName,
                    year: searchYear
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || '検索に失敗しました');

            setCandidateUrls(data.urls || []);
            if (!data.urls || data.urls.length === 0) {
                setError('URLが見つかりませんでした');
            }
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.message || '検索中にエラーが発生しました');
        } finally {
            setSearching(false);
        }
    };

    const handleSelectUrl = (selectedUrl: string) => {
        setUrl(selectedUrl);
        setMode('direct');
        // 必要に応じてここで自動的にfetchを実行することも可能
    };

    // 既存のデータ取得処理
    const handleFetch = async () => {
        if (!url) {
            setError('URLを入力してください');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setSelectedExams([]);

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
            // デフォルトで全て選択
            setSelectedExams(data.data.exams.map((_: ExtractedExam, i: number) => i));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    // 保存処理
    const handleSave = async () => {
        if (!result || !editedPrefectureId || !editedYear) {
            setError('都道府県と年度を選択してください');
            return;
        }

        if (selectedExams.length === 0) {
            setError('保存する試験を選択してください');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // 選択された試験のみを保存
            const examsToInsert = result.exams
                .filter((_, index) => selectedExams.includes(index))
                .map(exam => ({
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
            setMode('auto'); // 完了したら自動検索モードに戻す
        } catch (err: any) {
            console.error('Save error detailed:', JSON.stringify(err, null, 2));
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
            console.error('Error details:', err.details);
            console.error('Error hint:', err.hint);
            setError(err.message || '保存に失敗しました。RLSポリシーが設定されているか確認してください。');
        } finally {
            setSaving(false);
        }
    };

    // 試験データの変更ハンドラ
    const handleExamChange = (index: number, field: keyof ExtractedExam, value: string) => {
        if (!result) return;

        const newExams = [...result.exams];
        newExams[index] = {
            ...newExams[index],
            [field]: value
        };

        setResult({
            ...result,
            exams: newExams
        });
    };

    return (
        <div className="space-y-6">
            {/* ... (モード切替部分は省略、変更なし) ... */}
            <div className="flex gap-4 border-b border-slate-200 pb-2">
                <button
                    onClick={() => setMode('auto')}
                    className={`pb-2 px-1 text-sm font-medium transition-all ${mode === 'auto'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    🔍 AI 自動検索
                </button>
                <button
                    onClick={() => setMode('direct')}
                    className={`pb-2 px-1 text-sm font-medium transition-all ${mode === 'direct'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    🔗 URL 直接入力
                </button>
            </div>

            {/* AI自動検索モード */}
            {mode === 'auto' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-bold text-lg text-slate-800">都道府県からURLを探す</h3>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">都道府県</label>
                            <select
                                value={searchPrefectureId || ''}
                                onChange={(e) => setSearchPrefectureId(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            >
                                <option value="">選択してください</option>
                                {prefectures.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium text-slate-700 mb-1">対象年度</label>
                            <select
                                value={searchYear}
                                onChange={(e) => setSearchYear(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            >
                                {[2025, 2026, 2027].map(y => (
                                    <option key={y} value={y}>{y}年度</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSearchUrls}
                            disabled={searching || !searchPrefectureId}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition h-[42px]"
                        >
                            {searching ? '検索中...' : 'URLを検索'}
                        </button>
                    </div>

                    {/* 検索結果リスト */}
                    {candidateUrls.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-slate-500 font-medium">見つかったURL候補:</p>
                            {candidateUrls.map((item, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition flex justify-between items-center bg-slate-50/50">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="font-medium text-slate-800 truncate">{item.title}</div>
                                        <div className="text-xs text-slate-500 truncate mb-1" title={item.url}>{item.url}</div>
                                        <div className="text-xs text-slate-600">{item.description}</div>
                                    </div>
                                    <button
                                        onClick={() => handleSelectUrl(item.url)}
                                        className="bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded text-sm hover:bg-blue-50 font-medium whitespace-nowrap"
                                    >
                                        選択して解析
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* URL直接入力 */}
            {mode === 'direct' && (
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
                </div>
            )}

            {/* エラー表示 */}
            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* 結果プレビュー */}
            {result && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-800">抽出結果プレビュー (編集可)</h3>
                        <p className="text-xs text-slate-500">※各セルをクリックして直接編集できます</p>
                    </div>

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
                                    <th className="px-2 py-3 text-center w-10">
                                        <input
                                            type="checkbox"
                                            checked={result.exams.length > 0 && selectedExams.length === result.exams.length}
                                            onChange={toggleAllExams}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase w-32">カテゴリ</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase w-48">試験名</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase w-32">試験日</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase w-32">合格発表日</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase w-32">出願開始日</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase w-32">出願終了日</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {result.exams.map((exam, index) => (
                                    <tr key={index} className={selectedExams.includes(index) ? '' : 'bg-slate-50 opacity-60'}>
                                        <td className="px-2 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedExams.includes(index)}
                                                onChange={() => toggleExam(index)}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <select
                                                value={exam.category}
                                                onChange={(e) => handleExamChange(index, 'category', e.target.value)}
                                                className="w-full text-xs border border-slate-200 rounded px-1 py-1 focus:ring-1 focus:ring-blue-500"
                                                disabled={!selectedExams.includes(index)}
                                            >
                                                <option value="public_general">一般入試 (public_general)</option>
                                                <option value="public_recommendation">推薦・特色 (public_recommendation)</option>
                                            </select>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={exam.name || ''}
                                                onChange={(e) => handleExamChange(index, 'name', e.target.value)}
                                                className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                                disabled={!selectedExams.includes(index)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={exam.date || ''}
                                                onChange={(e) => handleExamChange(index, 'date', e.target.value)}
                                                placeholder="YYYY-MM-DD"
                                                className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                                disabled={!selectedExams.includes(index)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={exam.result_date || ''}
                                                onChange={(e) => handleExamChange(index, 'result_date', e.target.value)}
                                                placeholder="YYYY-MM-DD"
                                                className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                                disabled={!selectedExams.includes(index)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={exam.application_start || ''}
                                                onChange={(e) => handleExamChange(index, 'application_start', e.target.value)}
                                                placeholder="YYYY-MM-DD"
                                                className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                                disabled={!selectedExams.includes(index)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={exam.application_end || ''}
                                                onChange={(e) => handleExamChange(index, 'application_end', e.target.value)}
                                                placeholder="YYYY-MM-DD"
                                                className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                                disabled={!selectedExams.includes(index)}
                                            />
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
                            {saving ? '保存中...' : `${selectedExams.length}件を保存`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
