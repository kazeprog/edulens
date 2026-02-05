const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$x^3+y^3$", a: "$(x+y)(x^2-xy+y^2)$" },
    { q: "$a^3+8$", a: "$(a+2)(a^2-2a+4)$" },
    { q: "$x^3+27$", a: "$(x+3)(x^2-3x+9)$" },
    { q: "$27x^3+1$", a: "$(3x+1)(9x^2-3x+1)$" },
    { q: "$x^3+64y^3$", a: "$(x+4y)(x^2-4xy+16y^2)$" },
    { q: "$8a^3+125b^3$", a: "$(2a+5b)(4a^2-10ab+25b^2)$" },
    { q: "$x^3+216$", a: "$(x+6)(x^2-6x+36)$" },
    { q: "$125x^3+8y^3$", a: "$(5x+2y)(25x^2-10xy+4y^2)$" },
    { q: "$27a^3+64b^3$", a: "$(3a+4b)(9a^2-12ab+16b^2)$" },
    { q: "$1000x^3+1$", a: "$(10x+1)(100x^2-10x+1)$" },
    // 類題 2
    { q: "$x^3-y^3$", a: "$(x-y)(x^2+xy+y^2)$" },
    { q: "$a^3-1$", a: "$(a-1)(a^2+a+1)$" },
    { q: "$x^3-27$", a: "$(x-3)(x^2+3x+9)$" },
    { q: "$8x^3-1$", a: "$(2x-1)(4x^2+2x+1)$" },
    { q: "$x^3-125y^3$", a: "$(x-5y)(x^2+5xy+25y^2)$" },
    { q: "$64a^3-27b^3$", a: "$(4a-3b)(16a^2+12ab+9b^2)$" },
    { q: "$x^3-216$", a: "$(x-6)(x^2+6x+36)$" },
    { q: "$125x^3-64$", a: "$(5x-4)(25x^2+20x+16)$" },
    { q: "$216a^3-125$", a: "$(6a-5)(36a^2+30a+25)$" },
    { q: "$8x^3-343y^3$", a: "$(2x-7y)(4x^2+14xy+49y^2)$" },
    // 類題 3
    { q: "$2x^3+2y^3$", a: "$2(x+y)(x^2-xy+y^2)$" },
    { q: "$3x^3-81$", a: "$3(x-3)(x^2+3x+9)$" },
    { q: "$16a^3+2$", a: "$2(2a+1)(4a^2-2a+1)$" },
    { q: "$24x^3+375$", a: "$3(2x+5)(4x^2-10x+25)$" },
    { q: "$250x^3-128$", a: "$2(5x-4)(25x^2+20x+16)$" },
    { q: "$40x^3+5$", a: "$5(2x+1)(4x^2-2x+1)$" },
    { q: "$81x^3-3$", a: "$3(3x-1)(9x^2+3x+1)$" },
    { q: "$16x^3-54y^3$", a: "$2(2x-3y)(4x^2+6xy+9y^2)$" },
    { q: "$128x^3+2y^3$", a: "$2(4x+y)(16x^2-4xy+y^2)$" },
    { q: "$3x^3+192$", a: "$3(x+4)(x^2-4x+16)$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "因数分解（3次式の公式）";
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
