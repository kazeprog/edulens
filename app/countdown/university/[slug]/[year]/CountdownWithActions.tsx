"use client";
import { useRef } from "react";
import CountdownFullscreenBox, { CountdownFullscreenBoxRef } from "./CountdownFullscreenBox";

export default function CountdownWithActions({
  eventName,
  year,
  eventDateDots,
  eventDate,
  isExpired
}: {
  eventName: string;
  year: string;
  eventDateDots: string;
  eventDate: string;
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
      eventName={eventName}
      year={year}
      eventDateDots={eventDateDots}
      eventDate={eventDate}
      isExpired={isExpired}
    />
  );
}
