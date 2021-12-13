import { readLines } from '../utils/file.ts';

const filename = Deno.args[0];
const lines = readLines(filename);

// part one
const drawNumbers = lines[0].split(',').map(char => Number(char));

let numberOfBoards = Math.floor((lines.length - 2) / 5);
numberOfBoards = Math.ceil(numberOfBoards - numberOfBoards / 5);
console.log({ numberOfBoards, linesLength: lines.length });

let boards = getBoards(lines);

// part one
console.log('part two');

let winner = null;
let drawnIndex = 0;
while (winner === null && drawnIndex < drawNumbers.length) {
  boards = drawNumber(boards, drawNumbers[drawnIndex]);
  const w = findWinner(boards);
  if (w) {
    winner = w;
  }
  drawnIndex++;
}

if (winner) {
  const winningSum = sumPositiveCells(winner);
  console.log(winningSum * drawNumbers[drawnIndex-1]);
} else {
  console.log('no winner :(');
}

// part two
console.log('part two');

boards = getBoards(lines);
winner = null;
drawnIndex = 0;
const winners: number[] = [];
let lastDrawnNumber = -1;
let lastWinnerIndex = -1;
while (winner === null && drawnIndex < drawNumbers.length) {
  boards = drawNumber(boards, drawNumbers[drawnIndex]);
  const wI = findLastWinnerIndex(boards, winners);
  if (wI.length > 0) {
    winners.push(...wI);
    lastDrawnNumber = drawNumbers[drawnIndex];
    lastWinnerIndex = wI[wI.length - 1];
  }
  drawnIndex++;
}
winner = boards[lastWinnerIndex];


if (winner) {
  const winningSum = sumPositiveCells(winner);
  console.log(winningSum * lastDrawnNumber);
} else {
  console.log('no winner :(');
}

// helpers

function getBoards(lines: string[]): number[][][] {
  const boards = [];
  for (let boardIndex = 0; boardIndex < numberOfBoards; boardIndex++) {
    boards.push(readBoard(lines, boardIndex));
  }
  return boards;
}

function readBoard(lines: string[], boardIndex: number): number[][] {
  const board: number[][] = [];
  const offset = 2 + boardIndex + (boardIndex * 5);
  for (let lineNumber = offset; lineNumber < offset + 5; lineNumber++) {
    const row = lines[lineNumber].split(' ').map(chars => chars.trim()).filter(chars => chars.length).map(chars => Number(chars));
    board.push(row);
  }
  return board;
}

function isBoardDone(board: number[][]): boolean {
  const rowsDone = [true, true, true, true, true];
  const colsDone = [true, true, true, true, true];
  for (let y = 0; y < board.length; y++) {
    if (!rowsDone[y])
      continue;
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x] !== -1) {
        rowsDone[y] = false;
      }
    }
  }
  for (let x = 0; x < board.length; x++) {
    if (!colsDone[x])
      continue;
    for (let y = 0; y < board[0].length; y++) {
      if (board[y][x] !== -1) {
        colsDone[x] = false;
      }
    }
  }
  return rowsDone.some(Boolean) || colsDone.some(Boolean);
}

function drawNumber(boards: number[][][], newNumber: number): number[][][] {
  return boards.map(board => {
    if (isBoardDone(board)) {
      return board;
    }
    return board.map(row => {
      return row.map(nbr => {
        return nbr === newNumber ? -1 : nbr;
      });
    });
  });
}

function findWinner(boards:number[][][]): number[][] | null {
  return boards.find(board => isBoardDone(board)) ?? null;
}

function findLastWinnerIndex(boards:number[][][], exclude: number[]): number[] {
  const winners: number[] = [];
  boards.forEach((board, index) => {
    if (isBoardDone(board) && !exclude.includes(index)) {
      winners.push(index);
    }
  });
  return winners;
}

function sumPositiveCells(board: number[][]): number {
  let sum = 0;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] > 0) {
        sum += board[y][x];
      }
    }
  }
  return sum;
}

function drawBoards(boards: number[][][]) {
  boards.forEach((board, index) => {
    console.log(index);
    board.forEach(row => {
      console.log(row);
    });
  });
}
