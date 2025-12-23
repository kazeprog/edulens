'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { joinGroup, getGroupByInviteCode } from '@/lib/mistap/group';
import Background from '@/components/mistap/Background';
import type { Group } from '@/types/group';

interface JoinPageProps {
    params: Promise<{ code: string }>;
}

export default function JoinPage({ params }: JoinPageProps) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [code, setCode] = useState<string | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // フラグで重複処理を防止
    const isJoiningRef = useRef(false);

    // Unwrap params
    useEffect(() => {
        params.then(p => setCode(p.code));
    }, [params]);

    // グループ情報を取得
    useEffect(() => {
        if (!code) return;

        const fetchGroup = async () => {
            setLoading(true);
            try {
                const groupData = await getGroupByInviteCode(code);
                if (groupData) {
                    setGroup(groupData);
                } else {
                    setError('招待リンクが無効です');
                }
            } catch (err) {
                console.error('Failed to fetch group:', err);
                setError('グループ情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [code]);

    // 参加処理を実行する関数
    const performJoin = useCallback(async () => {
        if (!user || !group || isJoiningRef.current) return;

        isJoiningRef.current = true;
        setJoining(true);

        try {
            const result = await joinGroup(user.id, group.invite_code);

            if (result.success) {
                setSuccess(true);
                // ホームにリダイレクト
                setTimeout(() => {
                    router.push('/mistap/home');
                }, 1000);
            } else {
                setError(result.error || '参加に失敗しました');
                setJoining(false);
                isJoiningRef.current = false;
            }
        } catch (err) {
            console.error('Join error:', err);
            setError('参加処理中にエラーが発生しました');
            setJoining(false);
            isJoiningRef.current = false;
        }
    }, [user, group, router]);

    // ログイン済みユーザーの場合、グループ取得後に自動参加
    useEffect(() => {
        if (authLoading) return; // 認証ロード中は待機
        if (!user) return; // ユーザーなし
        if (!group) return; // グループまだ取得中
        if (success || error) return; // 既に完了またはエラー
        if (isJoiningRef.current) return; // 既に処理中

        // 自動参加実行
        performJoin();
    }, [authLoading, user, group, success, error, performJoin]);

    // ログインページへリダイレクト
    const handleLoginRedirect = () => {
        if (!code) return;
        const redirectUrl = encodeURIComponent(`/mistap/join/${code}`);
        router.push(`/login?redirect=${redirectUrl}`);
    };

    // 新規登録ページへリダイレクト
    const handleSignupRedirect = () => {
        if (!code) return;
        const redirectUrl = encodeURIComponent(`/mistap/join/${code}`);
        router.push(`/login?mode=signup&redirect=${redirectUrl}`);
    };

    // ローディング中（認証orグループ取得中）
    if (authLoading || loading || !code) {
        return (
            <Background className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white text-lg">読み込み中...</p>
                </div>
            </Background>
        );
    }

    // エラー表示
    if (error) {
        return (
            <Background className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">エラー</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/mistap')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full"
                    >
                        ホームに戻る
                    </button>
                </div>
            </Background>
        );
    }

    // 参加成功
    if (success) {
        return (
            <Background className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">参加完了！</h1>
                    <p className="text-gray-600 mb-2">
                        <span className="font-semibold text-red-600">{group?.name}</span> に参加しました
                    </p>
                    <p className="text-gray-500 text-sm">ホームに移動しています...</p>
                </div>
            </Background>
        );
    }

    // ログイン済みで参加処理中 OR 参加処理待ち
    if (user && (joining || group)) {
        return (
            <Background className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="relative mx-auto mb-4">
                        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-600 rounded-full animate-spin"></div>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">参加処理中...</h1>
                    <p className="text-gray-600">
                        <span className="font-semibold text-red-600">{group?.name}</span> に参加しています
                    </p>
                </div>
            </Background>
        );
    }

    // 未ログインユーザー向けの招待画面
    return (
        <Background className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">グループへの招待</h1>
                    <p className="text-gray-600">
                        あなたは
                        <span className="font-bold text-red-600 mx-1">{group?.name}</span>
                        に招待されています
                    </p>
                </div>

                {/* アクションボタン */}
                <div className="space-y-3">
                    <button
                        onClick={handleLoginRedirect}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        ログインして参加する
                    </button>
                    <button
                        onClick={handleSignupRedirect}
                        className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 py-4 px-6 rounded-xl font-semibold transition-colors"
                    >
                        新規登録して参加する
                    </button>
                </div>

                {/* 補足説明 */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        アカウントを作成すると、グループメンバーとランキングを確認できます
                    </p>
                </div>
            </div>
        </Background>
    );
}
