export const NO_ADS_ROUTES_PREFIXES = [
    "/login",
    "/upgrade",         // Proプランアップグレードページ
    "/mistap/textbook", // 教科書・単語帳LP（SEO重視のため広告排除）
    "/admin",           // 管理画面
    // Future routes or other no-ad areas
    "/dashboard",
    "/pricing",
];

/**
 * 指定されたパスが広告を表示すべきでないルートかどうかを判定する
 * @param pathname 現在のパス
 * @returns 広告非表示なら true
 */
export const isNoAdsRoute = (pathname?: string | null): boolean => {
    if (!pathname) return false;
    return NO_ADS_ROUTES_PREFIXES.some(route => pathname.startsWith(route));
};
