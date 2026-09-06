// Two Pointers: Two Sum on a sorted array
import { pathToFileURL } from "node:url";

export function twoSumSorted(nums: number[], target: number): [number, number] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}

function main(): void {
  const nums = [1, 2, 3, 4, 6];
  const target = 6;

  const result = twoSumSorted(nums, target);
  console.log(`Indices: ${result[0]}, ${result[1]}`);
}

// Runs the demo only when this file is executed directly, so two-sum-sorted.test.ts
// can import the solution without the demo firing.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
