import { RULE_METADATA } from "../oxlint-config.js";
import type { Diagnostic, ReactDoctorConfig } from "../types.js";
import { filterIgnoredDiagnostics, filterInlineSuppressions } from "./filter-diagnostics.js";
import { isLikelyBuildEntry } from "./is-likely-build-entry.js";
import { isTestFilePath } from "./is-test-file.js";

interface MergeAndFilterOptions {
  respectInlineDisables?: boolean;
}

const testFileResultCache = new Map<string, boolean>();
const buildEntryResultCache = new Map<string, boolean>();

export const clearAutoSuppressionCaches = (): void => {
  testFileResultCache.clear();
  buildEntryResultCache.clear();
};

const shouldAutoSuppress = (diagnostic: Diagnostic, directory: string): boolean => {
  const filePath = diagnostic.filePath;

  if (diagnostic.plugin === "knip" && diagnostic.rule === "files") {
    const cacheKey = `${directory}:${filePath}`;
    let isBuildEntry = buildEntryResultCache.get(cacheKey);
    if (isBuildEntry === undefined) {
      isBuildEntry = isLikelyBuildEntry(filePath, directory);
      buildEntryResultCache.set(cacheKey, isBuildEntry);
    }
    if (isBuildEntry) return true;
  }

  const ruleKey = `${diagnostic.plugin}/${diagnostic.rule}`;
  const metadata = RULE_METADATA.get(ruleKey);
  if (metadata?.tags.has("test-noise")) {
    let isTest = testFileResultCache.get(filePath);
    if (isTest === undefined) {
      isTest = isTestFilePath(filePath);
      testFileResultCache.set(filePath, isTest);
    }
    if (isTest) return true;
  }

  return false;
};

export const mergeAndFilterDiagnostics = (
  mergedDiagnostics: Diagnostic[],
  directory: string,
  userConfig: ReactDoctorConfig | null,
  readFileLinesSync: (filePath: string) => string[] | null,
  options: MergeAndFilterOptions = {},
): Diagnostic[] => {
  const autoFiltered = mergedDiagnostics.filter(
    (diagnostic) => !shouldAutoSuppress(diagnostic, directory),
  );
  const filtered = userConfig
    ? filterIgnoredDiagnostics(autoFiltered, userConfig, directory, readFileLinesSync)
    : autoFiltered;
  if (options.respectInlineDisables === false) return filtered;
  return filterInlineSuppressions(filtered, directory, readFileLinesSync);
};
