'use client';

import { Suspense } from 'react';
import Background from "@/components/mistap/Background";
import MistapFooter from "@/components/mistap/Footer";
import ReferralDashboard from "@/components/mistap/ReferralDashboard";
import ReferralClaimForm from "@/components/mistap/ReferralClaimForm";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReferralPage() {
    return (
        <div className="min-h-screen">
            <Background className="flex justify-center items-start min-h-screen p-4">
                <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full md:max-w-2xl border border-white/50" style={{ marginTop: 'calc(64px + 24px)' }}>

                    <div className="mb-6">
                        <Link href="/mistap/test-setup" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors mb-4 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" />
                            メニューに戻る
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">友達招待</h1>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <ReferralDashboard />
                        </section>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-50/50 text-slate-500">または</span>
                            </div>
                        </div>

                        <section>
                            <ReferralClaimForm />
                        </section>
                    </div>

                </div>
            </Background>
            <MistapFooter />
        </div>
    );
}
