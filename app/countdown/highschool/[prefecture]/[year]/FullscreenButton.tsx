"use client";

export default function FullscreenButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm w-full max-w-xs"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4m12-4v4h-4" /></svg>
      全画面表示
    </button>
  );
}
