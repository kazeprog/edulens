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
            if (!supabase) return;

            try {
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (!existing) {
                    await supabase.from('profiles').insert({
                        id: userId,
                        full_name: null,
                        role: 'student',
                    });

                    if (mounted) {
                        setProfile({ id: userId, full_name: null, role: 'student' });
                    }
                } else {
                    if (mounted) {
                        setProfile(existing);
                    }
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
            }
        }

        // タイムアウト処理（5秒でローディング強制解除）
        const timeout = setTimeout(() => {
            if (mounted) {
                console.warn('Auth session check timed out');
                setLoading(false);
            }
        }, 5000);

        // 初期セッション取得
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                if (mounted) {
                    if (session?.user) {
                        setUser(session.user);
                        getProfile(session.user.id);
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                    setLoading(false);
                    clearTimeout(timeout);
                }
            })
            .catch((error) => {
                console.error('Session fetch error:', error);
                if (mounted) {
                    setLoading(false);
                    clearTimeout(timeout);
                }
            });

        // 認証状態の変更監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted) {
                // トークンエラーの場合はログアウト状態にする
                if (event === 'TOKEN_REFRESHED' && !session) {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                if (session?.user) {
                    setUser(session.user);
                    await getProfile(session.user.id);
                } else {
                    setUser(null);
                    setProfile(null);
                }
                setLoading(false);
            }
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
            clearTimeout(timeout);
            subscription.unsubscribe();
            window.removeEventListener('profile-updated', onProfileUpdated as EventListener);
        };
    }, []);

    const signOut = async () => {
        const supabase = getSupabase();
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
