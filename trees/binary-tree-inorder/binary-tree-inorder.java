// Trees: Inorder traversal of a binary tree
import java.util.ArrayList;
import java.util.List;

class BinaryTreeInorder {

    static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    static void inorder(TreeNode root, List<Integer> result) {
        if (root == null) return;
        inorder(root.left, result);
        result.add(root.val);
        inorder(root.right, result);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(2);
        root.left = new TreeNode(1);
        root.right = new TreeNode(3);

        List<Integer> result = new ArrayList<>();
        inorder(root, result);

        System.out.println(result);
    }
}
