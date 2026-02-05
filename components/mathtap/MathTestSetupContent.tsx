'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getAvailableGrades, getUnitsForGrade } from '@/lib/mathtap/mathDataUtils';

export default function MathTestSetupContent() {
    const router = useRouter();
    const grades = useMemo(() => getAvailableGrades(), []);

    const [selectedGrade, setSelectedGrade] = useState<string>(grades[0] || '');

    const units = useMemo(() => {
        return selectedGrade ? getUnitsForGrade(selectedGrade) : [];
    }, [selectedGrade]);

    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [problemCount, setProblemCount] = useState<number>(5);

    const startTest = () => {
        if (!selectedGrade || !selectedUnit) {
            alert('学年と単元を選択してください');
            return;
        }

        // URLクエリパラメータで条件を渡す
        const params = new URLSearchParams({
            grade: selectedGrade,
            unit: selectedUnit,
            count: problemCount.toString()
        });

        router.push(`/mathtap/test?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-navy-100">
            <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">Mathtap テスト設定</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">学年</label>
                    <div className="grid grid-cols-3 gap-2">
                        {grades.map(grade => (
                            <button
                                key={grade}
                                onClick={() => { setSelectedGrade(grade); setSelectedUnit(''); }}
                                className={`py-2 px-4 rounded-lg border-2 font-medium transition-all ${selectedGrade === grade
                                    ? 'border-navy-600 bg-navy-50 text-navy-800'
                                    : 'border-gray-200 text-gray-600 hover:border-navy-300'
                                    }`}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedGrade && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">単元</label>
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-800"
                        >
                            <option value="">単元を選択してください</option>
                            {units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">問題数</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[5, 10, 20].map(cnt => (
                            <button
                                key={cnt}
                                onClick={() => setProblemCount(cnt)}
                                className={`py-2 px-4 rounded-lg border-2 font-medium transition-all ${problemCount === cnt
                                    ? 'border-navy-600 bg-navy-50 text-navy-800'
                                    : 'border-gray-200 text-gray-600 hover:border-navy-300'
                                    }`}
                            >
                                {cnt}問
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={startTest}
                    disabled={!selectedUnit}
                    className={`w-full py-4 mt-4 rounded-xl font-bold text-lg shadow-md transition-all ${selectedUnit
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    テスト開始
                </button>
            </div>
        </div>
    );
}
