'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type Announcement = {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
};

export default function AnnouncementManagerPage() {
    const [items, setItems] = useState<Announcement[]>([]);
    const [editingItem, setEditingItem] = useState<Partial<Announcement> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            alert('データ取得に失敗しました');
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const { error } = await supabase
                .from('announcements')
                .upsert(editingItem)
                .select();

            if (error) throw error;

            alert('保存しました');
            setEditingItem(null);
            fetchItems();
        } catch (err: unknown) {
            alert(`保存エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('本当に削除しますか？')) return;

        try {
            const { error } = await supabase
                .from('announcements')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (err: unknown) {
            alert(`削除エラー: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">お知らせ管理</h2>

            {/* 編集フォーム */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="font-bold mb-4">{editingItem?.id ? 'お知らせを編集' : '新規お知らせを作成'}</h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">タイトル</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={editingItem?.title || ''}
                            onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">本文</label>
                        <textarea
                            className="w-full border p-2 rounded h-24"
                            value={editingItem?.message || ''}
                            onChange={e => setEditingItem({ ...editingItem, message: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">タイプ</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={editingItem?.type || 'info'}
                                onChange={e => setEditingItem({ ...editingItem, type: e.target.value as any })}
                            >
                                <option value="info">Info (青)</option>
                                <option value="warning">Warning (黄)</option>
                                <option value="success">Success (緑)</option>
                                <option value="error">Error (赤)</option>
                            </select>
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5"
                                    checked={editingItem?.is_active ?? true}
                                    onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                                />
                                <span className="ml-2 font-medium">有効 (表示する)</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">表示開始日時 (任意)</label>
                            <input
                                type="datetime-local"
                                className="w-full border p-2 rounded"
                                value={editingItem?.start_date ? new Date(editingItem.start_date).toISOString().slice(0, 16) : ''}
                                onChange={e => setEditingItem({ ...editingItem, start_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">表示終了日時 (任意)</label>
                            <input
                                type="datetime-local"
                                className="w-full border p-2 rounded"
                                value={editingItem?.end_date ? new Date(editingItem.end_date).toISOString().slice(0, 16) : ''}
                                onChange={e => setEditingItem({ ...editingItem, end_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setEditingItem(null)}
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
                onClick={() => setEditingItem({ is_active: true, type: 'info' })}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
            >
                + 新規作成
            </button>

            {loading ? <p>Loading...</p> : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className={`p-4 rounded border-l-4 shadow-sm bg-white ${!item.is_active ? 'border-slate-300 opacity-60' :
                                item.type === 'warning' ? 'border-yellow-400' :
                                    item.type === 'error' ? 'border-red-500' :
                                        item.type === 'success' ? 'border-green-500' :
                                            'border-blue-500'
                            }`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg">{item.title}</h4>
                                    <p className="text-slate-600 whitespace-pre-wrap">{item.message}</p>
                                    <div className="text-xs text-slate-400 mt-2">
                                        {item.is_active ? 'Active' : 'Inactive'} | Created: {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
