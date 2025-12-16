"use client";
import AddToHomeButton from "./AddToHomeButton";

export default function ActionButtons({
  examName,
  sessionName,
  slug,
  sessionSlug,
  diffDays
}: {
  examName: string;
  sessionName: string;
  slug: string;
  sessionSlug: string;
  diffDays: number;
}) {
  const handleFullscreenClick = () => {
    if (typeof window !== 'undefined' && (window as any).requestCountdownFullscreen) {
      (window as any).requestCountdownFullscreen();
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {/* ホーム画面に追加 */}
      <div className="w-full">
        <AddToHomeButton />
      </div>

      {/* 全画面表示 */}
      <button
        type="button"
        onClick={handleFullscreenClick}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm w-full"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4m12-4v4h-4" /></svg>
        全画面表示
      </button>

      {/* Xで共有 */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${examName} ${sessionName}まで、あと${diffDays}日！ #資格試験 #カウントダウン`)}&url=${encodeURIComponent(`https://edulens.jp/countdown/${slug}/${sessionSlug}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm w-full"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        Xで共有
      </a>
    </div>
  );
}
