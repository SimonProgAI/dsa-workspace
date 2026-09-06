// Binary Search: Find target index in a sorted array
class BinarySearch {

    static int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = { 1, 3, 5, 7, 9, 11 };
        int target = 7;

        System.out.println("Index: " + binarySearch(nums, target));
    }
}
