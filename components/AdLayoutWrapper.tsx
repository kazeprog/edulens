'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import GoogleAdsense from '@/components/GoogleAdsense';


import { useAuth } from '@/context/AuthContext';

export default function AdLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { profile, loading } = useAuth();
    const [isMobile, setIsMobile] = useState(true); // デフォルトはモバイル（SSR対策）

    useEffect(() => {
        // デバイス判定（768px以下をモバイルとする）
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // アップグレードページ、またはProユーザーの場合は広告非表示
    const isPro = !loading && !!profile?.is_pro;
    const isNoAdPage = pathname === '/upgrade' || pathname?.startsWith('/upgrade/') || isPro;

    return (
        <div className="flex flex-col min-h-screen">
            {/* 上部広告 (横長) - アップグレードページでは非表示 */}
            {!isNoAdPage && (
                <div className="w-full flex justify-center my-4">
                    <GoogleAdsense
                        slot="9969163744"
                        format="auto"
                        style={{ display: 'block', minHeight: '100px', width: '100%', maxWidth: '1280px' }}
                        key={`${pathname}-top`}
                    />
                </div>
            )}

            {/* メインコンテンツ - モバイルで広告がある場合のみ下部に余白を追加 */}
            <div className={`flex-grow ${!isNoAdPage && isMobile ? 'pb-28' : ''}`}>
                {children}
            </div>

            {/* スティッキーフッター広告 - モバイルのみ表示（PCでは非表示） */
            /* 廃止: Google純正アンカー広告に移行するため削除
               !isNoAdPage && isMobile && <StickyFooterAd key={`${pathname}-footer`} />
            */}
        </div>
    );
}
