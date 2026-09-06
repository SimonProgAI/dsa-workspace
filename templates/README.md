# Templates

Starting points to copy, not files to import. Nothing here runs on its own —
Vitest and pytest are both configured to skip this folder.

## Starting a new problem

```
<category>/<problem>/
  problem-overview.md      <- cp templates/problem-overview.md, fill it in first
  <problem>.cpp            <- cp templates/solution.cpp
  <problem>.py             <- cp templates/solution.py
  <problem>.java           <- cp templates/solution.java, rename the class to PascalCase
  <problem>.ts             <- cp templates/solution.ts
  <problem>.test.ts        <- cp templates/solution.test.ts (only if you want Vitest)

tests/<problem>.json       <- cp templates/tests.json
```

Take only the languages you want; a problem folder with one file in it is fine.

Then replace every `<problem>` placeholder with the folder name (which is also
the test file's name), and every `solve` with the real function name.

## What each template gives you

| File | Notes |
| --- | --- |
| `problem-overview.md` | Fill in before coding. The Summary and Thought Process sections are the ones worth the time. |
| `tests.json` | The shared case file all languages read. `input` is the argument list; `expected` is the return value. |
| `solution.cpp` | Includes `test.hpp`, runs the JSON cases in `main`, returns the exit code from `runTests()`. |
| `solution.py` | Imports `dsatest` inside the `__main__` block so the module stays importable by pytest. |
| `solution.java` | Kebab-case file name, PascalCase class. Needs the "Run Java Active File" task for the classpath. |
| `solution.ts` | Exports the solution and guards the demo, so Vitest can import it without side effects. |
| `solution.test.ts` | Turns every JSON case into a Vitest `it(...)`. |
