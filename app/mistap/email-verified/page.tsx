'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/mistap/supabaseClient';

export default function EmailVerifiedPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const email = data?.user?.email ?? null;
        if (mounted) setUserEmail(email);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">メール認証が完了しました</h1>
        <p className="text-gray-700 mb-6">
          ご登録いただいたメールアドレスの確認が完了しました。
        </p>

        {loading ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : (
          <>
            {userEmail ? (
              <>
                <p className="text-gray-800 mb-4">{userEmail} でログインしています。</p>
                <div className="flex gap-3 justify-center">
                  {/* If already logged in, show direct link to test creation */}
                  <Link href="/mistap/test-setup" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">テスト作成へ</Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">ログインして単語テストを実施しましょう！</p>
                <div className="flex gap-3 justify-center">
                  {/* Login button that redirects to home and opens the login modal via ?login=1 */}
                  <Link href="/mistap?login=1" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">ログインしてテスト作成</Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
