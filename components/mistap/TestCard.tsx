interface Word {
    word_number: number;
    word: string;
    meaning: string;
}

interface TestCardProps {
    word: Word;
    isTapped: boolean;
    showAnswers: boolean;
    onTap: () => void;
}

export default function TestCard({ word, isTapped, showAnswers, onTap }: TestCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onTap}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTap();
            }}
            className={`test-card border rounded-xl p-4 shadow-sm min-h-[120px] h-auto flex flex-col transition-colors duration-150 cursor-pointer ${isTapped ? "bg-red-100 border-red-400 text-red-800" : "bg-white hover:bg-gray-50"
                }`}
        >
            <div className="flex items-center gap-2 md:whitespace-nowrap">
                <span className="text-lg md:text-xl text-gray-900">•</span>
                <span className="font-medium text-lg md:text-xl text-gray-900">
                    {word.word}（{word.word_number}）
                </span>
            </div>
            <div
                className={`answer-content mt-3 text-gray-700 break-words min-w-0 transition-all duration-300 ${showAnswers ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    display: 'block',
                    maxHeight: 'none',
                    minHeight: '1.5em'
                }}
            >
                {word.meaning}
            </div>
        </div>
    );
}
