'use client';

import { useState as useReactState, useRef, RefObject } from 'react';
import Image from 'next/image';

interface ScreenshotCarouselProps {
    isManual: boolean;
    setIsManual: (value: boolean) => void;
    carouselOuterRef: RefObject<HTMLDivElement | null>;
    trackRef: RefObject<HTMLDivElement | null>;
    manualResumeTimerRef: RefObject<number | null>;
}

export default function ScreenshotCarousel({
    isManual,
    setIsManual,
    carouselOuterRef,
    trackRef,
    manualResumeTimerRef,
}: ScreenshotCarouselProps) {
    const startXRef = useRef<number | null>(null);
    const startScrollRef = useRef<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsManual(true);
        try {
            (e.target as Element).setPointerCapture?.(e.pointerId);
        } catch { }
        startXRef.current = e.clientX;
        if (carouselOuterRef.current) startScrollRef.current = carouselOuterRef.current.scrollLeft;
        if (manualResumeTimerRef.current) {
            clearTimeout(manualResumeTimerRef.current);
            (manualResumeTimerRef as { current: number | null }).current = null;
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (startXRef.current == null) return;
        const dx = startXRef.current - e.clientX;
        if (carouselOuterRef.current && startScrollRef.current != null) {
            carouselOuterRef.current.scrollLeft = startScrollRef.current + dx;
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        try {
            (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch { }
        startXRef.current = null;
        startScrollRef.current = null;
        (manualResumeTimerRef as { current: number | null }).current = window.setTimeout(() => setIsManual(false), 4000);
    };

    const handlePointerCancel = () => {
        startXRef.current = null;
        startScrollRef.current = null;
        (manualResumeTimerRef as { current: number | null }).current = window.setTimeout(() => setIsManual(false), 4000);
    };

    const handleNavClick = (direction: 'prev' | 'next') => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsManual(true);
        if (carouselOuterRef.current && trackRef.current) {
            const first = trackRef.current.children[0] as HTMLElement | undefined;
            if (first) {
                const style = window.getComputedStyle(first);
                const mr = parseFloat(style.marginRight || '0');
                const delta = direction === 'next' ? first.offsetWidth + mr : -(first.offsetWidth + mr);
                carouselOuterRef.current.scrollBy({ left: delta, behavior: 'smooth' });
                if (manualResumeTimerRef.current) clearTimeout(manualResumeTimerRef.current);
                (manualResumeTimerRef as { current: number | null }).current = window.setTimeout(() => setIsManual(false), 4000);
            }
        }
    };

    const screenshots = ['Screenshot1', 'Screenshot2', 'Screenshot3', 'Screenshot4', 'Screenshot5'];

    return (
        <section className="py-8 md:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    Mistap プレビュー
                </h3>
                <div
                    ref={carouselOuterRef}
                    className={`relative w-full ${isManual ? 'overflow-x-auto' : 'overflow-hidden'}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                >
                    <div ref={trackRef} className={`flex whitespace-nowrap ${isManual ? '' : 'animate-scroll-x'}`}>
                        {screenshots.map((name) => (
                            <div key={name + '-a'} className="relative flex-shrink-0 w-48 md:w-64 h-96 md:h-[32rem] rounded-xl shadow-lg border border-gray-200 mr-4 overflow-hidden">
                                <Image
                                    src={`/mistap/${name}.png`}
                                    alt={`Mistapアプリの${name}`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 192px, 256px"
                                />
                            </div>
                        ))}
                        {screenshots.map((name) => (
                            <div key={name + '-b'} className="relative flex-shrink-0 w-48 md:w-64 h-96 md:h-[32rem] rounded-xl shadow-lg border border-gray-200 mr-4 overflow-hidden">
                                <Image
                                    src={`/mistap/${name}.png`}
                                    alt={`Mistapアプリの${name}`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 192px, 256px"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Nav buttons */}
                    <button
                        aria-label="前へ"
                        className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors z-10"
                        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerUp={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onClick={handleNavClick('prev')}
                    >
                        ‹
                    </button>
                    <button
                        aria-label="次へ"
                        className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors z-10"
                        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerUp={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onClick={handleNavClick('next')}
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
