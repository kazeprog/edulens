'use client';

import React, { useState, useEffect } from 'react';
import GoogleAdsense from './GoogleAdsense';
import { useAuth } from '@/context/AuthContext';

export default function StickyFooterAd() {
    const [isVisible, setIsVisible] = useState(true);
    const [isAndroid, setIsAndroid] = useState(false);
    const { profile, loading } = useAuth();

    useEffect(() => {
        // OS判定 (マウント後のみ実行)
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        setIsAndroid(/android/i.test(userAgent));
    }, []);

    // Proユーザー、または非表示状態の場合は表示しない
    if (!isVisible || (!loading && profile?.is_pro)) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
            style={{
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
            }}
        >
            {/* 閉じるボタン */}
            <button
                onClick={() => setIsVisible(false)}
                className={`absolute -top-7 ${isAndroid ? 'left-0 rounded-tr-lg' : 'right-0 rounded-tl-lg'} bg-gray-200 text-gray-500 px-3 py-1 text-xs font-bold hover:bg-gray-300 transition-colors z-50 shadow-sm`}
                aria-label="広告を閉じる"
            >
                × 閉じる
            </button>

            {/* 広告エリア */}
            <div className="flex justify-center items-center w-full bg-white" style={{ minHeight: '60px' }}>
                <GoogleAdsense
                    slot="9969163744"
                    style={{ display: 'block', width: '100%', maxWidth: '100%', minHeight: '60px', maxHeight: '200px' }}
                    format="auto"
                    responsive="true"
                />
            </div>
        </div>
    );
}
