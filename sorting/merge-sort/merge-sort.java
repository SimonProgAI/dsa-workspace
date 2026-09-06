// Sorting: Merge Sort
import java.util.Arrays;

class MergeSort {

    static void merge(int[] nums, int left, int mid, int right) {
        int[] leftHalf = Arrays.copyOfRange(nums, left, mid + 1);
        int[] rightHalf = Arrays.copyOfRange(nums, mid + 1, right + 1);

        int i = 0, j = 0, k = left;
        while (i < leftHalf.length && j < rightHalf.length) {
            nums[k++] = (leftHalf[i] <= rightHalf[j]) ? leftHalf[i++] : rightHalf[j++];
        }
        while (i < leftHalf.length) nums[k++] = leftHalf[i++];
        while (j < rightHalf.length) nums[k++] = rightHalf[j++];
    }

    static void mergeSort(int[] nums, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(nums, left, mid);
        mergeSort(nums, mid + 1, right);
        merge(nums, left, mid, right);
    }

    public static void main(String[] args) {
        int[] nums = { 5, 2, 4, 1, 3, 6 };

        mergeSort(nums, 0, nums.length - 1);

        System.out.println(Arrays.toString(nums));
    }
}
