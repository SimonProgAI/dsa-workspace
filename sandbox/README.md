# Sandbox

Anything that isn't a DSA problem: experiments, benchmarks, language comparisons, syntax scratchpads, odd one-offs, and code that doesn't fit any category folder.

Example: timing how long C++ takes to count to one billion versus Python.

## Rules (deliberately loose)

- **Group by experiment**, not by category: one folder per experiment (kebab-case), e.g. `count-to-a-billion/`.
- **Any language, any number of files** — whatever the experiment needs.
- **Still self-contained.** Each file keeps its own entry point so F5 / Run Task works on the open file, exactly like everywhere else in the workspace.
- **Naming is free-form**, except Java: the file name must match its public class name (`CountToABillion.java` → `public class CountToABillion`), since Java's single-file launcher requires it.

Nothing here is meant to be a reference solution — treat it as throwaway unless a file says otherwise.
