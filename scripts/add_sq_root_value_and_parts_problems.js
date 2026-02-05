const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "平方根と式の値";
const unit2 = "整数部分と小数部分";

const data1_1 = [
    { q: "$x=\\frac{\\sqrt{5}-1}{2}, y=\\frac{\\sqrt{5}+1}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$2\\sqrt{5}$" },
    { q: "$x=\\frac{\\sqrt{11}-\\sqrt{7}}{2}, y=\\frac{\\sqrt{11}+\\sqrt{7}}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$8\\sqrt{11}$" },
    { q: "$x=\\frac{\\sqrt{3}-1}{2}, y=\\frac{\\sqrt{3}+1}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$\\frac{3\\sqrt{3}}{2}$" },
    { q: "$x=\\frac{\\sqrt{6}-\\sqrt{2}}{2}, y=\\frac{\\sqrt{6}+\\sqrt{2}}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$3\\sqrt{6}$" },
    { q: "$x=\\frac{\\sqrt{13}-3}{2}, y=\\frac{\\sqrt{13}+3}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$10\\sqrt{13}$" }, // Manual correction: \sqrt{9} to 3
    { q: "$x=\\frac{\\sqrt{5}-\\sqrt{3}}{2}, y=\\frac{\\sqrt{5}+\\sqrt{3}}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$\\frac{7\\sqrt{5}}{2}$" },
    { q: "$x=\\sqrt{3}-\\sqrt{2}, y=\\sqrt{3}+\\sqrt{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$18\\sqrt{3}$" },
    { q: "$x=\\frac{\\sqrt{10}-\\sqrt{6}}{2}, y=\\frac{\\sqrt{10}+\\sqrt{6}}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$7\\sqrt{10}$" },
    { q: "$x=\\frac{\\sqrt{2}-1}{2}, y=\\frac{\\sqrt{2}+1}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$\\frac{5\\sqrt{2}}{4}$" },
    { q: "$x=\\frac{\\sqrt{15}-\\sqrt{11}}{2}, y=\\frac{\\sqrt{15}+\\sqrt{11}}{2}$ のとき、$x^3+y^3$ の値を求めよ。", a: "$12\\sqrt{15}$" }
];

const data1_2 = [
    { q: "$x+y+z=0, xy+yz+zx=-6, xyz=3\\sqrt{2}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{2}$" },
    { q: "$x+y+z=0, xy+yz+zx=-15, xyz=5\\sqrt{3}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{3}$" },
    { q: "$x+y+z=0, xy+yz+zx=-8, xyz=4\\sqrt{2}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{2}$" },
    { q: "$x+y+z=0, xy+yz+zx=-4, xyz=2\\sqrt{2}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{2}$" },
    { q: "$x+y+z=0, xy+yz+zx=-9, xyz=3\\sqrt{3}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{3}$" },
    { q: "$x+y+z=0, xy+yz+zx=-12, xyz=2\\sqrt{6}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{6}$" },
    { q: "$x+y+z=0, xy+yz+zx=-7, xyz=\\sqrt{14}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$\\sqrt{14}$" },
    { q: "$x+y+z=0, xy+yz+zx=-20, xyz=4\\sqrt{5}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{5}$" },
    { q: "$x+y+z=0, xy+yz+zx=-10, xyz=5\\sqrt{2}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{2}$" },
    { q: "$x+y+z=0, xy+yz+zx=-3, xyz=\\sqrt{3}$ のとき、$\\frac{x}{yz}+\\frac{y}{zx}+\\frac{z}{xy}$ の値を求めよ。", a: "$2\\sqrt{3}$" }
];

const data2_raw = [
    { val: "1+\\sqrt{2}", int: "2", frac: "\\sqrt{2}-1", sum: "2\\sqrt{2}", sqsum: "6" },
    { val: "2+\\sqrt{5}", int: "4", frac: "\\sqrt{5}-2", sum: "2\\sqrt{5}", sqsum: "18" },
    { val: "3+\\sqrt{10}", int: "6", frac: "\\sqrt{10}-3", sum: "2\\sqrt{10}", sqsum: "38" },
    { val: "4+\\sqrt{17}", int: "8", frac: "\\sqrt{17}-4", sum: "2\\sqrt{17}", sqsum: "66" },
    { val: "2+\\sqrt{2}", int: "3", frac: "\\sqrt{2}-1", sum: "2\\sqrt{2}", sqsum: "6" },
    { val: "3+\\sqrt{5}", int: "5", frac: "\\sqrt{5}-2", sum: "2\\sqrt{5}", sqsum: "18" },
    { val: "4+\\sqrt{10}", int: "7", frac: "\\sqrt{10}-3", sum: "2\\sqrt{10}", sqsum: "38" },
    { val: "1+\\sqrt{10}", int: "4", frac: "\\sqrt{10}-3", sum: "2\\sqrt{10}", sqsum: "38" },
    { val: "2+\\sqrt{10}", int: "5", frac: "\\sqrt{10}-3", sum: "2\\sqrt{10}", sqsum: "38" },
    { val: "5+\\sqrt{26}", int: "10", frac: "\\sqrt{26}-5", sum: "2\\sqrt{26}", sqsum: "102" }
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

addProbs(data1_1, unit1);
addProbs(data1_2, unit1);

for (const p of data2_raw) {
    const q = `$${p.val}$ の整数部分を $a$, 小数部分を $b$ とするとき, 次の値を求めよ。\n(1) $a, b$\n(2) $b+\\frac{1}{b}$, $b^2+\\frac{1}{b^2}$`;
    const a = `(1) $a=${p.int}, b=${p.frac}$\n(2) $b+\\frac{1}{b}=${p.sum}, b^2+\\frac{1}{b^2}=${p.sqsum}$`;
    const exists = existingJson.some(ex => ex.question === q && ex.unit === unit2);
    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit2,
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
