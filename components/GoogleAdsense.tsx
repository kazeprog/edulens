'use client';

import { useEffect } from 'react';
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

    // useEffect must be called before any conditional return (React Hooks rules)
    useEffect(() => {
        // Don't push ads if user is Pro or on login page
        // Also skip if profile is pending (user exists but profile null)
        const isPendingProfile = !!user && !profile;
        if (profile?.is_pro || isPendingProfile || loading) return;
        if (pathname === '/login') return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('Google AdSense error:', err);
        }
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
        <div className={className} style={{ minHeight: style?.minHeight || '280px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <ins
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
