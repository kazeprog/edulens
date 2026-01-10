import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret');

    // 環境変数に設定したシークレットキーと一致するか確認
    if (!process.env.MICROCMS_WEBHOOK_SECRET || secret !== process.env.MICROCMS_WEBHOOK_SECRET) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        // ブログが表示される主要なパスを再検証
        revalidatePath('/', 'layout'); // トップページとその配下すべて
        revalidatePath('/column', 'page'); // コラム一覧

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
