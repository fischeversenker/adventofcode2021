import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const lines = readLines(filename);

const diagnosticReport: number[][] = lines.map(line => {
  return line.split('').map(char => Number(char));
}).filter(line => line.length > 0);


// part one
console.log('part one');
const [mostCommonBits, leastCommonBits] = getMostAndLeastCommonBits(diagnosticReport);
const gammaRateDecimal = turnIntoDecimal(mostCommonBits);
const epsilonRateDecimal = turnIntoDecimal(leastCommonBits)

console.log(gammaRateDecimal * epsilonRateDecimal);

// part two
console.log('\npart two');

const ogRating = filter(diagnosticReport, (rowsLeft: number[][], row: number[], column: number) => {
  const [mcb] = getMostAndLeastCommonBits(rowsLeft);
  const columnFilter = mcb[column];
  return row[column] === columnFilter;
});

const co2sRating = filter(diagnosticReport, (rowsLeft: number[][], row: number[], column: number) => {
  const [_, lcb] = getMostAndLeastCommonBits(rowsLeft);
  const columnFilter = lcb[column];
  return row[column] === columnFilter;
});

console.log(turnIntoDecimal(ogRating) * turnIntoDecimal(co2sRating));

// helpers
function getMostAndLeastCommonBits(bits: number[][]) {
  const length = bits.length;

  const arr: number[] = [];
  bits.forEach(bitLine => {
    bitLine.forEach((bit, x) => {
      arr[x] ??= 0;
      arr[x] += bit;
    });
  });
  const mostCommonBits = arr.map(colCount => colCount >= (length - colCount) ? 1 : 0);
  const leastCommonBits = mostCommonBits.map(bit => bit === 0 ? 1 : 0);
  return [mostCommonBits, leastCommonBits];
}

function filter(rows: number[][], filterCallback: any) {
  let rowsLeft = [...rows];
  let x = 0;
  while (x < rowsLeft[0]?.length && rowsLeft.length > 1) {
    rowsLeft = rowsLeft.filter(row => filterCallback(rowsLeft, row, x));
    x++;
  }
  return rowsLeft[0];
}

function turnIntoDecimal(bits: number[]): number {
  return parseInt(bits.join(''), 2);
}
