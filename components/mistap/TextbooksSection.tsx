import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function TextbooksSection() {
    return (
        <section id="textbook-list" className="py-8 md:py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    対応教材一覧
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* 中学生向け教材 */}
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                        <h4 className="text-xl md:text-2xl font-semibold mb-6 text-center text-blue-600">
                            📚 中学生向け
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3 text-lg">✓</span>
                                <span className="text-gray-700">過去形</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3 text-lg">✓</span>
                                <span className="text-gray-700">過去形、過去分詞形</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3 text-lg">✓</span>
                                <span className="text-gray-700">絶対覚える英単語150</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3 text-lg">✓</span>
                                <span className="text-gray-700">ターゲット1800</span>
                            </li>
                        </ul>
                    </div>

                    {/* 高校生向け教材 */}
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                        <h4 className="text-xl md:text-2xl font-semibold mb-6 text-center text-red-600">
                            🎓 高校生向け
                        </h4>

                        {/* 英単語帳 */}
                        <div className="mb-6">
                            <h5 className="text-lg font-semibold mb-3 text-gray-800">英単語帳（小テスト対応）</h5>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">LEAP 小テスト</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">LEAP Basic 小テスト</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">ターゲット1200 小テスト</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">ターゲット1400 小テスト</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">システム英単語 小テスト</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">ターゲット1900 小テスト</span>
                                </li>
                            </ul>
                        </div>

                        {/* 古文単語帳 */}
                        <div>
                            <h5 className="text-lg font-semibold mb-3 text-gray-800">古文単語帳</h5>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">重要古文単語315</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">Key＆Point古文単語330</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">ベストセレクション古文単語325</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">✓</span>
                                    <span className="text-gray-700 text-sm md:text-base">理解を深める核心古文単語351</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 社会人・大学生向け教材 */}
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                        <h4 className="text-xl md:text-2xl font-semibold mb-6 text-center text-purple-600">
                            💼 社会人・大学生向け
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3 text-lg">✓</span>
                                <span className="text-gray-700">TOEIC L&R TEST 出る単特急金のフレーズ</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* 追加の説明 */}
                <div className="mt-8 md:mt-12 text-center">
                    <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-4">
                        どの教材から始めるか迷ったら、単語帳診断で目的に合う候補を確認できます。<br className="hidden md:inline" />
                        追加してほしい教材があれば、リクエストからお知らせください。
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/mistap/textbook-diagnosis"
                            prefetch={false}
                            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-6 rounded-lg font-semibold transition-colors"
                        >
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            単語帳診断をする
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/mistap/contact"
                            prefetch={false}
                            className="inline-flex items-center justify-center border border-slate-300 bg-white hover:border-blue-300 hover:text-blue-700 text-slate-700 py-2.5 px-6 rounded-lg font-semibold transition-colors"
                        >
                            単語帳リクエスト
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
