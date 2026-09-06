// Graphs: Breadth-first traversal of an adjacency list
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

class BfsTraversal {

    static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
        List<Integer> order = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new ArrayDeque<>();

        queue.add(start);
        visited.add(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);

            for (int neighbor : graph.getOrDefault(node, List.of())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, List.of(1, 2));
        graph.put(1, List.of(0, 3));
        graph.put(2, List.of(0, 3));
        graph.put(3, List.of(1, 2));

        System.out.println(bfs(graph, 0));
    }
}
