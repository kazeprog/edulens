const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次関数の最大・最小（動く軸）";
const unit2 = "2次関数の最大・最小（動く定義域）";

const data1 = [
    {
        q: "aは定数とする。関数 $f(x)=x^2-2ax+2a$ ($0 \\le x \\le 4$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-a)^2-a^2+2a$\n(1) 最大値\n$a<2$ のとき $x=4$ で $16-6a$\n$a=2$ のとき $x=0,4$ で $4$\n$a>2$ のとき $x=0$ で $2a$\n(2) 最小値\n$a<0$ のとき $x=0$ で $2a$\n$0 \\le a \\le 4$ のとき $x=a$ で $-a^2+2a$\n$a>4$ のとき $x=4$ で $16-6a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-2ax+3a$ ($0 \\le x \\le 2$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-a)^2-a^2+3a$\n(1) 最大値\n$a<1$ のとき $x=2$ で $4-a$\n$a=1$ のとき $x=0,2$ で $3$\n$a>1$ のとき $x=0$ で $3a$\n(2) 最小値\n$a<0$ のとき $x=0$ で $3a$\n$0 \\le a \\le 2$ のとき $x=a$ で $-a^2+3a$\n$a>2$ のとき $x=2$ で $4-a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-4ax+a$ ($0 \\le x \\le 2$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-2a)^2-4a^2+a$\n(1) 最大値\n$a<\\frac{1}{2}$ のとき $x=2$ で $4-7a$\n$a=\\frac{1}{2}$ のとき $x=0,2$ で $\\frac{1}{2}$\n$a>\\frac{1}{2}$ のとき $x=0$ で $a$\n(2) 最小値\n$a<0$ のとき $x=0$ で $a$\n$0 \\le a \\le 1$ のとき $x=2a$ で $-4a^2+a$\n$a>1$ のとき $x=2$ で $4-7a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2+2ax-a$ ($-2 \\le x \\le 0$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x+a)^2-a^2-a$, 軸は $x=-a$\n(1) 最大値\n$a>1$ のとき $x=0$ で $-a$\n$a=1$ のとき $x=-2,0$ で $-1$\n$a<1$ のとき $x=-2$ で $4-5a$\n(2) 最小値\n$a>2$ のとき $x=-2$ で $4-5a$\n$0 \\le a \\le 2$ のとき $x=-a$ で $-a^2-a$\n$a<0$ のとき $x=0$ で $-a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-2ax$ ($1 \\le x \\le 5$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-a)^2-a^2$\n(1) 最大値\n$a<3$ のとき $x=5$ で $25-10a$\n$a=3$ のとき $x=1,5$ で $-5$\n$a>3$ のとき $x=1$ で $1-2a$\n(2) 最小値\n$a<1$ のとき $x=1$ で $1-2a$\n$1 \\le a \\le 5$ のとき $x=a$ で $-a^2$\n$a>5$ のとき $x=5$ で $25-10a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-2ax+a^2$ ($0 \\le x \\le 4$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-a)^2$\n(1) 最大値\n$a<2$ のとき $x=4$ で $(4-a)^2$\n$a=2$ のとき $x=0,4$ で $4$\n$a>2$ のとき $x=0$ で $a^2$\n(2) 最小値\n$a<0$ のとき $x=0$ で $a^2$\n$0 \\le a \\le 4$ のとき $x=a$ で $0$\n$a>4$ のとき $x=4$ で $(4-a)^2$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-2ax+1$ ($0 \\le x \\le 6$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-a)^2-a^2+1$\n(1) 最大値\n$a<3$ のとき $x=6$ で $37-12a$\n$a=3$ のとき $x=0,6$ で $1$\n$a>3$ のとき $x=0$ で $1$\n(2) 最小値\n$a<0$ のとき $x=0$ で $1$\n$0 \\le a \\le 6$ のとき $x=a$ で $-a^2+1$\n$a>6$ のとき $x=6$ で $37-12a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-6ax+a$ ($0 \\le x \\le 2$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-3a)^2-9a^2+a$\n(1) 最大値\n$a<\\frac{1}{3}$ のとき $x=2$ で $4-11a$\n$a=\\frac{1}{3}$ のとき $x=0,2$ で $\\frac{1}{3}$\n$a>\\frac{1}{3}$ のとき $x=0$ で $a$\n(2) 最小値\n$a<0$ のとき $x=0$ で $a$\n$0 \\le a \\le \\frac{2}{3}$ のとき $x=3a$ で $-9a^2+a$\n$a>\\frac{2}{3}$ のとき $x=2$ で $4-11a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2+4ax+a$ ($-4 \\le x \\le 0$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x+2a)^2-4a^2+a$, 軸は $x=-2a$\n(1) 最大値\n$a>1$ のとき $x=0$ で $a$\n$a=1$ のとき $x=-4,0$ で $1$\n$a<1$ のとき $x=-4$ で $16-15a$\n(2) 最小値\n$a>2$ のとき $x=-4$ で $16-15a$\n$0 \\le a \\le 2$ のとき $x=-2a$ で $-4a^2+a$\n$a<0$ のとき $x=0$ で $a$"
    },
    {
        q: "aは定数とする。関数 $f(x)=x^2-2ax+5$ ($0 \\le x \\le 2$)について\n(1) 最大値を求めよ。\n(2) 最小値を求めよ。",
        a: "平方完成すると $f(x)=(x-a)^2-a^2+5$\n(1) 最大値\n$a<1$ のとき $x=2$ で $9-4a$\n$a=1$ のとき $x=0,2$ で $5$\n$a>1$ のとき $x=0$ で $5$\n(2) 最小値\n$a<0$ のとき $x=0$ で $5$\n$0 \\le a \\le 2$ のとき $x=a$ で $-a^2+5$\n$a>2$ のとき $x=2$ で $9-4a$"
    }
];

const data2 = [
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2-4x+5$ の最小値を求めよ。",
        a: "$f(x)=(x-2)^2+1$\n$a<0$ のとき $x=a+2$ で $a^2+1$\n$0 \\le a \\le 2$ のとき $x=2$ で $1$\n$a>2$ のとき $x=a$ で $a^2-4a+5$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2-6x+10$ の最小値を求めよ。",
        a: "$f(x)=(x-3)^2+1$\n$a<1$ のとき $x=a+2$ で $a^2-2a+2$\n$1 \\le a \\le 3$ のとき $x=3$ で $1$\n$a>3$ のとき $x=a$ で $a^2-6a+10$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2+2x+3$ の最小値を求めよ。",
        a: "$f(x)=(x+1)^2+2$\n$a<-3$ のとき $x=a+2$ で $a^2+6a+11$\n$-3 \\le a \\le -1$ のとき $x=-1$ で $2$\n$a>-1$ のとき $x=a$ で $a^2+2a+3$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+3$ における関数 $f(x)=x^2-2x+5$ の最小値を求めよ。",
        a: "$f(x)=(x-1)^2+4$\n$a<-2$ のとき $x=a+3$ で $a^2+4a+8$\n$-2 \\le a \\le 1$ のとき $x=1$ で $4$\n$a>1$ のとき $x=a$ で $a^2-2a+5$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+1$ における関数 $f(x)=x^2-4x+1$ の最小値を求めよ。",
        a: "$f(x)=(x-2)^2-3$\n$a<1$ のとき $x=a+1$ で $a^2-2a-2$\n$1 \\le a \\le 2$ のとき $x=2$ で $-3$\n$a>2$ のとき $x=a$ で $a^2-4a+1$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2+4x$ の最小値を求めよ。",
        a: "$f(x)=(x+2)^2-4$\n$a<-4$ のとき $x=a+2$ で $a^2+8a+12$\n$-4 \\le a \\le -2$ のとき $x=-2$ で $-4$\n$a>-2$ のとき $x=a$ で $a^2+4a$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+4$ における関数 $f(x)=x^2-8x+20$ の最小値を求めよ。",
        a: "$f(x)=(x-4)^2+4$\n$a<0$ のとき $x=a+4$ で $a^2+4$\n$0 \\le a \\le 4$ のとき $x=4$ で $4$\n$a>4$ のとき $x=a$ で $a^2-8a+20$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2-2x-3$ の最小値を求めよ。",
        a: "$f(x)=(x-1)^2-4$\n$a<-1$ のとき $x=a+2$ で $a^2+2a-3$\n$-1 \\le a \\le 1$ のとき $x=1$ で $-4$\n$a>1$ のとき $x=a$ で $a^2-2a-3$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2+6x+5$ の最小値を求めよ。",
        a: "$f(x)=(x+3)^2-4$\n$a<-5$ のとき $x=a+2$ で $a^2+10a+21$\n$-5 \\le a \\le -3$ のとき $x=-3$ で $-4$\n$a>-3$ のとき $x=a$ で $a^2+6a+5$"
    },
    {
        q: "aは定数とする。$a \\le x \\le a+2$ における関数 $f(x)=x^2-10x+30$ の最小値を求めよ。",
        a: "$f(x)=(x-5)^2+5$\n$a<3$ のとき $x=a+2$ で $a^2-6a+14$\n$3 \\le a \\le 5$ のとき $x=5$ で $5$\n$a>5$ のとき $x=a$ で $a^2-10a+30$"
    }
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
