import Link from 'next/link';

export default function UniversitySelectPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">大学入試カウントダウン</h1>
        <p className="text-slate-500 mb-8">この機能は現在開発中です。</p>
        <Link href="/countdown" className="text-blue-600 hover:underline">
          戻る
        </Link>
      </div>
    </div>
  );
}