export function readLines(filename: string): string[] {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(filename);
  const content = decoder.decode(data);
  return content.split('\n');
}
