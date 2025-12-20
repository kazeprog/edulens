'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// タイマーモードの定義
type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  sessionsBeforeLongBreak: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  work: 25 * 60, // 25分
  shortBreak: 5 * 60, // 5分
  longBreak: 15 * 60, // 15分
  sessionsBeforeLongBreak: 4,
};

export default function EduTimerPage() {
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 設定の一時保存用
  const [tempSettings, setTempSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4,
  });

  // 通知音の再生
  const playNotification = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // ユーザーインタラクションがない場合は再生できない
      });
    }
  }, []);

  // 次のモードに切り替え
  const switchToNextMode = useCallback(() => {
    playNotification();

    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);

      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.work);
    }
    setIsRunning(false);
  }, [mode, completedSessions, settings, playNotification]);

  // タイマーのカウントダウン
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      switchToNextMode();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, switchToNextMode]);

  // タイマー開始/一時停止
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // タイマーリセット
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode]);
  };

  // モード切り替え
  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(settings[newMode]);
  };

  // 設定保存
  const saveSettings = () => {
    const newSettings: TimerSettings = {
      work: tempSettings.work * 60,
      shortBreak: tempSettings.shortBreak * 60,
      longBreak: tempSettings.longBreak * 60,
      sessionsBeforeLongBreak: tempSettings.sessionsBeforeLongBreak,
    };
    setSettings(newSettings);
    setTimeLeft(newSettings[mode]);
    setShowSettings(false);
  };

  // 時間表示のフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // プログレス計算
  const progress = ((settings[mode] - timeLeft) / settings[mode]) * 100;

  // モードに応じたカラー
  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return {
          primary: 'from-rose-500 to-red-600',
          bg: 'from-rose-50 to-red-50',
          text: 'text-rose-600',
          ring: 'stroke-rose-500',
          button: 'bg-rose-500 hover:bg-rose-600',
          accent: 'border-rose-200',
        };
      case 'shortBreak':
        return {
          primary: 'from-emerald-500 to-green-600',
          bg: 'from-emerald-50 to-green-50',
          text: 'text-emerald-600',
          ring: 'stroke-emerald-500',
          button: 'bg-emerald-500 hover:bg-emerald-600',
          accent: 'border-emerald-200',
        };
      case 'longBreak':
        return {
          primary: 'from-blue-500 to-indigo-600',
          bg: 'from-blue-50 to-indigo-50',
          text: 'text-blue-600',
          ring: 'stroke-blue-500',
          button: 'bg-blue-500 hover:bg-blue-600',
          accent: 'border-blue-200',
        };
    }
  };

  const colors = getModeColor();

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return '集中タイム';
      case 'shortBreak':
        return '短い休憩';
      case 'longBreak':
        return '長い休憩';
    }
  };

  return (
    <>
      {/* 通知音用のオーディオ要素 */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EAAC5kqa7V9++hnGdpbX6SrLClv4qBjpyqrrm0s6etvLewmpOVkYiOkY+Wl5yenJuUkJCOkpqemZqZmJGLgoGDh42RlpWVko+MiIeIio6PkpKRjomFgoKEiIuOkZGPjIiFgoCBg4eKjY+PjYqHhIGAgIOGiYyOjoyJhoOAgIGDhoiLjIuJhoOAgICBg4WIiouKiIWCgH9/gIOFh4mKiYeEgX9+foGDhYeJiYiGg4B+fn6Ag4WHiImIhoOAfn5+gIKEhoiIh4WDgH5+fn+Bg4WHiIeGg4F+fX5/gYOFh4iHhYOAfn5+f4GDhYeHhoSDgH5+fn+Bg4WGh4aEgn9+fn5/gYOFhoaFg4F/fn5+f4GDhYaGhYOBf35+fn+Bg4WFhoWDgX9+fn5/gYOFhYWEg4F/fn5+f4GDhYWFhIOBf35+fn+AgoSFhYSDgX9+fn5/gIKEhYWEg4F/fn5+f4CChISFhIOBf35+fn+AgoSEhISDgX9+fn5/gIKEhISEg4F/fn5+f4CChISEhIOBf35+fn+AgoSEhISDgX5+fn5/gIKEhISEg4F+fn5+f4CChISEhIOBfn5+fn+AgYOEhISDgX5+fn5/gIGDhISEg4F+fn5+f4CBg4SEhIOBfn5+fn9/gYOEhISDgX5+fn5/f4GDhISEg4F+fn5+f3+Bg4SEhIOBfn5+fn9/gYOEhISDgX5+fn5/f4GDg4SDg4F+fn5+f3+Bg4ODg4OBfn5+fn9/gYODg4ODgX5+fn5/f4GDg4ODg4F+fn5+f3+Bg4ODg4OBfn5+fn9/gYODg4ODgX5+fn5/f4GDg4ODg4F+fn5+f3+AgYODg4OBf35+fn5/gIGDg4ODgX9+fn5+f4CBg4ODg4F/fn5+fn+AgYODg4OBf35+fn5/gIGDg4ODgX9+fn5+f4CBg4ODg4F/fn5+fn+AgYODg4OBf35+fn5/gIGDg4ODgX9+fn5+f4CBgoODg4F/fn5+fn+AgYKDg4OBf35+fn5/gIGCg4ODgX9+fn5+f4CBgoODg4F/fn5+fn9/gIGCg4OCgX9+fn5+f3+AgYKDg4KBf35+fn5/f4CBgoODgoF/fn5+fn9/gIGCg4OCgX9+fn5+f3+AgYKDg4KBf35+fn5/f4CBgoKDgoF/fn5+fn9/gIGCgoOCgX9+fn5+f3+AgYKCg4KBf35+fn5/f4CBgoKDgoF/fn5+f39/gIGCgoOCgX9+fn5/f3+AgYKCgoKBf35+fn9/f4CBgoKCgoF/fn5+f39/gIGCgoKCgX9+fn5/f3+AgYKCgoKBf35+fn9/f4CBgoKCgoF/fn5+f39/gIGCgoKCgX9+fn5/f3+AgYGCgoKBf35+fn9/f4CBgYKCgoF/fn5+f39/gIGBgoKCgX9+fn5/f3+AgYGCgoKBf35+fn9/f4CBgYKCgoF/fn5+f39/gIGBgoKCgX9+fn5/f3+AgYGCgoKBf35+fn9/f4CBgYKCgoF/fn5+f39/gIGBgoKCgX9+fn5/f3+AgYGCgoKBf35+fn9/f4CBgYKCgoF/fn5+f39/gIGBgoKCgX9+fn5/f3+AgYGCgoKBf35+fn9/f4CBgYKCgoF/fn5+f39/gIGBgoKCgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgoKBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gIGBgYGBgX9+fn5/f39/gA==" type="audio/wav" />
      </audio>

      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50 border-b border-slate-100">
        <Link href="/" className="w-48 h-12 block hover:opacity-80 transition-opacity relative">
          <Image src="/logo.png" alt="EduLens" fill className="object-contain" priority />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
              {profile?.full_name ? `${profile.full_name}さん` : (user.email ? `${user.email.split('@')[0]}さん` : 'ゲストさん')}
            </span>
          ) : (
            <Link href="/mistap?login=1" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
              ログイン
            </Link>
          )}

          <button
            onClick={() => {
              setTempSettings({
                work: settings.work / 60,
                shortBreak: settings.shortBreak / 60,
                longBreak: settings.longBreak / 60,
                sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
              });
              setShowSettings(true);
            }}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="設定"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main className={`min-h-[calc(100vh-80px)] bg-gradient-to-b ${colors.bg} transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              EduTimer
            </h1>
            <p className="text-slate-600">ポモドーロテクニックで集中力を高める</p>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${mode === m
                    ? `bg-gradient-to-r ${colors.primary} text-white shadow-lg scale-105`
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                {m === 'work' ? '集中' : m === 'shortBreak' ? '短い休憩' : '長い休憩'}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative flex justify-center items-center mb-8">
            {/* Progress Ring */}
            <svg className="w-64 h-64 sm:w-80 sm:h-80 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                className={`${colors.ring} transition-all duration-300`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}%`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}%`}
              />
            </svg>

            {/* Timer Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-sm font-medium ${colors.text} mb-2`}>
                {getModeLabel()}
              </span>
              <span className="text-5xl sm:text-7xl font-bold text-slate-800 font-mono tracking-wider">
                {formatTime(timeLeft)}
              </span>
              <span className="text-slate-500 mt-2 text-sm">
                セッション: {completedSessions}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-2xl text-lg font-semibold text-white ${colors.button} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  一時停止
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  スタート
                </span>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="px-6 py-4 rounded-2xl text-lg font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                リセット
              </span>
            </button>
          </div>

          {/* Session Progress */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border ${colors.accent}`}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">本日の進捗</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${i < completedSessions % settings.sessionsBeforeLongBreak ||
                        (completedSessions > 0 && completedSessions % settings.sessionsBeforeLongBreak === 0)
                        ? `bg-gradient-to-r ${colors.primary} text-white shadow-md`
                        : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="flex-1 text-right">
                <span className={`text-2xl font-bold ${colors.text}`}>{completedSessions}</span>
                <span className="text-slate-500 ml-1">セッション完了</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-white/50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">ポモドーロテクニックとは？</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className={`${colors.text} font-bold`}>1.</span>
                25分間集中して作業する（1ポモドーロ）
              </li>
              <li className="flex items-start gap-2">
                <span className={`${colors.text} font-bold`}>2.</span>
                5分間の短い休憩を取る
              </li>
              <li className="flex items-start gap-2">
                <span className={`${colors.text} font-bold`}>3.</span>
                4ポモドーロ終了後、15〜30分の長い休憩を取る
              </li>
              <li className="flex items-start gap-2">
                <span className={`${colors.text} font-bold`}>4.</span>
                このサイクルを繰り返す
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">タイマー設定</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  集中時間（分）
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.work}
                  onChange={(e) => setTempSettings({ ...tempSettings, work: parseInt(e.target.value) || 25 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  短い休憩（分）
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreak}
                  onChange={(e) => setTempSettings({ ...tempSettings, shortBreak: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  長い休憩（分）
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreak}
                  onChange={(e) => setTempSettings({ ...tempSettings, longBreak: parseInt(e.target.value) || 15 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  長い休憩までのセッション数
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={tempSettings.sessionsBeforeLongBreak}
                  onChange={(e) => setTempSettings({ ...tempSettings, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-slate-100 bg-slate-50">
        <nav className="flex flex-wrap justify-center gap-6 mb-4 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-slate-800 hover:underline">利用規約</Link>
          <Link href="/privacy" className="hover:text-slate-800 hover:underline">プライバシーポリシー</Link>
          <Link href="/contact" className="hover:text-slate-800 hover:underline">お問い合わせ</Link>
        </nav>
        <div className="space-y-2">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} EduLens
          </p>
        </div>
      </footer>
    </>
  );
}
