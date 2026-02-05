const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$3x^2+5x+2$", a: "$(3x+2)(x+1)$" },
    { q: "$2x^2-5x+2$", a: "$(2x-1)(x-2)$" },
    { q: "$5x^2-13x-6$", a: "$(5x+2)(x-3)$" },
    { q: "$4x^2+8x+3$", a: "$(2x+1)(2x+3)$" },
    { q: "$3x^2-10x+8$", a: "$(3x-4)(x-2)$" },
    // 類題 2
    { q: "$2x^2+5xy+2y^2$", a: "$(2x+y)(x+2y)$" },
    { q: "$3x^2-5xy-2y^2$", a: "$(3x+y)(x-2y)$" },
    { q: "$4x^2+7xy-2y^2$", a: "$(4x-y)(x+2y)$" },
    { q: "$6x^2-7xy-3y^2$", a: "$(2x-3y)(3x+y)$" },
    { q: "$2x^2-xy-6y^2$", a: "$(2x+3y)(x-2y)$" },
    // 類題 3
    { q: "$2ax^2+(2-a^2)x-a$", a: "$(2x-a)(ax+1)$" },
    { q: "$abx^2+(a^2+b^2)x+ab$", a: "$(ax+b)(bx+a)$" },
    { q: "$ax^2+(a^2-1)x-a$", a: "$(ax-1)(x+a)$" },
    { q: "$3ax^2+(1-3a^2)x-a$", a: "$(3ax+1)(x-a)$" },
    { q: "$2ax^2+(6-a^2)x-3a$", a: "$(2x-a)(ax+3)$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "因数分解（たすき掛け）";
const instruction = "次の式を因数分解せよ。";

for (const p of manualProblems) {
    // Check duplicates
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
    } else {
        console.log(`Skipping duplicate: ${p.q}`);
    }
}

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
