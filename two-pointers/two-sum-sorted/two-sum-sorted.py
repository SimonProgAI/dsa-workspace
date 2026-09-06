"""Two Pointers: Two Sum on a sorted array"""


def two_sum_sorted(nums: list[int], target: int) -> tuple[int, int]:
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return left, right
        if total < target:
            left += 1
        else:
            right -= 1
    return -1, -1


if __name__ == "__main__":
    nums = [1, 2, 3, 4, 6]
    target = 6

    result = two_sum_sorted(nums, target)
    print(f"Indices: {result[0]}, {result[1]}")

    # Every case in tests/two-sum-sorted.json, the same file the other languages read.
    # harness/python is on PYTHONPATH via .vscode/tasks.json and .vscode/launch.json.
    from dsatest import run_json_cases, run_tests

    run_json_cases("two-sum-sorted", two_sum_sorted)
    raise SystemExit(run_tests())
