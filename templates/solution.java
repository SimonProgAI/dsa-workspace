// <Category>: <Problem Name>
//
// The file name stays kebab-case (<problem>.java); only the class is PascalCase.
// Note there is no `public` on the class: a *public* class must live in a file
// named after it, which kebab-case file names cannot satisfy. Package-private
// is legal Java and the single-file launcher runs it exactly the same.
//
// Run it with the "Run Java Active File" task, which puts the harness on the
// classpath -- plain `java <problem>.java` will not find TestRunner.
import dsa.TestRunner;

class SolutionName {

    // Your solution. Keep it self-contained: no imports outside the JDK.
    static int[] solve(int[] nums, int target) {
        return new int[] {};
    }

    public static void main(String[] args) {
        // A quick manual run, so F5 still shows you something without a test file.
        System.out.println("...");

        // Every case in tests/<problem>.json. `in` is the case's "input" array:
        // in.get(0), in.get(1), ... are the arguments, converted with .ints() /
        // .asInt() / .asString() / .matrix() / .doubles().
        TestRunner.runJsonCases("<problem>",
                in -> solve(in.get(0).ints(), in.get(1).asInt()));

        // Or assert a single value directly:
        // TestRunner.assertEqual(solve(new int[] {1, 2}, 3), new int[] {0, 1}, "my own case");

        TestRunner.runTests();
    }
}
