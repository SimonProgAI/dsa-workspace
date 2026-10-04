// ------------------------------------------------------------
// Utility module for generating arrays of random data.
// Currently supports integers.
// Will support strings, floats, and additional data types later.
// Ideal for benchmarking algorithms and testing against
// large, customizable datasets.
// ------------------------------------------------------------


interface GenerateRandomIntArray {
  len: number;
  minValue: number;
  maxValue: number;
  sort: "ascending" | "descending" | "none";
}

// ------------------------------------------------------------
// Support Functions — small helpers used by the main utilities
// ------------------------------------------------------------

// Returns a random integer within an inclusive [min, max] range
function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

// ------------------------------------------------------------
// Main Functions
// ------------------------------------------------------------

// Generates an array of random integers with a custom length and value range.
// Optionally returns the array sorted in ascending order.
export function generateRandomIntArray({
  len,
  minValue,
  maxValue,
  sort,
}: GenerateRandomIntArray): number[] {
  const returnArr: number[] = new Array(len);

  for (let i = 0; i < returnArr.length; i++) {
    const pushedValue: number = getRandomInt(minValue, maxValue);
    returnArr[i] = pushedValue;
  }

  if (sort === "ascending") {
    const ascendingReturnArr: number[] = returnArr.sort((a, b) => a - b);
    return ascendingReturnArr;
  } else if (sort === "descending") {
    const sortedDownReturnArr: number[] = returnArr.sort((a, b) => b - a);
    return sortedDownReturnArr;
  } else {
    return returnArr;
  }
}
/* console.log(
  generateRandomIntArray({
    len: 100,
    minValue: 1,
    maxValue: 200,
    sort: "ascending",
  }),
); */

// TODO: Array of integers with consistent, extre-range gaps 
// TODO: Array of strings generator
// TODO: Array of floats generator
