// Sliding Window: Maximum sum of a subarray of size k
#include <iostream>
#include <vector>
using namespace std;

int maxSumSubarray(const vector<int>& nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];

    int maxSum = windowSum;
    for (int i = k; i < (int)nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}

int main() {
    vector<int> nums = {2, 1, 5, 1, 3, 2};
    int k = 3;

    cout << "Max sum: " << maxSumSubarray(nums, k) << endl;

    return 0;
}
