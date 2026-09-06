// Greedy: Activity Selection (maximum non-overlapping activities)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Activity {
    int start, end;
};

int activitySelection(vector<Activity> activities) {
    sort(activities.begin(), activities.end(), [](const Activity& a, const Activity& b) {
        return a.end < b.end;
    });

    int count = 1;
    int lastEnd = activities[0].end;

    for (size_t i = 1; i < activities.size(); i++) {
        if (activities[i].start >= lastEnd) {
            count++;
            lastEnd = activities[i].end;
        }
    }
    return count;
}

int main() {
    vector<Activity> activities = {{1, 3}, {2, 5}, {4, 6}, {6, 7}, {5, 9}, {8, 9}};

    cout << "Max activities: " << activitySelection(activities) << endl;

    return 0;
}
