"use client";
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import CountdownTimer from "./CountdownTimer"; // 親コンポーネントが提供する時計コンポーネント

// === 外部から呼び出すための型定義 ===
export interface CountdownFullscreenBoxRef {
  requestFullscreen: () => void;
}

const CountdownFullscreenBox = forwardRef<CountdownFullscreenBoxRef, {
  displayPrefName: string;
  year: string;
  displayExamName: string;
  displayExamDateDots: string;
  displayExamDate: string; // YYYY-MM-DD形式
  isExpired: boolean;
}>(({
  displayPrefName,
  year,
  displayExamName,
  displayExamDateDots,
  displayExamDate,
  isExpired
}, ref) => {
  const countdownRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // === Fullscreen API の状態監視 ===
  useEffect(() => {
    const handleFullscreenChange = () => {
      // document.fullscreenElement が存在すれば true
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // ブラウザ接頭辞付きイベントも考慮（念のためwebkit/moz/msも監視可能だが、モダンブラウザでは不要なことが多い）
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // === 外部 (親コンポーネント) から全画面モードを起動する関数 ===
  useImperativeHandle(ref, () => ({
    requestFullscreen: () => {
      if (countdownRef.current) {
        // 標準の Fullscreen API を呼び出す
        countdownRef.current.requestFullscreen().catch((err) => {
           console.error(`全画面表示の開始に失敗しました: ${err.message}`);
        });
      }
    }
  }));
  
  return (
    // 全画面表示の対象となるコンテナ。Refをアタッチし、全画面時はスタイルを適用
    <div 
      className={`${
        // 全画面時: 画面中央寄せ、最小高さ、背景白、大きめのパディング
        isFullscreen ? 'flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-8 relative' : 'mb-16'
      } transition-all`}
      ref={countdownRef}
    >
      
      {/* === カウントダウン時計と情報表示エリア === */}
      <div 
        // 全画面時: スケールアップして画面いっぱいに表示。非全画面時は通常のサイズ。
        className={`${isFullscreen ? 'scale-100 sm:scale-50 md:scale-125 lg:scale-150 xl:scale-175' : ''} transition-transform transform`}
      >
       
        {/* 全画面時のみ都道府県名と試験名を表示 */}
        {isFullscreen && (
          <div className="text-center mb-8">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-3 sm:mb-4 tracking-tight">
              {displayPrefName}
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-500 font-medium">{year}年度 {displayExamName}</p>
          </div>
        )}
        
        {/* 試験日 (非全画面時も表示) */}
        <div className="inline-block border-b-2 border-blue-600 pb-1 mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase">Examination Date</span>
          <span className="ml-3 sm:ml-4 text-lg sm:text-xl font-bold text-slate-800">{displayExamDateDots}</span>
        </div>
        
        {/* カウントダウン (必須コンポーネント) */}
        <div className="mb-6 sm:mb-8">
          <CountdownTimer targetDate={displayExamDate} />
        </div>
        
        {/* 試験終了メッセージ */}
        {isExpired && (
          <div className="text-blue-600 font-bold mt-6 sm:mt-8 text-base sm:text-lg">
            試験当日、または終了しました
          </div>
        )}
      </div>
      
      {/* === 全画面時のみ右下端にロゴを表示 === */}
      {isFullscreen && (
        <div
          className="fixed z-50 origin-bottom-right transition-transform transform"
          // safe-area を考慮して端末端ギリギリに寄せつつ見切れない余白を確保
          style={{
            right: 'calc(env(safe-area-inset-right, 0px) + 0.5rem)',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
            transformOrigin: 'bottom right'
          }}
        >
            <img
              src="/Xcard.png"
              alt="EduLens"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain opacity-90 pointer-events-none"
            // 画像が端末端にかからないように最小余白を確保（追加のフォールバック）
            // NOTE: inline-style を使いたくない場合は globals.css に .safe-edge クラスを追加しても良い
          />
        </div>
      )}
    </div>
  );
});

CountdownFullscreenBox.displayName = 'CountdownFullscreenBox';

export default CountdownFullscreenBox;