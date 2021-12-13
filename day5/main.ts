import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename);

interface Vector {
  x: number;
  y: number;
}

interface Line {
  start: Vector;
  end: Vector;
}

function getLines(rawLines: string[]): Line[] {
  const lines: Line[] = [];
  rawLines.filter(rawLine => rawLine.length > 0).forEach(rawLine => {
    const [rawFrom, rawTo] = rawLine.split(' -> ');
    const [fromX, fromY] = rawFrom.split(',').map(Number);
    const [toX, toY] = rawTo.split(',').map(Number);
    lines.push({
      start: { x: fromX, y: fromY },
      end: { x: toX, y: toY }
    });
  });
  return lines;
}

function getLinePoints1(line: Line): Vector[] {
  const points: Vector[] = [];
  if (line.start.x === line.end.x) {
    const startY = Math.min(line.start.y, line.end.y);
    const endY = Math.max(line.start.y, line.end.y);
    for (let y = startY; y <= endY; y++) {
      points.push({ x: line.start.x, y });
    }
  }
  if (line.start.y === line.end.y) {
    const startX = Math.min(line.start.x, line.end.x);
    const endX = Math.max(line.start.x, line.end.x);
    for (let x = startX; x <= endX; x++) {
      points.push({ x, y: line.start.y });
    }
  }
  return points;
}

function getLinePoints2(line: Line): Vector[] {
  const points: Vector[] = [];
  const startX = line.start.x;
  const startY = line.start.y;
  const endX = line.end.x;
  const endY = line.end.y;
  const length = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
  const xUp = Math.sign(endX - startX);
  const yUp = Math.sign(endY - startY);
  // console.log('line', { line, length, });
  for (let i = 0; i <= length; i++) {
    let incX = 0;
    if (startX !== endX) {
      incX = xUp * i;
    }
    const x = startX + incX;
    let incY = 0;
    if (startY !== endY) {
      incY = yUp * i;
    }
    const y = startY + incY;
    // console.log('got point', { x, y });
    points.push({ x, y });
  }
  return points;
}

function pointToKey(point: Vector): string {
  return [point.x, point.y].join(',');
}

// part one
console.log('part one');

const lines = getLines(rawLines);
const pointLines = lines.map(line => getLinePoints1(line));

const crossings: { [key: string]: number } = {};
pointLines.forEach(pointLine => {
  pointLine.forEach(point => {
    const key = pointToKey(point);
    crossings[key] ??= 0;
    crossings[key]++;
  });
});

const twos = Object.values(crossings).filter(crossing => crossing >= 2).length;
console.log(twos);

// part two
console.log('part two');

const pointLines2 = lines.map(line => getLinePoints2(line));

const crossings2: { [key: string]: number } = {};
pointLines2.forEach(pointLine => {
  pointLine.forEach(point => {
    const key = pointToKey(point);
    crossings2[key] ??= 0;
    crossings2[key]++;
  });
});

const twos2 = Object.values(crossings2).filter(crossing => crossing >= 2).length;
console.log(twos2);
