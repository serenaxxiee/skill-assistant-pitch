/**
 * Skilluminator Loop Runner — IMMUTABLE BOOTSTRAP
 *
 * This file must NEVER be modified by the agent. It is the outer loop that:
 * 1. Initializes the git repo
 * 2. Builds the cycle context via agent/index.ts
 * 3. Runs one query() per cycle using the Claude Agent SDK
 * 4. Handles post-cycle build verification, git commit, and revert-on-failure
 * 5. Sleeps 10 seconds and repeats
 */

import { query, type McpStdioServerConfig } from "@anthropic-ai/claude-agent-sdk";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { buildPrompt } from "../agent/index.js";
import { openDb, incrementCycle, insertDiaryEntry } from "../agent/memory.js";
import { checkBuild } from "../agent/health.js";
import { ensureRepo, commitAll, revertHead } from "../agent/git.js";
import { getWorkiqServerConfig } from "../agent/mcp/workiq.js";
import { getCopilotServerConfig } from "../agent/mcp/copilot.js";
import { logger } from "./logger.js";

// ─── Constants ────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENT_DIR = resolve(__dirname, "..");
const CYCLE_SLEEP_MS = 10_000;
const MAX_TURNS_PER_CYCLE = 80;
const RUN_ONCE = process.argv.includes("--once");

// ─── Build MCP server config ─────────────────────────────────────────────

function buildMcpServers(): Record<string, McpStdioServerConfig> {
  const servers: Record<string, McpStdioServerConfig> = {};

  const workiq = getWorkiqServerConfig();
  if (workiq) {
    servers.workiq = workiq;
  }

  const copilot = getCopilotServerConfig();
  if (copilot) {
    servers.copilot = copilot;
  }

  return servers;
}

// ─── Single Cycle ─────────────────────────────────────────────────────────

async function runCycle(cycleNumber: number): Promise<void> {
  const cycleStart = Date.now();
  logger.cycleStart(cycleNumber);

  // 1. Build the prompt from agent state
  const { systemPrompt, userPrompt } = buildPrompt(AGENT_DIR, cycleNumber);

  // 2. Increment cycle counter in memory
  const db = openDb(AGENT_DIR);
  try {
    incrementCycle(db);
  } finally {
    db.close();
  }

  // 3. Run the agent via Claude Agent SDK
  const mcpServers = buildMcpServers();

  try {
    for await (const message of query({
      prompt: userPrompt,
      options: {
        cwd: AGENT_DIR,
        systemPrompt,
        allowedTools: [
          "Read", "Write", "Edit", "Bash", "Glob", "Grep",
          "WebSearch", "WebFetch",
        ],
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
        maxTurns: MAX_TURNS_PER_CYCLE,
        mcpServers: Object.keys(mcpServers).length > 0 ? mcpServers : undefined,
      },
    })) {
      // Log agent output
      if ("result" in message) {
        logger.agentMessage(message.result as string);
      }
    }
  } catch (err) {
    logger.cycleError(cycleNumber, err);
  }

  // 4. Post-cycle: verify build after agent may have self-modified
  const postBuild = checkBuild(AGENT_DIR);
  logger.buildStatus(postBuild.passed, postBuild.errorOutput);

  if (!postBuild.passed) {
    // Build is broken — revert the agent's changes
    logger.revert(`Build failed after cycle ${cycleNumber}, reverting...`);
    revertHead(AGENT_DIR);

    // Record the failure in the diary
    const revertDb = openDb(AGENT_DIR);
    try {
      insertDiaryEntry(revertDb, {
        cycle: cycleNumber,
        timestamp: new Date().toISOString(),
        content: `## Build Failure — Auto-Reverted\n\nThe build broke after cycle ${cycleNumber}.\n` +
          `Errors:\n\`\`\`\n${postBuild.errorOutput}\n\`\`\`\n\nAll changes were reverted.`,
      });
    } finally {
      revertDb.close();
    }

    // Commit the diary entry about the failure
    commitAll(AGENT_DIR, `cycle(${cycleNumber}): auto-revert — build failure`);
  } else {
    // Build passes — commit everything the agent did
    const sha = commitAll(AGENT_DIR, `cycle(${cycleNumber}): completed successfully`);
    if (sha) {
      logger.commit(sha, `cycle(${cycleNumber}): completed successfully`);
    }
  }

  const elapsed = Date.now() - cycleStart;
  logger.cycleEnd(cycleNumber, elapsed);
}

// ─── Main Loop ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  logger.info("Skilluminator loop runner starting...");
  logger.info(`Agent directory: ${AGENT_DIR}`);
  logger.info(`Cycle interval: ${CYCLE_SLEEP_MS / 1000}s`);
  logger.info(`Max turns per cycle: ${MAX_TURNS_PER_CYCLE}`);

  // Ensure git repo exists
  ensureRepo(AGENT_DIR);
  logger.info("Git repository confirmed.");

  let cycle = 0;

  // Read the current cycle count from memory
  const db = openDb(AGENT_DIR);
  try {
    const meta = (await import("../agent/memory.js")).getMeta(db);
    cycle = meta.totalCycles;
  } finally {
    db.close();
  }

  while (true) {
    cycle++;

    try {
      await runCycle(cycle);
    } catch (err) {
      logger.cycleError(cycle, err);
    }

    if (RUN_ONCE) {
      logger.info("--once flag set, exiting after single cycle.");
      break;
    }

    logger.cycleSleep(CYCLE_SLEEP_MS);
    await new Promise((resolve) => setTimeout(resolve, CYCLE_SLEEP_MS));
  }
}

main().catch((err) => {
  console.error("Fatal error in loop runner:", err);
  process.exit(1);
});
