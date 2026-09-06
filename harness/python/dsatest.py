"""Tiny test runner for the DSA workspace. Standard library only.

The VS Code Python task and debug config put this folder on PYTHONPATH, so a
solution file can simply do:

    from dsatest import run_json_cases, run_tests

    if __name__ == "__main__":
        run_json_cases("two-sum-sorted", lambda nums, target: two_sum_sorted(nums, target))
        run_tests()

Outside VS Code, set PYTHONPATH=harness/python (see the README).

The same module also backs the optional pytest route: `load_cases` returns the
cases from tests/<problem>.json, and `load_solution` imports a kebab-case
solution file that a normal `import` statement cannot name.
"""

from __future__ import annotations

import importlib.util
import json
import math
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Iterable, Sequence

__all__ = [
    "TestCase",
    "assert_equal",
    "find_tests_dir",
    "load_cases",
    "load_solution",
    "record_failure",
    "run_json_cases",
    "run_tests",
]


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def _color_enabled() -> bool:
    if os.environ.get("NO_COLOR") or os.environ.get("DSA_NO_COLOR"):
        return False
    return sys.stdout.isatty()


_GREEN = "\033[32m" if _color_enabled() else ""
_RED = "\033[31m" if _color_enabled() else ""
_DIM = "\033[2m" if _color_enabled() else ""
_RESET = "\033[0m" if _color_enabled() else ""


@dataclass
class _Totals:
    passed: int = 0
    failed: int = 0


_totals = _Totals()


# ---------------------------------------------------------------------------
# Comparison
# ---------------------------------------------------------------------------

def _normalize(value: Any) -> Any:
    """Converts a Python result into plain JSON data (tuples and sets become lists)."""

    def fallback(obj: Any) -> Any:
        if isinstance(obj, (set, frozenset)):
            return sorted(obj)
        if hasattr(obj, "tolist"):  # numpy-ish, if it ever shows up
            return obj.tolist()
        raise TypeError(f"cannot compare a value of type {type(obj).__name__} against JSON")

    return json.loads(json.dumps(value, default=fallback))


def _equal(actual: Any, expected: Any) -> bool:
    """Deep equality, with a relative tolerance for floats."""
    if isinstance(actual, bool) or isinstance(expected, bool):
        return actual == expected
    if isinstance(actual, (int, float)) and isinstance(expected, (int, float)):
        if isinstance(actual, int) and isinstance(expected, int):
            return actual == expected
        return math.isclose(actual, expected, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(actual, list) and isinstance(expected, list):
        return len(actual) == len(expected) and all(_equal(a, e) for a, e in zip(actual, expected))
    if isinstance(actual, dict) and isinstance(expected, dict):
        return actual.keys() == expected.keys() and all(_equal(actual[k], expected[k]) for k in actual)
    return actual == expected


# ---------------------------------------------------------------------------
# Assertions
# ---------------------------------------------------------------------------

def assert_equal(actual: Any, expected: Any, test_name: str) -> bool:
    """Records one assertion and prints its result. Returns whether it passed."""
    normalized = _normalize(actual)

    if _equal(normalized, expected):
        _totals.passed += 1
        print(f"  {_GREEN}PASS{_RESET}  {test_name}")
        return True

    _totals.failed += 1
    print(f"  {_RED}FAIL{_RESET}  {test_name}")
    print(f"        expected: {json.dumps(expected)}")
    print(f"        actual:   {json.dumps(normalized)}")
    return False


def record_failure(test_name: str, reason: str) -> None:
    """Records a failure that is not a comparison (a raised exception, say)."""
    _totals.failed += 1
    print(f"  {_RED}FAIL{_RESET}  {test_name}")
    print(f"        {reason}")


def run_tests() -> int:
    """Prints the summary and returns a process exit code: 0 when all passed."""
    total = _totals.passed + _totals.failed
    print()
    if total == 0:
        print(f"{_DIM}no assertions ran{_RESET}")
        return 0
    if _totals.failed == 0:
        print(f"{_GREEN}{_totals.passed} passed{_RESET}")
        return 0
    print(f"{_GREEN}{_totals.passed} passed{_RESET}, {_RED}{_totals.failed} failed{_RESET}")
    return 1


# ---------------------------------------------------------------------------
# Shared JSON test cases (tests/<problem>.json)
# ---------------------------------------------------------------------------

@dataclass
class TestCase:
    name: str
    input: list[Any] = field(default_factory=list)
    expected: Any = None


def find_tests_dir(start: str | os.PathLike[str] | None = None) -> Path:
    """Walks up from `start` (default: this caller's file, then cwd) to the tests/ folder."""
    override = os.environ.get("DSA_TESTS_DIR")
    if override:
        return Path(override)

    roots: list[Path] = []
    if start is not None:
        roots.append(Path(start).resolve())
    else:
        caller_file = sys._getframe(1).f_globals.get("__file__")
        if caller_file:
            roots.append(Path(caller_file).resolve().parent)
        roots.append(Path.cwd())

    for root in roots:
        for directory in [root, *root.parents]:
            candidate = directory / "tests"
            if candidate.is_dir():
                return candidate

    raise FileNotFoundError(
        "no tests/ folder found above " + ", ".join(str(r) for r in roots)
        + "; set DSA_TESTS_DIR to point at it"
    )


def _collect(group: Iterable[dict[str, Any]] | None, label: str) -> list[TestCase]:
    if not group:
        return []
    return [
        TestCase(
            name=entry.get("name") or f"{label} {index + 1}",
            input=list(entry.get("input", [])),
            expected=entry.get("expected"),
        )
        for index, entry in enumerate(group)
    ]


def load_cases(problem: str, tests_dir: str | os.PathLike[str] | None = None) -> list[TestCase]:
    """Loads tests/<problem>.json and returns "cases" followed by "edgeCases"."""
    directory = Path(tests_dir) if tests_dir is not None else find_tests_dir()
    path = directory / f"{problem}.json"
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)

    return _collect(data.get("cases"), "case") + _collect(data.get("edgeCases"), "edge")


def run_json_cases(problem: str, solve: Callable[..., Any]) -> None:
    """Runs every case in tests/<problem>.json through `solve(*case.input)`."""
    try:
        caller_file = sys._getframe(1).f_globals.get("__file__")
        start = Path(caller_file).resolve().parent if caller_file else Path.cwd()
        cases = load_cases(problem, find_tests_dir(start))
    except (OSError, ValueError) as error:
        record_failure(problem, str(error))
        return

    print(f"{_DIM}{problem}{_RESET}")
    for case in cases:
        try:
            assert_equal(solve(*case.input), case.expected, case.name)
        except Exception as error:  # a crash is a failing test, not a crashed run
            record_failure(case.name, f"raised {type(error).__name__}: {error}")


# ---------------------------------------------------------------------------
# pytest support
# ---------------------------------------------------------------------------

def load_solution(path: str | os.PathLike[str], module_name: str | None = None):
    """Imports a solution file whose kebab-case name `import` cannot express.

        solution = load_solution(Path(__file__).parent / "two-sum-sorted.py")
        solution.two_sum_sorted([1, 2, 3, 4, 6], 6)

    The file's `if __name__ == "__main__":` block does not run.
    """
    path = Path(path).resolve()
    name = module_name or path.stem.replace("-", "_")
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"cannot load a module from {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def pytest_params(problem: str, tests_dir: str | os.PathLike[str] | None = None) -> Sequence[Any]:
    """Cases from tests/<problem>.json as pytest parameters, labelled by case name.

        @pytest.mark.parametrize("case", pytest_params("two-sum-sorted"))
        def test_two_sum_sorted(case):
            assert two_sum_sorted(*case.input) == tuple(case.expected)
    """
    import pytest  # imported lazily so the module works without pytest installed

    cases = load_cases(problem, tests_dir)
    return [pytest.param(case, id=case.name) for case in cases]
