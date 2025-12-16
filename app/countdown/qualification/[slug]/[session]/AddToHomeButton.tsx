'use client';

import React, { useEffect, useState } from 'react';

export default function AddToHomeButton() {
  const [isClient, setIsClient] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'pc' | null>(null);

  useEffect(() => {
    setIsClient(true);

    // デバイスタイプの判定
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua);
    
    if (isAndroid) {
      setDeviceType('android');
    } else if (isIOS) {
      setDeviceType('ios');
    } else {
      setDeviceType('pc');
    }

    // PWA インストール可能かどうかをチェック (Android/PC Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS or already installed
      if (deviceType === 'ios') {
        alert('iOSでは、Safariの共有ボタン（□↑）から「ホーム画面に追加」を選択してください。');
      } else {
        alert('このアプリは既にインストール済みか、ブラウザがPWAをサポートしていません。');
      }
      return;
    }

    // Android/PC Chrome: インストールプロンプトを表示
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isClient) {
    return null; // SSR時は何も表示しない
  }

  return (
    <div className="w-full max-w-xs">
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm w-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>ホーム画面に追加</span>
      </button>
      {deviceType === 'ios' && (
        <p className="text-xs text-slate-400 text-center mt-2">
          iOSでは、Safariの共有ボタン（□↑）から「ホーム画面に追加」を選択してください
        </p>
      )}
    </div>
  );
}
