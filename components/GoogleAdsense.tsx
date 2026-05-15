'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_ADSENSE_SLOT, getAdsensePlacementConfig, type AdsenseAdFormat, type AdsensePlacement } from '@/lib/adsense-placements';
import { isNoAdsRoute } from '@/lib/ad-config';

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, never>>;
    }
}

type GoogleAdsenseProps = {
    placement?: AdsensePlacement;
    slot?: string;
    channel?: string;
    client?: string;
    style?: React.CSSProperties;
    format?: AdsenseAdFormat;
    responsive?: 'true' | 'false';
    className?: string;
    layout?: string;
    layoutKey?: string;
    disableRefresh?: boolean;
    reserveSpace?: boolean;
    reserveHeight?: number | string;
};

const GoogleAdsense = ({
    placement,
    slot,
    channel,
    client = "ca-pub-6321932201615449",
    style = { display: 'block' },
    format,
    responsive = 'true',
    className = "mb-4 mx-auto text-center",
    layout,
    layoutKey,
    disableRefresh = false,
    reserveSpace = false,
    reserveHeight = 280,
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
    const placementConfig = getAdsensePlacementConfig(placement);
    const resolvedSlot = slot || placementConfig.slot || DEFAULT_ADSENSE_SLOT;
    const resolvedChannel = channel || placementConfig.channel;
    const resolvedFormat = format || placementConfig.format;

    // パス変更時にフラグをリセットして強制再読込を促す
    useEffect(() => {
        if (disableRefresh) return;
        isAdLoaded.current = false;
    }, [disableRefresh, pathname]);

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
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : '';
                    if ((err instanceof Error && err.name === 'TagError') || message.includes('already have ads')) {
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
    const adKey = `${pathname}-${placement || resolvedSlot}`;
    const containerClassName = `${className}${reserveSpace ? ' ad-slot-reserve' : ''}`;
    const containerStyle = {
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        ...(reserveSpace
            ? { ['--ad-slot-min-height']: typeof reserveHeight === 'number' ? `${reserveHeight}px` : reserveHeight }
            : {}),
    } as React.CSSProperties;

    return (
        <div ref={containerRef} className={containerClassName} style={containerStyle}>
            <ins
                key={adKey}
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={resolvedSlot}
                data-ad-channel={resolvedChannel}
                data-ad-format={resolvedFormat}
                data-full-width-responsive={responsive}
                data-ad-layout={layout}
                data-ad-layout-key={layoutKey}
            />
        </div>
    );
};

export default GoogleAdsense;
