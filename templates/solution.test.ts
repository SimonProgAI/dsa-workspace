// Vitest reads the same tests/<problem>.json as the C++, Python and Java runners.
//
//   npx vitest run <problem>     (or the "Test TypeScript Active File" task)
import { describe, expect, it } from "vitest";

import { loadCases } from "../../harness/ts/dsatest";
import { solve } from "./solution";

describe("<problem>", () => {
  for (const testCase of loadCases("<problem>")) {
    it(testCase.name, () => {
      const [nums, target] = testCase.input as [number[], number];
      expect(solve(nums, target)).toEqual(testCase.expected);
    });
  }
});
