function timestamp(): string {
  return new Date().toISOString();
}

function log(level: string, ...args: unknown[]): void {
  console.log(`[${timestamp()}] [${level}]`, ...args);
}

export const logger = {
  cycleStart(n: number): void {
    log("CYCLE", `═══ Cycle ${n} starting ═══`);
  },

  cycleEnd(n: number, durationMs: number): void {
    log("CYCLE", `═══ Cycle ${n} complete (${(durationMs / 1000).toFixed(1)}s) ═══`);
  },

  cycleSleep(ms: number): void {
    log("SLEEP", `waiting ${ms / 1000}s before next cycle...`);
  },

  cycleError(n: number, err: unknown): void {
    const message = err instanceof Error ? err.message : String(err);
    log("ERROR", `Cycle ${n} failed: ${message}`);
  },

  info(...args: unknown[]): void {
    log("INFO", ...args);
  },

  warn(...args: unknown[]): void {
    log("WARN", ...args);
  },

  buildStatus(passed: boolean, errors?: string): void {
    if (passed) {
      log("BUILD", "TypeScript compilation: PASS");
    } else {
      log("BUILD", "TypeScript compilation: FAIL");
      if (errors) {
        console.error(errors);
      }
    }
  },

  agentMessage(text: string): void {
    // Indent agent output for visual distinction
    for (const line of text.split("\n")) {
      console.log(`  │ ${line}`);
    }
  },

  revert(reason: string): void {
    log("REVERT", reason);
  },

  commit(sha: string, message: string): void {
    log("GIT", `committed ${sha}: ${message}`);
  },
};
