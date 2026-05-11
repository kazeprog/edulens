'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isNoAdsRoute } from '@/lib/ad-config';

const GOOGLE_AD_SELECTORS = [
    '.adsbygoogle',
    '.google-auto-placed',
    '.adsbygoogle-noablate',
    '.ap_container',
    'ins.adsbygoogle',
    'iframe[id^="google_ads_iframe"]',
    'iframe[name^="google_ads_iframe"]',
    'iframe[id^="aswift_"]',
    'iframe[name^="aswift_"]',
    'iframe[src*="googlesyndication.com"]',
    'iframe[src*="doubleclick.net"]',
    '[id^="google_ads_iframe"][id$="__container__"]',
    '[id^="aswift_"][id$="_host"]',
    '#google_esf',
    '.google-revocation-link-placeholder',
].join(', ');

const GOOGLE_AUTO_AD_SELECTORS = [
    '.google-auto-placed',
    '.adsbygoogle-noablate',
    '.ap_container',
    '[id^="google_ads_iframe"][id$="__container__"]',
    '[id^="aswift_"][id$="_host"]',
].join(', ');

export default function AdSenseScript() {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();

    // Proユーザー判定 (loading完了後)
    const isPendingProfile = !!user && !profile;
    const isPro = !!profile?.is_pro;

    // 広告を非表示にする条件（CSSでの隠蔽用）
    const shouldHideAds = loading || isPendingProfile || isPro || isNoAdsRoute(pathname);

    useEffect(() => {
        if (!shouldHideAds) return;

        const hideAds = () => {
            document.documentElement.dataset.adMode = 'pro';

            document.querySelectorAll(GOOGLE_AD_SELECTORS).forEach((element) => {
                if (!(element instanceof HTMLElement)) return;

                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('width', '0', 'important');
                element.style.setProperty('height', '0', 'important');
                element.style.setProperty('min-height', '0', 'important');
                element.style.setProperty('overflow', 'hidden', 'important');
                element.style.setProperty('visibility', 'hidden', 'important');
                element.style.setProperty('pointer-events', 'none', 'important');
            });

            document.querySelectorAll(GOOGLE_AUTO_AD_SELECTORS).forEach((element) => {
                element.remove();
            });
        };

        hideAds();

        const observer = new MutationObserver(hideAds);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        const intervalId = window.setInterval(hideAds, 1000);

        return () => {
            observer.disconnect();
            window.clearInterval(intervalId);
        };
    }, [shouldHideAds]);

    // Proユーザーまたはログインページでは広告を非表示にするCSS
    // note: コンポーネント自体を return null することに加え、
    // Google純正の自動広告（アンカー広告など）も隠すためにCSSを併用します。
    const hideAdsStyle = shouldHideAds ? (
        <style jsx global>{`
            .adsbygoogle, .google-auto-placed, .ap_container, ins.adsbygoogle,
            .adsbygoogle-noablate,
            iframe[id^="google_ads_iframe"], iframe[name^="google_ads_iframe"],
            iframe[id^="aswift_"], iframe[name^="aswift_"],
            iframe[src*="googlesyndication.com"], iframe[src*="doubleclick.net"],
            [id^="google_ads_iframe"][id$="__container__"],
            [id^="aswift_"][id$="_host"],
            #google_esf,
            .google-revocation-link-placeholder {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                min-height: 0 !important;
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
