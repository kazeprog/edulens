const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "グラフの平行移動";

const data = [
    { q: "放物線 $y=x^2+4x+5$ …… ① は、放物線 $y=x^2-2x+3$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に-3, $y$軸方向に-1" },
    { q: "放物線 $y=x^2-2x$ …… ① は、放物線 $y=x^2+6x+8$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に4, $y$軸方向に0" },
    { q: "放物線 $y=-x^2-2x+2$ …… ① は、放物線 $y=-x^2+4x-1$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に-3, $y$軸方向に0" },
    { q: "放物線 $y=2x^2+4x+1$ …… ① は、放物線 $y=2x^2-8x+5$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に-3, $y$軸方向に2" },
    { q: "放物線 $y=3x^2-12x+10$ …… ① は、放物線 $y=3x^2+6x+1$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に3, $y$軸方向に0" },
    { q: "放物線 $y=-2x^2-8x-5$ …… ① は、放物線 $y=-2x^2+4x+3$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に-3, $y$軸方向に-2" },
    { q: "放物線 $y=\\frac{1}{2}x^2+2x+3$ …… ① は、放物線 $y=\\frac{1}{2}x^2-2x+1$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に-4, $y$軸方向に2" },
    { q: "放物線 $y=x^2+2x-1$ …… ① は、放物線 $y=x^2-4x+7$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に-3, $y$軸方向に-5" },
    { q: "放物線 $y=-3x^2+12x-15$ …… ① は、放物線 $y=-3x^2-6x-1$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に3, $y$軸方向に-5" },
    { q: "放物線 $y=2x^2-4x+1$ …… ① は、放物線 $y=2x^2+8x+3$ …… ② をどのように平行移動したものか。", a: "$x$軸方向に3, $y$軸方向に4" }
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
