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

        async function getProfile(userId: string, retryCount = 0) {
            const supabase = getSupabase();
            if (!supabase || !mounted) return;

            try {
                const { data: existing, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (!mounted) return;

                if (error) throw error;

                if (!existing) {
                    try {
                        // DBトリガーがない場合のフォールバック（ベストエフォート）
                        await supabase.from('profiles').insert({
                            id: userId,
                            full_name: null,
                            role: 'student',
                        });
                        if (mounted) {
                            setProfile({ id: userId, full_name: null, role: 'student' });
                        }
                    } catch (ignore) {
                        // 既に作成されている場合などは無視
                    }
                } else {
                    setProfile(existing);
                }
            } catch (error) {
                console.error(`Profile fetch error (attempt ${retryCount + 1}):`, error);
                if (retryCount < 2 && mounted) {
                    setTimeout(() => getProfile(userId, retryCount + 1), 2000);
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
                        getProfile(session.user.id);
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
                    const delay = Math.min(1000 * Math.pow(2, nextRetry), 5000); // 指数バックオフ

                    if (nextRetry < 5) {
                        setTimeout(() => fetchSession(nextRetry), delay);
                    } else {
                        console.warn('Session fetch failed multiple times. Relying on auth state change listener.');
                        // 最終的に失敗しても、loadingは維持するか、あるいはユーザーにエラー表示などが必要だが
                        // ここでは「勝手にログアウト」を防ぐため、onAuthStateChangeイベントの発火を待つ方針
                    }
                }
            }
        };

        fetchSession();

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
