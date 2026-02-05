const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "循環小数の分数表示";
const unit2 = "循環小数の桁";
const inst1 = "次の循環小数を分数で表せ。";
const inst2 = "次の分数を小数で表したとき、指定された小数位の数字を求めよ。";

const recurringToFraction = [
    // (ア)
    { q: "$0.\\dot{1}\\dot{2}$", a: "$\\frac{4}{33}$" },
    { q: "$0.\\dot{3}\\dot{6}$", a: "$\\frac{4}{11}$" },
    { q: "$0.\\dot{8}\\dot{1}$", a: "$\\frac{9}{11}$" },
    { q: "$1.\\dot{0}\\dot{5}$", a: "$\\frac{35}{33}$" },
    { q: "$1.\\dot{2}\\dot{7}$", a: "$\\frac{14}{11}$" },
    { q: "$2.\\dot{1}\\dot{8}$", a: "$\\frac{24}{11}$" },
    { q: "$3.\\dot{4}\\dot{2}$", a: "$\\frac{113}{33}$" },
    { q: "$0.\\dot{0}\\dot{9}$", a: "$\\frac{1}{11}$" },
    { q: "$0.\\dot{7}\\dot{5}$", a: "$\\frac{25}{33}$" },
    { q: "$5.\\dot{5}\\dot{4}$", a: "$\\frac{61}{11}$" },
    // (イ)
    { q: "$0.\\dot{1}2\\dot{3}$", a: "$\\frac{41}{333}$" },
    { q: "$0.\\dot{4}5\\dot{6}$", a: "$\\frac{152}{333}$" },
    { q: "$0.\\dot{0}2\\dot{7}$", a: "$\\frac{1}{37}$" },
    { q: "$0.\\dot{1}0\\dot{8}$", a: "$\\frac{4}{37}$" },
    { q: "$0.\\dot{3}3\\dot{3}$", a: "$\\frac{1}{3}$" },
    { q: "$0.\\dot{7}4\\dot{1}$", a: "$\\frac{247}{333}$" },
    { q: "$0.\\dot{2}1\\dot{6}$", a: "$\\frac{8}{37}$" },
    { q: "$0.\\dot{0}0\\dot{9}$", a: "$\\frac{1}{111}$" },
    { q: "$0.\\dot{5}6\\dot{7}$", a: "$\\frac{21}{37}$" },
    { q: "$0.\\dot{8}9\\dot{1}$", a: "$\\frac{33}{37}$" },
    // (ウ)
    { q: "$0.1\\dot{6}$", a: "$\\frac{1}{6}$" },
    { q: "$0.8\\dot{3}$", a: "$\\frac{5}{6}$" },
    { q: "$1.2\\dot{5}$", a: "$\\frac{113}{90}$" },
    { q: "$2.0\\dot{4}$", a: "$\\frac{37}{18}$" },
    { q: "$0.4\\dot{1}$", a: "$\\frac{37}{90}$" },
    { q: "$1.1\\dot{2}$", a: "$\\frac{101}{90}$" },
    { q: "$0.0\\dot{7}$", a: "$\\frac{7}{90}$" },
    { q: "$3.5\\dot{1}$", a: "$\\frac{158}{45}$" },
    { q: "$0.2\\dot{8}$", a: "$\\frac{13}{45}$" },
    { q: "$0.9\\dot{4}$", a: "$\\frac{17}{18}$" }
];

const recurringDigits = [
    { q: "$\\frac{1}{7}$ を小数で表したとき、小数第20位の数字を求めよ。", a: "4" },
    { q: "$\\frac{2}{11}$ を小数で表したとき、小数第50位の数字を求めよ。", a: "8" },
    { q: "$\\frac{5}{37}$ を小数で表したとき、小数第30位の数字を求めよ。", a: "5" },
    { q: "$\\frac{4}{7}$ を小数で表したとき、小数第100位の数字を求めよ。", a: "8" },
    { q: "$\\frac{1}{13}$ を小数で表したとき、小数第25位の数字を求めよ。", a: "0" },
    { q: "$\\frac{8}{37}$ を小数で表したとき、小数第40位の数字を求めよ。", a: "2" },
    { q: "$\\frac{5}{11}$ を小数で表したとき、小数第99位の数字を求めよ。", a: "4" },
    { q: "$\\frac{3}{7}$ を小数で表したとき、小数第60位の数字を求めよ。", a: "1" },
    { q: "$\\frac{1}{37}$ を小数で表したとき、小数第80位の数字を求めよ。", a: "2" },
    { q: "$\\frac{2}{13}$ を小数で表したとき、小数第15位の数字を求めよ。", a: "3" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";

function addProblems(data, unitName, instruction) {
    for (const p of data) {
        let fullQuestion = p.q;
        if (instruction) {
            fullQuestion = `${instruction}\n${p.q}`;
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

addProblems(recurringToFraction, unit1, inst1);
addProblems(recurringDigits, unit2, inst2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
