const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次方程式の共通解";
const unit2 = "絶対値を含む2次方程式";

const data1 = [
    { q: "2つの2次方程式 $x^2+kx+2=0, x^2+2x+k=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=-3$, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2+kx-3=0, x^2-3x+k=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=2$, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2+4x+k=0, x^2+kx+4=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=-5$, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2-5x+k=0, x^2+kx-5=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=4$, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2+kx+6=0, x^2+6x+k=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=-7$, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2+kx-k-1=0, x^2+x-2=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k \\neq 1$ のすべての実数, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2+kx+k-1=0, x^2+x-6=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=-1$ のとき共通解は $x=2$, $k=4$ のとき共通解は $x=-3$" },
    { q: "2つの2次方程式 $x^2+kx+k=0, x^2+2x-3=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=-\\frac{1}{2}$ のとき共通解は $x=1$, $k=\\frac{9}{2}$ のとき共通解は $x=-3$" },
    { q: "2つの2次方程式 $x^2+ax+1=0, x^2+x+a=0$ がただ1つの共通の実数解をもつように, 定数 $a$ の値を定め, その共通解を求めよ。", a: "$a=-2$, 共通解は $x=1$" },
    { q: "2つの2次方程式 $x^2+kx-2=0, x^2-2x+k=0$ がただ1つの共通の実数解をもつように, 定数 $k$ の値を定め, その共通解を求めよ。", a: "$k=1$, 共通解は $x=1$" }
];

const data2_1 = [
    { q: "次の方程式を解け。\n$x^2-3|x|-4=0$", a: "$x=\\pm4$" },
    { q: "次の方程式を解け。\n$x^2-5|x|+6=0$", a: "$x=\\pm2, \\pm3$" },
    { q: "次の方程式を解け。\n$x^2-4|x|+3=0$", a: "$x=\\pm1, \\pm3$" },
    { q: "次の方程式を解け。\n$x^2+|x|-2=0$", a: "$x=\\pm1$" },
    { q: "次の方程式を解け。\n$x^2-6|x|+8=0$", a: "$x=\\pm2, \\pm4$" },
    { q: "次の方程式を解け。\n$x^2-|x|-12=0$", a: "$x=\\pm4$" },
    { q: "次の方程式を解け。\n$x^2-7|x|+10=0$", a: "$x=\\pm2, \\pm5$" },
    { q: "次の方程式を解け。\n$x^2+2|x|-8=0$", a: "$x=\\pm2$" },
    { q: "次の方程式を解け。\n$x^2-8|x|+15=0$", a: "$x=\\pm3, \\pm5$" },
    { q: "次の方程式を解け。\n$x^2-|x|-2=0$", a: "$x=\\pm2$" }
];

const data2_2 = [
    { q: "次の方程式を解け。\n$x^2+|x-1|=1$", a: "$x=0, 1$" },
    { q: "次の方程式を解け。\n$x^2+|x-2|=2$", a: "$x=0, 1$" },
    { q: "次の方程式を解け。\n$x^2+|x+1|=1$", a: "$x=0, -1$" },
    { q: "次の方程式を解け。\n$x^2+|x+2|=2$", a: "$x=0, -1$" },
    { q: "次の方程式を解け。\n$x^2-|x-2|=4$", a: "$x=-3, 2$" },
    { q: "次の方程式を解け。\n$x^2-|x+1|=5$", a: "$x=3, \\frac{-1-\\sqrt{17}}{2}$" },
    { q: "次の方程式を解け。\n$x^2+2|x-1|=2$", a: "$x=0$" },
    { q: "次の方程式を解け。\n$x^2+|x-3|=3$", a: "$x=0, 1$" },
    { q: "次の方程式を解け。\n$x^2+|x+4|=4$", a: "$x=0, -1$" },
    { q: "次の方程式を解け。\n$x^2-|x-3|=9$", a: "$x=-4, 3$" }
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
addProbs(data2_1, unit2);
addProbs(data2_2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
