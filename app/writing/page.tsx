"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react"

import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"

export default function WritingHubPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SiteHeader />
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            AI英作文添削
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            目的に合わせたコースを選択してください。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Eiken Writing */}
                        <Link
                            href="/writing/eiken-writing"
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                英検®対策
                            </h2>
                            <p className="text-gray-500 mb-6 flex-grow">
                                3級から1級まで対応。<br />
                                面接対策にも役立つ論理構成を学べます。
                            </p>
                            <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                添削を始める <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </Link>

                        {/* University Exam Writing (Coming Soon) */}
                        <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200 flex flex-col items-center text-center opacity-75 cursor-not-allowed">
                            <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-6">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-500 mb-2">
                                大学受験対策
                            </h2>
                            <p className="text-gray-500 mb-6 flex-grow">
                                志望校の傾向に合わせた自由英作文対策。<br />
                                （現在準備中です）
                            </p>
                            <span className="inline-flex items-center text-gray-400 font-semibold px-4 py-2 bg-gray-200 rounded-full text-sm">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    )
}
