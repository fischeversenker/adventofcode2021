import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length > 0);

interface Cave {
  type: 'big' | 'small';
  outs: string[];
  name: string;
}

type Path = Cave[];

interface Connection {
  from: string;
  to: string;
}

// part one

function getCaves(connections: Connection[]): Map<string, Cave> {
  const caveMap: Map<string, Cave> = new Map();
  connections.forEach(connection => {
    if (!caveMap.has(connection.from)) {
      caveMap.set(connection.from, {
        type: connection.from.toUpperCase() !== connection.from ? 'small' : 'big',
        outs: [],
        name: connection.from
      });
    }
    if (!caveMap.has(connection.to)) {
      caveMap.set(connection.to, {
        type: connection.to.toUpperCase() !== connection.to ? 'small' : 'big',
        outs: [],
        name: connection.to
      });
    }
  });
  connections.forEach(connection => {
    const caveSoFar = caveMap.get(connection.from)!;
    caveMap.set(connection.from, {
      ...caveSoFar,
      outs: [
        ...caveSoFar.outs,
        connection.to
      ]
    });
  });
  console.log(caveMap);
  return caveMap;
}

function getPaths(caveMap: Map<string, Cave>, start = 'start', currentPath: Path = []): Path[] {
  const startCave = caveMap.get(start)!;
  if (start === 'end' || startCave.outs.length === 0) {
    return [];
  }
  const paths = startCave.outs.map(out => {
    console.log(caveMap.get(out));
    return getPaths(caveMap, out, [...currentPath, caveMap.get(out)!]);
  });
  console.log(paths);
  return [];
}

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');
  const connections: Connection[] = rawLines.map(line => {
    const [from, to] = line.split('-');
    return { from, to };
  });
  const caveMap = getCaves(connections);
  const paths = getPaths(caveMap);

  console.timeEnd('Timer for part one');
}

partOne();

// part two

function partTwo(): void {
  // TBD
}

partTwo();
