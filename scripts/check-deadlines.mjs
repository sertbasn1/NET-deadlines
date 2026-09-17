import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../app/page.tsx", import.meta.url);
const statePath = process.env.DEADLINE_STATE_PATH ?? ".deadline-monitor-state.json";
const reportPath = process.env.DEADLINE_REPORT_PATH ?? "deadline-report.md";
const source = await readFile(sourcePath, "utf8");

const directUrls = [...source.matchAll(/\burl:\s*"(https?:\/\/[^\"]+)"/g)].map((match) => match[1]);
const seedUrls = [...source.matchAll(/^\s*\["[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"(https?:\/\/[^\"]+)"/gm)].map((match) => match[1]);
const urls = [...new Set([...directUrls, ...seedUrls])].sort();

if (process.argv.includes("--list")) {
  console.log(JSON.stringify({ count: urls.length, urls }, null, 2));
  process.exit(0);
}

let previous = { pages: {} };
try {
  previous = JSON.parse(await readFile(statePath, "utf8"));
} catch {
  // The first scheduled run establishes the baseline.
}

const decodeEntities = (value) => value
  .replaceAll("&nbsp;", " ")
  .replaceAll("&amp;", "&")
  .replaceAll("&ndash;", "–")
  .replaceAll("&mdash;", "—")
  .replaceAll("&#39;", "'")
  .replaceAll("&quot;", '"');

function fingerprint(html) {
  const visibleText = decodeEntities(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "\n")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 4 && line.length <= 500);

  const keyword = /(deadline|submission|notification|important dates|call for papers|paper due|author response|camera.?ready)/i;
  const date = /(20\d{2}|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)/i;
  const relevant = [...new Set(visibleText.filter((line) => keyword.test(line) && date.test(line)))].sort().slice(0, 100);
  const material = relevant.length ? relevant.join("\n") : visibleText.slice(0, 250).join("\n");
  return {
    hash: createHash("sha256").update(material).digest("hex"),
    snippets: relevant.slice(0, 4),
  };
}

async function inspect(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
      headers: { "user-agent": "NET-deadlines deadline monitor (+https://github.com/sertbasn1/NET-deadlines)" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) throw new Error(`Unsupported content type: ${contentType || "unknown"}`);
    const result = fingerprint(await response.text());
    return { url, status: "ok", ...result };
  } catch (error) {
    return { url, status: "error", hash: "", snippets: [], error: error instanceof Error ? error.message : String(error) };
  }
}

const pages = {};
for (let index = 0; index < urls.length; index += 8) {
  const batch = await Promise.all(urls.slice(index, index + 8).map(inspect));
  for (const result of batch) pages[result.url] = result;
}

const hasBaseline = Object.keys(previous.pages ?? {}).length > 0;
const changes = [];
for (const url of urls) {
  const before = previous.pages?.[url];
  const after = pages[url];
  if (!hasBaseline || !before) continue;
  if (before.status !== after.status || (after.status === "ok" && before.hash !== after.hash)) {
    changes.push(after);
  }
}

const checkedAt = new Date().toISOString();
await writeFile(statePath, `${JSON.stringify({ checkedAt, pages }, null, 2)}\n`);

const lines = [
  "# Automated deadline review",
  "",
  `Checked **${urls.length} official venue pages** at ${checkedAt}.`,
  "",
];

if (!hasBaseline) {
  lines.push("Baseline created. Future weekly runs will report changes to deadline-related page content.");
} else if (!changes.length) {
  lines.push("No deadline-related page changes were detected.");
} else {
  lines.push(`Found **${changes.length} page${changes.length === 1 ? "" : "s"} requiring review**.`, "");
  for (const change of changes) {
    lines.push(`## ${change.url}`, "");
    if (change.status === "error") {
      lines.push(`The page could not be checked: ${change.error}.`, "");
    } else if (change.snippets.length) {
      lines.push("Deadline-related content changed. Current excerpts:", "");
      for (const snippet of change.snippets) lines.push(`- ${snippet.slice(0, 300)}`);
      lines.push("");
    } else {
      lines.push("The page content changed, but no structured deadline excerpt was found. Please inspect it manually.", "");
    }
  }
  lines.push("Compare these pages with `app/page.tsx`. Replace an `EST.` date only after confirming it on the official CFP.");
}

await writeFile(reportPath, `${lines.join("\n")}\n`);
console.log(JSON.stringify({ baseline: !hasBaseline, checked: urls.length, changes: changes.length, reportPath }));
