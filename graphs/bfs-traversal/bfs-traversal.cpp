// Graphs: Breadth-first traversal of an adjacency list
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

vector<int> bfs(unordered_map<int, vector<int>>& graph, int start) {
    vector<int> order;
    unordered_set<int> visited;
    queue<int> q;

    q.push(start);
    visited.insert(start);

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);

        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return order;
}

int main() {
    unordered_map<int, vector<int>> graph = {
        {0, {1, 2}},
        {1, {0, 3}},
        {2, {0, 3}},
        {3, {1, 2}}
    };

    vector<int> order = bfs(graph, 0);
    for (int node : order) cout << node << " ";
    cout << endl;

    return 0;
}
