# EduLens for School 環境変数設定ガイド

## 必要な環境変数

`.env.local` ファイルに以下の環境変数を追加してください：

```bash
# ===========================================
# EduLens for School 用環境変数
# ===========================================

# Supabase Service Role Key（サーバーサイドでのユーザー作成に必要）
# Supabase Dashboard > Settings > API > service_role key からコピー
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 生徒用ダミーメールドメイン（任意、デフォルト: @student.edulens.jp）
NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN=@student.edulens.jp
```

## 設定手順

### 1. Supabase Dashboardにアクセス
https://supabase.com/dashboard にログインし、プロジェクトを選択

### 2. Service Role Keyを取得
1. 左メニューから **Settings** を選択
2. **API** タブをクリック
3. **Project API keys** セクションの `service_role` キーをコピー

### 3. .env.local に追加
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...（実際のキー）
```

> ⚠️ **重要**: `service_role` キーは絶対にクライアントに公開しないでください。
> `NEXT_PUBLIC_` プレフィックスを付けないでください。

### 4. 開発サーバーを再起動
```bash
npm run dev
```

## 確認方法

環境変数が正しく設定されているか確認するには：

1. `/school/teacher/students` にアクセス
2. 「新規登録」ボタンをクリック
3. 生徒情報を入力して登録
4. エラーが出なければ設定完了
