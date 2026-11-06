module;
#include <vector>
#include <iostream>

export module vector_utils;

export void printVector(std::vector<int> &nums)
{
    std::cout << '{';
    for (int num : nums)
    {
        std::cout << num << ',';
    }
    std::cout << '}';
    std::cout << std::endl;
}
