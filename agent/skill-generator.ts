/**
 * Skill Generation Module
 *
 * Converts detected work patterns into SKILL.md files that can be used by
 * Claude Code, GitHub Copilot, and other AI tools.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { WorkPattern } from "./collector.js";

// ─── Interfaces ───────────────────────────────────────────────────────────

export interface SkillMetadata {
  name: string; // kebab-case, max 64 chars
  description: string; // max 1024 chars
  userInvocable: boolean;
}

export interface SkillContent {
  metadata: SkillMetadata;
  whenToUse: string;
  steps: string[];
}

// ─── Skill Name Generation ────────────────────────────────────────────────

/**
 * Generate a valid skill name from a pattern.
 * Format: ^[a-z0-9-]{1,64}$
 */
export function generateSkillName(pattern: WorkPattern): string {
  let name = "";

  switch (pattern.type) {
    case "git-commit-style": {
      const prefix = pattern.styleAttributes.prefix || "commit";
      name = `git-${prefix}-commit`;
      break;
    }
    case "file-type-usage": {
      const ext = pattern.contentType || "file";
      name = `work-with-${ext}-files`;
      break;
    }
    case "file-modification-cluster": {
      const ext = pattern.contentType || "file";
      name = `modify-${ext}-files`;
      break;
    }
    default:
      name = "generic-work-pattern";
  }

  // Ensure valid kebab-case
  name = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

  return name;
}

// ─── Description Generation ───────────────────────────────────────────────

/**
 * Generate a natural language description for the skill.
 * Max 1024 chars.
 */
export function generateDescription(pattern: WorkPattern): string {
  let desc = "";

  switch (pattern.type) {
    case "git-commit-style": {
      const prefix = pattern.styleAttributes.prefix || "commit";
      desc = `Automatically format git commit messages with the "${prefix}:" prefix. ` +
        `This pattern has been observed ${pattern.frequency} times in recent work. ` +
        `Use this when making commits that follow the conventional commit style.`;
      break;
    }
    case "file-type-usage": {
      const ext = pattern.contentType;
      desc = `Work with ${ext.toUpperCase()} files following established patterns. ` +
        `This file type appears ${pattern.frequency} times in recent modifications. ` +
        `Use this skill when creating, editing, or analyzing ${ext} files.`;
      break;
    }
    case "file-modification-cluster": {
      const ext = pattern.contentType;
      desc = `Modify ${ext.toUpperCase()} files using detected patterns from ${pattern.frequency} recent changes. ` +
        `This skill captures common modification patterns for ${ext} files in this project.`;
      break;
    }
    default:
      desc = `Apply a detected work pattern with ${pattern.frequency} occurrences.`;
  }

  return desc.slice(0, 1024);
}

// ─── When to Use Generation ───────────────────────────────────────────────

export function generateWhenToUse(pattern: WorkPattern): string {
  switch (pattern.type) {
    case "git-commit-style": {
      const prefix = pattern.styleAttributes.prefix || "commit";
      return `Use this skill when:\n` +
        `- Making git commits in this repository\n` +
        `- Following the "${prefix}:" conventional commit style\n` +
        `- Ensuring commit message consistency\n\n` +
        `Examples from recent commits:\n` +
        pattern.examples.map(ex => `- ${ex}`).join("\n");
    }
    case "file-type-usage":
    case "file-modification-cluster": {
      const ext = pattern.contentType;
      return `Use this skill when:\n` +
        `- Creating new ${ext.toUpperCase()} files\n` +
        `- Modifying existing ${ext.toUpperCase()} files\n` +
        `- Following project conventions for ${ext} files\n\n` +
        `Recent examples:\n` +
        pattern.examples.slice(0, 5).map(ex => `- ${ex}`).join("\n");
    }
    default:
      return "Use this skill when working with similar patterns.";
  }
}

// ─── Steps Generation ─────────────────────────────────────────────────────

export function generateSteps(pattern: WorkPattern): string[] {
  switch (pattern.type) {
    case "git-commit-style": {
      const prefix = pattern.styleAttributes.prefix || "commit";
      return [
        "Stage your changes with `git add`",
        `Write a commit message starting with "${prefix}:"`,
        "Follow with a clear, concise description of the change",
        "Commit with `git commit -m \"${prefix}: your description\"`",
      ];
    }
    case "file-type-usage":
    case "file-modification-cluster": {
      const ext = pattern.contentType;
      return [
        `Identify the ${ext.toUpperCase()} file to modify`,
        "Review existing patterns in similar files",
        "Apply consistent style and structure",
        "Test changes to ensure compatibility",
        "Commit following project conventions",
      ];
    }
    default:
      return [
        "Analyze the pattern context",
        "Apply consistent practices",
        "Verify the changes",
      ];
  }
}

// ─── SKILL.md Generation ──────────────────────────────────────────────────

/**
 * Generate a complete SKILL.md content from a pattern.
 */
export function generateSkillContent(pattern: WorkPattern): SkillContent {
  const name = generateSkillName(pattern);
  const description = generateDescription(pattern);
  const whenToUse = generateWhenToUse(pattern);
  const steps = generateSteps(pattern);

  return {
    metadata: {
      name,
      description,
      userInvocable: true,
    },
    whenToUse,
    steps,
  };
}

/**
 * Format skill content as SKILL.md YAML + Markdown.
 */
export function formatSkillFile(content: SkillContent): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push("---");
  lines.push(`name: ${content.metadata.name}`);
  lines.push("description: >");
  // Multi-line description with proper indentation
  const descLines = content.metadata.description.match(/.{1,80}(\s|$)/g) || [content.metadata.description];
  descLines.forEach(line => lines.push(`  ${line.trim()}`));
  lines.push(`user-invocable: ${content.metadata.userInvocable}`);
  lines.push("---");
  lines.push("");

  // When to use section
  lines.push("## When to use this skill");
  lines.push("");
  lines.push(content.whenToUse);
  lines.push("");

  // Steps section
  lines.push("## Steps");
  content.steps.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  lines.push("");

  return lines.join("\n");
}

/**
 * Write a skill file to disk.
 */
export function writeSkillFile(
  skillsDir: string,
  skillName: string,
  content: string,
): string {
  const filePath = join(skillsDir, `${skillName}.md`);
  writeFileSync(filePath, content, "utf-8");
  return filePath;
}

/**
 * Generate and write a complete skill from a pattern.
 * Returns the file path of the generated skill.
 */
export function generateSkillFromPattern(
  pattern: WorkPattern,
  skillsDir: string,
): { name: string; filePath: string; content: SkillContent } {
  const content = generateSkillContent(pattern);
  const fileContent = formatSkillFile(content);
  const filePath = writeSkillFile(skillsDir, content.metadata.name, fileContent);

  return {
    name: content.metadata.name,
    filePath,
    content,
  };
}
