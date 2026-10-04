import { performance } from "node:perf_hooks";

// Logs and returns the average time in ms a given algorithm takes to execute over a given number of runs.
// Generates a fresh data set for each execution of the algorithm.
export function averageRuntimeMs(
  label: string,
  runs: number,
  generateDataSet: () => number[],
  runAlgorithm: (dataSet: number[]) => unknown,
): number {
  const runtimesArr: number[] = new Array();

  // Captures the length of the data set (used only for the console.log before the return statement)
  const data = generateDataSet();
  const dataSetLen = data.length;

  for (let i = 0; i < runs; i++) {
    const dataSet = generateDataSet();

    const startTime = performance.now();
    runAlgorithm(dataSet);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    runtimesArr[i] = elapsedTime;
  }

  let runtimesSum = 0;
  for (let i = 0; i < runtimesArr.length; i++) {
    runtimesSum += runtimesArr[i];
  }
  const avgTime = runtimesSum / runtimesArr.length;

  console.log(
    `${label} ran on arrays of length ${dataSetLen} in an average of ${avgTime} ms over ${runs} runs.`,
  );
  return avgTime;
}

// TODO: create a parent function that compares two averageRuntimeMs and returns ratio,
// speed increase or decrease, rank multiple algorithms according to speed, etc.
