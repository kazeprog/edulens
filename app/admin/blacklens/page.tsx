'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

type Post = {
    id: number;
    nickname: string;
    content: string;
    category: string;
    wakaru_count: number;
    yell_count: number;
    created_at: string;
};

export default function BlackLensManagerPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const CATEGORIES = [
        "all",
        "なんでも",
        "勉強・受験",
        "人間関係",
        "進路・将来",
        "家族",
        "恋愛",
        "学校",
        "部活",
        "モヤモヤ",
    ];

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('black_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error(error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('この投稿を削除しますか？')) return;

        setDeleting(id);
        try {
            const { error } = await supabase
                .from('black_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setPosts(posts.filter(p => p.id !== id));
        } catch {
            alert('削除に失敗しました');
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const h = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${y}/${m}/${d} ${h}:${min}`;
    };

    // フィルタリング
    const filteredPosts = posts.filter(post => {
        const matchesSearch = searchQuery === '' ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.nickname.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">BlackLens 投稿管理</h2>
                <span className="text-sm text-slate-500">{filteredPosts.length} / {posts.length} 件</span>
            </div>

            {/* フィルター */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">検索</label>
                        <input
                            type="text"
                            placeholder="ニックネームや内容で検索..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">カテゴリ</label>
                        <select
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'すべて' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={fetchPosts}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            🔄 更新
                        </button>
                    </div>
                </div>
            </div>

            {/* 投稿一覧 */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
                    投稿がありません
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-slate-800">{post.nickname}</span>
                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                            #{post.category}
                                        </span>
                                        <span className="text-xs text-slate-400">{formatDate(post.created_at)}</span>
                                    </div>
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                        <span>😢 わかる {post.wakaru_count}</span>
                                        <span>📢 エール {post.yell_count}</span>
                                        <span className="text-slate-300">ID: {post.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deleting === post.id}
                                    className="flex-shrink-0 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                >
                                    {deleting === post.id ? '...' : '削除'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
