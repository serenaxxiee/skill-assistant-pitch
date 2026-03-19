/**
 * GitHub Copilot CLI MCP server configuration.
 *
 * Provides access to GitHub Copilot CLI traces and usage data.
 * Requires `gh` CLI with copilot extension installed.
 * Only enabled when ENABLE_COPILOT_MCP=1 is set in the environment.
 */
import { execSync } from "node:child_process";
import type { McpStdioServerConfig } from "@anthropic-ai/claude-agent-sdk";

export function getCopilotServerConfig(): McpStdioServerConfig | null {
  if (!process.env.ENABLE_COPILOT_MCP) {
    return null;
  }

  // Verify gh CLI with copilot extension is actually available
  try {
    execSync("gh copilot --version", { stdio: "pipe", timeout: 5_000 });
  } catch {
    return null;
  }

  return {
    command: "gh",
    args: ["copilot", "mcp"],
  };
}
