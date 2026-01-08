'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SubscriptionSuccessPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Fire confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border border-slate-100">
                <div className="mb-6 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Proプランへようこそ！
                </h1>

                <p className="text-slate-600 mb-8 text-lg">
                    アップグレードありがとうございます。<br />
                    制限なしで全ての機能をご利用いただけるようになりました。
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 text-left border border-blue-100">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <span className="bg-blue-600 w-2 h-2 rounded-full mr-2"></span>
                        Proプランでできること
                    </h3>
                    <ul className="space-y-2 text-slate-600 ml-4">
                        <li>• AIによる無制限の添削</li>
                    </ul>
                </div>

                <Link
                    href="/"
                    className="group inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                    学習を再開する
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <p className="mt-8 text-slate-400 text-sm">
                ご不明な点がございましたら、サポートまでお問い合わせください。
            </p>
        </div>
    );
}
