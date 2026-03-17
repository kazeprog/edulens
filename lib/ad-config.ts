export const NO_ADS_ROUTES_PREFIXES = [
    "/login",
    "/upgrade",
    "/upgrademistap",
    "/mistap/textbook",
    "/admin",
    "/dashboard",
    "/pricing",
];

export const NO_ADS_ROUTES_EXACT = [
    "/mistap",
    "/",
];

/**
 * Returns true when ads should not be displayed on the current pathname.
 */
export const isNoAdsRoute = (pathname?: string | null): boolean => {
    if (!pathname) return false;

    if (NO_ADS_ROUTES_EXACT.includes(pathname)) {
        return true;
    }

    return NO_ADS_ROUTES_PREFIXES.some((route) => pathname.startsWith(route));
};
