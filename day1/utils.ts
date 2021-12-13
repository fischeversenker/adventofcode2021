export function countUps(numbers: number[]): number {
  const ups = numbers.reduce(([previousLineAsNumber, acc], line) => {
    const lineAsNumber = line;
    if (previousLineAsNumber && lineAsNumber > previousLineAsNumber) {
      acc++;
    }
    return [lineAsNumber, acc] as [number | null, number];
  }, [null, 0] as [number | null, number]);
  return ups[1];
}
