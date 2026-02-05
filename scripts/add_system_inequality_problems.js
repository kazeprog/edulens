const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "連立不等式の解法";
const instruction = "次の不等式を解け。";

const data1 = [
    { q: "$\\begin{cases} 3x+2 \\leqq x+10 \\\\ 2x-5 < 4x+1 \\end{cases}$", a: "$-3 < x \\leqq 4$" },
    { q: "$\\begin{cases} 4x-1 \\leqq 3x+4 \\\\ 5x+2 < 6x-3 \\end{cases}$", a: "解なし" },
    { q: "$\\begin{cases} 2x+7 \\leqq 5x-2 \\\\ 3x+1 < 2x+6 \\end{cases}$", a: "$3 \\leqq x < 5$" },
    { q: "$\\begin{cases} 6x-4 \\leqq 2x+8 \\\\ x+5 < 3x-1 \\end{cases}$", a: "解なし" },
    { q: "$\\begin{cases} x+9 \\leqq 4x-3 \\\\ 5x-2 < 2x+7 \\end{cases}$", a: "解なし" },
    { q: "$\\begin{cases} 7x-3 \\leqq 4x+9 \\\\ 2x+8 < 5x-1 \\end{cases}$", a: "$3 < x \\leqq 4$" },
    { q: "$\\begin{cases} 3x+10 \\leqq 6x+1 \\\\ 4x-5 < 2x+3 \\end{cases}$", a: "$3 \\leqq x < 4$" },
    { q: "$\\begin{cases} 5x-6 \\leqq 2x+9 \\\\ 3x+4 < 5x-2 \\end{cases}$", a: "$3 < x \\leqq 5$" },
    { q: "$\\begin{cases} 2x+11 \\leqq x+15 \\\\ 6x-1 < 4x+9 \\end{cases}$", a: "解なし" },
    { q: "$\\begin{cases} 8x-5 \\leqq 5x+7 \\\\ x+4 < 4x-2 \\end{cases}$", a: "$2 < x \\leqq 4$" }
];

const data2 = [
    { q: "$\\begin{cases} x-1 > 2x+3 \\\\ 3(x+2) < x+4 \\end{cases}$", a: "$x < -4$" },
    { q: "$\\begin{cases} 2x+1 \\geqq 5x-5 \\\\ 2(x-3) > 4x+2 \\end{cases}$", a: "$x < -4$" },
    { q: "$\\begin{cases} x-4 > 3x+2 \\\\ 4(x-1) < x+5 \\end{cases}$", a: "$x < -3$" },
    { q: "$\\begin{cases} 3x+5 > 5x-1 \\\\ 2(x+3) < 5x+3 \\end{cases}$", a: "$1 < x < 3$" },
    { q: "$\\begin{cases} x-2 > 4x+7 \\\\ 3(x+1) < x-5 \\end{cases}$", a: "$x < -4$" },
    { q: "$\\begin{cases} 2x-3 > 5x+6 \\\\ 4(x-2) < 2x+4 \\end{cases}$", a: "$x < -3$" },
    { q: "$\\begin{cases} x-5 > 2x+1 \\\\ 5(x+1) < 3x-1 \\end{cases}$", a: "$x < -6$" },
    { q: "$\\begin{cases} 4x+2 > 6x-4 \\\\ 3(x-1) < x+1 \\end{cases}$", a: "$x < 2$" },
    { q: "$\\begin{cases} x-7 > 3x+1 \\\\ 2(x+4) < x+5 \\end{cases}$", a: "$x < -4$" },
    { q: "$\\begin{cases} 2x-1 > 4x+5 \\\\ 3(x-2) < x-2 \\end{cases}$", a: "$x < -3$" }
];

const data3 = [
    { q: "$2x+1 \\leqq 3x \\leqq x+8$", a: "$1 \\leqq x \\leqq 4$" },
    { q: "$3x-2 \\leqq 4x \\leqq 2x+6$", a: "$-2 \\leqq x \\leqq 3$" },
    { q: "$x+4 \\leqq 2x \\leqq x+9$", a: "$4 \\leqq x \\leqq 9$" },
    { q: "$4x+5 \\leqq 5x \\leqq x+12$", a: "解なし" },
    { q: "$2x+6 \\leqq 4x \\leqq 2x+10$", a: "$3 \\leqq x \\leqq 5$" },
    { q: "$3x-5 \\leqq 5x \\leqq x+12$", a: "$- \\frac{5}{2} \\leqq x \\leqq 3$" },
    { q: "$x+6 \\leqq 3x \\leqq x+10$", a: "$3 \\leqq x \\leqq 5$" },
    { q: "$5x+4 \\leqq 6x \\leqq 2x+16$", a: "$x=4$" },
    { q: "$2x-8 \\leqq 3x \\leqq x+4$", a: "$-8 \\leqq x \\leqq 2$" },
    { q: "$4x-6 \\leqq 6x \\leqq 3x+9$", a: "$-3 \\leqq x \\leqq 3$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

const allData = [...data1, ...data2, ...data3];

for (const p of allData) {
    const fullQuestion = `${instruction}\n${p.q}`;
    const exists = existingJson.some(ex => ex.question === fullQuestion && ex.unit === unit);
    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit,
            problem_number: lastProblemNumber,
            question: fullQuestion,
            answer: p.a
        });
    }
}

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
