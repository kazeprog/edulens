interface PrintWarningModalProps {
    testWordCount: number;
    onRecreate20Words: () => void;
    onPrintAnyway: () => void;
    onCancel: () => void;
}

export default function PrintWarningModal({
    testWordCount,
    onRecreate20Words,
    onPrintAnyway,
    onCancel,
}: PrintWarningModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    ⚠️ 語数が多すぎます
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    現在のテストは<strong className="text-red-600">{testWordCount}語</strong>です。<br />
                    印刷時のレイアウトは<strong>20語までがおすすめ</strong>です。
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onRecreate20Words}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                        20語で作成し直す
                    </button>
                    <button
                        onClick={onPrintAnyway}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
                    >
                        このまま印刷する
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
}
