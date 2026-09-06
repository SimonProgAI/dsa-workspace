// Two Pointers: Two Sum on a sorted array
//
// Not `public class`: a public class must live in a file named after it, and
// these files are kebab-case. The single-file launcher runs it either way.
import dsa.TestRunner;

class TwoSumSorted {

    static int[] twoSumSorted(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) return new int[] { left, right };
            if (sum < target) left++;
            else right--;
        }
        return new int[] { -1, -1 };
    }

    public static void main(String[] args) {
        int[] nums = { 1, 2, 3, 4, 6 };
        int target = 6;

        int[] result = twoSumSorted(nums, target);
        System.out.println("Indices: " + result[0] + ", " + result[1]);

        // Every case in tests/two-sum-sorted.json, the same file the other languages read.
        // TestRunner and Json come from harness/java/out, which the run task puts on the classpath.
        TestRunner.runJsonCases("two-sum-sorted",
                in -> twoSumSorted(in.get(0).ints(), in.get(1).asInt()));

        TestRunner.runTests();
    }
}
