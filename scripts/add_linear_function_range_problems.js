const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "1次関数の値域，最大値・最小値";
const instruction = "次の関数の値域を求めよ。また，最大値，最小値があれば，それを求めよ。";

const data1 = [
    { q: "$y=x+1$ ($0 \\le x \\le 5$)", a: "値域: $1 \\le y \\le 6$, 最大値: 6, 最小値: 1" },
    { q: "$y=2x+3$ ($1 \\le x \\le 4$)", a: "値域: $5 \\le y \\le 11$, 最大値: 11, 最小値: 5" },
    { q: "$y=3x-2$ ($0 \\le x \\le 2$)", a: "値域: $-2 \\le y \\le 4$, 最大値: 4, 最小値: -2" },
    { q: "$y=x-5$ ($-2 \\le x \\le 3$)", a: "値域: $-7 \\le y \\le -2$, 最大値: -2, 最小値: -7" },
    { q: "$y=4x+1$ ($-1 \\le x \\le 1$)", a: "値域: $-3 \\le y \\le 5$, 最大値: 5, 最小値: -3" },
    { q: "$y=2x-4$ ($2 \\le x \\le 5$)", a: "値域: $0 \\le y \\le 6$, 最大値: 6, 最小値: 0" },
    { q: "$y=3x+6$ ($-3 \\le x \\le 0$)", a: "値域: $-3 \\le y \\le 6$, 最大値: 6, 最小値: -3" },
    { q: "$y=x+7$ ($-5 \\le x \\le -2$)", a: "値域: $2 \\le y \\le 5$, 最大値: 5, 最小値: 2" },
    { q: "$y=5x-3$ ($1 \\le x \\le 2$)", a: "値域: $2 \\le y \\le 7$, 最大値: 7, 最小値: 2" },
    { q: "$y=2x+8$ ($0 \\le x \\le 3$)", a: "値域: $8 \\le y \\le 14$, 最大値: 14, 最小値: 8" }
];

const data2 = [
    { q: "$y=5-x$ ($0 \\le x < 4$)", a: "値域: $1 < y \\le 5$, 最大値: 5, 最小値: なし" },
    { q: "$y=3-2x$ ($-1 \\le x < 2$)", a: "値域: $-1 < y \\le 5$, 最大値: 5, 最小値: なし" },
    { q: "$y=10-3x$ ($1 < x \\le 4$)", a: "値域: $-2 \\le y < 7$, 最大値: なし, 最小値: -2" },
    { q: "$y=2-x$ ($-3 < x \\le 2$)", a: "値域: $0 \\le y < 5$, 最大値: なし, 最小値: 0" },
    { q: "$y=1-2x$ ($0 < x \\le 3$)", a: "値域: $-5 \\le y < 1$, 最大値: なし, 最小値: -5" },
    { q: "$y=6-4x$ ($-1 \\le x < 1$)", a: "値域: $2 < y \\le 10$, 最大値: 10, 最小値: なし" },
    { q: "$y=8-x$ ($2 < x \\le 6$)", a: "値域: $2 \\le y < 6$, 最大値: なし, 最小値: 2" },
    { q: "$y=-3x+4$ ($0 \\le x < 3$)", a: "値域: $-5 < y \\le 4$, 最大値: 4, 最小値: なし" },
    { q: "$y=-x-2$ ($-4 \\le x < 1$)", a: "値域: $-3 < y \\le 2$, 最大値: 2, 最小値: なし" },
    { q: "$y=-2x+7$ ($1 < x \\le 5$)", a: "値域: $-3 \\le y < 5$, 最大値: なし, 最小値: -3" }
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
