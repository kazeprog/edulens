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

        // 粘り強いプロフィール取得（チューニング版：1.5秒 x 4回）
        async function fetchProfileWithRetry(userId: string, retries = 4): Promise<Profile | null> {
            const supabase = getSupabase();
            if (!supabase || !mounted) return null;

            for (let i = 0; i < retries; i++) {
                try {
                    // 1. 通常の取得
                    const fetchPromise = supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();

                    // 2. 1.5秒で次へ行くためのタイマー（スマホ最適化）
                    const timeoutPromise = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 1500)
                    );

                    // 3. 競争
                    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

                    if (!mounted) return null;

                    if (error) {
                        // プロフィール未作成(PGRST116)なら作成して終了
                        if (error.code === 'PGRST116') {
                            const defaultProfile = { id: userId, full_name: null, role: 'student' };
                            try {
                                await supabase.from('profiles').upsert(defaultProfile, {
                                    onConflict: 'id',
                                    ignoreDuplicates: true
                                });
                            } catch {
                                // ignore upsert error
                            }
                            return defaultProfile as Profile;
                        }
                        throw error;
                    }

                    // 成功したら即リターン！
                    return data;

                } catch (err) {
                    // 最後の1回もダメだったらnullを返す（偽データは返さない）
                    if (i === retries - 1) {
                        return null;
                    }
                    // 少し待ってから再トライ（0.5秒）
                    await new Promise(r => setTimeout(r, 500));
                }
            }
            return null;
        }

        // 初期セッション確認
        async function initSession() {
            try {
                // ★最重要修正：セッション確認にも「2秒のタイムアウト」を設ける
                // これによりログアウト後やエラーURLでのフリーズを防止
                const sessionPromise = supabase!.auth.getSession();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Session check timeout')), 2000)
                );

                let session = null;
                try {
                    // 競争：2秒待ってダメなら諦めて未ログインとする
                    const { data } = await Promise.race([sessionPromise, timeoutPromise]) as any;
                    session = data?.session;
                } catch (e) {
                    console.warn('Session check timed out:', e);
                    // タイムアウト時はセッションなしとして処理続行
                }

                if (!mounted) return;

                if (session?.user) {
                    setUser(session.user);

                    // プロフィール取得（リトライ付き）
                    const profileData = await fetchProfileWithRetry(session.user.id);

                    if (mounted) {
                        setProfile(profileData);
                    }
                } else {
                    setUser(null);
                    setProfile(null);
                }
            } catch (err) {
                console.warn('Init session critical error:', err);
                if (mounted) {
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                // ★最強の安全装置
                // 成功・失敗・タイムアウト、何があっても必ずローディングを終わらせる
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        initSession();

        // 状態変更監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                // ユーザーが変わった場合のみ更新
                setUser(prev => prev?.id === session.user.id ? prev : session.user);

                // プロフィールがない場合のみ裏で取得
                setProfile(prev => {
                    if (!prev) {
                        fetchProfileWithRetry(session.user.id).then(data => {
                            if (mounted && data) setProfile(data);
                        });
                    }
                    return prev;
                });
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
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}