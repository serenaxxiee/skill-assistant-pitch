/**
 * Work IQ MCP server configuration.
 *
 * Spawns `npx -y @microsoft/workiq mcp` as a stdio MCP server.
 * Provides access to M365 activity traces (metadata only, never raw content).
 *
 * Requires WORKIQ_TENANT_ID to be set in the environment.
 * When unavailable, the agent should rely on existing memory patterns.
 */
import type { McpStdioServerConfig } from "@anthropic-ai/claude-agent-sdk";

export function getWorkiqServerConfig(): McpStdioServerConfig | null {
  if (!process.env.WORKIQ_TENANT_ID) {
    return null;
  }

  return {
    command: "npx",
    args: ["-y", "@microsoft/workiq", "mcp"],
    env: {
      WORKIQ_TENANT_ID: process.env.WORKIQ_TENANT_ID,
    },
  };
}
