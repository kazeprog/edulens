"use client";
import { useRef } from "react";
import CountdownFullscreenBox, { CountdownFullscreenBoxRef } from "./CountdownFullscreenBox";

export default function CountdownWithActions({
  displayPrefName,
  year,
  displayExamName,
  displayExamDateDots,
  displayExamDate,
  isExpired
}: {
  displayPrefName: string;
  year: string;
  displayExamName: string;
  displayExamDateDots: string;
  displayExamDate: string;
  isExpired: boolean;
}) {
  const countdownRef = useRef<CountdownFullscreenBoxRef>(null);

  // 全画面表示関数をグローバルに公開
  if (typeof window !== 'undefined') {
    (window as any).requestCountdownFullscreen = () => {
      countdownRef.current?.requestFullscreen();
    };
  }

  return (
    <CountdownFullscreenBox
      ref={countdownRef}
      displayPrefName={displayPrefName}
      year={year}
      displayExamName={displayExamName}
      displayExamDateDots={displayExamDateDots}
      displayExamDate={displayExamDate}
      isExpired={isExpired}
    />
  );
}
