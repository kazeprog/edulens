"use client"

import { useState } from "react"
import Image from "next/image"
import imageCompression from "browser-image-compression"
import { Loader2, Upload, AlertCircle, CheckCircle2, GraduationCap } from "lucide-react"

import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"

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
    is_passing_level: boolean
    corrections: {
        original: string
        fixed: string
        type: string
        explanation: string
    }[]
    advice: string
    model_answer: string
}

export default function UniversityWritingPage() {
    const [universityName, setUniversityName] = useState("")
    const [wordLimit, setWordLimit] = useState("")
    const [imageA, setImageA] = useState<File | null>(null) // Question
    const [imageB, setImageB] = useState<File | null>(null) // Answer (Handwritten)
    const [previewA, setPreviewA] = useState<string | null>(null)
    const [previewB, setPreviewB] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)

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
            const compressedFile = await compressImage(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                if (type === 'A') {
                    setImageA(compressedFile)
                    setPreviewA(reader.result as string)
                } else {
                    setImageB(compressedFile)
                    setPreviewB(reader.result as string)
                }
            }
            reader.readAsDataURL(compressedFile)
        }
    }

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64String = reader.result as string
                // Remove data URL prefix
                const base64 = base64String.split(',')[1]
                resolve(base64)
            }
            reader.onerror = (error) => reject(error)
        })
    }

    const handleAnalyze = async () => {
        if (!imageB) {
            setError("解答用紙の画像をアップロードしてください。")
            return
        }

        setIsAnalyzing(true)
        setError(null)
        setResult(null)

        try {
            const images: string[] = []
            if (imageA) images.push(await convertToBase64(imageA))
            images.push(await convertToBase64(imageB))

            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images,
                    examType: "university",
                    universityName,
                    wordLimit,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("本日の利用上限に達しました。明日またお試しください。")
                }
                throw new Error(data.message || "解析中にエラーが発生しました。")
            }

            setResult(data)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "予期せぬエラーが発生しました。")
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SiteHeader />
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            大学入試 AI英作文添削
                        </h1>
                        <div className="mt-4 text-gray-500 max-w-2xl mx-auto space-y-4">
                            <p className="text-xl font-bold text-gray-800">
                                「志望校に特化した、厳格な採点。」
                            </p>
                            <p className="text-base leading-relaxed">
                                難関大学入試の採点基準に基づき、AIが論理性・表現力を徹底指導。<br />
                                「減点されない工夫」と「合格するための表現」をアドバイスします。
                            </p>
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* University Settings */}
                            <div className="col-span-1 md:col-span-2 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        志望大学・学部 (任意)
                                    </label>
                                    <input
                                        type="text"
                                        value={universityName}
                                        onChange={(e) => setUniversityName(e.target.value)}
                                        placeholder="例：東京大学 文科一類、早稲田大学 国際教養学部"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        大学名を入力すると、その大学の傾向（自由英作の難易度など）を考慮して採点します。
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        語数制限 (任意)
                                    </label>
                                    <input
                                        type="text"
                                        value={wordLimit}
                                        onChange={(e) => setWordLimit(e.target.value)}
                                        placeholder="例：100語程度、80-100 words"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Image Upload A (Question - Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    問題用紙 (任意)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors relative h-64 bg-gray-50">
                                    {previewA ? (
                                        <div className="relative w-full h-full">
                                            <Image src={previewA} alt="Question Preview" fill style={{ objectFit: "contain" }} />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setImageA(null);
                                                    setPreviewA(null);
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
                                            <p className="text-xs text-gray-500">問題文や条件が書かれた部分</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload B (Answer - Required) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    解答用紙 (手書き推奨) <span className="text-red-500">*</span>
                                </label>
                                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg hover:border-blue-400 transition-colors relative h-64 bg-gray-50 ${!imageB && error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                                    {previewB ? (
                                        <div className="relative w-full h-full">
                                            <Image src={previewB} alt="Answer Preview" fill style={{ objectFit: "contain" }} />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setImageB(null);
                                                    setPreviewB(null);
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
                                disabled={isAnalyzing}
                                className={`flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 ${isAnalyzing ? "opacity-75 cursor-wait" : ""
                                    }`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                        AI講師が採点中... (約20秒)
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

                            {/* Score Card for University (Max 40) */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4 text-white">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <GraduationCap className="mr-2" /> 大学入試 採点結果
                                    </h2>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6">
                                    <div className="text-center md:text-left min-w-[150px]">
                                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Score</p>
                                        <p className="text-5xl font-extrabold text-gray-900 mt-1">
                                            {result.score.total} <span className="text-2xl text-gray-400 font-normal">/ 40</span>
                                        </p>
                                        <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${result.score.total >= 28 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {result.score.total >= 32 ? "合格有望圏" : result.score.total >= 24 ? "合格圏内" : "基礎固め推奨"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full md:flex-1">
                                        {[
                                            { key: 'content', label: '内容・構成' }, // Simplified label or split
                                            { key: 'structure', label: '論理構成' },
                                            { key: 'vocabulary', label: '語彙力' },
                                            { key: 'grammar', label: '文法・構文' }
                                        ].map((item) => (
                                            <div key={item.key} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">{item.label}</p>
                                                <p className="text-xl font-bold text-gray-800">
                                                    {/* @ts-ignore */}
                                                    {result.score[item.key]} <span className="text-xs text-gray-400">/ 10</span>
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
                                            <span className="text-xs font-bold text-blue-600 uppercase block mb-1">Question Type</span>
                                            <p className="text-sm text-gray-700">{result.topic_recognition}</p>
                                        </div>
                                    )}
                                    <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg font-serif">
                                        {result.transcribed_text}
                                    </div>
                                </div>

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
                                                            <span className="text-gray-800 font-medium bg-red-100/50 px-1 rounded line-through decoration-red-400">{correction.original}</span>
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
                                        <p className="text-green-600 flex items-center">
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            修正が必要な大きなミスは見当たりませんでした。Excellent!
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Advice & Model Answer */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">講師からのアドバイス & 模範解答</h3>
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">フィードバック</h4>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.advice}</p>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">模範解答例</h4>
                                    <div className="bg-slate-50 p-4 rounded-lg text-gray-800 font-medium leading-relaxed font-serif relative">
                                        <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-bl-lg">
                                            Model Answer
                                        </div>
                                        {result.model_answer}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </div>
    )
}
