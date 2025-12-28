'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { useRouter } from 'next/navigation';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // タイムアウトセーフティ: 5秒でローディング強制解除
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
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
        const { data, error } = await supabase.from('profiles').select('full_name,grade').eq('id', userId).single();
        if (error) {
          // no profile yet
        } else if (mounted) {
          setFullName(data?.full_name ?? '');
          setGrade(data?.grade ?? '');
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

  return (
    <div className="min-h-screen">
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white/40 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-xl w-full max-w-md border border-white/50" style={{ marginTop: 'calc(64px + 48px)' }}>
          <h1 className="text-xl font-bold mb-4">プロフィール編集</h1>
          {loading ? <div>読み込み中…</div> : (
            <div>
              <label className="block text-sm mb-1">表示名</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border p-2 rounded mb-3" />
              <label className="block text-sm mb-1">学年/レベル <span className="text-red-600">*</span></label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full border p-2 rounded mb-3">
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
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div className="flex justify-between">
                <button onClick={() => router.push('/mistap')} className="bg-gray-400 text-white px-4 py-2 rounded">戻る</button>
                <button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">{saving ? '保存中…' : '保存'}</button>
              </div>
            </div>
          )}
        </div>
      </Background>
      <MistapFooter />
    </div>
  );
}