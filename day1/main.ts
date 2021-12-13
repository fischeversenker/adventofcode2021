import { readLines } from '../utils/file.ts';
import { countUps } from './utils.ts';

const filename = Deno.args[0];
const lines = readLines(filename).map(line => Number(line));

console.log(countUps(lines));
