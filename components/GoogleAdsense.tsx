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
    const { profile, loading } = useAuth();

    // useEffect must be called before any conditional return (React Hooks rules)
    useEffect(() => {
        // Don't push ads if user is Pro
        if (profile?.is_pro) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('Google AdSense error:', err);
        }
    }, [pathname, profile?.is_pro]);

    // Proユーザーの場合は何も表示しない
    if (!loading && profile?.is_pro) {
        return null;
    }

    return (
        <div className={className} style={{ minHeight: style?.minHeight || '280px', width: '100%' }}>
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
