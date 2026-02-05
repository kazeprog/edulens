const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次方程式の実数解の条件";
const unit2 = "2次方程式の重解";
const unit3 = "xの方程式の実数解の条件";
const unit4 = "xの方程式のただ1つの実数解";

const data1 = [
    { q: "2次方程式 $x^2+kx+k+3=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le -2, 6 \le k$" },
    { q: "2次方程式 $x^2+2kx+3k+4=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le -1, 4 \le k$" },
    { q: "2次方程式 $x^2+4x+k-2=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le 6$" },
    { q: "2次方程式 $x^2-2kx+k^2+k-5=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le 5$" },
    { q: "2次方程式 $x^2+(k+1)x+k+1=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le -1, 3 \le k$" },
    { q: "2次方程式 $x^2+2(k-2)x+k^2-5k+6=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \ge 2$" },
    { q: "2次方程式 $x^2-6x+2k-4=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le \\frac{13}{2}$" },
    { q: "2次方程式 $x^2+kx+k^2-3=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$-2 \le k \le 2$" },
    { q: "2次方程式 $x^2+2kx+k+6=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "$k \le -2, 3 \le k$" },
    { q: "2次方程式 $x^2-kx+k-1=0$ が実数解をもつように, 定数 $k$ の値の範囲を定めよ。", a: "すべての実数" }
];

const data2 = [
    { q: "2次方程式 $x^2+6x+k=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=9$, 重解 $x=-3$" },
    { q: "2次方程式 $x^2+kx+16=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=8$ のとき重解 $x=-4, k=-8$ のとき重解 $x=4$" },
    { q: "2次方程式 $2x^2-8x+k=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=8$, 重解 $x=2$" },
    { q: "2次方程式 $x^2-10x+3k+1=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=8$, 重解 $x=5$" },
    { q: "2次方程式 $3x^2+12x+k=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=12$, 重解 $x=-2$" },
    { q: "2次方程式 $4x^2+kx+9=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=12$ のとき重解 $x=-\\frac{3}{2}, k=-12$ のとき重解 $x=\\frac{3}{2}$" },
    { q: "2次方程式 $x^2+kx+k+3=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=6$ のとき重解 $x=-3, k=-2$ のとき重解 $x=1$" },
    { q: "2次方程式 $x^2-2(k+1)x+4k=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=1$, 重解 $x=2$" },
    { q: "2次方程式 $5x^2+20x+k=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=20$, 重解 $x=-2$" },
    { q: "2次方程式 $x^2-4x+k-5=0$ が重解をもつように, 定数 $k$ の値を定め, そのときの重解を求めよ。", a: "$k=9$, 重解 $x=2$" }
];

const data3 = [
    { q: "$x$ の2次方程式 $(m-1)x^2-2mx+m+2=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\leq 2, m \\neq 1$" },
    { q: "$x$ の2次方程式 $(m+2)x^2+4x+m-1=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$-3 \\leq m \\leq 2, m \\neq -2$" },
    { q: "$x$ の2次方程式 $(m-3)x^2+2(m-1)x+m+2=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\geq -7, m \\neq 3$" },
    { q: "$x$ の2次方程式 $(m+1)x^2-2(m-2)x+m-5=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\leq \\frac{9}{2}, m \\neq -1$" },
    { q: "$x$ の2次方程式 $(m-4)x^2+2mx+m+1=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\leq \\frac{4}{3}, m \\neq 4$" },
    { q: "$x$ の2次方程式 $(m+3)x^2-6x+m-5=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$-4 \\leq m \\leq 6, m \\neq -3$" },
    { q: "$x$ の2次方程式 $(m-2)x^2+4(m+1)x+4m+9=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\geq -2, m \\neq 2$" },
    { q: "$x$ の2次方程式 $(m+5)x^2-2(m+1)x+m-2=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\geq -\\frac{11}{5}, m \\neq -5$" },
    { q: "$x$ の2次方程式 $(m-1)x^2-2(m+2)x+m+5=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\geq -9, m \\neq 1$" },
    { q: "$x$ の2次方程式 $(2m-1)x^2-4mx+2m+3=0$ が実数解をもつように, 定数 $m$ の値の範囲を定めよ。", a: "$m \\geq -\\frac{3}{10}, m \\neq \\frac{1}{2}$" }
];

const data4 = [
    { q: "$x$ の方程式 $(m-1)x^2+2mx+m+3=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=1, \\frac{3}{2}$" },
    { q: "$x$ の方程式 $(m+2)x^2-2(m-1)x+m-2=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=-2, 5$" },
    { q: "$x$ の方程式 $(m-3)x^2+4x+m+1=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=3, 1, -5$" },
    { q: "$x$ の方程式 $(m+1)x^2-2mx+m-2=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=-1, -2$" },
    { q: "$x$ の方程式 $(2m+1)x^2+4mx+2m-3=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=-\\frac{1}{2}, \\frac{3}{10}$" },
    { q: "$x$ の方程式 $(m-2)x^2-2(m+2)x+m+5=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=2, -14$" },
    { q: "$x$ の方程式 $(m+4)x^2+2(m+1)x+m+1=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=-4, -1$" },
    { q: "$x$ の方程式 $(m-5)x^2+6x+m+3=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=5, 6, -4$" },
    { q: "$x$ の方程式 $(m+3)x^2-2mx+m-4=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=-3, 12$" },
    { q: "$x$ の方程式 $(3m-1)x^2+2mx+m+1=0$ がただ1つの実数解をもつとき, 定数 $m$ の値を求めよ。", a: "$m=\\frac{1}{3}, \\frac{-1 \\pm \\sqrt{3}}{2}$" }
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
addProbs(data3, unit3);
addProbs(data4, unit4);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
