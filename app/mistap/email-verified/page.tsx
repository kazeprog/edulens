'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/mistap/supabaseClient';

function EmailVerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // リダイレクト先を取得
  const redirectUrl = searchParams.get('redirect');

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

  // リダイレクト先が指定されている場合はカウントダウン後に自動リダイレクト
  useEffect(() => {
    if (!redirectUrl || loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl, loading]);

  // カウントダウンが0になったらリダイレクト
  useEffect(() => {
    if (countdown === 0 && redirectUrl) {
      router.push(redirectUrl);
    }
  }, [countdown, router, redirectUrl]);

  // リダイレクト先の表示名を生成
  const getRedirectLabel = () => {
    if (redirectUrl?.includes('/mistap/join/')) {
      return 'グループ参加ページへ';
    } else if (redirectUrl?.includes('/mistap')) {
      return 'Mistapホームへ';
    } else {
      return 'テスト作成へ';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">メール認証が完了しました</h1>
        <p className="text-gray-700 mb-6">
          ご登録いただいたメールアドレスの確認が完了しました。
        </p>

        {loading ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : (
          <>
            {userEmail && (
              <p className="text-gray-800 mb-4">{userEmail} でログインしています。</p>
            )}

            {redirectUrl ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {countdown > 0 ? `${countdown}秒後に${getRedirectLabel()}移動します...` : 'リダイレクト中...'}
                </p>
                <Link
                  href={redirectUrl}
                  className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  今すぐ{getRedirectLabel()}
                </Link>
              </>
            ) : (
              <div className="flex gap-3 justify-center">
                {userEmail ? (
                  <Link href="/mistap/test-setup" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">テスト作成へ</Link>
                ) : (
                  <Link href="/mistap?login=1" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">ログインしてテスト作成</Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    }>
      <EmailVerifiedContent />
    </Suspense>
  );
}
