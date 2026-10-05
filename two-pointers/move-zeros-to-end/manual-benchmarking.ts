import { generateRandomIntArray } from "../../util/array-generators";
import {
  moveTargetsToEndNaive,
  moveTargetsToEndOnePass,
  moveTargetsToEndTwoPass,
} from "./move-zeros-to-end";
import { averageRuntimeMs } from "../../util/performance-benchmark";

const runs = 1000;
const length = 1_000_000;
const algorithmsArr = [
  moveTargetsToEndNaive,
  moveTargetsToEndOnePass,
  moveTargetsToEndTwoPass,
];

const benchmarkSuite = algorithmsArr.map((fn) =>
  averageRuntimeMs(
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
  ),
);

console.log(benchmarkSuite);
