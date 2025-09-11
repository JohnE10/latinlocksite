// prepend-path.js
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { sync } from 'glob';

// Function to prepend file path as a comment
async function prependFilePathComment(targetDir = '.') {
  try {
    // Ensure targetDir is relative to cwd and uses forward slashes
    const normalizedTargetDir = targetDir.replace(/\\/g, '/');

    // Get all files in the specified directory, excluding node_modules
    const files = sync('**/*.{js,jsx,ts,tsx,mjs}', {
      ignore: ['node_modules/**'],
      cwd: join(process.cwd(), normalizedTargetDir),
      nodir: true,
    });

    for (const file of files) {
      // Construct full file path and normalized file path for comment
      const filePath = join(process.cwd(), normalizedTargetDir, file);
      const normalizedFilePath = join(normalizedTargetDir, file).replace(/\\/g, '/');

      // Read the file content
      const content = await fs.readFile(filePath, 'utf8');

      // Check if the first line already contains a file path comment
      const firstLine = content.split('\n')[0].trim();
      const ext = extname(file).toLowerCase();
      const isJsOrTs = ['.js', '.jsx', '.ts', '.tsx', '.mjs'].includes(ext);
      const fileCommentRegex = isJsOrTs
        ? /^\/\/\s*(File:\s*)?.*$/ // Matches // <path> or // File: <path>
        : /^\/*\s*(File:\s*)?.*\s*\*\/$/; // Matches /* <path> */ or /* File: <path> */

      if (firstLine.match(fileCommentRegex)) {
        console.log(`Skipped (already has file path comment): ${normalizedFilePath}`);
        continue;
      }

      // Determine the comment style based on file extension
      const comment = isJsOrTs ? `// ${normalizedFilePath}\n` : `/* ${normalizedFilePath} */\n`;

      // Prepend the comment to the file content
      const newContent = comment + content;

      // Write the modified content back to the file
      await fs.writeFile(filePath, newContent, 'utf8');
      console.log(`Updated: ${normalizedFilePath}`);
    }

    console.log(`All files in ${normalizedTargetDir || 'project'} processed successfully.`);
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the script with optional directory argument
const targetDir = process.argv[2] || '.';
prependFilePathComment(targetDir);