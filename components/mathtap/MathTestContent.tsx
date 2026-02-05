'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProblems, MathProblem } from '@/lib/mathtap/mathDataUtils';
import MathFlippableCard from './MathFlippableCard';
import MathTestCard from './MathTestCard';
import Background from '@/components/mistap/Background';
import { MobileMathActionButtons, DesktopMathActionButtons } from './MathActionButtons';
import { supabase } from '@/lib/mistap/supabaseClient';

export default function MathTestContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [problems, setProblems] = useState<MathProblem[]>([]);
    const [tappedIds, setTappedIds] = useState<Set<number>>(new Set());
    const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
    const [showAnswers, setShowAnswers] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const desktopGridRef = useRef<HTMLDivElement | null>(null);
    const mobileCardsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const grade = searchParams.get('grade');
        const unit = searchParams.get('unit');
        const count = parseInt(searchParams.get('count') || '5', 10);

        if (!grade || !unit) {
            router.replace('/mathtap/test-setup');
            return;
        }

        const p = getProblems(grade, unit, count);
        setProblems(p);
        setIsLoading(false);

        if (p.length === 0) {
            router.replace('/mathtap/test-setup');
        }
    }, [searchParams, router]);

    const toggleTapped = (id: number) => {
        setTappedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleFlipped = (id: number) => {
        setFlippedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleToggleAnswers = () => {
        setShowAnswers(prev => !prev);
        // モバイル: showAnswersがONになったら全カードをフリップ
        if (!showAnswers && Array.isArray(problems)) {
            const allProblemNumbers = new Set(problems.map(p => p.problem_number));
            setFlippedIds(allProblemNumbers);
        } else {
            setFlippedIds(new Set());
        }
    };

    const handleFinish = async () => {
        // tappedIds = 間違えた問題
        const incorrects = problems.filter(p => tappedIds.has(p.problem_number)).map(p => ({
            word_number: p.problem_number,
            word: p.question,
            meaning: p.answer
        }));

        const total = problems.length;
        const correctCount = total - incorrects.length;
        const grade = searchParams.get('grade');
        const unit = searchParams.get('unit');

        // 結果データを結果ページに渡す（保存は結果ページで行う）
        const resultData = encodeURIComponent(JSON.stringify({
            grade,
            unit,
            total,
            correct: correctCount,
            incorrects
        }));

        // attemptIdを生成して結果ページに渡す（重複保存防止のため）
        const attemptId = Date.now().toString();
        router.push(`/mathtap/results?data=${resultData}&t=${attemptId}`);
    };

    const handleCancel = () => {
        router.push('/mathtap/test-setup');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Background className="flex justify-center items-start min-h-screen">
                    <div className="text-white text-xl" style={{ marginTop: 'calc(64px + 48px)' }}>Loading...</div>
                </Background>
            </div>
        );
    }

    if (problems.length === 0) return null;

    // 2列表示用（デスクトップ）
    const leftProblems = problems.filter((_, i) => i % 2 === 0);
    const rightProblems = problems.filter((_, i) => i % 2 === 1);

    const testTitle = `${searchParams.get('grade')} - ${searchParams.get('unit')} 小テスト`;

    return (
        <div className="min-h-screen">
            <Background className="flex justify-center items-start min-h-screen p-4">
                <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full md:max-w-6xl border border-white/50" style={{ marginTop: '25px' }}>
                    <h1 className="text-2xl font-bold text-center text-blue-900 mb-6" translate="no">
                        {testTitle}
                    </h1>

                    <div className="mb-3 md:mb-8" translate="no">
                        {/* Mobile: Flip cards */}
                        <div ref={mobileCardsRef} className="block md:hidden px-3" style={{ maxWidth: '100%' }}>
                            {problems.map((problem) => (
                                <MathFlippableCard
                                    key={problem.problem_number}
                                    problemNumber={problem.problem_number}
                                    question={problem.question}
                                    answer={problem.answer}
                                    isFlipped={flippedIds.has(problem.problem_number)}
                                    isTapped={tappedIds.has(problem.problem_number)}
                                    onFlip={() => toggleFlipped(problem.problem_number)}
                                    onTap={() => toggleTapped(problem.problem_number)}
                                />
                            ))}
                        </div>

                        {/* Desktop: 2-column layout */}
                        <div ref={desktopGridRef} className="hidden md:grid md:grid-cols-2 md:gap-6">
                            <ul>
                                {leftProblems.map((problem) => (
                                    <li key={problem.problem_number} className="mb-6">
                                        <MathTestCard
                                            problemNumber={problem.problem_number}
                                            question={problem.question}
                                            answer={problem.answer}
                                            isTapped={tappedIds.has(problem.problem_number)}
                                            showAnswers={showAnswers}
                                            onTap={() => toggleTapped(problem.problem_number)}
                                        />
                                    </li>
                                ))}
                            </ul>
                            <ul>
                                {rightProblems.map((problem) => (
                                    <li key={problem.problem_number} className="mb-6">
                                        <MathTestCard
                                            problemNumber={problem.problem_number}
                                            question={problem.question}
                                            answer={problem.answer}
                                            isTapped={tappedIds.has(problem.problem_number)}
                                            showAnswers={showAnswers}
                                            onTap={() => toggleTapped(problem.problem_number)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <MobileMathActionButtons
                        showAnswers={showAnswers}
                        onToggleAnswers={handleToggleAnswers}
                        onFinish={handleFinish}
                        onCancel={handleCancel}
                    />

                    <DesktopMathActionButtons
                        showAnswers={showAnswers}
                        onToggleAnswers={() => setShowAnswers(prev => !prev)}
                        onFinish={handleFinish}
                        onCancel={handleCancel}
                    />
                </div>
            </Background>
        </div>
    );
}
