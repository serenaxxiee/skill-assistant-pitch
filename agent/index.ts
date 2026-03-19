import { buildSystemPrompt, buildUserPrompt } from "./prompt.js";
import type { CycleContext } from "./prompt.js";
import { checkBuild, type BuildResult } from "./health.js";
import {
  openDb,
  getMeta,
  getPatterns,
  getRecentDiary,
  getRecentModifications,
} from "./memory.js";
import { getRecentLog } from "./git.js";

export type { CycleContext } from "./prompt.js";

export interface AgentPrompts {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Build the system and user prompts for a cycle.
 * Accepts an optional cached BuildResult to avoid running tsc twice per cycle.
 */
export function buildPrompt(
  agentDir: string,
  cycleNumber: number,
  cachedBuild?: BuildResult | null,
): AgentPrompts {
  const db = openDb(agentDir);

  try {
    // Use cached build result if available, otherwise run tsc
    const buildStatus = cachedBuild ?? checkBuild(agentDir);
    const meta = getMeta(db);
    const patterns = getPatterns(db);
    const recentDiary = getRecentDiary(db, 5);
    const recentMods = getRecentModifications(db, 10);
    const gitLog = getRecentLog(agentDir, 15);
    const workiqAvailable = Boolean(process.env.WORKIQ_TENANT_ID);

    const ctx: CycleContext = {
      cycleNumber,
      agentDir,
      buildStatus,
      meta,
      patterns,
      recentDiary,
      recentMods,
      gitLog,
      workiqAvailable,
    };

    return {
      systemPrompt: buildSystemPrompt(ctx),
      userPrompt: buildUserPrompt(ctx),
    };
  } finally {
    db.close();
  }
}
