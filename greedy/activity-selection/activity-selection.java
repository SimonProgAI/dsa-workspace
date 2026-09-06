// Greedy: Activity Selection (maximum non-overlapping activities)
import java.util.Arrays;

class ActivitySelection {

    static int activitySelection(int[][] activities) {
        Arrays.sort(activities, (a, b) -> a[1] - b[1]);

        int count = 1;
        int lastEnd = activities[0][1];

        for (int i = 1; i < activities.length; i++) {
            if (activities[i][0] >= lastEnd) {
                count++;
                lastEnd = activities[i][1];
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[][] activities = {
            { 1, 3 }, { 2, 5 }, { 4, 6 }, { 6, 7 }, { 5, 9 }, { 8, 9 }
        };

        System.out.println("Max activities: " + activitySelection(activities));
    }
}
