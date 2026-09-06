import { defineConfig } from "vitest/config";

// Test files live next to the solution they test: <problem>/<problem>.test.ts.
export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/harness/**", "**/templates/**"],
    environment: "node",
    passWithNoTests: true,
  },
});
