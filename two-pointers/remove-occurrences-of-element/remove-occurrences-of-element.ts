const caseArr: number[] = [0, 1, 3, 0, 2, 2, 4, 2];
const element: number = 0;
// expected output: 6

export function removeOccurrencesOfElement(
  intArr: number[],
  ele: number,
  isSlicedArr: boolean = false,
) {
  let k: number = 0;
  for (let i = 0; i < intArr.length; i++) {
    if (intArr[i] !== ele) {
      // The swap happens only when intArr[i] !== ele
      // The swap pulls non-ele values to the left
      let temp = intArr[k];
      intArr[k] = intArr[i];
      intArr[i] = temp;
      // K marks where the non-ele value should be placed
      k++;
      // ele gets overwritten with non-ele and passively pushed to the right
    }
    // console.log(intArr);
  }

  /* console.log("k =", k);
  console.log("mutated in-place intArr:", intArr);
  console.log("sliced prefix:", intArr.slice(0, k)); */

  return { k, prefix: isSlicedArr ? intArr.slice(0, k) : intArr };
}


removeOccurrencesOfElement(caseArr, element); 
