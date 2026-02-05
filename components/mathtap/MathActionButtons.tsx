interface MathActionButtonsProps {
    showAnswers: boolean;
    onToggleAnswers: () => void;
    onFinish: () => void;
    onCancel: () => void;
}

export function MobileMathActionButtons({
    showAnswers,
    onToggleAnswers,
    onFinish,
    onCancel,
}: MathActionButtonsProps) {
    return (
        <div className="block md:hidden space-y-3">
            <button
                onClick={onToggleAnswers}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-lg"
                aria-pressed={showAnswers}
            >
                答え（{showAnswers ? '非表示' : '表示'}）
            </button>
            <button
                onClick={onFinish}
                className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 px-4 rounded-lg text-lg font-semibold"
            >
                間違えた問題をタップ完了
            </button>
            <button
                onClick={onCancel}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-lg"
            >
                戻る
            </button>
        </div>
    );
}

export function DesktopMathActionButtons({
    showAnswers,
    onToggleAnswers,
    onFinish,
    onCancel,
}: MathActionButtonsProps) {
    return (
        <div className="hidden md:flex md:justify-between md:items-center">
            <button
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
                戻る
            </button>
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleAnswers}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    aria-pressed={showAnswers}
                >
                    答え（{showAnswers ? '非表示' : '表示'}）
                </button>
                <button
                    onClick={onFinish}
                    className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded"
                >
                    間違えた問題をタップ完了
                </button>
            </div>
        </div>
    );
}
