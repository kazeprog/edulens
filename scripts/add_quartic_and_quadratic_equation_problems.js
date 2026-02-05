const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "4次関数の最大・最小";
const unit2 = "2次方程式の解法";

const data1 = [
    { q: "$0 \\leq x \\leq 4$ のとき、xの関数 $y=(x^2-4x)^2+6(x^2-4x)+10$ の最大値と最小値を求めよ。", a: "最大値: 10, 最小値: 1" },
    { q: "$1 \\leq x \\leq 3$ のとき、xの関数 $y=(x^2-4x)^2+4(x^2-4x)+5$ の最大値と最小値を求めよ。", a: "最大値: 5, 最小値: 2" },
    { q: "$-1 \\leq x \\leq 2$ のとき、xの関数 $y=(x^2-2x)^2+2(x^2-2x)-3$ の最大値と最小値を求めよ。", a: "最大値: 12, 最小値: -4" },
    { q: "$0 \\leq x \\leq 3$ のとき、xの関数 $y=(x^2-2x)^2-4(x^2-2x)+1$ の最大値と最小値を求めよ。", a: "最大値: 6, 最小値: -3" },
    { q: "$2 \\leq x \\leq 6$ のとき、xの関数 $y=(x^2-8x)^2+14(x^2-8x)+45$ の最大値と最小値を求めよ。", a: "最大値: 77, 最小値: 21" },
    { q: "$-3 \\leq x \\leq 1$ のとき、xの関数 $y=(x^2+2x)^2+8(x^2+2x)+12$ の最大値と最小値を求めよ。", a: "最大値: 45, 最小値: 5" },
    { q: "$1 \\leq x \\leq 4$ のとき、xの関数 $y=(x^2-6x)^2+10(x^2-6x)+20$ の最大値と最小値を求めよ。", a: "最大値: 11, 最小値: -5" },
    { q: "$-1 \\leq x \\leq 4$ のとき、xの関数 $y=(x^2-4x)^2+2(x^2-4x)-5$ の最大値と最小値を求めよ。", a: "最大値: 30, 最小値: -6" },
    { q: "$0 \\leq x \\leq 5$ のとき、x의関数 $y=(x^2-4x)^2-2(x^2-4x)+8$ の最大値と最小値を求めよ。", a: "最大値: 32, 最小値: 7" },
    { q: "$1 \\leq x \\leq 5$ のとき、xの関数 $y=(x^2-6x)^2+8(x^2-6x)+10$ の最大値と最小値を求めよ。", a: "最大値: 19, 最小値: -5" }
];

const data2_1 = [
    { q: "次の 2 次方程式を解け。\n$x^2+5x+6=0$", a: "$x=-2, -3$" },
    { q: "次の 2 次方程式を解け。\n$x^2-7x+10=0$", a: "$x=2, 5$" },
    { q: "次の 2 次方程式を解け。\n$x^2+8x+12=0$", a: "$x=-2, -6$" },
    { q: "次の 2 次方程式を解け。\n$x^2-9x+14=0$", a: "$x=2, 7$" },
    { q: "次の 2 次方程式を解け。\n$x^2+11x+18=0$", a: "$x=-2, -9$" },
    { q: "次の 2 次方程式を解け。\n$x^2-12x+35=0$", a: "$x=5, 7$" },
    { q: "次の 2 次方程式を解け。\n$x^2+13x+36=0$", a: "$x=-4, -9$" },
    { q: "次の 2 次方程式を解け。\n$x^2-15x+56=0$", a: "$x=7, 8$" },
    { q: "次の 2 次方程式を解け。\n$x^2+2x-8=0$", a: "$x=2, -4$" },
    { q: "次の 2 次方程式を解け。\n$x^2-x-20=0$", a: "$x=5, -4$" }
];

const data2_2 = [
    { q: "次の 2 次方程式を解け。\n$2x^2+5x+3=0$", a: "$x=-1, -\\frac{3}{2}$" },
    { q: "次の 2 次方程式を解け。\n$2x^2-7x+3=0$", a: "$x=3, \\frac{1}{2}$" },
    { q: "次の 2 次方程式を解け。\n$3x^2+7x+2=0$", a: "$x=-2, -\\frac{1}{3}$" },
    { q: "次の 2 次方程式を解け。\n$3x^2-8x+4=0$", a: "$x=2, \\frac{2}{3}$" },
    { q: "次の 2 次方程式を解け。\n$2x^2+9x+4=0$", a: "$x=-4, -\\frac{1}{2}$" },
    { q: "次の 2 次方程式を解け。\n$5x^2+7x+2=0$", a: "$x=-1, -\\frac{2}{5}$" },
    { q: "次の 2 次方程式を解け。\n$2x^2+x-1=0$", a: "$x=-1, \\frac{1}{2}$" },
    { q: "次の 2 次方程式を解け。\n$3x^2-5x-2=0$", a: "$x=2, -\\frac{1}{3}$" },
    { q: "次の 2 次方程式を解け。\n$2x^2-3x-2=0$", a: "$x=2, -\\frac{1}{2}$" },
    { q: "次の 2 次方程式を解け。\n$5x^2-11x+2=0$", a: "$x=2, \\frac{1}{5}$" }
];

const data2_3 = [
    { q: "次の 2 次方程式を解け。\n$4x^2+12x+5=0$", a: "$x=-\\frac{1}{2}, -\\frac{5}{2}$" },
    { q: "次の 2 次方程式を解け。\n$4x^2-8x+3=0$", a: "$x=\\frac{1}{2}, \\frac{3}{2}$" },
    { q: "次の 2 次方程式を解け。\n$6x^2+7x+2=0$", a: "$x=-\\frac{1}{2}, -\\frac{2}{3}$" },
    { q: "次の 2 次方程式を解け。\n$6x^2-x-1=0$", a: "$x=\\frac{1}{2}, -\\frac{1}{3}$" },
    { q: "次の 2 次方程式を解け。\n$9x^2+6x-8=0$", a: "$x=\\frac{2}{3}, -\\frac{4}{3}$" },
    { q: "次の 2 次方程式を解け。\n$4x^2+4x-3=0$", a: "$x=\\frac{1}{2}, -\\frac{3}{2}$" },
    { q: "次の 2 次方程式を解け。\n$6x^2+x-12=0$", a: "$x=\\frac{4}{3}, -\\frac{3}{2}$" },
    { q: "次の 2 次方程式を解け。\n$8x^2+10x-3=0$", a: "$x=\\frac{1}{4}, -\\frac{3}{2}$" },
    { q: "次の 2 次方程式を解け。\n$4x^2+15x-4=0$", a: "$x=\\frac{1}{4}, -4$" },
    { q: "次の 2 次方程式を解け。\n$6x^2-13x+6=0$", a: "$x=\\frac{2}{3}, \\frac{3}{2}$" }
];

const data2_4 = [
    { q: "次の 2 次方程式を解け。\n$4x^2-5=0$", a: "$x=\\pm\\frac{\\sqrt{5}}{2}$" },
    { q: "次の 2 次方程式を解け。\n$9x^2-2=0$", a: "$x=\\pm\\frac{\\sqrt{2}}{3}$" },
    { q: "次の 2 次方程式を解け。\n$25x^2-7=0$", a: "$x=\\pm\\frac{\\sqrt{7}}{5}$" },
    { q: "次の 2 次方程式を解け。\n$36x^2-11=0$", a: "$x=\\pm\\frac{\\sqrt{11}}{6}$" },
    { q: "次の 2 次方程式を解け。\n$4x^2-13=0$", a: "$x=\\pm\\frac{\\sqrt{13}}{2}$" },
    { q: "次の 2 次方程式を解け。\n$16x^2-5=0$", a: "$x=\\pm\\frac{\\sqrt{5}}{4}$" },
    { q: "次の 2 次方程式を解け。\n$49x^2-3=0$", a: "$x=\\pm\\frac{\\sqrt{3}}{7}$" },
    { q: "次の 2 次方程式を解け。\n$9x^2-10=0$", a: "$x=\\pm\\frac{\\sqrt{10}}{3}$" },
    { q: "次の 2 次方程式を解け。\n$64x^2-7=0$", a: "$x=\\pm\\frac{\\sqrt{7}}{8}$" },
    { q: "次の 2 次方程式を解け。\n$4x^2-21=0$", a: "$x=\\pm\\frac{\\sqrt{21}}{2}$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

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

addProbs(data1, unit1);
addProbs(data2_1, unit2);
addProbs(data2_2, unit2);
addProbs(data2_3, unit2);
addProbs(data2_4, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
