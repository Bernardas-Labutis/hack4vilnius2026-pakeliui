import { getAllCandidates } from "@/data/all-candidates";
import {
  DEMO_NOW,
  type CandidateItem,
  type ContentCategory,
} from "@/data/demo-content";
import type { PreferenceMode, RouteProfile } from "@/data/routes";

export type RejectionReason =
  | "irrelevant"
  | "stale"
  | "duplicate"
  | "too_long"
  | "duration_budget"
  | "low_score";

export type ScoreBreakdown = {
  routeRelevance: number;
  freshness: number;
  sourceConfidence: number;
  preferenceFit: number;
  diversity: number;
  diversityPreference: number;
  total: number;
};

export type ScoredCandidate = {
  item: CandidateItem;
  scores: ScoreBreakdown;
  selected: boolean;
  order?: number;
  rejectionReason?: RejectionReason;
};

export type FeedResult = {
  selected: ScoredCandidate[];
  rejected: ScoredCandidate[];
  all: ScoredCandidate[];
  candidatesFound: number;
  storiesSelected: number;
  filteredOut: number;
  estimatedAudioSec: number;
};

export type BuildFeedInput = {
  route: RouteProfile;
  durationMinutes: number;
  preference: PreferenceMode;
  now?: string;
  candidates?: CandidateItem[];
};

const WEIGHTS = {
  routeRelevance: 0.4,
  freshness: 0.25,
  sourceConfidence: 0.2,
  diversityPreference: 0.15,
} as const;

const HALF_LIFE_HOURS: Record<ContentCategory, number> = {
  news: 24,
  events: 48,
  transport: 72,
  culture: 168,
  history: 720,
  evergreen: 1440,
};

const PREFERENCE_BOOST: Record<PreferenceMode, Partial<Record<ContentCategory, number>>> = {
  recent: { news: 100, events: 90, transport: 80, culture: 50, history: 30, evergreen: 20 },
  balanced: { news: 70, events: 75, culture: 70, history: 70, transport: 70, evergreen: 70 },
  evergreen: { evergreen: 100, history: 95, culture: 90, events: 50, transport: 40, news: 25 },
};

/** Topic keys used to detect near-duplicates in the demo pool */
const TOPIC_KEYS: Record<string, string> = {
  "green-bridge": "zaliasis-tiltas",
  "duplicate-bridge": "zaliasis-tiltas",
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hoursBetween(fromIso: string, toIso: string) {
  const ms = new Date(toIso).getTime() - new Date(fromIso).getTime();
  return Math.max(0, ms / (1000 * 60 * 60));
}

export function scoreRouteRelevance(
  item: CandidateItem,
  corridor: string[],
): number {
  if (item.locations.length === 0) return 5;
  const matches = item.locations.filter((loc) => corridor.includes(loc));
  if (matches.length === 0) return 12;
  const ratio = matches.length / item.locations.length;
  return clamp(40 + matches.length * 22 + ratio * 20);
}

export function scoreFreshness(item: CandidateItem, nowIso: string): number {
  const ageHours = hoursBetween(item.publishedAt, nowIso);
  const halfLife = HALF_LIFE_HOURS[item.category];
  const raw = 100 * Math.pow(2, -ageHours / halfLife);
  // Evergreen / history keep a floor so they remain selectable
  if (item.category === "evergreen" || item.category === "history") {
    return clamp(Math.max(raw, 55));
  }
  return clamp(raw);
}

export function scorePreferenceFit(
  item: CandidateItem,
  preference: PreferenceMode,
): number {
  return PREFERENCE_BOOST[preference][item.category] ?? 50;
}

function scoreDiversity(
  item: CandidateItem,
  selected: CandidateItem[],
): number {
  const sameCategory = selected.filter((s) => s.category === item.category).length;
  if (sameCategory === 0) return 100;
  if (sameCategory === 1) return 50;
  return 10;
}

function topicKey(item: CandidateItem) {
  return TOPIC_KEYS[item.id] ?? item.id;
}

function isDuplicate(item: CandidateItem, selected: CandidateItem[]) {
  const key = topicKey(item);
  return selected.some((s) => topicKey(s) === key);
}

function formatRejection(reason: RejectionReason): string {
  switch (reason) {
    case "irrelevant":
      return "Mažas maršruto aktualumas";
    case "stale":
      return "Per sena šiam prioritetui";
    case "duplicate":
      return "Tema jau atrinkta";
    case "too_long":
      return "Ilgesnė nei likęs kelionės biudžetas";
    case "duration_budget":
      return "Kelionės trukmės biudžetas jau pilnas";
    case "low_score":
      return "Nusileido stipresniems kandidatams";
  }
}

export function rejectionLabel(reason: RejectionReason) {
  return formatRejection(reason);
}

function totalScore(
  routeRelevance: number,
  freshness: number,
  sourceConfidence: number,
  preferenceFit: number,
  diversity: number,
): ScoreBreakdown {
  const diversityPreference = clamp(0.6 * preferenceFit + 0.4 * diversity);
  const total = clamp(
    routeRelevance * WEIGHTS.routeRelevance +
      freshness * WEIGHTS.freshness +
      sourceConfidence * WEIGHTS.sourceConfidence +
      diversityPreference * WEIGHTS.diversityPreference,
  );
  return {
    routeRelevance,
    freshness,
    sourceConfidence,
    preferenceFit,
    diversity,
    diversityPreference,
    total,
  };
}

export function buildFeed(input: BuildFeedInput): FeedResult {
  const now = input.now ?? DEMO_NOW;
  const pool = input.candidates ?? getAllCandidates();
  // Leave headroom so the feed feels curated, not max-packed.
  const budgetSec = Math.round(input.durationMinutes * 60 * 0.7);
  const maxStories = Math.max(2, Math.ceil(input.durationMinutes / 2));

  const base = pool.map((item) => {
    const routeRelevance = scoreRouteRelevance(item, input.route.corridor);
    const freshness = scoreFreshness(item, now);
    const preferenceFit = scorePreferenceFit(item, input.preference);
    return {
      item,
      routeRelevance,
      freshness,
      preferenceFit,
    };
  });

  const selected: ScoredCandidate[] = [];
  const selectedItems: CandidateItem[] = [];
  let usedSec = 0;
  const remaining = new Set(base.map((b) => b.item.id));

  while (remaining.size > 0) {
    let best: {
      entry: (typeof base)[number];
      scores: ScoreBreakdown;
    } | null = null;

    for (const entry of base) {
      if (!remaining.has(entry.item.id)) continue;

      const diversity = scoreDiversity(entry.item, selectedItems);
      const scores = totalScore(
        entry.routeRelevance,
        entry.freshness,
        entry.item.sourceConfidence,
        entry.preferenceFit,
        diversity,
      );

      if (!best || scores.total > best.scores.total) {
        best = { entry, scores };
      }
    }

    if (!best) break;

    const { entry, scores } = best;
    remaining.delete(entry.item.id);

    if (scores.routeRelevance < 25) {
      continue; // will be marked irrelevant later
    }
    if (input.preference === "recent" && scores.freshness < 20) {
      continue;
    }
    if (isDuplicate(entry.item, selectedItems)) {
      continue;
    }
    if (entry.item.durationSec > budgetSec - usedSec) {
      if (usedSec === 0 && entry.item.durationSec > budgetSec) {
        continue;
      }
      if (usedSec > 0) {
        continue;
      }
    }
    if (usedSec + entry.item.durationSec > budgetSec) {
      continue;
    }

    selectedItems.push(entry.item);
    selected.push({
      item: entry.item,
      scores,
      selected: true,
      order: selected.length + 1,
    });
    usedSec += entry.item.durationSec;

    if (selected.length >= maxStories) break;
    if (usedSec >= budgetSec * 0.92) break;
  }

  const selectedIds = new Set(selected.map((s) => s.item.id));

  const rejected: ScoredCandidate[] = base
    .filter((entry) => !selectedIds.has(entry.item.id))
    .map((entry) => {
      const diversity = scoreDiversity(entry.item, selectedItems);
      const scores = totalScore(
        entry.routeRelevance,
        entry.freshness,
        entry.item.sourceConfidence,
        entry.preferenceFit,
        diversity,
      );

      let rejectionReason: RejectionReason = "low_score";
      if (scores.routeRelevance < 25) rejectionReason = "irrelevant";
      else if (input.preference === "recent" && scores.freshness < 20)
        rejectionReason = "stale";
      else if (isDuplicate(entry.item, selectedItems))
        rejectionReason = "duplicate";
      else if (entry.item.durationSec > budgetSec)
        rejectionReason = "too_long";
      else if (usedSec + entry.item.durationSec > budgetSec)
        rejectionReason = "duration_budget";

      return {
        item: entry.item,
        scores,
        selected: false,
        rejectionReason,
      };
    })
    .sort((a, b) => b.scores.total - a.scores.total);

  const all = [...selected, ...rejected];

  return {
    selected,
    rejected,
    all,
    candidatesFound: pool.length,
    storiesSelected: selected.length,
    filteredOut: rejected.length,
    estimatedAudioSec: usedSec,
  };
}

export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
