import type { CandidateItem, ContentCategory } from "@/data/demo-content";

const CATEGORIES = new Set<ContentCategory>([
  "news",
  "culture",
  "history",
  "events",
  "transport",
  "evergreen",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrapStories(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];

  for (const key of ["items", "stories", "news", "candidates", "item", "data"]) {
    const nested = value[key];
    if (Array.isArray(nested)) return nested;
    if (isRecord(nested)) return [nested];
  }

  return [value];
}

function toCandidate(value: unknown): CandidateItem | null {
  if (!isRecord(value)) return null;
  if (typeof value.title !== "string" || !value.title.trim()) return null;
  if (typeof value.summary !== "string" || !value.summary.trim()) return null;

  const category = CATEGORIES.has(value.category as ContentCategory)
    ? (value.category as ContentCategory)
    : "news";
  const locations = Array.isArray(value.locations)
    ? value.locations.filter((loc): loc is string => typeof loc === "string" && loc.trim().length > 0)
    : [];
  const geo = Array.isArray(value.geo)
    ? value.geo.flatMap((point) => {
        if (!isRecord(point)) return [];
        if (typeof point.lat !== "number" || typeof point.lng !== "number") return [];
        return [
          {
            lat: point.lat,
            lng: point.lng,
            ...(typeof point.label === "string" ? { label: point.label } : {}),
          },
        ];
      })
    : [];

  return {
    id:
      typeof value.id === "string" && value.id.trim()
        ? value.id.trim()
        : crypto.randomUUID(),
    title: value.title.trim(),
    summary: value.summary.trim(),
    ...(typeof value.fullText === "string" ? { fullText: value.fullText } : {}),
    sourceName:
      typeof value.sourceName === "string" && value.sourceName.trim()
        ? value.sourceName.trim()
        : "LRT",
    sourceUrl:
      typeof value.sourceUrl === "string" && value.sourceUrl.trim()
        ? value.sourceUrl.trim()
        : "https://www.lrt.lt/",
    publishedAt:
      typeof value.publishedAt === "string" && value.publishedAt.trim()
        ? value.publishedAt
        : new Date().toISOString(),
    locations,
    category,
    sourceConfidence:
      typeof value.sourceConfidence === "number" ? value.sourceConfidence : 100,
    durationSec: typeof value.durationSec === "number" ? value.durationSec : 180,
    ...(geo.length > 0 ? { geo } : {}),
  };
}

export function parseGeneratedCandidates(value: unknown): CandidateItem[] {
  const items = unwrapStories(value)
    .map(toCandidate)
    .filter((item): item is CandidateItem => item !== null);

  if (items.length === 0) {
    throw new Error("Groq returned JSON that is not a news item.");
  }

  return items;
}

export function groqErrorMessage(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;
  if (value instanceof Error && value.message) return value.message;
  if (value && typeof value === "object") {
    const record = value as { error?: unknown; message?: unknown };
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
    if (
      record.error &&
      typeof record.error === "object" &&
      "message" in record.error &&
      typeof record.error.message === "string" &&
      record.error.message.trim()
    ) {
      return record.error.message;
    }
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }
  return "Something went wrong while talking to Groq.";
}

export type UsedArticle = {
  title: string;
  sourceUrl: string;
  sourceName?: string;
};

export async function requestGroqStories(articles: UsedArticle[]): Promise<unknown> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articles }),
  });
  const json = await response.json();

  if (!response.ok) {
    throw new Error(groqErrorMessage(json));
  }

  return json;
}
