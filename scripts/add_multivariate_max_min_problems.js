const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "条件つきの最大・最小";
const unit2 = "2変数関数の最大・最小";
const grade = "数Ⅰ";

const data1 = [
    { q: "$x\\ge0, y\\ge0, x+y=2$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 4 ($x=0, 2$ のとき), 最小値: 2 ($x=1$ のとき)" },
    { q: "$x\\ge0, y\\ge0, x+2y=4$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 16 ($x=4, y=0$ のとき), 最小値: $\\frac{16}{5}$ ($x=\\frac{4}{5}, y=\\frac{8}{5}$ のとき)" },
    { q: "$x\\ge0, y\\le0, x-y=3$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 9 ($x=0, 3$ のとき), 最小値: $\\frac{9}{2}$ ($x=\\frac{3}{2}$ のとき)" },
    { q: "$x\\le0, y\\ge0, x-y=-2$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 4 ($x=0, -2$ のとき), 最小値: 2 ($x=-1$ のとき)" },
    { q: "$x\\ge0, y\\ge0, 3x+y=6$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 36 ($x=0, y=6$ のとき), 最小値: $\\frac{18}{5}$ ($x=\\frac{9}{5}, y=\\frac{3}{5}$ のとき)" },
    { q: "$x\\ge1, y\\ge1, x+y=4$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 10 ($x=1, 3$ のとき), 最小値: 8 ($x=2$ のとき)" },
    { q: "$x\\ge0, y\\le0, x-2y=4$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 16 ($x=4, y=0$ のとき), 最小値: $\\frac{16}{5}$ ($x=\\frac{8}{5}, y=-\\frac{6}{5}$ のとき)" },
    { q: "$x\\ge0, y\\ge0, 2x+3y=6$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 9 ($x=0, y=2$ のとき), 最小値: $\\frac{36}{13}$ ($x=\\frac{12}{13}, y=\\frac{18}{13}$ のとき)" },
    { q: "$x\\le0, y\\le0, x+y=-3$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 9 ($x=0, -3$ のとき), 最小値: $\\frac{9}{2}$ ($x=-\\frac{3}{2}$ のとき)" },
    { q: "$x\\ge0, y\\ge0, x+y=5$ のとき、$x^2+y^2$ の最大値および最小値を求めよ。", a: "最大値: 25 ($x=0, 5$ のとき), 最小値: $\\frac{25}{2}$ ($x=\\frac{5}{2}$ のとき)" }
];

const data2 = [
    { q: "$x, y$ を実数とするとき、$x^2-2xy+2y^2-2y+6$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 5, $x=1, y=1$" },
    { q: "$x, y$ を実数とするとき、$x^2-4xy+6y^2-4y+3$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 1, $x=2, y=1$" },
    { q: "$x, y$ を実数とするとき、$x^2+2xy+2y^2-4y+4$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 0, $x=-2, y=2$" },
    { q: "$x, y$ を実数とするとき、$x^2-6xy+10y^2+2y-1$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: -2, $x=-3, y=-1$" },
    { q: "$x, y$ を実数とするとき、$x^2+4xy+7y^2-6y+7$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 4, $x=-2, y=1$" },
    { q: "$x, y$ を実数とするとき、$x^2-2xy+5y^2-16y+26$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 10, $x=2, y=2$" },
    { q: "$x, y$ を実数とするとき、$x^2-8xy+17y^2-2y+3$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 2, $x=4, y=1$" },
    { q: "$x, y$ を実数とするとき、$x^2+2xy+3y^2+8y+3$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: -5, $x=2, y=-2$" },
    { q: "$x, y$ を実数とするとき、$x^2-4xy+9y^2-10y+6$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 1, $x=2, y=1$" },
    { q: "$x, y$ を実数とするとき、$x^2+6xy+10y^2-6y+9$ の最小値を求め，そのときの $x, y$ の値を求めよ。", a: "最小値: 0, $x=-9, y=3$" }
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

addProbs(data1, unit1);
addProbs(data2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
