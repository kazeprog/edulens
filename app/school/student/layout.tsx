"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, BookOpen, ClipboardList, User, LogOut, Menu, X } from "lucide-react"
import { toast } from "sonner"

import { getSupabase } from "@/lib/supabase"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Profile } from "@/types/database.types"

const navItems = [
    { href: "/school/student", icon: Home, label: "ホーム" },
    { href: "/school/student/workbooks", icon: BookOpen, label: "ワーク" },
    { href: "/school/student/tasks", icon: ClipboardList, label: "宿題" },
    { href: "/school/student/profile", icon: User, label: "設定" },
]

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = getSupabase()
            if (!supabase) {
                router.push("/school/login")
                return
            }

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/school/login")
                return
            }

            // プロフィール取得
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            if (profileData) {
                // 先生の場合は先生用画面にリダイレクト
                if (profileData.role === "teacher") {
                    router.push("/school/teacher")
                    return
                }
                setProfile(profileData as Profile)
            }

            setIsLoading(false)
        }

        checkAuth()
    }, [router])

    const handleLogout = async () => {
        const supabase = getSupabase()
        if (supabase) {
            await supabase.auth.signOut()
            toast.success("ログアウトしました")
            router.push("/school/login")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">E</span>
                        </div>
                        <span className="font-semibold text-gray-800">EduLens</span>
                    </div>

                    {/* モバイルメニューボタン */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>

                    {/* デスクトップ: ユーザー名とログアウト */}
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-sm text-gray-600">{profile?.full_name || "生徒"}</span>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* モバイルメニュー */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{profile?.full_name || "生徒"}</span>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-1" />
                                ログアウト
                            </Button>
                        </div>
                    </div>
                )}
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-24">
                {children}
            </main>

            {/* ボトムナビゲーション（モバイル） */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
                <div className="max-w-lg mx-auto grid grid-cols-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center py-2 text-gray-500 hover:text-blue-600 transition-colors",
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <Toaster position="top-center" richColors />
        </div>
    )
}
