"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabase } from "@/lib/supabase"
import type { Profile } from "@/types/database.types"

type CramSchool = {
    id: string
    name: string
}

const profileSchema = z.object({
    fullName: z.string().min(1, "氏名を入力してください").max(50, "氏名は50文字以内"),
})

const schoolSchema = z.object({
    schoolName: z.string().min(1, "塾名を入力してください").max(100, "塾名は100文字以内"),
})

type ProfileFormData = z.infer<typeof profileSchema>
type SchoolFormData = z.infer<typeof schoolSchema>

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [cramSchools, setCramSchools] = useState<CramSchool[]>([])
    const [currentSchool, setCurrentSchool] = useState<CramSchool | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isSavingSchool, setIsSavingSchool] = useState(false)
    const [isCreatingSchool, setIsCreatingSchool] = useState(false)
    const [showCreateSchool, setShowCreateSchool] = useState(false)

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    })

    const {
        register: registerSchool,
        handleSubmit: handleSubmitSchool,
        reset: resetSchool,
        formState: { errors: schoolErrors },
    } = useForm<SchoolFormData>({
        resolver: zodResolver(schoolSchema),
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // プロフィール取得
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            if (profileData) {
                setProfile(profileData as Profile)
                resetProfile({ fullName: profileData.full_name || "" })

                // 現在の塾情報取得
                if (profileData.cram_school_id) {
                    const { data: schoolData } = await supabase
                        .from("cram_schools")
                        .select("*")
                        .eq("id", profileData.cram_school_id)
                        .single()

                    if (schoolData) {
                        setCurrentSchool(schoolData)
                    }
                }
            }

            // 塾一覧取得
            const { data: schools } = await supabase
                .from("cram_schools")
                .select("*")
                .order("name")

            if (schools) {
                setCramSchools(schools)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("データの取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    const onSaveProfile = async (data: ProfileFormData) => {
        if (!profile) return

        setIsSavingProfile(true)
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ full_name: data.fullName })
                .eq("id", profile.id)

            if (error) throw error

            setProfile({ ...profile, full_name: data.fullName })
            toast.success("プロフィールを更新しました")
        } catch (error) {
            console.error("Error saving profile:", error)
            toast.error("プロフィールの更新に失敗しました")
        } finally {
            setIsSavingProfile(false)
        }
    }

    const onSelectSchool = async (schoolId: string) => {
        if (!profile) return

        setIsSavingSchool(true)
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ cram_school_id: schoolId })
                .eq("id", profile.id)

            if (error) throw error

            const school = cramSchools.find((s) => s.id === schoolId)
            setCurrentSchool(school || null)
            setProfile({ ...profile, cram_school_id: schoolId })
            toast.success("塾を設定しました")
        } catch (error) {
            console.error("Error setting school:", error)
            toast.error("塾の設定に失敗しました")
        } finally {
            setIsSavingSchool(false)
        }
    }

    const onCreateSchool = async (data: SchoolFormData) => {
        if (!profile) return

        setIsCreatingSchool(true)
        const supabase = getSupabase()
        if (!supabase) return

        try {
            // 新しい塾を作成
            const { data: newSchool, error: createError } = await supabase
                .from("cram_schools")
                .insert({ name: data.schoolName })
                .select()
                .single()

            if (createError) throw createError

            // プロフィールの塾IDを更新
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ cram_school_id: newSchool.id })
                .eq("id", profile.id)

            if (updateError) throw updateError

            setCramSchools([...cramSchools, newSchool])
            setCurrentSchool(newSchool)
            setProfile({ ...profile, cram_school_id: newSchool.id })
            setShowCreateSchool(false)
            resetSchool()
            toast.success("塾を作成し、設定しました")
        } catch (error) {
            console.error("Error creating school:", error)
            toast.error("塾の作成に失敗しました")
        } finally {
            setIsCreatingSchool(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-3xl">
            {/* ヘッダー */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">設定</h1>
                <p className="text-gray-500 mt-1">アカウントと塾の設定を管理</p>
            </div>

            {/* プロフィール設定 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        プロフィール
                    </h2>
                </div>
                <form onSubmit={handleSubmitProfile(onSaveProfile)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">氏名</label>
                        <input
                            type="text"
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            {...registerProfile("fullName")}
                        />
                        {profileErrors.fullName && (
                            <p className="text-sm text-red-500">{profileErrors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">ログインID</label>
                        <input
                            type="text"
                            disabled
                            value={profile?.login_id || ""}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-400">ログインIDは変更できません</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">メールアドレス</label>
                        <input
                            type="text"
                            disabled
                            value={profile?.id ? `${profile.login_id}@...` : ""}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isSavingProfile ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                保存中...
                            </>
                        ) : (
                            "保存する"
                        )}
                    </button>
                </form>
            </div>

            {/* 塾設定 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        塾の設定
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* 現在の塾 */}
                    {currentSchool ? (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">現在の所属塾</p>
                                        <p className="font-bold text-gray-900">{currentSchool.name}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                    設定済み
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">塾が設定されていません</p>
                                    <p className="text-sm text-gray-600">下記から塾を選択または新規作成してください</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 塾選択 */}
                    {cramSchools.length > 0 && (
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">塾を選択</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {cramSchools.map((school) => (
                                    <button
                                        key={school.id}
                                        onClick={() => onSelectSchool(school.id)}
                                        disabled={isSavingSchool || currentSchool?.id === school.id}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${currentSchool?.id === school.id
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                                            } disabled:opacity-50`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{school.name}</span>
                                            {currentSchool?.id === school.id && (
                                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 新規塾作成 */}
                    {!showCreateSchool ? (
                        <button
                            onClick={() => setShowCreateSchool(true)}
                            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新しい塾を作成
                        </button>
                    ) : (
                        <form onSubmit={handleSubmitSchool(onCreateSchool)} className="p-4 bg-gray-50 rounded-xl space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">新しい塾名</label>
                                <input
                                    type="text"
                                    placeholder="例: ○○学習塾 △△校"
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                    {...registerSchool("schoolName")}
                                />
                                {schoolErrors.schoolName && (
                                    <p className="text-sm text-red-500">{schoolErrors.schoolName.message}</p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateSchool(false)
                                        resetSchool()
                                    }}
                                    className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingSchool}
                                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {isCreatingSchool ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            作成中...
                                        </>
                                    ) : (
                                        "作成して設定"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
