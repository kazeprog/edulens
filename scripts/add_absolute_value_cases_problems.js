const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "絶対値を含む方程式（場合分け）";
const unit2 = "絶対値を含む不等式（場合分け）";

const data1_1 = [
    { q: "次の方程式を解け。\n$|x+3|=2x$", a: "$x=3$" },
    { q: "次の方程式を解け。\n$|2x-4|=x$", a: "$x=\\frac{4}{3}, 4$" },
    { q: "次の方程式を解け。\n$|x+6|=3x$", a: "$x=3$" },
    { q: "次の方程式を解け。\n$|3x-6|=x$", a: "$x=\\frac{3}{2}, 3$" },
    { q: "次の方程式を解け。\n$|2x+8|=4x$", a: "$x=4$" },
    { q: "次の方程式を解け。\n$|x-4|=3x$", a: "$x=1$" },
    { q: "次の方程式を解け。\n$|4x+12|=2x$", a: "解なし" },
    { q: "次の方程式を解け。\n$|3x+9|=6x$", a: "$x=3$" },
    { q: "次の方程式を解け。\n$|x-2|=5x$", a: "$x=\\frac{1}{3}$" },
    { q: "次の方程式を解け。\n$|2x+6|=x$", a: "解なし" }
];

const data1_2 = [
    { q: "次の方程式を解け。\n$|x+1|+|x-1|=x+4$", a: "$x=-\\frac{4}{3}, 4$" },
    { q: "次の方程式を解け。\n$|x+2|+|x-2|=x+5$", a: "$x=-1, 5$" },
    { q: "次の方程式を解け。\n$|x+3|+|x-1|=x+6$", a: "$x=-2, 4$" },
    { q: "次の方程式を解け。\n$|x+2|+|x-1|=2x+4$", a: "$x=-\\frac{1}{2}$" },
    { q: "次の方程式を解け。\n$|x+4|+|x-4|=x+10$", a: "$x=-2, 10$" },
    { q: "次の方程式を解け。\n$|x+1|+|x-3|=2x+2$", a: "$x=1$" },
    { q: "次の方程式を解け。\n$|x+5|+|x-1|=x+8$", a: "$x=-2, 4$" },
    { q: "次の方程式を解け。\n$|x+2|+|x-3|=x+7$", a: "$x=-2, 8$" },
    { q: "次の方程式を解け。\n$|x+1|+|x-2|=3x+1$", a: "$x=\\frac{2}{3}$" },
    { q: "次の方程式を解け。\n$|x+3|+|x-3|=x+9$", a: "$x=-3, 9$" }
];

const data2_1 = [
    { q: "次の不等式を解け。\n$|x-5|<2x+1$", a: "$x>\\frac{4}{3}$" },
    { q: "次の不等式を解け。\n$|2x-6|<x+3$", a: "$1<x<9$" },
    { q: "次の不等式を解け。\n$|3x-3|<x+5$", a: "$-\\frac{1}{2}<x<4$" },
    { q: "次の不等式を解け。\n$|x+4|<3x-2$", a: "$x>3$" },
    { q: "次の不等式を解け。\n$|2x+8|<x+10$", a: "$-6<x<2$" },
    { q: "次の不等式を解け。\n$|4x-8|<2x+4$", a: "$\\frac{2}{3}<x<6$" },
    { q: "次の不等式を解け。\n$|x-1|<2x+4$", a: "$x>-1$" },
    { q: "次の不等式を解け。\n$|2x-4|<x+5$", a: "$-\\frac{1}{3}<x<9$" },
    { q: "次の不等式を解け。\n$|3x-6|<x+2$", a: "$1<x<4$" },
    { q: "次の不等式を解け。\n$|x+2|<2x+1$", a: "$x>1$" }
];

const data2_2 = [
    { q: "次の不等式を解け。\n$|x-1|+|x+1| \\leqq 4$", a: "$-2 \\leqq x \\leqq 2$" },
    { q: "次の不等式を解け。\n$|x-2|+2|x+1| \\leqq 9$", a: "$-3 \\leqq x \\leqq 3$" },
    { q: "次の不等式を解け。\n$2|x-1|+|x+2| \\leqq 9$", a: "$-3 \\leqq x \\leqq 3$" },
    { q: "次の不等式を解け。\n$|x-3|+|x+2| \\leqq 7$", a: "$-3 \\leqq x \\leqq 4$" },
    { q: "次の不等式を解け。\n$|x+3|+2|x-1| \\leqq 10$", a: "$-\\frac{11}{3} \\leqq x \\leqq 3$" },
    { q: "次の不等式を解け。\n$2|x+3|+|x-1| \\leqq 11$", a: "$-\\frac{16}{3} \\leqq x \\leqq 2$" },
    { q: "次の不等式を解け。\n$|x-4|+|x+2| \\leqq 8$", a: "$-3 \\leqq x \\leqq 5$" },
    { q: "次の不等式を解け。\n$|x-2|+3|x+1| \\leqq 13$", a: "$-\\frac{7}{2} \\leqq x \\leqq 3$" },
    { q: "次の不等式を解け。\n$2|x-2|+|x+3| \\leqq 11$", a: "$-\\frac{10}{3} \\leqq x \\leqq 4$" },
    { q: "次の不等式を解け。\n$|x+5|+|x-1| \\leqq 10$", a: "$-7 \\leqq x \\leqq 3$" }
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
addProbs(data2_1, unit2);
addProbs(data2_2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
