import type { CandidateItem } from "@/data/demo-content";

const MAX_CHARS = 5000;

/** Prefer full article text; fall back to spoken summary. */
export function narrationText(item: CandidateItem) {
  const text = item.fullText?.trim() || item.summary.trim();
  return text.slice(0, MAX_CHARS);
}

/** Resolve a stable site URL for narration audio (file-cached on the server). */
export async function fetchNarrationAudioUrl(text: string): Promise<string> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const json = (await response.json().catch(() => null)) as {
    url?: unknown;
    error?: unknown;
  } | null;

  if (!response.ok) {
    const message =
      typeof json?.error === "string" && json.error.trim()
        ? json.error
        : `TTS failed (${response.status}).`;
    throw new Error(message);
  }

  if (typeof json?.url !== "string" || !json.url.trim()) {
    throw new Error("TTS response missing audio url.");
  }

  return json.url;
}

export function ttsErrorMessage(value: unknown) {
  if (value instanceof Error && value.message.trim()) return value.message;
  return "Nepavyko sugeneruoti garso.";
}
