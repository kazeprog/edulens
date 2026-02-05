const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "2次関数の最大・最小";
const instruction = "次の2次関数に最大値, 最小値があれば, それを求めよ。";

const data1 = [
    { q: "$y=x^2-2x+5$", a: "$x=1$ で最小値 4, 最大値なし" },
    { q: "$y=3x^2+6x-2$", a: "$x=-1$ で最小値 -5, 最大値なし" },
    { q: "$y=x^2+4x-1$", a: "$x=-2$ で最小値 -5, 最大値なし" },
    { q: "$y=2x^2-8x+3$", a: "$x=2$ で最小値 -5, 最大値なし" },
    { q: "$y=x^2-6x+10$", a: "$x=3$ で最小値 1, 最大値なし" },
    { q: "$y=4x^2+8x+1$", a: "$x=-1$ で最小値 -3, 最大値なし" },
    { q: "$y=x^2+2x-3$", a: "$x=-1$ で最小値 -4, 最大値なし" },
    { q: "$y=3x^2-12x+5$", a: "$x=2$ で最小値 -7, 最大値なし" },
    { q: "$y=2x^2+4x-5$", a: "$x=-1$ で最小値 -7, 最大値なし" },
    { q: "$y=x^2-4x+7$", a: "$x=2$ で最小値 3, 最大値なし" }
];

const data2 = [
    { q: "$y=-x^2+4x+1$", a: "$x=2$ で最大値 5, 最小値なし" },
    { q: "$y=-2x^2-4x+5$", a: "$x=-1$ で最大値 7, 最小値なし" },
    { q: "$y=-x^2-6x-2$", a: "$x=-3$ で最大値 7, 最小値なし" },
    { q: "$y=-3x^2+6x+1$", a: "$x=1$ で最大値 4, 最小値なし" },
    { q: "$y=-x^2+2x-4$", a: "$x=1$ で最大値 -3, 最小値なし" },
    { q: "$y=-2x^2+8x-3$", a: "$x=2$ で最大値 5, 最小値なし" },
    { q: "$y=-x^2-2x+6$", a: "$x=-1$ で最大値 7, 最小値なし" },
    { q: "$y=-4x^2-8x+2$", a: "$x=-1$ で最大値 6, 最小値なし" },
    { q: "$y=-x^2+6x-5$", a: "$x=3$ で最大値 4, 最小値なし" },
    { q: "$y=-2x^2+4x+7$", a: "$x=1$ で最大値 9, 最小値なし" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

const allData = [...data1, ...data2];

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
