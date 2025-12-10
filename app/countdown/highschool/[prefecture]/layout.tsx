import Link from "next/link";

// 都道府県データ
const REGIONS = [
  {
    name: "北海道・東北",
    prefs: [
      { name: "北海道", slug: "hokkaido" },
      { name: "青森", slug: "aomori" },
      { name: "岩手", slug: "iwate" },
      { name: "宮城", slug: "miyagi" },
      { name: "秋田", slug: "akita" },
      { name: "山形", slug: "yamagata" },
      { name: "福島", slug: "fukushima" },
    ],
  },
  {
    name: "関東",
    prefs: [
      { name: "茨城", slug: "ibaraki" },
      { name: "栃木", slug: "tochigi" },
      { name: "群馬", slug: "gunma" },
      { name: "埼玉", slug: "saitama" },
      { name: "千葉", slug: "chiba" },
      { name: "東京", slug: "tokyo" },
      { name: "神奈川", slug: "kanagawa" },
    ],
  },
  {
    name: "中部",
    prefs: [
      { name: "新潟", slug: "niigata" },
      { name: "富山", slug: "toyama" },
      { name: "石川", slug: "ishikawa" },
      { name: "福井", slug: "fukui" },
      { name: "山梨", slug: "yamanashi" },
      { name: "長野", slug: "nagano" },
      { name: "岐阜", slug: "gifu" },
      { name: "静岡", slug: "shizuoka" },
      { name: "愛知", slug: "aichi" },
    ],
  },
  {
    name: "近畿",
    prefs: [
      { name: "三重", slug: "mie" },
      { name: "滋賀", slug: "shiga" },
      { name: "京都", slug: "kyoto" },
      { name: "大阪", slug: "osaka" },
      { name: "兵庫", slug: "hyogo" },
      { name: "奈良", slug: "nara" },
      { name: "和歌山", slug: "wakayama" },
    ],
  },
  {
    name: "中国・四国",
    prefs: [
      { name: "鳥取", slug: "tottori" },
      { name: "島根", slug: "shimane" },
      { name: "岡山", slug: "okayama" },
      { name: "広島", slug: "hiroshima" },
      { name: "山口", slug: "yamaguchi" },
      { name: "徳島", slug: "tokushima" },
      { name: "香川", slug: "kagawa" },
      { name: "愛媛", slug: "ehime" },
      { name: "高知", slug: "kochi" },
    ],
  },
  {
    name: "九州・沖縄",
    prefs: [
      { name: "福岡", slug: "fukuoka" },
      { name: "佐賀", slug: "saga" },
      { name: "長崎", slug: "nagasaki" },
      { name: "熊本", slug: "kumamoto" },
      { name: "大分", slug: "oita" },
      { name: "宮崎", slug: "miyazaki" },
      { name: "鹿児島", slug: "kagoshima" },
      { name: "沖縄", slug: "okinawa" },
    ],
  },
];

export default function PrefectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      {/* ▼▼▼ SEO用ミニマルフッター ▼▼▼ 
        デザイン意図: ユーザーの視界を邪魔せず、クローラーにだけリンク構造を伝える
        - mt-32: メインコンテンツから大きく離す
        - border-transparent: 境界線を見せない
        - text-[10px] & text-slate-200: 非常に小さく、薄い文字色
      */}
      <footer className="mt-32 pb-8 pt-4 border-t border-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-2 text-[10px]">
            {REGIONS.map((region) => (
              <div key={region.name}>
                {/* 地域名も見出し感を消して薄く表示 */}
                <h3 className="font-bold text-slate-300 mb-2">
                  {region.name}
                </h3>
                <ul className="space-y-1.5">
                  {region.prefs.map((pref) => (
                    <li key={pref.slug}>
                      <Link 
                        href={`/countdown/highschool/${pref.slug}/2026`} 
                        className="text-slate-300 hover:text-slate-500 transition-colors block"
                        aria-label={`${pref.name}高校入試日程`}
                      >
                        {pref.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}