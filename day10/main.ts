import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length> 0);

const openingBrackets = ['<', '(', '{', '['];
const closingBrackets = ['>', ')', '}', ']'];

function doBracketsMatch(openingBracket: string, closingBracket: string): boolean {
  return openingBrackets.indexOf(openingBracket) === closingBrackets.indexOf(closingBracket);
}

function getBracketScore1(bracket: string): number {
  if (bracket === ')') {
    return 3;
  }
  if (bracket === ']') {
    return 57;
  }
  if (bracket === '}') {
    return 1197;
  }
  if (bracket === '>') {
    return 25137;
  }
  return -1;
}

function findClosingBracket(bracket: string): string {
  if (bracket === '(') {
    return ')';
  }
  if (bracket === '[') {
    return ']';
  }
  if (bracket === '{') {
    return '}';
  }
  if (bracket === '<') {
    return '>';
  }
  throw new Error('bracket not found');
}

function isLineCorrupt(line: string): string | null {
  const openChunks: string[] = [];
  let corruptChar: string | null = null;
  let i = 0;
  while (!corruptChar && i < line.length) {
    if (openingBrackets.includes(line[i])) {
      openChunks.push(line[i]);
    } else {
      const openingBracket = openChunks.pop()!;
      if (!doBracketsMatch(openingBracket, line[i])) {
        corruptChar = line[i];
      }
    }
    i++;
  }
  return corruptChar;
}

// part one

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');
  const corruptLines = rawLines.map(isLineCorrupt).filter(Boolean);
  const result = corruptLines.reduce((acc, corruptBracket) => acc + getBracketScore1(corruptBracket!), 0);
  console.log(result);
  console.timeEnd('Timer for part one');
}

// partOne();

// part two

function closeOpenChunks(line: string): string[] {
  const openChunks: string[] = [];
  const closingBrackets: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (openingBrackets.includes(line[i])) {
      openChunks.push(line[i]);
    } else if (doBracketsMatch(openChunks[openChunks.length - 1], line[i])) {
      openChunks.pop()
    }
    i++;
  }
  for (let bracket of openChunks) {
    closingBrackets.push(findClosingBracket(bracket))
  }
  return closingBrackets.reverse();
}

function getBracketScore2(bracket: string): number {
  if (bracket === ')') {
    return 1;
  }
  if (bracket === ']') {
    return 2;
  }
  if (bracket === '}') {
    return 3;
  }
  if (bracket === '>') {
    return 4;
  }
  throw new Error('unknown bracket');
}

function getPartTwoScore(brackets: string[]): number {
  return brackets.reduce((acc, bracket) => {
    return (acc * 5) + getBracketScore2(bracket);
  }, 0);
}

function partTwo(): void {
  console.log('part two');
  console.time('Timer for part two');
  const incompleteLines = rawLines.filter(line => !isLineCorrupt(line));
  const scores = incompleteLines.map(line => {
    const closingBrackets = closeOpenChunks(line);
    return getPartTwoScore(closingBrackets);
  });
  const result = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
  console.log(result);
  console.timeEnd('Timer for part two');
}

partTwo();
