import { NextResponse } from "next/server";
import {
  findCachedAudio,
  ttsCacheKey,
  writeCachedAudio,
} from "@/lib/tts-cache";

const MAX_CHARS = 5000;
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George — narrative
const DEFAULT_MODEL_ID = "eleven_v3"; // 70+ languages, includes Lithuanian

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      text?: unknown;
    };
    const text =
      typeof body.text === "string" ? body.text.trim().slice(0, MAX_CHARS) : "";

    if (!text) {
      return NextResponse.json(
        { error: "Missing text to narrate." },
        { status: 400 },
      );
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || DEFAULT_VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_MODEL_ID;
    const hash = ttsCacheKey(text, voiceId, modelId);

    const cached = await findCachedAudio(hash);
    if (cached) {
      return NextResponse.json({
        url: cached.url,
        hash,
        cached: true,
      });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing ELEVENLABS_API_KEY. Add it to .env.local and restart the server.",
        },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      let message = "ElevenLabs TTS request failed.";
      try {
        const parsed = JSON.parse(detail) as {
          detail?: { message?: string } | string;
          message?: string;
        };
        if (typeof parsed.detail === "string") message = parsed.detail;
        else if (parsed.detail?.message) message = parsed.detail.message;
        else if (parsed.message) message = parsed.message;
      } catch {
        if (detail.trim()) message = detail.slice(0, 300);
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const audio = Buffer.from(await response.arrayBuffer());
    const saved = await writeCachedAudio(hash, audio);

    return NextResponse.json({
      url: saved.url,
      hash,
      cached: false,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while talking to ElevenLabs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
