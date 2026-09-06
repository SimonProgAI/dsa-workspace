"""Greedy: Activity Selection (maximum non-overlapping activities)"""


def activity_selection(activities: list[tuple[int, int]]) -> int:
    activities = sorted(activities, key=lambda a: a[1])

    count = 1
    last_end = activities[0][1]

    for start, end in activities[1:]:
        if start >= last_end:
            count += 1
            last_end = end

    return count


if __name__ == "__main__":
    activities = [(1, 3), (2, 5), (4, 6), (6, 7), (5, 9), (8, 9)]
    print(f"Max activities: {activity_selection(activities)}")
