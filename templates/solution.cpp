// <Category>: <Problem Name>
#include <iostream>
#include <vector>

#include "test.hpp"  // harness/cpp is on the include path (see .vscode/tasks.json)

using namespace std;

// Your solution. Keep it self-contained: no headers outside the standard library.
vector<int> solve(const vector<int>& nums, int target) {
    return {};
}

int main() {
    // A quick manual run, so F5 still shows you something without a test file.
    cout << "..." << endl;

    // Every case in tests/<problem>.json. `in` is the case's "input" array:
    // in[0], in[1], ... are the arguments, converted with .ints() / .asInt() /
    // .asString() / .matrix() / .doubles().
    dsa::runJsonCases("<problem>", [](const dsa::Json& in) {
        return solve(in[0].ints(), (int)in[1].asInt());
    });

    // Or assert a single value directly:
    // dsa::assertEqual(solve({1, 2}, 3), std::vector<int>{0, 1}, "my own case");

    return dsa::runTests();
}
