"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function MistapProtected({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // ハイドレーション不一致を防ぐため、マウントされるまで何もレンダリングしない、
    // またはローディング中は表示しない
    if (!mounted || loading) {
        return null;
    }

    return <>{children}</>;
}
