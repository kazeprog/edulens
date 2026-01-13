import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import React from 'react';

export const metadata = {
    title: '特定商取引法に基づく表記',
    robots: {
        index: false,
        follow: false,
    },
};

export default function TokushoPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-8 border-b border-slate-100">
                        <h1 className="text-2xl font-bold text-center text-slate-800">
                            特定商取引法に基づく表記
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8">
                        <dl className="divide-y divide-slate-100 border-t border-b border-slate-100">
                            {/* 販売業者 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    販売業者
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    戸塚風威
                                </dd>
                            </div>

                            {/* 運営統括責任者 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    運営統括責任者
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    戸塚風威
                                </dd>
                            </div>

                            {/* 所在地 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    所在地
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    お客様からのご請求があり次第、遅滞なく開示いたします。
                                </dd>
                            </div>

                            {/* 電話番号 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    電話番号
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    <p>お客様からのご請求があり次第、遅滞なく開示いたします。</p>
                                    <p className="text-slate-500 text-xs mt-1">※お問い合わせはメールにて承ります</p>
                                </dd>
                            </div>

                            {/* メールアドレス */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    メールアドレス
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    edulens.mistap@gmail.com
                                </dd>
                            </div>

                            {/* 販売価格 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    販売価格
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    サイト内の価格表ページに表示された金額（税込）
                                </dd>
                            </div>

                            {/* 商品代金以外の必要料金 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    商品代金以外の必要料金
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    インターネット接続料金、通信料金
                                </dd>
                            </div>

                            {/* お支払い方法 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    お支払い方法
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    クレジットカード決済、コンビニ決済、PayPay決済
                                </dd>
                            </div>

                            {/* 代金の支払時期 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    代金の支払時期
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    各決済手段の規約に準じます
                                </dd>
                            </div>

                            {/* 商品の引渡時期 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    商品の引渡時期
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    決済完了後、直ちにご利用いただけます
                                </dd>
                            </div>

                            {/* 返品・キャンセル */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    返品・キャンセル
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    デジタルコンテンツの性質上、原則として返品・キャンセルはお受けできません。解約は次回更新日までにお手続きください。
                                </dd>
                            </div>

                            {/* 動作環境 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-5">
                                <dt className="text-sm font-medium text-slate-500 sm:text-slate-600 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                                    動作環境
                                </dt>
                                <dd className="text-sm text-slate-900 sm:col-span-2 sm:mt-0 mt-1 pl-2 sm:pl-0">
                                    最新のGoogle Chrome, Safari, Edge / iOS, Android
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
