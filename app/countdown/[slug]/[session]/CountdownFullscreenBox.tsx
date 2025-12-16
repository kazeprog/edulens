"use client";
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import CountdownTimer from "./CountdownTimer";

export interface CountdownFullscreenBoxRef {
  requestFullscreen: () => void;
}

const CountdownFullscreenBox = forwardRef<CountdownFullscreenBoxRef, {
  examName: string;
  sessionName: string;
  displayExamDateDots: string;
  displayExamDate: string;
  isExpired: boolean;
}>(({
  examName,
  sessionName,
  displayExamDateDots,
  displayExamDate,
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
      className={`${
        isFullscreen ? 'flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-8 relative' : 'mb-16'
      } transition-all`}
      ref={countdownRef}
    >
      
      <div 
        className={`${isFullscreen ? 'scale-100 sm:scale-50 md:scale-125 lg:scale-150 xl:scale-175' : ''} transition-transform transform`}
      >
       
        {isFullscreen && (
          <div className="text-center mb-8">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-3 sm:mb-4 tracking-tight">
              {examName}
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-500 font-medium">{sessionName}</p>
          </div>
        )}
        
        <div className="inline-block border-b-2 border-blue-600 pb-1 mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase">Examination Date</span>
          <span className="ml-3 sm:ml-4 text-lg sm:text-xl font-bold text-slate-800">{displayExamDateDots}</span>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <CountdownTimer targetDate={displayExamDate} />
        </div>
        
        {isExpired && (
          <div className="text-blue-600 font-bold mt-6 sm:mt-8 text-base sm:text-lg">
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
    </div>
  );
});

CountdownFullscreenBox.displayName = 'CountdownFullscreenBox';

export default CountdownFullscreenBox;
