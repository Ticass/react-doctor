import fs from "node:fs";
import { execSync } from "node:child_process";
import { DEFAULT_BRANCH_CANDIDATES, SOURCE_FILE_PATTERN } from "../constants.js";
import type { DiffInfo } from "../types.js";

interface GitHubPullRequestEventBranch {
  ref?: string;
  sha?: string;
}

interface GitHubPullRequestEvent {
  pull_request?: {
    base?: GitHubPullRequestEventBranch;
    head?: GitHubPullRequestEventBranch;
  };
}

const getGitHubPullRequestEvent = (): GitHubPullRequestEvent | null => {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) {
    return null;
  }

  try {
    const eventContents = fs.readFileSync(eventPath, "utf8");
    return JSON.parse(eventContents) as GitHubPullRequestEvent;
  } catch {
    return null;
  }
};

const getGitHubActionsHeadBranch = (): string | null => {
  const githubHeadRef = process.env.GITHUB_HEAD_REF;
  if (githubHeadRef) {
    return githubHeadRef;
  }

  const event = getGitHubPullRequestEvent();
  return event?.pull_request?.head?.ref ?? null;
};

const getGitHubActionsBaseBranch = (): string | null => {
  const githubBaseRef = process.env.GITHUB_BASE_REF;
  if (githubBaseRef) {
    return githubBaseRef;
  }

  const event = getGitHubPullRequestEvent();
  return event?.pull_request?.base?.ref ?? null;
};

const getGitHubActionsBaseSha = (): string | null => {
  const event = getGitHubPullRequestEvent();
  return event?.pull_request?.base?.sha ?? null;
};

const getCurrentBranch = (directory: string): string | null => {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: directory,
      stdio: "pipe",
    })
      .toString()
      .trim();

    if (branch === "HEAD") {
      return getGitHubActionsHeadBranch();
    }

    return branch;
  } catch {
    return getGitHubActionsHeadBranch();
  }
};

const detectDefaultBranch = (directory: string): string | null => {
  const githubActionsBaseBranch = getGitHubActionsBaseBranch();
  if (githubActionsBaseBranch) {
    return githubActionsBaseBranch;
  }

  try {
    const reference = execSync("git symbolic-ref refs/remotes/origin/HEAD", {
      cwd: directory,
      stdio: "pipe",
    })
      .toString()
      .trim();
    return reference.replace("refs/remotes/origin/", "");
  } catch {
    for (const candidate of DEFAULT_BRANCH_CANDIDATES) {
      try {
        execSync(`git rev-parse --verify ${candidate}`, {
          cwd: directory,
          stdio: "pipe",
        });
        return candidate;
      } catch {}
    }
    return null;
  }
};

const resolveBaseBranchReference = (
  directory: string,
  baseBranch: string,
  baseSha: string | null,
): string => {
  const candidateReferences = [
    baseSha,
    `origin/${baseBranch}`,
    `remotes/origin/${baseBranch}`,
    baseBranch,
  ].filter(Boolean) as string[];

  for (const candidateReference of candidateReferences) {
    try {
      execSync(`git rev-parse --verify ${candidateReference}`, {
        cwd: directory,
        stdio: "pipe",
      });
      return candidateReference;
    } catch {}
  }

  return baseBranch;
};

const getChangedFilesSinceBranch = (
  directory: string,
  baseBranch: string,
  baseSha: string | null,
): string[] => {
  try {
    const resolvedBaseBranchReference = resolveBaseBranchReference(directory, baseBranch, baseSha);
    const mergeBase = execSync(`git merge-base ${resolvedBaseBranchReference} HEAD`, {
      cwd: directory,
      stdio: "pipe",
    })
      .toString()
      .trim();

    const output = execSync(`git diff --name-only --diff-filter=ACMR --relative ${mergeBase}`, {
      cwd: directory,
      stdio: "pipe",
    })
      .toString()
      .trim();

    if (!output) return [];
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
};

const getUncommittedChangedFiles = (directory: string): string[] => {
  try {
    const output = execSync("git diff --name-only --diff-filter=ACMR --relative HEAD", {
      cwd: directory,
      stdio: "pipe",
    })
      .toString()
      .trim();
    if (!output) return [];
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
};

export const getDiffInfo = (directory: string, explicitBaseBranch?: string): DiffInfo | null => {
  const currentBranch = getCurrentBranch(directory);
  if (!currentBranch) return null;

  const baseBranch = explicitBaseBranch ?? detectDefaultBranch(directory);
  if (!baseBranch) return null;

  if (currentBranch === baseBranch) {
    const uncommittedFiles = getUncommittedChangedFiles(directory);
    if (uncommittedFiles.length === 0) return null;
    return { currentBranch, baseBranch, changedFiles: uncommittedFiles, isCurrentChanges: true };
  }

  const changedFiles = getChangedFilesSinceBranch(directory, baseBranch, getGitHubActionsBaseSha());
  return { currentBranch, baseBranch, changedFiles };
};

export const filterSourceFiles = (filePaths: string[]): string[] =>
  filePaths.filter((filePath) => SOURCE_FILE_PATTERN.test(filePath));
