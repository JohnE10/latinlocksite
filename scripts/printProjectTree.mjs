// scripts/printProjectTree.js
import fs from 'fs';
import path from 'path';

// Recursive function to list files
function listDir(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  const lastIndex = files.length - 1;

  files.forEach((file, index) => {
    if (file === 'node_modules' || file === '.next' || file === '.git') return; // skip these

    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    const connector = index === lastIndex ? '└── ' : '├── ';
    const nextPrefix = index === lastIndex ? prefix + '    ' : prefix + '│   ';

    console.log(prefix + connector + file);

    if (stats.isDirectory()) {
      listDir(fullPath, nextPrefix);
    }
  });
}

// Get folder from command-line argument, default to current project
const folderArg = process.argv[2] || '.';
const folderPath = path.resolve(process.cwd(), folderArg);

console.log(folderPath + '/');
listDir(folderPath);
