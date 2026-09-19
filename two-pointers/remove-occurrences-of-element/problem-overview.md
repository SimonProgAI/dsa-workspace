# <Remove All Occurrences of an Element in an Array>

## Summary

If given an array of integers (intArr) and an integer element (ele), remove all occurences of ele and return the number (k) of element that are not equal to ele. If there are K elements not equal to ele, then intArr should be modified such as the first k elements contain the elements not equal to ele, followed by the remaining elements.

## Links
- GeeksforGeeks: [<url>](https://www.geeksforgeeks.org/dsa/remove-element/)

## From GeeksForGeeks

Given an integer array arr[] and an integer ele the task is to the remove all occurrences of ele from arr[] in-place and return the number of elements which are not equal to ele. If there are k number of elements which are not equal to ele then the input array arr[] should be modified such that the first k elements should contain the elements which are not equal to ele and then the remaining elements.

Note: The order of first k elements may be changed.

Examples:

Input: arr[] = [3, 2, 2, 3], ele = 3
Output: 2
Explanation: The answer is 2 because there are 2 elements which are not equal to 3 and arr[] will be modified such that the first 2 elements contain the elements which are not equal to 3 and remaining elements can contain any element. So, modified arr[] = [2, 2, _, _]

Input: arr[] = [0, 1, 3, 0, 2, 2, 4, 2], ele = 2
Output: 5
Explanation: The answer is 5 because there are 5 elements which are not equal to 2 and arr[] will be modified such that the first 5 elements contain the elements which are not equal to 2 and remaining elements can contain any element. So, modified arr[] = [0, 1, 3, 0, 4, _, _, _]

Approach:

The idea is to iterate over the array while maintaining a subarray at the beginning that contains only the elements which are not equal to ele. So, we can use a counter, say k to track the ending point of this subarray and whenever we encounter an element which is not equal to ele, we can swap the element at kth index with element at ith index and increment the value of k.

Step-by-step algorithm:

Initialize j to 0. This will track the count of the elements not equal to ele.
Iterate over each element in the array using the loop with the index i.
If arr[i] is not equal to the ele, set arr[j] = arr[i] and increment j.
Return j.


