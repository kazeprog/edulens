import React from 'react';

export const SeoIntro = () => {
    return (
        <div className="w-full max-w-2xl mx-auto my-6 px-4 text-center">
            <p className="text-sm text-slate-600 leading-relaxed">
                大学入試や高校入試までの残り日数を可視化することで、受験生の学習計画や保護者のサポート方針を立てやすくなります。
                <br className="hidden sm:inline" />
                受験直前期は、塾やオンライン学習サービス、家庭教師などの学習支援を検討する家庭も多く、費用や学習効果を比較しながら最適な学習方法を選ぶことが重要です。
            </p>
        </div>
    );
};

export const SeoParentsSection = () => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-16 mb-8 px-6 py-8 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <h3 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                保護者の方へ：受験までにできる学習サポート
            </h3>
            <div className="text-sm leading-relaxed text-slate-600 space-y-4">
                <p>
                    受験までの残り日数を把握することは、学習計画を立てる上で非常に重要です。特に共通テストや高校入試を控えた受験生にとって、塾やオンライン予備校、家庭教師などの学習支援サービスをどのタイミングで利用するかは大きな判断ポイントとなります。
                </p>
                <p>
                    家庭によっては、学習塾の費用やオンライン教材の料金、タブレット学習のコストなどを比較しながら、最適な受験対策を検討する必要があります。受験までの残り期間に応じて、短期集中型の講座や個別指導を選ぶケースも増えています。
                </p>
            </div>
        </div>
    );
};
