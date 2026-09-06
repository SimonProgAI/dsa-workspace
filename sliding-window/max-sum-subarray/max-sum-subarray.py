"""Sliding Window: Maximum sum of a subarray of size k"""


def max_sum_subarray(nums: list[int], k: int) -> int:
    window_sum = sum(nums[:k])
    max_sum = window_sum

    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum


if __name__ == "__main__":
    nums = [2, 1, 5, 1, 3, 2]
    k = 3

    print(f"Max sum: {max_sum_subarray(nums, k)}")
