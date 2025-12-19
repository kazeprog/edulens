import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // 1. URLパラメータの取得
  const contentId = searchParams.get('contentId');
  const draftKey = searchParams.get('draftKey');

  // デバッグ用ログ
  console.log('Preview API called:', {
    contentId,
    draftKey: draftKey ? 'present' : 'missing',
    url: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  // 2. 認証とバリデーション
  if (!draftKey || draftKey.trim() === '') {
    return NextResponse.json(
      { 
        message: 'draftKey is required and cannot be empty',
        receivedParams: Object.fromEntries(searchParams.entries()),
        hint: 'Make sure your microCMS preview URL uses the placeholder {DRAFT_KEY}, not an empty string. Check API settings in microCMS dashboard.'
      },
      { status: 401 }
    );
  }

  if (!contentId) {
    return NextResponse.json(
      { message: 'contentId is required' },
      { status: 400 }
    );
  }

  // 3. プレビューモードの有効化（Next.js 13+ App Router）
  (await draftMode()).enable();

  // 4. リダイレクト（draftKeyをクエリパラメータとして引き継ぐ）
  const redirectPath = `/blog/${contentId}?draftKey=${draftKey}`;

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
