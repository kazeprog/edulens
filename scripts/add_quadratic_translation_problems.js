const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "2次関数の平行移動と軸・頂点";
const instruction = "次の2次関数のグラフは、2次関数 $y=ax^2$ のグラフをそれぞれどのように平行移動したものかを答えよ。また、それぞれのグラフにおける軸と頂点を求めよ。";

const data1 = [
    { q: "$y=3x^2+2$ ($y=3x^2$ を移動)", a: "$y$軸方向に2平行移動, 軸: $x=0$, 頂点: (0, 2)" },
    { q: "$y=x^2-4$ ($y=x^2$ を移動)", a: "$y$軸方向に-4平行移動, 軸: $x=0$, 頂点: (0, -4)" },
    { q: "$y=-2x^2+5$ ($y=-2x^2$ を移動)", a: "$y$軸方向に5平行移動, 軸: $x=0$, 頂点: (0, 5)" },
    { q: "$y=4x^2-1$ ($y=4x^2$ を移動)", a: "$y$軸方向に-1平行移動, 軸: $x=0$, 頂点: (0, -1)" },
    { q: "$y=-x^2-3$ ($y=-x^2$ を移動)", a: "$y$軸方向に-3平行移動, 軸: $x=0$, 頂点: (0, -3)" },
    { q: "$y=\\frac{1}{2}x^2+6$ ($y=\\frac{1}{2}x^2$ を移動)", a: "$y$軸方向に6平行移動, 軸: $x=0$, 頂点: (0, 6)" },
    { q: "$y=-5x^2+10$ ($y=-5x^2$ を移動)", a: "$y$軸方向に10平行移動, 軸: $x=0$, 頂点: (0, 10)" },
    { q: "$y=2x^2-7$ ($y=2x^2$ を移動)", a: "$y$軸方向に-7平行移動, 軸: $x=0$, 頂点: (0, -7)" },
    { q: "$y=-3x^2-2$ ($y=-3x^2$ を移動)", a: "$y$軸方向に-2平行移動, 軸: $x=0$, 頂点: (0, -2)" },
    { q: "$y=\\frac{2}{3}x^2+1$ ($y=\\frac{2}{3}x^2$ を移動)", a: "$y$軸方向に1平行移動, 軸: $x=0$, 頂点: (0, 1)" }
];

const data2 = [
    { q: "$y=2(x-3)^2$ ($y=2x^2$ を移動)", a: "$x$軸方向に3平行移動, 軸: $x=3$, 頂点: (3, 0)" },
    { q: "$y=(x+5)^2$ ($y=x^2$ を移動)", a: "$x$軸方向に-5平行移動, 軸: $x=-5$, 頂点: (-5, 0)" },
    { q: "$y=-(x-1)^2$ ($y=-x^2$ を移動)", a: "$x$軸方向に1平行移動, 軸: $x=1$, 頂点: (1, 0)" },
    { q: "$y=3(x+2)^2$ ($y=3x^2$ を移動)", a: "$x$軸方向に-2平行移動, 軸: $x=-2$, 頂点: (-2, 0)" },
    { q: "$y=-4(x-6)^2$ ($y=-4x^2$ を移動)", a: "$x$軸方向に6平行移動, 軸: $x=6$, 頂点: (6, 0)" },
    { q: "$y=\\frac{1}{3}(x+4)^2$ ($y=\\frac{1}{3}x^2$ を移動)", a: "$x$軸方向に-4平行移動, 軸: $x=-4$, 頂点: (-4, 0)" },
    { q: "$y=5(x-2)^2$ ($y=5x^2$ を移動)", a: "$x$軸方向に2平行移動, 軸: $x=2$, 頂点: (2, 0)" },
    { q: "$y=-2(x+1)^2$ ($y=-2x^2$ を移動)", a: "$x$軸方向に-1平行移動, 軸: $x=-1$, 頂点: (-1, 0)" },
    { q: "$y=\\frac{3}{4}(x-8)^2$ ($y=\\frac{3}{4}x^2$ を移動)", a: "$x$軸方向に8平行移動, 軸: $x=8$, 頂点: (8, 0)" },
    { q: "$y=-(x+3)^2$ ($y=-x^2$ を移動)", a: "$x$軸方向に-3平行移動, 軸: $x=-3$, 頂点: (-3, 0)" }
];

const data3 = [
    { q: "$y=2(x-1)^2+3$ ($y=2x^2$ を移動)", a: "$x$軸方向に1, $y$軸方向に3平行移動, 軸: $x=1$, 頂点: (1, 3)" },
    { q: "$y=3(x+2)^2-4$ ($y=3x^2$ を移動)", a: "$x$軸方向に-2, $y$軸方向に-4平行移動, 軸: $x=-2$, 頂点: (-2, -4)" },
    { q: "$y=-(x-5)^2+1$ ($y=-x^2$ を移動)", a: "$x$軸方向に5, $y$軸方向に1平行移動, 軸: $x=5$, 頂点: (5, 1)" },
    { q: "$y=4(x+3)^2+6$ ($y=4x^2$ を移動)", a: "$x$軸方向に-3, $y$軸方向に6平行移動, 軸: $x=-3$, 頂点: (-3, 6)" },
    { q: "$y=-2(x-4)^2-2$ ($y=-2x^2$ を移動)", a: "$x$軸方向に4, $y$軸方向に-2平行移動, 軸: $x=4$, 頂点: (4, -2)" },
    { q: "$y=\\frac{1}{2}(x+1)^2+5$ ($y=\\frac{1}{2}x^2$ を移動)", a: "$x$軸方向に-1, $y$軸方向に5平行移動, 軸: $x=-1$, 頂点: (-1, 5)" },
    { q: "$y=5(x-6)^2-3$ ($y=5x^2$ を移動)", a: "$x$軸方向に6, $y$軸方向に-3平行移動, 軸: $x=6$, 頂点: (6, -3)" },
    { q: "$y=-(x+4)^2-7$ ($y=-x^2$ を移動)", a: "$x$軸方向に-4, $y$軸方向に-7平行移動, 軸: $x=-4$, 頂点: (-4, -7)" },
    { q: "$y=2(x-2)^2-1$ ($y=2x^2$ を移動)", a: "$x$軸方向に2, $y$軸方向に-1平行移動, 軸: $x=2$, 頂点: (2, -1)" },
    { q: "$y=-3(x+5)^2+2$ ($y=-3x^2$ を移動)", a: "$x$軸方向に-5, $y$軸方向に2平行移動, 軸: $x=-5$, 頂点: (-5, 2)" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

const allData = [...data1, ...data2, ...data3];

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
