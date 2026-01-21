const fs = require('fs');

// Better CSV parsing that handles quoted values
function parseCSVLine(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else if (char !== '\r') {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

// Read vocabulary CSV
const csv = fs.readFileSync('public/教科書単語DB.csv', 'utf-8');
const lines = csv.split('\n').slice(1).filter(l => l.trim());
const words = [];

lines.forEach((line, lineNum) => {
  const parts = parseCSVLine(line);
  if (parts.length >= 6) {
    const [tb, gr, sec, unit, word, ...rest] = parts;
    // Escape backslashes and double quotes for TypeScript string literal
    let meaning = rest.join(', ').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    words.push({
      textbook: tb,
      grade: gr,
      section: parseInt(sec) || 0,
      unit: parseInt(unit) || 0,
      word: word.replace(/"/g, '\\"'),
      meaning: meaning
    });
  }
});

// Read unit mapping CSV
const mappingCsv = fs.readFileSync('public/教科書単元マッピング.csv', 'utf-8');
const mappingLines = mappingCsv.split('\n').slice(1).filter(l => l.trim());
const unitMapping = [];

mappingLines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length >= 5) {
    const [tb, gr, sec, unit, unitName] = parts;
    unitMapping.push({
      textbook: tb,
      grade: gr,
      section: parseInt(sec) || 0,
      unit: parseInt(unit) || 0,
      unitName: unitName.replace(/"/g, '\\"')
    });
  }
});

// TypeScript output
let output = '// 教科書単語データ - 自動生成ファイル\n';
output += '// 生成日: ' + new Date().toISOString().split('T')[0] + '\n\n';
output += 'export type TextbookWord = {\n';
output += '  textbook: string;\n';
output += '  grade: string;\n';
output += '  section: number;\n';
output += '  unit: number;\n';
output += '  word: string;\n';
output += '  meaning: string;\n';
output += '};\n\n';
output += 'export type UnitMapping = {\n';
output += '  textbook: string;\n';
output += '  grade: string;\n';
output += '  section: number;\n';
output += '  unit: number;\n';
output += '  unitName: string;\n';
output += '};\n\n';
output += 'export const textbookVocabulary: TextbookWord[] = [\n';

words.forEach((w, i) => {
  output += '  { textbook: "' + w.textbook + '", grade: "' + w.grade + '", section: ' + w.section + ', unit: ' + w.unit + ', word: "' + w.word + '", meaning: "' + w.meaning + '" }' + (i < words.length - 1 ? ',' : '') + '\n';
});

output += '];\n\n';
output += '// 単元マッピングデータ\n';
output += 'export const unitMappingData: UnitMapping[] = [\n';

unitMapping.forEach((u, i) => {
  output += '  { textbook: "' + u.textbook + '", grade: "' + u.grade + '", section: ' + u.section + ', unit: ' + u.unit + ', unitName: "' + u.unitName + '" }' + (i < unitMapping.length - 1 ? ',' : '') + '\n';
});

output += '];\n\n';
output += '// 教科書リスト\n';
output += 'export const TEXTBOOK_LIST = [\n';
output += '  { id: \'newcrown-1\', name: \'New Crown\', grade: \'中1\', label: \'New Crown 中1\' },\n';
output += '  { id: \'newcrown-2\', name: \'New Crown\', grade: \'中2\', label: \'New Crown 中2\' },\n';
output += '  { id: \'newcrown-3\', name: \'New Crown\', grade: \'中3\', label: \'New Crown 中3\' },\n';
output += '  { id: \'newhorizon-1\', name: \'New Horizon\', grade: \'中1\', label: \'New Horizon 中1\' },\n';
output += '  { id: \'newhorizon-2\', name: \'New Horizon\', grade: \'中2\', label: \'New Horizon 中2\' },\n';
output += '  { id: \'newhorizon-3\', name: \'New Horizon\', grade: \'中3\', label: \'New Horizon 中3\' },\n';
output += '];\n\n';
output += '// 単元取得utility\n';
output += 'export function getUnitsForTextbook(textbook: string, grade: string): { section: number; unit: number; label: string; wordCount: number }[] {\n';
output += '  const filtered = textbookVocabulary.filter(w => w.textbook === textbook && w.grade === grade);\n';
output += '  const uniqueUnits = new Map<string, { section: number; unit: number; count: number }>();\n';
output += '  \n';
output += '  filtered.forEach(w => {\n';
output += '    const key = `${w.section}-${w.unit}`;\n';
output += '    if (!uniqueUnits.has(key)) {\n';
output += '      uniqueUnits.set(key, { section: w.section, unit: w.unit, count: 1 });\n';
output += '    } else {\n';
output += '      uniqueUnits.get(key)!.count++;\n';
output += '    }\n';
output += '  });\n';
output += '  \n';
output += '  return Array.from(uniqueUnits.values())\n';
output += '    .sort((a, b) => a.section - b.section || a.unit - b.unit)\n';
output += '    .map(u => {\n';
output += '      const mapping = unitMappingData.find(\n';
output += '        m => m.textbook === textbook && m.grade === grade && m.section === u.section && m.unit === u.unit\n';
output += '      );\n';
output += '      const label = mapping \n';
output += '        ? `Lesson ${u.section} - ${mapping.unitName}`\n';
output += '        : `Lesson ${u.section} - Part${u.unit}`;\n';
output += '      return {\n';
output += '        section: u.section,\n';
output += '        unit: u.unit,\n';
output += '        label: label,\n';
output += '        wordCount: u.count\n';
output += '      };\n';
output += '    });\n';
output += '}\n\n';
output += '// 単語取得utility\n';
output += 'export function getWordsForUnit(textbook: string, grade: string, section: number, unit: number): TextbookWord[] {\n';
output += '  return textbookVocabulary.filter(\n';
output += '    w => w.textbook === textbook && w.grade === grade && w.section === section && w.unit === unit\n';
output += '  );\n';
output += '}\n\n';
output += '// 教科書全体の単語取得\n';
output += 'export function getWordsForTextbook(textbook: string, grade: string): TextbookWord[] {\n';
output += '  return textbookVocabulary.filter(w => w.textbook === textbook && w.grade === grade);\n';
output += '}\n';

fs.mkdirSync('lib/data', { recursive: true });
fs.writeFileSync('lib/data/textbook-vocabulary.ts', output, 'utf-8');
console.log('Created lib/data/textbook-vocabulary.ts with', words.length, 'words and', unitMapping.length, 'unit mappings');
