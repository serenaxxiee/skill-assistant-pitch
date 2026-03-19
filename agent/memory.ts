import Database from "better-sqlite3";
import { join } from "node:path";

// ─── Interfaces ───────────────────────────────────────────────────────────

export interface DetectedPattern {
  id: string;
  name: string;
  frequency: number;
  dominantContentType: string;
  commonStyleAttrs: Record<string, string>;
  suggestedSkillName: string;
  confidence: number;
  firstSeenCycle: number;
  lastSeenCycle: number;
}

export interface GeneratedSkill {
  id: string;
  name: string;
  filePath: string;
  sourcePatternId: string;
  createdCycle: number;
  commitSha: string | null;
}

export interface SelfModification {
  cycle: number;
  timestamp: string;
  filesChanged: string[];
  rationale: string;
  buildPassed: boolean;
  commitSha: string | null;
}

export interface DiaryEntry {
  cycle: number;
  timestamp: string;
  content: string;
}

export interface CycleMetadata {
  totalCycles: number;
  lastCycleAt: string | null;
  pendingHypotheses: string[];
}

// ─── Database Management ──────────────────────────────────────────────────

const SCHEMA_VERSION = 1;

function getDbPath(agentDir: string): string {
  return join(agentDir, "data", "memory.db");
}

export function openDb(agentDir: string): Database.Database {
  const db = new Database(getDbPath(agentDir));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patterns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      frequency INTEGER NOT NULL,
      dominant_content_type TEXT NOT NULL,
      common_style_attrs TEXT NOT NULL,
      suggested_skill_name TEXT NOT NULL,
      confidence REAL NOT NULL,
      first_seen_cycle INTEGER NOT NULL,
      last_seen_cycle INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      source_pattern_id TEXT,
      created_cycle INTEGER NOT NULL,
      commit_sha TEXT
    );

    CREATE TABLE IF NOT EXISTS self_modifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cycle INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      files_changed TEXT NOT NULL,
      rationale TEXT NOT NULL,
      build_passed INTEGER NOT NULL,
      commit_sha TEXT
    );

    CREATE TABLE IF NOT EXISTS diary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cycle INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hypotheses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      added_cycle INTEGER NOT NULL,
      resolved_cycle INTEGER
    );
  `);

  // Set schema version if not present
  const existing = db.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get() as { value: string } | undefined;
  if (!existing) {
    db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run("schema_version", String(SCHEMA_VERSION));
    db.prepare("INSERT OR IGNORE INTO meta (key, value) VALUES (?, ?)").run("total_cycles", "0");
    db.prepare("INSERT OR IGNORE INTO meta (key, value) VALUES (?, ?)").run("last_cycle_at", "");
  }
}

// ─── Read Operations ──────────────────────────────────────────────────────

export function getMeta(db: Database.Database): CycleMetadata {
  const totalCycles = Number(
    (db.prepare("SELECT value FROM meta WHERE key = 'total_cycles'").get() as { value: string })?.value ?? "0"
  );
  const lastCycleAt =
    (db.prepare("SELECT value FROM meta WHERE key = 'last_cycle_at'").get() as { value: string })?.value || null;

  const hypotheses = db
    .prepare("SELECT content FROM hypotheses WHERE resolved_cycle IS NULL")
    .all() as { content: string }[];

  return {
    totalCycles,
    lastCycleAt,
    pendingHypotheses: hypotheses.map((h) => h.content),
  };
}

export function getPatterns(db: Database.Database): DetectedPattern[] {
  const rows = db.prepare("SELECT * FROM patterns ORDER BY frequency DESC").all() as Array<{
    id: string;
    name: string;
    frequency: number;
    dominant_content_type: string;
    common_style_attrs: string;
    suggested_skill_name: string;
    confidence: number;
    first_seen_cycle: number;
    last_seen_cycle: number;
  }>;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    frequency: r.frequency,
    dominantContentType: r.dominant_content_type,
    commonStyleAttrs: JSON.parse(r.common_style_attrs) as Record<string, string>,
    suggestedSkillName: r.suggested_skill_name,
    confidence: r.confidence,
    firstSeenCycle: r.first_seen_cycle,
    lastSeenCycle: r.last_seen_cycle,
  }));
}

export function getSkills(db: Database.Database): GeneratedSkill[] {
  const rows = db.prepare("SELECT * FROM skills ORDER BY created_cycle DESC").all() as Array<{
    id: string;
    name: string;
    file_path: string;
    source_pattern_id: string;
    created_cycle: number;
    commit_sha: string | null;
  }>;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    filePath: r.file_path,
    sourcePatternId: r.source_pattern_id,
    createdCycle: r.created_cycle,
    commitSha: r.commit_sha,
  }));
}

export function getRecentDiary(db: Database.Database, limit = 5): DiaryEntry[] {
  return db
    .prepare("SELECT cycle, timestamp, content FROM diary ORDER BY id DESC LIMIT ?")
    .all(limit) as DiaryEntry[];
}

export function getRecentModifications(db: Database.Database, limit = 10): SelfModification[] {
  const rows = db
    .prepare("SELECT * FROM self_modifications ORDER BY id DESC LIMIT ?")
    .all(limit) as Array<{
    cycle: number;
    timestamp: string;
    files_changed: string;
    rationale: string;
    build_passed: number;
    commit_sha: string | null;
  }>;

  return rows.map((r) => ({
    cycle: r.cycle,
    timestamp: r.timestamp,
    filesChanged: JSON.parse(r.files_changed) as string[],
    rationale: r.rationale,
    buildPassed: r.build_passed === 1,
    commitSha: r.commit_sha,
  }));
}

// ─── Write Operations ─────────────────────────────────────────────────────

export function incrementCycle(db: Database.Database): number {
  const meta = getMeta(db);
  const newCount = meta.totalCycles + 1;
  db.prepare("UPDATE meta SET value = ? WHERE key = 'total_cycles'").run(String(newCount));
  db.prepare("UPDATE meta SET value = ? WHERE key = 'last_cycle_at'").run(new Date().toISOString());
  return newCount;
}

export function upsertPattern(db: Database.Database, pattern: DetectedPattern): void {
  db.prepare(`
    INSERT INTO patterns (id, name, frequency, dominant_content_type, common_style_attrs,
      suggested_skill_name, confidence, first_seen_cycle, last_seen_cycle)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      frequency = excluded.frequency,
      confidence = excluded.confidence,
      last_seen_cycle = excluded.last_seen_cycle
  `).run(
    pattern.id,
    pattern.name,
    pattern.frequency,
    pattern.dominantContentType,
    JSON.stringify(pattern.commonStyleAttrs),
    pattern.suggestedSkillName,
    pattern.confidence,
    pattern.firstSeenCycle,
    pattern.lastSeenCycle,
  );
}

export function insertSkill(db: Database.Database, skill: GeneratedSkill): void {
  db.prepare(`
    INSERT OR REPLACE INTO skills (id, name, file_path, source_pattern_id, created_cycle, commit_sha)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(skill.id, skill.name, skill.filePath, skill.sourcePatternId, skill.createdCycle, skill.commitSha);
}

export function insertDiaryEntry(db: Database.Database, entry: DiaryEntry): void {
  db.prepare("INSERT INTO diary (cycle, timestamp, content) VALUES (?, ?, ?)").run(
    entry.cycle,
    entry.timestamp,
    entry.content,
  );
}

export function recordSelfModification(db: Database.Database, mod: SelfModification): void {
  db.prepare(`
    INSERT INTO self_modifications (cycle, timestamp, files_changed, rationale, build_passed, commit_sha)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    mod.cycle,
    mod.timestamp,
    JSON.stringify(mod.filesChanged),
    mod.rationale,
    mod.buildPassed ? 1 : 0,
    mod.commitSha,
  );
}

export function addHypothesis(db: Database.Database, content: string, cycle: number): void {
  db.prepare("INSERT INTO hypotheses (content, added_cycle) VALUES (?, ?)").run(content, cycle);
}

export function resolveHypothesis(db: Database.Database, id: number, cycle: number): void {
  db.prepare("UPDATE hypotheses SET resolved_cycle = ? WHERE id = ?").run(cycle, id);
}
