// Binary Search: Find target index in a sorted array
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> nums = {1, 3, 5, 7, 9, 11};
    int target = 7;

    cout << "Index: " << binarySearch(nums, target) << endl;

    return 0;
}
