/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const TEXTBOOK_NAME = "英検準2級 でる順パス単 5訂版";
const inputPath = path.join(process.cwd(), "パス単準２級");
const outputPath = path.join(process.cwd(), "lib", "data", "json", "eiken-pre2-passtan-5th.json");

const lines = fs.readFileSync(inputPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const words = lines.map((line, index) => {
  const tabIndex = line.indexOf("\t");

  if (tabIndex === -1) {
    throw new Error(`Line ${index + 1} does not contain a tab separator: ${line}`);
  }

  const word = line.slice(0, tabIndex).trim();
  const meaning = line.slice(tabIndex + 1).trim().replace(/[;；]/g, " ");

  if (!word || !meaning) {
    throw new Error(`Line ${index + 1} has an empty word or meaning: ${line}`);
  }

  return {
    textbook: TEXTBOOK_NAME,
    grade: "",
    section: 0,
    unit: 0,
    word_number: index + 1,
    word,
    meaning,
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify(words, null, 2)}\n`, "utf8");
console.log(`Created ${outputPath} with ${words.length} words`);
