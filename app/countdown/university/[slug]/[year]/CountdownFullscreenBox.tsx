"use client";
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import CountdownTimer from "./CountdownTimer";

export interface CountdownFullscreenBoxRef {
  requestFullscreen: () => void;
}

const CountdownFullscreenBox = forwardRef<CountdownFullscreenBoxRef, {
  eventName: string;
  year: string;
  eventDateDots: string;
  eventDate: string;
  isExpired: boolean;
}>(({
  eventName,
  year,
  eventDateDots,
  eventDate,
  isExpired
}, ref) => {
  const countdownRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useImperativeHandle(ref, () => ({
    requestFullscreen: () => {
      if (countdownRef.current) {
        countdownRef.current.requestFullscreen().catch((err) => {
          console.error(`全画面表示の開始に失敗しました: ${err.message}`);
        });
      }
    }
  }));

  return (
    <div
      className={`${isFullscreen ? 'flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-8 relative' : 'mb-12'
        } transition-all`}
      ref={countdownRef}
    >

      <div
        className={`${isFullscreen ? 'scale-100 sm:scale-50 md:scale-125 lg:scale-150 xl:scale-175' : ''} transition-transform transform`}
      >

        {isFullscreen && (
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-4">
              {year}年度 大学入試
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-3 sm:mb-4 tracking-tight">
              {eventName}
            </div>
          </div>
        )}

        <div className="inline-block border-b-2 border-indigo-500 pb-1 mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase">Examination Date</span>
          <span className="ml-3 sm:ml-4 text-lg sm:text-xl font-bold text-slate-800">{eventDateDots}</span>
        </div>

        <div className="mb-6 sm:mb-8">
          <CountdownTimer targetDate={eventDate} />
        </div>

        {isExpired && (
          <div className="text-indigo-600 font-bold mt-6 sm:mt-8 text-base sm:text-lg">
            試験当日、または終了しました
          </div>
        )}
      </div>

      {isFullscreen && (
        <div
          className="fixed z-50 origin-bottom-right transition-transform transform"
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
          />
        </div>
      )}

      {/* === SNS共有用画像生成ターゲット (画面外配置) === */}
      {/* 1. X / OGP (1.91:1) */}
      <div
        id="share-target-landscape"
        className="fixed bottom-0 right-0 w-[600px] h-[315px] bg-white flex flex-col items-center justify-center p-8 border-4 border-indigo-600 box-border text-slate-800 font-sans opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-tr-full opacity-50"></div>
        <div className="z-10 text-center w-full">
          <h2 className="text-2xl font-bold text-slate-500 mb-2">{year}年度 大学入試</h2>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight whitespace-pre-wrap line-clamp-2 leading-tight px-4 min-h-[4.5rem] flex items-center justify-center">
            {eventName.replace(/([（(])/g, '\n$1')}
          </h1>
          <div className="inline-block border-b-2 border-indigo-600 pb-1 mb-4">
            <p className="text-xl font-bold text-slate-700">
              <span className="text-sm text-slate-400 font-medium mr-3 uppercase tracking-widest">Date</span>
              {eventDateDots}
            </p>
          </div>
          <div className="mb-2">
            {isExpired ? (
              <div className="text-3xl font-bold text-indigo-600">試験終了</div>
            ) : (
              <div className="flex items-end justify-center gap-2">
                <span className="text-xl font-bold text-slate-400 mb-2">あと</span>
                <span className="text-8xl font-black text-indigo-600 leading-none tabular-nums tracking-tighter">
                  {Math.ceil((new Date(eventDate).getTime() - new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]).getTime()) / (1000 * 60 * 60 * 24))}
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

      {/* 2. Instagram Post (1:1) */}
      <div
        id="share-target-square"
        className="fixed bottom-0 right-0 w-[540px] h-[540px] bg-white flex flex-col items-center justify-center p-8 border-4 border-indigo-600 box-border text-slate-800 font-sans opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-indigo-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-indigo-600"></div>
        <div className="z-10 text-center w-full">
          <h2 className="text-2xl font-bold text-slate-500 mb-2">{year}年度 大学入試</h2>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight whitespace-pre-wrap line-clamp-2 leading-tight px-4 h-[6rem] flex items-center justify-center">{eventName.replace(/([（(])/g, '\n$1')}</h1>
          <div className="w-full border-t border-slate-200 my-4"></div>
          <div className="mb-8">
            <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-2">Examination Date</div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{eventDateDots}</div>
          </div>
          <div className="mb-8 p-6 bg-indigo-50 rounded-3xl inline-block">
            {isExpired ? (
              <div className="text-4xl font-bold text-indigo-600">試験終了</div>
            ) : (
              <div className="flex items-end justify-center gap-3">
                <span className="text-2xl font-bold text-slate-500 mb-3">あと</span>
                <span className="text-9xl font-black text-indigo-600 leading-none tabular-nums tracking-tighter">
                  {Math.ceil((new Date(eventDate).getTime() - new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]).getTime()) / (1000 * 60 * 60 * 24))}
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

      {/* 3. Instagram Story (9:16) */}
      <div
        id="share-target-story"
        className="fixed bottom-0 right-0 w-[414px] h-[736px] bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-between py-16 px-8 border-y-8 border-indigo-600 box-border text-slate-800 font-sans opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        <div className="text-center">
          <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-4">{year}年度 大学入試</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 leading-tight whitespace-pre-wrap line-clamp-3 px-2">{eventName.replace(/([（(])/g, '\n$1')}</h1>
          <div className="h-1 w-20 bg-indigo-600 mx-auto mt-4"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="text-center mb-2">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Target Date</p>
            <p className="text-3xl font-bold text-slate-800">{eventDateDots}</p>
          </div>

          <div className="my-8 relative">
            {isExpired ? (
              <div className="relative text-5xl font-black text-indigo-600">Finish</div>
            ) : (
              <div className="relative flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-400 mb-2">残り</span>
                <span className="text-9xl font-black text-indigo-600 leading-none tabular-nums tracking-tighter">
                  {Math.ceil((new Date(eventDate).getTime() - new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
                <span className="text-4xl font-bold text-slate-400 mt-2">Days</span>
              </div>
            )}
          </div>
        </div>

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
