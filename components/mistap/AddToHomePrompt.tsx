"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

export default function AddToHomePrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // detect iOS
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isiOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
    setIsIos(isiOS);

  const dismissed = typeof window !== 'undefined' && window.localStorage.getItem('addToHomeDismissed');
  if (dismissed) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);

    // For iOS, show the banner heuristically if not in standalone mode
    // detect standalone mode via display-mode media query if available
    const isStandalone = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    if (isiOS && !isStandalone && !dismissed) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
    };
  }, []);

  const handleAdd = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        // if accepted or dismissed, hide the banner
        setVisible(false);
        window.localStorage.setItem('addToHomeDismissed', '1');
      } catch (err) {
        console.error('add to home prompt failed', err);
      }
    } else if (isIos) {
      // iOS: show instructions (we keep banner visible so user can dismiss after reading)
      // nothing to programmatically do
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[min(900px,calc(100%-32px))]">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="font-semibold">このサイトをホーム画面に追加できます</div>
          {isIos ? (
            <div className="text-sm text-gray-600">iOSの場合: 共有ボタン（□に上矢印）をタップし、「ホーム画面に追加」を選んでください。</div>
          ) : (
            <div className="text-sm text-gray-600">「ホーム画面に追加」しておくとアプリのように起動できます。ボタンを押すと追加ダイアログを表示します。</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">ホーム画面に追加</button>
          <button onClick={() => { setVisible(false); localStorage.setItem('addToHomeDismissed','1'); }} className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded">閉じる</button>
        </div>
      </div>
    </div>
  );
}
