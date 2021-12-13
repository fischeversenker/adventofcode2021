import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const lines = readLines(filename);

let horiz = 0;
let depth = 0;
let aim = 0;
for (let line of lines) {
  const [operation, amount] = line.split(' ');
  if (operation === 'forward') {
    horiz += Number(amount);
    depth += aim * Number(amount);
  }
  if (operation === 'down') {
    aim += Number(amount);
  }
  if (operation === 'up') {
    aim -= Number(amount);
  }
}

console.log(horiz * depth);
