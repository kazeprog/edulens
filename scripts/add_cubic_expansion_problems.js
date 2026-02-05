const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$(x+2)^3$", a: "$x^3+6x^2+12x+8$" },
    { q: "$(3a+1)^3$", a: "$27a^3+27a^2+9a+1$" },
    { q: "$(2x+5)^3$", a: "$8x^3+60x^2+150x+125$" },
    { q: "$(4y+3)^3$", a: "$64y^3+144y^2+108y+27$" },
    { q: "$(5x+2)^3$", a: "$125x^3+150x^2+60x+8$" },
    // 類題 2
    { q: "$(x-3)^3$", a: "$x^3-9x^2+27x-27$" },
    { q: "$(2a-b)^3$", a: "$8a^3-12a^2b+6ab^2-b^3$" },
    { q: "$(4x-3y)^3$", a: "$64x^3-144x^2y+108xy^2-27y^3$" },
    { q: "$(3a-2b)^3$", a: "$27a^3-54a^2b+36ab^2-8b^3$" },
    { q: "$(5x-1)^3$", a: "$125x^3-75x^2+15x-1$" },
    // 類題 3
    { q: "$(x+1)(x^2-x+1)$", a: "$x^3+1$" },
    { q: "$(a+4)(a^2-4a+16)$", a: "$a^3+64$" },
    { q: "$(y+5)(y^2-5y+25)$", a: "$y^3+125$" },
    { q: "$(2x+1)(4x^2-2x+1)$", a: "$8x^3+1$" },
    { q: "$(3a+2)(9a^2-6a+4)$", a: "$27a^3+8$" },
    // 類題 4
    { q: "$(x-4)(x^2+4x+16)$", a: "$x^3-64$" },
    { q: "$(a-5)(a^2+5a+25)$", a: "$a^3-125$" },
    { q: "$(2y-1)(4y^2+2y+1)$", a: "$8y^3-1$" },
    { q: "$(3x-4)(9x^2+12x+16)$", a: "$27x^3-64$" },
    { q: "$(4a-3)(16a^2+12a+9)$", a: "$64a^3-27$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "3次式の展開";
const instruction = "次の式を展開せよ。";

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
