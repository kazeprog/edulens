'use client';

import { useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTestCardProps {
    problemNumber: number;
    question: string; // LaTeX
    answer: string;   // LaTeX or text
    isTapped: boolean;
    showAnswers: boolean;
    onTap: () => void;
}

export default function MathTestCard({
    problemNumber,
    question,
    answer,
    isTapped,
    showAnswers,
    onTap
}: MathTestCardProps) {
    const [questionHtml, setQuestionHtml] = useState('');
    const [answerHtml, setAnswerHtml] = useState('');

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

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onTap}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTap();
            }}
            className={`test-card border rounded-xl p-4 shadow-sm min-h-[120px] h-auto flex flex-col transition-colors duration-150 cursor-pointer ${isTapped ? "bg-blue-100 border-blue-400 text-blue-800" : "bg-white hover:bg-gray-50"
                }`}
        >
            <div className="flex items-start gap-3 min-w-0">
                <span className="text-lg md:text-xl text-gray-800 flex-shrink-0 mt-0.5">•</span>
                <div className="min-w-0 flex-1">
                    <div
                        className="font-medium text-lg md:text-xl text-gray-900 break-words leading-relaxed"
                        style={{ overflowWrap: 'anywhere' }}
                        dangerouslySetInnerHTML={{ __html: `${questionHtml} <span class="text-gray-500 text-base ml-1">(${problemNumber})</span>` }}
                    />
                </div>
            </div>
            <div
                className={`answer-content mt-3 text-gray-800 break-words min-w-0 transition-all duration-300 ${showAnswers ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    display: 'block',
                    maxHeight: 'none',
                    minHeight: '1.5em'
                }}
                dangerouslySetInnerHTML={{ __html: answerHtml }}
            />
        </div>
    );
}
