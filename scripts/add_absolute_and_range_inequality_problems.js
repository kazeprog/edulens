const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次不等式が常に成り立つ条件";
const unit2 = "特定の範囲で常に成り立つ2次不等式";

const data1_1 = [
    { q: "すべての実数 $x$ について, 不等式 $x^2+ax+a+3>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-2<a<6$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2-2ax+3a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$0<a<3$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2+4ax+5a+6>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-\\frac{3}{4}<a<2$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2-ax+a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$0<a<4$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2+2ax+2a+3>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-1<a<3$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2-6ax+8a+1>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$\\frac{1}{9}<a<1$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2+ax+4>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-4<a<4$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2-4ax+12a-8>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$2<a<4$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2+2ax+5a-4>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$1<a<4$" },
    { q: "すべての実数 $x$ について, 不等式 $x^2-ax+a+8>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-4<a<8$" }
];

const data1_2 = [
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2+2x+k\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$k\\leqq -1$" },
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2-4x+k\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$k\\leqq -2$" },
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2+kx+k-3\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$k\\leqq 0$" },
    { q: "すべての実数 $x$ に対して, 不等式 $(k-1)x^2+2(k-1)x-1\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$0\\leqq k \\leqq 1$" },
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2-2kx-3\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$-3\\leqq k \\leqq 0$" },
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2+6x+k\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$k\\leqq -3$" },
    { q: "すべての実数 $x$ に対して, 不等式 $(k+2)x^2-2(k+2)x-2\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$-4\\leqq k \\leqq -2$" },
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2+2kx+k-2\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$k\\leqq 0$" },
    { q: "すべての実数 $x$ に対して, 不等式 $kx^2-4x+2k\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$k\\leqq -\\sqrt{2}$" },
    { q: "すべての実数 $x$ に対して, 不等式 $(k-3)x^2+2(k-3)x-4\\leqq 0$ が成り立つような定数 $k$ の値の範囲を求めよ。", a: "$-1\\leqq k \\leqq 3$" }
];

const data2 = [
    { q: "$0 \\leqq x \\leqq 3$ の範囲において, 常に $x^2-2ax+4a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$0 < a < \\frac{9}{2}$" },
    { q: "$0 \\leqq x \\leqq 2$ の範囲において, 常に $x^2-2ax+a+2>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-2 < a < 2$" },
    { q: "$0 \\leqq x \\leqq 1$ の範囲において, 常に $x^2-2ax+a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$0 < a < 1$" },
    { q: "$0 \\leqq x \\leqq 4$ の範囲において, 常に $x^2-2ax+3a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$0 < a < 4$" },
    { q: "$0 \\leqq x \\leqq 2$ の範囲において, 常に $x^2-ax+a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$0 < a < 4$" },
    { q: "$1 \\leqq x \\leqq 2$ の範囲において, 常に $x^2-2ax+a+2>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$a < 3$" },
    { q: "$0 \\leqq x \\leqq 3$ の範囲において, 常に $x^2-2ax+a+6>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-6 < a < 3$" },
    { q: "$0 \\leqq x \\leqq 2$ の範囲において, 常に $x^2-4ax+3a+1>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-\\frac{1}{3} < a < \\frac{5}{13}$" },
    { q: "$0 \\leqq x \\leqq 1$ の範囲において, 常に $x^2-2ax+2a>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$a > 0$" },
    { q: "$0 \\leqq x \\leqq 4$ の範囲において, 常に $x^2-ax+a+2>0$ が成り立つように, 定数 $a$ の値の範囲を定めよ。", a: "$-2 < a < 2+2\\sqrt{3}$" }
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
