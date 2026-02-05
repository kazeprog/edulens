const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "1次関数の決定";

const data1 = [
    { q: "1次関数 $f(x)=ax+b$ について、$f(1)=3$ かつ $f(3)=7$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=2, b=1$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(-2)=5$ かつ $f(2)=1$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=-1, b=3$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(0)=4$ かつ $f(5)=-6$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=-2, b=4$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(3)=10$ かつ $f(5)=16$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=3, b=1$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(-1)=-5$ かつ $f(2)=4$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=3, b=-2$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(4)=2$ かつ $f(6)=3$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=\\frac{1}{2}, b=0$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(-3)=11$ かつ $f(2)=1$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=-2, b=5$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(1)=-1$ かつ $f(4)=-7$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=-2, b=1$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(-4)=-10$ かつ $f(2)=2$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=2, b=-2$" },
    { q: "1次関数 $f(x)=ax+b$ について、$f(2)=7$ かつ $f(4)=13$ であるとき、定数 $a, b$ の値を求めよ。", a: "$a=3, b=1$" }
];

const data2 = [
    { q: "関数 $y=ax+b$ ($1\\le x\\le 3$) の値域が $2\\le y\\le 8$ となるように、定数 $a, b$ の値を定めよ。ただし、$a>0$ とする。", a: "$a=3, b=-1$" },
    { q: "関数 $y=ax+b$ ($0\\le x\\le 4$) の値域が $-3\\le y\\le 5$ となるように、定数 $a, b$ の値を定めよ。ただし、$a>0$ とする。", a: "$a=2, b=-3$" },
    { q: "関数 $y=ax+b$ ($-1\\le x\\le 2$) の値域が $1\\le y\\le 7$ となるように、定数 $a, b$ の値を定めよ。ただし、$a>0$ とする。", a: "$a=2, b=3$" },
    { q: "関数 $y=ax+b$ ($1\\le x\\le 4$) の値域が $2\\le y\\le 11$ となるように、定数 $a, b$ の値を定めよ。ただし、$a>0$ とする。", a: "$a=3, b=-1$" },
    { q: "関数 $y=ax+b$ ($2\\le x\\le 5$) の値域が $1\\le y\\le 7$ となるように、定数 $a, b$ の値を定めよ。ただし、$a>0$ とする。", a: "$a=2, b=-3$" },
    { q: "関数 $y=ax+b$ ($1\\le x\\le 4$) の値域が $1\\le y\\le 7$ となるように、定数 $a, b$ の値を定めよ。ただし、$a<0$ とする。", a: "$a=-2, b=9$" },
    { q: "関数 $y=ax+b$ ($-2\\le x\\le 1$) の値域が $-1\\le y\\le 5$ となるように、定数 $a, b$ の値を定めよ。ただし、$a<0$ とする。", a: "$a=-2, b=1$" },
    { q: "関数 $y=ax+b$ ($2\\le x\\le 6$) の値域が $-4\\le y\\le 8$ となるように、定数 $a, b$ の値を定めよ。ただし、$a<0$ とする。", a: "$a=-3, b=14$" },
    { q: "関数 $y=ax+b$ ($0\\le x\\le 3$) の値域が $1\\le y\\le 10$ となるように、定数 $a, b$ の値を定めよ。ただし、$a<0$ とする。", a: "$a=-3, b=10$" },
    { q: "関数 $y=ax+b$ ($-3\\le x\\le -1$) の値域が $2\\le y\\le 6$ となるように、定数 $a, b$ の値を定めよ。ただし、$a<0$ とする。", a: "$a=-2, b=0$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

const allData = [...data1, ...data2];

for (const p of allData) {
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

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
