// Binary Search: Find target index in a sorted array

function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

function main(): void {
  const nums = [1, 3, 5, 7, 9, 11];
  const target = 7;

  console.log(`Index: ${binarySearch(nums, target)}`);
}

main();
