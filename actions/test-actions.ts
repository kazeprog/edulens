'use server'

import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントをサーバーサイドで作成
function getServerSupabase() {
    // Mistap/EduLens用のプロジェクトURLを優先的に使用
    const supabaseUrl = process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL
        || process.env.NEXT_PUBLIC_SUPABASE_URL

    // サービスロールキーまたはAnonキーを取得（MISTAP用を優先）
    const supabaseServiceKey = process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY
        || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY
        || process.env.SUPABASE_SERVICE_ROLE_KEY
        || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase環境変数が設定されていません')
    }

    return createClient(supabaseUrl, supabaseServiceKey)
}

// テスト結果の型定義
export interface TestResult {
    id: number
    user_id: string
    test_name: string
    date: string
    english: number | null
    math: number | null
    japanese: number | null
    science: number | null
    social: number | null
    music: number | null
    art: number | null
    pe: number | null
    tech_home: number | null
    total5: number | null
    total9: number | null
    created_at: string
}

// 新規登録用の入力データ型
export interface TestResultInput {
    user_id: string
    test_name: string
    date: string
    english?: number | null
    math?: number | null
    japanese?: number | null
    science?: number | null
    social?: number | null
    music?: number | null
    art?: number | null
    pe?: number | null
    tech_home?: number | null
}

// テスト結果を登録
export async function addTestResult(data: TestResultInput): Promise<{ success: boolean; error?: string; data?: TestResult }> {
    try {
        const supabase = getServerSupabase()

        const { data: result, error } = await supabase
            .from('school_tests')
            .insert([{
                user_id: data.user_id,
                test_name: data.test_name,
                date: data.date,
                english: data.english,
                math: data.math,
                japanese: data.japanese,
                science: data.science,
                social: data.social,
                music: data.music,
                art: data.art,
                pe: data.pe,
                tech_home: data.tech_home,
            }])
            .select()
            .single()

        if (error) {
            console.error('テスト結果の登録エラー:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data: result as TestResult }
    } catch (err) {
        console.error('テスト結果の登録中に例外発生:', err)
        return { success: false, error: '予期しないエラーが発生しました' }
    }
}

// テスト履歴を取得（日付の昇順）
export async function getTestResults(userId: string): Promise<{ success: boolean; error?: string; data?: TestResult[] }> {
    try {
        const supabase = getServerSupabase()

        const { data: results, error } = await supabase
            .from('school_tests')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: true })

        if (error) {
            console.error('テスト結果の取得エラー:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data: results as TestResult[] }
    } catch (err) {
        console.error('テスト結果の取得中に例外発生:', err)
        return { success: false, error: '予期しないエラーが発生しました' }
    }
}

// テスト結果を削除
export async function deleteTestResult(id: number, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = getServerSupabase()

        const { error } = await supabase
            .from('school_tests')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) {
            console.error('テスト結果の削除エラー:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('テスト結果の削除中に例外発生:', err)
        return { success: false, error: '予期しないエラーが発生しました' }
    }
}
