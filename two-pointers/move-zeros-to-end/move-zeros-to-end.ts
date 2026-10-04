// import { generateRandomIntArray } from "../../util/array-generators";

// ------------------------------------------------------------
// [Naive Approach] Using Temporary Array - O(n) Time and O(n) Space
// ------------------------------------------------------------

/* The idea is to use a temporary array of the same size and do the following:

Copy all non-zero elements into the temp array
Fill the remaining positions with zeros 
Copy the temporary array back to the original array.  */

/* 
const largeArr = generateRandomIntArray({
  len: 10_000_000,
  maxValue: 100,
  minValue: 1,
  sort: "none",
}); */

const caseArr: number[] = [
  0, 1, 3, 0, 2, 2, 4, 2, 0, 0, 0, 0, 0, 2, 3, 4, 5, 6,
];
const testTarget: number = 0;

export function moveTargetsToEndNaive(
  targetValue: number,
  nums: number[],
): number[] {
  // Initiate a temporary array
  let tempArr: number[] = new Array();
  // 1st pass: iterate over nums to locate and push all non-targetValue to tempArr
  for (let i = 0; i < nums.length; i++) {
    // If the current value of nums[i] is NOT EQUAL to targetValue, it is pushed to tempArr
    if (nums[i] !== targetValue) {
      tempArr.push(nums[i]);
    }
  }
  // 2nd pass: iterate over nums to locate and push all targetValue to tempArr
  for (let i = 0; i < nums.length; i++) {
    // If the current value of nums[i] is EQUAL to targetValue, it is pushed to tempArr
    if (nums[i] === targetValue) {
      tempArr.push(nums[i]);
    }
  }

  // Copy the temporary array back to the original array
  nums = tempArr;
  // console.log(nums);

  return nums;
}

// ------------------------------------------------------------
// [Better Approach] Two Traversals-O(n) Time and O(1) space
// ------------------------------------------------------------

/* The idea is to move all the zeros to the end of the array while maintaining the relative order of non-zero elements using two traversals. 

Traverse the array once to move all non-zero elements to the front while maintaining order
Traverse the remaining positions and fill them with zeros. */

export function moveTargetsToEndTwoPass(targetValue: number, nums: number[]) {

  let k = 0;
  // 1st traversal: move all non-targetValue to the front
  for (let i = 0; i < nums.length; i++) {
    // deletes targetValue and shift non-targetValue left
    if (nums[i] !== targetValue) {
      nums[k] = nums[i]
      k++;
      // console.log(k)
      // console.log(nums)
    }
  }

  // 2nd traversal: traverse the remaining positions and fill them with targetValue.
  for (let i = k; i < nums.length; i++) {
    nums[i] = targetValue;
  }

  // console.log(nums);
  return nums;
}

// ------------------------------------------------------------
// [Expected Approach] One Traversal-O(n) Time and O(1) space
// ------------------------------------------------------------
/* The idea is similar to the previous approach. Here we initialize a pointer count to track where the next non-zero element should be placed.

Initialize count as 0 and traverse the array.
When a non-zero element is found, swap it with arr[count] and increment count. This places the non-zero element at the correct position. */

export function moveTargetsToEndOnePass(targetValue: number, nums: number[]) {
  // initialize a pointer count to track where the next non-targetValue element should be placed
  // that's the left pointer
  let k: number = 0;

  // iterate over nums to scan for non-targetValue
  for (let i = 0; i < nums.length; i++) {
    // initialize a temp variable for the swap
    let temp: number;
    // when nums[i] is a non-targetValue:
    if (nums[i] !== targetValue) {
      // swap nums[k] for nums[i]
      temp = nums[k];
      nums[k] = nums[i];
      nums[i] = temp;
      // move k forward
      k++;
    }
  }
  // console.log(nums);
  return nums;
}

// console.log(moveTargetsToEndNaive(testTarget, largeArr));
moveTargetsToEndTwoPass(testTarget, caseArr);
// moveTargetsToEndOnePass(testTarget, caseArr);
