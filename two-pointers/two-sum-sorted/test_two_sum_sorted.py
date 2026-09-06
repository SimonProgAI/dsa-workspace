"""Optional pytest route for the same tests/two-sum-sorted.json cases.

    pip install pytest
    pytest                      # from anywhere in the workspace

The in-file runner at the bottom of two-sum-sorted.py is the default and needs
no install; this file exists to show the pytest alternative. `load_solution`
imports the kebab-case solution file, which a plain `import` cannot name.
"""

from pathlib import Path

import pytest

from dsatest import load_cases, load_solution

solution = load_solution(Path(__file__).parent / "two-sum-sorted.py")


@pytest.mark.parametrize("case", load_cases("two-sum-sorted"), ids=lambda case: case.name)
def test_two_sum_sorted(case):
    nums, target = case.input
    assert list(solution.two_sum_sorted(nums, target)) == case.expected
