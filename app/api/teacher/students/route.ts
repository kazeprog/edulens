import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase, getServerSupabase } from "@/lib/supabase"

// 環境変数からドメインを取得
const EMAIL_DOMAIN = process.env.NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN || "@student.edulens.jp"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fullName, loginId, password, grade, schoolName, cramSchoolId } = body

        // バリデーション
        if (!fullName || !loginId || !password) {
            return NextResponse.json(
                { error: "必須項目が入力されていません" },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "パスワードは6文字以上で入力してください" },
                { status: 400 }
            )
        }

        // Admin Supabaseクライアントを取得
        const adminSupabase = getAdminSupabase()
        if (!adminSupabase) {
            return NextResponse.json(
                { error: "サーバー設定エラー: Admin権限が設定されていません" },
                { status: 500 }
            )
        }

        // 通常のSupabaseクライアントでlogin_idの重複チェック
        const serverSupabase = getServerSupabase()
        if (serverSupabase) {
            const { data: existingProfile } = await serverSupabase
                .from("profiles")
                .select("id")
                .eq("login_id", loginId)
                .single()

            if (existingProfile) {
                return NextResponse.json(
                    { error: "この生徒IDはすでに使用されています" },
                    { status: 400 }
                )
            }
        }

        // ダミーメールアドレスを生成
        const email = `${loginId}${EMAIL_DOMAIN}`

        // Supabase Auth でユーザーを作成
        const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // メール確認をスキップ
        })

        if (authError) {
            console.error("Auth error:", authError)
            if (authError.message.includes("already been registered")) {
                return NextResponse.json(
                    { error: "この生徒IDはすでに登録されています" },
                    { status: 400 }
                )
            }
            return NextResponse.json(
                { error: `認証エラー: ${authError.message}` },
                { status: 500 }
            )
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: "ユーザーの作成に失敗しました" },
                { status: 500 }
            )
        }

        // プロフィールを作成
        const { error: profileError } = await adminSupabase
            .from("profiles")
            .insert({
                id: authData.user.id,
                login_id: loginId,
                full_name: fullName,
                role: "student",
                grade: grade || null,
                school_name: schoolName || null,
                cram_school_id: cramSchoolId || null,
            })

        if (profileError) {
            console.error("Profile error:", profileError)
            // ユーザーは作成されたがプロフィール作成に失敗した場合
            // ロールバックとしてユーザーを削除
            await adminSupabase.auth.admin.deleteUser(authData.user.id)
            return NextResponse.json(
                { error: `プロフィール作成エラー: ${profileError.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: authData.user.id,
                loginId,
                fullName,
            },
        })
    } catch (error) {
        console.error("Unexpected error:", error)
        return NextResponse.json(
            { error: "予期せぬエラーが発生しました" },
            { status: 500 }
        )
    }
}

// 生徒一覧を取得（オプション）
export async function GET(request: NextRequest) {
    try {
        const serverSupabase = getServerSupabase()
        if (!serverSupabase) {
            return NextResponse.json(
                { error: "サーバー設定エラー" },
                { status: 500 }
            )
        }

        const { searchParams } = new URL(request.url)
        const cramSchoolId = searchParams.get("cramSchoolId")

        let query = serverSupabase
            .from("profiles")
            .select("*")
            .eq("role", "student")
            .order("full_name")

        if (cramSchoolId) {
            query = query.eq("cram_school_id", cramSchoolId)
        } else {
            // 塾IDが指定されていない場合は何も返さない（セキュリティ対策）
            return NextResponse.json({ students: [] })
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ students: data })
    } catch (error) {
        console.error("Unexpected error:", error)
        return NextResponse.json(
            { error: "予期せぬエラーが発生しました" },
            { status: 500 }
        )
    }
}
