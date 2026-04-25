import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const INPUT_FILE = path.join(repoRoot, "新規 テキスト ドキュメント (3).txt");
const OUTPUT_FILE = path.join(repoRoot, "lib", "data", "json", "eiken-pre1-ex.json");
const REPORT_FILE = path.join(repoRoot, ".agent", "eiken-pre1-ex-cleaning-report.json");
const MODEL = "gemini-3.1-pro-preview";
const TEXTBOOK_NAME = "英検準1級単熟語EX";
const BATCH_SIZE = 180;

function loadEnvValue(key) {
  const envPath = path.join(repoRoot, ".env");
  const envText = fs.readFileSync(envPath, "utf8");
  const line = envText.split(/\r?\n/).find((row) => row.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).trim() : "";
}

function parseRawRecords(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const records = [];
  const anomalies = [];

  for (let i = 0; i < lines.length; ) {
    if (!/^\d+$/.test(lines[i])) {
      anomalies.push({ type: "unexpected_line", index: i, line: lines[i] });
      i += 1;
      continue;
    }

    const wordNumber = Number(lines[i]);
    const word = lines[i + 1] ?? "";
    const meaning = lines[i + 2] ?? "";
    const tail = lines.slice(i + 3, i + 7);

    if (!word || !meaning) {
      anomalies.push({ type: "short_record", wordNumber, chunk: lines.slice(i, i + 7) });
      i += 1;
      continue;
    }

    records.push({
      textbook: TEXTBOOK_NAME,
      grade: "",
      section: 0,
      unit: 0,
      word_number: wordNumber,
      word,
      meaning,
      raw_tail: tail,
    });

    i += 7;
  }

  return { records, anomalies };
}

function stripCodeFence(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function normalizeMeaningText(meaning) {
  return String(meaning)
    .replace(/[；;]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/，/g, "、")
    .replace(/．/g, "。")
    .trim();
}

async function cleanBatch(apiKey, batch, batchIndex, batchCount) {
  const prompt = [
    "You are cleaning Japanese vocabulary meanings for a learning app.",
    "Return JSON only.",
    "Input is an array of records with word_number, word, meaning.",
    "For each record, preserve word_number and word exactly.",
    "Rewrite only the meaning field into clean Japanese suitable for a vocabulary app.",
    "Rules:",
    "- Keep the original meaning faithful and concise.",
    "- Remove UI noise if any.",
    "- Normalize whitespace and punctuation.",
    "- Replace semicolons with spaces or Japanese punctuation.",
    "- If there are numbered senses like ①②③, keep them but make spacing clean.",
    "- If the source has an obvious scrape typo and you are highly confident, fix the meaning text only.",
    "- Do not invent new senses.",
    "- Output the same number of items in the same order.",
    "",
    `Batch ${batchIndex + 1}/${batchCount}`,
    JSON.stringify(
      batch.map(({ word_number, word, meaning }) => ({ word_number, word, meaning })),
      null,
      2,
    ),
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`Gemini returned no text for batch ${batchIndex + 1}`);
  }

  const parsed = JSON.parse(stripCodeFence(text));
  if (!Array.isArray(parsed) || parsed.length !== batch.length) {
    throw new Error(`Unexpected batch length for batch ${batchIndex + 1}`);
  }

  return parsed.map((item, index) => ({
    ...batch[index],
    meaning: normalizeMeaningText(item.meaning ?? batch[index].meaning),
  }));
}

function findDuplicates(records) {
  const map = new Map();
  for (const record of records) {
    const key = record.word.toLowerCase();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({
      word_number: record.word_number,
      meaning: record.meaning,
    });
  }
  return [...map.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([word, items]) => ({ word, items }));
}

async function main() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || loadEnvValue("GOOGLE_GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY was not found.");
  }

  const rawText = fs.readFileSync(INPUT_FILE, "utf8");
  const { records: parsedRecords, anomalies } = parseRawRecords(rawText);
  const batches = [];
  for (let i = 0; i < parsedRecords.length; i += BATCH_SIZE) {
    batches.push(parsedRecords.slice(i, i + BATCH_SIZE));
  }

  const cleanedRecords = [];
  for (let i = 0; i < batches.length; i += 1) {
    const cleaned = await cleanBatch(apiKey, batches[i], i, batches.length);
    cleanedRecords.push(...cleaned);
    console.log(`Cleaned batch ${i + 1}/${batches.length}`);
  }

  const outputRecords = cleanedRecords.map(({ raw_tail, ...record }) => record);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputRecords, null, 2) + "\n", "utf8");

  const report = {
    textbook: TEXTBOOK_NAME,
    model: MODEL,
    inputFile: path.relative(repoRoot, INPUT_FILE),
    outputFile: path.relative(repoRoot, OUTPUT_FILE),
    totalRecords: outputRecords.length,
    anomalies,
    duplicates: findDuplicates(outputRecords),
    sample: outputRecords.slice(0, 5),
  };
  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`Wrote ${outputRecords.length} cleaned records to ${OUTPUT_FILE}`);
  console.log(`Wrote report to ${REPORT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
