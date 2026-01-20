'use client';

import { useState } from 'react';
import GenericExamManager from './GenericExamManager';
import HighSchoolExamManager from './HighSchoolExamManager';
import UniversityExamManager from './UniversityExamManager';
import ExamImporter from './ExamImporter';

export default function ExamManagerPage() {
    const [activeTab, setActiveTab] = useState<'generic' | 'highschool' | 'university' | 'import'>('generic');

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">試験日程管理</h2>

            {/* タブナビゲーション */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-8 inline-flex">
                <button
                    onClick={() => setActiveTab('generic')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generic'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    その他の試験
                </button>
                <button
                    onClick={() => setActiveTab('highschool')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'highschool'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    公立高校入試
                </button>
                <button
                    onClick={() => setActiveTab('university')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'university'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    大学入試
                </button>
                <button
                    onClick={() => setActiveTab('import')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'import'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    🤖 AIインポート
                </button>
            </div>

            {/* コンテンツエリア */}
            <div>
                {activeTab === 'generic' && <GenericExamManager />}
                {activeTab === 'highschool' && <HighSchoolExamManager />}
                {activeTab === 'university' && <UniversityExamManager />}
                {activeTab === 'import' && <ExamImporter />}
            </div>
        </div>
    );
}
