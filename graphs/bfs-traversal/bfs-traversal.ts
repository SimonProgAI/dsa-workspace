// Graphs: Breadth-first traversal of an adjacency list

function bfs(graph: Map<number, number[]>, start: number): number[] {
  const order: number[] = [];
  const visited = new Set<number>([start]);
  const queue: number[] = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

function main(): void {
  const graph = new Map<number, number[]>([
    [0, [1, 2]],
    [1, [0, 3]],
    [2, [0, 3]],
    [3, [1, 2]],
  ]);

  console.log(bfs(graph, 0));
}

main();
