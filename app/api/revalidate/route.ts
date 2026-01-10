import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret');

    // 環境変数に設定したシークレットキーと一致するか確認
    if (!process.env.MICROCMS_WEBHOOK_SECRET || secret !== process.env.MICROCMS_WEBHOOK_SECRET) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        // 'blog' タグが付いたキャッシュを削除（再検証）
        await revalidateTag('blog');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
