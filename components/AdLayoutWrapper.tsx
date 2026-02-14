'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import GoogleAdsense from '@/components/GoogleAdsense';


import { useAuth } from '@/context/AuthContext';
import { isNoAdsRoute } from '@/lib/ad-config';

export default function AdLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, profile, loading } = useAuth();
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

    // Proユーザー判定 (loading完了後)
    // ユーザーがいるがプロフィール未取得の場合も、安全のためPro扱い(広告非表示)とする
    const isPendingProfile = !!user && !profile;
    const isPro = (!loading && !!profile?.is_pro) || isPendingProfile;

    const isNoAdPage = isNoAdsRoute(pathname) || isPro;

    return (
        <div className="flex flex-col min-h-screen">
            {/* 上部広告 (横長) - アップグレードページでは非表示 */}
            {!isNoAdPage && (
                <GoogleAdsense
                    slot="9969163744"
                    format="auto"
                    style={{ display: 'block', width: '100%', textAlign: 'center' }}
                    className="mx-auto text-center"
                    key={`${pathname}-top`}
                />
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
