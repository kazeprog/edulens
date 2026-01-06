import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
    try {
        // Admin権限で確実に取得する
        const supabase = getAdminSupabase()

        if (!supabase) {
            return NextResponse.json(
                { error: "サーバー設定エラー" },
                { status: 500 }
            )
        }

        const { data, error } = await supabase
            .from("subjects")
            .select("*")
            .order("id")

        if (error) {
            console.error("Error fetching subjects:", error)
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Unexpected error:", error)
        return NextResponse.json(
            { error: "予期せぬエラーが発生しました" },
            { status: 500 }
        )
    }
}
