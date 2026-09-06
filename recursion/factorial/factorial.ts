// Recursion: Factorial

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function main(): void {
  const n = 10;
  console.log(`${n}! = ${factorial(n)}`);
}

main();
