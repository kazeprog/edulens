const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const unit = "平方根を含む式の計算";
const instruction = "次の式を計算せよ。";

const data1 = [
    { q: "$3\\sqrt{20}-2\\sqrt{45}+\\sqrt{80}$", a: "$4\\sqrt{5}$" },
    { q: "$\\sqrt{50}-2\\sqrt{18}+3\\sqrt{32}$", a: "$11\\sqrt{2}$" },
    { q: "$2\\sqrt{12}+4\\sqrt{27}-2\\sqrt{75}$", a: "$6\\sqrt{3}$" },
    { q: "$3\\sqrt{24}+\\sqrt{54}-2\\sqrt{96}$", a: "$\\sqrt{6}$" },
    { q: "$\\sqrt{98}-3\\sqrt{8}+2\\sqrt{50}$", a: "$11\\sqrt{2}$" },
    { q: "$2\\sqrt{28}-\\sqrt{63}+\\sqrt{112}$", a: "$5\\sqrt{7}$" },
    { q: "$3\\sqrt{40}-2\\sqrt{90}+\\sqrt{160}$", a: "$4\\sqrt{10}$" },
    { q: "$\\sqrt{108}-2\\sqrt{48}+\\sqrt{75}$", a: "$3\\sqrt{3}$" },
    { q: "$4\\sqrt{18}-3\\sqrt{32}+\\sqrt{8}$", a: "$2\\sqrt{2}$" },
    { q: "$2\\sqrt{63}-3\\sqrt{28}+\\sqrt{175}$", a: "$5\\sqrt{7}$" }
];

const data2 = [
    { q: "$(\\sqrt{3}+\\sqrt{2})^2$", a: "$5+2\\sqrt{6}$" },
    { q: "$(\\sqrt{7}-\\sqrt{3})^2$", a: "$10-2\\sqrt{21}$" },
    { q: "$(\\sqrt{6}+\\sqrt{2})^2$", a: "$8+4\\sqrt{3}$" },
    { q: "$(\\sqrt{5}-\\sqrt{3})^2$", a: "$8-2\\sqrt{15}$" },
    { q: "$(\\sqrt{10}+\\sqrt{2})^2$", a: "$12+4\\sqrt{5}$" },
    { q: "$(\\sqrt{11}+\\sqrt{7})^2$", a: "$18+2\\sqrt{77}$" },
    { q: "$(\\sqrt{5}-\\sqrt{2})^2$", a: "$7-2\\sqrt{10}$" },
    { q: "$(\\sqrt{13}+\\sqrt{3})^2$", a: "$16+2\\sqrt{39}$" },
    { q: "$(\\sqrt{7}+\\sqrt{2})^2$", a: "$9+2\\sqrt{14}$" },
    { q: "$(\\sqrt{6}-\\sqrt{5})^2$", a: "$11-2\\sqrt{30}$" }
];

const data3 = [
    { q: "$(\\sqrt{2}+2\\sqrt{3})(3\\sqrt{2}-\\sqrt{3})$", a: "$5\\sqrt{6}$" },
    { q: "$(\\sqrt{5}+2\\sqrt{2})(2\\sqrt{5}-\\sqrt{2})$", a: "$6+3\\sqrt{10}$" },
    { q: "$(\\sqrt{7}-\\sqrt{2})(2\\sqrt{7}+3\\sqrt{2})$", a: "$8+\\sqrt{14}$" },
    { q: "$(2\\sqrt{3}+\\sqrt{5})(\\sqrt{3}-2\\sqrt{5})$", a: "$-4-3\\sqrt{15}$" },
    { q: "$(3\\sqrt{2}-2\\sqrt{5})(\\sqrt{2}+\\sqrt{5})$", a: "$-4+\\sqrt{10}$" },
    { q: "$(\\sqrt{6}+2\\sqrt{3})(2\\sqrt{6}-\\sqrt{3})$", a: "$6+9\\sqrt{2}$" },
    { q: "$(2\\sqrt{5}+3\\sqrt{3})(\\sqrt{5}-\\sqrt{3})$", a: "$1+\\sqrt{15}$" },
    { q: "$(\\sqrt{2}-4\\sqrt{5})(3\\sqrt{2}+\\sqrt{5})$", a: "$-14-11\\sqrt{10}$" },
    { q: "$(\\sqrt{7}+2\\sqrt{3})(2\\sqrt{7}-\\sqrt{3})$", a: "$8+3\\sqrt{21}$" },
    { q: "$(3\\sqrt{3}-\\sqrt{2})(\\sqrt{3}+2\\sqrt{2})$", a: "$5+5\\sqrt{6}$" }
];

const data4 = [
    { q: "$(4+2\\sqrt{2})(\\sqrt{2}-3)$", a: "$-8-2\\sqrt{2}$" },
    { q: "$(3+2\\sqrt{5})(\\sqrt{5}-1)$", a: "$7+\\sqrt{5}$" },
    { q: "$(2+3\\sqrt{3})(\\sqrt{3}-2)$", a: "$5-4\\sqrt{3}$" },
    { q: "$(5-\\sqrt{2})(2\\sqrt{2}+1)$", a: "$1+9\\sqrt{2}$" },
    { q: "$(8+2\\sqrt{6})(\\sqrt{6}-2)$", a: "$-4+4\\sqrt{6}$" },
    { q: "$(4-3\\sqrt{2})(\\sqrt{2}+3)$", a: "$6-5\\sqrt{2}$" },
    { q: "$(2+\\sqrt{7})(3\\sqrt{7}-4)$", a: "$13+2\\sqrt{7}$" },
    { q: "$(6-2\\sqrt{3})(2\\sqrt{3}+1)$", a: "$-6+10\\sqrt{3}$" },
    { q: "$(10+3\\sqrt{2})(\\sqrt{2}-4)$", a: "$-34-2\\sqrt{2}$" },
    { q: "$(4+\\sqrt{5})(2\\sqrt{5}-3)$", a: "$-2+5\\sqrt{5}$" }
];

const allData = [...data1, ...data2, ...data3, ...data4];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];
const grade = "数Ⅰ";

for (const p of allData) {
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
    }
}

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
