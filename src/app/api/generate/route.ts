import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getAllCandidates } from "@/data/all-candidates";

const PROMPT_PATH = join(process.cwd(), "src/prompts/chatgpt.txt");

type UsedArticle = {
  title: string;
  sourceUrl: string;
  sourceName?: string;
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
}

function recommendedHost(prompt: string) {
  const match = prompt.match(/https?:\/\/[^\s"'<>]+/);
  if (!match) return null;
  return hostOf(match[0].replace(/[.,)]+$/, ""));
}

function asArticles(values: unknown): UsedArticle[] {
  if (!Array.isArray(values)) return [];
  const articles: UsedArticle[] = [];
  for (const value of values) {
    if (!value || typeof value !== "object") continue;
    const record = value as {
      title?: unknown;
      sourceUrl?: unknown;
      sourceName?: unknown;
    };
    if (typeof record.sourceUrl !== "string" || !record.sourceUrl.trim()) continue;
    articles.push({
      title: typeof record.title === "string" ? record.title.trim() : "",
      sourceUrl: record.sourceUrl.trim(),
      ...(typeof record.sourceName === "string" && record.sourceName.trim()
        ? { sourceName: record.sourceName.trim() }
        : {}),
    });
  }
  return articles;
}

function fromRecommendedSource(article: UsedArticle, host: string) {
  if (hostOf(article.sourceUrl) === host) return true;
  const name = article.sourceName?.toLowerCase() ?? "";
  return name.length > 0 && host.includes(name);
}

function usedFromSource(prompt: string, articles: UsedArticle[]) {
  const host = recommendedHost(prompt);
  if (!host) return [];
  const seen = new Set<string>();
  const used: UsedArticle[] = [];
  for (const article of articles) {
    if (!fromRecommendedSource(article, host)) continue;
    const key = `${article.title.toLowerCase()}|${article.sourceUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    used.push(article);
  }
  return used;
}

function withUsedArticles(prompt: string, articles: UsedArticle[]) {
  const used = usedFromSource(prompt, articles);
  if (used.length === 0) return prompt;
  const list = used
    .map((article) =>
      article.title ? `- ${article.title} — ${article.sourceUrl}` : `- ${article.sourceUrl}`,
    )
    .join("\n");
  return `${prompt.trim()}

Jau panaudoti šio šaltinio straipsniai. Nekartok nė vieno iš jų ir šaltinio nekeisk:
${list}
Pateik kitą straipsnį iš to paties šaltinio — vėl naudok browser_search.`;
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return JSON.parse(fenced[1].trim());
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  throw new Error("Groq returned invalid JSON.");
}

function isTopicListUrl(url: string) {
  try {
    const parsed = new URL(url);
    return /\/tema\//i.test(parsed.pathname);
  } catch {
    return true;
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY. Add it to .env.local and restart the server." },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      articles?: unknown;
    };
    const template = await readFile(PROMPT_PATH, "utf8");
    const articles = [
      ...getAllCandidates().map((item) => ({
        title: item.title,
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
      })),
      ...asArticles(body.articles),
    ];
    const prompt = withUsedArticles(template, articles);

    // browser_search is incompatible with response_format/structured outputs.
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        include_reasoning: false,
        reasoning_effort: "low",
        tool_choice: "required",
        tools: [{ type: "browser_search" }],
        messages: [
          {
            role: "system",
            content:
              "You must call browser_search and open live LRT pages before answering. Never invent news, titles, URLs, or facts. Reply with a single valid JSON object only — no markdown fences, no citation markers, no extra text.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      return NextResponse.json(json, { status: response.status });
    }

    const content = json?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Groq returned an empty response." },
        { status: 502 },
      );
    }

    try {
      const parsed = extractJsonObject(content);
      if (
        parsed &&
        typeof parsed === "object" &&
        "error" in parsed &&
        typeof (parsed as { error: unknown }).error === "string"
      ) {
        return NextResponse.json(
          { error: (parsed as { error: string }).error },
          { status: 502 },
        );
      }

      const record = parsed as { sourceUrl?: unknown };
      if (
        typeof record.sourceUrl !== "string" ||
        !record.sourceUrl.trim() ||
        isTopicListUrl(record.sourceUrl)
      ) {
        return NextResponse.json(
          {
            error:
              "Groq did not return a real LRT article URL. Try generating again.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        { error: "Groq returned invalid JSON." },
        { status: 502 },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while talking to Groq.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
