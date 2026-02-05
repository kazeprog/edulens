const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "文字係数の不等式";
const instruction = "$a$を定数とする。次の不等式を解け。";

const data1 = [
    { q: "$ax+5>0$", a: "$a>0$ のとき $x>-\\frac{5}{a}$, $a=0$ のときすべての実数, $a<0$ のとき $x<-\\frac{5}{a}$" },
    { q: "$ax-3<0$", a: "$a>0$ のとき $x<\\frac{3}{a}$, $a=0$ のときすべての実数, $a<0$ のとき $x>\\frac{3}{a}$" },
    { q: "$ax+4\\geq0$", a: "$a>0$ のとき $x\\geq-\\frac{4}{a}$, $a=0$ のときすべての実数, $a<0$ のとき $x\\leq-\\frac{4}{a}$" },
    { q: "$ax-1\\leq0$", a: "$a>0$ のとき $x\\leq\\frac{1}{a}$, $a=0$ のときすべての実数, $a<0$ のとき $x\\geq\\frac{1}{a}$" },
    { q: "$ax-10>0$", a: "$a>0$ のとき $x>\\frac{10}{a}$, $a=0$ のとき解はない, $a<0$ のとき $x<\\frac{10}{a}$" },
    { q: "$ax+6<0$", a: "$a>0$ のとき $x<-\\frac{6}{a}$, $a=0$ のとき解はない, $a<0$ のとき $x>-\\frac{6}{a}$" },
    { q: "$ax-2\\geq0$", a: "$a>0$ のとき $x\\geq\\frac{2}{a}$, $a=0$ のとき解はない, $a<0$ のとき $x\\leq\\frac{2}{a}$" },
    { q: "$ax+7\\leq0$", a: "$a>0$ のとき $x\\leq-\\frac{7}{a}$, $a=0$ のとき解はない, $a<0$ のとき $x\\geq-\\frac{7}{a}$" },
    { q: "$ax+8>0$", a: "$a>0$ のとき $x>-\\frac{8}{a}$, $a=0$ のときすべての実数, $a<0$ のとき $x<-\\frac{8}{a}$" },
    { q: "$ax-4<0$", a: "$a>0$ のとき $x<\\frac{4}{a}$, $a=0$ のときすべての実数, $a<0$ のとき $x>\\frac{4}{a}$" }
];

const data2 = [
    { q: "$ax-4>2x-2a$", a: "$a>2$ のとき $x>-2$, $a=2$ のとき解はない, $a<2$ のとき $x<-2$" },
    { q: "$ax+9<3x+3a$", a: "$a>3$ のとき $x<3$, $a=3$ のとき解はない, $a<3$ のとき $x>3$" },
    { q: "$ax-10\\geq5x-2a$", a: "$a>5$ のとき $x\\geq-2$, $a=5$ のときすべての実数, $a<5$ のとき $x\\leq-2$" },
    { q: "$ax+6\\leq-2x-3a$", a: "$a>-2$ のとき $x\\leq-3$, $a=-2$ のときすべての実数, $a<-2$ のとき $x\\geq-3$" },
    { q: "$ax-12>4x-3a$", a: "$a>4$ のとき $x>-3$, $a=4$ のとき解はない, $a<4$ のとき $x<-3$" },
    { q: "$ax+4<x+4a$", a: "$a>1$ のとき $x<4$, $a=1$ のとき解はない, $a<1$ のとき $x>4$" },
    { q: "$ax-6\\geq-3x+2a$", a: "$a>-3$ のとき $x\\geq2$, $a=-3$ のときすべての実数, $a<-3$ のとき $x\\leq2$" },
    { q: "$ax+15\\leq5x+3a$", a: "$a>5$ のとき $x\\leq3$, $a=5$ のときすべての実数, $a<5$ のとき $x\\geq3$" },
    { q: "$ax-2>-x+2a$", a: "$a>-1$ のとき $x>2$, $a=-1$ のとき解はない, $a<-1$ のとき $x<2$" },
    { q: "$ax+8<2x+4a$", a: "$a>2$ のとき $x<4$, $a=2$ のとき解はない, $a<2$ のとき $x>4$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

const allData = [...data1, ...data2];

for (const p of allData) {
    const fullQuestion = `${instruction}\n${p.q}`;
    const exists = existingJson.some(ex => ex.question === fullQuestion && ex.unit === unit);
    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit,
            problem_number: lastProblemNumber,
            question: fullQuestion,
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
