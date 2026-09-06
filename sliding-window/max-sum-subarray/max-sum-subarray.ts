// Sliding Window: Maximum sum of a subarray of size k

function maxSumSubarray(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];

  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

function main(): void {
  const nums = [2, 1, 5, 1, 3, 2];
  const k = 3;

  console.log(`Max sum: ${maxSumSubarray(nums, k)}`);
}

main();
