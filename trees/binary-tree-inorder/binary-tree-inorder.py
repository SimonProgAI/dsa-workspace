"""Trees: Inorder traversal of a binary tree"""

from __future__ import annotations


class TreeNode:
    def __init__(self, val: int, left: "TreeNode | None" = None, right: "TreeNode | None" = None):
        self.val = val
        self.left = left
        self.right = right


def inorder(root: TreeNode | None, result: list[int]) -> None:
    if root is None:
        return
    inorder(root.left, result)
    result.append(root.val)
    inorder(root.right, result)


if __name__ == "__main__":
    root = TreeNode(2, TreeNode(1), TreeNode(3))

    result: list[int] = []
    inorder(root, result)
    print(result)
