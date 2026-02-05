const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "2次関数の最大・最小（係数決定）";
const unit2 = "2次関数の最大・最小（動く定義域）";

const data1 = [
    { q: "$a>0$ とする。関数 $f(x)=ax^2-2ax+b$ ($0 \\le x \\le 3$) の最大値が 11, 最小値が 3 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=5$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2-4ax+b$ ($0 \\le x \\le 3$) の最大値が 13, 最小値が 1 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=3, b=13$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2+2ax+b$ ($-2 \\le x \\le 2$) の最大値が 21, 最小値が 3 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=5$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2-6ax+b$ ($0 \\le x \\le 4$) の最大値が 10, 最小値が -8 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=10$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2-2ax+b$ ($-1 \\le x \\le 2$) の最大値が 14, 最小値が 2 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=3, b=5$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2+4ax+b$ ($-3 \\le x \\le 0$) の最大値が 8, 最小値が -4 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=3, b=8$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2-2ax+b$ ($0 \\le x \\le 4$) の最大値が 23, 最小値が 5 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=7$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2+6ax+b$ ($-4 \\le x \\le -1$) の最大値が 8, 最小値が -4 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=3, b=23$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2-4ax+b$ ($1 \\le x \\le 5$) の最大値が 29, 最小値が 2 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=3, b=14$" },
    { q: "$a>0$ とする。関数 $f(x)=ax^2+2ax+b$ ($-3 \\le x \\le 2$) の最大値が 20, 最小値が 2 のとき, 定数 $a, b$ の値を求めよ。", a: "$a=2, b=4$" }
];

const data2 = [
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-2x+2$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<2$ のとき $x=0$ で最大値 2\n$a=2$ のとき $x=0, 2$ で最大値 2\n$a>2$ のとき $x=a$ で最大値 $a^2-2a+2$\n(2)\n$0<a<1$ のとき $x=a$ で最小値 $a^2-2a+2$\n$a \\ge 1$ のとき $x=1$ で最小値 1" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-6x+10$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<6$ のとき $x=0$ で最大値 10\n$a=6$ のとき $x=0, 6$ で最大値 10\n$a>6$ のとき $x=a$ で最大値 $a^2-6a+10$\n(2)\n$0<a<3$ のとき $x=a$ で最小値 $a^2-6a+10$\n$a \\ge 3$ のとき $x=3$ で最小値 1" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-4x+3$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<4$ のとき $x=0$ で最大値 3\n$a=4$ のとき $x=0, 4$ で最大値 3\n$a>4$ のとき $x=a$ で最大値 $a^2-4a+3$\n(2)\n$0<a<2$ のとき $x=a$ で最小値 $a^2-4a+3$\n$a \\ge 2$ のとき $x=2$ で最小値 -1" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-10x+30$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<10$ のとき $x=0$ で最大値 30\n$a=10$ のとき $x=0, 10$ で最大値 30\n$a>10$ のとき $x=a$ で最大値 $a^2-10a+30$\n(2)\n$0<a<5$ のとき $x=a$ で最小値 $a^2-10a+30$\n$a \\ge 5$ のとき $x=5$ で最小値 5" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-8x+18$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<8$ のとき $x=0$ で最大値 18\n$a=8$ のとき $x=0, 8$ で最大値 18\n$a>8$ のとき $x=a$ で最大値 $a^2-8a+18$\n(2)\n$0<a<4$ のとき $x=a$ で最小値 $a^2-8a+18$\n$a \\ge 4$ のとき $x=4$ で最小値 2" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-2x-1$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<2$ のとき $x=0$ で最大値 -1\n$a=2$ のとき $x=0, 2$ で最大値 -1\n$a>2$ のとき $x=a$ で最大値 $a^2-2a-1$\n(2)\n$0<a<1$ のとき $x=a$ で最小値 $a^2-2a-1$\n$a \\ge 1$ のとき $x=1$ で最小値 -2" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-6x+5$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<6$ のとき $x=0$ で最大値 5\n$a=6$ のとき $x=0, 6$ で最大値 5\n$a>6$ のとき $x=a$ で最大値 $a^2-6a+5$\n(2)\n$0<a<3$ のとき $x=a$ で最小値 $a^2-6a+5$\n$a \\ge 3$ のとき $x=3$ で最小値 -4" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-4x$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<4$ のとき $x=0$ で最大値 0\n$a=4$ のとき $x=0, 4$ で最大値 0\n$a>4$ のとき $x=a$ で最大値 $a^2-4a$\n(2)\n$0<a<2$ のとき $x=a$ で最小値 $a^2-4a$\n$a \\ge 2$ のとき $x=2$ で最小値 -4" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-12x+40$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<12$ のとき $x=0$ で最大値 40\n$a=12$ のとき $x=0, 12$ で最大値 40\n$a>12$ のとき $x=a$ で最大値 $a^2-12a+40$\n(2)\n$0<a<6$ のとき $x=a$ で最小値 $a^2-12a+40$\n$a \\ge 6$ のとき $x=6$ で最小値 4" },
    { q: "$a$ は正の定数とする。$0 \\le x \\le a$ における関数 $f(x)=x^2-14x+50$ について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。", a: "(1)\n$0<a<14$ のとき $x=0$ で最大値 50\n$a=14$ のとき $x=0, 14$ で最大値 50\n$a>14$ のとき $x=a$ で最大値 $a^2-14a+50$\n(2)\n$0<a<7$ のとき $x=a$ で最小値 $a^2-14a+50$\n$a \\ge 7$ のとき $x=7$ で最小値 1" }
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
addProbs(data2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
