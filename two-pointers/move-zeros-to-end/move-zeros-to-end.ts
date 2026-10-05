const caseArr: number[] = [
  0, 1, 3, 0, 2, 2, 4, 2, 0, 0, 0, 0, 0, 2, 3, 4, 5, 6,
];
const testTarget: number = 0;

// ------------------------------------------------------------
// [Naive Approach] Using Temporary Array - O(n) Time and O(n) Space
// ------------------------------------------------------------

/*
1. Create a temp array to push non-target and target values.
2. Push all non-target values to the front of the temp array.
3. Push target values to the remaining positions.
4. Copy the temporary array values to the original array.
*/

export function moveTargetsToEndNaive(
  targetValue: number,
  nums: number[],
): number[] {
  let tempArr: number[] = new Array();
  // 1st pass: push non-target values to tempArr
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== targetValue) {
      tempArr.push(nums[i]);
    }
  }
  // 2nd pass: push target values to the remaining positions of tempArr
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === targetValue) {
      tempArr.push(nums[i]);
    }
  }

  // Copy the temporary array values to the original array
  for (let i = 0; i < nums.length; i++) {
    nums[i] = tempArr[i];
  }

  return nums;
}

// ------------------------------------------------------------
// [Better Approach] Two Traversals-O(n) Time and O(1) space
// ------------------------------------------------------------

/* Move all target values to the end of the array while maintaining the relative order of non-target values using two traversals.

1st pass: move all non-target values to the front.
2nd pass: fill remaining positions with target value. */

export function moveTargetsToEndTwoPass(targetValue: number, nums: number[]) {
  let k = 0;
  // 1st pass: move all non-target values to the front
  for (let i = 0; i < nums.length; i++) {
    // Copy the non-target value left, to nums[k]
    if (nums[i] !== targetValue) {
      nums[k] = nums[i];
      k++;
    }
  }
  // 2nd pass: fill remaining positions with targetValue.
  for (let i = k; i < nums.length; i++) {
    nums[i] = targetValue;
  }

  return nums;
}

// ------------------------------------------------------------
// [Expected Approach] One Traversal-O(n) Time and O(1) space
// ------------------------------------------------------------
/*
1. Initialize k to track where the next non-target value should be placed.
2. Traverse the array. If a non-target value is found, swap it with nums[k] and increment k.
*/

export function moveTargetsToEndOnePass(targetValue: number, nums: number[]) {
  // k is the left pointer: where the next non-target value should be placed
  let k: number = 0;

  for (let i = 0; i < nums.length; i++) {
    let temp: number;
    // If nums[i] is a non-target value, swap it with nums[k] and move k forward
    if (nums[i] !== targetValue) {
      temp = nums[k];
      nums[k] = nums[i];
      nums[i] = temp;
      k++;
    }
  }

  return nums;
}

console.log(moveTargetsToEndNaive(testTarget, caseArr));
// moveTargetsToEndTwoPass(testTarget, caseArr);
// moveTargetsToEndOnePass(testTarget, caseArr);
