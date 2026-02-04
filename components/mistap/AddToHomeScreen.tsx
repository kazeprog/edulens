'use client';

import { useState, useEffect } from 'react';

export default function AddToHomeScreen() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isInStandaloneMode = () => {
            return (window.matchMedia('(display-mode: standalone)').matches) ||
                ((window.navigator as any).standalone === true);
        };

        setIsStandalone(isInStandaloneMode());

        // Check if iOS
        const checkIsIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        };
        setIsIOS(checkIsIOS());

        // Capture beforeinstallprompt event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleAddToHome = async () => {
        if (deferredPrompt) {
            // Android / PC (Chrome/Edge)
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else if (isIOS) {
            // iOS
            setShowIOSInstructions(true);
        } else {
            // PC (no prompt support) or other
            alert('ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。');
        }
    };

    // If already installed, don't show the button
    if (isStandalone) {
        return null;
    }

    // If install prompt is available OR it's iOS (manual instructions), show button
    // For PC without prompt, we still show button to give instructions
    return (
        <div className="mb-6">
            <button
                onClick={handleAddToHome}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-3"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>アプリをホーム画面に追加</span>
            </button>

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowIOSInstructions(false)}>
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">ホーム画面への追加方法</h3>
                            <button onClick={() => setShowIOSInstructions(false)} className="bg-gray-100 rounded-full p-2 text-gray-500 hover:bg-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">1</div>
                                <div>
                                    <p className="font-medium text-gray-900 mb-1">画面下部の共有ボタンをタップ</p>
                                    <div className="bg-gray-50 p-3 rounded-xl inline-block border border-gray-100">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">2</div>
                                <div>
                                    <p className="font-medium text-gray-900 mb-1">「ホーム画面に追加」を選択</p>
                                    <div className="bg-gray-50 p-2 rounded-xl text-sm text-gray-600 inline-flex items-center gap-2 border border-gray-100">
                                        <span className="bg-gray-200 p-1 rounded">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </span>
                                        ホーム画面に追加
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">3</div>
                                <div>
                                    <p className="font-medium text-gray-900 mb-1">画面右上の「追加」をタップ</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl mt-8 hover:bg-gray-800 transition-colors"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
