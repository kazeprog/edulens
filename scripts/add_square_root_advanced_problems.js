const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "3項の平方根の計算";
const unit2 = "3項の分母の有理化";
const unit3 = "平方根と式の値";

const instruction1 = "次の式を計算せよ。";
const instruction2 = "次の式の分母を有理化せよ。";

const data1 = [
    { q: "$(1+\\sqrt{2}+\\sqrt{3})(1+\\sqrt{2}-\\sqrt{3})$", a: "$2\\sqrt{2}$" },
    { q: "$(2+\\sqrt{3}+\\sqrt{5})(2+\\sqrt{3}-\\sqrt{5})$", a: "$2+4\\sqrt{3}$" },
    { q: "$(\\sqrt{2}+\\sqrt{3}+\\sqrt{5})(\\sqrt{2}+\\sqrt{3}-\\sqrt{5})$", a: "$2\\sqrt{6}$" },
    { q: "$(3+\\sqrt{2}+\\sqrt{11})(3+\\sqrt{2}-\\sqrt{11})$", a: "$6\\sqrt{2}$" },
    { q: "$(\\sqrt{5}+\\sqrt{2}+3)(\\sqrt{5}+\\sqrt{2}-3)$", a: "$2\\sqrt{10}-2$" },
    { q: "$(\\sqrt{7}+\\sqrt{3}+\\sqrt{10})(\\sqrt{7}+\\sqrt{3}-\\sqrt{10})$", a: "$2\\sqrt{21}$" },
    { q: "$(2+\\sqrt{6}+\\sqrt{10})(2+\\sqrt{6}-\\sqrt{10})$", a: "$4\\sqrt{6}$" },
    { q: "$(1+\\sqrt{5}+\\sqrt{6})(1+\\sqrt{5}-\\sqrt{6})$", a: "$2\\sqrt{5}$" },
    { q: "$(2+\\sqrt{2}+\\sqrt{6})(2+\\sqrt{2}-\\sqrt{6})$", a: "$4\\sqrt{2}$" },
    { q: "$(\\sqrt{6}+\\sqrt{3}+3)(\\sqrt{6}+\\sqrt{3}-3)$", a: "$6\\sqrt{2}$" }
];

const data2 = [
    { q: "$\\frac{1}{1+\\sqrt{2}+\\sqrt{3}}$", a: "$\\frac{2+\\sqrt{2}-\\sqrt{6}}{4}$" },
    { q: "$\\frac{1}{\\sqrt{2}+\\sqrt{3}+\\sqrt{5}}$", a: "$\\frac{3\\sqrt{2}+2\\sqrt{3}-\\sqrt{30}}{12}$" },
    { q: "$\\frac{1}{2+\\sqrt{2}+\\sqrt{6}}$", a: "$\\frac{1+\\sqrt{2}-\\sqrt{3}}{4}$" },
    { q: "$\\frac{1}{\\sqrt{5}+\\sqrt{3}+\\sqrt{2}}$", a: "$\\frac{3\\sqrt{2}+2\\sqrt{3}-\\sqrt{30}}{12}$" },
    { q: "$\\frac{1}{1+\\sqrt{3}+\\sqrt{2}}$", a: "$\\frac{\\sqrt{6}+\\sqrt{2}-2}{4}$" },
    { q: "$\\frac{1}{\\sqrt{6}+\\sqrt{3}+3}$", a: "$\\frac{2\\sqrt{3}+\\sqrt{6}-3\\sqrt{2}}{12}$" },
    { q: "$\\frac{1}{\\sqrt{7}+\\sqrt{3}+\\sqrt{10}}$", a: "$\\frac{7\\sqrt{3}+3\\sqrt{7}-\\sqrt{210}}{42}$" },
    { q: "$\\frac{1}{2+\\sqrt{3}+\\sqrt{5}}$", a: "$\\frac{18+11\\sqrt{3}-3\\sqrt{5}-4\\sqrt{15}}{39}$" },
    { q: "$\\frac{1}{1+\\sqrt{5}+\\sqrt{6}}$", a: "$\\frac{\\sqrt{5}+5-\\sqrt{30}}{10}$" },
    { q: "$\\frac{12}{\\sqrt{2}+\\sqrt{3}+\\sqrt{5}}$", a: "$3\\sqrt{2}+2\\sqrt{3}-\\sqrt{30}$" }
];

const data3_raw = [
    { x: "\\frac{\\sqrt{3}-\\sqrt{2}}{\\sqrt{3}+\\sqrt{2}}", y: "\\frac{\\sqrt{3}+\\sqrt{2}}{\\sqrt{3}-\\sqrt{2}}", expr: "x^2+y^2+xy", a1: "x+y=10, xy=1", a2: "99" },
    { x: "\\frac{2-\\sqrt{3}}{2+\\sqrt{3}}", y: "\\frac{2+\\sqrt{3}}{2-\\sqrt{3}}", expr: "x^2-xy+y^2", a1: "x+y=14, xy=1", a2: "193" },
    { x: "\\frac{\\sqrt{5}-2}{\\sqrt{5}+2}", y: "\\frac{\\sqrt{5}+2}{\\sqrt{5}-2}", expr: "x^2+3xy+y^2", a1: "x+y=18, xy=1", a2: "325" },
    { x: "\\frac{\\sqrt{3}-1}{\\sqrt{3}+1}", y: "\\frac{\\sqrt{3}+1}{\\sqrt{3}-1}", expr: "2x^2-xy+2y^2", a1: "x+y=4, xy=1", a2: "27" },
    { x: "\\frac{\\sqrt{5}-\\sqrt{3}}{\\sqrt{5}+\\sqrt{3}}", y: "\\frac{\\sqrt{5}+\\sqrt{3}}{\\sqrt{5}-\\sqrt{3}}", expr: "x^2+y^2", a1: "x+y=8, xy=1", a2: "62" },
    { x: "\\frac{\\sqrt{6}-\\sqrt{5}}{\\sqrt{6}+\\sqrt{5}}", y: "\\frac{\\sqrt{6}+\\sqrt{5}}{\\sqrt{6}-\\sqrt{5}}", expr: "4x^2-7xy+4y^2", a1: "x+y=22, xy=1", a2: "1921" },
    { x: "\\frac{3-2\\sqrt{2}}{3+2\\sqrt{2}}", y: "\\frac{3+2\\sqrt{2}}{3-2\\sqrt{2}}", expr: "x^2+4xy+y^2", a1: "x+y=34, xy=1", a2: "1158" },
    { x: "\\frac{\\sqrt{7}-\\sqrt{5}}{\\sqrt{7}+\\sqrt{5}}", y: "\\frac{\\sqrt{7}+\\sqrt{5}}{\\sqrt{7}-\\sqrt{5}}", expr: "3x^2+2xy+3y^2", a1: "x+y=12, xy=1", a2: "428" },
    { x: "\\frac{\\sqrt{10}-3}{\\sqrt{10}+3}", y: "\\frac{\\sqrt{10}+3}{\\sqrt{10}-3}", expr: "x^2-3xy+y^2", a1: "x+y=38, xy=1", a2: "1439" },
    { x: "\\frac{\\sqrt{2}+1}{\\sqrt{2}-1}", y: "\\frac{\\sqrt{2}-1}{\\sqrt{2}+1}", expr: "2x^2-3xy+2y^2", a1: "x+y=6, xy=1", a2: "65" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

function addProbs(data, unit, inst) {
    for (const p of data) {
        const fullQuestion = inst ? `${inst}\n${p.q}` : p.q;
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
}

addProbs(data1, unit1, instruction1);
addProbs(data2, unit2, instruction2);

for (const p of data3_raw) {
    const q = `$x=${p.x}, y=${p.y}$ のとき, 次の式の値を求めよ。\n(1) $x+y, xy$\n(2) $${p.expr}$`;
    const a = `(1) $${p.a1}$\n(2) ${p.a2}`;
    const exists = existingJson.some(ex => ex.question === q && ex.unit === unit3);
    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit3,
            problem_number: lastProblemNumber,
            question: q,
            answer: a
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
