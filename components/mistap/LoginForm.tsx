'use client';

import { useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { updateLoginStreak } from '@/lib/mistap/loginTracker';
import { useRouter } from 'next/navigation';
import Background from '@/components/mistap/Background';

interface LoginFormProps {
    initialIsSignup?: boolean;
    onClose?: () => void;
}

export default function LoginForm({ initialIsSignup = false }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [isSignup, setIsSignup] = useState(initialIsSignup);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAwaitingConfirmation(false);
        setResendMessage(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            if (/confirm/i.test(error.message || '')) {
                setError('Email not confirmed. Please check your email.');
                setAwaitingConfirmation(true);
                return;
            }
            setError(error.message);
            return;
        }

        if (data?.user?.id) {
            try {
                await updateLoginStreak(data.user.id);
            } catch {
                // Don't block login flow if streak update fails
            }
        }

        router.push('/mistap/home');
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        if (!fullName || !fullName.trim()) {
            setError('表示名を入力してください');
            return;
        }
        if (!grade) {
            setError('学年を選択してください');
            return;
        }
        if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('有効なメールアドレスを入力してください');
            return;
        }
        if (!password) {
            setError('パスワードを入力してください');
            return;
        }

        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/mistap/email-verified` },
        });

        if (error) {
            setLoading(false);
            setError(error.message);
            return;
        }

        const userId = data.user?.id;
        if (userId) {
            await supabase.from('profiles').upsert({
                id: userId,
                full_name: fullName || null,
                role: 'student',
                grade: grade || null,
            }).select();
        }

        setLoading(false);
        setAwaitingConfirmation(true);
    }

    async function resendConfirmation() {
        setResendMessage(null);
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/mistap` },
        });
        setLoading(false);
        if (error) {
            setError('確認メールの再送に失敗しました: ' + error.message);
            return;
        }
        setResendMessage('確認メールを再送しました。メール内のリンクで確認してください。');
    }

    return (
        <div className="min-h-screen">
            <Background className="flex items-start justify-center min-h-screen p-4">
                <div className="bg-white/40 backdrop-blur-lg p-4 md:p-8 rounded-xl shadow-xl relative z-10 border border-white/50 w-full max-w-md md:max-w-lg" style={{ marginTop: 'calc(64px + 48px)' }}>
                    <div className="mb-4 md:mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">{isSignup ? 'EduLensアカウント作成' : 'EduLensにログイン'}</h1>
                        <p className="text-sm text-gray-600 text-center mt-2">1つのアカウントでMistapなど全てのサービスを利用できます</p>
                    </div>
                    <form onSubmit={isSignup ? handleSignup : handleLogin}>
                        {isSignup && (
                            <>
                                <label className="block mb-2 text-gray-700 text-sm md:text-base">表示名</label>
                                <input
                                    className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    placeholder="お名前を入力してください"
                                />

                                <label className="block mb-2 text-gray-700 text-sm md:text-base">学年 <span className="text-red-600">*</span></label>
                                <select className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base" value={grade} onChange={(e) => setGrade(e.target.value)}>
                                    <option value="">選択してください</option>
                                    <option value="中1">中1</option>
                                    <option value="中2">中2</option>
                                    <option value="中3">中3</option>
                                    <option value="高1">高1</option>
                                    <option value="高2">高2</option>
                                    <option value="高3">高3</option>
                                    <option value="既卒生">既卒生</option>
                                    <option value="大学生・社会人">大学生・社会人</option>
                                </select>
                            </>
                        )}
                        <label className="block mb-2 text-gray-700 text-sm md:text-base">メールアドレス</label>
                        <input
                            className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            placeholder="example@email.com"
                        />

                        <label className="block mb-2 text-gray-700 text-sm md:text-base">パスワード</label>
                        <input
                            className="w-full border p-3 md:p-2 rounded-xl mb-4 text-base"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                            placeholder="パスワードを入力してください"
                        />

                        {error && <p className="text-red-600 mb-4 text-sm md:text-base">{error}</p>}
                        {awaitingConfirmation && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-gray-700 mb-2 text-sm md:text-base">登録ありがとうございます。確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。</p>
                                <button type="button" className="text-sm text-red-600 underline hover:text-red-700 block mb-2" onClick={resendConfirmation} disabled={loading}>
                                    確認メールを再送する
                                </button>
                                {resendMessage && <p className="text-sm text-green-600">{resendMessage}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 md:py-2 rounded-xl text-base md:text-base font-semibold"
                            disabled={loading}
                        >
                            {loading
                                ? isSignup
                                    ? '登録中...'
                                    : 'ログイン中...'
                                : isSignup
                                    ? 'EduLensアカウントを作成'
                                    : 'ログイン'}
                        </button>

                        <div className="mt-4 text-center">
                            <button type="button" className="text-sm md:text-sm text-gray-600 underline hover:text-gray-800 p-2" onClick={() => setIsSignup((s) => !s)}>
                                {isSignup ? 'すでにアカウントをお持ちの方はログイン' : '新規登録はこちら'}
                            </button>
                        </div>
                    </form>
                </div>
            </Background>
        </div>
    );
}
