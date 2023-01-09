import { minify } from 'html-minifier';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { toFile } from 'qrcode';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const input = readFileSync(resolve(__dirname, '../index.html'), { encoding: 'utf-8' });

const minified = minify(input, {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: {
    mangle: {
      toplevel: true
    }
  }
});

const outDir = resolve(__dirname, '../output');

execSync(`mkdir -p ${outDir}`);
writeFileSync(join(outDir, 'index.min.html'), minified);

const b64 = Buffer.from(minified).toString('base64');
const toEncode = `data:text/html;base64,${b64}`;

console.log('Minified size is', minified.length, 'bytes');
console.log('Output size is', toEncode.length, 'bytes');

writeFileSync(join(outDir, 'b64.txt'), toEncode);
toFile(join(outDir, 'image.png'), toEncode);