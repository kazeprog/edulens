'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isNoAdsRoute } from '@/lib/ad-config';

export default function AdSenseScript() {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();

    // Proユーザー判定 (loading完了後)
    const isPendingProfile = !!user && !profile;
    const isPro = !!profile?.is_pro;

    // 広告を非表示にする条件（CSSでの隠蔽用）
    const shouldHideAds = loading || isPendingProfile || isPro || isNoAdsRoute(pathname);

    // Proユーザーまたはログインページでは広告を非表示にするCSS
    // note: コンポーネント自体を return null することに加え、
    // Google純正の自動広告（アンカー広告など）も隠すためにCSSを併用します。
    const hideAdsStyle = shouldHideAds ? (
        <style jsx global>{`
            .adsbygoogle, .google-auto-placed, .ap_container, ins.adsbygoogle,
            iframe[id^="google_ads_iframe"], iframe[name^="google_ads_iframe"],
            .google-revocation-link-placeholder {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
        `}</style>
    ) : null;

    return (
        <>
            {hideAdsStyle}
            {!shouldHideAds && (
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6321932201615449"
                    crossOrigin="anonymous"
                />
            )}
        </>
    );
}
