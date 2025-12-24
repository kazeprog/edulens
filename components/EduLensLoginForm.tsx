'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface EduLensLoginFormProps {
    initialMode?: 'login' | 'signup';
    redirectUrl?: string;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function EduLensLoginForm({
    initialMode = 'login',
    redirectUrl,
    onClose,
    onSuccess
}: EduLensLoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
    const router = useRouter();

    const supabase = getSupabase();

    async function handleForgotPassword(e: React.FormEvent) {
        e.preventDefault();
        if (!supabase) {
            setError('認証サービスに接続できません');
            return;
        }

        if (!email) {
            setError('メールアドレスを入力してください');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login?mode=reset`,
        });

        setLoading(false);

        if (error) {
            setError('パスワード再設定メールの送信に失敗しました: ' + error.message);
            return;
        }

        setMessage('パスワード再設定用のメールを送信しました。メール内のリンクをクリックして手続きを進めてください。');
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (!supabase) {
            setError('認証サービスに接続できません');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            if (/confirm/i.test(error.message || '')) {
                setError('メールアドレスが未確認です。確認メールをご確認ください。');
                return;
            }
            setError('ログインに失敗しました: ' + error.message);
            return;
        }

        if (onSuccess) {
            onSuccess();
        } else if (redirectUrl) {
            router.push(redirectUrl);
        } else {
            router.push('/');
        }
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        if (!supabase) {
            setError('認証サービスに接続できません');
            return;
        }

        if (!fullName.trim()) {
            setError('お名前を入力してください');
            return;
        }

        if (!grade) {
            setError('学年を選択してください');
            return;
        }

        setLoading(true);
        setError(null);

        // メール認証後のリダイレクト先を設定
        // redirectUrlが指定されている場合は、認証後にそのURLにリダイレクトするようにパラメータを付与
        const emailVerifyRedirect = redirectUrl
            ? `${window.location.origin}/email-verified?redirect=${encodeURIComponent(redirectUrl)}`
            : `${window.location.origin}/email-verified`;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: emailVerifyRedirect,
                data: {
                    full_name: fullName,
                }
            },
        });

        if (error) {
            setLoading(false);
            setError('登録に失敗しました: ' + error.message);
            return;
        }

        // プロフィール作成
        const userId = data.user?.id;
        if (userId) {
            await supabase.from('profiles').upsert({
                id: userId,
                full_name: fullName || null,
                role: 'student',
                grade: grade || null,
            });
        }

        setLoading(false);
        setMessage('確認メールを送信しました。メール内のリンクをクリックしてアカウントを有効化してください。');
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
                {/* ヘッダー */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {mode === 'signup' ? 'EduLensアカウント作成' :
                            mode === 'forgot' ? 'パスワードの再設定' : 'EduLensにログイン'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                        {mode === 'forgot'
                            ? '登録済みのメールアドレスを入力してください'
                            : '1つのアカウントで全てのサービスを利用できます'}
                    </p>
                </div>

                {/* 成功メッセージ */}
                {message && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm text-blue-800">{message}</p>
                    </div>
                )}

                {/* フォーム */}
                {!message && (
                    <form onSubmit={
                        mode === 'signup' ? handleSignup :
                            mode === 'forgot' ? handleForgotPassword :
                                handleLogin
                    }>
                        {mode === 'signup' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        お名前 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        placeholder="山田 太郎"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        学年 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                                    >
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
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                メールアドレス
                            </label>
                            {mode === 'signup' && (
                                <p className="text-[10px] text-orange-600 mb-1 leading-relaxed font-medium">
                                    ※教育機関や学校のメールアドレスは認証メールが届かないことがあります。
                                </p>
                            )}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        {mode !== 'forgot' && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700">
                                        パスワード
                                    </label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            パスワードを忘れた方
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                        >
                            {loading
                                ? (mode === 'signup' ? '登録中...' : mode === 'forgot' ? '送信中...' : 'ログイン中...')
                                : (mode === 'signup' ? 'アカウントを作成' : mode === 'forgot' ? '再設定メールを送信' : 'ログイン')
                            }
                        </button>

                        <div className="mt-6 text-center space-y-3">
                            {(mode === 'login' || mode === 'forgot') && (
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="block w-full text-sm text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    {mode === 'login' ? 'アカウントをお持ちでない方はこちら' : 'ログイン画面に戻る'}
                                </button>
                            )}
                            {mode === 'signup' && (
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="block w-full text-sm text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    すでにアカウントをお持ちの方はこちら
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* 閉じるボタン */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="mt-4 w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        閉じる
                    </button>
                )}
            </div>
        </div>
    );
}
