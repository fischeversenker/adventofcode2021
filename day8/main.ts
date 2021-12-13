import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length> 0);

// helpers
interface Note {
  input: string[];
  output: string[];
}

const digitSignalCounts: Record<number, number[]> = {
  1: [],
  2: [1],
  3: [7],
  4: [4],
  5: [2, 3, 5],
  6: [0, 6, 9],
  7: [8]
}

function readLine(line: string): Note {
  const [rawInput, rawOutput] = line.split('|').map(part => part.trim());
  const input = rawInput.split(' ').map(i => i.trim());
  const output = rawOutput.split(' ').map(i => i.trim());
  return {
    input,
    output
  };
}

function readRawLines(lines: string[]): Note[] {
  return lines.map(readLine);
}

function isEasyDigit(digit: string): boolean {
  return digitSignalCounts[digit.length].length === 1;
}

// part one

function partOne() {
  console.log('part one');
  console.time('Timer for part one');
  const outputs = readRawLines(rawLines).flatMap(note => note.output);
  const easyDigitCount = outputs.filter(isEasyDigit).length
  console.log(easyDigitCount);
  console.timeEnd('Timer for part one');
}

partOne();

// part two

//  1
// 2 3
//  4
// 5 6
//  7

interface Segment {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
}

function figureOutSegmentChars(line: Note): Record<string, number> {
  const digits = line.input;
  const one = digits.find(digit => digit.length === 2)!;
  const four = digits.find(digit => digit.length === 4)!;
  const seven = digits.find(digit => digit.length === 3)!;
  const eight = digits.find(digit => digit.length === 7)!;
  // const
  const segment = {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
  };

  segment[3] = one[0];
  segment[6] = one[1];

  const segmentOne = seven.split('').find(char => !four.includes(char))!;
  segment[1] = segmentOne;
  // [1] is safe

  const remainingChars = four.split('').filter(char => !one.includes(char));
  segment[2] = remainingChars[0];
  segment[4] = remainingChars[1];

  const zeroSixNine = digits.filter(digit => digit.length === 6);
  const six = zeroSixNine.find(digit => !digit.includes(segment[3]) || !digit.includes(segment[6]))!;
  const zeroNine = zeroSixNine.filter(digit => digit !== six);

  if (six.includes(segment[3])) {
    const temp = segment[6];
    segment[6] = segment[3];
    segment[3] = temp;
  }
  // [3] is safe
  // [6] is safe

  const twoThreeFive = digits.filter(digit => digit.length === 5);
  const two = twoThreeFive.find(digit => !digit.includes(segment[6]))!; // only segment[3]
  const three = twoThreeFive.find(digit => digit.includes(segment[3]) && digit.includes(segment[6]))!; // segment[3] && segment[6]
  const five = twoThreeFive.find(digit => !digit.includes(segment[3]))!; // only segment[6]

  // difference between fixe and six is [5]
  const segmentFive = six.split('').find(char => !five.includes(char))!;
  segment[5] = segmentFive;
  // [5] is safe

  // difference between 3 and 4 is [2]
  const segmentTwo = four.split('').find(char => !three.includes(char))!;
  if (segment[2] !== segmentTwo) {
    const temp = segment[4];
    segment[4] = segment[2];
    segment[2] = temp;
  }
  // [2] is safe
  // [4] is safe

  // remaining unknown from 2 is [7]
  const segmentSeven = two.split('').find(char => ![segment[1], segment[3], segment[4], segment[5]].includes(char))!;
  segment[7] = segmentSeven;
  // [7] is safe

  const zeroCode = (segment[1] + segment[2] + segment[3] + segment[5] + segment[6] + segment[7]).split('').sort().join('');
  const oneCode = (segment[3] + segment[6]).split('').sort().join('');
  const twoCode = (segment[1] + segment[3] + segment[4] + segment[5] + segment[7]).split('').sort().join('');
  const threeCode = (segment[1] + segment[3] + segment[4] + segment[6] + segment[7]).split('').sort().join('');
  const fourCode = (segment[2] + segment[3] + segment[4] + segment[6]).split('').sort().join('');
  const fiveCode = (segment[1] + segment[2] + segment[4] + segment[6] + segment[7]).split('').sort().join('');
  const sixCode = (segment[1] + segment[2] + segment[4] + segment[5] + segment[6] + segment[7]).split('').sort().join('');
  const sevenCode = (segment[1] + segment[3] + segment[6]).split('').sort().join('');
  const eightCode = (segment[1] + segment[2] + segment[3] + segment[4] + segment[5] + segment[6] + segment[7]).split('').sort().join('');
  const nineCode = (segment[1] + segment[2] + segment[3] + segment[4] + segment[6] + segment[7]).split('').sort().join('');

  return {
    [zeroCode]: 0,
    [oneCode]: 1,
    [twoCode]: 2,
    [threeCode]: 3,
    [fourCode]: 4,
    [fiveCode]: 5,
    [sixCode]: 6,
    [sevenCode]: 7,
    [eightCode]: 8,
    [nineCode]: 9,
  };
}

function decodeOutput(output: string[], segmentCode: Record<string, number>): number {
  const numbers = output.map(digit => {
    const sortedDigit = digit.split('').sort().join('');
    return segmentCode[sortedDigit];
  });
  return Number(numbers.map(String).join(''));
}

function partTwo() {
  console.log('part two');
  console.time('Timer for part two');
  const notes = readRawLines(rawLines);
  const decodedOutputs = notes.map(note => {
    const segmentCode = figureOutSegmentChars(note);
    const number = decodeOutput(note.output, segmentCode);
    console.log(note.output, number);
    return number;
  });
  const sum = decodedOutputs.reduce((acc, sum) => acc + sum, 0);
  console.log(sum);
  // TBD
  console.timeEnd('Timer for part two');
}

partTwo();
