import { runJsonCases, runTests} from "../../harness/ts/dsatest";
import { removeOccurrencesOfElement } from "./remove-occurrences-of-element";


runJsonCases(
  "remove-occurrences-of-element",
  (arr, ele) => removeOccurrencesOfElement(ele, arr, true),
);

runTests();
