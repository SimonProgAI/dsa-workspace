// Linked List: Reverse a singly linked list

class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;

  while (head !== null) {
    const next: ListNode | null = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }

  return prev;
}

function printList(head: ListNode | null): void {
  const values: string[] = [];
  while (head !== null) {
    values.push(String(head.val));
    head = head.next;
  }
  console.log(values.join(" -> "));
}

function main(): void {
  const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));

  const reversed = reverseList(head);
  printList(reversed);
}

main();
