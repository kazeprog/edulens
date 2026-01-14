"use client";

import { useEffect, useState } from 'react';

/**
 * BotHidden - クライアントサイドでのみレンダリングするコンポーネント
 * サーバーサイドレンダリング時（botがクロールする時）には何も表示されない
 * これにより、検索エンジンのbotからコンテンツを隠すことができる
 */
export default function BotHidden({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // クライアントサイドでマウントされるまで何も表示しない
    // botはJavaScriptを実行しないため、このコンテンツは見えない
    if (!mounted) {
        return null;
    }

    return <>{children}</>;
}
