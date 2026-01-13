'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import GoogleAdsense from '@/components/GoogleAdsense';
import StickyFooterAd from '@/components/StickyFooterAd';

export default function AdLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isNoAdPage = pathname === '/upgrade' || pathname?.startsWith('/upgrade/');

    return (
        <div className="flex flex-col min-h-screen">
            {/* 上部広告 (横長) - アップグレードページでは非表示 */}
            {!isNoAdPage && (
                <div className="w-full flex justify-center my-4">
                    <GoogleAdsense
                        slot="9969163744"
                        format="auto"
                        style={{ display: 'block', minHeight: '100px', width: '100%', maxWidth: '1000px' }}
                        key={`${pathname}-top`}
                    />
                </div>
            )}

            {/* メインコンテンツ - 広告がある場合は下部に余白を追加 */}
            <div className={`flex-grow ${!isNoAdPage ? 'pb-28' : ''}`}>
                {children}
            </div>

            {!isNoAdPage && <StickyFooterAd key={`${pathname}-footer`} />}
        </div>
    );
}
