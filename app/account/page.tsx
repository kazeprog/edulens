'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    AlertTriangle,
    CheckCircle2,
    CreditCard,
    Loader2,
    Save,
    Trash2,
    UserRound,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ManageSubscriptionButton from '@/components/ManageSubscriptionButton';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

const gradeOptions = [
    '中1',
    '中2',
    '中3',
    '高1',
    '高2',
    '高3',
    '既卒生',
    '大学生・社会人',
];

export default function AccountPage() {
    const router = useRouter();
    const { user, profile, loading, signOut } = useAuth();
    const [fullName, setFullName] = useState('');
    const [grade, setGrade] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deleting, setDeleting] = useState(false);

    const canDelete = deleteConfirmation.trim() === '退会する' || deleteConfirmation.trim() === '削除する';

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login?redirect=/account');
        }
    }, [loading, router, user]);

    useEffect(() => {
        if (!profile) return;
        setFullName(profile.full_name ?? '');
        setGrade(profile.grade ?? '');
    }, [profile]);

    async function handleSave() {
        setSaving(true);
        setError(null);
        setSaveMessage(null);

        try {
            if (!user) {
                setError('ログインが必要です。');
                return;
            }

            const supabase = getSupabase();

            if (!supabase) {
                setError('Supabaseの初期化に失敗しました。');
                return;
            }

            const { error: saveError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName.trim() || null,
                    grade: grade || null,
                })
                .select('id')
                .single();

            if (saveError) {
                setError(saveError.message || '保存に失敗しました。');
                return;
            }

            window.dispatchEvent(
                new CustomEvent('profile-updated', {
                    detail: {
                        full_name: fullName.trim() || null,
                        grade: grade || null,
                    },
                })
            );
            setSaveMessage('保存しました。');
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : '保存に失敗しました。');
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteAccount() {
        if (!canDelete || deleting) return;

        const agreed = window.confirm(
            'アカウントを削除すると、このアカウントではログインできなくなります。続行しますか。'
        );

        if (!agreed) return;

        setDeleting(true);
        setError(null);

        try {
            const supabase = getSupabase();

            if (!supabase) {
                setError('Supabaseの初期化に失敗しました。');
                return;
            }

            const session = (await supabase.auth.getSession()).data.session;
            const accessToken = session?.access_token;

            if (!accessToken) {
                setError('ログインセッションが見つかりません。もう一度ログインしてください。');
                return;
            }

            const response = await fetch('/api/account/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ confirmation: deleteConfirmation.trim() }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || 'アカウント削除に失敗しました。');
            }

            await signOut();
            window.location.href = '/';
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : 'アカウント削除に失敗しました。');
        } finally {
            setDeleting(false);
        }
    }

    if (loading || (!loading && !user)) {
        return (
            <div className="min-h-screen bg-slate-50">
                <SiteHeader />
                <main className="flex min-h-[60vh] items-center justify-center px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        読み込み中...
                    </div>
                </main>
            </div>
        );
    }

    if (!user) return null;

    const isPro = !!profile?.is_pro;
    const stripeCustomerId = profile?.stripe_customer_id ?? null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <SiteHeader />
            <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-700">EduLens</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">アカウント管理</h1>
                    <p className="mt-2 break-all text-sm text-slate-500">{user.email}</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {saveMessage && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{saveMessage}</span>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                <UserRound className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold">アカウント設定</h2>
                        </div>

                        <div className="grid gap-5">
                            <label className="grid gap-2">
                                <span className="text-sm font-semibold text-slate-700">表示名</span>
                                <input
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="表示名"
                                />
                            </label>

                            <label className="grid gap-2">
                                <span className="text-sm font-semibold text-slate-700">学年/レベル</span>
                                <select
                                    value={grade}
                                    onChange={(event) => setGrade(event.target.value)}
                                    className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">選択してください</option>
                                    {gradeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {saving ? '保存中...' : '設定を保存'}
                            </button>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold">Proプラン</h2>
                                    <p className="text-sm text-slate-500">{isPro ? '契約中' : '未契約'}</p>
                                </div>
                            </div>

                            {isPro && stripeCustomerId ? (
                                <ManageSubscriptionButton
                                    customerId={stripeCustomerId}
                                    returnPath="/account"
                                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                                >
                                    プランを管理・解約
                                </ManageSubscriptionButton>
                            ) : isPro ? (
                                <p className="text-sm leading-6 text-slate-600">
                                    招待特典などでProが有効です。決済中のプランはありません。
                                </p>
                            ) : (
                                <Link
                                    href="/upgrade"
                                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                                >
                                    Proプランを見る
                                </Link>
                            )}
                        </section>

                        <section className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-red-900">アカウント削除</h2>
                                    <p className="text-sm text-red-700">削除後はログインできません。</p>
                                </div>
                            </div>

                            <label className="grid gap-2">
                                <span className="text-sm font-semibold text-slate-700">確認テキスト</span>
                                <input
                                    value={deleteConfirmation}
                                    onChange={(event) => setDeleteConfirmation(event.target.value)}
                                    className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    placeholder="削除する"
                                />
                            </label>

                            <button
                                onClick={handleDeleteAccount}
                                disabled={!canDelete || deleting}
                                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                {deleting ? '削除中...' : 'アカウントを削除'}
                            </button>
                        </section>
                    </aside>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
