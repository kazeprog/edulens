'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface FlippableCardProps {
  word: string;
  meaning: string;
  wordNumber: number;
  isFlipped: boolean;
  isTapped: boolean;
  onFlip: () => void;
  onTap: () => void;
  minHeight?: number; // カードごとの最適な高さ（ピクセル）
  audioText?: string; // 読み上げ用のテキスト（表示テキストと異なる場合）
  originalWord?: string; // 元の英単語（裏面表示用）
  originalMeaning?: string; // 元の日本語意味（裏面表示用）
}

export default function FlippableCard({
  word,
  meaning,
  wordNumber,
  isFlipped,
  isTapped,
  onFlip,
  onTap,
  minHeight = 128, // デフォルトは8rem相当
  audioText,
  originalWord,
  originalMeaning
}: FlippableCardProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // 既存の読み上げをキャンセル
      window.speechSynthesis.cancel();
      const textToSpeak = audioText || word;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';

      // 英語の音声を明示的に取得して設定（ローマ字読み回避のため）
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSwipeRotation, setIsSwipeRotation] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // isFlippedの変更を監視して回転状態を同期（外部からの変更時のみ）
  useEffect(() => {
    if (isSwipeRotation) {
      // スワイプによる回転の場合は何もしない
      setIsSwipeRotation(false);
      return;
    }

    if (isFlipped && currentRotation % 360 === 0) {
      // 外部から裏向きにされた場合、180度回転
      setCurrentRotation(prev => prev + 180);
    } else if (!isFlipped && currentRotation % 360 === 180) {
      // 外部から表向きにされた場合、180度回転
      setCurrentRotation(prev => prev + 180);
    }
  }, [isFlipped, currentRotation, isSwipeRotation]);



  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null || startY === null) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    // スワイプの最小距離
    const minSwipeDistance = 50;

    // 横スワイプの方が縦スワイプより大きい場合のみ処理
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      e.preventDefault();

      // スワイプ方向に180度回転（常に同じ方向に）
      setIsSwipeRotation(true);
      setCurrentRotation(prev => {
        const newRotation = diffX > 0 ? prev + 180 : prev - 180;
        console.log(`スワイプ: ${diffX > 0 ? '右' : '左'}, 前の角度: ${prev}°, 新しい角度: ${newRotation}°`);
        return newRotation;
      });

      onFlip();
    }

    setStartX(null);
    setStartY(null);
  };

  const handleClick = () => {
    // PCでのクリック処理（タップのみ、フリップ機能なし）
    onTap();
  };



  return (
    <div className="mb-3" style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        className={`relative w-full cursor-pointer transition-transform duration-700 ease-out touch-pan-y`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${currentRotation}deg)`,
          minHeight: `${minHeight}px`
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* カード表面（英単語のみ） */}
        <div
          className={`absolute inset-0 w-full rounded-xl border-2 transition-colors duration-200 ${isTapped
            ? 'bg-red-100 border-red-400 text-black'
            : 'bg-white border-gray-300 hover:bg-gray-50'
            } flex flex-col px-4 py-3`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="text-base font-medium text-gray-500 min-w-[2rem] flex-shrink-0">
              {wordNumber}
            </span>
            <span className="font-semibold text-lg text-gray-900 break-words flex-1">
              {word}
            </span>
            <button
              onClick={handleSpeak}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="読み上げ"
            >
              <Volume2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="text-xs text-gray-400 text-right mt-auto">
            スワイプで意味表示
          </div>
        </div>

        {/* カード裏面（英単語 + 意味） */}
        <div
          className={`absolute inset-0 w-full rounded-xl border-2 transition-colors duration-200 ${isTapped
            ? 'bg-red-100 border-red-400 text-black'
            : 'bg-gray-50 border-gray-400 hover:bg-gray-100'
            } flex flex-col px-4 py-3`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-500 min-w-[2rem] mt-1 flex-shrink-0">
              {wordNumber}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-gray-900 mb-1 break-words">
                {originalWord || word}
              </div>
              <div className="text-sm text-gray-700 leading-tight break-words">
                {originalMeaning || meaning}
              </div>
            </div>
            <button
              onClick={handleSpeak}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              aria-label="読み上げ"
            >
              <Volume2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="text-xs text-gray-400 text-right mt-auto">
            スワイプで戻る
          </div>
        </div>
      </div>
    </div>
  );
}