const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');
let content = fs.readFileSync(jsonPath, 'utf8');

// Use a regex to replace "unit": "連立不等式の解法" with "unit": "連立不等式の解法（1次）"
// but only if it matches exactly to avoid partial matches (though unlikely here)
const updatedContent = content.replace(/"unit": "連立不等式の解法"/g, '"unit": "連立不等式の解法（1次）"');

fs.writeFileSync(jsonPath, updatedContent, 'utf8');
console.log('Successfully updated unit titles.');
