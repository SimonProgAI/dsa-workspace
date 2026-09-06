// Dynamic Programming: Fibonacci with memoization

const memo = new Map<number, number>();

function fib(n: number): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fib(n - 1) + fib(n - 2);
  memo.set(n, result);
  return result;
}

function main(): void {
  const n = 20;
  console.log(`fib(${n}) = ${fib(n)}`);
}

main();
