// Trees: Inorder traversal of a binary tree
#include <iostream>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root, vector<int>& result) {
    if (root == nullptr) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

int main() {
    TreeNode* root = new TreeNode(2);
    root->left = new TreeNode(1);
    root->right = new TreeNode(3);

    vector<int> result;
    inorder(root, result);

    for (int val : result) cout << val << " ";
    cout << endl;

    return 0;
}
