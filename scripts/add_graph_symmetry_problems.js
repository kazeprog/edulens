const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "グラフの対称移動";
const instruction = "放物線を, 次の直線または点に関して, それぞれ対称移動して得られる放物線の方程式を求めよ。\n(1) $x$軸 (2) $y$軸 (3) 原点";

const rawData = [
    { base: "$y=x^2-2x+2$", a1: "$y=-x^2+2x-2$", a2: "$y=x^2+2x+2$", a3: "$y=-x^2-2x-2$" },
    { base: "$y=3x^2+6x-1$", a1: "$y=-3x^2-6x+1$", a2: "$y=3x^2-6x-1$", a3: "$y=-3x^2+6x+1$" },
    { base: "$y=-x^2+4x+5$", a1: "$y=x^2-4x-5$", a2: "$y=-x^2-4x+5$", a3: "$y=x^2+4x-5$" },
    { base: "$y=2x^2-8x+6$", a1: "$y=-2x^2+8x-6$", a2: "$y=2x^2+8x+6$", a3: "$y=-2x^2-8x-6$" },
    { base: "$y=-2x^2-4x+1$", a1: "$y=2x^2+4x-1$", a2: "$y=-2x^2+4x+1$", a3: "$y=2x^2-4x-1$" },
    { base: "$y=x^2+6x+9$", a1: "$y=-x^2-6x-9$", a2: "$y=x^2-6x+9$", a3: "$y=-x^2+6x-9$" },
    { base: "$y=4x^2-12x+5$", a1: "$y=-4x^2+12x-5$", a2: "$y=4x^2+12x+5$", a3: "$y=-4x^2-12x-5$" },
    { base: "$y=-3x^2+6x-2$", a1: "$y=3x^2-6x+2$", a2: "$y=-3x^2-6x-2$", a3: "$y=3x^2+6x+2$" },
    { base: "$y=2x^2+4x-5$", a1: "$y=-2x^2-4x+5$", a2: "$y=2x^2-4x-5$", a3: "$y=-2x^2+4x+5$" },
    { base: "$y=-x^2-2x+4$", a1: "$y=x^2+2x-4$", a2: "$y=-x^2+2x+4$", a3: "$y=x^2-2x-4$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

for (const p of rawData) {
    const q = `放物線 ${p.base} を対称移動したときの方程式を求めよ。\n(1) $x$軸 (2) $y$軸 (3) 原点`;
    const a = `(1) ${p.a1}\n(2) ${p.a2}\n(3) ${p.a3}`;

    const exists = existingJson.some(ex => ex.question === q && ex.unit === unit);
    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit,
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
