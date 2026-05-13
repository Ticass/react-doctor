import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 30_000,
    include: ["tests/**/*.test.ts"],
    // HACK: several upstream test files create scratch fixture
    // directories with overlapping paths and rely on shared module-level
    // caches in `discover-project` / `load-config`. Running file-parallel
    // produces flaky cross-talk failures (e.g. namespace-hooks.test.ts
    // seeing diagnostics from a sibling file's fixture). Sequential file
    // execution mirrors upstream's `vp test run` semantics and fixes it.
    fileParallelism: false,
  },
});
