"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// サービス一覧データ（トップページと連動）
const SERVICES: {
    name: string;
    href: string;
    image?: string;
    icon?: LucideIcon;
    description: string;
    dark?: boolean;
    color?: string;
}[] = [
        {
            name: 'Countdown',
            href: '/countdown',
            image: '/CountdownLP.png',
            description: '試験日カウントダウン',
        },
        {
            name: 'Mistap',
            href: '/mistap',
            image: '/MistapLP.png',
            description: '単語学習システム',
        },
        {
            name: 'EduTimer',
            href: '/EduTimer',
            image: '/EdutimerLogo.png',
            description: 'ポモドーロタイマー',
        },
        {
            name: 'AI添削',
            href: '/writing',
            image: '/EduLensWriting.png',
            description: 'AI英作文添削',
            color: 'emerald',
        },
        {
            name: 'BlackLens',
            href: '/blacklens',
            image: '/BlacklensSquare.png',
            description: 'ストレス発散ボード',
            dark: true,
        },
    ];

interface ServiceListProps {
    currentService?: string;
}

export default function ServiceList({ currentService }: ServiceListProps) {
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const isPaused = useRef(false);
    const isUserScrolling = useRef(false);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastScrollLeft = useRef(0);

    // フィルタリングされたサービスリスト（ログイン状態に基づく）
    const filteredServices = SERVICES.filter(service => {
        if (service.name === 'Mistap') {
            return !!user; // ログイン時のみ表示
        }
        return true;
    });

    // 1セット分の幅を計算
    const cardWidth = 160;
    const gap = 16;
    const totalCardWidth = cardWidth + gap;
    const setWidth = totalCardWidth * filteredServices.length;

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        // ユーザーによるスクロール開始検出
        const handleTouchStart = () => {
            isUserScrolling.current = true;
            isPaused.current = true;
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
        };

        const handleTouchEnd = () => {
            isUserScrolling.current = false;
            resumeTimeoutRef.current = setTimeout(() => {
                isPaused.current = false;
            }, 500);
        };

        const handleWheel = () => {
            isPaused.current = true;
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
            resumeTimeoutRef.current = setTimeout(() => {
                isPaused.current = false;
            }, 500);
        };

        const animate = () => {
            if (!isPaused.current && scrollContainer) {
                scrollContainer.scrollLeft += 0.5;

                // 2セット目の終わりでループ（シームレス）
                if (scrollContainer.scrollLeft >= setWidth * 2) {
                    scrollContainer.scrollLeft = setWidth;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        // イベントリスナー
        scrollContainer.addEventListener('touchstart', handleTouchStart);
        scrollContainer.addEventListener('touchend', handleTouchEnd);
        scrollContainer.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
            scrollContainer.removeEventListener('touchstart', handleTouchStart);
            scrollContainer.removeEventListener('touchend', handleTouchEnd);
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, [setWidth]);

    // ホバー時の一時停止
    const handleMouseEnter = () => {
        isPaused.current = true;
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }
    };

    const handleMouseLeave = () => {
        resumeTimeoutRef.current = setTimeout(() => {
            isPaused.current = false;
        }, 500);
    };

    // 無限ループ用に5セット複製
    const displayServices = [...filteredServices, ...filteredServices, ...filteredServices, ...filteredServices, ...filteredServices];

    return (
        <section className="py-8 bg-white border-y border-slate-100">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider text-center">
                    EduLens サービス
                </h2>

                {/* スクロールコンテナ */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {displayServices.map((service, index) => {
                        const isDark = service.dark;

                        return (
                            <Link
                                key={`${service.name}-${index}`}
                                href={service.href}
                                prefetch={false}
                                className={`
                  flex-shrink-0 w-40 rounded-xl p-4 border transition-all
                  ${isDark
                                        ? 'bg-slate-900 border-slate-700 hover:border-purple-500'
                                        : service.color === 'emerald'
                                            ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                                    }
                `}
                            >
                                {/* アイコン */}
                                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                                    {service.image ? (
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : service.icon ? (
                                        <service.icon className={`w-8 h-8 ${service.color === 'emerald' ? 'text-emerald-600' : 'text-slate-600'}`} />
                                    ) : null}
                                </div>

                                {/* サービス名 */}
                                <h3 className={`text-sm font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {service.name}
                                </h3>

                                {/* 説明 */}
                                <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                    {service.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* スクロールバー非表示用CSS */}
            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
}
