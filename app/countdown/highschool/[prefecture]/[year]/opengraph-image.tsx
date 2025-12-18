import { ImageResponse } from 'next/og';
import { supabase } from '@/utils/supabase/client';

export const runtime = 'edge';

export const alt = '公立高校入試カウントダウン';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { prefecture: string; year: string } }) {
    // フォントのロード (Google Fonts)
    // Noto Sans JP Bold
    const fontData = await fetch(
        new URL('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=0123456789残り日公立高校入試年度現在試験終了年月あと都道府県', 'https://edulens.jp')
    ).then((res) => res.arrayBuffer()).catch(() => null);

    // 実際にはAPIがCSSを返すので、そこからTTFのURLを抽出するか、直接TTFをfetchするのが一般的だが、
    // @vercel/og は Google Fonts の名前指定ロードをサポートしていないため、
    // ここでは標準的な fetch 手法を使うか、あるいはシンプルにシステムフォント/英数字用フォントで妥協するか。
    // 日本語フォントはサイズが大きいため、Edgeでのロードは工夫が必要。
    // 今回は一旦、英数字と一部の記号のみGoogle Fontsからロードし、日本語はデフォルトフォント（豆腐になる可能性あり）を回避するため
    // 最小限の文字セットのみを含むフォントをロードするか、
    // あるいはサーバー負荷を考慮して、英数字はInter、日本語は「sans-serif」でOS依存（OGP生成サーバのフォント）に任せる。
    // Vercel のデフォルト日本語フォントは現在等幅のみ等の制約があるため、
    // ここでは "Inter" のみをロードして、数字をかっこよく見せることに注力し、日本語はシステムフォントに頼る（または豆腐回避のためGoogle Fontsからサブセット取得）。

    // 確実な方法として、今回は英数字メインのデザインにしつつ、
    // 日本語が必要な部分は簡単なSVGパスか、あるいはロード可能な範囲のフォントを使う。
    // 実用的なアプローチ: 数字（カウントダウン）をメインにする。

    const { prefecture, year } = await params;

    // データ取得
    const { data: prefData } = await supabase
        .from('prefectures')
        .select('id, name')
        .eq('slug', prefecture)
        .single();

    const prefName = prefData?.name || prefecture.toUpperCase();
    let diffDays = 0;
    let isExpired = false;
    let examDateText = '';

    if (prefData?.id) {
        const { data: examData } = await supabase
            .from('official_exams')
            .select('date')
            .eq('prefecture_id', prefData.id)
            .eq('year', parseInt(year))
            .eq('category', 'public_general')
            .single();

        if (examData?.date) {
            const targetDate = new Date(examData.date);
            const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]);
            const diffTime = targetDate.getTime() - today.getTime();
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            isExpired = diffDays < 0;

            examDateText = `${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;
        }
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    backgroundImage: 'linear-gradient(to bottom right, #e0e7ff, #ffffff)',
                    fontFamily: '"sans-serif"',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        display: 'flex',
                        fontSize: 40,
                        fontWeight: 'bold',
                        color: '#6366f1',
                        marginBottom: 20,
                        padding: '10px 30px',
                        backgroundColor: '#eef2ff',
                        borderRadius: 50,
                    }}>
                        {year}年度 {prefName}公立高校入試
                    </div>

                    {isExpired ? (
                        <div style={{ fontSize: 120, fontWeight: 900, color: '#4f46e5' }}>
                            試験終了
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <span style={{ fontSize: 60, fontWeight: 'bold', color: '#64748b', marginBottom: 30, marginRight: 20 }}>あと</span>
                            <span style={{ fontSize: 220, fontWeight: 900, color: '#4f46e5', lineHeight: 1, letterSpacing: '-0.05em' }}>
                                {diffDays}
                            </span>
                            <span style={{ fontSize: 60, fontWeight: 'bold', color: '#64748b', marginBottom: 30, marginLeft: 20 }}>日</span>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: '#334155',
                        marginTop: 40,
                        borderBottom: '4px solid #4f46e5',
                        paddingBottom: 10
                    }}>
                        試験日: {examDateText || '未定'}
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 40, right: 50, display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.1em' }}>EduLens.jp</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
