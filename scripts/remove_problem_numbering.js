const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

try {
    const data = fs.readFileSync(jsonPath, 'utf8');
    const problems = JSON.parse(data);

    let infoCount = 0;

    const updatedProblems = problems.map(p => {
        // Target: "\r\n(1) " or "\n(1) "
        // Replace with "\n" to keep the line break but remove the number and following space.
        if (p.question && /[\r\n]+\(\d+\)\s*/.test(p.question)) {
            const original = p.question;
            // Replace <newline>(digits)<space> with <newline>
            // We use \n for consistency.
            const newQuestion = p.question.replace(/[\r\n]+\(\d+\)\s*/g, '\n');

            if (original !== newQuestion) {
                infoCount++;
            }
            return { ...p, question: newQuestion };
        }
        return p;
    });

    if (infoCount > 0) {
        fs.writeFileSync(jsonPath, JSON.stringify(updatedProblems, null, 4), 'utf8');
        console.log(`Updated ${infoCount} problems.`);
    } else {
        console.log("No matching patterns found.");
    }

} catch (e) {
    console.error("Error processing file:", e);
    process.exit(1);
}
