'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdSenseScript() {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();

    // 読み込み中、またはProプランユーザーの場合はスクリプトを読み込まない
    // (未ログイン時は広告を表示するため、!user || !profile.is_pro の場合に表示)

    // AuthContextのloading中は判定できないため、念のため表示しない（あるいは表示する？安全性重視なら表示しない）
    // ここでは「ユーザー状態が確定し、かつProでない」または「未ログイン」の場合に表示したいが、
    // useAuthのloadingは初期ロード時にtrueになる。
    // 安全側に倒して「Proであることが確定していない限り表示」だと、一瞬表示されて消えるなどが起きる。
    // 逆に「Proでないことが確定するまで表示しない」だと、一般ユーザーも一瞬広告が出ない。
    // UX的には「Proユーザーに広告を見せない」が最優先なので、
    // loading完了待ち -> Proなら表示しない、そうでなければ表示、とする。

    // Proユーザー判定 (loading完了後)
    // 注意: AuthContextのloadingがfalseになっても、profile取得が非同期で遅れる場合がある(onAuthStateChange直後など)。
    // そのため、「ユーザーはいるがプロフィールがない」状態も「判定中」として扱い、広告を出さない安全側に倒す。
    const isPendingProfile = !!user && !profile;
    const isPro = !!profile?.is_pro;

    const isLoginPage = pathname === '/login';

    // 広告を非表示にする条件:
    // 1. Auth読み込み中
    // 2. プロフィール読み込み中 (ユーザーあり・プロフなし)
    // 3. Proユーザー確定
    // 4. ログインページ
    const shouldHideAds = loading || isPendingProfile || isPro || isLoginPage;

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
        <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6321932201615449"
            strategy="afterInteractive"
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
