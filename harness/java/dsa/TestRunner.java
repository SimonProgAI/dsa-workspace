// Tiny test runner for the DSA workspace. No JUnit, no dependencies.
//
//   import dsa.TestRunner;
//
//   public static void main(String[] args) {
//       TestRunner.assertEqual(twoSumSorted(new int[] {1, 2, 3, 4, 6}, 6), new int[] {1, 3}, "found");
//
//       TestRunner.runJsonCases("two-sum-sorted",
//               in -> twoSumSorted(in.get(0).ints(), in.get(1).asInt()));
//
//       TestRunner.runTests();   // prints the summary, returns 0 on success
//   }
//
// Run it with the "Run Java Active File" task, which compiles this folder to
// harness/java/out and puts it on the classpath.
//
// The `dsa` package is deliberate: a class in the unnamed package cannot be
// imported at all, and the Java language server will not resolve one that comes
// from a classpath library -- so the editor would flag every TestRunner call.
package dsa;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public final class TestRunner {

    private TestRunner() {}

    // --- output ------------------------------------------------------------

    private static final boolean COLOR =
            System.getenv("NO_COLOR") == null && System.getenv("DSA_NO_COLOR") == null;

    private static final String GREEN = COLOR ? "\033[32m" : "";
    private static final String RED = COLOR ? "\033[31m" : "";
    private static final String DIM = COLOR ? "\033[2m" : "";
    private static final String RESET = COLOR ? "\033[0m" : "";

    private static int passed = 0;
    private static int failed = 0;

    // --- converting Java values into Json ----------------------------------

    /** Converts a solution's return value into Json so it can be compared to a test file. */
    public static Json json(Object value) {
        if (value == null) return Json.NULL;
        if (value instanceof Json) return (Json) value;
        if (value instanceof Boolean) return Json.of((Boolean) value);
        if (value instanceof Byte || value instanceof Short || value instanceof Integer || value instanceof Long) {
            return Json.of(((Number) value).longValue());
        }
        if (value instanceof Float || value instanceof Double) return Json.of(((Number) value).doubleValue());
        if (value instanceof Character || value instanceof String) return Json.of(value.toString());

        if (value instanceof int[]) {
            List<Json> out = new ArrayList<>();
            for (int item : (int[]) value) out.add(Json.of(item));
            return Json.array(out);
        }
        if (value instanceof long[]) {
            List<Json> out = new ArrayList<>();
            for (long item : (long[]) value) out.add(Json.of(item));
            return Json.array(out);
        }
        if (value instanceof double[]) {
            List<Json> out = new ArrayList<>();
            for (double item : (double[]) value) out.add(Json.of(item));
            return Json.array(out);
        }
        if (value instanceof boolean[]) {
            List<Json> out = new ArrayList<>();
            for (boolean item : (boolean[]) value) out.add(Json.of(item));
            return Json.array(out);
        }
        if (value instanceof char[]) return Json.of(new String((char[]) value));
        if (value instanceof Object[]) {
            List<Json> out = new ArrayList<>();
            for (Object item : (Object[]) value) out.add(json(item));
            return Json.array(out);
        }
        if (value instanceof Collection) {
            List<Json> out = new ArrayList<>();
            for (Object item : (Collection<?>) value) out.add(json(item));
            return Json.array(out);
        }
        if (value instanceof Map) {
            java.util.LinkedHashMap<String, Json> out = new java.util.LinkedHashMap<>();
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {
                out.put(String.valueOf(entry.getKey()), json(entry.getValue()));
            }
            return Json.object(out);
        }
        throw new IllegalArgumentException(
                "cannot compare a value of type " + value.getClass().getSimpleName() + " against JSON");
    }

    // --- assertions --------------------------------------------------------

    /** Records one assertion and prints its result. Returns whether it passed. */
    public static boolean assertEqual(Object actual, Object expected, String testName) {
        Json actualJson = json(actual);
        Json expectedJson = json(expected);

        if (actualJson.equals(expectedJson)) {
            passed++;
            System.out.println("  " + GREEN + "PASS" + RESET + "  " + testName);
            return true;
        }

        failed++;
        System.out.println("  " + RED + "FAIL" + RESET + "  " + testName);
        System.out.println("        expected: " + expectedJson.dump());
        System.out.println("        actual:   " + actualJson.dump());
        return false;
    }

    /** Records a failure that is not a comparison (a thrown exception, say). */
    public static void recordFailure(String testName, String reason) {
        failed++;
        System.out.println("  " + RED + "FAIL" + RESET + "  " + testName);
        System.out.println("        " + reason);
    }

    /** Prints the summary and returns a process exit code: 0 when all passed. */
    public static int runTests() {
        int total = passed + failed;
        System.out.println();
        if (total == 0) {
            System.out.println(DIM + "no assertions ran" + RESET);
            return 0;
        }
        if (failed == 0) {
            System.out.println(GREEN + passed + " passed" + RESET);
            return 0;
        }
        System.out.println(GREEN + passed + " passed" + RESET + ", " + RED + failed + " failed" + RESET);
        return 1;
    }

    // --- shared JSON test cases (tests/<problem>.json) ----------------------

    /** One case from a test file: a label, an array of arguments, and the expected result. */
    public static final class TestCase {
        public final String name;
        public final Json input;
        public final Json expected;

        TestCase(String name, Json input, Json expected) {
            this.name = name;
            this.input = input;
            this.expected = expected;
        }
    }

    /** What a solution has to supply: given the case's "input" array, produce a result. */
    public interface Solver {
        Object solve(Json input) throws Exception;
    }

    /**
     * Walks up from the working directory (the VS Code tasks set it to the file's
     * folder) looking for the workspace's tests/ folder. $DSA_TESTS_DIR wins.
     */
    public static Path findTestsDir() {
        String override = System.getenv("DSA_TESTS_DIR");
        if (override != null && !override.isEmpty()) return Paths.get(override);

        Path dir = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
        while (dir != null) {
            Path candidate = dir.resolve("tests");
            if (Files.isDirectory(candidate)) return candidate;
            dir = dir.getParent();
        }
        throw new IllegalStateException(
                "no tests/ folder found above the working directory; set DSA_TESTS_DIR to point at it");
    }

    /** Loads tests/&lt;problem&gt;.json and returns "cases" followed by "edgeCases". */
    public static List<TestCase> loadCases(String problem) throws Exception {
        Json file = Json.parseFile(findTestsDir().resolve(problem + ".json"));
        List<TestCase> out = new ArrayList<>();
        collect(file.getOr("cases", Json.NULL), "case", out);
        collect(file.getOr("edgeCases", Json.NULL), "edge", out);
        return out;
    }

    private static void collect(Json group, String label, List<TestCase> out) {
        if (group == null || group.isNull()) return;
        List<Json> entries = group.items();
        for (int i = 0; i < entries.size(); i++) {
            Json entry = entries.get(i);
            String name = entry.has("name") ? entry.get("name").asString() : label + " " + (i + 1);
            out.add(new TestCase(name, entry.get("input"), entry.get("expected")));
        }
    }

    /**
     * Runs every case in tests/&lt;problem&gt;.json through {@code solve}, which
     * receives the case's "input" array and returns anything {@link #json} understands.
     */
    public static void runJsonCases(String problem, Solver solve) {
        List<TestCase> cases;
        try {
            cases = loadCases(problem);
        } catch (Exception error) {
            recordFailure(problem, String.valueOf(error.getMessage()));
            return;
        }

        System.out.println(DIM + problem + RESET);
        for (TestCase testCase : cases) {
            try {
                assertEqual(solve.solve(testCase.input), testCase.expected, testCase.name);
            } catch (Exception error) {  // a crash is a failing test, not a crashed run
                recordFailure(testCase.name, "threw " + error.getClass().getSimpleName() + ": " + error.getMessage());
            }
        }
    }
}
