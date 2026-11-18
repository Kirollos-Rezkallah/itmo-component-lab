import { readFile } from 'node:fs/promises';
import { analyze } from './analyze.mjs';

const isu = (await readFile(new URL('./student-id.txt', import.meta.url), 'utf8')).trim();
if (!/^\d{6}$/.test(isu) || isu === '000000') {
  throw new Error('Set your real six-digit ISU number in student-id.txt before building.');
}
const { files, directories, size } = await analyze('/data');
console.log(`${isu}-${files}-${directories}-${size}`);
