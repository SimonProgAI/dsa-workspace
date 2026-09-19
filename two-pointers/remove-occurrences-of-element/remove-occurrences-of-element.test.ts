import { describe, expect, it } from "vitest";
import { loadCases } from "../../harness/ts/dsatest";
import { removeOccurrencesOfElement } from "./remove-occurrences-of-element";

describe("remove-occurrences-of-element", () => {
  for (const testCase of loadCases("remove-occurrences-of-element")) {// Where are these cases loaded from?
    it(testCase.name, () => {
      const [nums, target] = testCase.input as [number[], number];
      expect(removeOccurrencesOfElement(nums, target)).toEqual(testCase.expected);
    });
  }
});
