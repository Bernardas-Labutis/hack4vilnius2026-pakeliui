import type { CandidateItem } from "@/data/demo-content";

const MAX_CHARS = 5000;

/** Prefer full article text; fall back to spoken summary. */
export function narrationText(item: CandidateItem) {
  const text = item.fullText?.trim() || item.summary.trim();
  return text.slice(0, MAX_CHARS);
}

export async function fetchNarrationAudio(text: string): Promise<Blob> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const json = (await response.json().catch(() => null)) as {
      error?: unknown;
    } | null;
    const message =
      typeof json?.error === "string" && json.error.trim()
        ? json.error
        : `TTS failed (${response.status}).`;
    throw new Error(message);
  }

  return response.blob();
}

export function ttsErrorMessage(value: unknown) {
  if (value instanceof Error && value.message.trim()) return value.message;
  return "Nepavyko sugeneruoti garso.";
}
