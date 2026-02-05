const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit = "2次不等式の解法";

const data1_1 = [
    { q: "次の2次不等式を解け。\n$x^2-5x+6 \\geqq 0$", a: "$x \\leqq 2, 3 \\leqq x$" },
    { q: "次の2次不等式を解け。\n$x^2+x-12 < 0$", a: "$-4 < x < 3$" },
    { q: "次の2次不等式を解け。\n$x^2-7x+10 \\leqq 0$", a: "$2 \\leqq x \\leqq 5$" },
    { q: "次の2次不等式を解け。\n$x^2-2x-8 > 0$", a: "$x < -2, 4 < x$" },
    { q: "次の2次不等式を解け。\n$x^2+3x-10 \\geqq 0$", a: "$x \\leqq -5, 2 \\leqq x$" },
    { q: "次の2次不等式を解け。\n$x^2-6x+5 < 0$", a: "$1 < x < 5$" },
    { q: "次の2次不等式を解け。\n$x^2+5x-6 \\leqq 0$", a: "$-6 \\leqq x \\leqq 1$" },
    { q: "次の2次不等式を解け。\n$x^2-4x-12 > 0$", a: "$x < -2, 6 < x$" },
    { q: "次の2次不等式を解け。\n$x^2-9x+14 \\geqq 0$", a: "$x \\leqq 2, 7 \\leqq x$" },
    { q: "次の2次不等式を解け。\n$x^2+2x-15 < 0$", a: "$-5 < x < 3$" }
];

const data1_2 = [
    { q: "次の2次不等式を解け。\n$2x^2+5x+2 > 0$", a: "$x < -2, -\\frac{1}{2} < x$" },
    { q: "次の2次不等式を解け。\n$3x^2-10x+3 \\leqq 0$", a: "$\\frac{1}{3} \\leqq x \\leqq 3$" },
    { q: "次の2次不等式を解け。\n$6x^2+x-2 \\geqq 0$", a: "$x \\leqq -\\frac{2}{3}, \\frac{1}{2} \\leqq x$" },
    { q: "次の2次不等式を解け。\n$2x^2-7x+3 < 0$", a: "$\\frac{1}{2} < x < 3$" },
    { q: "次の2次不等式を解け。\n$4x^2+4x-3 > 0$", a: "$x < -\\frac{3}{2}, \\frac{1}{2} < x$" },
    { q: "次の2次不等式を解け。\n$10x^2-13x-3 \\leqq 0$", a: "$-\\frac{1}{5} \\leqq x \\leqq \\frac{3}{2}$" },
    { q: "次の2次不等式を解け。\n$3x^2+2x-1 \\geqq 0$", a: "$x \\leqq -1, \\frac{1}{3} \\leqq x$" },
    { q: "次の2次不等式を解け。\n$6x^2-7x+2 < 0$", a: "$\\frac{1}{2} < x < \\frac{2}{3}$" },
    { q: "次の2次不等式を解け。\n$2x^2-3x-5 > 0$", a: "$x < -1, \\frac{5}{2} < x$" },
    { q: "次の2次不等式を解け。\n$8x^2+10x-3 \\leqq 0$", a: "$-\\frac{3}{2} \\leqq x \\leqq \\frac{1}{4}$" }
];

const data1_3 = [
    { q: "次の2次不等式を解け。\n$x^2-4x+1 < 0$", a: "$2-\\sqrt{3} < x < 2+\\sqrt{3}$" },
    { q: "次の2次不等式を解け。\n$x^2+2x-4 \\geqq 0$", a: "$x \\leqq -1-\\sqrt{5}, -1+\\sqrt{5} \\leqq x$" },
    { q: "次の2次不等式を解け。\n$x^2-6x+7 \\leqq 0$", a: "$3-\\sqrt{2} \\leqq x \\leqq 3+\\sqrt{2}$" },
    { q: "次の2次不等式を解け。\n$2x^2-4x-1 > 0$", a: "$x < \\frac{2-\\sqrt{6}}{2}, \\frac{2+\\sqrt{6}}{2} < x$" },
    { q: "次の2次不等式を解け。\n$x^2+x-1 < 0$", a: "$\\frac{-1-\\sqrt{5}}{2} < x < \\frac{-1+\\sqrt{5}}{2}$" },
    { q: "次の2次不等式を解け。\n$3x^2+6x+1 \\leqq 0$", a: "$\\frac{-3-\\sqrt{6}}{3} \\leqq x \\leqq \\frac{-3+\\sqrt{6}}{3}$" },
    { q: "次の2次不等式を解け。\n$x^2-10x+20 > 0$", a: "$x < 5-\\sqrt{5}, 5+\\sqrt{5} < x$" },
    { q: "次の2次不等式を解け。\n$4x^2-4x-1 \\geqq 0$", a: "$x \\leqq \\frac{1-\\sqrt{2}}{2}, \\frac{1+\\sqrt{2}}{2} \\leqq x$" },
    { q: "次の2次不等式を解け。\n$x^2+4x-2 < 0$", a: "$-2-\\sqrt{6} < x < -2+\\sqrt{6}$" },
    { q: "次の2次不等式を解け。\n$2x^2+2x-1 \\leqq 0$", a: "$\\frac{-1-\\sqrt{3}}{2} \\leqq x \\leqq \\frac{-1+\\sqrt{3}}{2}$" }
];

const data1_4 = [
    { q: "次の2次不等式を解け。\n$-x^2+6x-4 \\geqq 0$", a: "$3-\\sqrt{5} \\leqq x \\leqq 3+\\sqrt{5}$" },
    { q: "次の2次不等式を解け。\n$-x^2-2x+5 < 0$", a: "$x < -1-\\sqrt{6}, -1+\\sqrt{6} < x$" },
    { q: "次の2次不等式を解け。\n$-2x^2+4x+1 \\leqq 0$", a: "$x \\leqq \\frac{2-\\sqrt{6}}{2}, \\frac{2+\\sqrt{6}}{2} \\leqq x$" },
    { q: "次の2次不等式を解け。\n$-x^2+3x+1 > 0$", a: "$\\frac{3-\\sqrt{13}}{2} < x < \\frac{3+\\sqrt{13}}{2}$" },
    { q: "次の2次不等式を解け。\n$-3x^2+6x+2 \\geqq 0$", a: "$\\frac{3-\\sqrt{15}}{3} \\leqq x \\leqq \\frac{3+\\sqrt{15}}{3}$" },
    { q: "次の2次不等式を解け。\n$-x^2-4x+1 \\leqq 0$", a: "$x \\leqq -2-\\sqrt{5}, -2+\\sqrt{5} \\leqq x$" },
    { q: "次の2次不等式を解け。\n$-2x^2+8x-5 > 0$", a: "$\\frac{4-\\sqrt{6}}{2} < x < \\frac{4+\\sqrt{6}}{2}$" },
    { q: "次の2次不等式を解け。\n$-x^2+x+3 \\geqq 0$", a: "$\\frac{1-\\sqrt{13}}{2} \\leqq x \\leqq \\frac{1+\\sqrt{13}}{2}$" },
    { q: "次の2次不等式を解け。\n$-4x^2+4x+1 < 0$", a: "$x < \\frac{1-\\sqrt{2}}{2}, \\frac{1+\\sqrt{2}}{2} < x$" },
    { q: "次の2次不等式を解け。\n$-x^2+10x-15 \\leqq 0$", a: "$x \\leqq 5-\\sqrt{10}, 5+\\sqrt{10} \\leqq x$" }
];

const data2_1 = [
    { q: "次の2次不等式を解け。\n$x^2-2x+1>0$", a: "1以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+4x+4>0$", a: "-2以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$x^2-6x+9>0$", a: "3以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+10x+25>0$", a: "-5以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$x^2-12x+36>0$", a: "6以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+14x+49>0$", a: "-7以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$4x^2-4x+1>0$", a: "$\\frac{1}{2}$以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$9x^2+6x+1>0$", a: "$-\\frac{1}{3}$以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$16x^2-8x+1>0$", a: "$\\frac{1}{4}$以外のすべての実数" },
    { q: "次の2次不等式を解け。\n$25x^2+10x+1>0$", a: "$-\\frac{1}{5}$以外のすべての実数" }
];

const data2_2 = [
    { q: "次の2次不等式を解け。\n$x^2-4x+4\\leqq0$", a: "$x=2$" },
    { q: "次の2次不等式を解け。\n$x^2+6x+9\\leqq0$", a: "$x=-3$" },
    { q: "次の2次不等式を解け。\n$x^2-10x+25\\leqq0$", a: "$x=5$" },
    { q: "次の2次不等式を解け。\n$x^2+2x+1\\leqq0$", a: "$x=-1$" },
    { q: "次の2次不等式を解け。\n$x^2-8x+16\\leqq0$", a: "$x=4$" },
    { q: "次の2次不等式を解け。\n$4x^2-12x+9\\leqq0$", a: "$x=\\frac{3}{2}$" },
    { q: "次の2次不等式を解け。\n$9x^2+12x+4\\leqq0$", a: "$x=-\\frac{2}{3}$" },
    { q: "次の2次不等式を解け。\n$16x^2-24x+9\\leqq0$", a: "$x=\\frac{3}{4}$" },
    { q: "次の2次不等式を解け。\n$25x^2+20x+4\\leqq0$", a: "$x=-\\frac{2}{5}$" },
    { q: "次の2次不等式を解け。\n$x^2-14x+49\\leqq0$", a: "$x=7$" }
];

const data2_3 = [
    { q: "次の2次不等式を解け。\n$x^2-2x+2\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+4x+5\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2-2x+5\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+6x+10\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2-x+1\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$2x^2-4x+3\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+3x+3\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$3x^2-6x+4\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2+2x+4\\geqq0$", a: "すべての実数" },
    { q: "次の2次不等式を解け。\n$x^2-4x+6\\geqq0$", a: "すべての実数" }
];

const data2_4 = [
    { q: "次の2次不等式を解け。\n$-x^2+2x-2\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-x^2-4x-5\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-x^2+2x-3\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-x^2-6x-10\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-2x^2+4x-3\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-x^2+x-1\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-x^2-3x-3\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-3x^2+6x-4\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-x^2-2x-2\\geqq0$", a: "解はない" },
    { q: "次の2次不等式を解け。\n$-2x^2-4x-5\\geqq0$", a: "解はない" }
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

addProbs(data1_1);
addProbs(data1_2);
addProbs(data1_3);
addProbs(data1_4);
addProbs(data2_1);
addProbs(data2_2);
addProbs(data2_3);
addProbs(data2_4);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
