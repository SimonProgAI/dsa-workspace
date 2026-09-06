"""Math: Greatest Common Divisor (Euclidean algorithm)"""


def gcd(a: int, b: int) -> int:
    while b != 0:
        a, b = b, a % b
    return a


if __name__ == "__main__":
    a, b = 48, 18
    print(f"gcd({a}, {b}) = {gcd(a, b)}")
