const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "やや複雑な因数分解(2)";
const unit2 = "因数分解（3次式）";
const defaultInstruction = "次の式を因数分解せよ。";

const data1 = [
    // 類題 1
    { q: "$(x^2+4x+2)(x+1)(x+3)-6$", a: "$x(x+4)(x^2+4x+5)$" },
    { q: "$(x^2-2x-5)(x+1)(x-3)+1$", a: "$(x^2-2x-4)^2$" },
    { q: "$(x^2+3x-1)(x+1)(x+2)-10$", a: "$(x^2+3x+4)(x^2+3x-3)$" },
    { q: "$(x^2-4x+2)(x-1)(x-3)-6$", a: "$x(x-4)(x^2-4x+5)$" },
    { q: "$(x^2+x+1)(x+3)(x-2)-8$", a: "$(x^2+x-7)(x^2+x+2)$" },
    { q: "$(x^2-3x+1)(x-1)(x-2)-6$", a: "$(x^2-3x+4)(x^2-3x-1)$" },
    { q: "$(x^2+6x+10)(x+2)(x+4)-24$", a: "$(x^2+6x+14)(x^2+6x+4)$" },
    { q: "$(x^2-5x+2)(x-2)(x-3)-12$", a: "$x(x-5)(x^2-5x+8)$" },
    { q: "$(x^2+2x-1)(x-2)(x+4)+12$", a: "$(x+5)(x-3)(x^2+2x-4)$" },
    { q: "$(x^2-x+3)(x+1)(x-2)+6$", a: "$x(x-1)(x^2-x+1)$" },
    // 類題 2
    { q: "$(x+1)(x+2)(x+3)(x+4)-24$", a: "$x(x+5)(x^2+5x+10)$" },
    { q: "$(x-1)(x-2)(x-3)(x-4)+1$", a: "$(x^2-5x+5)^2$" },
    { q: "$(x+1)(x+3)(x+5)(x+7)+15$", a: "$(x+2)(x+6)(x^2+8x+10)$" },
    { q: "$(x-1)(x+2)(x-3)(x+4)-144$", a: "$(x+5)(x-4)(x^2+x+6)$" },
    { q: "$(x+2)(x+4)(x+6)(x+8)+16$", a: "$(x^2+10x+20)^2$" },
    { q: "$(x-2)(x-4)(x+3)(x+5)-36$", a: "$(x^2+x-4)(x^2+x-22)$" },
    { q: "$(x+1)(x+2)(x-3)(x-4)-24$", a: "$x(x-2)(x^2-2x-11)$" },
    { q: "$(x-1)(x+3)(x+4)(x+8)+36$", a: "$(x+2)(x+5)(x^2+7x-6)$" },
    { q: "$(x-2)(x-3)(x+4)(x+5)-60$", a: "$(x+3)(x-1)(x^2+2x-20)$" },
    { q: "$x(x+1)(x+2)(x+3)-24$", a: "$(x+4)(x-1)(x^2+3x+6)$" }
];

const data2 = [
    // 類題 1
    { q: "$x^3+y^3=(x+y)^3-3xy(x+y)$ であることを用いて, $x^3+y^3+z^3-3xyz$ を因数分解せよ。", a: "$(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$" },
    { q: "$p^3+q^3=(p+q)^3-3pq(p+q)$ であることを用いて, $p^3+q^3+r^3-3pqr$ を因数分解せよ。", a: "$(p+q+r)(p^2+q^2+r^2-pq-qr-rp)$" },
    { q: "$m^3+n^3=(m+n)^3-3mn(m+n)$ であることを用いて, $m^3+n^3+l^3-3mnl$ を因数分解せよ。", a: "$(m+n+l)(m^2+n^2+l^2-mn-nl-lm)$" },
    { q: "$a^3+b^3=(a+b)^3-3ab(a+b)$ であることを用いて, $a^3+b^3+1-3ab$ を因数分解せよ。", a: "$(a+b+1)(a^2+b^2+1-ab-a-b)$" },
    { q: "$x^3+y^3=(x+y)^3-3xy(x+y)$ であることを用いて, $x^3+y^3+8-6xy$ を因数分解せよ。", a: "$(x+y+2)(x^2+y^2+4-xy-2x-2y)$" },
    { q: "$a^3+b^3=(a+b)^3-3ab(a+b)$ であることを用いて, $a^3+b^3-c^3+3abc$ を因数分解せよ。", a: "$(a+b-c)(a^2+b^2+c^2-ab+bc+ca)$" },
    { q: "$u^3+v^3=(u+v)^3-3uv(u+v)$ であることを用いて, $u^3+v^3+w^3-3uvw$ を因数分解せよ。", a: "$(u+v+w)(u^2+v^2+w^2-uv-vw-wu)$" },
    { q: "$X^3+Y^3=(X+Y)^3-3XY(X+Y)$ であることを用いて, $X^3+Y^3+Z^3-3XYZ$ を因数分解せよ。", a: "$(X+Y+Z)(X^2+Y^2+Z^2-XY-YZ-ZX)$" },
    { q: "$a^3+8b^3=(a+2b)^3-6ab(a+2b)$ であることを用いて, $a^3+8b^3+c^3-6abc$ を因数分解せよ。", a: "$(a+2b+c)(a^2+4b^2+c^2-2ab-2bc-ca)$" },
    { q: "$x^3+y^3=(x+y)^3-3xy(x+y)$ であることを用いて, $x^3+y^3+27-9xy$ を因数分解せよ。", a: "$(x+y+3)(x^2+y^2+9-xy-3x-3y)$" },
    // 類題 2
    { q: "$a^3+b^3+1-3ab$ を因数分解せよ。", a: "$(a+b+1)(a^2+b^2+1-ab-a-b)$" },
    { q: "$x^3+y^3+8-6xy$ を因数分解せよ。", a: "$(x+y+2)(x^2+y^2+4-xy-2x-2y)$" },
    { q: "$x^3+y^3-z^3+3xyz$ を因数分解せよ。", a: "$(x+y-z)(x^2+y^2+z^2-xy+yz+zx)$" },
    { q: "$a^3+b^3+c^3-3abc$ を因数分解せよ。", a: "$(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$" },
    { q: "$x^3-y^3+z^3+3xyz$ を因数分解せよ。", a: "$(x-y+z)(x^2+y^2+z^2+xy+yz-zx)$" },
    { q: "$8x^3+y^3+z^3-6xyz$ を因数分解せよ。", a: "$(2x+y+z)(4x^2+y^2+z^2-2xy-yz-2zx)$" },
    { q: "$x^3+y^3+27-9xy$ を因数分解せよ。", a: "$(x+y+3)(x^2+y^2+9-xy-3x-3y)$" },
    { q: "$a^3+b^3-1+3ab$ を因数分解せよ。", a: "$(a+b-1)(a^2+b^2+1-ab+a+b)$" },
    { q: "$x^3+8y^3+27z^3-18xyz$ を因数分解せよ。", a: "$(x+2y+3z)(x^2+4y^2+9z^2-2xy-6yz-3zx)$" },
    { q: "$a^3-b^3-c^3-3abc$ を因数分解せよ。", a: "$(a-b-c)(a^2+b^2+c^2+ab-bc+ca)$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";

function addProblems(data, unitName, useInstruction) {
    for (const p of data) {
        let fullQuestion = p.q;
        if (useInstruction) {
            fullQuestion = `${defaultInstruction}\n${p.q}`;
        }

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

addProblems(data1, unit1, true);
addProblems(data2, unit2, false);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
