'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';

type Profile = {
    id: string;
    full_name: string | null;
    role: string | null;
    grade?: string | null;
    selected_textbook?: string | null;
    start_date?: string | null;
    test_count?: number;
    daily_goal?: number;
    last_login_at?: string | null;
    consecutive_login_days?: number;
};

type AuthContextType = {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabase();

        // Supabaseが利用不可の場合は認証をスキップ
        if (!supabase) {
            setLoading(false);
            return;
        }

        let mounted = true;

        async function getProfile(userId: string) {
            const supabase = getSupabase();
            if (!supabase || !mounted) return;

            let retryCount = 0;
            const maxRetries = 2;

            while (retryCount <= maxRetries && mounted) {
                try {
                    const { data: existing, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();

                    if (!mounted) return;

                    let profileData = existing;

                    // エラーハンドリング
                    if (error) {
                        // PGRST116（データなし）の場合も、即座に諦めずにリトライする（RLSやタイミングの問題の可能性）
                        // ただし、リトライ最後回でこれなら「本当にない」とみなす
                        if (error.code === 'PGRST116') {
                            if (retryCount < maxRetries) {
                                console.log(`Profile not found (attempt ${retryCount + 1}), retrying...`);
                                throw error; // catchブロックへ飛ばしてリトライさせる
                            }
                            // リトライしきったらデータなしとして扱う
                            profileData = null;
                        } else {
                            throw error; // その他のエラーはリトライまたはthrow
                        }
                    } else {
                        profileData = existing;
                    }

                    if (!profileData) {
                        console.log('Profile finding failed or empty, attempting upsert/fetch...');
                        try {
                            // DBトリガーがない場合のフォールバック（ベストエフォート）
                            // 既に作成されている場合もあるので、Conflict時は無視
                            await supabase.from('profiles').upsert({
                                id: userId,
                                full_name: null,
                                role: 'student',
                            }, { onConflict: 'id', ignoreDuplicates: true });

                            // Upsert後、もう一度取得を試みる（既存だった場合、データを取り直すため）
                            const { data: recheck } = await supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', userId)
                                .single();

                            if (mounted) {
                                if (recheck) {
                                    console.log('Profile fetched after upsert:', recheck);
                                    setProfile(recheck);
                                } else {
                                    // それでも取れない場合は、とりあえず初期値をセット
                                    console.warn('Profile still missing after upsert, setting default.');
                                    setProfile({ id: userId, full_name: null, role: 'student' });
                                }
                            }
                        } catch (ignore) {
                            console.warn('Upsert failed:', ignore);
                        }
                    } else {
                        // console.log('Profile found:', profileData);
                        setProfile(profileData);
                    }
                    // 成功したらループを抜ける
                    return;

                } catch (error) {
                    console.error(`Profile fetch error (attempt ${retryCount + 1}):`, error);
                    retryCount++;
                    if (retryCount <= maxRetries && mounted) {
                        // 2秒待機
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        }

        // 初期セッション取得
        const fetchSession = async (retryCount = 0) => {
            try {
                const { data: { session }, error } = await supabase!.auth.getSession();

                if (error) {
                    throw error;
                }

                if (mounted) {
                    if (session?.user) {
                        setUser(session.user);
                        await getProfile(session.user.id);
                    } else {
                        // 正常に「セッションなし」が返ってきた場合のみ、未ログインとして確定
                        setUser(null);
                        setProfile(null);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error(`Session fetch error (attempt ${retryCount + 1}):`, error);

                // エラー時はローディング状態を解除せず、リトライする
                // 3回失敗しても、onAuthStateChange が解決してくれることを期待して
                // ここでは loading: false にしない（安易なログアウト判定を防ぐ）
                if (mounted) {
                    const nextRetry = retryCount + 1;
                    // 初回ロード時はユーザーを待たせすぎないようにリトライ回数と間隔を短く調整
                    // LocalStorageからの読み込みであれば基本即時のはず。失敗＝ネットワークor設定ミス
                    const delay = Math.min(500 * Math.pow(1.5, nextRetry), 2000);

                    if (nextRetry < 3) {
                        setTimeout(() => fetchSession(nextRetry), delay);
                    } else {
                        console.warn('Session fetch failed multiple times. Defaulting to logged out state.');
                        // 何度（5回）リトライしてもダメな場合は、これ以上待たせるとUIが固まるため
                        // 「ゲスト（未ログイン）」として判定を下す
                        if (mounted) {
                            setUser(null);
                            setProfile(null);
                            setLoading(false);
                        }
                    }
                }
            }
        };

        fetchSession();

        // セーフティネット: 万が一、非同期処理がハングした場合でも7秒後には強制的にローディングを解除する
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth check timed out. Forcing loading to false.');
                setLoading(false);
            }
        }, 7000);

        // 認証状態の変更監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (session?.user) {
                setUser(session.user);
                await getProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            // 状態変化でローディング完了
            setLoading(false);
        });

        // プロフィール更新イベントの監視
        function onProfileUpdated(e: CustomEvent) {
            if (mounted) {
                setProfile(prev => prev ? { ...prev, full_name: e.detail?.full_name ?? prev.full_name } : null);
            }
        }
        window.addEventListener('profile-updated', onProfileUpdated as EventListener);

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
            window.removeEventListener('profile-updated', onProfileUpdated as EventListener);
        };
    }, []);

    const signOut = async () => {
        setLoading(true); // 処理中はローディングにする（ガード用）
        try {
            const supabase = getSupabase();
            if (supabase) {
                await supabase.auth.signOut();
            }
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            setUser(null);
            setProfile(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
