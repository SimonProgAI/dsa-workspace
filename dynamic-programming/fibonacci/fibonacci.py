"""Dynamic Programming: Fibonacci with memoization"""

from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


if __name__ == "__main__":
    n = 20
    print(f"fib({n}) = {fib(n)}")
