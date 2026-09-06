// Recursion: Factorial
#include <iostream>
using namespace std;

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int n = 10;
    cout << n << "! = " << factorial(n) << endl;

    return 0;
}
