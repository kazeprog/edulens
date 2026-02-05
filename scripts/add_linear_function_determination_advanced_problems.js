const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "1次関数の決定";

const data = [
    { q: "関数 $y=ax-a+4$ ($0\\le x\\le 2$) の値域が $2\\le y\\le b$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=6$ または $a=-2, b=6$" },
    { q: "関数 $y=ax+a+3$ ($-2\\le x\\le 0$) の値域が $b\\le y\\le 5$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=1$ または $a=-2, b=1$" },
    { q: "関数 $y=ax-2a+6$ ($1\\le x\\le 3$) の値域が $3\\le y\\le b$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=3, b=9$ または $a=-3, b=9$" },
    { q: "関数 $y=ax+3a+1$ ($-4\\le x\\le -2$) の値域が $b\\le y\\le 3$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=-1$ または $a=-2, b=-1$" },
    { q: "関数 $y=ax-2a+5$ ($0\\le x\\le 4$) の値域が $1\\le y\\le b$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=9$ または $a=-2, b=9$" },
    { q: "関数 $y=ax+2a-2$ ($-3\\le x\\le -1$) の値域が $b\\le y\\le 2$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=4, b=-6$ または $a=-4, b=-6$" },
    { q: "関数 $y=ax-4a+4$ ($2\\le x\\le 6$) の値域が $1\\le y\\le b$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=1.5, b=7$ または $a=-1.5, b=7$" },
    { q: "関数 $y=ax+2$ ($-2\\le x\\le 2$) の値域が $b\\le y\\le 6$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=-2$ または $a=-2, b=-2$" },
    { q: "関数 $y=ax-3a+7$ ($1\\le x\\le 5$) の値域が $2\\le y\\le b$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2.5, b=12$ または $a=-2.5, b=12$" },
    { q: "関数 $y=ax+3a-1$ ($-5\\le x\\le -1$) の値域が $b\\le y\\le 4$ であるとき, 定数 $a, b$ の値を求めよ。", a: "$a=2.5, b=-6$ または $a=-2.5, b=-6$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

for (const p of data) {
    const exists = existingJson.some(ex => ex.question === p.q && ex.unit === unit);
    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit,
            problem_number: lastProblemNumber,
            question: p.q,
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
