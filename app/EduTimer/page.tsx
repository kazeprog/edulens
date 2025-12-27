'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getEduLensSupabase } from '@/lib/supabase-edulens';

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

  // セッション履歴（ログインユーザー用）
  interface SessionHistory {
    id: string;
    completed_at: string;
    session_count: number;
    work_duration: number;
  }
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // セッション履歴を読み込む（edulensプロジェクトから）
  const loadSessionHistory = useCallback(async () => {
    if (!user) return;
    const supabase = getEduLensSupabase();
    if (!supabase) return;

    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        setSessionHistory(data);
      }
    } catch (err) {
      console.error('Failed to load session history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [user]);

  // セッションをDBに保存（edulensプロジェクトへ）
  const saveSession = useCallback(async (workDuration: number) => {
    if (!user) return;
    const supabase = getEduLensSupabase();
    if (!supabase) return;

    try {
      await supabase.from('pomodoro_sessions').insert({
        user_id: user.id,
        session_count: 1,
        work_duration: Math.floor(workDuration / 60),
      });
      // 履歴を再読み込み
      loadSessionHistory();
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  }, [user, loadSessionHistory]);

  // ログイン時に履歴を読み込む
  useEffect(() => {
    if (user) {
      loadSessionHistory();
    } else {
      setSessionHistory([]);
    }
  }, [user, loadSessionHistory]);

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

      // ログイン中ならセッションを保存
      if (user) {
        saveSession(settings.work);
      }

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
  }, [mode, completedSessions, settings, playNotification, user, saveSession]);

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
        <source src="/finish-sound.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50 border-b border-slate-100">
        <Link href="/" className="w-48 h-12 block hover:opacity-80 transition-opacity relative">
          <Image
            src="/logo.png"
            alt="EduLens"
            fill
            sizes="(max-width: 768px) 150px, 192px"
            className="object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
              {profile?.full_name ? `${profile.full_name}さん` : (user.email ? `${user.email.split('@')[0]}さん` : 'ゲストさん')}
            </span>
          ) : (
            <Link href="/login?redirect=/EduTimer" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
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

      {/* Breadcrumb パンくずリスト - SEO強化 */}
      <nav className="max-w-4xl mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="hover:text-rose-600 transition-colors">ホーム</Link>
          </li>
          <li>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="font-medium text-slate-800" aria-current="page">EduTimer（ポモドーロタイマー）</li>
        </ol>
        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'ホーム',
                  'item': 'https://edulens.jp/'
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'EduTimer',
                  'item': 'https://edulens.jp/EduTimer'
                }
              ]
            })
          }}
        />
      </nav>

      <main className={`min-h-[calc(100vh-140px)] bg-gradient-to-b ${colors.bg} transition-colors duration-500 pb-20`}>
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          {/* Title - SEOキーワードを含める */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              EduTimer - 無料ポモドーロタイマー
            </h1>
            <p className="text-slate-600">
              ポモドーロテクニックで集中力を高める<br />
              無料Webタイマー
            </p>
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

          {/* Session History (ログインユーザーのみ) / ログイン促進メッセージ */}
          {user ? (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  これまでの記録
                </h2>
              </div>

              {/* 統計カード */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:shadow-md transition-all duration-300">
                  <span className="text-slate-500 text-sm font-medium mb-1">総セッション数</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                      {sessionHistory.length}
                    </span>
                    <span className="text-slate-400 text-sm">回</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:shadow-md transition-all duration-300">
                  <span className="text-slate-500 text-sm font-medium mb-1">総集中時間</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                      {Math.floor(sessionHistory.reduce((acc, s) => acc + s.work_duration, 0) / 60)}
                    </span>
                    <span className="text-slate-400 text-sm">時間</span>
                    <span className={`text-xl font-bold ${colors.text} ml-1`}>
                      {sessionHistory.reduce((acc, s) => acc + s.work_duration, 0) % 60}
                    </span>
                    <span className="text-slate-400 text-sm">分</span>
                  </div>
                </div>
              </div>

              {/* 履歴リスト */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <svg className="w-8 h-8 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>読み込み中...</span>
                  </div>
                ) : sessionHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="font-medium">まだ履歴がありません</p>
                    <p className="text-sm mt-1 opacity-70">最初のセッションを完了させてみましょう！</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {(() => {
                      const grouped = sessionHistory.reduce((acc, session) => {
                        const date = new Date(session.completed_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                        if (!acc[date]) {
                          acc[date] = [];
                        }
                        acc[date].push(session);
                        return acc;
                      }, {} as Record<string, typeof sessionHistory>);

                      return Object.entries(grouped).map(([date, sessions], dateIndex) => (
                        <div key={date} className="relative pl-6 sm:pl-8 border-l-2 border-slate-100 last:border-0 last:pb-0">
                          {/* タイムラインのノード */}
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${dateIndex === 0 ? 'bg-rose-500 ring-4 ring-rose-50' : 'bg-slate-300'}`} />

                          {/* 日付ヘッダー */}
                          <div className="flex items-center justify-between mb-4 -mt-1">
                            <h3 className={`font-bold ${dateIndex === 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                              {date}
                            </h3>
                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                              {sessions.length} sessions
                            </span>
                          </div>

                          {/* セッションリスト */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 last:mb-0">
                            {sessions.map((session) => (
                              <div
                                key={session.id}
                                className="bg-slate-50 hover:bg-white p-3 rounded-xl border border-transparent hover:border-rose-100 hover:shadow-md transition-all duration-200 group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg`}>
                                      🍅
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs text-slate-400 font-medium tracking-wide">COMPLETED</span>
                                      <span className="text-sm font-bold text-slate-700 font-mono">
                                        {new Date(session.completed_at).toLocaleTimeString('ja-JP', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`block text-lg font-bold ${colors.text} leading-none`}>
                                      {session.work_duration}
                                      <span className="text-xs font-normal ml-0.5 text-slate-400">min</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-1 shadow-lg shadow-indigo-200">
              <div className="bg-white rounded-[22px] p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-3xl">
                    📊
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      あなたの学習を記録しませんか？
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 sm:mb-0">
                      ログインすると、毎日のポモドーロセッションが自動的に記録され、
                      日々の頑張りをグラフや統計で確認できるようになります。
                    </p>
                  </div>
                  <Link
                    href="/login?redirect=/EduTimer"
                    className="flex-shrink-0 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    ログインして記録
                  </Link>
                </div>
              </div>
            </div>
          )}


          {/* Tips & Educational Content - SEO Content Expansion */}
          <div className="mt-12 space-y-8">
            <article className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🍅</span>
                ポモドーロテクニックとは？
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  ポモドーロテクニックは、1980年代後半にイタリア人のフランチェスコ・シリロによって考案された時間管理術です。
                  「ポモドーロ」はイタリア語で「トマト」を意味し、彼が学生時代に愛用していたトマト型のキッチンタイマーに由来しています。
                </p>
                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">基本的なやり方</h3>
                <ol className="list-decimal list-inside space-y-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <li><strong className="text-slate-700">25分間</strong>：1つのタスクに集中して取り組む（1ポモドーロ）</li>
                  <li><strong className="text-slate-700">5分間</strong>：短い休憩をとる（脳をリラックスさせる）</li>
                  <li>これを<strong className="text-slate-700">4回繰り返す</strong></li>
                  <li><strong className="text-slate-700">15〜30分</strong>：長い休憩をとる</li>
                </ol>
                <p>
                  このサイクルを繰り返すことで、疲労を溜めずに高い集中力を維持することができます。
                  受験勉強や資格試験、プログラミング、執筆作業など、長時間の集中が必要な作業に最適です。
                </p>
              </div>
            </article>

            <article className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                効果的に使うためのポイント
              </h2>
              <dl className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <dt className="font-bold text-slate-800 mb-2">休憩中は「何もしない」</dt>
                  <dd className="text-sm text-slate-600">
                    休憩時間にスマホを見たりニュースをチェックするのは避けましょう。脳を休めるために、深呼吸をしたり、軽いストレッチをしたり、遠くを眺めたりするのがおすすめです。
                  </dd>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <dt className="font-bold text-slate-800 mb-2">タスクを細分化する</dt>
                  <dd className="text-sm text-slate-600">
                    25分で完了できそうなサイズにタスクを分割しておくと、達成感（小さな成功体験）を積み重ねやすくなり、モチベーションが維持できます。
                  </dd>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <dt className="font-bold text-slate-800 mb-2">通知音を活用する</dt>
                  <dd className="text-sm text-slate-600">
                    区切りを音で知らせることで、時計を気にせず作業に没頭できます。EduTimerは作業用BGMなしの設計なので、お好みの音楽と組み合わせても邪魔になりません。
                  </dd>
                </div>
              </dl>
            </article>

            {/* FAQ Section with Microdata */}
            <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm" itemScope itemType="https://schema.org/FAQPage">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                よくある質問 (FAQ)
              </h2>
              <div className="space-y-6">
                <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-800 mb-2" itemProp="name">なぜ25分なのですか？</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <div itemProp="text" className="text-sm text-slate-600">
                      25分は、人間が高い集中力を維持できる一般的な限界時間と言われています。短すぎず長すぎないこの時間は、心理的なハードルを下げ、「とりあえず25分だけ頑張ろう」という着手を容易にする効果もあります。
                    </div>
                  </div>
                </div>
                <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-800 mb-2" itemProp="name">ログインすると何ができますか？</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <div itemProp="text" className="text-sm text-slate-600">
                      EduTimerにログイン（無料）すると、完了したポモドーロセッションの履歴が自動的に保存されます。日々の学習時間や努力の積み重ねを可視化することで、モチベーション向上につながります。
                    </div>
                  </div>
                </div>
                <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-800 mb-2" itemProp="name">アプリのインストールは必要ですか？</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <div itemProp="text" className="text-sm text-slate-600">
                      いいえ、EduTimerはWebブラウザで動作するWebアプリですので、インストール不要ですぐに使えます。PC、スマホ、タブレットなど、デバイスを問わずご利用いただけます。
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    集中時間（分）
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(console.error);
                      }
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-full transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9c.78.78 1.535 1.64 2.168 2.538 1.49 2.112 1.954 4.8.966 7.152M10 9v6m4-4H6m4 4h4" />
                    </svg>
                    音量テスト
                  </button>
                </div>
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
