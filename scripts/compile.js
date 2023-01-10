import { minify } from 'html-minifier';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { toFile } from 'qrcode';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const kb = (bytes) => (bytes / 1024).toFixed(2);

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const input = readFileSync(resolve(__dirname, '../index.html'), { encoding: 'utf-8' });

console.log('Original size is', kb(input.length), 'KB', `(${input.length} bytes)`);

const minified = minify(input, {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: {
    mangle: {
      toplevel: true
    }
  }
});

console.log('Minified size is', kb(minified.length), 'KB', `(${minified.length} bytes)`);

const outDir = resolve(__dirname, '../output');

execSync(`mkdir -p ${outDir}`);
writeFileSync(join(outDir, 'index.min.html'), minified);

const b64 = Buffer.from(minified).toString('base64');
const output = `data:text/html;base64,${b64}`;

console.log('b64 size is', kb(output.length), 'KB', `(${output.length} bytes)`);

writeFileSync(join(outDir, 'b64.txt'), output);
toFile(join(outDir, 'image.png'), output);

console.log('Done!');