import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length> 0);

// part one

function findMedian(numbers: number[]): number {
  numbers = [...numbers].sort((a, b) => a - b);
  if (numbers.length % 2 === 0) {
    const leftOfMiddle = numbers[(numbers.length / 2) - 1];
    const rightOfMiddle = numbers[numbers.length / 2];
    return (leftOfMiddle + rightOfMiddle) / 2;
  }
  return numbers[(numbers.length - 1) / 2] / 2;
}

function partOne() {
  console.log('part one');
  console.time('Timer for part one');
  const crabPositions = rawLines[0].split(',').map(Number);
  const median = findMedian(crabPositions);
  const fuelCosts = crabPositions.reduce((acc, pos) => acc + Math.abs(median - pos), 0);
  console.log(fuelCosts);
  console.timeEnd('Timer for part one');
}

partOne();

// part two

function findMean(numbers: number[]): number {
  return Math.ceil(numbers.reduce((acc, pos) => acc + (pos / numbers.length), 0));
}

function calcFuelForDistance(distance: number, fuelSoFar = 0): number {
  if (distance <= 0) {
    return fuelSoFar;
  }
  return calcFuelForDistance(distance - 1, fuelSoFar + distance);
}

function calcCollectiveLowestFuelToDestination(numbers: number[], dest: number): number {
  const fuelAmounts: Record<number, number> = {};
  // look at either side of dest to avoid an off-by-1 error
  for (let i = dest - 1; i < dest + 1; i++) {
    fuelAmounts[i] = numbers.reduce((acc, pos) => acc + calcFuelForDistance(Math.abs(i - pos)), 0);
  }
  return Math.min(...Object.values(fuelAmounts));
}

function partTwo() {
  console.log('part two');
  console.time('Timer for part two');
  const crabPositions = rawLines[0].split(',').map(Number);
  const mean = findMean(crabPositions);
  const fuelConsumption = calcCollectiveLowestFuelToDestination(crabPositions, mean);
  console.log(fuelConsumption);
  console.timeEnd('Timer for part two');
}

partTwo();
