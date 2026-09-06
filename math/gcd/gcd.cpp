// Math: Greatest Common Divisor (Euclidean algorithm)
#include <iostream>
using namespace std;

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    int a = 48, b = 18;
    cout << "gcd(" << a << ", " << b << ") = " << gcd(a, b) << endl;

    return 0;
}
