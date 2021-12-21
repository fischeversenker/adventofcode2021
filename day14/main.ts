import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length > 0);

function getInput(lines: string[]) {
  const template = lines[0];
  const insertions = lines.slice(1).map(line => line.split('->').map(part => part.trim())).reduce((acc, insertion) => {
    return {
      ...acc,
      [insertion[0]]: insertion[1]
    }
  }, {});
  return { template, insertions };
}

function step(polymer: string, insertions: any): string {
  const parts: string[] = [];
  for (let i = 0; i < polymer.length - 1; i++) {
    parts.push(polymer[i] + polymer[i + 1]);
  }
  parts.forEach((part, i) => {
    const insertion = insertions[part];
    let newPart = parts[i][0] + insertion;
    if (i === parts.length - 1) {
      newPart += parts[i][1];
    }
    parts[i] = newPart;
  });
  return parts.join('');
}

function findMostCommonElements(polymer: string): [number, number] {
  const counts: { [key: string]: number } = {};
  for (const char of polymer.split('')) {
    counts[char] ??= 0;
    counts[char]++;
  }
  const inOrder = Object.entries(counts).sort(([keyA, countA], [keyB, countB]) => countB - countA);
  return [inOrder[0][1], inOrder[inOrder.length - 1][1]];
}

// part one

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');
  const { template, insertions } = getInput(rawLines);
  let newPolymer = template;
  for (let i = 0; i < 10; i++) {
    newPolymer = step(newPolymer, insertions);
  }
  const mostCommonElements = findMostCommonElements(newPolymer);
  console.log(mostCommonElements[0] - mostCommonElements[1]);
  console.timeEnd('Timer for part one');
}

partOne();

// part two

function step2(polymer: string, insertions: { [key: string]: number }): string {
  const initialLength = polymer.length;
  const parts: string[] = [];

  for (let i = 0; i < initialLength - 1; i++) {
    const lastTwo = polymer[i] + polymer[i + 1];
    const insertion = insertions[lastTwo];
    parts.push(polymer[i] + insertion);
  }

  return parts.join('') + polymer[initialLength - 1];
}

// this runs out of memory... I give up
function partTwo(): void {
  console.log('part two');
  console.time('Timer for part two');
  const { template, insertions } = getInput(rawLines);
  let newPolymer = template;
  for (let i = 0; i < 40; i++) {
    newPolymer = step2(newPolymer, insertions);
  }
  const mostCommonElements = findMostCommonElements(newPolymer);
  console.log(mostCommonElements[0] - mostCommonElements[1]);
  console.timeEnd('Timer for part two');
}

partTwo();
