import { generateRandomIntArray } from "../../util/array-generators";
import {
  moveTargetsToEndNaive,
  moveTargetsToEndOnePass,
  moveTargetsToEndTwoPass,
} from "./move-zeros-to-end";
import { microBenchmarkAveragingMs } from "../../util/performance-benchmark";
import { removeOccurrencesOfElement } from "../remove-occurrences-of-element/remove-occurrences-of-element";

const runs = 100;
const length = 1_000_000;
const functionsArr = [
  moveTargetsToEndNaive,
  moveTargetsToEndOnePass,
  moveTargetsToEndTwoPass,
  removeOccurrencesOfElement,
];

const benchmarkSuite = functionsArr.map((fn) => {
  microBenchmarkAveragingMs(
    fn.name,
    runs,
    () =>
      generateRandomIntArray({
        len: length,
        minValue: 0,
        maxValue: 100,
        sort: "none",
      }),
    (arr) => fn(0, arr),
  );
});

console.log(benchmarkSuite);
