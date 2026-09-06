// Math: Greatest Common Divisor (Euclidean algorithm)

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function main(): void {
  const a = 48;
  const b = 18;
  console.log(`gcd(${a}, ${b}) = ${gcd(a, b)}`);
}

main();
