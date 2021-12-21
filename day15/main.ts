import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length > 0);

function readMap(lines: string[]): number[][] {
  return lines.map(line => line.split('').map(Number));
}

// part one

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');

  const map = readMap(rawLines);
  console.log(map);

  console.timeEnd('Timer for part one');
}

partOne();

// part two

function partTwo(): void {
  console.log('part two');
  console.time('Timer for part two');

  console.timeEnd('Timer for part two');
}

// partTwo();
