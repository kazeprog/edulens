const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次関数の最大・最小"; // Same unit as previous set but restricted domain
const unit2 = "2次関数の最大・最小（係数決定）";

const data1_1 = [
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2+2x+3$ ($-2\\leq x \\leq 1$)", a: "$x=1$ で最大値 6, $x=-1$ で最小値 2" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2-4x+5$ ($0 \\leq x \\leq 3$)", a: "$x=0$ で最大値 5, $x=2$ で最小値 1" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2-6x+8$ ($2 \\leq x \\leq 5$)", a: "$x=5$ で最大値 3, $x=3$ で最小値 -1" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2+4x$ ($-5 \\leq x \\leq -1$)", a: "$x=-5$ で最大値 5, $x=-2$ で最小値 -4" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2-2x-1$ ($-1 \\leq x \\leq 2$)", a: "$x=-1$ で最大値 2, $x=1$ で最小値 -2" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2+4x-3$ ($1 \\leq x \\leq 4$)", a: "$x=2$ で最大値 1, $x=4$ で最小値 -3" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2-2x+5$ ($-3 \\leq x \\leq 0$)", a: "$x=-1$ で最大値 6, $x=-3, 0$ で最小値 2" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2+6x-4$ ($2 \\leq x \\leq 5$)", a: "$x=3$ で最大値 5, $x=5$ で最小値 1" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=2x^2-4x+3$ ($0 \\leq x \\leq 2$)", a: "$x=0, 2$ で最大値 3, $x=1$ で最小値 1" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-2x^2+8x-5$ ($1 \\leq x \\leq 4$)", a: "$x=2$ で最大値 3, $x=4$ で最小値 -5" }
];

const data1_2 = [
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2+2x+2$ ($2 < x \\leq 4$)", a: "最大値なし, $x=4$ で最小値 -6" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2+6x-5$ ($0 < x \\leq 2$)", a: "$x=2$ で最大値 3, 最小値なし" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2-4x+7$ ($0 \\leq x < 1$)", a: "$x=0$ で最大値 7, 最小値なし" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2+2x$ ($-4 < x \\leq -2$)", a: "最大値なし, $x=-2$ で最小値 0" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2+4x-1$ ($3 < x \\leq 5$)", a: "最大値なし, $x=5$ で最小値 -6" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2-6x+10$ ($4 < x \\leq 6$)", a: "$x=6$ で最大値 10, 最小値なし" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2-2x+3$ ($0 < x \\leq 2$)", a: "最大値なし, $x=2$ で最小値 -5" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2+4x+5$ ($-1 \\leq x < 1$)", a: "最大値なし, $x=-1$ で最小値 2" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=-x^2+8x-10$ ($0 < x \\leq 2$)", a: "$x=2$ で最大値 2, 最小値なし" },
    { q: "次の関数に最大値、最小値があれば、それを求めよ。\n$y=x^2-2x+4$ ($2 < x \\leq 3$)", a: "$x=3$ で最大値 7, 最小値なし" }
];

const data2 = [
    { q: "関数 $y=-x^2+4x+c$ ($0\\le x\\le 3$) の最小値が -2 となるように，定数 $c$ の値を定めよ。また，そのときの最大値を求めよ。", a: "$c=-2$, 最大値 2" },
    { q: "関数 $y=-x^2+2x+c$ ($-1\\le x\\le 2$) の最小値が 3 となるように，定数 $c$ の値を定めよ。また，そのときの最大値を求めよ。", a: "$c=6$, 最大値 7" },
    { q: "関数 $y=-x^2+8x+c$ ($1\\le x\\le 5$) の最小値が 0 となるように，定数 $c$ の値を定めよ。また，そのときの最大値を求めよ。", a: "$c=-7$, 最大値 9" },
    { q: "関数 $y=x^2-6x+c$ ($1\\le x\\le 5$) の最大値が 10 となるように，定数 $c$ の値を定めよ。また，そのときの最小値を求めよ。", a: "$c=15$, 最小値 6" },
    { q: "関数 $y=x^2+4x+c$ ($-3\\le x\\le 0$) の最大値が 5 となるように，定数 $c$ の値を定めよ。また，そのときの最小値を求めよ。", a: "$c=5$, 最小値 1" },
    { q: "関数 $y=-x^2-2x+c$ ($-2\\le x\\le 2$) の最小値が -5 となるように，定数 $c$ の値を定めよ。また，そのときの最大値を求めよ。", a: "$c=3$, 最大値 4" },
    { q: "関数 $y=x^2-2x+c$ ($0\\le x\\le 3$) の最大値が 8 となるように，定数 $c$ の値を定めよ。また，そのときの最小値を求めよ。", a: "$c=5$, 最小値 4" },
    { q: "関数 $y=-x^2+10x+c$ ($2\\le x\\le 6$) の最小値が 4 となるように，定数 $c$ の値を定めよ。また，そのときの最大値を求めよ。", a: "$c=-12$, 最大値 13" },
    { q: "関数 $y=x^2+2x+c$ ($-2\\le x\\le 2$) の最大値が 12 となるように，定数 $c$ の値を定めよ。また，そのときの最小値を求めよ。", a: "$c=4$, 最小値 3" },
    { q: "関数 $y=-x^2+6x+c$ ($0\\le x\\le 5$) の最小値が -1 となるように，定数 $c$ の値を定めよ。また，そのときの最大値を求めよ。", a: "$c=-1$, 最大値 8" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];

function addProbs(data, unit) {
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
}

addProbs(data1_1, unit1);
addProbs(data1_2, unit1);
addProbs(data2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
