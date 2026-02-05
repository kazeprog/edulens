const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit = "2次不等式の解から係数決定";

const data1 = [
    { q: "$x$ についての2次不等式 $x^2+ax+b \\geqq 0$ の解が $x \\leqq 1, 4 \\leqq x$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-5, b=4$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\leqq 0$ の解が $-2 \\leqq x \\leqq 5$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-3, b=-10$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\geqq 0$ の解が $x \\leqq -3, -1 \\leqq x$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=4, b=3$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\leqq 0$ の解が $0 \\leqq x \\leqq 6$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-6, b=0$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\geqq 0$ の解が $x \\leqq -4, 2 \\leqq x$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=2, b=-8$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\leqq 0$ の解が $2 \\leqq x \\leqq 3$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-5, b=6$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\geqq 0$ の解が $x \\leqq -5, -2 \\leqq x$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=7, b=10$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\leqq 0$ の解が $-1 \\leqq x \\leqq 6$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-5, b=-6$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\geqq 0$ の解が $x \\leqq 3, 7 \\leqq x$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-10, b=21$" },
    { q: "$x$ についての2次不等式 $x^2+ax+b \\leqq 0$ の解が $-6 \\leqq x \\leqq 1$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=5, b=-6$" }
];

const data2 = [
    { q: "$x$ についての2次不等式 $ax^2-4x+b>0$ の解が $-3<x<1$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-2, b=6$" },
    { q: "$x$ についての2次不等式 $ax^2-6x+b<0$ の解が $1<x<5$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=1, b=5$" },
    { q: "$x$ についての2次不等式 $ax^2-2x+b>0$ の解が $-2<x<4$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-1, b=8$" },
    { q: "$x$ についての2次不等式 $ax^2+5x+b<0$ の解が $-4<x<-1$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=1, b=4$" },
    { q: "$x$ についての2次不等式 $ax^2-10x+b<0$ の解が $2<x<3$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=2, b=12$" },
    { q: "$x$ についての2次不等式 $ax^2-5x+b>0$ の解が $-1<x<6$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-1, b=6$" },
    { q: "$x$ についての2次不等式 $ax^2+14x+b>0$ の解が $-5<x<-2$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-2, b=-20$" },
    { q: "$x$ についての2次不等式 $ax^2-8x+b<0$ の解が $0<x<4$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=2, b=0$" },
    { q: "$x$ についての2次不等式 $ax^2-x+b>0$ の解が $-2<x<3$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=-1, b=6$" },
    { q: "$x$ についての2次不等式 $ax^2-9x+b<0$ の解が $1<x<2$ となるように、定数 $a, b$ の値を定めよ。", a: "$a=3, b=6$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];

function addProbs(data) {
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

addProbs(data1);
addProbs(data2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
