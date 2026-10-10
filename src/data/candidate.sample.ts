/**
 * Sample content format for Pakeliui candidates.
 * Colleague: generate more items in this shape and we can merge them into demo-content.ts
 *
 * Coordinates (optional): WGS84 decimal degrees, same as JUDU GTFS (stop_lat / stop_lon).
 * summary: short spoken-ready Lithuanian for MP3 (1–3 sentences).
 * fullText: optional full article body for re-summarizing later — do not narrate as-is.
 */

export type ContentCategory =
  | "news"
  | "culture"
  | "history"
  | "events"
  | "transport"
  | "evergreen";

export type CandidateItem = {
  id: string;
  title: string;
  /** Short spoken-ready Lithuanian (1–3 sentences) — use this for MP3 */
  summary: string;
  /** Full article body (for re-summarizing later; do not narrate as-is) */
  fullText?: string;
  sourceName: string;
  sourceUrl: string;
  /** ISO 8601, e.g. 2026-10-08T14:00:00+03:00 */
  publishedAt: string;
  /** Place tags used for route matching, e.g. "old-town", "neris" */
  locations: string[];
  category: ContentCategory;
  /** Source trust 0–100 (municipality ≈ 100, major news ≈ 80) */
  sourceConfidence: number;
  /** Estimated narration length in seconds */
  durationSec: number;
  /** Optional WGS84 points for map pins */
  geo?: {
    lat: number;
    lng: number;
    label?: string;
  }[];
  /** Optional path like "/audio/green-bridge.mp3" */
  audioSrc?: string;
  /** true = manually curated local fact */
  curated?: boolean;
};

export const SAMPLE_CANDIDATES: CandidateItem[] = [
  {
    id: "green-bridge",
    title: "Žaliasis tiltas – tiltas su daugybe gyvenimų",
    summary:
      "Žaliasis tiltas šimtmečius jungia abu Neries krantus. Dabartinis tiltas atidarytas 1952 metais.",
    fullText:
      "Žaliasis tiltas – vienas žinomiausių Vilniaus tiltų per Nerį. Šioje vietoje upę jungti bandyta jau nuo XV–XVI a., o dabartinis tiltas atidarytas 1952 metais. Jis jungia Šnipiškes su miesto centru ir ilgainiui tapo ne tik susisiekimo, bet ir istorinės atminties objektu. Šalia tilto keitėsi krantinės, aikštės ir kasdienis miesto ritmas, todėl tiltas dažnai minimas kaip vieta, kurioje susitinka senasis ir naujasis Vilnius.",
    sourceName: "Vilniaus miesto muziejus",
    sourceUrl: "https://www.vilniausmuziejai.lt/",
    publishedAt: "2024-06-01T09:00:00+03:00",
    locations: ["zaliasis-tiltas", "neris", "vilnius-centre"],
    category: "history",
    sourceConfidence: 90,
    durationSec: 42,
    geo: [
      {
        lat: 54.6915,
        lng: 25.2788,
        label: "Žaliasis tiltas",
      },
    ],
    curated: true,
  },
  {
    id: "exhibition-opening",
    title: "Nauja paroda netoli Senamiesčio",
    summary:
      "Šį savaitgalį galerijoje netoli Katedros aikštės atidaroma šiuolaikinio meno paroda.",
    fullText:
      "Vilniaus senamiestyje šį savaitgalį atidaroma nauja šiuolaikinio meno paroda. Galerija įsikūrusi netoli Katedros aikštės, todėl renginys patogiai pasiekiamas viešuoju transportu ir pėsčiomis iš centro. Parodoje pristatomi vietos ir užsienio menininkų darbai, o lankytojų lauks ekskursijos bei susitikimai su kūrėjais. Organizatoriai kviečia gyventojus ir miesto svečius užsukti savaitgalį, kol ekspozicija dar tik prasideda.",
    sourceName: "15min Kultūra",
    sourceUrl: "https://www.15min.lt/",
    publishedAt: "2026-10-08T14:00:00+03:00",
    locations: ["old-town", "cathedral", "vilnius-centre"],
    category: "events",
    sourceConfidence: 80,
    durationSec: 32,
    geo: [
      {
        lat: 54.6858,
        lng: 25.2875,
        label: "Katedros aikštė",
      },
    ],
  },
];
