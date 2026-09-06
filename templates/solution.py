"""<Category>: <Problem Name>"""


def solve(nums: list[int], target: int) -> list[int]:
    """Your solution. Standard library only."""
    return []


if __name__ == "__main__":
    # A quick manual run, so F5 still shows you something without a test file.
    print(solve([1, 2, 3], 4))

    # Every case in tests/<problem>.json. Each case's "input" array is splatted
    # into the call, so solve(*input) has to match the signature above.
    # harness/python is on PYTHONPATH via .vscode/tasks.json and .vscode/launch.json.
    from dsatest import assert_equal, run_json_cases, run_tests

    run_json_cases("<problem>", solve)

    # Or assert a single value directly:
    # assert_equal(solve([1, 2], 3), [0, 1], "my own case")

    raise SystemExit(run_tests())
