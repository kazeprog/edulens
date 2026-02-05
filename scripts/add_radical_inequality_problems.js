const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit1 = "2重根号";
const instruction1 = "2重根号をはずして, 次の式を簡単にせよ。";

const unit2 = "1次不等式の解法";
const instruction2 = "次の不等式を解け。";

const radicalData = [
    // 類題 1
    { q: "$\\sqrt{3+2\\sqrt{2}}$", a: "$\\sqrt{2}+1$" },
    { q: "$\\sqrt{5+2\\sqrt{6}}$", a: "$\\sqrt{3}+\\sqrt{2}$" },
    { q: "$\\sqrt{6+2\\sqrt{5}}$", a: "$\\sqrt{5}+1$" },
    { q: "$\\sqrt{7+2\\sqrt{10}}$", a: "$\\sqrt{5}+\\sqrt{2}$" },
    { q: "$\\sqrt{8+2\\sqrt{7}}$", a: "$\\sqrt{7}+1$" },
    { q: "$\\sqrt{8+2\\sqrt{15}}$", a: "$\\sqrt{5}+\\sqrt{3}$" },
    { q: "$\\sqrt{9+2\\sqrt{14}}$", a: "$\\sqrt{7}+\\sqrt{2}$" },
    { q: "$\\sqrt{9+2\\sqrt{20}}$", a: "$\\sqrt{5}+2$" },
    { q: "$\\sqrt{10+2\\sqrt{21}}$", a: "$\\sqrt{7}+\\sqrt{3}$" },
    { q: "$\\sqrt{11+2\\sqrt{10}}$", a: "$\\sqrt{10}+1$" },
    // 類題 2
    { q: "$\\sqrt{4-\\sqrt{12}}$", a: "$\\sqrt{3}-1$" },
    { q: "$\\sqrt{6-\\sqrt{20}}$", a: "$\\sqrt{5}-1$" },
    { q: "$\\sqrt{7-\\sqrt{40}}$", a: "$\\sqrt{5}-\\sqrt{2}$" },
    { q: "$\\sqrt{8-\\sqrt{28}}$", a: "$\\sqrt{7}-1$" },
    { q: "$\\sqrt{8-\\sqrt{60}}$", a: "$\\sqrt{5}-\\sqrt{3}$" },
    { q: "$\\sqrt{9-\\sqrt{56}}$", a: "$\\sqrt{7}-\\sqrt{2}$" },
    { q: "$\\sqrt{9-\\sqrt{80}}$", a: "$\\sqrt{5}-2$" },
    { q: "$\\sqrt{10-\\sqrt{84}}$", a: "$\\sqrt{7}-\\sqrt{3}$" },
    { q: "$\\sqrt{11-\\sqrt{40}}$", a: "$\\sqrt{10}-1$" },
    { q: "$\\sqrt{12-\\sqrt{140}}$", a: "$\\sqrt{7}-\\sqrt{5}$" },
    // 類題 3
    { q: "$\\sqrt{7+4\\sqrt{3}}$", a: "$2+\\sqrt{3}$" },
    { q: "$\\sqrt{6-4\\sqrt{2}}$", a: "$2-\\sqrt{2}$" },
    { q: "$\\sqrt{8+4\\sqrt{3}}$", a: "$\\sqrt{6}+\\sqrt{2}$" },
    { q: "$\\sqrt{10-4\\sqrt{6}}$", a: "$\\sqrt{6}-2$" },
    { q: "$\\sqrt{11+4\\sqrt{6}}$", a: "$2\\sqrt{2}+\\sqrt{3}$" },
    { q: "$\\sqrt{12-6\\sqrt{3}}$", a: "$3-\\sqrt{3}$" },
    { q: "$\\sqrt{13+4\\sqrt{10}}$", a: "$2\\sqrt{2}+\\sqrt{5}$" },
    { q: "$\\sqrt{14-6\\sqrt{5}}$", a: "$3-\\sqrt{5}$" },
    { q: "$\\sqrt{15+4\\sqrt{14}}$", a: "$2\\sqrt{2}+\\sqrt{7}$" },
    { q: "$\\sqrt{18-8\\sqrt{2}}$", a: "$4-\\sqrt{2}$" },
    // 類題 4
    { q: "$\\sqrt{2+\\sqrt{3}}$", a: "$\\frac{\\sqrt{6}+\\sqrt{2}}{2}$" },
    { q: "$\\sqrt{2-\\sqrt{3}}$", a: "$\\frac{\\sqrt{6}-\\sqrt{2}}{2}$" },
    { q: "$\\sqrt{3+\\sqrt{5}}$", a: "$\\frac{\\sqrt{10}+\\sqrt{2}}{2}$" },
    { q: "$\\sqrt{3-\\sqrt{5}}$", a: "$\\frac{\\sqrt{10}-\\sqrt{2}}{2}$" },
    { q: "$\\sqrt{4+\\sqrt{7}}$", a: "$\\frac{\\sqrt{14}+\\sqrt{2}}{2}$" },
    { q: "$\\sqrt{4-\\sqrt{7}}$", a: "$\\frac{\\sqrt{14}-\\sqrt{2}}{2}$" },
    { q: "$\\sqrt{5+\\sqrt{21}}$", a: "$\\frac{\\sqrt{14}+\\sqrt{6}}{2}$" },
    { q: "$\\sqrt{5-\\sqrt{21}}$", a: "$\\frac{\\sqrt{14}-\\sqrt{6}}{2}$" },
    { q: "$\\sqrt{4+\\sqrt{15}}$", a: "$\\frac{\\sqrt{10}+\\sqrt{6}}{2}$" },
    { q: "$\\sqrt{6-\\sqrt{11}}$", a: "$\\frac{\\sqrt{22}-\\sqrt{2}}{2}$" }
];

const inequalityData = [
    // 類題 1
    { q: "2x<15-3x", a: "x<3" },
    { q: "4x<20-x", a: "x<4" },
    { q: "7x<12+x", a: "x<2" },
    { q: "3x<24-x", a: "x<6" },
    { q: "5x<36-x", a: "x<6" },
    { q: "8x<30+2x", a: "x<5" },
    { q: "2x<21-x", a: "x<7" },
    { q: "6x<45-3x", a: "x<5" },
    { q: "9x<16+x", a: "x<2" },
    { q: "4x<18-2x", a: "x<3" },
    // 類題 2
    { q: "3x-10$ \\leqq $5x-2", a: "x$ \\geqq $-4" },
    { q: "2x-5$ \\leqq $7x+10", a: "x$ \\geqq $-3" },
    { q: "4x-1$ \\leqq $6x+9", a: "x$ \\geqq $-5" },
    { q: "x-7$ \\leqq $3x+1", a: "x$ \\geqq $-4" },
    { q: "5x-12$ \\leqq $8x-3", a: "x$ \\geqq $-3" },
    { q: "3x-4$ \\leqq $7x+8", a: "x$ \\geqq $-3" },
    { q: "2x-1$ \\leqq $5x+5", a: "x$ \\geqq $-2" },
    { q: "4x-15$ \\leqq $9x+10", a: "x$ \\geqq $-5" },
    { q: "6x-2$ \\leqq $8x+6", a: "x$ \\geqq $-4" },
    { q: "x-11$ \\leqq $4x-2", a: "x$ \\geqq $-3" },
    // 類題 3
    { q: "2(1-x)>$\\frac{1+x}{3}$", a: "x<$\\frac{5}{7}$" },
    { q: "3(x-2)>$\\frac{x-4}{2}$", a: "x>$\\frac{8}{5}$" },
    { q: "2(2x-1)>$\\frac{3x+1}{2}$", a: "x>1" },
    { q: "4(1-x)>$\\frac{2-x}{3}$", a: "x<$\\frac{10}{11}$" },
    { q: "2(3-x)>$\\frac{4-x}{5}$", a: "x<$\\frac{26}{9}$" },
    { q: "3(1-x)>$\\frac{5-2x}{4}$", a: "x<$\\frac{7}{10}$" },
    { q: "2(x+1)>$\\frac{3x-1}{3}$", a: "x>$-\\frac{7}{3}$" },
    { q: "5(1-x)>$\\frac{2-3x}{2}$", a: "x<$\\frac{8}{7}$" },
    { q: "2(2-x)>$\\frac{1-x}{4}$", a: "x<$\\frac{15}{7}$" },
    { q: "3(x+2)>$\\frac{2x+1}{5}$", a: "x>$-\\frac{29}{13}$" },
    // 類題 4
    { q: "x+0.8$ \\geqq $0.6x-2", a: "x$ \\geqq $-7" },
    { q: "0.7x-1.2$ \\geqq $0.2x+0.3", a: "x$ \\geqq $3" },
    { q: "x+0.5$ \\geqq $0.5x-1", a: "x$ \\geqq $-3" },
    { q: "0.9x+1.5$ \\geqq $0.4x-1", a: "x$ \\geqq $-5" },
    { q: "x+2.4$ \\geqq $0.2x-1.6", a: "x$ \\geqq $-5" },
    { q: "0.8x-0.4$ \\geqq $0.3x+1.1", a: "x$ \\geqq $3" },
    { q: "x+0.9$ \\geqq $0.7x-0.6", a: "x$ \\geqq $-5" },
    { q: "1.2x+0.4$ \\geqq $0.8x-1.6", a: "x$ \\geqq $-5" },
    { q: "x+1.5$ \\geqq $0.5x-0.5", a: "x$ \\geqq $-4" },
    { q: "0.6x+1.2$ \\geqq $0.1x-0.8", a: "x$ \\geqq $-4" }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

function addProbs(data, unit, inst) {
    for (const p of data) {
        const fullQuestion = `${inst}\n${p.q}`;
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
        }
    }
}

addProbs(radicalData, unit1, instruction1);
addProbs(inequalityData, unit2, instruction2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
