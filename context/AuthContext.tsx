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

        // 粘り強いプロフィール取得（スマホの「詰まり」対策）
        async function fetchProfileWithRetry(userId: string, retries = 3): Promise<Profile | null> {
            const supabase = getSupabase();
            if (!supabase || !mounted) return null;

            const defaultProfile = { id: userId, full_name: null, role: 'student' } as Profile;

            for (let i = 0; i < retries; i++) {
                try {
                    // 1. 通常の取得
                    const fetchPromise = supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();

                    // 2. 2秒で次へ行くためのタイマー（スマホは早めに見切るのがコツ）
                    const timeoutPromise = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 2000)
                    );

                    // 3. 競争
                    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

                    if (!mounted) return null;

                    if (error) {
                        // プロフィール未作成(PGRST116)なら作成して終了
                        if (error.code === 'PGRST116') {
                            try {
                                await supabase.from('profiles').upsert(defaultProfile, {
                                    onConflict: 'id',
                                    ignoreDuplicates: true
                                });
                            } catch {
                                // ignore upsert error
                            }
                            return defaultProfile;
                        }
                        throw error;
                    }

                    // 成功したら即リターン！
                    return data;

                } catch (err) {
                    console.warn(`Profile fetch attempt ${i + 1} failed or timed out. Retrying...`, err);
                    // 最後の1回もダメだったら諦める
                    if (i === retries - 1) {
                        console.warn('All profile fetch attempts failed, using default profile');
                        return defaultProfile;
                    }

                    // 少し待ってから再トライ（0.5秒）
                    await new Promise(r => setTimeout(r, 500));
                }
            }
            return defaultProfile;
        }

        // fetchProfileのラッパー（状態セット用）
        async function fetchProfile(userId: string) {
            const profile = await fetchProfileWithRetry(userId);
            if (mounted && profile) {
                setProfile(profile);
            }
        }

        // 初期セッション確認
        async function initSession() {
            try {
                const { data: { session } } = await supabase!.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                } else {
                    setUser(null);
                    setProfile(null);
                }
            } catch (err) {
                console.warn('getSession error:', err);
                // エラーでもログアウトしない、単にnullにする
                if (mounted) {
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        initSession();

        // 状態変更監視（Supabase標準のイベントのみに依存）
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
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
        const supabase = getSupabase();
        if (supabase) {
            await supabase.auth.signOut();
        }
        // onAuthStateChange の SIGNED_OUT イベントで状態がクリアされる
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
