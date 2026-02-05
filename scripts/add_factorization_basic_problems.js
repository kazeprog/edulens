const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const manualProblems = [
    // 類題 1
    { q: "$(x+y)a-(x+y)b$", a: "$(x+y)(a-b)$" },
    { q: "$(m-n)c+(m-n)d$", a: "$(m-n)(c+d)$" },
    { q: "$x(a-b)-y(a-b)$", a: "$(a-b)(x-y)$" },
    { q: "$(p+q)r+(p+q)s$", a: "$(p+q)(r+s)$" },
    { q: "$a(x+2)-b(x+2)$", a: "$(x+2)(a-b)$" },
    // 類題 2
    { q: "$(x-y)^2+z(y-x)$", a: "$(x-y)(x-y-z)$" },
    { q: "$(a-b)^2-c(b-a)$", a: "$(a-b)(a-b+c)$" },
    { q: "$(m-n)^2+2(n-m)$", a: "$(m-n)(m-n-2)$" },
    { q: "$(s-t)^2-k(t-s)$", a: "$(s-t)(s-t+k)$" },
    { q: "$3(b-a)+(a-b)^2$", a: "$(a-b)(a-b-3)$" },
    // 類題 3
    { q: "$3x^3-12x^2+12x$", a: "$3x(x-2)^2$" },
    { q: "$5a^3+20a^2+20a$", a: "$5a(a+2)^2$" },
    { q: "$2x^2y-12xy+18y$", a: "$2y(x-3)^2$" },
    { q: "$ax^2-10ax+25a$", a: "$a(x-5)^2$" },
    { q: "$4x^3+24x^2+36x$", a: "$4x(x+3)^2$" },
    // 類題 4
    { q: "$x^2-2x-15$", a: "$(x-5)(x+3)$" },
    { q: "$x^2+4x-21$", a: "$(x+7)(x-3)$" },
    { q: "$x^2-x-12$", a: "$(x-4)(x+3)$" },
    { q: "$x^2+2x-48$", a: "$(x+8)(x-6)$" },
    { q: "$x^2-5x-24$", a: "$(x-8)(x+3)$" },
    // 類題 5
    { q: "$x^2+3xy-18y^2$", a: "$(x+6y)(x-3y)$" },
    { q: "$x^2-2xy-24y^2$", a: "$(x-6y)(x+4y)$" },
    { q: "$x^2+4xy-32y^2$", a: "$(x+8y)(x-4y)$" },
    { q: "$x^2-xy-20y^2$", a: "$(x-5y)(x+4y)$" },
    { q: "$x^2+6xy-27y^2$", a: "$(x+9y)(x-3y)$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "因数分解（基本）";
const instruction = "次の式を因数分解せよ。";

for (const p of manualProblems) {
    // Check duplicates
    const fullQuestion = `${instruction}\n${p.q}`;
    // Be careful with spaces in questions, sometimes they matter.
    // The previous scripts used strict equality.
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
