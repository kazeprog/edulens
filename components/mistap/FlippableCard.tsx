'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { detectSpeechLanguage, pickSpeechVoice, sanitizeSpeechText } from '@/lib/mistap/speech';

interface FlippableCardProps {
  word: string;
  meaning: string;
  wordNumber: number;
  rotationY: number;
  isTapped: boolean;
  onFlip: (direction: 1 | -1) => void;
  onTap: () => void;
  minHeight?: number;
  audioText?: string;
  originalWord?: string;
  originalMeaning?: string;
}

export default function FlippableCard({
  word,
  meaning,
  wordNumber,
  rotationY,
  isTapped,
  onFlip,
  onTap,
  minHeight = 128,
  audioText,
  originalWord,
  originalMeaning
}: FlippableCardProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const textToSpeak = sanitizeSpeechText(audioText || word);
      if (!textToSpeak) return;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = detectSpeechLanguage(textToSpeak);

      const voices = window.speechSynthesis.getVoices();
      const voice = pickSpeechVoice(voices, textToSpeak);
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

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
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      e.preventDefault();
      onFlip(diffX > 0 ? 1 : -1);
    }

    setStartX(null);
    setStartY(null);
  };

  return (
    <div className="mb-3" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full cursor-pointer transition-transform duration-700 ease-out touch-pan-y"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotationY}deg)`,
          minHeight: `${minHeight}px`
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onTap}
      >
        <div
          className={`absolute inset-0 w-full rounded-xl border-2 transition-colors duration-200 ${
            isTapped ? 'bg-red-100 border-red-400 text-black' : 'bg-white border-gray-300 hover:bg-gray-50'
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

        <div
          className={`absolute inset-0 w-full rounded-xl border-2 transition-colors duration-200 ${
            isTapped ? 'bg-red-100 border-red-400 text-black' : 'bg-gray-50 border-gray-400 hover:bg-gray-100'
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
            覚えていなかったらタップ！
          </div>
        </div>
      </div>
    </div>
  );
}
