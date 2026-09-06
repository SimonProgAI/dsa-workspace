"""Linked List: Reverse a singly linked list"""

from __future__ import annotations


class ListNode:
    def __init__(self, val: int, next: "ListNode | None" = None):
        self.val = val
        self.next = next


def reverse_list(head: ListNode | None) -> ListNode | None:
    prev = None
    while head is not None:
        next_node = head.next
        head.next = prev
        prev = head
        head = next_node
    return prev


def print_list(head: ListNode | None) -> None:
    values = []
    while head is not None:
        values.append(str(head.val))
        head = head.next
    print(" -> ".join(values))


if __name__ == "__main__":
    head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))

    reversed_head = reverse_list(head)
    print_list(reversed_head)
