const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.resolve('public/teppeki.csv');
const OUTPUT_FILE = path.resolve('lib/data/json/teppeki.json');

function normalizeMeaning(meaning) {
    if (!meaning) return "";
    // Replace full-width semicolons with regular ones or spaces as needed
    return meaning.replace(/；/g, ' ').replace(/;/g, ' ').trim();
}

function parseCSV(content) {
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // Simple parser: assuming format "no,word,meaning" or similar
    // We'll inspect the header row to be safe, but given user request, it might just be raw data.
    // Let's assume the first line is header if it contains specific keywords, otherwise data.
    // Actually, let's just look at the first few lines.

    const header = lines[0].toLowerCase();
    let startIndex = 0;
    let hasHeader = false;

    if (header.includes('no') || header.includes('word') || header.includes('meaning') || header.includes('番号')) {
        hasHeader = true;
        startIndex = 1;
    }

    const records = [];

    for (let i = startIndex; i < lines.length; i++) {
        // Handle quoted fields if necessary, but simple split might work for now 
        // if descriptions don't contain commas. If they do, this is fragile.
        // Let's support basic quotes.

        const row = [];
        let current = '';
        let inQuote = false;
        const line = lines[i];

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());

        if (row.length >= 2) {
            // Adapt to "no, word, meaning" or "word, meaning"
            // Assuming 3 columns: No, Word, Meaning

            let num, word, meaning;

            if (row.length === 3) {
                num = row[0];
                word = row[1];
                meaning = row[2];
            } else if (row.length === 2 && !isNaN(row[0])) {
                // maybe "no, word" ? unlikely without meaning
                num = row[0];
                word = row[1];
                meaning = "";
            } else {
                // fallback, maybe generated index
                num = i + 1; // logical index
                word = row[0];
                meaning = row[1];
            }

            records.push({
                textbook: "改訂版 鉄緑会東大英単語熟語 鉄壁",
                word_number: Number(num.replace(/[^0-9]/g, '')) || (i + 1), // Only digits
                word: word,
                meaning: normalizeMeaning(meaning)
            });
        }
    }
    return records;
}

try {
    const fileContent = fs.readFileSync(INPUT_FILE, 'utf8');
    console.log(`Read ${fileContent.length} bytes.`);

    const formattedData = parseCSV(fileContent);

    console.log(`Parsed ${formattedData.length} records.`);
    if (formattedData.length > 0) {
        console.log("Sample:", JSON.stringify(formattedData[0], null, 2));
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedData, null, 2));
    console.log(`Successfully wrote ${formattedData.length} items to ${OUTPUT_FILE}`);

} catch (err) {
    console.error("Error processing CSV:", err);
}
