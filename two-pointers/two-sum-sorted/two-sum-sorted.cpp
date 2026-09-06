// Two Pointers: Two Sum on a sorted array
#include <iostream>
#include <vector>

#include "test.hpp"  // harness/cpp is on the include path (see .vscode/tasks.json)

using namespace std;

vector<int> twoSumSorted(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left, right};
        if (sum < target) left++;
        else right--;
    }
    return {-1, -1};
}

int main() {
    vector<int> nums = {1, 2, 3, 4, 6};
    int target = 6;

    vector<int> result = twoSumSorted(nums, target);
    cout << "Indices: " << result[0] << ", " << result[1] << endl;

    // Every case in tests/two-sum-sorted.json, the same file the other languages read.
    dsa::runJsonCases("two-sum-sorted", [](const dsa::Json& in) {
        return twoSumSorted(in[0].ints(), (int)in[1].asInt());
    });

    return dsa::runTests();
}
