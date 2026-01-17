"use client";
import AddToHomeButton from "./AddToHomeButton";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toBlob } from "html-to-image";
import BannerDisplay from "@/components/AffiliateBanners/BannerDisplay";

export default function ActionButtons({
  displayPrefName,
  year,
  prefecture,
  diffDays,
  displayExamDate,
  displayExamName,
  shareBannerContent
}: {
  displayPrefName: string;
  year: string;
  prefecture: string;
  diffDays: number;
  displayExamDate: string;
  displayExamName: string;
  shareBannerContent?: string;
}) {
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleFullscreenClick = () => {
    if (typeof window !== 'undefined' && (window as any).requestCountdownFullscreen) {
      (window as any).requestCountdownFullscreen();
    }
  };

  const executeShare = useCallback(async (targetId: string, suffix: string, ratio: number) => {
    try {
      setIsSharing(true);
      setShowShareModal(false); // モーダルを閉じて処理開始

      const element = document.getElementById(targetId);
      if (!element) {
        throw new Error('Share target not found');
      }

      // 画像生成 (指定されたターゲットIDとratioを使用)
      const blob = await toBlob(element, {
        pixelRatio: ratio,
        backgroundColor: '#ffffff',
        cacheBust: true,
        style: {
          opacity: '1',
          visibility: 'visible',
          position: 'static',
          transform: 'none',
        },
      });

      if (!blob) throw new Error('Failed to generate image');

      const filename = `edulens_${prefecture}_${year}_${suffix}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // Web Share API を試行
      // navigator.canShare の判定が不安定な場合があるため、直接 share を呼び出してエラーハンドリングでフォールバックする
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: `EduLens CountDown`,
            text: `${displayPrefName}公立高校入試まであと${diffDays}日！\n#高校入試 #カウントダウン #EduLens`,
          });
          return; // 共有成功したらここで終了
        } catch (shareError: any) {
          // ユーザーが共有をキャンセルした場合は何もしない
          if (shareError.name === 'AbortError') {
            return;
          }
          // その他のエラー（対応していないフォーマット、権限エラーなど）はフォールバックへ進む
          console.warn('Navigator share failed, falling back to download:', shareError);
        }
      }

      // フォールバック: 画像をダウンロードする (Share APIがない、または失敗した場合)
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      // メッセージを少し変更して状況を伝える
      alert('画像を保存しました。SNSアプリまたはカメラロールから選択して投稿してください。');

    } catch (err) {
      console.error('Image generation failed:', err);
      alert('画像の生成に失敗しました。');
    } finally {
      setIsSharing(false);
    }
  }, [prefecture, year, displayPrefName, diffDays]);

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
        {/* 画像で共有 (Modal Trigger) */}
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          disabled={isSharing}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSharing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              生成中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              画像で共有する
            </>
          )}
        </button>

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

        {/* 残り勉強時間シミュレーター */}
        <Link
          href={`/study-time-calculator?date=${displayExamDate}&name=${encodeURIComponent(displayExamName)}&back=${encodeURIComponent(`/countdown/highschool/${prefecture}/${year}`)}`}
          prefetch={false}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          残り勉強時間シミュレーター
        </Link>

        {/* Xで共有 (テキストリンク) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${displayPrefName}公立高校入試まで、あと${diffDays}日！ #高校入試 #カウントダウン`)}&url=${encodeURIComponent(`https://edulens.jp/countdown/highschool/${prefecture}/${year}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm w-full"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          Xで共有 (リンク)
        </a>
      </div>

      {shareBannerContent && (
        <div className="w-full max-w-xs mx-auto mb-12">
          <BannerDisplay content={shareBannerContent} />
        </div>
      )}

      {/* Share Selection Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-6 text-center border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">共有するサイズを選択</h3>
              <p className="text-sm text-slate-500 mt-1">投稿先に合わせて画像を生成します</p>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => executeShare('share-target-story', 'story', 3)}
                className="w-full flex items-center p-4 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors border border-slate-100 hover:border-purple-200 group text-left"
              >
                <div className="w-10 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md shadow-sm mr-4 flex-shrink-0 flex items-center justify-center text-white text-xs">9:16</div>
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-purple-700">Instagram ストーリーズ</div>
                  <div className="text-xs text-slate-500">縦長サイズ (スマホ全画面)</div>
                </div>
              </button>

              <button
                onClick={() => executeShare('share-target-square', 'post', 2)}
                className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-md shadow-sm mr-4 flex-shrink-0 flex items-center justify-center text-white text-xs">1:1</div>
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-blue-700">Instagram 投稿</div>
                  <div className="text-xs text-slate-500">正方形サイズ</div>
                </div>
              </button>

              <button
                onClick={() => executeShare('share-target-landscape', 'x', 2)}
                className="w-full flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100 hover:border-slate-300 group text-left"
              >
                <div className="w-16 h-8 bg-black rounded-md shadow-sm mr-4 flex-shrink-0 flex items-center justify-center text-white text-xs">1.9:1</div>
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-black">X ポスト</div>
                  <div className="text-xs text-slate-500">横長サイズ (OGP)</div>
                </div>
              </button>
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-500 font-bold text-sm hover:text-slate-800 py-2 px-4 rounded-full hover:bg-slate-200 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
