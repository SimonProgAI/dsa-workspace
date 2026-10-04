# <Problem Move all Zeroes to End of Array >

## Summary

Iterate over intArr and move all values equal to ele (0) at the end of the array. 

## Examples

| Input | Output | Why |
| `arr[] = [1, 2, 0, 4, 3, 0, 5, 0]` | `[1, 2, 4, 3, 5, 0, 0, 0]` | There are three 0s that are moved to the end. |
| `arr[] = [10, 20, 30]` | `[10, 20, 30]` | No change in array as there are no 0s. |
| `arr[] = [0, 0]` | `[0, 0]` |  |No change in array as there are all 0s.

## Thought Process

- On first thought, it looks nearly identical to the remove-occurences problem. The only difference being that the resultArr is not sliced to ommmit the isolated elements since the problem requires to move them at the end of the array.
- I will implement naive, better and expected approaches and benchmark all three solutions against a large array.

## Links
- GeeksforGeeks: <https://www.geeksforgeeks.org/dsa/move-zeroes-end-array/>

