import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length > 0);

function tick(octopussies: number[][]): [number[][], number] {
  const alreadyFlashed: string[] = [];
  let flashedOctos: string[];
  // count all up by 1
  let nextOctopussies = octopussies.map(row => row.map(level => level+1));

  // flash all
  while (hasLoadedOctos(nextOctopussies, alreadyFlashed)) {
    [nextOctopussies, flashedOctos] = flashOctos(nextOctopussies, alreadyFlashed);
    alreadyFlashed.push(...flashedOctos);
  }

  // set flashed ones to zero
  alreadyFlashed.forEach(flashPos => {
    const [x, y] = flashPos.split('').map(Number);
    nextOctopussies[y][x] = 0;
  })
  return [nextOctopussies, alreadyFlashed.length];
}

function hasLoadedOctos(octopussies: number[][], alreadyFlashed: string[]): boolean {
  return octopussies.some((row, y) => row.some((level, x) => {
    return !alreadyFlashed.includes(`${x}${y}`) && level > 9;
  }));
}

function flashOctos(octos: number[][], alreadyFlashed: string[]): [number[][], string[]] {
  const mapWidth = octos[0].length;
  const mapHeight = octos.length;
  const newlyFlashed: string[] = [];
  const newOctos = [...octos];
  octos.forEach((row, y) => row.forEach((octo, x) => {
    const key = `${x}${y}`;
    if (octo > 9 && !alreadyFlashed.includes(key)) {
      // console.log('found full octo that hasnt flashed', octo, { x, y }, alreadyFlashed);
      newlyFlashed.push(key);
    }
  }));
  newlyFlashed.forEach(flashPos => {
    const [x, y] = flashPos.split('').map(Number);
    // left
    if (x >= 1) {
      newOctos[y][x-1] = newOctos[y][x-1] + 1;
    }
    // right
    if (x < mapWidth - 1) {
      newOctos[y][x+1] = newOctos[y][x+1] + 1;
    }
    // top
    if (y >= 1) {
      newOctos[y-1][x] = newOctos[y-1][x] + 1;
    }
    // bottom
    if (y < mapHeight - 1) {
      newOctos[y+1][x] = newOctos[y+1][x] + 1;
    }
    // top left
    if (x >= 1 && y >= 1) {
      newOctos[y-1][x-1] = newOctos[y-1][x-1] + 1;
    }
    // top right
    if (x < mapWidth - 1 && y >= 1) {
      newOctos[y-1][x+1] = newOctos[y-1][x+1] + 1;
    }
    // bottom left
    if (x >= 1 && y < mapHeight - 1) {
      newOctos[y+1][x-1] = newOctos[y+1][x-1] + 1;
    }
    // bottom right
    if (x < mapWidth - 1 && y < mapHeight - 1) {
      newOctos[y+1][x+1] = newOctos[y+1][x+1] + 1;
    }
  });
  // mark surrounding octos as flashed
  return [newOctos, newlyFlashed];
}

// part one

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');
  let octos = rawLines.map(line => line.split('').map(Number));
  let flashes = 0;
  let totalFlashes = 0;
  for (let i = 0; i < 100; i++) {
    [octos, flashes] = tick(octos);
    totalFlashes += flashes;
  }
  console.log(totalFlashes);
  console.timeEnd('Timer for part one');
}

partOne();

// part two

function partTwo(): void {
  console.log('part two');
  console.time('Timer for part two');
  let octos = rawLines.map(line => line.split('').map(Number));
  const octoCount = octos.length * octos[0].length;
  let stepCount = 0;
  let flashes = 0;
  while (flashes !== octoCount) {
    [octos, flashes] = tick(octos);
    stepCount++;
  }
  console.log(stepCount);
  console.timeEnd('Timer for part two');
}

partTwo();
