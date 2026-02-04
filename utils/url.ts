export function getBaseUrl(req: Request): string {
    // 1. Try 'origin' header (standard for CORS/POST)
    const origin = req.headers.get('origin');
    if (origin && origin !== 'null') {
        return origin;
    }

    // 2. Try 'x-forwarded-host' (Vercel / standard proxy)
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    if (host) {
        // Assume https unless explicit protocol provided (or localhost)
        const protocol = req.headers.get('x-forwarded-proto') || 'https';
        return `${protocol}://${host}`;
    }

    // 3. Fallback to env var or hardcoded default
    return process.env.NEXT_PUBLIC_APP_URL || 'https://edulens.jp';
}
