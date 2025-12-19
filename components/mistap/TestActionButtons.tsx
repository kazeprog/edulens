interface Word {
    word_number: number;
    word: string;
    meaning: string;
}

interface TestActionButtonsProps {
    showAnswers: boolean;
    onToggleAnswers: () => void;
    onFinish: () => void;
    onCancel: () => void;
    onPrint?: () => void;
}

export function MobileActionButtons({
    showAnswers,
    onToggleAnswers,
    onFinish,
    onCancel,
}: TestActionButtonsProps) {
    return (
        <div className="block md:hidden space-y-3">
            <button
                onClick={onToggleAnswers}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-lg"
                aria-pressed={showAnswers}
            >
                答え（{showAnswers ? '非表示' : '表示'}）
            </button>
            <button
                onClick={onFinish}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg text-lg font-semibold"
            >
                間違えた単語をタップ完了
            </button>
            <button
                onClick={onCancel}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 px-4 rounded-lg text-lg"
            >
                戻る
            </button>
        </div>
    );
}

export function DesktopActionButtons({
    showAnswers,
    onToggleAnswers,
    onFinish,
    onCancel,
    onPrint,
}: TestActionButtonsProps) {
    return (
        <div className="hidden md:flex md:justify-between md:items-center">
            <button
                onClick={onCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
                戻る
            </button>
            <div className="flex items-center gap-2">
                {onPrint && (
                    <button
                        onClick={onPrint}
                        className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 hover:border-red-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                        title="問題と解答をPDF印刷"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        印刷
                    </button>
                )}
                <button
                    onClick={onToggleAnswers}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    aria-pressed={showAnswers}
                >
                    答え（{showAnswers ? '非表示' : '表示'}）
                </button>
                <button
                    onClick={onFinish}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    間違えた単語をタップ完了
                </button>
            </div>
        </div>
    );
}
