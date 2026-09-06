// <Category>: <Problem Name>
import { pathToFileURL } from "node:url";

// Exported so <problem>.test.ts can import it.
export function solve(nums: number[], target: number): number[] {
  return [];
}

function main(): void {
  // A quick manual run, so F5 still shows you something without a test file.
  console.log(solve([1, 2, 3], 4));
}

// Runs the demo only when this file is executed directly, so Vitest can import
// the solution without the demo firing.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
