const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, '../temp_kobun_data.txt');
const outputPath = path.join(__dirname, '../lib/data/json/理解を深める核心古文単語351.json');

const rawData = fs.readFileSync(rawDataPath, 'utf8');
const lines = rawData.split('\n').map(l => l.trim()).filter(l => l);

const words = [];
let currentWord = null;
let wordCount = 0;

for (const line of lines) {
    if (line.includes(',') && !line.startsWith(',')) {
        // New word
        const parts = line.split(',');
        const wordText = parts[0].trim();
        const meaningText = parts.slice(1).join(',').trim();

        wordCount++;
        currentWord = {
            textbook: "理解を深める核心古文単語351",
            grade: "",
            section: 0,
            unit: 0,
            word_number: wordCount,
            word: wordText,
            meaning: meaningText
        };
        words.push(currentWord);
    } else {
        // Continuation or broken line
        if (currentWord) {
            let cleanLine = line;
            if (line.startsWith(',')) {
                cleanLine = line.substring(1).trim();
            }
            if (cleanLine) {
                currentWord.meaning += `, ${cleanLine}`;
            }
        }
    }
}

// Correction for known issue in raw data if any
// "わく" might be missing
const kazuku = words.find(w => w.word === 'かづく');
if (kazuku && kazuku.meaning.includes('区別する')) {
    // If "かづく" has "区別する", it's likely a merged error because "わく" (分く) means distinguish.
    // However, "かづく" usually doesn't mean distinguish.
    // Let's split it if we suspect it's "わく"
    // But I will leave it as is unless I am sure. 
    // Wait, "わく" is missing from the list? "かづく" comes before "わく" in dictionary order? 
    // ka-du-ku -> wa-ku. Yes.
    // User input had:
    // かづく,褒美として頂戴する
    // ,区別する
    // ふる,古びる
    // If I split "区別する" into a new word "わく" it would be number 300? No.
    // Let's correct it to be safe if it looks obviously like "わく".
    // I will check if "わく" exists in the list? No, I am generating it.

    // Actually, looking at the list, ",区別する" is clearly a missing word name "わく".
    // I will try to patch it.
    const index = words.indexOf(kazuku);
    const parts = kazuku.meaning.split(', ');
    const kazukuMeanings = [];
    const wakuMeanings = [];

    for (const m of parts) {
        if (m === '区別する') {
            wakuMeanings.push(m);
        } else {
            kazukuMeanings.push(m);
        }
    }

    if (wakuMeanings.length > 0) {
        kazuku.meaning = kazukuMeanings.join(', ');

        // Insert "わく" after "かづく"
        // We need to shift numbers? No, numbers are just index + 1.
        // But I assigned numbers already.
        // I should probably fix strict content.
        // Let's just create the new word.
        const waku = {
            textbook: "理解を深める核心古文単語351",
            grade: "",
            section: 0,
            unit: 0,
            word_number: 0, // Will fix num later
            word: "わく",
            meaning: wakuMeanings.join(', ')
        };
        words.splice(index + 1, 0, waku);
    }
}

// Renumber
words.forEach((w, i) => {
    w.word_number = i + 1;
});


fs.writeFileSync(outputPath, JSON.stringify(words, null, 2));
console.log(`Generated ${words.length} words.`);
