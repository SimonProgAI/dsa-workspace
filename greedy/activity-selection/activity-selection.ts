// Greedy: Activity Selection (maximum non-overlapping activities)

type Activity = [start: number, end: number];

function activitySelection(activities: Activity[]): number {
  const sorted = [...activities].sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }

  return count;
}

function main(): void {
  const activities: Activity[] = [
    [1, 3],
    [2, 5],
    [4, 6],
    [6, 7],
    [5, 9],
    [8, 9],
  ];

  console.log(`Max activities: ${activitySelection(activities)}`);
}

main();
