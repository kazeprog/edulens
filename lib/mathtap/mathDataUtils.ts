import problemsData from "@/lib/data/mathtap/math-problems.json";

export interface MathProblem {
    grade: string;
    unit: string;
    problem_number: number;
    question: string; // LaTeX
    answer: string;   // LaTeX or text
}

// データ全体をキャスト
const allProblems = problemsData as MathProblem[];

export function getAvailableGrades(): string[] {
    return Array.from(new Set(allProblems.map(p => p.grade)));
}

export function getUnitsForGrade(grade: string): string[] {
    return Array.from(new Set(allProblems.filter(p => p.grade === grade).map(p => p.unit)));
}

export function getProblems(grade: string, unit: string, count: number): MathProblem[] {
    const filtered = allProblems.filter(p => p.grade === grade && p.unit === unit);

    // ランダムにシャッフルして指定数取得
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export function getProblemByNumber(number: number): MathProblem | undefined {
    return allProblems.find(p => p.problem_number === number);
}
