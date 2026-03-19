import { execSync } from "node:child_process";

export interface BuildResult {
  passed: boolean;
  errorOutput: string;
  durationMs: number;
}

export function checkBuild(agentDir: string): BuildResult {
  const start = Date.now();
  try {
    execSync("npx tsc --noEmit", {
      cwd: agentDir,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30_000,
    });
    return {
      passed: true,
      errorOutput: "",
      durationMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const error = err as { stderr?: Buffer; stdout?: Buffer };
    const stderr = error.stderr?.toString() ?? "";
    const stdout = error.stdout?.toString() ?? "";
    return {
      passed: false,
      errorOutput: (stderr + "\n" + stdout).trim(),
      durationMs: Date.now() - start,
    };
  }
}
