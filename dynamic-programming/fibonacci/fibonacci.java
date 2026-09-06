// Dynamic Programming: Fibonacci with memoization
import java.util.HashMap;
import java.util.Map;

class Fibonacci {

    static Map<Integer, Long> memo = new HashMap<>();

    static long fib(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long result = fib(n - 1) + fib(n - 2);
        memo.put(n, result);
        return result;
    }

    public static void main(String[] args) {
        int n = 20;
        System.out.println("fib(" + n + ") = " + fib(n));
    }
}
