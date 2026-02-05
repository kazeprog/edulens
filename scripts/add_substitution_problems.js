const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$(a+b+c)^2$", a: "$a^2+b^2+c^2+2ab+2bc+2ca$" },
    { q: "$(x-y+z)^2$", a: "$x^2+y^2+z^2-2xy-2yz+2zx$" },
    { q: "$(a+2b-c)^2$", a: "$a^2+4b^2+c^2+4ab-4bc-2ca$" },
    { q: "$(2x-y-3z)^2$", a: "$4x^2+y^2+9z^2-4xy+6yz-12zx$" },
    { q: "$(a-b+4)^2$", a: "$a^2-2ab+b^2+8a-8b+16$" },
    // 類題 2
    { q: "$(x^2+2x+3)(x^2+2x-1)$", a: "$x^4+4x^3+6x^2+4x-3$" },
    { q: "$(a^2-3a+2)(a^2-3a-4)$", a: "$a^4-6a^3+7a^2+6a-8$" },
    { q: "$(x^2+x-5)(x^2+x+5)$", a: "$x^4+2x^3+x^2-25$" },
    { q: "$(2x^2-x+1)(2x^2-x-3)$", a: "$4x^4-4x^3-3x^2+2x-3$" },
    { q: "$(x^2-4x+1)(x^2-4x-1)$", a: "$x^4-8x^3+16x^2-1$" },
    // 類題 3
    { q: "$(a+b+c)(a-b-c)$", a: "$a^2-b^2-2bc-c^2$" },
    { q: "$(x-y+z)(x+y-z)$", a: "$x^2-y^2+2yz-z^2$" },
    { q: "$(2a-b+3c)(2a+b-3c)$", a: "$4a^2-b^2+6bc-9c^2$" },
    { q: "$(x+3y-2)(x-3y+2)$", a: "$x^2-9y^2+12y-4$" },
    { q: "$(3x-2y-z)(3x+2y+z)$", a: "$9x^2-4y^2-4yz-z^2$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "式の展開（置き換え）"; // Unit identified from user request header
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
