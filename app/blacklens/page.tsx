"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

// ▼▼ Supabase設定 ▼▼
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 日付フォーマット関数（date-fns不要）
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
};

type Post = {
    id: number;
    nickname: string;
    content: string;
    category: string;
    wakaru_count: number;
    yell_count: number;
    created_at: string;
};

// カテゴリ一覧
const CATEGORIES = [
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

export default function BlackLensPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [nickname, setNickname] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("なんでも");
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 初回読み込み
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await supabase
            .from("black_posts")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);
        if (data) setPosts(data);
    };

    // 投稿機能
    const handleSubmit = async () => {
        if (!content.trim()) return;
        setLoading(true);

        const { error } = await supabase.from("black_posts").insert({
            nickname: nickname || "名無し",
            content: content,
            category: category,
        });

        if (!error) {
            setContent("");
            fetchPosts();
        }
        setLoading(false);
    };

    // リアクション機能（わかる・エール）
    const handleReaction = async (id: number, type: "wakaru" | "yell", currentCount: number) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, [type === "wakaru" ? "wakaru_count" : "yell_count"]: currentCount + 1 }
                    : p
            )
        );

        await supabase
            .from("black_posts")
            .update({ [type === "wakaru" ? "wakaru_count" : "yell_count"]: currentCount + 1 })
            .eq("id", id);
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans pb-20">
            {/* --- ヘッダー --- */}
            <header className="w-full py-2 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
                <Link href="/blacklens" className="hover:opacity-80 transition-opacity">
                    <Image
                        src="/BlackLensHeader.png?v=2"
                        alt="Black Lens"
                        width={200}
                        height={60}
                        className="h-10 sm:h-14 w-auto object-contain"
                        style={{ width: 'auto' }}
                        priority
                        unoptimized
                    />
                </Link>
                {/* ハンバーガーメニューボタン */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none p-2 rounded-full hover:bg-gray-800 transition-colors"
                        aria-label="メニュー"
                    >
                        <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>

                    {/* ドロップダウンメニュー */}
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-xl border border-gray-700 z-50 overflow-hidden py-1">
                            <Link
                                href="/"
                                className="block py-3 px-4 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                EduLens トップへ
                            </Link>
                            <div className="border-t border-gray-700 my-1"></div>
                            <Link
                                href="/mistap"
                                className="block py-3 px-4 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Mistap
                            </Link>
                            <Link
                                href="/countdown"
                                className="block py-3 px-4 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                カウントダウン
                            </Link>
                            <Link
                                href="/EduTimer"
                                className="block py-3 px-4 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                EduTimer
                            </Link>
                            <div className="border-t border-gray-700 my-1"></div>
                            <Link
                                href="/contact"
                                className="block py-3 px-4 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                お問い合わせ
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 pt-6 space-y-8">
                {/* --- 投稿フォーム --- */}
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-lg">
                    <input
                        type="text"
                        placeholder="ニックネーム (任意)"
                        className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <textarea
                        rows={3}
                        placeholder="悩みやストレスなど自由にどうぞ"
                        className="w-full bg-gray-800 text-white text-base rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500 resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {/* カテゴリ選択 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${category === cat
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    }`}
                            >
                                #{cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-400 bg-gray-800 px-2 py-1 rounded-full">#{category}</span>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !content}
                            className="bg-white text-black font-bold px-6 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? "投稿中..." : "投稿"}
                        </button>
                    </div>
                </div>

                {/* --- 検索バー --- */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="悩みやキーワードで検索"
                        className="w-full bg-gray-900 border border-gray-800 text-sm rounded-full px-4 py-3 pl-10 focus:outline-none text-gray-300"
                    />
                    <span className="absolute left-3 top-3 text-gray-500">🔍</span>
                </div>

                {/* --- タイムライン --- */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                            {/* カードヘッダー */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-gray-300">{post.nickname}</span>
                                    <span className="text-xs text-purple-400">#{post.category}</span>
                                </div>
                                <span className="text-xs text-gray-600">
                                    {formatDate(post.created_at)}
                                </span>
                            </div>

                            {/* 本文 */}
                            <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap mb-4">
                                {post.content}
                            </p>

                            {/* リアクションボタン */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleReaction(post.id, "wakaru", post.wakaru_count)}
                                    className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full text-xs transition-colors text-gray-400"
                                >
                                    😢 わかる {post.wakaru_count}
                                </button>
                                <button
                                    onClick={() => handleReaction(post.id, "yell", post.yell_count)}
                                    className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full text-xs transition-colors text-gray-400"
                                >
                                    📢 エール {post.yell_count}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
