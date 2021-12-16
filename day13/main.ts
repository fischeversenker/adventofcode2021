import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const rawLines = readLines(filename).filter(line => line.length > 0);

interface Vector {
  x: number;
  y: number;
}

interface Fold {
  type: 'horizontal' | 'vertical';
  line: number;
}

function getDotsAndFolds(lines: string[]): { dots: Vector[], folds: Fold[] } {
  const dotsLines = lines.filter(line => !line.startsWith('fold'));
  const foldsLines = lines.filter(line => line.startsWith('fold'));

  const dots: Vector[] = dotsLines.map(line => line.split(',').map(Number)).map(([x, y]) => ({ x, y }));
  const folds: Fold[] = foldsLines.map(line => {
    const parts = line.replace('fold along ', '').split('=')
    return {
      type: parts[0] === 'y' ? 'horizontal' : 'vertical',
      line: Number(parts[1])
    };
  });
  return { dots, folds };
}

function getPaperDimensions(dots: Vector[]): [number, number] {
  const paperWidth = dots.reduce((max, dot) => Math.max(max, dot.x), 0) + 1;
  const paperHeight = dots.reduce((max, dot) => Math.max(max, dot.y), 0) + 1;
  return [paperWidth, paperHeight];
}

function placeDotsOnPaper(dots: Vector[], paperWidth: number, paperHeight: number): boolean[][] {
  const paper: boolean[][] = [];
  for (let y = 0; y <= paperHeight; y++) {
    paper[y] = [];
    for (let x = 0; x <= paperWidth; x++) {
      paper[y][x] = false;
    }
  }
  dots.forEach(dot => {
    paper[dot.y][dot.x] = true;
  });

  return paper;
}

function printPaper(paper: boolean[][], fold?: Fold): void {
  let paperString = '';

  paper.forEach((line, y) => {
    paperString += line.map((dot, x) => {
      if (fold) {
        if (fold.type === 'horizontal' && y === fold.line) {
          return '-'
        }
        if (fold.type === 'vertical' && x === fold.line) {
          return '|'
        }
      }
      return dot ? '#' : '.';
    }).join('');
    paperString += '\n';
  });

  console.log(paperString);
}

function foldDots(dots: Vector[], fold: Fold, paperWidth: number, paperHeight: number): Vector[] {
  // const [paperWidth, paperHeight] = getPaperDimensions(dots);
  const foldedDots: Vector[] = [];

  if (fold.type === 'horizontal') {
    dots.forEach(dot => {
      if (dot.y === fold.line) {
        throw new Error(`dot on horizontal fold line! Dot: ${dot.x}/${dot.y}, fold line: ${fold.line}`);
      }
      if (dot.y > fold.line) {
        foldedDots.push({ x: dot.x, y: paperHeight - dot.y });
      } else {
        foldedDots.push({ ...dot });
      }
    });
  } else {
    dots.forEach(dot => {
      if (dot.x === fold.line) {
        throw new Error(`dot on vertical fold line! Dot: ${dot.x}/${dot.y}, fold line: ${fold.line}`);
      }
      if (dot.x > fold.line) {
        foldedDots.push({ x: paperWidth - dot.x, y: dot.y });
      } else {
        foldedDots.push({ ...dot });
      }
    });
  }
  return foldedDots;
}

function countDots(dots: Vector[]): number {
  const dotSet = new Set<string>();
  dots.forEach(dot => dotSet.add(`${dot.x}/${dot.y}`));
  return dotSet.size;
}

// part one

function partOne(): void {
  console.log('part one');
  console.time('Timer for part one');
  const { dots, folds } = getDotsAndFolds(rawLines);
  const [paperWidth, paperHeight] = getPaperDimensions(dots);
  const initialPaper = placeDotsOnPaper(dots, paperWidth, paperHeight);
  const foldedDots = foldDots(dots, folds[0], paperWidth, paperHeight);
  // const paper = placeDotsOnPaper(foldedDots, paperWidth, paperHeight);
  // printPaper(paper);
  console.log(countDots(foldedDots));
  console.timeEnd('Timer for part one');
}

// partOne();

// part two

function partTwo(): void {
  console.log('part two');
  console.time('Timer for part two');
  let { dots, folds } = getDotsAndFolds(rawLines);
  let [paperWidth, paperHeight] = getPaperDimensions(dots);

  folds.forEach(fold => {
    dots = foldDots(dots, fold, paperWidth, paperHeight);
    if (fold.type === 'horizontal') {
      paperHeight = Math.floor(paperHeight / 2);
    } else {
      paperWidth = Math.floor(paperWidth / 2);
    }
    const paper = placeDotsOnPaper(dots, paperWidth, paperHeight);
    printPaper(paper);
  });

  console.log(countDots(dots));
  console.timeEnd('Timer for part two');
}

partTwo();
