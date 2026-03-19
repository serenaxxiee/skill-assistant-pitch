/**
 * Data Collection Module
 *
 * Gathers work patterns from git history, filesystem changes, and other sources.
 * Converts raw activity into structured patterns that can be analyzed for skill generation.
 */

import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// ─── Interfaces ───────────────────────────────────────────────────────────

export interface GitCommitActivity {
  hash: string;
  author: string;
  email: string;
  timestamp: string;
  message: string;
  filesChanged: string[];
}

export interface FileModificationPattern {
  path: string;
  extension: string;
  lastModified: Date;
  sizeBytes: number;
}

export interface WorkPattern {
  type: "git-commit-style" | "file-type-usage" | "file-modification-cluster";
  contentType: string;
  styleAttributes: Record<string, string>;
  frequency: number;
  examples: string[];
}

// ─── Git Data Collection ──────────────────────────────────────────────────

/**
 * Get recent git commits with file changes.
 * Analyzes commit patterns for skill mining.
 */
export function collectGitActivity(
  agentDir: string,
  sinceDaysAgo = 30,
  maxCommits = 100,
): GitCommitActivity[] {
  try {
    const since = new Date(Date.now() - sinceDaysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Get commit metadata
    const log = execSync(
      `git log --all --since="${since}" --pretty=format:"%H|%an|%ae|%aI|%s" -n ${maxCommits}`,
      {
        cwd: agentDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 15_000,
      }
    ).trim();

    if (!log) {
      return [];
    }

    const activities: GitCommitActivity[] = [];

    for (const line of log.split("\n")) {
      const [hash, author, email, timestamp, ...messageParts] = line.split("|");
      const message = messageParts.join("|");

      // Get files changed in this commit
      let filesChanged: string[] = [];
      try {
        const files = execSync(`git diff-tree --no-commit-id --name-only -r ${hash}`, {
          cwd: agentDir,
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 5_000,
        }).trim();
        filesChanged = files ? files.split("\n") : [];
      } catch {
        // Skip if we can't get file list
      }

      activities.push({
        hash,
        author,
        email,
        timestamp,
        message,
        filesChanged,
      });
    }

    return activities;
  } catch {
    return [];
  }
}

// ─── Filesystem Data Collection ───────────────────────────────────────────

/**
 * Scan a directory for files matching a pattern.
 * Tracks file types and modification times for pattern detection.
 */
export function collectFileModifications(
  rootDir: string,
  maxDepth = 3,
  excludeDirs = ["node_modules", ".git", "dist", "build"],
): FileModificationPattern[] {
  const results: FileModificationPattern[] = [];

  function scan(dir: string, depth: number): void {
    if (depth > maxDepth) return;

    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!excludeDirs.includes(entry.name)) {
            scan(join(dir, entry.name), depth + 1);
          }
        } else if (entry.isFile()) {
          const path = join(dir, entry.name);
          const stats = statSync(path);
          const ext = entry.name.includes(".") ? entry.name.split(".").pop() || "" : "";

          results.push({
            path,
            extension: ext,
            lastModified: stats.mtime,
            sizeBytes: stats.size,
          });
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  scan(rootDir, 0);
  return results;
}

// ─── Pattern Analysis ─────────────────────────────────────────────────────

/**
 * Analyze git commits for repeated patterns.
 * Groups by commit message prefix, author patterns, file patterns.
 */
export function analyzeGitPatterns(activities: GitCommitActivity[]): WorkPattern[] {
  const patterns: WorkPattern[] = [];

  // Pattern 1: Commit message prefix patterns (e.g., "feat:", "fix:", "chore:")
  const prefixCounts = new Map<string, { count: number; examples: string[] }>();

  for (const activity of activities) {
    const match = activity.message.match(/^([a-z]+):/i);
    if (match) {
      const prefix = match[1].toLowerCase();
      const existing = prefixCounts.get(prefix) || { count: 0, examples: [] };
      existing.count++;
      if (existing.examples.length < 5) {
        existing.examples.push(activity.message);
      }
      prefixCounts.set(prefix, existing);
    }
  }

  for (const [prefix, data] of prefixCounts) {
    if (data.count >= 3) {
      patterns.push({
        type: "git-commit-style",
        contentType: "commit-message",
        styleAttributes: { prefix },
        frequency: data.count,
        examples: data.examples,
      });
    }
  }

  // Pattern 2: File type modification patterns
  const fileTypeCounts = new Map<string, { count: number; examples: string[] }>();

  for (const activity of activities) {
    for (const file of activity.filesChanged) {
      const ext = file.includes(".") ? file.split(".").pop() || "" : "";
      if (ext) {
        const existing = fileTypeCounts.get(ext) || { count: 0, examples: [] };
        existing.count++;
        if (existing.examples.length < 5 && !existing.examples.includes(file)) {
          existing.examples.push(file);
        }
        fileTypeCounts.set(ext, existing);
      }
    }
  }

  for (const [ext, data] of fileTypeCounts) {
    if (data.count >= 3) {
      patterns.push({
        type: "file-type-usage",
        contentType: ext,
        styleAttributes: { extension: ext },
        frequency: data.count,
        examples: data.examples,
      });
    }
  }

  return patterns;
}

/**
 * Analyze file modifications for patterns.
 * Groups by extension and recent modification clusters.
 */
export function analyzeFilePatterns(files: FileModificationPattern[]): WorkPattern[] {
  const patterns: WorkPattern[] = [];

  // Group by extension
  const extCounts = new Map<string, { count: number; examples: string[] }>();

  for (const file of files) {
    if (file.extension) {
      const existing = extCounts.get(file.extension) || { count: 0, examples: [] };
      existing.count++;
      if (existing.examples.length < 5) {
        existing.examples.push(file.path);
      }
      extCounts.set(file.extension, existing);
    }
  }

  for (const [ext, data] of extCounts) {
    if (data.count >= 3) {
      patterns.push({
        type: "file-modification-cluster",
        contentType: ext,
        styleAttributes: { extension: ext },
        frequency: data.count,
        examples: data.examples,
      });
    }
  }

  return patterns;
}

/**
 * Compute confidence score for a pattern.
 * Formula: min(frequency / 10, 1.0)
 */
export function computeConfidence(frequency: number): number {
  return Math.min(frequency / 10, 1.0);
}
