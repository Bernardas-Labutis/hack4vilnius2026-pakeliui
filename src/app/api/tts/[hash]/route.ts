import { NextResponse } from "next/server";
import { readCachedAudio } from "@/lib/tts-cache";

type Params = { params: Promise<{ hash: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { hash } = await params;
  if (!/^[a-f0-9]{16,64}$/i.test(hash)) {
    return NextResponse.json({ error: "Invalid audio id." }, { status: 400 });
  }

  const audio = await readCachedAudio(hash);
  if (!audio) {
    return NextResponse.json({ error: "Audio not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(audio), {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
