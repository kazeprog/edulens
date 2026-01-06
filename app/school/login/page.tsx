"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { getSupabase } from "@/lib/supabase"
import { Toaster } from "@/components/ui/sonner"

// バリデーションスキーマ
const loginSchema = z.object({
    loginId: z
        .string()
        .min(1, "生徒IDを入力してください")
        .max(50, "生徒IDは50文字以内で入力してください")
        .regex(/^[a-zA-Z0-9_-]+$/, "生徒IDは英数字、ハイフン、アンダースコアのみ使用できます"),
    password: z
        .string()
        .min(6, "パスワードは6文字以上で入力してください")
        .max(100, "パスワードは100文字以内で入力してください"),
})

type LoginFormData = z.infer<typeof loginSchema>

// 環境変数からドメインを取得（デフォルト: @student.edulens.jp）
const EMAIL_DOMAIN = process.env.NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN || "@student.edulens.jp"

export default function SchoolLoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            loginId: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)

        try {
            const supabase = getSupabase()
            if (!supabase) {
                toast.error("システムエラー", {
                    description: "認証システムに接続できませんでした。",
                })
                return
            }

            // login_id にドメインを結合してダミーメールアドレスを生成
            const email = `${data.loginId}${EMAIL_DOMAIN}`

            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email,
                password: data.password,
            })

            if (error) {
                console.error("Login error:", error)
                if (error.message.includes("Invalid login credentials")) {
                    toast.error("ログイン失敗", {
                        description: "生徒IDまたはパスワードが正しくありません。",
                    })
                } else {
                    toast.error("ログインエラー", {
                        description: error.message,
                    })
                }
                return
            }

            if (authData.user) {
                // プロフィールからロールを取得してリダイレクト
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", authData.user.id)
                    .single()

                toast.success("ログイン成功", {
                    description: "ようこそ！",
                })

                // ロールに基づいてリダイレクト
                if (profile?.role === "teacher") {
                    router.push("/school/teacher")
                } else {
                    router.push("/school/student")
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("エラー", {
                description: "予期せぬエラーが発生しました。",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4 relative overflow-hidden">
                {/* 背景デコレーション */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>

                <div className="w-full max-w-md relative z-10">
                    {/* ロゴ・タイトル */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl mb-6 border border-white/30">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">EduLens for School</h1>
                        <p className="text-white/70">学習管理システムへようこそ</p>
                    </div>

                    {/* ログインカード */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* 生徒ID入力 */}
                            <div className="space-y-2">
                                <label htmlFor="loginId" className="block text-sm font-semibold text-gray-700">
                                    ログインID
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="loginId"
                                        type="text"
                                        placeholder="例: student01"
                                        autoComplete="username"
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-4 text-base rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        {...register("loginId")}
                                    />
                                </div>
                                {errors.loginId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.loginId.message}
                                    </p>
                                )}
                            </div>

                            {/* パスワード入力 */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    パスワード
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="パスワードを入力"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-14 text-base rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* ログインボタン */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        ログイン中...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        ログイン
                                    </>
                                )}
                            </button>
                        </form>

                        {/* 注意事項 */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 text-center">
                                ログインIDとパスワードは先生から配布されたものを使用してください
                            </p>
                        </div>
                    </div>

                    {/* フッター */}
                    <p className="text-center text-white/50 text-sm mt-6">
                        © 2026 EduLens. All rights reserved.
                    </p>
                </div>
            </div>
            <Toaster position="top-center" richColors />
        </>
    )
}
