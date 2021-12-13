import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length> 0);

const fish = rawLines[0].split(',').map(Number);

// part one
console.log('part one');

// function* fishGenerator(fish: number[]): number[] {
//   yield fish;
// }

function calcNextDay(fish: number[]): number[] {
  const newFishCount = fish.filter(days => days === 0).length
  let nextDay = fish.map(days => (days - 1) < 0 ? 6 : days - 1);
  const newFish = Array.from(Array(newFishCount)).map(_ => 8);
  nextDay = nextDay.concat(newFish);
  return nextDay;
}

function partOne() {
  let myFish = [...fish];
  for (let i = 0; i < 80; i++) {
    myFish = calcNextDay(myFish);
  }
  return myFish;
}

console.log(partOne().length);

// part two
console.log('part two');

const fishMap = fish.reduce((acc, nr) => {
  if (!acc.has(nr)) {
    acc.set(nr, 0);
  }
  acc.set(nr, acc.get(nr)! + 1);
  return acc;
}, new Map<number, number>());

function* fishLife() {
  let lastDay = new Map(fishMap);

  for (;;) {
    const nextDay = new Map<number, number>();
    lastDay.forEach((count, daysLeft) => {
      if (daysLeft === 0) {
        nextDay.set(8, (nextDay.get(8) ?? 0) + count);
        nextDay.set(6, (nextDay.get(6) ?? 0) + count);
      } else {
        nextDay.set(daysLeft - 1, (nextDay.get(daysLeft - 1) ?? 0) + count);
      }
    });
    lastDay = nextDay;
    yield nextDay;
  }
}

const iterator = fishLife();
let day: Map<number, number> = new Map();
for (let i = 0; i < 256; i++) {
  day = iterator.next().value!;
}

console.log([...day.values()].reduce((acc, dayCount) => acc + dayCount, 0));
