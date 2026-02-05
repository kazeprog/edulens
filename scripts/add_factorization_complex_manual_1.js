const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "やや複雑な因数分解(1)";
const instruction = "次の式を因数分解せよ。";

const manualProblems = [
    // 類題 1
    { q: "$x^4+x^2+1$", a: "($x^2+x+1$)($x^2-x+1$)" },
    { q: "$a^4+a^2+1$", a: "($a^2+a+1$)($a^2-a+1$)" },
    { q: "$x^4+3x^2+4$", a: "($x^2+x+2$)($x^2-x+2$)" },
    { q: "$x^4+4x^2+16$", a: "($x^2+2x+4$)($x^2-2x+4$)" },
    { q: "$a^4+5a^2+9$", a: "($a^2+a+3$)($a^2-a+3$)" },
    { q: "$x^4-6x^2+1$", a: "($x^2+2x-1$)($x^2-2x-1$)" },
    { q: "$x^4-3x^2+1$", a: "($x^2+x-1$)($x^2-x-1$)" },
    { q: "$x^4+x^2y^2+y^4$", a: "($x^2+xy+y^2$)($x^2-xy+y^2$)" },
    { q: "$16x^4+4x^2+1$", a: "($4x^2+2x+1$)($4x^2-2x+1$)" },
    { q: "$x^4-7x^2+9$", a: "($x^2+x-3$)($x^2-x-3$)" },
    // 類題 2
    { q: "$a^6-b^6$", a: "(a+b)(a-b)($a^2+ab+b^2$)($a^2-ab+b^2$)" },
    { q: "$x^6-1$", a: "(x+1)(x-1)($x^2+x+1$)($x^2-x+1$)" },
    { q: "$x^6-64$", a: "(x+2)(x-2)($x^2+2x+4$)($x^2-2x+4$)" },
    { q: "$a^6-729$", a: "(a+3)(a-3)($a^2+3a+9$)($a^2-3a+9$)" },
    { q: "$64x^6-y^6$", a: "(2x+y)(2x-y)($4x^2+2xy+y^2$)($4x^2-2xy+y^2$)" },
    { q: "$x^6+y^6$", a: "($x^2+y^2$)($x^4-x^2y^2+y^4$)" },
    { q: "$x^6+1$", a: "($x^2+1$)($x^4-x^2+1$)" },
    { q: "$a^6b^6-1$", a: "(ab+1)(ab-1)($a^2b^2+ab+1$)($a^2b^2-ab+1$)" },
    { q: "$1-x^6$", a: "(1+x)(1-x)($1+x+x^2$)($1-x+x^2$)" },
    { q: "$a^6+64$", a: "($a^2+4$)($a^4-4a^2+16$)" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";

for (const p of manualProblems) {
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
