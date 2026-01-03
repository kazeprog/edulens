import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '運営者情報 | EduLens',
    description: 'EduLensの運営者情報と運営目的について。',
    robots: {
        index: false,
        follow: true,
    },
};

export default function OperatorPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-white py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto prose prose-slate">
                <h1>運営者情報</h1>

                <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 not-prose mb-12">
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-4">
                        <div className="sm:col-span-1 font-bold text-slate-700">屋号</div>
                        <div className="sm:col-span-2 text-slate-800">EduLens</div>

                        <div className="sm:col-span-1 font-bold text-slate-700">運営目的</div>
                        <div className="sm:col-span-2 text-slate-800 leading-relaxed">
                            「学習を、もっと効果的に」をミッションに、テクノロジーの力で学習者の目標達成を支援すること。<br /><br />
                            試験日までの時間を可視化する「Countdown」、効率的な記憶定着を促す「Mistap」、集中力を高める「EduTimer」などのツール開発・運営を通じて、自律的な学習をサポートします。
                        </div>

                        <div className="sm:col-span-1 font-bold text-slate-700">お問い合わせ</div>
                        <div className="sm:col-span-2">
                            <Link href="/contact" className="text-blue-600 hover:underline">
                                お問い合わせページ
                            </Link>
                            よりご連絡ください。
                        </div>
                    </dl>
                </div>

                <h2>EduLensについて</h2>
                <p>
                    EduLensは、受験生や資格取得を目指す方々が、より効率的かつ効果的に学習を進められるよう支援するためのWebプラットフォームです。
                    単なる情報提供にとどまらず、学習意欲の維持・向上や、具体的な学習プロセスの改善に寄与するツールの提供を目指しています。
                </p>
            </div>
        </div>
    );
}
