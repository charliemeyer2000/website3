import fs from "fs";
import matter from "gray-matter";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "app", "_content");

// Routes that exist in the app directory — short URLs must not collide with these.
const RESERVED_ROUTES = new Set(["design", "og", "api"]);

function isValidShortUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  // Alphanumeric, hyphens, and underscores only — no slashes, dots, or path traversal.
  return /^[a-z0-9_-]+$/i.test(trimmed);
}

export function getShortUrlRedirects(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const seen = new Map<string, string>();
  const redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }> = [];

  let topics: string[];
  try {
    topics = fs
      .readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }

  for (const topic of topics) {
    const topicDir = path.join(CONTENT_DIR, topic);

    let files: string[];
    try {
      files = fs.readdirSync(topicDir).filter((f) => f.endsWith(".md"));
    } catch {
      continue;
    }

    for (const file of files) {
      let content: string;
      try {
        content = fs.readFileSync(path.join(topicDir, file), "utf8");
      } catch {
        continue;
      }

      let data: Record<string, unknown>;
      try {
        data = matter(content).data;
      } catch {
        continue;
      }

      if (!data.shortUrl) continue;
      if (data.visibility === "private") continue;

      if (!isValidShortUrl(data.shortUrl)) {
        const slug = file.replace(/\.md$/, "");
        console.warn(
          `[short-url] Invalid shortUrl "${String(data.shortUrl)}" in ${topic}/${slug}, skipping`,
        );
        continue;
      }

      const shortUrl = (data.shortUrl as string).trim().toLowerCase();
      const slug = file.replace(/\.md$/, "");
      const destination = `/${topic}/${slug}`;

      if (RESERVED_ROUTES.has(shortUrl)) {
        console.warn(
          `[short-url] "${shortUrl}" in ${topic}/${slug} conflicts with an existing route, skipping`,
        );
        continue;
      }

      const existing = seen.get(shortUrl);
      if (existing) {
        console.warn(
          `[short-url] Duplicate shortUrl "${shortUrl}" in ${topic}/${slug} (already used by ${existing}), skipping`,
        );
        continue;
      }

      seen.set(shortUrl, destination);
      redirects.push({ source: `/${shortUrl}`, destination, permanent: true });
    }
  }

  return redirects;
}
