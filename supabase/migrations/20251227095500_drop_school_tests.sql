-- 定期テスト管理機能（/tests）の削除に伴うテーブル削除
-- 関連ファイル: app/tests/*, components/tests/*, utils/test-data.ts は削除済み

DROP TABLE IF EXISTS public.school_tests;
