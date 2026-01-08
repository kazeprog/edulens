'use client';

import { useState } from 'react';

interface UpgradeButtonProps {
    userId: string;
}

export default function UpgradeButton({ userId }: UpgradeButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    returnUrl: window.location.href, // キャンセル時に戻るためのURL
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('決済ページのURLが取得できませんでした。');
            }
        } catch (error) {
            console.error('Upgrade failed:', error);
            alert('アップグレード処理中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleUpgrade}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'cursor-wait' : ''
                }`}
        >
            {loading ? '処理中...' : 'Proプランにアップグレード (月額500円)'}
        </button>
    );
}
