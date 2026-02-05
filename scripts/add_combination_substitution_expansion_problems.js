const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$(x^2-5x+3)(x-1)(x-4)$", a: "$x^4-10x^3+32x^2-35x+12$" },
    { q: "$(x^2+4x-2)(x+1)(x+3)$", a: "$x^4+8x^3+13x^2-12x-6$" },
    { q: "$(x^2-x-10)(x+2)(x-3)$", a: "$x^4-2x^3-15x^2+16x+60$" },
    { q: "$(x^2+6x+5)(x+2)(x+4)$", a: "$x^4+12x^3+51x^2+78x+40$" },
    { q: "$(x^2-3x-5)(x-1)(x-2)$", a: "$x^4-6x^3+8x^2+9x-10$" },
    // 類題 2
    { q: "$(x-1)(x^2-x+1)(x^2+x+1)^2$", a: "$x^7+x^5-x^4+x^3-x^2-1$" },
    { q: "$(x+2)(x^2+2x+4)(x^2-2x+4)^2$", a: "$x^7+8x^4+4x^5+32x^2+16x^3+128$" },
    { q: "$(a-1)(a^2-a+1)(a^2+a+1)^2$", a: "$a^7+a^5-a^4+a^3-a^2-1$" },
    { q: "$(x+1)^2(x^2-x+1)^2(x^2+1)$", a: "$x^8+x^6+x^2+1$" },
    { q: "$(x-1)^2(x^2+x+1)^2(x^4+x^2+1)$", a: "$x^{10}-x^7+x^6-x^4+x^3-1$" },
    // 類題 3
    { q: "$(x-1)^2(x+1)^2(x^2+1)^2$", a: "$x^8-2x^4+1$" },
    { q: "$(2x-y)^3(2x+y)^3(4x^2+y^2)^3$", a: "$4096x^{12}-48x^8y^4+3x^4y^8-y^{12}$" },
    { q: "$(a-2)^4(a+2)^4(a^2+4)^4$", a: "$a^{16}-32a^{12}+384a^8-2048a^4+4096$" },
    { q: "$(x-3)^2(x+3)^2(x^2+9)^2$", a: "$x^8-162x^4+6561$" },
    { q: "$(m-n)^3(m+n)^3(m^2+n^2)^3$", a: "$m^{12}-3m^8n^4+3m^4n^8-n^{12}$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "式の展開（組み合わせ・置き換え）";
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
