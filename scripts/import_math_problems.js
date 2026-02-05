const fs = require('fs');
const path = require('path');

const csvPath = path.join(process.cwd(), 'public', 'mistap', 'generated-questions-2026-02-05T14-05-44-195Z.csv');
const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const csvContent = fs.readFileSync(csvPath, 'utf8');

// Find where the header ends and data begins.
let dataStart = 0;
// Skip first line
const firstNewline = csvContent.indexOf('\n');
if (firstNewline === -1) {
    console.error("File seems too short");
    process.exit(1);
}

const dataString = csvContent.substring(firstNewline + 1).trim();

// The dataString should be like: "Q1","A1","Q2","A2"...
if (!dataString.startsWith('"') || !dataString.endsWith('"')) {
    console.error("Data row format unexpected");
    process.exit(1);
}

const innerContent = dataString.substring(1, dataString.length - 1);
// Split by ","
// Note: This matches the "","" separator between cells.
const cells = innerContent.split('","');

console.log(`Found ${cells.length} cells in CSV.`);

if (cells.length % 2 !== 0) {
    console.error("Odd number of cells, expected pairs of Q and A");
}

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;
console.log(`Last problem number: ${lastProblemNumber}`);

const newProblems = [];
const grade = "数Ⅰ";
const unit = "多項式の整理"; // Unit is different from the previous batch

for (let i = 0; i < cells.length; i += 2) {
    let qRaw = cells[i];
    let aRaw = cells[i + 1];

    if (!qRaw || !aRaw) continue;

    // Clean up cell markers
    qRaw = qRaw.replace(/\*\*\s*$/, '').trim();
    aRaw = aRaw.replace(/^\*\*/, '').trim();
    aRaw = aRaw.replace(/^"|"$|---$/g, '').trim();

    // In this specific CSV, we assume ONE question per cell pair.
    // We do NOT split by `(1)`, `(2)` etc. because the file view suggests each cell is a single question.
    // Formatting check:
    // Q: "次の多項式の... \n $math$ ..."
    // A: "整理した式: ... \n ..."

    const questionText = qRaw;
    const answerText = aRaw;

    // Check for duplicates
    // We check against existing questions in the same unit.
    const exists = existingJson.some(p => p.question === questionText && p.unit === unit);

    if (!exists) {
        lastProblemNumber++;
        newProblems.push({
            grade: grade,
            unit: unit,
            problem_number: lastProblemNumber,
            question: questionText,
            answer: answerText
        });
    } else {
        console.log(`Skipping duplicate: ${questionText.substring(0, 20)}...`);
    }
}

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add (all duplicates or empty).");
}
