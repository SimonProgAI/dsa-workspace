// Math: Greatest Common Divisor (Euclidean algorithm)
class Gcd {

    static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    public static void main(String[] args) {
        int a = 48, b = 18;
        System.out.println("gcd(" + a + ", " + b + ") = " + gcd(a, b));
    }
}
