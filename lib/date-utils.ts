export function getTargetExamYear() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    // 1月〜3月は今年度の入試 (例: 2026年1月 -> 2026年度入試)
    // 4月以降は翌年度の入試 (例: 2026年4月 -> 2027年度入試)
    return currentMonth >= 4 ? currentYear + 1 : currentYear;
}
