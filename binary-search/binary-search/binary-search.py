"""Binary Search: Find target index in a sorted array"""


def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1


if __name__ == "__main__":
    nums = [1, 3, 5, 7, 9, 11]
    target = 7

    print(f"Index: {binary_search(nums, target)}")
