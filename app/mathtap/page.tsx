'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// シンプルにセットアップページへリダイレクト、またはLP的な内容を表示
export default function MathtapPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/mathtap/test-setup');
    }, [router]);

    return <div className="min-h-screen bg-navy-50" />;
}
