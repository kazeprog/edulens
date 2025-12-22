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
            const maxRetries = 1; // リトライは1回のみ（合計2回試行）

            while (retryCount <= maxRetries && mounted) {
                try {
                    const { data: existing, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();

                    if (!mounted) return;

                    // エラーハンドリング
                    if (error) {
                        // PGRST116（データなし）の場合は即座にupsertへ進む（リトライしない）
                        if (error.code === 'PGRST116') {
                            // プロフィールが存在しない→作成を試みる
                            try {
                                await supabase.from('profiles').upsert({
                                    id: userId,
                                    full_name: null,
                                    role: 'student',
                                }, { onConflict: 'id', ignoreDuplicates: true });

                                const { data: recheck } = await supabase
                                    .from('profiles')
                                    .select('*')
                                    .eq('id', userId)
                                    .single();

                                if (mounted) {
                                    setProfile(recheck || { id: userId, full_name: null, role: 'student' });
                                }
                            } catch {
                                if (mounted) {
                                    setProfile({ id: userId, full_name: null, role: 'student' });
                                }
                            }
                            return;
                        }
                        // その他のエラーはリトライ
                        throw error;
                    }

                    // 取得成功
                    if (mounted) {
                        setProfile(existing);
                    }
                    return;

                } catch (error) {
                    console.error(`Profile fetch error (attempt ${retryCount + 1}):`, error);
                    retryCount++;
                    if (retryCount <= maxRetries && mounted) {
                        // 300ms待機（高速化）
                        await new Promise(resolve => setTimeout(resolve, 300));
                    } else if (mounted) {
                        // リトライ失敗→デフォルト値をセット
                        setProfile({ id: userId, full_name: null, role: 'student' });
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
                        // 正常に「セッションなし」が返ってきた場合
                        // quickSessionCheckで仮セットしたuserをクリア
                        setUser(null);
                        setProfile(null);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error(`Session fetch error (attempt ${retryCount + 1}):`, error);

                // エラー時はローディング状態を解除せず、リトライする
                if (mounted) {
                    const nextRetry = retryCount + 1;
                    // リトライ間隔を短縮（200ms〜1秒）
                    const delay = Math.min(200 * Math.pow(1.5, nextRetry), 1000);

                    if (nextRetry < 3) {
                        setTimeout(() => fetchSession(nextRetry), delay);
                    } else {
                        console.warn('Session fetch failed multiple times. Defaulting to logged out state.');
                        if (mounted) {
                            // セッション取得失敗→ログアウト状態にする
                            setUser(null);
                            setProfile(null);
                            setLoading(false);
                        }
                    }
                }
            }
        };

        fetchSession();

        // セーフティネット: 3秒後には強制的にローディングを解除する（7秒から短縮）
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth check timed out. Forcing loading to false.');
                setLoading(false);
            }
        }, 3000);

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
