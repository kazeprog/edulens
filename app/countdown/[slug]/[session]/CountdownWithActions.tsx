"use client";
import { useRef } from "react";
import CountdownFullscreenBox, { CountdownFullscreenBoxRef } from "./CountdownFullscreenBox";

export default function CountdownWithActions({
  examName,
  sessionName,
  displayExamDateDots,
  displayExamDate,
  isExpired
}: {
  examName: string;
  sessionName: string;
  displayExamDateDots: string;
  displayExamDate: string;
  isExpired: boolean;
}) {
  const countdownRef = useRef<CountdownFullscreenBoxRef>(null);

  if (typeof window !== 'undefined') {
    (window as any).requestCountdownFullscreen = () => {
      countdownRef.current?.requestFullscreen();
    };
  }

  return (
    <CountdownFullscreenBox
      ref={countdownRef}
      examName={examName}
      sessionName={sessionName}
      displayExamDateDots={displayExamDateDots}
      displayExamDate={displayExamDate}
      isExpired={isExpired}
    />
  );
}
