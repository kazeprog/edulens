'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { useRouter } from 'next/navigation';

type Banner = {
    id: string;
    slug: string;
    position: 'countdown_bottom' | 'share_bottom';
    content: string;
    is_active: boolean;
    created_at: string;
};

type SelectOption = {
    value: string;
    label: string;
    group: string;
};

export default function AffiliateManagementPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [slugOptions, setSlugOptions] = useState<SelectOption[]>([]);

    // Form states
    const [formSlugs, setFormSlugs] = useState<string[]>([]);
    const [formPosition, setFormPosition] = useState<'countdown_bottom' | 'share_bottom'>('countdown_bottom');
    const [formContent, setFormContent] = useState('');
    const [formIsActive, setFormIsActive] = useState(true);

    useEffect(() => {
        fetchBanners();
        fetchSlugOptions();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('affiliate_banners')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching banners:', error);
            alert('バナーの取得に失敗しました');
        } else {
            setBanners(data || []);
        }
        setLoading(false);
    };

    const fetchSlugOptions = async () => {
        try {
            // 1. 都道府県 (High School)
            const { data: prefs } = await supabase.from('prefectures').select('slug, name');

            // 2. 大学イベント (University)
            const { data: uniEvents } = await supabase.from('university_events').select('slug, name');
            // ユニークなイベントのみ抽出 (slugベース)
            const uniqueUniEvents = Array.from(new Map((uniEvents || []).map(item => [item.slug, item])).values());

            // 3. 資格試験 (Exam Schedules)
            const { data: exams } = await supabase.from('exam_schedules').select('slug, exam_name');
            const uniqueExams = Array.from(new Map((exams || []).map(item => [item.slug, item])).values());

            const options: SelectOption[] = [];

            // 固定/その他
            const staticOptions = [
                { value: 'patent-attorney', label: '弁理士 (Patent Attorney)', group: '資格・その他' },
                { value: 'eiken', label: '英検', group: '資格・その他' },
                { value: 'toeic', label: 'TOEIC', group: '資格・その他' },
                { value: 'toefl', label: 'TOEFL', group: '資格・その他' },
            ];
            options.push(...staticOptions);

            if (prefs) {
                options.push(...prefs.map(p => ({ value: p.slug, label: p.name, group: '高校入試 (都道府県)' })));
            }

            if (uniqueUniEvents) {
                options.push(...uniqueUniEvents.map(u => ({ value: u.slug, label: u.name, group: '大学入試' })));
            }

            if (uniqueExams) {
                // staticOptionsと被らないようにフィルタリング
                const staticSlugs = new Set(staticOptions.map(o => o.value));
                const filteredExams = uniqueExams.filter(e => !staticSlugs.has(e.slug));
                options.push(...filteredExams.map(e => ({ value: e.slug, label: e.exam_name, group: '資格・その他' })));
            }

            setSlugOptions(options);

        } catch (error) {
            console.error('Error fetching slug options:', error);
        }
    };

    const handleOpenModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormSlugs([banner.slug]);
            setFormPosition(banner.position);
            setFormContent(banner.content);
            setFormIsActive(banner.is_active);
        } else {
            setEditingBanner(null);
            setFormSlugs([]);
            setFormPosition('countdown_bottom');
            setFormContent('');
            setFormIsActive(true);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formSlugs.length === 0 || !formContent) {
            alert('Slugとバナー内容は必須です');
            return;
        }

        try {
            if (editingBanner) {
                // 編集モード：既存IDに対し単一更新 (フォーム上はsingle selection)
                const payload = {
                    slug: formSlugs[0],
                    position: formPosition,
                    content: formContent,
                    is_active: formIsActive,
                    updated_at: new Date().toISOString(),
                };

                const { error } = await supabase
                    .from('affiliate_banners')
                    .update(payload)
                    .eq('id', editingBanner.id);

                if (error) throw error;
            } else {
                // 新規作成モード：選択されたSlugごとにInsert
                const payloads = formSlugs.map(slug => ({
                    slug: slug,
                    position: formPosition,
                    content: formContent,
                    is_active: formIsActive,
                }));

                const { error } = await supabase
                    .from('affiliate_banners')
                    .insert(payloads);

                if (error) throw error;
            }

            handleCloseModal();
            fetchBanners();
        } catch (error: any) {
            console.error('Error saving banner:', error.message || error);
            alert(`保存に失敗しました: ${error.message || '不明なエラー'}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return;

        try {
            const { error } = await supabase
                .from('affiliate_banners')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('削除に失敗しました');
        }
    };

    // グループごとにオプションをレンダリングするためのヘルパー
    const renderSlugOptions = () => {
        const groups: { [key: string]: SelectOption[] } = {};
        slugOptions.forEach(opt => {
            if (!groups[opt.group]) groups[opt.group] = [];
            groups[opt.group].push(opt);
        });

        return Object.entries(groups).map(([groupName, opts]) => (
            <optgroup key={groupName} label={groupName}>
                {opts.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                    </option>
                ))}
            </optgroup>
        ));
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">アフィリエイトバナー管理</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    新規作成
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-medium text-slate-500">Slug</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Position</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Content Preview</th>
                                <th className="px-4 py-3 font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">{banner.slug}</td>
                                    <td className="px-4 py-3 text-slate-600">{banner.position}</td>
                                    <td className="px-4 py-3">
                                        {banner.is_active ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={banner.content}>
                                        {banner.content}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleOpenModal(banner)}
                                            className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {banners.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                        バナーが登録されていません
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingBanner ? 'バナーを編集' : '新規バナー作成'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Slug {editingBanner ? '(編集時は単一選択)' : '(複数選択可)'}
                                    </label>
                                    {!editingBanner && (
                                        <p className="text-xs text-blue-600 mb-2">
                                            ※ PC: Ctrl(Windows)/Command(Mac)を押しながらクリックで複数選択。<br />
                                            ※ モバイル: 長押し等で複数選択可能な場合がありますがPC推奨。
                                        </p>
                                    )}
                                    <select
                                        multiple={!editingBanner} // 編集時は単一選択
                                        value={formSlugs}
                                        onChange={(e) => {
                                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

                                            if (editingBanner) {
                                                // multiple=falseのselectの場合、e.target.valueで単一値が取れるが、
                                                // multiple={!editingBanner} なんで editingBanner が true なら multiple=false
                                                setFormSlugs([e.target.value]);
                                            } else {
                                                // multiple=trueの場合
                                                setFormSlugs(selectedOptions);
                                            }
                                        }}
                                        className={`w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm ${!editingBanner ? 'h-64' : ''}`}
                                        required
                                    >
                                        {!editingBanner && <option value="" disabled>-- 複数選択可能です --</option>}
                                        {renderSlugOptions()}
                                    </select>
                                    <p className="text-xs text-slate-500 mt-1">※リストにない場合は直接手入力できません（DB要確認）</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                                    <select
                                        value={formPosition}
                                        onChange={(e) => setFormPosition(e.target.value as any)}
                                        className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                    >
                                        <option value="countdown_bottom">Countdown Bottom (詳細ページ下部)</option>
                                        <option value="share_bottom">Share Bottom (シェアボタン下)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">HTML Content</label>
                                <textarea
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    className="w-full h-32 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm font-mono text-xs"
                                    placeholder="<a href='...'><img src='...' /></a>"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">アフィリエイトタグ（HTML）をそのまま貼り付けてください。</p>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formIsActive}
                                    onChange={(e) => setFormIsActive(e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm text-slate-700">有効にする (Active)</label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-sm transition"
                                >
                                    {editingBanner ? '更新する' : `作成する (選択数: ${formSlugs.length})`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
