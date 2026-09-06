// Vitest reads the same tests/two-sum-sorted.json as the C++, Python and Java runners.
//
//   npx vitest run two-sum-sorted     (or the "Test TypeScript Active File" task)
import { describe, expect, it } from "vitest";

import { loadCases } from "../../harness/ts/dsatest";
import { twoSumSorted } from "./two-sum-sorted";

describe("two-sum-sorted", () => {
  for (const testCase of loadCases("two-sum-sorted")) {
    it(testCase.name, () => {
      const [nums, target] = testCase.input as [number[], number];
      expect(twoSumSorted(nums, target)).toEqual(testCase.expected);
    });
  }
});
