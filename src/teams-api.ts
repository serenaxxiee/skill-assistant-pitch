// ── Direct Teams Graph API calls (no agent needed) ──────────────────

import { execSync } from "child_process";

const AUTHORITY_USER_ID = "27f41826-6e6e-4c95-b1d8-974278833864";

function getTeamId(): string { return process.env.TEAMS_TEAM_ID ?? ""; }
function getChannelId(): string { return process.env.TEAMS_CHANNEL_ID ?? ""; }

function getAccessToken(): string {
  return execSync(
    "az account get-access-token --resource https://graph.microsoft.com --query accessToken -o tsv",
    { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
}

function channelUrl(): string {
  return `https://graph.microsoft.com/beta/teams/${getTeamId()}/channels/${encodeURIComponent(getChannelId())}`;
}

// ── Read steering messages from Serena ──────────────────────────────

export async function readSteeringMessages(sinceMinutes = 120): Promise<string[]> {
  const since = new Date(Date.now() - sinceMinutes * 60_000).toISOString();
  const filter = encodeURIComponent(`lastModifiedDateTime gt ${since}`);
  const url = `${channelUrl()}/messages?$filter=${filter}&$top=50&$orderby=createdDateTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) return [];

  const data = await response.json();
  const steering: string[] = [];

  for (const msg of data.value ?? []) {
    if (msg.from?.user?.id !== AUTHORITY_USER_ID) continue;
    const text = (msg.body?.content ?? "").replace(/<[^>]+>/g, "").trim();
    // Skip bot messages (Skilluminator's own posts)
    if (!text || text.includes("Skilluminator")) continue;
    steering.push(text);
  }

  return steering;
}

// ── Post a message to Teams ─────────────────────────────────────────

export async function postToTeams(message: string, subject?: string): Promise<string> {
  const timestamp = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const signature = `<br><hr style="border:none;border-top:1px solid #ddd;margin:12px 0 6px"><span style="font-size:11px;color:#888">&#x1F916; <b>Skilluminator</b> &middot; ${timestamp}</span>`;

  // Simple markdown to HTML
  const html = message
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>")
    .replace(/\n/g, "<br>")
    + signature;

  const body: any = { body: { contentType: "html", content: html } };
  if (subject) body.subject = subject;

  const response = await fetch(`${channelUrl()}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Teams post failed: ${response.status} ${err.slice(0, 200)}`);
  }

  const result = await response.json();
  return result.id ?? "";
}
