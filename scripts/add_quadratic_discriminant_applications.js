const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit = "2次方程式の解の判別";

const data1 = [
    { q: "2次方程式 $x^2+(a-1)x-a+4=0$ が実数解をもたないような，定数 $a$ の値の範囲を求めよ。", a: "$-5<a<3$" },
    { q: "2次方程式 $x^2+(k+2)x+k+5=0$ が実数解をもたないような，定数 $k$ の値の範囲を求めよ。", a: "$-4<k<4$" },
    { q: "2次方程式 $x^2+2ax+2a+3=0$ が実数解をもたないような，定数 $a$ の値の範囲を求めよ。", a: "$-1<a<3$" },
    { q: "2次方程式 $x^2-(k-3)x+k=0$ が実数解をもたないような，定数 $k$ の値の範囲を求めよ。", a: "$1<k<9$" },
    { q: "2次方程式 $x^2+(a-5)x-a+8=0$ が実数解をもたないような，定数 $a$ の値の範囲を求めよ。", a: "$-1<a<7$" },
    { q: "2次方程式 $x^2+2(k-1)x+k+5=0$ が実数解をもたないような，定数 $k$ の値の範囲を求めよ。", a: "$-1<k<4$" },
    { q: "2次方程式 $x^2+(a+1)x+a+4=0$ が実数解をもたないような，定数 $a$ の値の範囲を求めよ。", a: "$-3<a<5$" },
    { q: "2次方程式 $x^2-(k+4)x+4k+4=0$ が実数解をもたないような，定数 $k$ の値の範囲を求めよ。", a: "$0<k<12$" },
    { q: "2次方程式 $x^2+2ax+3a+4=0$ が実数解をもたないような，定数 $a$ の値の範囲を求めよ。", a: "$-1<a<4$" },
    { q: "2次方程式 $x^2+(k-2)x-2k+7=0$ が実数解をもたないような，定数 $k$ の値の範囲を求めよ。", a: "$-6<k<4$" }
];

const data2 = [
    { q: "$x$ の2次方程式 $x^2+4mx+3m^2+1=0$ の実数解の個数を求めよ。", a: "$m<-1, 1<m$ のとき2個；$m=\\pm1$ のとき1個；$-1<m<1$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2-2mx+2m^2-9=0$ の実数解の個数を求めよ。", a: "$-3<m<3$ のとき2個；$m=\\pm3$ のとき1個；$m<-3, 3<m$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2+6mx+8m^2+4=0$ の実数解の個数を求めよ。", a: "$m<-2, 2<m$ のとき2個；$m=\\pm2$ のとき1個；$-2<m<2$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2+2mx-m^2+2=0$ の実数解の個数を求めよ。", a: "$m<-1, 1<m$ のとき2個；$m=\\pm1$ のとき1個；$-1<m<1$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2-4mx+5m^2-4=0$ の実数解の個数を求めよ。", a: "$-2<m<2$ のとき2個；$m=\\pm2$ のとき1個；$m<-2, 2<m$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2+2(m+1)x+2m^2+2=0$ の実数解の個数を求めよ。", a: "$0<m<2$ のとき2個；$m=0, 2$ のとき1個；$m<0, 2<m$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2+8mx+15m^2+1=0$ の実数解の個数を求めよ。", a: "$m<-1, 1<m$ のとき2個；$m=\\pm1$ のとき1個；$-1<m<1$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2-6mx+10m^2-9=0$ の実数解の個数を求めよ。", a: "$-3<m<3$ のとき2個；$m=\\pm3$ のとき1個；$m<-3, 3<m$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2+2mx+3m^2-8=0$ の実数解の個数を求めよ。", a: "$-2<m<2$ のとき2個；$m=\\pm2$ のとき1個；$m<-2, 2<m$ のとき0個" },
    { q: "$x$ の2次方程式 $x^2-4mx+2m^2+2=0$ の実数解の個数を求めよ。", a: "$m<-1, 1<m$ のとき2個；$m=\\pm1$ のとき1個；$-1<m<1$ のとき0個" }
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
