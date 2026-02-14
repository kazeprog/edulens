'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isNoAdsRoute } from '@/lib/ad-config';

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
    layout?: string;
    layoutKey?: string;
    disableRefresh?: boolean;
};

const GoogleAdsense = ({
    slot = "9969163744",
    client = "ca-pub-6321932201615449",
    style = { display: 'block' },
    format = 'auto',
    responsive = 'true',
    className = "mb-4 mx-auto text-center",
    layout,
    layoutKey,
    disableRefresh = false,
}: GoogleAdsenseProps) => {
    const pathname = usePathname();
    const { user, profile, loading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const adRef = useRef<HTMLModElement>(null);
    const isAdLoaded = useRef(false);

    // 広告表示可否の判定
    const isPendingProfile = !!user && !profile;
    const isPro = (!loading && !!profile?.is_pro) || isPendingProfile;
    const isNoAdPage = isNoAdsRoute(pathname) || isPro;

    // パス変更時にフラグをリセットして強制再読込を促す
    useEffect(() => {
        isAdLoaded.current = false;
    }, [pathname]);

    useEffect(() => {
        if (isNoAdPage || loading) return;

        // 既に広告がロードされている場合はスキップ
        if (isAdLoaded.current) return;

        // ins要素が既に広告を持っているかチェック
        if (adRef.current && adRef.current.getAttribute('data-adsbygoogle-status')) {
            isAdLoaded.current = true;
            return;
        }

        let attempts = 0;
        const maxAttempts = 50;
        let timerId: NodeJS.Timeout;

        const checkAndPush = () => {
            if (!containerRef.current || isAdLoaded.current || isNoAdPage) return;

            if (adRef.current && adRef.current.getAttribute('data-adsbygoogle-status')) {
                isAdLoaded.current = true;
                return;
            }

            const width = containerRef.current.offsetWidth;
            if (width > 0) {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    isAdLoaded.current = true;
                    // console.log('Ad pushed successfully');
                } catch (err: any) {
                    const message = err?.message || '';
                    if (err?.name === 'TagError' || message.includes('already have ads')) {
                        isAdLoaded.current = true;
                        return;
                    }
                    console.error('Google AdSense error:', err);
                }
            } else if (attempts < maxAttempts) {
                attempts++;
                timerId = setTimeout(checkAndPush, 100);
            }
        };

        timerId = setTimeout(checkAndPush, 100);

        return () => clearTimeout(timerId);
    }, [pathname, isNoAdPage, loading]);

    // 条件に合致する場合は完全にアンマウントする
    if (!loading && isNoAdPage) {
        return null;
    }

    // keyにpathnameを含めることで、再レンダリング時にDOM要素を強制的に新しくする
    const adKey = `${pathname}`;

    return (
        <div ref={containerRef} className={className} style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <ins
                key={adKey}
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-ad-layout={layout}
                data-ad-layout-key={layoutKey}
            />
        </div>
    );
};

export default GoogleAdsense;
