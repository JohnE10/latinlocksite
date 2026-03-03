// scripts/prepend-path.mjs
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { sync } from 'glob';

// Function to prepend or fix file path comment
async function prependOrFixFilePathComment(targetDir = '.') {
  try {
    const normalizedTargetDir = targetDir.replace(/\\/g, '/');

    // Get all JS/TS files recursively, ignoring node_modules
    const files = sync('**/*.{js,jsx,ts,tsx,mjs}', {
      ignore: ['node_modules/**'],
      cwd: join(process.cwd(), normalizedTargetDir),
      nodir: true,
    });

    for (const file of files) {
      const filePath = join(process.cwd(), normalizedTargetDir, file);
      const normalizedFilePath = join(normalizedTargetDir, file).replace(/\\/g, '/');

      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');

      const firstLine = lines[0].trim();
      const ext = extname(file).toLowerCase();
      const isJsOrTs = ['.js', '.jsx', '.ts', '.tsx', '.mjs'].includes(ext);

      if (!isJsOrTs) continue;

      // Construct the expected file path comment
      const expectedComment = `// ${normalizedFilePath}`;

      // Regex to match a possible file path comment
      const fileCommentRegex = /^\/\/\s*(File:\s*)?.*$/;

      if (firstLine.match(fileCommentRegex)) {
        if (firstLine === expectedComment) {
          console.log(`Correct comment, skipping: ${normalizedFilePath}`);
          continue; // Correct comment, nothing to do
        } else {
          // Replace incorrect comment with the correct file path
          lines[0] = expectedComment;
          await fs.writeFile(filePath, lines.join('\n'), 'utf8');
          console.log(`Updated comment: ${normalizedFilePath}`);
        }
      } else {
        // Prepend the comment since first line is not a comment
        const newContent = expectedComment + '\n' + content;
        await fs.writeFile(filePath, newContent, 'utf8');
        console.log(`Prepended comment: ${normalizedFilePath}`);
      }
    }

    console.log(`All files in ${normalizedTargetDir || 'project'} processed successfully.`);
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the script with optional directory argument
const targetDir = process.argv[2] || '.';
prependOrFixFilePathComment(targetDir);