'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isNoAdsRoute } from '@/lib/ad-config';

export default function AdSenseScript() {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();

    // ... (comments simplified)

    // Proユーザー判定 (loading完了後)
    const isPendingProfile = !!user && !profile;
    const isPro = !!profile?.is_pro;

    // 広告を非表示にする条件:
    // 1. Auth読み込み中
    // 2. プロフィール読み込み中 (ユーザーあり・プロフなし)
    // 3. Proユーザー確定
    // 4. 定義された広告禁止ルート
    const shouldHideAds = loading || isPendingProfile || isPro || isNoAdsRoute(pathname);

    // Proユーザーまたはログインページでは広告を非表示にするCSS
    const hideAdsStyle = shouldHideAds ? (
        <style jsx global>{`
            .adsbygoogle, .google-auto-placed, .ap_container, ins.adsbygoogle {
                display: none !important;
                height: 0 !important;
                max-height: 0 !important;
                overflow: hidden !important;
                visibility: hidden !important;
            }
        `}</style>
    ) : null;

    // 広告を表示すべきユーザーのみスクリプトを読み込む
    const adScript = !shouldHideAds && !loading ? (
        <script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6321932201615449"
            async
            crossOrigin="anonymous"
        />
    ) : null;

    return (
        <>
            {hideAdsStyle}
            {adScript}
        </>
    );
}
