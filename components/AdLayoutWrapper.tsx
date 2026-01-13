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

    return (
        <div className="flex flex-col min-h-screen">
            {/* 上部広告 (横長) */}
            <div className="w-full flex justify-center my-4">
                <GoogleAdsense
                    slot="9969163744"
                    format="auto"
                    style={{ display: 'block', minHeight: '100px', width: '100%', maxWidth: '1000px' }}
                    key={`${pathname}-top`}
                />
            </div>

            {/* メインコンテンツ */}
            <div className="flex-grow">
                {children}
            </div>

            {/* 下部広告 (レクタングル/デフォルト) */}
            <div className="w-full flex justify-center my-4 pb-28">
                <GoogleAdsense
                    slot="9969163744"
                    key={`${pathname}-bottom`}
                />
            </div>

            <StickyFooterAd key={`${pathname}-footer`} />
        </div>
    );
}
