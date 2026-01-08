'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

interface ManageSubscriptionButtonProps {
    customerId: string;
}

export default function ManageSubscriptionButton({ customerId }: ManageSubscriptionButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePortal = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create portal session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('管理ページのURLが取得できませんでした。');
            }
        } catch (error) {
            console.error('Portal redirect failed:', error);
            alert('管理ページへの遷移中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePortal}
            disabled={loading}
            className={`w-full text-left flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-slate-500 ${loading ? 'opacity-50 cursor-wait' : ''
                }`}
        >
            <Settings className="w-4 h-4 mr-2" />
            {loading ? '読み込み中...' : 'プランの管理・解約'}
        </button>
    );
}
