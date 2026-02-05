const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "グラフの平行移動";

const data = [
    { q: "放物線 $y=x^2-2x$ を、x軸方向に 3, y軸方向に 2 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=x^2-8x+17$" },
    { q: "放物線 $y=x^2+4x$ を、x軸方向に -2, y軸方向に 5 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=x^2+8x+17$" },
    { q: "放物線 $y=x^2-6x+5$ を、x軸方向に 1, y軸方向に -3 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=x^2-8x+9$" },
    { q: "放物線 $y=2x^2+4x$ を、x軸方向に -1, y軸方向に 4 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=2x^2+8x+10$" },
    { q: "放物線 $y=-x^2+2x$ を、x軸方向に 2, y軸方向に -1 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=-x^2+6x-9$" },
    { q: "放物線 $y=x^2+x$ を、x軸方向に 4, y軸方向に -2 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=x^2-7x+10$" },
    { q: "放物線 $y=3x^2-12x$ を、x軸方向に -3, y軸方向に 6 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=3x^2+6x-3$" },
    { q: "放物線 $y=-2x^2+4x+1$ を、x軸方向に 1, y軸方向に 3 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=-2x^2+8x-2$" },
    { q: "放物線 $y=x^2-8x$ を、x軸方向に -4, y軸方向に -5 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=x^2-21$" },
    { q: "放物線 $y=\\frac{1}{2}x^2+2x$ を、x軸方向に 2, y軸方向に 1 だけ平行移動して得られる放物線の方程式を求めよ。", a: "$y=\\frac{1}{2}x^2-1$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

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

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
