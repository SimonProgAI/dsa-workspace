# Move All Zeroes to End of Array

## Summary

Iterate over nums and move all values equal to targetValue (0) to the end of the array, while keeping the relative order of the non-zero elements.

## Examples

| Input | Output | Why |
| --- | --- | --- |
| `nums = [1, 2, 0, 4, 3, 0, 5, 0]` | `[1, 2, 4, 3, 5, 0, 0, 0]` | There are three 0s that are moved to the end. |
| `nums = [10, 20, 30]` | `[10, 20, 30]` | No change in array as there are no 0s. |
| `nums = [0, 0]` | `[0, 0]` | No change in array as there are all 0s. |

## Complexity

| Approach | Time | Space |
| --- | --- | --- |
| Naive (temporary array) | O(n) | O(n) |
| Two-pass | O(n) | O(1) |
| One-pass (swap) | O(n) | O(1) |

## Thought Process

- On first thought, it looks nearly identical to the remove-occurrences-of-element problem. The only difference being that nums is not sliced to omit the isolated elements, since the problem requires to move them to the end of the array.
- Surprisingly, when benchmarked against a large array of 1,000,000 integers, the two-pass approach is on average faster than the one-pass approach:

  | Approach | Average runtime | Data set length | Runs |
  | --- | --- | --- | --- |
  | moveTargetsToEndNaive | 12.492 ms | 1,000,000 | 1000 |
  | moveTargetsToEndOnePass | 2.658 ms | 1,000,000 | 1000 |
  | moveTargetsToEndTwoPass | 1.186 ms | 1,000,000 | 1000 |

  A likely reason: the one-pass approach does a three-assignment swap for every non-zero element, while the two-pass approach does a single write per non-zero element, followed by a cheap fill of the remaining positions.

## Lesson Learned

If a method does O(n) work per call, never call it inside a loop that already iterates over the array: the total cost becomes O(n²). In other words, don't use a method like .splice() .shift(), .unshift(), .indexOf(), .includes() inside a for loop on an array whose length can potentially be in the millions.

My first implementation of the two-pass approach was considerably slower (by up to 300 times) on a large data set than the one-pass approach. This was due to moveTargetsToEndTwoPass calling the .splice() method on each non-targetValue element on the first traversal of the array. Each .splice() call shifts every element after it, so the traversal became O(n²). On a small data set it was not a problem, but on a large data set of hundreds of millions of integers, it was a significant dragg on performance.

## Links
- GeeksforGeeks: <https://www.geeksforgeeks.org/dsa/move-zeroes-end-array/>
