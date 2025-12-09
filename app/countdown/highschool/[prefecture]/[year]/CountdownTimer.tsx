'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const calculateTimeLeft = () => {
      // 日本時間 (JST) の00:00:00をターゲットにする
      const targetTime = new Date(`${targetDate}T00:00:00+09:00`).getTime();
      const now = new Date();
      const nowTime = now.getTime();
      const difference = targetTime - nowTime;

      if (difference > 0) {
        // --- 日数は「今日を除いたカレンダー差分（JST基準）」で計算 ---
        // JST上の今日の日付を取得
        const msPerDay = 1000 * 60 * 60 * 24;
        // カウントダウン表示では "Days" を小数切り捨てで表示（例: 86日と23時間 -> 86）
        const days = Math.max(0, Math.floor(difference / msPerDay));

        // --- 時間・分・秒はイベント時刻までの正確な残り時間から算出 ---
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return (
      <div className="animate-pulse flex justify-center gap-4">
        <div className="h-24 w-20 bg-slate-200 rounded-lg"></div>
        <div className="h-24 w-20 bg-slate-200 rounded-lg"></div>
        <div className="h-24 w-20 bg-slate-200 rounded-lg"></div>
        <div className="h-24 w-20 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      <div className="min-w-[60px] sm:min-w-[80px] text-center">
        <span className="text-5xl sm:text-7xl font-bold text-blue-600 tracking-tighter">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-start">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-3xl sm:text-5xl font-light text-slate-300 mt-2">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-3xl sm:text-5xl font-light text-slate-300 mt-2">:</div>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <div className="text-3xl sm:text-5xl font-light text-slate-300 mt-2">:</div>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
