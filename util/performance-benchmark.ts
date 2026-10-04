import { performance } from "node:perf_hooks";

export function microBenchmarkAveragingMs(
  label: string,
  dataSetLen: number,
  generateDataSet: () => number[],
  runAlgorithm: (dataArr: number[]) => unknown,
): number {
  let nums: number[] = new Array();

  const data = generateDataSet();
  const dataLen = data.length;

  for (let i = 0; i < dataSetLen; i++) {
    const dataArr = generateDataSet();

    const startTime = performance.now();
    runAlgorithm(dataArr);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    // console.log(nums)
    nums[i] = elapsedTime;
  }

  // console.log(nums);

  let tempSum: number = 0;
  for (let i = 0; i < nums.length; i++) {
    tempSum += nums[i];
  }
  //   console.log("tempSum: ", tempSum);
  const avgTime: number = tempSum / nums.length;
  console.log(
    `${label} ran on arrays of length ${dataLen} in an average of ${avgTime} ms over ${dataSetLen} runs.`,
  );
  return avgTime;
}

// TODO: create a parent function that compares two microBenchmarlAveragingMs and returns ratio,
// speed increase or decrease, rank multiple algorithms according to speed, etc.
