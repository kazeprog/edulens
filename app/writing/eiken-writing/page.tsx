"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import imageCompression from "browser-image-compression"
import { Loader2, Upload, AlertCircle, CheckCircle2, Award, BookOpen, Layout } from "lucide-react"

import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from "@/lib/supabase";
import UpgradeButton from "@/components/UpgradeButton";

type AnalysisResult = {
    transcribed_text: string
    topic_recognition: string
    score: {
        content: number
        structure: number
        vocabulary: number
        grammar: number
        total: number
    }
    is_passing_level?: boolean
    corrections?: {
        original: string
        fixed: string
        type: string
        explanation: string
    }[]
    advice?: string
    model_answer?: string
}

const EikenLevels = [
    { value: "3", label: "3級" },
    { value: "pre-2", label: "準2級" },
    { value: "pre-2-plus", label: "準2級プラス" },
    { value: "2", label: "2級" },
    { value: "pre-1", label: "準1級" },
    { value: "1", label: "1級" },
]

export default function EikenWritingPage() {
    const { user, profile } = useAuth()
    const [selectedLevel, setSelectedLevel] = useState<string>("2")
    const [problemType, setProblemType] = useState<string>("opinion")
    const [imageA, setImageA] = useState<File | null>(null)
    const [imageB, setImageB] = useState<File | null>(null)
    const [previewA, setPreviewA] = useState<string | null>(null)
    const [previewB, setPreviewB] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isDetailAnalyzing, setIsDetailAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isProcessingA, setIsProcessingA] = useState(false)
    const [isProcessingB, setIsProcessingB] = useState(false)

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 1, // Max size in MB
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        }
        try {
            return await imageCompression(file, options)
        } catch (error) {
            console.error("Compression error:", error)
            return file
        }
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'A' | 'B') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (type === 'A') setIsProcessingA(true)
            else setIsProcessingB(true)

            try {
                const compressedFile = await compressImage(file)

                const reader = new FileReader()
                reader.onloadend = () => {
                    if (type === 'A') {
                        setImageA(compressedFile)
                        setPreviewA(reader.result as string)
                        setIsProcessingA(false)
                    } else {
                        setImageB(compressedFile)
                        setPreviewB(reader.result as string)
                        setIsProcessingB(false)
                    }
                }
                reader.readAsDataURL(compressedFile)
            } catch (error) {
                console.error("Error processing image:", error)
                if (type === 'A') setIsProcessingA(false)
                else setIsProcessingB(false)
            }
        }
    }

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64String = reader.result as string
                // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = base64String.split(',')[1]
                resolve(base64)
            }
            reader.onerror = (error) => reject(error)
        })
    }

    const handleAnalyze = async () => {
        if (!imageA || !imageB) {
            setError("問題文と解答用紙の両方の画像をアップロードしてください。")
            return
        }

        setIsAnalyzing(true)
        setError(null)
        setResult(null)

        try {
            const images: string[] = []
            if (imageA) images.push(await convertToBase64(imageA))
            images.push(await convertToBase64(imageB))

            const supabase = getSupabase();
            let token = "";
            if (supabase) {
                const { data } = await supabase.auth.getSession();
                token = data.session?.access_token || "";
            }

            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            // Step 1: Basic Analysis (Scan & Score)
            const responseBasic = await fetch("/api/analyze/basic", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    images,
                    level: selectedLevel,
                    problemType,
                }),
            })

            const dataBasic = await responseBasic.json()

            if (!responseBasic.ok) {
                if (responseBasic.status === 429) {
                    throw new Error(dataBasic.message || "本日の利用上限に達しました。明日またお試しください。")
                }
                throw new Error(dataBasic.message || "解析中にエラーが発生しました。")
            }

            // Show Score immediately
            setResult(dataBasic);
            setIsAnalyzing(false); // Stop main spinner
            setIsDetailAnalyzing(true); // Start detail spinner

            // Step 2: Detail Analysis(Corrections & Advice)
            const responseDetail = await fetch("/api/analyze/detail", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    transcribed_text: dataBasic.transcribed_text,
                    level: selectedLevel,
                    problemType,
                    wordLimit: dataBasic.detected_word_limit,
                }),
            })

            const dataDetail = await responseDetail.json();

            if (!responseDetail.ok) {
                // Non-fatal? Maybe just show error in detail section or toast
                console.error("Detail analysis failed", dataDetail);
            } else {
                setResult(prev => prev ? { ...prev, ...dataDetail } : dataDetail);
            }

        } catch (err: any) {
            setError(err.message || "予期せぬエラーが発生しました。")
            setIsAnalyzing(false) // Ensure stopped on error
        } finally {
            setIsDetailAnalyzing(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SiteHeader />
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            英検®AI添削
                        </h1>
                        <div className="mt-4 text-gray-500 max-w-2xl mx-auto space-y-4">
                            <p className="text-xl font-bold text-gray-800">
                                「"なんとなく"の添削ではなく、"英検専用"の採点。」
                            </p>
                            <p className="text-base leading-relaxed">
                                ただ英語を直すだけではありません。 EduLensでは「英検の観点（内容・構成・語彙・文法）」を学習したAIがあなたの答案を採点、アドバイスします。
                            </p>
                            <p className="text-base leading-relaxed">
                                まずは1回、登録なしでお試しください。無料のアカウント作成で「1日3回」まで、Proプランなら「無制限」で何度でも添削を受けられます。
                            </p>
                        </div>

                        {/* Pro Upgrade Button */}
                        {user && !profile?.is_pro && (
                            <div className="mt-8 flex justify-center">
                                <UpgradeButton userId={user.id} />
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 mb-8 border border-gray-100">
                        {/* Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">受験級</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 bg-gray-50 text-gray-900"
                                >
                                    {EikenLevels.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">問題タイプ</label>
                                <select
                                    value={problemType}
                                    onChange={(e) => setProblemType(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 bg-gray-50 text-gray-900"
                                >
                                    <option value="opinion">意見論述 (Writing)</option>
                                    <option value="summary">要約 (Summary)</option>
                                    <option value="email">Eメール (Email)</option>
                                </select>
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* File A */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    問題文の画像 <span className="text-red-500">*</span>
                                </label>
                                <div className={`relative border-2 border-dashed rounded-xl p-4 h-64 flex flex-col items-center justify-center transition-colors ${previewA ? "border-indigo-500 bg-indigo-50" : !imageA && error ? "border-red-300 bg-red-50" : "border-gray-300 text-gray-400 hover:border-gray-400 hover:bg-gray-50"
                                    }`}>
                                    {isProcessingA ? (
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                            <span className="text-sm text-gray-500">画像を処理中...</span>
                                        </div>
                                    ) : previewA ? (
                                        <div className="relative w-full h-full">
                                            <Image src={previewA} alt="Preview A" fill className="object-contain rounded-lg" />
                                            <button
                                                onClick={() => {
                                                    setImageA(null)
                                                    setPreviewA(null)
                                                }}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center self-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload-a" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>画像をアップロード</span>
                                                    <input id="file-upload-a" name="file-upload-a" type="file" className="sr-only" onChange={(e) => handleImageChange(e, 'A')} accept="image/*" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">問題文がある方が精度が上がります</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* File B */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    解答の画像 <span className="text-red-500">*</span>
                                </label>
                                <div className={`relative border-2 border-dashed rounded-xl p-4 h-64 flex flex-col items-center justify-center transition-colors ${previewB ? "border-indigo-500 bg-indigo-50" : "border-gray-300 text-gray-400 hover:border-gray-400 hover:bg-gray-50"
                                    }`}>
                                    {isProcessingB ? (
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                            <span className="text-sm text-gray-500">画像を処理中...</span>
                                        </div>
                                    ) : previewB ? (
                                        <div className="relative w-full h-full">
                                            <Image src={previewB} alt="Preview B" fill className="object-contain rounded-lg" />
                                            <button
                                                onClick={() => {
                                                    setImageB(null)
                                                    setPreviewB(null)
                                                }}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center self-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload-b" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>画像をアップロード</span>
                                                    <input id="file-upload-b" name="file-upload-b" type="file" className="sr-only" onChange={(e) => handleImageChange(e, 'B')} accept="image/*" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">文字がはっきり見えるように撮影してください</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || isDetailAnalyzing}
                                className={`flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 ${isAnalyzing || isDetailAnalyzing ? "opacity-75 cursor-wait" : ""
                                    }`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                        AIが採点中... (約20秒)
                                    </>
                                ) : (
                                    "添削を開始する"
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 rounded-md bg-red-50 text-red-700 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Result Section */}
                    {result && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Score Card */}
                            {/* Score Card */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <CheckCircle2 className="mr-2" /> 採点結果
                                    </h2>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6">
                                    <div className="text-center md:text-left min-w-[150px]">
                                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Score</p>
                                        <p className="text-5xl font-extrabold text-gray-900 mt-1">
                                            {result.score.total} <span className="text-2xl text-gray-400 font-normal">/ 16</span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full md:flex-1">
                                        {[
                                            { key: 'content', label: 'Content', icon: <BookOpen className="w-5 h-5 mx-auto mb-1 text-gray-400" /> },
                                            { key: 'structure', label: 'Structure', icon: <Layout className="w-5 h-5 mx-auto mb-1 text-gray-400" /> },
                                            { key: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="w-5 h-5 mx-auto mb-1 text-gray-400" /> },
                                            { key: 'grammar', label: 'Grammar', icon: <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-gray-400" /> }
                                        ].map((item) => (
                                            <div key={item.key} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                                                <div className="md:hidden">{item.icon}</div>
                                                <p className="text-xs text-secondary-500 font-bold uppercase mb-1">{item.label}</p>
                                                <p className="text-xl font-bold text-gray-800">
                                                    {/* @ts-ignore */}
                                                    {result.score[item.key]} <span className="text-xs text-gray-400">/ 4</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Transcribed Text & Corrections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">読み取りテキスト</h3>
                                    {result.topic_recognition && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <span className="text-xs font-bold text-blue-600 uppercase block mb-1">読み取ったトピック</span>
                                            <p className="text-sm text-gray-700">{result.topic_recognition}</p>
                                        </div>
                                    )}
                                    <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto">
                                        <p className="whitespace-pre-wrap font-mono text-sm">{result.transcribed_text}</p>
                                    </div>
                                </div>

                                {/* Detailed Analysis Section (Loaded Progressively) */}
                                {isDetailAnalyzing && (
                                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                        <p className="text-gray-600 font-medium animate-pulse">詳細な添削とアドバイスを生成中...</p>
                                        <p className="text-sm text-gray-400 mt-2">※スコアは上記をご確認ください</p>
                                    </div>
                                )}

                                {result.corrections && result.advice && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 space-y-8">
                                        {/* Pass/Fail Judgment */}
                                        {/* Corrections */}
                                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">添削・修正点</h3>
                                            {result.corrections.length > 0 ? (
                                                <ul className="space-y-4">
                                                    {result.corrections.map((correction, idx) => (
                                                        <li key={idx} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-[10px] font-bold text-red-500 uppercase px-2 py-0.5 bg-white/80 rounded border border-red-100">
                                                                        {correction.type}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-xs font-bold text-red-500 uppercase min-w-[60px]">Original:</span>
                                                                    <span className="text-gray-800 font-medium bg-red-100/50 px-1 rounded">{correction.original}</span>
                                                                </div>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-xs font-bold text-green-600 uppercase min-w-[60px]">Fixed:</span>
                                                                    <span className="text-gray-900 font-medium">{correction.fixed}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-2 p-3 bg-white/60 rounded-lg text-sm leading-relaxed">
                                                                    {correction.explanation}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
                                                    <p className="font-medium">素晴らしい！修正が必要な箇所は見当たりませんでした。</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Review & Model Answer */}
                                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">総評 & アドバイス</h3>
                                            <div className={`p-6 rounded-xl border-l-4 mb-6 ${result.is_passing_level
                                                ? "bg-green-50 border-green-500"
                                                : "bg-orange-50 border-orange-500"
                                                }`}>
                                                <h4 className={`text-lg font-bold mb-2 flex items-center ${result.is_passing_level ? "text-green-800" : "text-orange-800"
                                                    }`}>
                                                    {result.is_passing_level ? (
                                                        <><CheckCircle2 className="w-5 h-5 mr-2" /> 合格圏内です！</>
                                                    ) : (
                                                        <><AlertCircle className="w-5 h-5 mr-2" /> あと少し！</>
                                                    )}
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.advice}</p>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-4">模範解答</h3>
                                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-gray-800 leading-relaxed font-serif">
                                                {result.model_answer}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </div >
    )
}

function ScoreItem({ label, score, icon }: { label: string, score?: number, icon: React.ReactNode }) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-1">{icon}</div>
            <p className="text-xs text-secondary-500 font-bold uppercase mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-800">
                {score ?? "-"} <span className="text-xs text-gray-400">/ 4</span>
            </p>
        </div>
    )
}
