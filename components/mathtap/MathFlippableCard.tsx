'use client';

import { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFlippableCardProps {
    problemNumber: number;
    question: string; // LaTeX
    answer: string;   // LaTeX or text
    isFlipped: boolean;
    isTapped: boolean;
    onFlip: () => void;
    onTap: () => void;
    minHeight?: number;
}

export default function MathFlippableCard({
    problemNumber,
    question,
    answer,
    isFlipped,
    isTapped,
    onFlip,
    onTap,
    minHeight = 128,
}: MathFlippableCardProps) {
    const [questionHtml, setQuestionHtml] = useState('');
    const [answerHtml, setAnswerHtml] = useState('');
    const [startX, setStartX] = useState<number | null>(null);
    const [startY, setStartY] = useState<number | null>(null);
    const [currentRotation, setCurrentRotation] = useState(0);
    const [isSwipeRotation, setIsSwipeRotation] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderMixedText = (text: string) => {
            if (!text) return '';
            const parts = text.split(/(\$[^$]+\$)/g);
            return parts.map(part => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const content = part.slice(1, -1);
                    try {
                        return katex.renderToString(content, { throwOnError: false, displayMode: false });
                    } catch (e) {
                        return content;
                    }
                }
                // Convert newlines to <br> for text parts
                return part.replace(/\r?\n/g, '<br />');
            }).join('');
        };

        try {
            setQuestionHtml(renderMixedText(question));
            setAnswerHtml(renderMixedText(answer));
        } catch (e) {
            console.error(e);
            setQuestionHtml(question);
            setAnswerHtml(answer);
        }
    }, [question, answer]);

    // isFlippedの変更を監視して回転状態を同期（外部からの変更時のみ）
    useEffect(() => {
        if (isSwipeRotation) {
            setIsSwipeRotation(false);
            return;
        }

        if (isFlipped && currentRotation % 360 === 0) {
            setCurrentRotation(prev => prev + 180);
        } else if (!isFlipped && currentRotation % 360 === 180) {
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

        const minSwipeDistance = 50;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            e.preventDefault();

            setIsSwipeRotation(true);
            setCurrentRotation(prev => {
                const newRotation = diffX > 0 ? prev + 180 : prev - 180;
                return newRotation;
            });

            onFlip();
        }

        setStartX(null);
        setStartY(null);
    };

    const handleClick = () => {
        onTap();
    };

    return (
        <div className="mb-6" style={{ perspective: '1000px' }}>
            <div
                ref={cardRef}
                className={`relative w-full cursor-pointer transition-transform duration-700 ease-out touch-pan-y`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${currentRotation}deg)`,
                    display: 'grid',
                    gridTemplateAreas: '"card"',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
            >
                {/* カード表面（問題のみ） */}
                <div
                    className={`w-full rounded-2xl border-2 transition-colors duration-200 ${isTapped
                        ? 'bg-blue-100 border-blue-400 text-gray-900'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                        } flex flex-col px-6 py-5`}
                    style={{
                        backfaceVisibility: 'hidden',
                        gridArea: 'card',
                        minHeight: `${minHeight}px`
                    }}
                >
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <span className="text-lg font-bold text-blue-500 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            {problemNumber}
                        </span>
                        <div
                            className="font-semibold text-xl text-gray-900 break-words flex-1 leading-relaxed"
                            style={{ overflowWrap: 'anywhere' }}
                            dangerouslySetInnerHTML={{ __html: questionHtml }}
                        />
                    </div>
                    <div className="text-xs text-gray-400 text-right mt-4 font-medium flex items-center justify-end gap-1">
                        <span>答えを表示</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>

                {/* カード裏面（問題 + 答え） */}
                <div
                    className={`w-full rounded-2xl border-2 transition-colors duration-200 ${isTapped
                        ? 'bg-blue-100 border-blue-400 text-gray-900'
                        : 'bg-white border-blue-200 hover:bg-blue-50'
                        } flex flex-col px-6 py-5`}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        gridArea: 'card',
                        minHeight: `${minHeight}px`
                    }}
                >
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <span className="text-lg font-bold text-gray-400 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            {problemNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div
                                className="font-medium text-lg text-gray-500 mb-3 break-words leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: questionHtml }}
                            />
                            <div className="relative pt-3 border-t border-blue-100">
                                <span className="absolute -top-3 left-0 px-2 bg-white text-xs font-bold text-blue-500">ANSWER</span>
                                <div className="text-xl font-bold text-gray-900 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }}>
                                    <span dangerouslySetInnerHTML={{ __html: answerHtml }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 text-right mt-4 font-medium flex items-center justify-end gap-1">
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span>問題に戻る</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
