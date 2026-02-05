const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "因数分解（最低次数の文字）";
const unit2 = "因数分解（2元2次式）";
const unit3 = "因数分解（対称式・交代式）";
const instruction = "次の式を因数分解せよ。";

const data1 = [
    // 類題 1
    { q: "$x^2+xy+x+y$", a: "$(x+1)(x+y)$" },
    { q: "$x^2+xy+3x+y+2$", a: "$(x+1)(x+y+2)$" },
    { q: "$x^2+xy-x-y$", a: "$(x-1)(x+y)$" },
    { q: "$a^2+ab+2a+b+1$", a: "$(a+1)(a+b+1)$" },
    { q: "$x^2-xy+2x-y+1$", a: "$(x+1)(x-y+1)$" },
    { q: "$x^2+2xy+x+2y$", a: "$(x+1)(x+2y)$" },
    { q: "$x^2-xy+3x-y+2$", a: "$(x+1)(x-y+2)$" },
    { q: "$x^2+xy+4x+y+3$", a: "$(x+1)(x+y+3)$" },
    { q: "$x^2+xy-3x-y+2$", a: "$(x-1)(x+y-2)$" },
    { q: "$x^2-xy-x+y$", a: "$(x-1)(x-y)$" },
    // 類題 2
    { q: "$x^2y+xy^2+ax+ay$", a: "$(x+y)(xy+a)$" },
    { q: "$x^3+x^2y+zx^2+zxy$", a: "$x(x+y)(x+z)$" },
    { q: "$x^2+2xy+y^2+zx+zy$", a: "$(x+y)(x+y+z)$" },
    { q: "$a^2b+ab^2+ac+bc$", a: "$(a+b)(ab+c)$" },
    { q: "$x^2+3xy+2y^2+zx+2zy$", a: "$(x+2y)(x+y+z)$" },
    { q: "$x^3+3x^2y+2xy^2+zx^2+3zxy+2zy^2$", a: "$(x+y)(x+2y)(x+z)$" },
    { q: "$a^2-b^2+ac-bc$", a: "$(a-b)(a+b+c)$" },
    { q: "$x^2-3xy+2y^2+zx-2zy$", a: "$(x-2y)(x-y+z)$" },
    { q: "$2x^2+3xy+y^2+2zx+zy$", a: "$(2x+y)(x+y+z)$" },
    { q: "$x^2-y^2+zx+zy$", a: "$(x+y)(x-y+z)$" }
];

const data2 = [
    // 類題 1 (Converted backticks to $)
    { q: "$x^2+3xy+2y^2+4x+5y+3$", a: "$(x+y+1)(x+2y+3)$" },
    { q: "$x^2+xy-2y^2+3x+3y+2$", a: "$(x-y+2)(x+2y+1)$" },
    { q: "$x^2-y^2+3x+y-4$", a: "$(x+y-1)(x-y+4)$" },
    { q: "$x^2+3xy+2y^2+3x+8y-10$", a: "$(x+2y-2)(x+y+5)$" },
    { q: "$x^2-3xy+2y^2+2x-y-3$", a: "$(x-y-1)(x-2y+3)$" },
    { q: "$x^2+2xy-3y^2-x-7y-2$", a: "$(x+3y+1)(x-y-2)$" },
    { q: "$x^2-2xy-3y^2+3x-5y+2$", a: "$(x+y+2)(x-3y+1)$" },
    { q: "$x^2-2xy+y^2+2x+2y-3$", a: "$(x-y+3)(x-y-1)$" },
    { q: "$x^2+3xy+2y^2-3x-7y-4$", a: "$(x+2y+1)(x+y-4)$" },
    { q: "$x^2-xy-2y^2+3x+2$", a: "$(x-2y+2)(x+y+1)$" },
    // 類題 2
    { q: "$2x^2+3xy+y^2+5x+3y+2$", a: "$(2x+y+1)(x+y+2)$" },
    { q: "$3x^2+2xy-y^2-2x+2y-1$", a: "$(3x-y+1)(x+y-1)$" },
    { q: "$2x^2-xy-y^2-x+4y-3$", a: "$(2x+y-3)(x-y+1)$" },
    { q: "$3x^2+5xy+2y^2+7x+5y+2$", a: "$(3x+2y+1)(x+y+2)$" },
    { q: "$2x^2-xy-3y^2+5x-5y+2$", a: "$(2x-3y+1)(x+y+2)$" },
    { q: "$4x^2-3xy-y^2+11x+4y-3$", a: "$(4x+y-1)(x-y+3)$" },
    { q: "$6x^2+xy-y^2+8x-y+2$", a: "$(2x+y+2)(3x-y+1)$" },
    { q: "$6x^2+7xy+2y^2+x+y-1$", a: "$(3x+2y-1)(2x+y+1)$" },
    { q: "$2x^2+3xy-2y^2+2x+9y-4$", a: "$(2x-y+4)(x+2y-1)$" },
    { q: "$5x^2-4xy-y^2+3x+3y-2$", a: "$(5x+y-2)(x-y+1)$" }
];

const data3 = [
    // 類題 1
    { q: "$a(b+c)^2+b(c+a)^2+c(a+b)^2-4abc$", a: "$(a+b)(b+c)(c+a)$" },
    { q: "$x(y+z)^2+y(z+x)^2+z(x+y)^2-4xyz$", a: "$(x+y)(y+z)(z+x)$" },
    { q: "$p(q+r)^2+q(r+p)^2+r(p+q)^2-4pqr$", a: "$(p+q)(q+r)(r+p)$" },
    { q: "$l(m+n)^2+m(n+l)^2+n(l+m)^2-4lmn$", a: "$(l+m)(m+n)(n+l)$" },
    { q: "$u(v+w)^2+v(w+u)^2+w(u+v)^2-4uvw$", a: "$(u+v)(v+w)(w+u)$" },
    { q: "$x(a+b)^2+a(b+x)^2+b(x+a)^2-4abx$", a: "$(x+a)(a+b)(b+x)$" },
    { q: "$s(t+u)^2+t(u+s)^2+u(s+t)^2-4stu$", a: "$(s+t)(t+u)(u+s)$" },
    { q: "$A(B+C)^2+B(C+A)^2+C(A+B)^2-4ABC$", a: "$(A+B)(B+C)(C+A)$" },
    { q: "$y(z+x)^2+z(x+y)^2+x(y+z)^2-4xyz$", a: "$(y+z)(z+x)(x+y)$" },
    { q: "$c(a+b)^2+a(b+c)^2+b(c+a)^2-4abc$", a: "$(c+a)(a+b)(b+c)$" },
    // 類題 2
    { q: "$x(y^2-z^2)+y(z^2-x^2)+z(x^2-y^2)$", a: "$(x-y)(y-z)(z-x)$" },
    { q: "$a(b^2-c^2)+b(c^2-a^2)+c(a^2-b^2)$", a: "$(a-b)(b-c)(c-a)$" },
    { q: "$p(q^2-r^2)+q(r^2-p^2)+r(p^2-q^2)$", a: "$(p-q)(q-r)(r-p)$" },
    { q: "$u(v^2-w^2)+v(w^2-u^2)+w(u^2-v^2)$", a: "$(u-v)(v-w)(w-u)$" },
    { q: "$l(m^2-n^2)+m(n^2-l^2)+n(l^2-m^2)$", a: "$(l-m)(m-n)(n-l)$" },
    { q: "$A(B^2-C^2)+B(C^2-A^2)+C(A^2-B^2)$", a: "$(A-B)(B-C)(C-A)$" },
    { q: "$s(t^2-u^2)+t(u^2-s^2)+u(s^2-t^2)$", a: "$(s-t)(t-u)(u-s)$" },
    { q: "$x(a^2-b^2)+a(b^2-x^2)+b(x^2-a^2)$", a: "$(x-a)(a-b)(b-x)$" },
    { q: "$y(z^2-x^2)+z(x^2-y^2)+x(y^2-z^2)$", a: "$(y-z)(z-x)(x-y)$" },
    { q: "$c(a^2-b^2)+a(b^2-c^2)+b(c^2-a^2)$", a: "$(c-a)(a-b)(b-c)$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";

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

addProblems(data1, unit1);
addProblems(data2, unit2);
addProblems(data3, unit3);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
