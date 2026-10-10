import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const TARGET = path.join(
  process.cwd(),
  "src",
  "components",
  "ColleagueMap.tsx",
);

function ensureDev() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Paste lab is disabled in production." },
      { status: 403 },
    );
  }
  return null;
}

export async function GET() {
  const blocked = ensureDev();
  if (blocked) return blocked;

  try {
    const source = await fs.readFile(TARGET, "utf8");
    return NextResponse.json({ source, path: "src/components/ColleagueMap.tsx" });
  } catch {
    return NextResponse.json(
      { error: "ColleagueMap.tsx not found" },
      { status: 404 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = ensureDev();
  if (blocked) return blocked;

  const body = (await request.json()) as { source?: string };
  const source = body.source?.trim();

  if (!source) {
    return NextResponse.json({ error: "Empty source" }, { status: 400 });
  }

  if (!/export\s+default/.test(source)) {
    return NextResponse.json(
      {
        error:
          "Failas turi turėti `export default` React komponentą.",
      },
      { status: 400 },
    );
  }

  await fs.writeFile(TARGET, `${source.trim()}\n`, "utf8");

  return NextResponse.json({
    ok: true,
    path: "src/components/ColleagueMap.tsx",
    bytes: Buffer.byteLength(source, "utf8"),
  });
}
