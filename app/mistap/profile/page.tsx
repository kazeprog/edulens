'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { useRouter } from 'next/navigation';
import { Building2, Link2, Loader2, Unlink } from 'lucide-react';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';

type LinkedSchool = {
  school_id: string;
  school_name: string;
  school_code: string;
  joined_at: string;
};

function normalizeSchoolCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
}

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [linkedSchool, setLinkedSchool] = useState<LinkedSchool | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [joiningSchool, setJoiningSchool] = useState(false);
  const [leavingSchool, setLeavingSchool] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolMessage, setSchoolMessage] = useState<string | null>(null);
  const [schoolError, setSchoolError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // タイムアウトセーフティ: 5秒でローディング強制解除
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Profile page loading timeout');
        setLoading(false);
        setError('データの読み込みがタイムアウトしました。再読み込みしてください。');
      }
    }, 5000);

    async function load() {
      setLoading(true);
      try {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Auth error:', authError);
          if (mounted) setError('認証エラー: ' + authError.message);
          return;
        }
        const userId = userData?.user?.id ?? null;
        if (!userId) {
          if (mounted) setError('ログインが必要です');
          return;
        }
        const [profileResult, schoolResult] = await Promise.all([
          supabase.from('profiles').select('full_name,grade').eq('id', userId).single(),
          supabase.rpc('get_my_mistap_school').maybeSingle(),
        ]);

        if (profileResult.error) {
          // no profile yet
        } else if (mounted) {
          setFullName(profileResult.data?.full_name ?? '');
          setGrade(profileResult.data?.grade ?? '');
        }

        if (!schoolResult.error && schoolResult.data && mounted) {
          const school = schoolResult.data as LinkedSchool;
          setLinkedSchool(school);
          setSchoolCode(school.school_code ?? '');
        }
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
        clearTimeout(safetyTimeout);
      }
    }

    load();
    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;
      if (!userId) {
        setError('未ログインです');
        return;
      }

      const payload = { id: userId, full_name: fullName || null, grade: grade || null };
      const { error } = await supabase.from('profiles').upsert(payload).select();
      if (error) {
        console.error('Supabase upsert error:', error);
        const msg = error.message ?? '保存に失敗しました';
        const details = error.details ? `\n詳細: ${error.details}` : '';
        // If the table is missing in the PostgREST schema cache, provide actionable guidance
        if (msg.includes("Could not find the table") || msg.includes('schema cache')) {
          setError(msg + details + '\n\n対処: SupabaseのSQLエディタで `sql/001_create_profiles.sql` を実行するか、プロジェクトの設定からスキーマのリフレッシュ／プロジェクト再起動を行ってください。');
        } else {
          setError(msg + details);
        }
      } else {
        // Notify other parts of the app that the profile changed so header can update immediately
        try {
          const ev = new CustomEvent('profile-updated', { detail: { full_name: fullName, grade } });
          window.dispatchEvent(ev);
        } catch {
          // ignore in older browsers
        }
        router.back();
      }
    } catch (e: unknown) {
      console.error('save profile error', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleJoinSchool() {
    setJoiningSchool(true);
    setSchoolError(null);
    setSchoolMessage(null);

    try {
      const normalizedCode = normalizeSchoolCode(schoolCode);
      if (!normalizedCode) {
        setSchoolError('塾IDを入力してください。');
        return;
      }
      if (!/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{4}$/.test(normalizedCode)) {
        setSchoolError('塾IDは英字と数字を含む4桁で入力してください。');
        return;
      }

      const { data, error } = await supabase
        .rpc('join_mistap_school_by_code', { p_school_code: normalizedCode })
        .maybeSingle();

      if (error) {
        setSchoolError(error.message || '塾IDの連携に失敗しました。');
        return;
      }

      if (data) {
        const school = data as LinkedSchool;
        setLinkedSchool(school);
        setSchoolCode(school.school_code);
        setSchoolMessage('塾IDを連携しました。');
      }
    } catch (joinError) {
      setSchoolError(joinError instanceof Error ? joinError.message : '塾IDの連携に失敗しました。');
    } finally {
      setJoiningSchool(false);
    }
  }

  async function handleLeaveSchool() {
    if (!linkedSchool || leavingSchool) return;

    const agreed = window.confirm('塾IDの連携を解除しますか。');
    if (!agreed) return;

    setLeavingSchool(true);
    setSchoolError(null);
    setSchoolMessage(null);

    try {
      const { error } = await supabase.rpc('leave_mistap_school');

      if (error) {
        setSchoolError(error.message || '連携解除に失敗しました。');
        return;
      }

      setLinkedSchool(null);
      setSchoolCode('');
      setSchoolMessage('塾IDの連携を解除しました。');
    } catch (leaveError) {
      setSchoolError(leaveError instanceof Error ? leaveError.message : '連携解除に失敗しました。');
    } finally {
      setLeavingSchool(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white/80 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl border border-white/60" style={{ marginTop: 'calc(64px + 48px)' }}>
          <h1 className="text-xl font-bold mb-4">プロフィール編集</h1>
          {loading ? <div>読み込み中…</div> : (
            <div className="space-y-6">
              <section>
                <label className="block text-sm font-semibold text-slate-700 mb-1">表示名</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg mb-3 bg-white" />
                <label className="block text-sm font-semibold text-slate-700 mb-1">学年/レベル <span className="text-red-600">*</span></label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg bg-white">
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
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">塾ID連携</h2>
                    <p className="text-sm text-slate-500">連携中はMistapの学習履歴が塾の管理画面に表示されます。</p>
                  </div>
                </div>

                {linkedSchool && (
                  <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    <div className="font-bold">{linkedSchool.school_name}</div>
                    <div className="mt-1 font-mono text-xs">ID: {linkedSchool.school_code}</div>
                  </div>
                )}

                <label className="block text-sm font-semibold text-slate-700 mb-1">塾ID</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={schoolCode}
                    onChange={(event) => setSchoolCode(normalizeSchoolCode(event.target.value))}
                    className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 font-mono text-base uppercase outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    placeholder="例: A1B2"
                    maxLength={4}
                  />
                  <button
                    onClick={handleJoinSchool}
                    disabled={joiningSchool}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {joiningSchool ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    {linkedSchool ? '変更' : '連携'}
                  </button>
                </div>

                {linkedSchool && (
                  <button
                    onClick={handleLeaveSchool}
                    disabled={leavingSchool}
                    className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                  >
                    {leavingSchool ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlink className="h-4 w-4" />}
                    連携解除
                  </button>
                )}

                {schoolMessage && <div className="mt-3 text-sm font-medium text-emerald-700">{schoolMessage}</div>}
                {schoolError && <div className="mt-3 text-sm font-medium text-red-600">{schoolError}</div>}
              </section>

              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div className="flex justify-between gap-3">
                <button onClick={() => router.push('/mistap')} className="rounded-lg bg-gray-400 px-4 py-2 text-white">戻る</button>
                <button onClick={handleSave} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60">{saving ? '保存中…' : '保存'}</button>
              </div>
            </div>
          )}
        </div>
      </Background>
      <MistapFooter />
    </div>
  );
}
