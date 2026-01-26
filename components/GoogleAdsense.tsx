'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

type GoogleAdsenseProps = {
    slot?: string;
    client?: string;
    style?: React.CSSProperties;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: 'true' | 'false';
    className?: string;
};

import { useAuth } from '@/context/AuthContext';

const GoogleAdsense = ({
    slot = "9969163744",
    client = "ca-pub-6321932201615449",
    style = { display: 'block', minHeight: '280px' },
    format = 'auto',
    responsive = 'true',
    className = "mb-4",
}: GoogleAdsenseProps) => {
    const pathname = usePathname();
    const { user, profile, loading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const adRef = useRef<HTMLModElement>(null);
    const isAdLoaded = useRef(false);


    // useEffect must be called before any conditional return (React Hooks rules)
    useEffect(() => {
        // Don't push ads if user is Pro or on login page
        // Also skip if profile is pending (user exists but profile null)
        const isPendingProfile = !!user && !profile;
        if (profile?.is_pro || isPendingProfile || loading) return;
        if (pathname === '/login') return;

        // 既に広告がロードされている場合はスキップ
        if (isAdLoaded.current) return;

        // ins要素が既に広告を持っているかチェック
        if (adRef.current && adRef.current.getAttribute('data-adsbygoogle-status')) {
            isAdLoaded.current = true;
            return;
        }

        // DOMが完全にレンダリングされ、幅が確保されるまでポーリングする
        // リトライ回数制限：50回 (100ms * 50 = 5秒)
        let attempts = 0;
        const maxAttempts = 50;
        let timerId: NodeJS.Timeout;

        const checkAndPush = () => {
            // コンポーネントがアンマウントされている、または既にロード済みの場合は終了
            if (!containerRef.current || isAdLoaded.current) return;

            const width = containerRef.current.offsetWidth;
            if (width > 0) {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    isAdLoaded.current = true;
                } catch (err) {
                    console.error('Google AdSense error:', err);
                }
            } else if (attempts < maxAttempts) {
                // 幅が0の場合はリトライ
                attempts++;
                timerId = setTimeout(checkAndPush, 100);
            }
        };

        // 初回実行
        timerId = setTimeout(checkAndPush, 100);

        return () => clearTimeout(timerId);
    }, [pathname, profile?.is_pro, loading, user, profile]);

    // Proユーザーまたはログイン/新規登録画面では広告を表示しない
    // プロフィール未取得(isPendingProfile)の場合も表示しない
    const isPendingProfile = !!user && !profile;
    if (!loading && (profile?.is_pro || isPendingProfile)) {
        return null;
    }

    // ログイン/新規登録画面では広告を表示しない
    if (pathname === '/login') {
        return null;
    }

    return (
        <div ref={containerRef} className={className} style={{ minHeight: style?.minHeight || '280px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};

export default GoogleAdsense;
