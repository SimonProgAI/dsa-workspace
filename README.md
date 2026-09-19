# DSA Workspace

A multi-language workspace for practicing Data Structures & Algorithms — currently wired up for **C++**, **Python**, **Java**, and **TypeScript**, with VS Code run/debug working out of the box and one set of shared test cases per problem that every language reads.

## AI Usage Disclaimer

AI (Claude) was used to bootstrap this workspace — specifically to:

- create the folder structure and category layout,
- set up the VS Code run/debug configuration (`.vscode/launch.json`, `.vscode/tasks.json`, `.vscode/settings.json`),
- write the test harnesses in `harness/` and the templates in `templates/`,
- write this README.

**The solutions themselves are not AI-generated.** Every problem solution committed to this repository from here on is implemented by me, 100% human-written. The AI-generated scaffolding exists only so that solving problems requires zero setup — it does not solve them.

**AI may be used to generate test cases, but never to implement solutions or write the logic of the tests themselves.** Filling in a `tests/<problem>.json` with inputs and expected outputs is data entry and fair game. Deciding *how* a solution works, and writing the code that checks it, is not.

**AI may also be used as a sounding board for naming conventions, and to carry out the resulting rename.** Arguing over whether a returned array should be called `result`, `arr` or `resultArr` is a discussion about readability, and applying the winner across a file is a glorified find-and-replace — I make the call, the AI does the typing. Neither step decides what the code does. The algorithm and its logic stay 100% human-written.

## Purpose

Solve problems in whichever languages you feel like, without setting up a build system per problem. Every file is standalone: open it, hit run or debug, done.

The four languages above are the ones with run/debug configs today; nothing stops you from adding another (see [Adding a New Language](#adding-a-new-language)).

## Folder Structure

```
dsa-workspace/
  .vscode/
    launch.json         # debug configs, one per language (runs the active file)
    tasks.json          # run/build tasks, one per language (runs the active file)
    settings.json       # puts the harnesses on the Java/Python language servers' paths
  harness/              # the test runners themselves — write once, use everywhere
    cpp/test.hpp        #   header-only: assertEqual, runJsonCases, runTests
    cpp/json.hpp        #   minimal JSON reader used by test.hpp
    python/dsatest.py   #   assert_equal, run_json_cases, run_tests, pytest helpers
    java/dsa/TestRunner.java  # assertEqual, runJsonCases, runTests (no JUnit)
    java/dsa/Json.java        # minimal JSON reader used by TestRunner
    ts/dsatest.ts       #   loadCases for Vitest, plus a standalone tsx runner
  tests/                # shared test cases, one JSON file per problem
    remove-occurrences-of-element.json
  templates/            # copy these when starting a new problem
    problem-overview.md
    tests.json
    solution.{cpp,py,java,ts}
    solution.test.ts
  two-pointers/         # one folder per category, created as problems get solved
    remove-occurrences-of-element/
      problem-overview.md    # what the problem is, and how I thought about it
      remove-occurrences-of-element.ts
      use-case/              # the algorithm applied to a realistic scenario
        rts-unit-selection.ts
  sandbox/              # experiments, benchmarks, anything that isn't a DSA problem
    README.md
  conftest.py           # lets pytest find the Python harness with no setup
  package.json          # tsx + vitest for the TypeScript side (npm install once)
  tsconfig.json         # editor type-checking only; nothing is emitted
  vitest.config.ts
```

Category folders are created at the workspace root as problems in those categories get solved — `sliding-window/`, `graphs/`, `trees/`, and so on, each holding one problem folder per problem.

A problem folder holds one file per language the problem was solved in — as few as one, as many as you like — all sharing the problem's name, plus the `problem-overview.md` and an optional `<problem>.test.ts` for Vitest. Solving the same problem in several languages side by side is the point when the comparison is interesting, not an obligation every time.

A problem folder may also hold a `use-case/` subfolder: the same algorithm applied to a realistic scenario, to show where the technique actually earns its keep. Files there are named after the scenario rather than the problem, since the parent folder already names the problem.

`sandbox/` sits outside that scheme entirely; see [Sandbox](#sandbox).

## Adding a New Problem

1. Pick the category folder (or create a new one at the workspace root).
2. Create a new folder named after the problem, in **kebab-case** (e.g. `valid-parentheses`).
3. Copy `templates/problem-overview.md` into it and fill it in *before* coding — see [Problem Overviews](#problem-overviews).
4. Copy `templates/tests.json` to `tests/valid-parentheses.json` and write the cases — see [Adding Test Cases](#adding-test-cases).
5. Copy the `templates/solution.*` files you want into the problem folder, renaming each to the folder's name — `valid-parentheses.cpp`, `valid-parentheses.py`, `valid-parentheses.java`, `valid-parentheses.ts`, or any subset. Come back later and add another language to the same folder whenever you feel like it.
6. Write a self-contained solution in each file (its own `main`, no shared imports across files).
7. Open any one of those files and run/debug it directly — no configuration needed, since `launch.json` and `tasks.json` always target "the currently open file."

Steps 3 and 4 are optional in the sense that nothing breaks without them; a solution file runs fine on its own. They are what make the problem worth re-reading later.

## Naming Conventions

- **Folders & files:** kebab-case, matching the problem name exactly (`remove-occurrences-of-element/remove-occurrences-of-element.py`).
- **Test cases:** `tests/<problem>.json`, the same kebab-case name as the folder — that name is the key the runners look up.
- **Test files:** `<problem>.test.ts` for Vitest, `test_<problem>.py` (snake_case) for pytest, which requires that prefix to collect them.
- **Java classes:** PascalCase, matching the file name in spirit (`merge-sort.java` → `class MergeSort`), and **not** declared `public`. Java requires a *public* class to sit in a file named exactly after it, which a kebab-case file name cannot satisfy — the language server reports `class X is public, should be declared in a file named X.java`. Dropping `public` makes the class package-private, which is legal, silences the error, and changes nothing about how `java <file>.java` runs it. `main` itself still has to be `public static void`.
- **Functions/variables:** idiomatic per language — `camelCase` in Java/TypeScript/C++, `snake_case` in Python.

## Running & Debugging Each Language

Open the file you want to run, then either press **F5** to debug (pick the matching config if prompted) or run the matching task via **Terminal → Run Task…**.

### C++
- **Requires:** a C++ compiler (`g++`) and `gdb` on your `PATH` (e.g. via MinGW-w64 on Windows, or build-essential on Linux/macOS with Xcode CLT).
- **Run task:** `Run C++ Active File` — compiles the open file with `g++ -std=c++17 -I harness/cpp` next to the source, then runs the resulting executable.
- **Debug:** `C++: Debug Active File` — builds first (via the same task as a `preLaunchTask`), then launches `gdb`.
- **Tests:** in the same run. Tests live inside `main`, so running the file runs them.

### Python
- **Requires:** Python 3 on your `PATH`, and the VS Code **Python extension** (ships the `debugpy` debugger).
- **Run task:** `Run Python Active File` — runs `python ${file}` with `harness/python` on `PYTHONPATH`.
- **Debug:** `Python: Debug Active File` — launches with `debugpy`, no extra setup.
- **Tests:** in the same run, or through `pytest` if you prefer (optional, see below).

### Java
- **Requires:** JDK 11+ on your `PATH`, and the VS Code **Extension Pack for Java**.
- **Run task:** `Run Java Active File` — uses Java's single-file source-code launcher (`java YourFile.java`), so no manual `javac` step and no project/classpath setup needed. It depends on `Build Java Test Harness`, which compiles `harness/java` to `harness/java/out` and puts it on the classpath.
- **Debug:** `Java: Debug Active File` — the Java debug extension supports debugging a lone `.java` file directly via `mainClass: "${file}"`.
- **Tests:** in the same run. Because the harness comes from the classpath rather than the source file, a bare `java my-file.java` from a terminal will not find `TestRunner` — use the task, or pass `-cp harness/java/out` yourself.

### TypeScript
- **Requires:** Node.js on your `PATH`, plus one `npm install` in the workspace root for Vitest (`npx tsx` alone works without it, fetching [`tsx`](https://github.com/privatenumber/tsx) on demand).
- **Run task:** `Run TypeScript Active File` — runs `npx tsx ${file}`, no compile step required. The `tsconfig.json` exists purely so the editor resolves `node:*` imports and type-checks as you write; `tsx` and Vitest strip types without consulting it.
- **Type-check:** `npm run typecheck` — the same check the editor runs, across the whole workspace.
- **Debug:** `TypeScript: Debug Active File` — launches the same way under the Node debugger, with source maps handled by `tsx`.
- **Tests:** a separate `<problem>.test.ts` file run by Vitest — `Test TypeScript Active File`, `Test TypeScript (All)`, or `Vitest: Debug Active Test File`.

## Testing

Every language reads the **same** test cases, from one JSON file per problem in `tests/`. Write a case once and all four runners pick it up.

### The shared test file

```jsonc
{
  "problem": "<problem>",
  "signature": "solve(nums: int[], target: int) -> int",
  "notes": "How to read a case: what each element of `input` is, and how non-primitive arguments are encoded.",
  "cases": [
    { "name": "typical input", "input": [[1, 2, 3], 4], "expected": 7 }
  ],
  "edgeCases": [
    { "name": "empty array", "input": [[], 5], "expected": 0 }
  ]
}
```

- `input` is the **argument list**, in order: `input[0]` is the first argument, `input[1]` the second.
- `expected` is the return value.
- `cases` and `edgeCases` are run identically; the split is for your own reading, and the runners label them `case N` / `edge N` when a case has no `name`.
- `problem`, `signature` and `notes` are ignored by the runners. Use `notes` to record how a linked list, tree or graph is encoded — that convention is the part you will forget.

Numbers are compared exactly when both sides are integers, and with a relative tolerance of `1e-9` when either is a float. Integers are parsed as 64-bit (not doubles) in C++ and Java, so large values like `18!` survive exactly.

### C++

`test.hpp` is header-only and dependency-free; `-I harness/cpp` is already in the build task.

```cpp
#include "test.hpp"

int main() {
    dsa::runJsonCases("<problem>", [](const dsa::Json& in) {
        return solve(in[0].ints(), (int)in[1].asInt());
    });

    dsa::assertEqual(solve({1, 2}, 3), 2, "one-off case");

    return dsa::runTests();   // prints the summary, returns 1 if anything failed
}
```

Read arguments off the `Json` input with `.ints()`, `.longs()`, `.doubles()`, `.strings()`, `.matrix()`, `.asInt()`, `.asDouble()`, `.asString()`, `.asBool()`, `.items()`. Return anything `toJson` understands: numbers, strings, `std::vector`, `std::pair`, and nestings of those.

### Python

```python
from dsatest import assert_equal, run_json_cases, run_tests

run_json_cases("<problem>", solve)   # each case's input is splatted into the call
assert_equal(solve([1, 2], 3), 2, "one-off case")
raise SystemExit(run_tests())
```

Results are normalised through JSON before comparison, so returning a tuple and expecting an array works.

**pytest is supported as an alternative** (`pip install pytest`, then `pytest` from anywhere in the workspace — the root `conftest.py` puts the harness on `sys.path`). Because solution files are kebab-case and cannot be imported by name, use the loader:

```python
from dsatest import load_cases, load_solution

solution = load_solution(Path(__file__).parent / "<problem>.py")

@pytest.mark.parametrize("case", load_cases("<problem>"), ids=lambda case: case.name)
def test_solve(case):
    assert solution.solve(*case.input) == case.expected
```

The in-file runner is the default because it needs no install and stops on your breakpoints; pytest is there if you want its reporting.

### Java

No JUnit, no jars to download — `TestRunner` and `Json` are two plain files in `harness/java/dsa`, compiled by the `Build Java Test Harness` task.

```java
import dsa.TestRunner;

TestRunner.runJsonCases("<problem>",
        in -> solve(in.get(0).ints(), in.get(1).asInt()));

TestRunner.assertEqual(solve(new int[] {1, 2}, 3), 2, "one-off case");

TestRunner.runTests();
```

`TestRunner.assertEqual` accepts `int[]`, `int[][]`, boxed numbers, `String`, `List`, `Map` and `Object[]`.

#### Why the harness has a package, and the editor needs a reload

With no build file in the workspace, the Java language server treats **every folder as its own source root, in the default package**. That has two consequences worth knowing, because they shape the whole Java setup:

- A class in one folder can never resolve a class in another, so the harness cannot be shared as *source* — it has to arrive as a compiled library.
- A class in the *unnamed* package cannot be imported at all, and JDT will not resolve one that comes from a library either.

Hence `package dsa`, `import dsa.TestRunner;`, and `harness/java/**` being excluded from the language server's source scan (`java.import.exclusions`) while its compiled classes come back in through `java.project.referencedLibraries`.

One more quirk, learned the hard way: `java.project.referencedLibraries` **only accepts jars**. A class-folder entry is silently dropped from the generated classpath, so `harness/java/out` alone will never satisfy the editor even though it is all `java -cp` needs.

So if the editor reports `package dsa does not exist` (running, testing and debugging are unaffected — their classpath comes from `tasks.json` / `launch.json`):

1. Run `Build Java Test Harness`, then `Package Java Test Harness (jar, for the editor)`.
   That second task needs `jar` on `PATH`. It is often missing when only `java`/`javac` are shimmed through `Common Files\Oracle\Java\javapath` — check with `where jar`, and if it is absent add your real JDK's `bin` (e.g. `C:\Program Files\Java\jdk-25\bin`) to `PATH`.
2. **Reload the window.** The setting is read when the Java project loads, not when it changes.
3. Re-run the jar task whenever you change the harness, or the editor will type-check against a stale copy.

A squiggle that survives all of that may just be a stale decoration — closing and reopening the file clears it. The language server's own verdict is in `%APPDATA%\Code\User\workspaceStorage\*\redhat.java\jdt_ws\.metadata\.log`; look for `N problems reported for /<file>.java`.

### TypeScript (Vitest)

```bash
npm install          # once
npx vitest run       # everything
npx vitest run <problem>         # one problem
npx vitest           # watch mode
```

A test file sits next to the solution and turns each JSON case into an `it(...)`:

```ts
import { describe, expect, it } from "vitest";
import { loadCases } from "../../harness/ts/dsatest";
import { solve } from "./<problem>";

describe("<problem>", () => {
  for (const testCase of loadCases("<problem>")) {
    it(testCase.name, () => {
      const [nums, target] = testCase.input as [number[], number];
      expect(solve(nums, target)).toEqual(testCase.expected);
    });
  }
});
```

For this to work the solution must `export` its function and guard its demo, so importing the file does not run `main()` — `templates/solution.ts` shows the two-line idiom. If you would rather not install anything, `harness/ts/dsatest.ts` also exports `runJsonCases`/`runTests`, which work under plain `npx tsx`.

### Adding Test Cases

1. Create `tests/<problem>.json` from `templates/tests.json` — the file name must match the problem folder name, since that is what the runners look up.
2. Put ordinary inputs in `cases`, and the ones that break naive solutions in `edgeCases`: empty input, one element, all-equal, negatives, zero, the "no answer" case, values that overflow a 32-bit int.
3. Give each case a `name`. It is what the runner prints, so make it say what is being tested.
4. Encode non-primitive arguments as plain data and describe the encoding in `notes` — a linked list as an array of values, a tree as an index-addressed level-order array (children of `i` at `2i+1`/`2i+2`), a graph as an adjacency list indexed by node id.
5. Keep values inside the safe range for every language you use: 64-bit for C++/Java, and `2^53` for TypeScript's `number`. Python does not care, which is exactly why it will not warn you.

## Problem Overviews

Every problem folder gets a `problem-overview.md`, copied from `templates/problem-overview.md` and written **before** the solution. It holds:

- **Summary** — the problem restated in your own words, not the original text.
- **Constraints** — sizes, ranges, and what the problem does *not* guarantee.
- **Examples** — a few inputs and outputs with a reason for each.
- **Edge cases** — kept in sync with the `edgeCases` in the test file.
- **Complexity** — time and space, with the reason, plus the brute force you rejected.
- **Why this category** — the cue in the problem that should make you reach for this technique next time.
- **Thought process** — the wrong turn you took first, the observation that unlocked it, what you got wrong.
- **Links** — LeetCode / GeeksforGeeks / wherever the problem came from.

The Summary and Thought Process sections are the ones that pay off; everything else can be reconstructed from the code.

## Adding a New Language

The four above aren't a closed set — Rust, Zig, Go, C#, whatever comes next all fit the same pattern. To add one:

1. Add a task to `.vscode/tasks.json` that runs (or compiles and runs) `${file}`, with `cwd` set to `${fileDirname}` — e.g. `rustc ${file} -o ${fileDirname}/${fileBasenameNoExtension} && ...` for Rust, `zig run ${file}` for Zig.
2. Add a matching entry to `.vscode/launch.json` if the language has a VS Code debugger worth wiring up (Rust and Zig both debug through CodeLLDB; some languages you may be happy to just run).
3. Drop the file into the problem folder alongside the others, same base name.

Because every config targets the active file rather than a project, nothing else needs to change — no workspace-level manifest, no build graph.

To let the new language read the shared test cases too, add a `harness/<lang>/` runner. Everything it needs is in the existing four, each under ~250 lines:

1. Walk up from the working directory to find `tests/`, honouring `$DSA_TESTS_DIR`.
2. Parse `tests/<problem>.json` — keep integers as 64-bit rather than floats.
3. For each entry in `cases` then `edgeCases`, call the solution with `input` splatted as arguments and compare against `expected`.
4. Print `PASS`/`FAIL` per case and a summary, and return a non-zero exit code when anything failed.

Languages with a JSON parser in their standard library (Rust needs a crate, Go and Zig do not) can skip step 2 entirely.

## Sandbox

`sandbox/` is for everything that isn't a DSA problem: benchmarks, language comparisons, syntax scratchpads, and one-offs that don't belong in a category. One folder per experiment, any languages, any number of files. See [sandbox/README.md](sandbox/README.md).

## Recommended Workflow

1. Write `problem-overview.md` first — at least the Summary, Constraints and Edge Cases sections. Restating the problem is where most of the thinking happens.
2. Write `tests/<problem>.json` next, before any solution exists. Cases written after the fact tend to describe the code you wrote rather than the problem you were given.
3. Open the problem folder for the language you want to practice first, and solve it. Run the file to see the cases go from red to green.
4. Debug with breakpoints to build intuition. If you want the cross-language comparison, re-implement the same solution in another language in the same folder — optional, and worth doing whenever the contrast is interesting. The second language costs almost nothing, because the test cases are already written.
5. Come back to the Thought Process section of the overview once it works, while the wrong turns are still fresh.
6. Keep solutions self-contained — no shared helper libraries — so every file stays runnable and debuggable in isolation, regardless of where it sits in the folder tree. The test harness is the one deliberate exception, and it never touches solution logic.

## Constraints

- Everything runs locally; no cloud services or accounts required.
- No shared build system — each file is compiled/run/debugged independently.
- `.vscode/launch.json` and `.vscode/tasks.json` operate on `${file}` / `${fileDirname}`, so they work at any folder depth without per-problem configuration.
- The C++, Python and Java harnesses have zero third-party dependencies — the JSON parsers are hand-written for exactly that reason. Only the TypeScript side needs `npm install`, and only for Vitest.
- Generated build output (`*.exe`, `harness/java/out/`, `node_modules/`, `__pycache__/`) is gitignored; nothing in the workspace needs it to be committed.
