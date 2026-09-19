// ------------------------------------------------------------
// Scenario: Using the remove-occurrences algorithm in an RTS game
// ------------------------------------------------------------

// Each unit in the selection has a name and id.
interface Unit {
  name: string;
  unitId: number;
}

// The user selects a group of mixed units (intArr): 
// Infantry, Worker and Healer units.
const unitSelectionArr: Unit[] = [
  { name: "Infantry", unitId: 1 },
  { name: "Infantry", unitId: 1 },
  { name: "Infantry", unitId: 1 },
  { name: "Infantry", unitId: 1 },
  { name: "Infantry", unitId: 1 },
  { name: "Worker", unitId: 3 },
  { name: "Worker", unitId: 3 },
  { name: "Worker", unitId: 3 },
  { name: "Healer", unitId: 2 },
  { name: "Healer", unitId: 2 },
];

// ------------------------------------------------------------
// removeUnitFromSelection
// Removes all units matching the given id (ele) from the selection (intArr).
// This simulates ctrl + clicking a unit type in an RTS to deselect it.
// ------------------------------------------------------------ 
function removeUnitFromSelection(
  unitArr: Unit[],
  id: number,
  isUnitRemoved: boolean = true,
) {
  let k = 0;
  for (let i = 0; i < unitArr.length; i++) {
    if (unitArr[i].unitId !== id) {
      let temp = unitArr[k];
      unitArr[k] = unitArr[i];
      unitArr[i] = temp;
      k++;
    }
  }

  console.log("Initial selection length: ", unitArr.length );
  console.log("--------------------")
  console.log("Updated selection length: ", k);
  console.log("--------------------")
  console.log("Updated selection:", unitArr.slice(0, k));

  return { k, updatedSelection: isUnitRemoved ? unitArr.slice(0, k) : unitArr };
}

// ------------------------------------------------------------
// Example:
// The user wants to remove all Worker units from their selection.
// Holding ctrl and clicking a Worker triggers this removal.
// ------------------------------------------------------------
removeUnitFromSelection(unitSelectionArr, 3, true);

// ------------------------------------------------------------
// Output:
// ------------------------------------------------------------
/* 
Initial selection length:  10
--------------------
Updated selection length:  7
--------------------
Updated selection: [
  { name: 'Infantry', unitId: 1 },
  { name: 'Infantry', unitId: 1 },
  { name: 'Infantry', unitId: 1 },
  { name: 'Infantry', unitId: 1 },
  { name: 'Infantry', unitId: 1 },
  { name: 'Healer', unitId: 2 },
  { name: 'Healer', unitId: 2 }
]
*/

