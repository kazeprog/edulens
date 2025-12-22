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

// Supabaseのストレージキーを直接クリアする緊急用関数
function clearSupabaseLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
        // Supabaseが使用するローカルストレージのキーを削除
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('supabase') || key.includes('sb-'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('Cleared Supabase localStorage keys:', keysToRemove);
    } catch (e) {
        console.error('Failed to clear localStorage:', e);
    }
}

// エラーがトークン関連かどうかを判定
function isTokenError(error: unknown): boolean {
    if (!error) return false;

    const errorStr = String(error).toLowerCase();
    const message = (error as { message?: string })?.message?.toLowerCase() || '';
    const code = (error as { code?: string })?.code || '';

    return (
        errorStr.includes('refresh') ||
        errorStr.includes('token') ||
        errorStr.includes('invalid') ||
        errorStr.includes('expired') ||
        errorStr.includes('jwt') ||
        message.includes('refresh') ||
        message.includes('token') ||
        message.includes('invalid') ||
        message.includes('expired') ||
        message.includes('jwt') ||
        code === 'PGRST301' // JWT error
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabase();

        // Supabaseが利用不可の場合は認証をスキップ
        if (!supabase) {
            console.log('Supabase not available, skipping auth');
            setLoading(false);
            return;
        }

        let mounted = true;

        async function getProfile(userId: string): Promise<Profile | null> {
            const supabase = getSupabase();
            if (!supabase || !mounted) return null;

            try {
                const { data: existing, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (!mounted) return null;

                if (error) {
                    // プロフィールが存在しない場合は作成
                    if (error.code === 'PGRST116') {
                        const defaultProfile = { id: userId, full_name: null, role: 'student' };
                        try {
                            await supabase.from('profiles').upsert(defaultProfile, {
                                onConflict: 'id',
                                ignoreDuplicates: true
                            });
                        } catch {
                            // upsert失敗でも続行
                        }
                        return defaultProfile as Profile;
                    }
                    console.error('Profile fetch error:', error);
                    // エラーでもデフォルトプロフィールを返す
                    return { id: userId, full_name: null, role: 'student' } as Profile;
                }

                return existing;
            } catch (error) {
                console.error('Profile fetch exception:', error);
                return { id: userId, full_name: null, role: 'student' } as Profile;
            }
        }

        // セッションをクリアしてログアウト状態にする
        async function clearSessionAndLogout() {
            console.log('Clearing session and setting logged out state');

            // まずSupabaseのsignOutを試みる
            try {
                const supabase = getSupabase();
                if (supabase) {
                    await supabase.auth.signOut({ scope: 'local' });
                }
            } catch (signOutError) {
                console.log('signOut failed, clearing localStorage directly:', signOutError);
            }

            // ローカルストレージを直接クリア（バックアップ）
            clearSupabaseLocalStorage();

            if (mounted) {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        }

        // 初期セッション取得（シンプル化：リトライなし）
        async function fetchSession() {
            console.log('Fetching session...');

            try {
                const { data: { session }, error } = await supabase!.auth.getSession();

                if (!mounted) return;

                if (error) {
                    console.error('Session fetch error:', error);

                    // トークン関連エラーの場合はセッションをクリア
                    if (isTokenError(error)) {
                        console.log('Token error detected, clearing session');
                        await clearSessionAndLogout();
                        return;
                    }

                    // その他のエラーでもログアウト状態にする（安全策）
                    await clearSessionAndLogout();
                    return;
                }

                if (session?.user) {
                    console.log('Session found for user:', session.user.id);
                    setUser(session.user);
                    const profile = await getProfile(session.user.id);
                    if (mounted) {
                        setProfile(profile);
                        setLoading(false);
                    }
                } else {
                    console.log('No session found');
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Session fetch exception:', error);

                if (!mounted) return;

                // 例外の場合もセッションをクリア
                await clearSessionAndLogout();
            }
        }

        fetchSession();

        // セーフティネット: 5秒後には必ずローディングを解除
        const safetyTimeout = setTimeout(() => {
            if (mounted) {
                setLoading(prev => {
                    if (prev) {
                        console.warn('Auth check timed out after 5s. Forcing loading to false and clearing session.');
                        // タイムアウト時は安全のためセッションもクリア
                        clearSupabaseLocalStorage();
                        setUser(null);
                        setProfile(null);
                        return false;
                    }
                    return prev;
                });
            }
        }, 5000);

        // 認証状態の変更監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            console.log('Auth state change:', event, session?.user?.id);

            // トークンリフレッシュ失敗
            if (event === 'TOKEN_REFRESHED' && !session) {
                console.log('Token refresh failed in onAuthStateChange');
                await clearSessionAndLogout();
                return;
            }

            // SIGNED_OUT イベント
            if (event === 'SIGNED_OUT') {
                console.log('User signed out');
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                setUser(session.user);
                const profile = await getProfile(session.user.id);
                if (mounted) {
                    setProfile(profile);
                }
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
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
            window.removeEventListener('profile-updated', onProfileUpdated as EventListener);
        };
    }, []);

    const signOut = async () => {
        console.log('signOut called');

        // まず状態をクリア（UIを即座に更新）
        setUser(null);
        setProfile(null);

        try {
            const supabase = getSupabase();
            if (supabase) {
                await supabase.auth.signOut();
            }
        } catch (error) {
            console.error('Sign out error:', error);
        }

        // ローカルストレージを直接クリア（確実にログアウト）
        clearSupabaseLocalStorage();

        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
