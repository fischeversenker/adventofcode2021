import { readLines } from '../utils/file.ts';
import { countUps } from './utils.ts';

const filename = Deno.args[0];
const lines = readLines(filename).map(line => Number(line));
const lineSums = [];

for (let i = 0; i < lines.length - 2; i++) {
  const firstNumber = Number(lines[i]);
  const secondNumber = Number(lines[i+1]);
  const thirdNumber = Number(lines[i+2]);
  lineSums.push(firstNumber + secondNumber + thirdNumber);
}

console.log(countUps(lineSums));
