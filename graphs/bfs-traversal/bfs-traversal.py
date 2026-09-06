"""Graphs: Breadth-first traversal of an adjacency list"""

from collections import deque


def bfs(graph: dict[int, list[int]], start: int) -> list[int]:
    order = []
    visited = {start}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


if __name__ == "__main__":
    graph = {
        0: [1, 2],
        1: [0, 3],
        2: [0, 3],
        3: [1, 2],
    }

    print(bfs(graph, 0))
