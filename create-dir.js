const fs = require('fs');
const path = require('path');

const dirPath = path.join('c:', 'Users', 'kt', 'edulens', 'edulens', 'app', 'countdown', 'qualification', '[slug]', '[session]');
fs.mkdirSync(dirPath, { recursive: true });
console.log('Directory created successfully');
