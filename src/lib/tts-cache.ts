import { createHash } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const PUBLIC_TTS_DIR = path.join(process.cwd(), "public", "tts");
const TMP_TTS_DIR = path.join("/tmp", "pakeliui-tts");

export function ttsCacheKey(text: string, voiceId: string, modelId: string) {
  return createHash("sha256")
    .update(`${voiceId}\0${modelId}\0${text}`)
    .digest("hex")
    .slice(0, 40);
}

function publicCachePath(hash: string) {
  return path.join(PUBLIC_TTS_DIR, `${hash}.mp3`);
}

function tmpCachePath(hash: string) {
  return path.join(TMP_TTS_DIR, `${hash}.mp3`);
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Prefer committed/local website files, then ephemeral /tmp on serverless. */
export async function findCachedAudio(hash: string) {
  const publicPath = publicCachePath(hash);
  if (await fileExists(publicPath)) {
    return { path: publicPath, url: `/tts/${hash}.mp3` as const };
  }

  const tmpPath = tmpCachePath(hash);
  if (await fileExists(tmpPath)) {
    return { path: tmpPath, url: `/api/tts/${hash}` as const };
  }

  return null;
}

export async function readCachedAudio(hash: string) {
  const cached = await findCachedAudio(hash);
  if (!cached) return null;
  return readFile(cached.path);
}

/** Writes into public/tts when possible so files ship with the site. */
export async function writeCachedAudio(hash: string, data: Buffer) {
  try {
    await mkdir(PUBLIC_TTS_DIR, { recursive: true });
    const filePath = publicCachePath(hash);
    await writeFile(filePath, data);
    return { path: filePath, url: `/tts/${hash}.mp3` as const };
  } catch {
    await mkdir(TMP_TTS_DIR, { recursive: true });
    const filePath = tmpCachePath(hash);
    await writeFile(filePath, data);
    return { path: filePath, url: `/api/tts/${hash}` as const };
  }
}
