import { execSync } from "node:child_process";

function git(agentDir: string, args: string): string {
  return execSync(`git ${args}`, {
    cwd: agentDir,
    stdio: ["pipe", "pipe", "pipe"],
    encoding: "utf-8",
    timeout: 15_000,
  }).trim();
}

export function ensureRepo(agentDir: string): void {
  try {
    git(agentDir, "rev-parse --git-dir");
  } catch {
    git(agentDir, "init");
    git(agentDir, "add -A");
    git(agentDir, 'commit -m "chore: initial skilluminator bootstrap"');
  }
}

export function commitAll(agentDir: string, message: string): string {
  git(agentDir, "add -A");
  try {
    git(agentDir, `commit -m "${message.replace(/"/g, '\\"')}"`);
    return git(agentDir, "rev-parse --short HEAD");
  } catch {
    // Nothing to commit
    return "";
  }
}

/**
 * Discard all uncommitted changes (staged and unstaged) to tracked files.
 * This is the safe way to undo agent edits that broke the build —
 * unlike `git revert HEAD`, this operates on the working tree, not on commits.
 */
export function discardUncommitted(agentDir: string): void {
  try {
    git(agentDir, "reset HEAD");       // unstage everything
  } catch {
    // May fail if no prior commits exist
  }
  try {
    git(agentDir, "checkout -- .");    // restore tracked files to HEAD
  } catch {
    // Ignore if nothing to restore
  }
}

export function getRecentLog(agentDir: string, n = 20): string {
  try {
    return git(agentDir, `log --oneline --stat -${n}`);
  } catch {
    return "(no git history yet)";
  }
}

export function getCurrentSha(agentDir: string): string {
  try {
    return git(agentDir, "rev-parse --short HEAD");
  } catch {
    return "";
  }
}
