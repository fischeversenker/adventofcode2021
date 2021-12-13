import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length > 0);

interface Cave {
  type: 'big' | 'small';
  outs: Set<string>;
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
  // add all connections to map
  connections.forEach(connection => {
    if (!caveMap.has(connection.from)) {
      caveMap.set(connection.from, {
        type: connection.from.toUpperCase() !== connection.from ? 'small' : 'big',
        outs: new Set([connection.to]),
        name: connection.from
      });
    }
    if (!caveMap.has(connection.to)) {
      caveMap.set(connection.to, {
        type: connection.to.toUpperCase() !== connection.to ? 'small' : 'big',
        outs: new Set([connection.from]),
        name: connection.to
      });
    }
  });
  // add
  connections.forEach(connection => {
    const caveSoFar = caveMap.get(connection.from)!;
    caveMap.set(connection.from, {
      ...caveSoFar,
      outs: caveSoFar.outs.add(connection.to),
    });
  });
  console.log(caveMap);
  return caveMap;
}

function getPaths(caveMap: Map<string, Cave>, start = 'start', currentPath: Path = []): string[] {
  const startCave = caveMap.get(start)!;
  if (start === 'end' || startCave.outs.size === 0) {
    return [];
  }
  const paths: string[] = [start];
  startCave.outs.forEach(out => {
    const nextCave = caveMap.get(out)!;
    if (currentPath.includes(nextCave) && nextCave.type === 'small') {
      return;
    }
    if (out === 'end') {
      paths.push(out);
      return;
    }
    const nextPaths = getPaths(caveMap, out, [...currentPath, caveMap.get(out)!]);
    paths.push(out, nextPaths[nextPaths.length-1]);
  });
  return paths;
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
  console.log(paths);

  console.timeEnd('Timer for part one');
}

partOne();

// part two

function partTwo(): void {
  // TBD
}

partTwo();
