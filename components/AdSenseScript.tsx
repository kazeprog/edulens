'use client';

import Script from 'next/script';
import { useAuth } from '@/context/AuthContext';

export default function AdSenseScript() {
    const { user, profile, loading } = useAuth();

    // 読み込み中、またはProプランユーザーの場合はスクリプトを読み込まない
    // (未ログイン時は広告を表示するため、!user || !profile.is_pro の場合に表示)

    // AuthContextのloading中は判定できないため、念のため表示しない（あるいは表示する？安全性重視なら表示しない）
    // ここでは「ユーザー状態が確定し、かつProでない」または「未ログイン」の場合に表示したいが、
    // useAuthのloadingは初期ロード時にtrueになる。
    // 安全側に倒して「Proであることが確定していない限り表示」だと、一瞬表示されて消えるなどが起きる。
    // 逆に「Proでないことが確定するまで表示しない」だと、一般ユーザーも一瞬広告が出ない。
    // UX的には「Proユーザーに広告を見せない」が最優先なので、
    // loading完了待ち -> Proなら表示しない、そうでなければ表示、とする。

    if (loading) return null;

    const isPro = !!profile?.is_pro;

    if (isPro) {
        return null;
    }

    return (
        <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6321932201615449"
            strategy="afterInteractive"
            crossOrigin="anonymous"
        />
    );
}
