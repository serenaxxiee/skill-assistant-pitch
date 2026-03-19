/**
 * GitHub Copilot CLI MCP server configuration.
 *
 * Provides access to GitHub Copilot CLI traces and usage data.
 * Requires `gh` CLI with copilot extension installed.
 */
import type { McpStdioServerConfig } from "@anthropic-ai/claude-agent-sdk";

export function getCopilotServerConfig(): McpStdioServerConfig | null {
  // The copilot extension may not be installed — the agent will discover
  // copilot traces via direct file system reads as a fallback
  try {
    return {
      command: "gh",
      args: ["copilot", "mcp"],
    };
  } catch {
    return null;
  }
}
