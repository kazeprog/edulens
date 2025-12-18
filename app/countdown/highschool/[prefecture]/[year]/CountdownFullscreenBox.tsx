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

      {/* === SNS共有用画像生成ターゲット (画面外配置) === */}
      {/* 1. X / OGP (1.91:1) - 600px x 315px */}
      <div
        id="share-target-landscape"
        className="fixed bottom-0 right-0 w-[600px] h-[315px] bg-white flex flex-col items-center justify-center p-8 border-4 border-blue-600 box-border text-slate-800 font-sans opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-tr-full opacity-50"></div>
        <div className="z-10 text-center w-full">
          <h2 className="text-2xl font-bold text-slate-500 mb-2">{year}年度 {displayExamName}</h2>
          <h1 className="text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">{displayPrefName}</h1>
          <div className="inline-block border-b-2 border-blue-600 pb-1 mb-6">
            <p className="text-xl font-bold text-slate-700">
              <span className="text-sm text-slate-400 font-medium mr-3 uppercase tracking-widest">Date</span>
              {displayExamDateDots}
            </p>
          </div>
          <div className="mb-4">
            {isExpired ? (
              <div className="text-3xl font-bold text-blue-600">試験終了</div>
            ) : (
              <div className="flex items-end justify-center gap-2">
                <span className="text-xl font-bold text-slate-400 mb-2">あと</span>
                <span className="text-8xl font-black text-blue-600 leading-none tabular-nums tracking-tighter">
                  {Math.ceil((new Date(displayExamDate).getTime() - new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
                <span className="text-2xl font-bold text-slate-400 mb-2">日</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-70">
          <span className="text-xs font-bold text-slate-400 tracking-widest">EduLens.jp</span>
          <img src="/logo.png" alt="EduLens" className="h-6 w-auto object-contain" />
        </div>
      </div>

      {/* 2. Instagram Post (1:1) - 540px x 540px */}
      <div
        id="share-target-square"
        className="fixed bottom-0 right-0 w-[540px] h-[540px] bg-white flex flex-col items-center justify-center p-8 border-4 border-blue-600 box-border text-slate-800 font-sans opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-blue-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-600"></div>
        <div className="z-10 text-center w-full">
          <h2 className="text-2xl font-bold text-slate-500 mb-4">{year}年度 {displayExamName}</h2>
          <h1 className="text-5xl font-extrabold text-slate-800 mb-8 tracking-tight">{displayPrefName}</h1>
          <div className="w-full border-t border-slate-200 my-6"></div>
          <div className="mb-8">
            <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-2">Examination Date</div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{displayExamDateDots}</div>
          </div>
          <div className="mb-8 p-6 bg-blue-50 rounded-3xl inline-block">
            {isExpired ? (
              <div className="text-4xl font-bold text-blue-600">試験終了</div>
            ) : (
              <div className="flex items-end justify-center gap-3">
                <span className="text-2xl font-bold text-slate-500 mb-3">あと</span>
                <span className="text-9xl font-black text-blue-600 leading-none tabular-nums tracking-tighter">
                  {Math.ceil((new Date(displayExamDate).getTime() - new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
                <span className="text-3xl font-bold text-slate-500 mb-3">日</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-8 flex items-center gap-2 opacity-80">
          <img src="/logo.png" alt="EduLens" className="h-6 w-auto object-contain" />
        </div>
      </div>

      {/* 3. Instagram Story (9:16) - 360px x 640px */}
      <div
        id="share-target-story"
        className="fixed bottom-0 right-0 w-[414px] h-[736px] bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-between py-16 px-8 border-y-8 border-blue-600 box-border text-slate-800 font-sans opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">{year}年度 公立高校入試</div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-2 leading-tight whitespace-normal line-clamp-2 px-2">{displayPrefName}</h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Main Count */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="text-center mb-2">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Target Date</p>
            <p className="text-3xl font-bold text-slate-800">{displayExamDateDots}</p>
          </div>

          <div className="my-8 relative">
            {isExpired ? (
              <div className="relative text-5xl font-black text-blue-600">Finish</div>
            ) : (
              <div className="relative flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-400 mb-2">残り</span>
                <span className="text-[10rem] font-black text-blue-600 leading-none tabular-nums tracking-tighter">
                  {Math.ceil((new Date(displayExamDate).getTime() - new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
                <span className="text-4xl font-bold text-slate-400 mt-2">Days</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-sm font-medium text-slate-500">Good Luck!</div>
          <img src="/logo.png" alt="EduLens" className="h-8 w-auto object-contain" />
        </div>
      </div>

    </div>
  );
});

CountdownFullscreenBox.displayName = 'CountdownFullscreenBox';

export default CountdownFullscreenBox;