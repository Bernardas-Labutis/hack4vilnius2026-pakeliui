import { CANDIDATES, type CandidateItem } from "./demo-content";
import { UPLOADED_CANDIDATES } from "./uploaded-candidates";

/** Map colleague place tags onto demo corridor tags used by the feed engine. */
const LOCATION_ALIASES: Record<string, string[]> = {
  vilnius: ["vilnius-centre"],
  "vilniaus-senasis-teatras": ["old-town", "vilnius-centre"],
  "skalvijos-kinoteatras": ["lukiskes", "vilnius-centre"],
};

function normalizeItem(item: CandidateItem): CandidateItem {
  const locations = new Set(item.locations);
  for (const loc of item.locations) {
    for (const alias of LOCATION_ALIASES[loc] ?? []) {
      locations.add(alias);
    }
  }
  return { ...item, locations: [...locations] };
}

/** Demo pool + uploaded items (uploaded wins on same id). */
export function getAllCandidates(): CandidateItem[] {
  const byId = new Map<string, CandidateItem>();
  for (const item of CANDIDATES) byId.set(item.id, normalizeItem(item));
  for (const item of UPLOADED_CANDIDATES) byId.set(item.id, normalizeItem(item));
  return [...byId.values()];
}
