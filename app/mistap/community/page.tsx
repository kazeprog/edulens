'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/mistap/supabaseClient';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { useRouter } from 'next/navigation';

interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    user_name: string | null;
    likes_count: number;
    parent_id: string | null;
}

// ... imports remain the same

function CommunityContent() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [replyTo, setReplyTo] = useState<string | null>(null); // State for active reply form

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (profile?.full_name) {
            setUserName(profile.full_name);
        } else if (user?.email) {
            setUserName(user.email.split('@')[0]);
        }
    }, [user, profile]);

    async function fetchPosts() {
        if (!supabase) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('mistap_community_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            setPosts(data || []);
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            setError(`読み込みエラー: ${err.message || '不明なエラー'}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent, parentId: string | null = null) {
        e.preventDefault();
        if (!user) {
            router.push('/login?redirect=/mistap/community');
            return;
        }

        const content = parentId ? (e.target as any).replyContent.value : newPostContent;
        if (!content?.trim()) return;

        try {
            setSubmitting(true);
            setError(null);

            const submitName = userName.trim() || profile?.full_name || user.email?.split('@')[0] || '名無しさん';

            const { error } = await supabase
                .from('mistap_community_posts')
                .insert({
                    user_id: user.id,
                    content: content.trim(),
                    user_name: submitName,
                    parent_id: parentId
                });

            if (error) throw error;

            if (parentId) {
                setReplyTo(null);
            } else {
                setNewPostContent('');
            }
            fetchPosts();
        } catch (err: any) {
            setError(err.message || '投稿に失敗しました');
        } finally {
            setSubmitting(false);
        }
    }

    // Helper to organize posts into threads
    const threads = posts.filter(p => !p.parent_id).map(parent => ({
        ...parent,
        replies: posts.filter(p => p.parent_id === parent.id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }));

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Background className="flex-1">
                <div className="max-w-2xl mx-auto w-full px-4 py-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-3xl">💬</span> Mistapコミュニティ
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">
                                Mistapユーザー同士の交流の場です。学習の悩みや成果、要望などを自由に投稿してください。
                            </p>
                        </div>

                        {/* Post Form */}
                        <div className="p-6 bg-gray-50/50">
                            {user ? (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div>
                                        <label htmlFor="user-name" className="block text-xs font-bold text-gray-500 mb-1 ml-1">投稿者名</label>
                                        <input
                                            id="user-name"
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="表示名を入力"
                                            className="w-full p-3 rounded-xl border-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 transition-all text-sm"
                                            maxLength={30}
                                        />
                                    </div>
                                    <textarea
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        placeholder="ここにメッセージを入力..."
                                        className="w-full p-4 rounded-xl border-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 transition-all resize-none min-h-[100px]"
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">
                                            {newPostContent.length}/500文字
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={submitting || !newPostContent.trim()}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-100"
                                        >
                                            {submitting ? '投稿中...' : '投稿する'}
                                        </button>
                                    </div>
                                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                                </form>
                            ) : (
                                <div className="text-center py-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-600 mb-3">投稿するにはログインが必要です</p>
                                    <button
                                        onClick={() => router.push('/login?redirect=/mistap/community')}
                                        className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        ログイン・登録
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Post List */}
                        <div className="divide-y divide-gray-100">
                            {error && (
                                <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}
                            {loading ? (
                                <div className="p-8 text-center text-gray-500 animate-pulse">
                                    読み込み中...
                                </div>
                            ) : threads.length > 0 ? (
                                threads.map((post) => (
                                    <div key={post.id} className="p-6 hover:bg-gray-50/50 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {/* Parent Post */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-red-500 font-bold text-sm">
                                                    {post.user_name?.[0] || 'U'}
                                                </div>
                                                <span className="font-bold text-gray-800 text-sm">
                                                    {post.user_name || '名無しさん'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(post.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed pl-10 mb-3">
                                            {post.content}
                                        </p>

                                        {/* Action Bar */}
                                        <div className="pl-10 flex gap-4 text-sm text-gray-400">
                                            <button
                                                onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                                                className="hover:text-red-500 flex items-center gap-1 transition-colors"
                                            >
                                                ↩ 返信
                                            </button>
                                        </div>

                                        {/* Reply Form */}
                                        {replyTo === post.id && (
                                            <div className="pl-10 mt-3 animate-in slide-in-from-top-2">
                                                <form onSubmit={(e) => handleSubmit(e, post.id)} className="flex gap-2">
                                                    <input
                                                        name="replyContent"
                                                        placeholder="返信を入力..."
                                                        className="flex-1 p-2 bg-white border rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={submitting}
                                                        className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        送信
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {/* Replies */}
                                        {post.replies.length > 0 && (
                                            <div className="pl-10 mt-4 space-y-4">
                                                {post.replies.map(reply => (
                                                    <div key={reply.id} className="bg-gray-100/50 p-4 rounded-xl border-l-2 border-gray-200">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-gray-700 text-xs">
                                                                    {reply.user_name || '名無しさん'}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-400">
                                                                {formatDate(reply.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                                                            {reply.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-400">
                                    <p className="text-4xl mb-2">📭</p>
                                    <p>まだ投稿がありません。<br />一番乗りで投稿してみましょう！</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Background>
            <MistapFooter />
        </div>
    );
}

export default function CommunityPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <CommunityContent />
        </Suspense>
    );
}
