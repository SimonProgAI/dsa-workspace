// Test helpers for the DSA workspace. No dependencies of its own.
//
// Two ways to use it:
//
//   1. Vitest (the normal route) — a <problem>.test.ts file next to the solution:
//
//        import { describe, it, expect } from "vitest";
//        import { loadCases } from "../../harness/ts/dsatest";
//        import { twoSumSorted } from "./two-sum-sorted";
//
//        describe("two-sum-sorted", () => {
//          for (const c of loadCases("two-sum-sorted")) {
//            it(c.name, () => {
//              expect(twoSumSorted(...(c.input as [number[], number]))).toEqual(c.expected);
//            });
//          }
//        });
//
//   2. Plain `npx tsx` — no install needed, useful mid-debugging:
//
//        runJsonCases("two-sum-sorted", (nums, target) => twoSumSorted(nums, target));
//        runTests();

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface TestCase {
  /** Label for output: the case's own "name", or "case 2" / "edge 1". */
  name: string;
  /** Arguments to pass to the solution, in order. */
  input: unknown[];
  expected: unknown;
}

interface TestFile {
  cases?: Array<{ name?: string; input?: unknown[]; expected?: unknown }>;
  edgeCases?: Array<{ name?: string; input?: unknown[]; expected?: unknown }>;
}

// ---------------------------------------------------------------------------
// Locating tests/<problem>.json
// ---------------------------------------------------------------------------

/**
 * Walks up from `start` (default: the working directory, then this file) looking
 * for the workspace's tests/ folder. $DSA_TESTS_DIR wins.
 */
export function findTestsDir(start?: string): string {
  const override = process.env.DSA_TESTS_DIR;
  if (override) return override;

  const roots = start
    ? [resolve(start)]
    : [process.cwd(), dirname(fileURLToPath(import.meta.url))];

  for (const root of roots) {
    let dir = root;
    while (true) {
      const candidate = join(dir, "tests");
      if (existsSync(candidate) && statSync(candidate).isDirectory()) return candidate;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  throw new Error(
    `no tests/ folder found above ${roots.join(" or ")}; set DSA_TESTS_DIR to point at it`,
  );
}

/** Loads tests/<problem>.json and returns "cases" followed by "edgeCases". */
export function loadCases(problem: string, testsDir?: string): TestCase[] {
  const path = join(testsDir ?? findTestsDir(), `${problem}.json`);
  const file = JSON.parse(readFileSync(path, "utf8")) as TestFile;

  const collect = (group: TestFile["cases"], label: string): TestCase[] =>
    (group ?? []).map((entry, index) => ({
      name: entry.name ?? `${label} ${index + 1}`,
      input: entry.input ?? [],
      expected: entry.expected,
    }));

  return [...collect(file.cases, "case"), ...collect(file.edgeCases, "edge")];
}

// ---------------------------------------------------------------------------
// Standalone runner (for `npx tsx`, when you do not want to start Vitest)
// ---------------------------------------------------------------------------

const color = !process.env.NO_COLOR && !process.env.DSA_NO_COLOR;
const green = (s: string) => (color ? `\x1b[32m${s}\x1b[0m` : s);
const red = (s: string) => (color ? `\x1b[31m${s}\x1b[0m` : s);
const dim = (s: string) => (color ? `\x1b[2m${s}\x1b[0m` : s);

let passed = 0;
let failed = 0;

/** Deep equality over JSON data, with a relative tolerance for floats. */
function deepEqual(actual: unknown, expected: unknown): boolean {
  if (typeof actual === "number" && typeof expected === "number") {
    if (Number.isInteger(actual) && Number.isInteger(expected)) return actual === expected;
    const scale = Math.max(1, Math.abs(actual), Math.abs(expected));
    return Math.abs(actual - expected) <= 1e-9 * scale;
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.length === expected.length && actual.every((v, i) => deepEqual(v, expected[i]));
  }
  if (actual && expected && typeof actual === "object" && typeof expected === "object") {
    const a = actual as Record<string, unknown>;
    const e = expected as Record<string, unknown>;
    const aKeys = Object.keys(a);
    const eKeys = Object.keys(e);
    return aKeys.length === eKeys.length && aKeys.every((k) => k in e && deepEqual(a[k], e[k]));
  }
  return actual === expected;
}

/** Records one assertion and prints its result. Returns whether it passed. */
export function assertEqual(actual: unknown, expected: unknown, testName: string): boolean {
  // Round-trips through JSON so Sets, Maps and class instances compare like data.
  const normalized = JSON.parse(JSON.stringify(actual ?? null)) as unknown;

  if (deepEqual(normalized, expected)) {
    passed++;
    console.log(`  ${green("PASS")}  ${testName}`);
    return true;
  }

  failed++;
  console.log(`  ${red("FAIL")}  ${testName}`);
  console.log(`        expected: ${JSON.stringify(expected)}`);
  console.log(`        actual:   ${JSON.stringify(normalized)}`);
  return false;
}

/** Records a failure that is not a comparison (a thrown error, say). */
export function recordFailure(testName: string, reason: string): void {
  failed++;
  console.log(`  ${red("FAIL")}  ${testName}`);
  console.log(`        ${reason}`);
}

/** Runs every case in tests/<problem>.json through `solve(...case.input)`. */
export function runJsonCases(problem: string, solve: (...args: never[]) => unknown): void {
  let cases: TestCase[];
  try {
    cases = loadCases(problem);
  } catch (error) {
    recordFailure(problem, error instanceof Error ? error.message : String(error));
    return;
  }

  console.log(dim(problem));
  for (const testCase of cases) {
    try {
      assertEqual(solve(...(testCase.input as never[])), testCase.expected, testCase.name);
    } catch (error) {
      recordFailure(testCase.name, `threw: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/** Prints the summary and returns a process exit code: 0 when all passed. */
export function runTests(): number {
  const total = passed + failed;
  console.log();
  if (total === 0) {
    console.log(dim("no assertions ran"));
    return 0;
  }
  if (failed === 0) {
    console.log(green(`${passed} passed`));
    return 0;
  }
  console.log(`${green(`${passed} passed`)}, ${red(`${failed} failed`)}`);
  return 1;
}
