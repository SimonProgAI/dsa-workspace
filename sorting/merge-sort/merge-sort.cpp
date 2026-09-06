// Sorting: Merge Sort
#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& nums, int left, int mid, int right) {
    vector<int> leftHalf(nums.begin() + left, nums.begin() + mid + 1);
    vector<int> rightHalf(nums.begin() + mid + 1, nums.begin() + right + 1);

    int i = 0, j = 0, k = left;
    while (i < (int)leftHalf.size() && j < (int)rightHalf.size()) {
        nums[k++] = (leftHalf[i] <= rightHalf[j]) ? leftHalf[i++] : rightHalf[j++];
    }
    while (i < (int)leftHalf.size()) nums[k++] = leftHalf[i++];
    while (j < (int)rightHalf.size()) nums[k++] = rightHalf[j++];
}

void mergeSort(vector<int>& nums, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(nums, left, mid);
    mergeSort(nums, mid + 1, right);
    merge(nums, left, mid, right);
}

int main() {
    vector<int> nums = {5, 2, 4, 1, 3, 6};

    mergeSort(nums, 0, (int)nums.size() - 1);

    for (int val : nums) cout << val << " ";
    cout << endl;

    return 0;
}
