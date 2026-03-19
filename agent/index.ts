import { buildSystemPrompt, buildUserPrompt } from "./prompt.js";
import type { CycleContext } from "./prompt.js";
import {
  openDb,
  getMeta,
  getPatterns,
  getRecentDiary,
  getRecentModifications,
} from "./memory.js";
import { checkBuild } from "./health.js";
import { getRecentLog } from "./git.js";

export type { CycleContext } from "./prompt.js";

export interface AgentPrompts {
  systemPrompt: string;
  userPrompt: string;
}

export function buildPrompt(agentDir: string, cycleNumber: number): AgentPrompts {
  const db = openDb(agentDir);

  try {
    const buildStatus = checkBuild(agentDir);
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
