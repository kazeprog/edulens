const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$(x+y)^2(x-y)^2$", a: "$x^4-2x^2y^2+y^4$" },
    { q: "$(3x+y)^2(3x-y)^2$", a: "$81x^4-18x^2y^2+y^4$" },
    { q: "$(a+3b)^2(a-3b)^2$", a: "$a^4-18a^2b^2+81b^4$" },
    { q: "$(2a+5b)^2(2a-5b)^2$", a: "$16a^4-200a^2b^2+625b^4$" },
    { q: "$(4x+3y)^2(4x-3y)^2$", a: "$256x^4-288x^2y^2+81y^4$" },
    // 類題 2
    { q: "$(a^2+b^2)(a+b)(a-b)$", a: "$a^4-b^4$" },
    { q: "$(x^2+4y^2)(x+2y)(x-2y)$", a: "$x^4-16y^4$" },
    { q: "$(9a^2+b^2)(3a+b)(3a-b)$", a: "$81a^4-b^4$" },
    { q: "$(x^2+9)(x+3)(x-3)$", a: "$x^4-81$" },
    { q: "$(16x^2+y^2)(4x+y)(4x-y)$", a: "$256x^4-y^4$" },
    // 類題 3
    { q: "$(a+b)^2(a^2-ab+b^2)^2$", a: "$a^6+2a^3b^3+b^6$" },
    { q: "$(x-2y)^2(x^2+2xy+4y^2)^2$", a: "$x^6-16x^3y^3+64y^6$" },
    { q: "$(2a+b)^2(4a^2-2ab+b^2)^2$", a: "$64a^6+16a^3b^3+b^6$" },
    { q: "$(x-1)^2(x^2+x+1)^2$", a: "$x^6-2x^3+1$" },
    { q: "$(3a-b)^2(9a^2+3ab+b^2)^2$", a: "$729a^6-54a^3b^3+b^6$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "式の展開（組み合わせの工夫）";
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
