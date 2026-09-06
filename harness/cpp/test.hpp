// Tiny header-only test runner for the DSA workspace. No dependencies.
//
//   #include "test.hpp"            // -I harness/cpp is set by the VS Code tasks
//
//   int main() {
//       dsa::assertEqual(twoSumSorted({1, 2, 3, 4, 6}, 6), std::vector<int>{1, 3}, "found");
//
//       dsa::runJsonCases("two-sum-sorted", [](const dsa::Json& in) {
//           return twoSumSorted(in[0].ints(), (int)in[1].asInt());
//       });
//
//       return dsa::runTests();   // prints the summary, returns 0 on success
//   }
#pragma once

#include <cstdio>
#include <cstdlib>
#include <filesystem>
#include <iostream>
#include <string>
#include <utility>
#include <vector>

#include "json.hpp"

namespace dsa {

// ---------------------------------------------------------------------------
// Converting C++ values into Json so they can be compared against a test file.
// ---------------------------------------------------------------------------

inline Json toJson(const Json& value) { return value; }
inline Json toJson(bool value) { return Json::boolean(value); }
inline Json toJson(int value) { return Json::integer(value); }
inline Json toJson(long value) { return Json::integer(value); }
inline Json toJson(long long value) { return Json::integer(value); }
inline Json toJson(unsigned value) { return Json::integer(static_cast<long long>(value)); }
inline Json toJson(unsigned long value) { return Json::integer(static_cast<long long>(value)); }
inline Json toJson(unsigned long long value) { return Json::integer(static_cast<long long>(value)); }
inline Json toJson(double value) { return Json::real(value); }
inline Json toJson(float value) { return Json::real(value); }
inline Json toJson(char value) { return Json::string(std::string(1, value)); }
inline Json toJson(const char* value) { return Json::string(value); }
inline Json toJson(const std::string& value) { return Json::string(value); }
inline Json toJson(std::nullptr_t) { return Json::null(); }

template <class T>
Json toJson(const std::vector<T>& values) {
    std::vector<Json> out;
    out.reserve(values.size());
    for (const T& value : values) out.push_back(toJson(value));
    return Json::array(std::move(out));
}

template <class A, class B>
Json toJson(const std::pair<A, B>& value) {
    return Json::array({toJson(value.first), toJson(value.second)});
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

namespace detail {

inline bool colorEnabled() {
    static const bool enabled = (std::getenv("NO_COLOR") == nullptr && std::getenv("DSA_NO_COLOR") == nullptr);
    return enabled;
}

inline const char* green() { return colorEnabled() ? "\033[32m" : ""; }
inline const char* red() { return colorEnabled() ? "\033[31m" : ""; }
inline const char* dim() { return colorEnabled() ? "\033[2m" : ""; }
inline const char* reset() { return colorEnabled() ? "\033[0m" : ""; }

struct Totals {
    int passed = 0;
    int failed = 0;
};

inline Totals& totals() {
    static Totals value;
    return value;
}

}  // namespace detail

// Records one assertion and prints its result immediately. Returns whether it
// passed, so a caller can branch on it if needed.
template <class Actual, class Expected>
bool assertEqual(const Actual& actual, const Expected& expected, const std::string& testName) {
    Json actualJson = toJson(actual);
    Json expectedJson = toJson(expected);

    if (actualJson == expectedJson) {
        detail::totals().passed++;
        std::cout << "  " << detail::green() << "PASS" << detail::reset() << "  " << testName << "\n";
        return true;
    }

    detail::totals().failed++;
    std::cout << "  " << detail::red() << "FAIL" << detail::reset() << "  " << testName << "\n"
              << "        expected: " << expectedJson.dump() << "\n"
              << "        actual:   " << actualJson.dump() << "\n";
    return false;
}

// Records a failure that is not a comparison (a thrown exception, say).
inline void recordFailure(const std::string& testName, const std::string& reason) {
    detail::totals().failed++;
    std::cout << "  " << detail::red() << "FAIL" << detail::reset() << "  " << testName << "\n"
              << "        " << reason << "\n";
}

// Prints the summary and returns a process exit code: 0 when everything passed.
inline int runTests() {
    const detail::Totals& t = detail::totals();
    int total = t.passed + t.failed;

    std::cout << "\n";
    if (total == 0) {
        std::cout << detail::dim() << "no assertions ran" << detail::reset() << "\n";
        return 0;
    }
    if (t.failed == 0) {
        std::cout << detail::green() << t.passed << " passed" << detail::reset() << "\n";
        return 0;
    }
    std::cout << detail::green() << t.passed << " passed" << detail::reset() << ", "
              << detail::red() << t.failed << " failed" << detail::reset() << "\n";
    return 1;
}

// ---------------------------------------------------------------------------
// Shared JSON test cases (tests/<problem>.json)
// ---------------------------------------------------------------------------

struct TestCase {
    std::string name;  // label for output, e.g. "case 2" or the case's own "name"
    Json input;        // array of arguments
    Json expected;
};

namespace detail {

// Walks up from the working directory (the VS Code tasks set it to the file's
// folder) looking for the workspace's tests/ folder. $DSA_TESTS_DIR wins.
inline std::filesystem::path findTestsDir() {
    namespace fs = std::filesystem;
    if (const char* override = std::getenv("DSA_TESTS_DIR")) return fs::path(override);

    fs::path dir = fs::current_path();
    while (true) {
        if (fs::is_directory(dir / "tests")) return dir / "tests";
        if (!dir.has_parent_path() || dir.parent_path() == dir) break;
        dir = dir.parent_path();
    }
    throw std::runtime_error(
        "no tests/ folder found above the working directory; set DSA_TESTS_DIR to point at it");
}

inline void collect(const Json& group, const std::string& label, std::vector<TestCase>& out) {
    if (group.isNull()) return;
    for (std::size_t i = 0; i < group.size(); ++i) {
        const Json& entry = group[i];
        TestCase testCase;
        testCase.name = entry.contains("name") ? entry["name"].asString()
                                               : label + " " + std::to_string(i + 1);
        testCase.input = entry["input"];
        testCase.expected = entry["expected"];
        out.push_back(std::move(testCase));
    }
}

}  // namespace detail

// Loads tests/<problem>.json and returns "cases" followed by "edgeCases".
inline std::vector<TestCase> loadCases(const std::string& problem) {
    std::filesystem::path path = detail::findTestsDir() / (problem + ".json");
    Json file = Json::parseFile(path.string());

    std::vector<TestCase> out;
    detail::collect(file.get("cases"), "case", out);
    detail::collect(file.get("edgeCases"), "edge", out);
    return out;
}

// Runs every case in tests/<problem>.json through `solve`, which receives the
// case's "input" array and returns anything toJson() understands.
template <class Solve>
void runJsonCases(const std::string& problem, Solve solve) {
    std::vector<TestCase> cases;
    try {
        cases = loadCases(problem);
    } catch (const std::exception& error) {
        recordFailure(problem, error.what());
        return;
    }

    std::cout << detail::dim() << problem << detail::reset() << "\n";
    for (const TestCase& testCase : cases) {
        try {
            assertEqual(solve(testCase.input), testCase.expected, testCase.name);
        } catch (const std::exception& error) {
            recordFailure(testCase.name, std::string("threw: ") + error.what());
        }
    }
}

}  // namespace dsa
