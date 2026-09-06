// Trees: Inorder traversal of a binary tree

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function inorder(root: TreeNode | null, result: number[]): void {
  if (root === null) return;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
}

function main(): void {
  const root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

  const result: number[] = [];
  inorder(root, result);
  console.log(result);
}

main();
