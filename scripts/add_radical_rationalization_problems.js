const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "$\\sqrt{A^2}$ のはずし方";
const unit2 = "分母の有理化";

const data1_1 = [
    { q: "$a>0,b>0$ のとき, $\\sqrt{a^2b^2}$ の根号をはずして簡単にせよ。", a: "$ab$" },
    { q: "$a<0,b>0$ のとき, $\\sqrt{a^2b^4}$ の根号をはずして簡単にせよ。", a: "$-ab^2$" },
    { q: "$a>0,b<0$ のとき, $\\sqrt{a^6b^2}$ の根号をはずして簡単にせよ。", a: "$-a^3b$" },
    { q: "$a<0,b<0$ のとき, $\\sqrt{a^2b^2}$ の根号をはずして簡単にせよ。", a: "$ab$" },
    { q: "$a>0,b<0$ のとき, $\\sqrt{9a^2b^2}$ の根号をはずして簡単にせよ。", a: "$-3ab$" },
    { q: "$a<0,b>0$ のとき, $\\sqrt{16a^4b^2}$ の根号をはずして簡単にせよ。", a: "$-4a^2b$" },
    { q: "$a<0,b<0$ のとき, $\\sqrt{a^4b^6}$ の根号をはずして簡単にせよ。", a: "$-a^2b^3$" },
    { q: "$a>0,b<0$ のとき, $\\sqrt{25a^2b^4}$ の根号をはずして簡単にせよ。", a: "$-5ab^2$" },
    { q: "$a<0,b>0$ のとき, $\\sqrt{a^8b^2}$ の根号をはずして簡単にせよ。", a: "$-a^4b$" },
    { q: "$a>0,b<0$ のとき, $\\sqrt{4a^6b^2}$ の根号をはずして簡単にせよ。", a: "$-2a^3b$" }
];

const data1_2 = [
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{x^2}+\\sqrt{(x-3)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<0$ (イ) $0 \\le x < 3$ (ウ) $3 \\le x$", a: "(ア) $-2x+3$ (イ) 3 (ウ) $2x-3$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{x^2}+\\sqrt{(x-1)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<0$ (イ) $0 \\le x < 1$ (ウ) $1 \\le x$", a: "(ア) $-2x+1$ (イ) 1 (ウ) $2x-1$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{(x-1)^2}+\\sqrt{(x-4)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<1$ (イ) $1 \\le x < 4$ (ウ) $4 \\le x$", a: "(ア) $-2x+5$ (イ) 3 (ウ) $2x-5$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{x^2}+\\sqrt{(x+2)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<-2$ (イ) $-2 \le x < 0$ (ウ) $0 \\le x$", a: "(ア) $-2x-2$ (イ) 2 (ウ) $2x+2$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{(x+1)^2}+\\sqrt{(x-1)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<-1$ (イ) $-1 \\le x < 1$ (ウ) $1 \\le x$", a: "(ア) $-2x$ (イ) 2 (ウ) $2x$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{(x-2)^2}+\\sqrt{(x-5)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<2$ (イ) $2 \\le x < 5$ (ウ) $5 \\le x$", a: "(ア) $-2x+7$ (イ) 3 (ウ) $2x-7$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{x^2}+\\sqrt{(x-4)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<0$ (イ) $0 \\le x < 4$ (ウ) $4 \\le x$", a: "(ア) $-2x+4$ (イ) 4 (ウ) $2x-4$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{(x+3)^2}+\\sqrt{x^2}$ の根号をはずして簡単にせよ。\n(ア) $x<-3$ (イ) $-3 \\le x < 0$ (ウ) $0 \\le x$", a: "(ア) $-2x-3$ (イ) 3 (ウ) $2x+3$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{(x-1)^2}+\\sqrt{(x-2)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<1$ (イ) $1 \\le x < 2$ (ウ) $2 \\le x$", a: "(ア) $-2x+3$ (イ) 1 (ウ) $2x-3$" },
    { q: "(ア)〜(ウ)の場合について, $\\sqrt{(x+2)^2}+\\sqrt{(x-2)^2}$ の根号をはずして簡単にせよ。\n(ア) $x<-2$ (イ) $-2 \\le x < 2$ (ウ) $2 \\le x$", a: "(ア) $-2x$ (イ) 4 (ウ) $2x$" }
];

const data2_1 = [
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{6}{2\\sqrt{12}}$", a: "$\\frac{\\sqrt{3}}{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{2}{3\\sqrt{18}}$", a: "$\\frac{\\sqrt{2}}{9}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{10}{2\\sqrt{50}}$", a: "$\\frac{\\sqrt{2}}{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{2\\sqrt{27}}$", a: "$\\frac{\\sqrt{3}}{18}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{3}{4\\sqrt{24}}$", a: "$\\frac{\\sqrt{6}}{16}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{9}{3\\sqrt{45}}$", a: "$\\frac{\\sqrt{5}}{5}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{5}{2\\sqrt{20}}$", a: "$\\frac{\\sqrt{5}}{4}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{4}{5\\sqrt{32}}$", a: "$\\frac{\\sqrt{2}}{10}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{6}{2\\sqrt{54}}$", a: "$\\frac{\\sqrt{6}}{6}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{12}{3\\sqrt{48}}$", a: "$\\frac{\\sqrt{3}}{3}$" }
];

const data2_2 = [
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{2}+\\sqrt{3}}+\\frac{1}{\\sqrt{3}+\\sqrt{4}}$", a: "$2-\\sqrt{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{3}+2}+\\frac{1}{2+\\sqrt{5}}$", a: "$\\sqrt{5}-\\sqrt{3}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{2+\\sqrt{5}}+\\frac{1}{\\sqrt{5}+\\sqrt{6}}$", a: "$\\sqrt{6}-2$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{5}+\\sqrt{6}}+\\frac{1}{\\sqrt{6}+\\sqrt{7}}$", a: "$\\sqrt{7}-\\sqrt{5}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{6}+\\sqrt{7}}+\\frac{1}{\\sqrt{7}+\\sqrt{8}}$", a: "$2\\sqrt{2}-\\sqrt{6}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{7}+\\sqrt{8}}+\\frac{1}{\\sqrt{8}+3}$", a: "$3-\\sqrt{7}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{3+\\sqrt{10}}+\\frac{1}{\\sqrt{10}+\\sqrt{11}}$", a: "$\\sqrt{11}-3$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{4}+\\sqrt{5}}+\\frac{1}{\\sqrt{5}+\\sqrt{6}}$", a: "$\\sqrt{6}-2$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{10}+\\sqrt{11}}+\\frac{1}{\\sqrt{11}+\\sqrt{12}}$", a: "$2\\sqrt{3}-\\sqrt{10}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{1}{\\sqrt{11}+\\sqrt{12}}+\\frac{1}{\\sqrt{12}+\\sqrt{13}}$", a: "$\\sqrt{13}-\\sqrt{11}$" }
];

const data2_3 = [
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{2}}{\\sqrt{3}+2}-\\frac{\\sqrt{2}}{\\sqrt{3}-2}$", a: "$4\\sqrt{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{3}}{\\sqrt{2}+1}-\\frac{\\sqrt{3}}{\\sqrt{2}-1}$", a: "$-2\\sqrt{3}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{5}}{\\sqrt{6}+\\sqrt{5}}-\\frac{\\sqrt{5}}{\\sqrt{6}-\\sqrt{5}}$", a: "$-10$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{7}}{\\sqrt{3}+2}-\\frac{\\sqrt{7}}{\\sqrt{3}-2}$", a: "$4\\sqrt{7}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{6}}{\\sqrt{5}+1}-\\frac{\\sqrt{6}}{\\sqrt{5}-1}$", a: "$-\\frac{\\sqrt{6}}{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{10}}{\\sqrt{7}+\\sqrt{3}}-\\frac{\\sqrt{10}}{\\sqrt{7}-\\sqrt{3}}$", a: "$-\\frac{\\sqrt{30}}{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{2}}{\\sqrt{5}+3}-\\frac{\\sqrt{2}}{\\sqrt{5}-3}$", a: "$\\frac{3\\sqrt{2}}{2}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{3}}{2+\\sqrt{7}}-\\frac{\\sqrt{3}}{2-\\sqrt{7}}$", a: "$\\frac{2\\sqrt{21}}{3}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{5}}{\\sqrt{10}+3}-\\frac{\\sqrt{5}}{\\sqrt{10}-3}$", a: "$-6\\sqrt{5}$" },
    { q: "次の式を，分母を有理化して簡単にせよ。\n$\\frac{\\sqrt{2}}{\\sqrt{6}+2}-\\frac{\\sqrt{2}}{\\sqrt{6}-2}$", a: "$-2\\sqrt{2}$" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

function addProbs(data, unit) {
    for (const p of data) {
        const exists = existingJson.some(ex => ex.question === p.q && ex.unit === unit);
        if (!exists) {
            lastProblemNumber++;
            newProblems.push({
                grade: grade,
                unit: unit,
                problem_number: lastProblemNumber,
                question: p.q,
                answer: p.a
            });
        }
    }
}

addProbs(data1_1, unit1);
addProbs(data1_2, unit1);
addProbs(data2_1, unit2);
addProbs(data2_2, unit2);
addProbs(data2_3, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
