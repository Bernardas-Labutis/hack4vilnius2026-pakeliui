import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const TARGET = path.join(
  process.cwd(),
  "src",
  "data",
  "uploaded-candidates.ts",
);

function ensureDev() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Content lab is disabled in production." },
      { status: 403 },
    );
  }
  return null;
}

/** Pull a `[...]` array from raw paste (JSON or JS object literals). */
function extractArrayLiteral(source: string): string | null {
  const trimmed = source.trim().replace(/^\uFEFF/, "");
  if (!trimmed) return null;

  const exportMatch = trimmed.match(
    /export\s+const\s+\w+\s*(?::\s*[^=]+)?=\s*(\[[\s\S]*\])\s*;?\s*$/,
  );
  if (exportMatch) return exportMatch[1].trim();

  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start !== -1 && end > start) {
    return trimmed.slice(start, end + 1).trim();
  }

  return null;
}

function looksLikeCandidates(arrayLiteral: string) {
  // JS: id:   or JSON: "id":
  return (
    (/(\bid\s*:|"id"\s*:)/.test(arrayLiteral) &&
      /(\btitle\s*:|"title"\s*:)/.test(arrayLiteral)) ||
    false
  );
}

/**
 * If paste is strict JSON, pretty-print it (valid in .ts too).
 * If it's JS-style ({ id: "..." }), keep the literal as-is for TypeScript.
 */
function toTsArrayLiteral(arrayLiteral: string): string {
  try {
    const parsed = JSON.parse(arrayLiteral) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("not array");
    }
    return JSON.stringify(parsed, null, 2);
  } catch {
    return arrayLiteral;
  }
}

function buildFile(arrayLiteral: string) {
  return `import type { CandidateItem } from "./demo-content";

/**
 * Candidates pasted via /lab/content.
 * Replaced when you click Įkelti on the content lab page.
 */
export const UPLOADED_CANDIDATES: CandidateItem[] = ${arrayLiteral};
`;
}

export async function GET() {
  const blocked = ensureDev();
  if (blocked) return blocked;

  try {
    const source = await fs.readFile(TARGET, "utf8");
    return NextResponse.json({
      source,
      path: "src/data/uploaded-candidates.ts",
    });
  } catch {
    return NextResponse.json(
      { error: "uploaded-candidates.ts not found" },
      { status: 404 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = ensureDev();
  if (blocked) return blocked;

  const body = (await request.json()) as { source?: string };
  const raw = body.source ?? "";
  const extracted = extractArrayLiteral(raw);

  if (!extracted) {
    return NextResponse.json(
      {
        error:
          "Paste a candidate array starting with [ ... ]. JS object style or JSON both work.",
      },
      { status: 400 },
    );
  }

  if (!looksLikeCandidates(extracted)) {
    return NextResponse.json(
      { error: "Each item needs at least id and title." },
      { status: 400 },
    );
  }

  const arrayLiteral = toTsArrayLiteral(extracted);
  const file = buildFile(arrayLiteral);
  await fs.writeFile(TARGET, file, "utf8");

  return NextResponse.json({
    ok: true,
    path: "src/data/uploaded-candidates.ts",
    bytes: Buffer.byteLength(file, "utf8"),
  });
}
