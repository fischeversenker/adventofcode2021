import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).map(line => line.trim()).filter(line => line.length> 0);

interface Vector {
  x: number;
  y: number;
}

interface Cell {
  isLowPoint: boolean;
  pos: Vector;
  height: number;
}

function heightMapToCells(lines: number[][]): Cell[] {
  const cells: Cell[] = [];
  lines.forEach((line, y) => {
    line.forEach((height, x) => {
      const cell: Cell = {
        pos: { x, y },
        height,
        isLowPoint: isLowPoint({ x, y }, height, lines)
      };
      cells.push(cell);
    });
  });
  return cells;
}

function isLowPoint(pos: Vector, height: number, heightMap: number[][]): boolean {
  const mapWidth = heightMap[0].length;
  const mapHeight = heightMap.length;
  let isHigherThanNeighbor = false;
  if (pos.x >= 1) {
    isHigherThanNeighbor = height >= getHeightAt({ x: pos.x-1, y: pos.y }, heightMap);
  }
  if (!isHigherThanNeighbor && pos.x < mapWidth - 1) {
    isHigherThanNeighbor = height >= getHeightAt({ x: pos.x+1, y: pos.y }, heightMap);
  }
  if (!isHigherThanNeighbor && pos.y >= 1) {
    isHigherThanNeighbor = height >= getHeightAt({ x: pos.x, y: pos.y-1 }, heightMap);
  }
  if (!isHigherThanNeighbor && pos.y < mapHeight - 1) {
    isHigherThanNeighbor = height >= getHeightAt({ x: pos.x, y: pos.y+1 }, heightMap);
  }
  return !isHigherThanNeighbor;
}

function getHeightAt(pos: Vector, heightMap: number[][]): number {
  return heightMap[pos.y][pos.x];
}

// part one

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');
  const rawHeightMap = rawLines.map(line => line.split('').map(Number));
  const cells = heightMapToCells(rawHeightMap);
  const lowPoints = cells.filter(cell => cell.isLowPoint);
  console.log(`number of low points: ${lowPoints.length}, ${lowPoints.map(p => p.height).join()}`);
  const result = lowPoints.map(lowPoint => lowPoint.height + 1).reduce((acc, lowPoint) => acc + lowPoint, 0);
  console.log(result);
  console.timeEnd('Timer for part one');
}

partOne();
