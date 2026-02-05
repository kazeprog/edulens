const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次方程式の解法";
const unit2 = "方程式の解から係数の決定";

const data1_1 = [
    { q: "解の公式を利用して，次の2次方程式を解け。\n$3x^2+7x+1=0$", a: "$x=\\frac{-7\\pm\\sqrt{37}}{6}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x^2-5x-1=0$", a: "$x=\\frac{5\\pm\\sqrt{33}}{4}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$5x^2+x-2=0$", a: "$x=\\frac{-1\\pm\\sqrt{41}}{10}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$3x^2-3x-1=0$", a: "$x=\\frac{3\\pm\\sqrt{21}}{6}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x^2+7x+4=0$", a: "$x=\\frac{-7\\pm\\sqrt{17}}{4}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$4x^2-5x+1=0$", a: "$x=1, \\frac{1}{4}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x^2+3x-1=0$", a: "$x=\\frac{-3\\pm\\sqrt{17}}{4}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$5x^2-9x+2=0$", a: "$x=\\frac{9\\pm\\sqrt{41}}{10}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$3x^2+x-1=0$", a: "$x=\\frac{-1\\pm\\sqrt{13}}{6}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x^2-x-5=0$", a: "$x=\\frac{1\\pm\\sqrt{41}}{4}$" }
];

const data1_2 = [
    { q: "解の公式を利用して，次の2次方程式を解け。\n$x(x+4)=2$", a: "$x=-2\\pm\\sqrt{6}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x(x-3)=1$", a: "$x=\\frac{3\\pm\\sqrt{11}}{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$3x(x+1)=5$", a: "$x=\\frac{-3\\pm\\sqrt{69}}{6}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$x(2x-5)=-1$", a: "$x=\\frac{5\\pm\\sqrt{17}}{4}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$4x(x+1)=2$", a: "$x=\\frac{-1\\pm\\sqrt{3}}{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$3x(2x-1)=1$", a: "$x=\\frac{3\\pm\\sqrt{33}}{12}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$x(3x+4)=2$", a: "$x=\\frac{-2\\pm\\sqrt{10}}{3}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x(2x+3)=1$", a: "$x=\\frac{-3\\pm\\sqrt{13}}{4}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$5x(x-1)=2$", a: "$x=\\frac{5\\pm\\sqrt{65}}{10}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2x(3x+2)=1$", a: "$x=\\frac{-2\\pm\\sqrt{10}}{6}$" }
];

const data1_3 = [
    { q: "解の公式を利用して，次の2次方程式を解け。\n$\\sqrt{2}x^2+4x+\\sqrt{2}=0$", a: "$x=-\\sqrt{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$\\sqrt{3}x^2-5x+\\sqrt{3}=0$", a: "$x=\\frac{5\\pm\\sqrt{13}}{2\\sqrt{3}}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2\\sqrt{2}x^2+6x+\\sqrt{2}=0$", a: "$x=\\frac{-3\\pm\\sqrt{5}}{2\\sqrt{2}}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$\\sqrt{5}x^2+4x-\\sqrt{5}=0$", a: "$x=\\frac{-2\\pm\\sqrt{11}}{\\sqrt{5}}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$x^2-2\\sqrt{3}x+2=0$", a: "$x=\\sqrt{3}\\pm1$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$\\sqrt{6}x^2+4x+\\sqrt{6}=0$", a: "実数解なし" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$3\\sqrt{2}x^2+8x+2\\sqrt{2}=0$", a: "$x=-\\frac{\\sqrt{2}}{3}, -\\sqrt{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$\\sqrt{2}x^2-3x-\\sqrt{2}=0$", a: "$x=\\frac{3\\pm\\sqrt{17}}{2\\sqrt{2}}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$\\sqrt{3}x^2+6x+2\\sqrt{3}=0$", a: "$x=-\\sqrt{3}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$2\\sqrt{5}x^2-8x+\\sqrt{5}=0$", a: "$x=\\frac{4\\pm\\sqrt{6}}{2\\sqrt{5}}$" }
];

const data1_4 = [
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x+1)^2+3(x+1)-1=0$", a: "$x=\\frac{-5\\pm\\sqrt{13}}{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x-2)^2-4(x-2)+2=0$", a: "$x=4\\pm\\sqrt{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x+3)^2+2(x+3)-5=0$", a: "$x=-4\\pm\\sqrt{6}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x-1)^2+5(x-1)+3=0$", a: "$x=\\frac{-3\\pm\\sqrt{13}}{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x+4)^2-2(x+4)-4=0$", a: "$x=-3\\pm\\sqrt{5}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x-3)^2+6(x-3)+1=0$", a: "$x=\\pm2\\sqrt{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(2x+1)^2+4(2x+1)-1=0$", a: "$x=\\frac{-3\\pm\\sqrt{5}}{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x+2)^2-3(x+2)-2=0$", a: "$x=\\frac{-1\\pm\\sqrt{17}}{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x-5)^2+2(x-5)-7=0$", a: "$x=4\\pm2\\sqrt{2}$" },
    { q: "解の公式を利用して，次の2次方程式を解け。\n$(x+1)^2-5(x+1)+2=0$", a: "$x=\\frac{3\\pm\\sqrt{17}}{2}$" }
];

const data2_1 = [
    { q: "2次方程式 $x^2+ax-a^2=0$ の解の1つが1であるとき，定数 $a$ の値を求めよ。", a: "$a=\\frac{1\\pm\\sqrt{5}}{2}$" },
    { q: "2次方程式 $x^2-2ax+a^2-1=0$ の解の1つが2であるとき，定数 $a$ の値を求めよ。", a: "$a=1, 3$" },
    { q: "2次方程式 $x^2+ax-2a^2=0$ の解の1つが2であるとき，定数 $a$ の値を求めよ。", a: "$a=2, -1$" },
    { q: "2次方程式 $x^2-ax-a^2+5=0$ の解の1つが-1であるとき，定数 $a$ の値を求めよ。", a: "$a=3, -2$" },
    { q: "2次方程式 $2x^2+ax-a^2=0$ の解の1つが2であるとき，定数 $a$ の値を求めよ。", a: "$a=4, -2$" },
    { q: "2次方程式 $x^2+3ax+a^2-2=0$ の解の1つが-1であるとき，定数 $a$ の値を求めよ。", a: "$a=\\frac{3\\pm\\sqrt{13}}{2}$" },
    { q: "2次方程式 $x^2-ax-2a^2+4=0$ の解の1つが2であるとき，定数 $a$ の値を求めよ。", a: "$a=\\frac{-1\\pm\\sqrt{17}}{2}$" },
    { q: "2次方程式 $x^2+ax+a^2-7=0$ の解の1つが1であるとき，定数 $a$ の値を求めよ。", a: "$a=2, -3$" },
    { q: "2次方程式 $x^2-2ax-a^2+10=0$ の解の1つが3であるとき，定数 $a$ の値を求めよ。", a: "$a=-3\\pm2\\sqrt{7}$" },
    { q: "2次方程式 $x^2+4ax+2a^2-1=0$ の解の1つが-1であるとき，定数 $a$ の値を求めよ。", a: "$a=0, 2$" }
];

const data2_2 = [
    { q: "2つの2次方程式 $px^2+qx-3=0$, $x^2-px+q+1=0$ が，ともに $x=1$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{5}{2}, q=\\frac{1}{2}$" },
    { q: "2つの2次方程式 $px^2+qx+4=0$, $x^2+px-q-2=0$ が，ともに $x=2$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=-1, q=0$" },
    { q: "2つの2次方程式 $px^2-qx+1=0$, $x^2+px+q-5=0$ が，ともに $x=-1$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=-\\frac{5}{2}, q=\\frac{3}{2}$" },
    { q: "2つの2次方程式 $2px^2+qx-6=0$, $3x^2-px+2q+1=0$ が，ともに $x=1$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{16}{5}, q=-\\frac{2}{5}$" },
    { q: "2つの2次方程式 $px^2+qx-2=0$, $x^2+2px-q+3=0$ が，ともに $x=-2$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{4}{3}, q=\\frac{5}{3}$" },
    { q: "2つの2次方程式 $px^2-qx+5=0$, $x^2+px+q-7=0$ が，ともに $x=2$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{1}{8}, q=\\frac{11}{4}$" },
    { q: "2つの2次方程式 $3px^2+2qx-1=0$, $x^2-px+q=0$ が，ともに $x=1$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{3}{5}, q=-\\frac{2}{5}$" },
    { q: "2つの2次方程式 $px^2+qx+6=0$, $2x^2+px-q-2=0$ が，ともに $x=-2$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{3}{4}, q=\\frac{9}{2}$" },
    { q: "2つの2次方程式 $px^2-qx-4=0$, $x^2+3px+q+1=0$ が，ともに $x=1$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=\\frac{1}{2}, q=-\\frac{7}{2}$" },
    { q: "2つの2次方程式 $px^2+qx-1=0$, $4x^2-px+2q-2=0$ が，ともに $x=\\frac{1}{2}$ を解にもつとき，定数 $p, q$ の値を求めよ。", a: "$p=2, q=1$" }
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
addProbs(data1_3, unit1);
addProbs(data1_4, unit1);
addProbs(data2_1, unit2);
addProbs(data2_2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
