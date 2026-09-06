// Dynamic Programming: Fibonacci with memoization
#include <iostream>
#include <vector>
using namespace std;

long long fib(int n, vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}

int main() {
    int n = 20;
    vector<long long> memo(n + 1, -1);

    cout << "fib(" << n << ") = " << fib(n, memo) << endl;

    return 0;
}
