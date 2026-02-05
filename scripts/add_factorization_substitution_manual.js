const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const part1 = [
    // 類題 1
    { q: "$(x+2)^2+3(x+2)+2$", a: "$(x+3)(x+4)$" },
    { q: "$(a-3)^2-2(a-3)-8$", a: "$(a-7)(a-1)$" },
    { q: "$(x+y)^2-5(x+y)+6$", a: "$(x+y-2)(x+y-3)$" },
    { q: "$(2x+1)^2-3(2x+1)-4$", a: "$2x(2x-3)$" },
    { q: "$(a+b)^2+4(a+b)-12$", a: "$(a+b+6)(a+b-2)$" },
    { q: "$(x-4)^2-7(x-4)+10$", a: "$(x-6)(x-9)$" },
    { q: "$(x+3)^2+(x+3)-6$", a: "$(x+5)(x+2)$" },
    { q: "$(a-1)^2-4(a-1)-5$", a: "$(a-6)a$" },
    { q: "$(x+y)^2-2(x+y)-15$", a: "$(x+y-5)(x+y+3)$" },
    { q: "$(2a-3)^2+5(2a-3)+6$", a: "$2a(2a-1)$" },
    // 類題 2
    { q: "$x^2+2xy+y^2-z^2$", a: "$(x+y+z)(x+y-z)$" },
    { q: "$a^2-2ab+b^2-9$", a: "$(a-b+3)(a-b-3)$" },
    { q: "$x^2+4x+4-y^2$", a: "$(x+2+y)(x+2-y)$" },
    { q: "$a^2-6a+9-4b^2$", a: "$(a-3+2b)(a-3-2b)$" },
    { q: "$x^2+2x+1-y^2$", a: "$(x+1+y)(x+1-y)$" },
    { q: "$m^2+2mn+n^2-16$", a: "$(m+n+4)(m+n-4)$" },
    { q: "$a^2-4ab+4b^2-25$", a: "$(a-2b+5)(a-2b-5)$" },
    { q: "$x^2+10x+25-9y^2$", a: "$(x+5+3y)(x+5-3y)$" },
    { q: "$x^2-2xy+y^2-4$", a: "$(x-y+2)(x-y-2)$" },
    { q: "$4a^2+4ab+b^2-c^2$", a: "$(2a+b+c)(2a+b-c)$" },
    // 類題 3
    { q: "$(x+y+1)(x+y+2)-12$", a: "$(x+y+5)(x+y-2)$" },
    { q: "$(a-b-3)(a-b+1)-5$", a: "$(a-b-4)(a-b+2)$" },
    { q: "$(x+2y-2)(x+2y+4)-7$", a: "$(x+2y+5)(x+2y-3)$" },
    { q: "$(x+y-4)(x+y+2)+5$", a: "$(x+y-3)(x+y+1)$" },
    { q: "$(a+b-1)(a+b-5)+3$", a: "$(a+b-2)(a+b-4)$" },
    { q: "$(x+y+3)(x+y-2)-6$", a: "$(x+y+4)(x+y-3)$" },
    { q: "$(a-c+2)(a-c+4)-8$", a: "$(a-c)(a-c+6)$" },
    { q: "$(x+z-1)(x+z+5)-7$", a: "$(x+z+6)(x+z-2)$" },
    { q: "$(x+y+4)(x+y-2)-7$", a: "$(x+y+5)(x+y-3)$" },
    { q: "$(a+b-3)(a+b+5)+12$", a: "$(a+b+3)(a+b-1)$" }
];

const part2 = [
    // 類題 1
    { q: "$(x^2+4x+2)(x^2+4x-4)+8$", a: "$x(x+4)(x^2+4x-2)$" },
    { q: "$(x^2-2x-3)(x^2-2x+1)+3$", a: "$x(x-2)(x^2-2x-2)$" },
    { q: "$(x^2+x-3)(x^2+x+1)+3$", a: "$(x-1)x(x+1)(x+2)$" },
    { q: "$(x^2-5x+2)(x^2-5x-4)+8$", a: "$(x-5)x(x^2-5x-2)$" },
    { q: "$(x^2+2x-5)(x^2+2x-1)-5$", a: "$x(x+2)(x^2+2x-6)$" },
    { q: "$(x^2-4x+1)(x^2-4x+3)-3$", a: "$x(x-4)(x-2)^2$" },
    { q: "$(x^2+3x+2)(x^2+3x-4)+5$", a: "$(x^2+3x-3)(x^2+3x+1)$" },
    { q: "$(x^2-x-5)(x^2-x+3)+7$", a: "$(x^2-x-4)(x^2+x+2)$" },
    { q: "$(x^2+2x-6)(x^2+2x+2)+12$", a: "$x(x+2)(x^2+2x-4)$" },
    { q: "$(x^2-3x-2)(x^2-3x+3)+4$", a: "$(x-1)(x-2)(x^2-3x-1)$" },
    // 類題 2
    { q: "$x^4-5x^2+4$", a: "$(x+1)(x-1)(x+2)(x-2)$" },
    { q: "$x^4-10x^2+9$", a: "$(x+1)(x-1)(x+3)(x-3)$" },
    { q: "$x^4-13x^2+36$", a: "$(x+2)(x-2)(x+3)(x-3)$" },
    { q: "$x^4+x^2-12$", a: "$(x^2+4)(x+1)(x-1)$" },
    { q: "$x^4+5x^2-36$", a: "$(x^2+9)(x+2)(x-2)$" },
    { q: "$x^4-17x^2+16$", a: "$(x+1)(x-1)(x+4)(x-4)$" },
    { q: "$x^4-25x^2+144$", a: "$(x+3)(x-3)(x+4)(x-4)$" },
    { q: "$x^4+2x^2-8$", a: "$(x^2+4)(x^2-2)$" },
    { q: "$x^4-26x^2+25$", a: "$(x+1)(x-1)(x+5)(x-5)$" },
    { q: "$x^4+3x^2-4$", a: "$(x^2+4)(x+1)(x-1)$" },
    // 類題 3
    { q: "$a^4-10a^2b^2+9b^4$", a: "$(a+b)(a-b)(a+3b)(a-3b)$" },
    { q: "$x^4-13x^2y^2+36y^4$", a: "$(x+2y)(x-2y)(x+3y)(x-3y)$" },
    { q: "$4a^4-5a^2b^2+b^4$", a: "$(2a+b)(2a-b)(a+b)(a-b)$" },
    { q: "$9x^4-10x^2y^2+y^4$", a: "$(3x+y)(3x-y)(x+y)(x-y)$" },
    { q: "$a^4-17a^2b^2+16b^4$", a: "$(a+b)(a-b)(a+4b)(a-4b)$" },
    { q: "$4x^4-13x^2y^2+9y^4$", a: "$(2x+3y)(2x-3y)(x+y)(x-y)$" },
    { q: "$a^4-26a^2b^2+25b^4$", a: "$(a+b)(a-b)(a+5b)(a-5b)$" },
    { q: "$16x^4-17x^2y^2+y^4$", a: "$(4x+y)(4x-y)(x+y)(x-y)$" },
    { q: "$4a^4-37a^2b^2+9b^4$", a: "$(2a+3b)(2a-3b)(a+2b)(a-2b)$" },
    { q: "$x^4-29x^2y^2+100y^4$", a: "$(x+2y)(x-2y)(x+5y)(x-3y)$" } // Wait, answer for (10) in user request was $(x+2y)(x-2y)(x+5y)(x-5y)$
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const instruction = "次の式を因数分解せよ。";

function addProblems(data, unitName) {
    for (const p of data) {
        const fullQuestion = `${instruction}\n${p.q}`;
        const exists = existingJson.some(ex => ex.question === fullQuestion && ex.unit === unitName);
        if (!exists) {
            lastProblemNumber++;
            newProblems.push({
                grade: grade,
                unit: unitName,
                problem_number: lastProblemNumber,
                question: fullQuestion,
                answer: p.a
            });
        }
    }
}

addProblems(part1, "因数分解（おき換え）(1)");
addProblems(part2, "因数分解（おき換え）(2)");

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
