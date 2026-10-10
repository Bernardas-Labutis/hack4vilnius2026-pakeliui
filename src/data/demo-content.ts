export type ContentCategory =
  | "news"
  | "culture"
  | "history"
  | "events"
  | "transport"
  | "evergreen";

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  news: "naujienos",
  culture: "kultūra",
  history: "istorija",
  events: "renginiai",
  transport: "transportas",
  evergreen: "amžina",
};

export type GeoPoint = {
  lat: number;
  lng: number;
  label?: string;
};

export type CandidateItem = {
  id: string;
  title: string;
  summary: string;
  /** Full article body for re-summarizing; not narrated as-is */
  fullText?: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  /** Geographic tags matched against route corridors */
  locations: string[];
  category: ContentCategory;
  /** Pre-assigned source confidence 0–100 */
  sourceConfidence: number;
  /** Estimated narration length in seconds */
  durationSec: number;
  /** Optional WGS84 points for map pins (same CRS as JUDU GTFS) */
  geo?: GeoPoint[];
  /** Optional local audio path; missing = demo preview only */
  audioSrc?: string;
  curated?: boolean;
};

/**
 * Shared candidate pool. Same items are scored for every route —
 * selection differences come only from corridor + preference + duration.
 * publishedAt values are relative to a fixed "demo now" so freshness is stable.
 */
export const DEMO_NOW = "2026-10-10T10:00:00+03:00";

export const CANDIDATES: CandidateItem[] = [
  {
    id: "green-bridge",
    title: "Žaliasis tiltas – tiltas su daugybe gyvenimų",
    summary:
      "Žaliasis tiltas šimtmečius jungia abu Neries krantus. Dabartinis tiltas atidarytas 1952 metais.",
    sourceName: "Vilniaus miesto muziejus",
    sourceUrl: "https://www.vilniausmuziejai.lt/",
    publishedAt: "2024-06-01T09:00:00+03:00",
    locations: ["zaliasis-tiltas", "neris", "vilnius-centre"],
    category: "history",
    sourceConfidence: 90,
    durationSec: 42,
    geo: [{ lat: 54.6915, lng: 25.2788, label: "Žaliasis tiltas" }],
    curated: true,
  },
  {
    id: "lukiskes-square",
    title: "Aikštė, kuri nuolat keičiasi",
    summary:
      "Nuo turgaus dienų iki švenčių – Lukiškių aikštė kartu su miestu buvo kuriama iš naujo ne kartą.",
    sourceName: "Vilniaus miesto savivaldybė",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2025-03-12T11:00:00+03:00",
    locations: ["lukiskes", "vilnius-centre"],
    category: "history",
    sourceConfidence: 100,
    durationSec: 36,
    geo: [{ lat: 54.6895, lng: 25.27, label: "Lukiškės" }],
    curated: true,
  },
  {
    id: "station-1860",
    title: "Vilnius juda",
    summary:
      "Pirmasis traukinys čia atvyko 1860 metais ir įtraukė Vilnių į kelią tarp Sankt Peterburgo ir Varšuvos.",
    sourceName: "Lietuvos geležinkelių muziejus",
    sourceUrl: "https://www.litrail.lt/",
    publishedAt: "2023-11-20T10:00:00+03:00",
    locations: ["stotis"],
    category: "history",
    sourceConfidence: 90,
    durationSec: 39,
    geo: [{ lat: 54.6702, lng: 25.2795, label: "Stotis" }],
    curated: true,
  },
  {
    id: "cathedral-square",
    title: "Ten, kur prasidėjo miestas",
    summary:
      "Katedros aikštė – istorinė Vilniaus širdis. Varpinė išlieka vienu atpažįstamiausių miesto ženklų.",
    sourceName: "Vilniaus turizmas",
    sourceUrl: "https://www.vilnius-tourism.lt/",
    publishedAt: "2024-09-01T08:00:00+03:00",
    locations: ["cathedral", "old-town", "gediminas"],
    category: "evergreen",
    sourceConfidence: 90,
    durationSec: 40,
    geo: [{ lat: 54.6858, lng: 25.2875, label: "Katedros aikštė" }],
    curated: true,
  },
  {
    id: "gediminas-tower",
    title: "Bokštas su šimtmečių vaizdu",
    summary:
      "Gedimino bokštas vainikuoja Aukštutinės pilies kalvą. Iš čia vis dar aiškiai skaitosi viduramžių gatvių planas.",
    sourceName: "Lietuvos nacionalinis muziejus",
    sourceUrl: "https://www.lnm.lt/",
    publishedAt: "2024-04-15T12:00:00+03:00",
    locations: ["gediminas", "old-town"],
    category: "culture",
    sourceConfidence: 90,
    durationSec: 38,
    geo: [{ lat: 54.6867, lng: 25.2907, label: "Gedimino bokštas" }],
    curated: true,
  },
  {
    id: "old-town-unesco",
    title: "Gyvas UNESCO Senamiestis",
    summary:
      "Vilniaus senamiestis – vienas didžiausių išlikusių Rytų Europos viduramžių centrų ir UNESCO pasaulio paveldo objektas.",
    sourceName: "UNESCO / Vilniaus turizmas",
    sourceUrl: "https://www.vilnius-tourism.lt/",
    publishedAt: "2022-05-01T09:00:00+03:00",
    locations: ["old-town"],
    category: "evergreen",
    sourceConfidence: 95,
    durationSec: 35,
    geo: [{ lat: 54.682, lng: 25.288, label: "Senamiestis" }],
    curated: true,
  },
  {
    id: "exhibition-opening",
    title: "Nauja paroda netoli Senamiesčio",
    summary:
      "Šį savaitgalį galerijoje netoli Katedros aikštės atidaroma šiuolaikinio meno paroda.",
    sourceName: "15min Kultūra",
    sourceUrl: "https://www.15min.lt/",
    publishedAt: "2026-10-08T14:00:00+03:00",
    locations: ["old-town", "cathedral", "vilnius-centre"],
    category: "events",
    sourceConfidence: 80,
    durationSec: 32,
    geo: [{ lat: 54.6845, lng: 25.285, label: "Paroda" }],
  },
  {
    id: "citywide-budget",
    title: "Miestas skelbia gatvių atnaujinimo planą",
    summary:
      "Vilniaus savivaldybė paskelbė atnaujinimą apie gatvių remonto darbus, planuojamus keliuose rajonuose šį pavasarį.",
    sourceName: "Vilniaus miesto savivaldybė",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2026-10-09T08:30:00+03:00",
    locations: ["vilnius-centre", "northern-vilnius", "new-town"],
    category: "news",
    sourceConfidence: 100,
    durationSec: 34,
    geo: [{ lat: 54.687, lng: 25.28, label: "Centras" }],
  },
  {
    id: "snipiskes-towers",
    title: "Šnipiškės auga toliau",
    summary:
      "Nauji biurų ir gyvenamieji bokštai keičia siluetą į šiaurę nuo Neries – Šnipiškės virsta moderniu verslo rajonu.",
    sourceName: "Verslo žinios",
    sourceUrl: "https://www.vz.lt/",
    publishedAt: "2026-10-07T16:00:00+03:00",
    locations: ["snipiskes", "business-district", "neris"],
    category: "news",
    sourceConfidence: 80,
    durationSec: 37,
    geo: [{ lat: 54.698, lng: 25.278, label: "Šnipiškės" }],
  },
  {
    id: "riverside-park",
    title: "Savaitgalio renginiai prie Neries",
    summary:
      "Šį savaitgalį palei šiaurinę Neries pakrantę planuojami bendruomenės pasivaikščiojimai ir atvira muzika.",
    sourceName: "Vilniaus renginiai",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2026-10-09T11:00:00+03:00",
    locations: ["neris", "snipiskes", "northern-vilnius"],
    category: "events",
    sourceConfidence: 100,
    durationSec: 30,
    geo: [{ lat: 54.695, lng: 25.275, label: "Neries pakrantė" }],
  },
  {
    id: "kalvariju-market",
    title: "Kalvarijų turgaus rytai",
    summary:
      "Kalvarijų turgus išlieka viena gyviausių miesto rytinių stotelių – vaisiai, gėlės ir kaimynų pokalbiai.",
    sourceName: "Kuratorinis vietos faktas",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2025-08-01T09:00:00+03:00",
    locations: ["kalvariju", "northern-vilnius"],
    category: "evergreen",
    sourceConfidence: 70,
    durationSec: 33,
    geo: [{ lat: 54.705, lng: 25.275, label: "Kalvarijų turgus" }],
    curated: true,
  },
  {
    id: "transport-app",
    title: "Tikslėja autobusų atvykimo prognozės",
    summary:
      "Po programinės įrangos atnaujinimo vežėjai praneša tikslesnes atvykimo prognozes miesto autobusų maršrutuose.",
    sourceName: "Susisiekimo paslaugos",
    sourceUrl: "https://www.stops.lt/",
    publishedAt: "2026-10-08T09:00:00+03:00",
    locations: ["stotis", "vilnius-centre", "northern-vilnius"],
    category: "transport",
    sourceConfidence: 100,
    durationSec: 28,
    geo: [{ lat: 54.672, lng: 25.278, label: "Transportas" }],
  },
  {
    id: "new-town-housing",
    title: "Būsto projektas prie stoties rajono",
    summary:
      "Vystytojai pristatė mišrios paskirties būsto projektą prie geležinkelio stoties prieigų – siekiama tankinti pietinį centro pakraštį.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/",
    publishedAt: "2026-10-06T13:00:00+03:00",
    locations: ["stotis", "new-town"],
    category: "news",
    sourceConfidence: 85,
    durationSec: 36,
    geo: [{ lat: 54.671, lng: 25.282, label: "Stoties rajonas" }],
  },
  {
    id: "neris-cleanup",
    title: "Šeštadienį – savanorių Neries krantų tvarkymas",
    summary:
      "Gyventojai kviečiami prisijungti prie savanorių tvarkymo akcijos palei Neries atkarpas, kuriomis eina pėstieji ir dviratininkai.",
    sourceName: "Vilniaus miesto savivaldybė",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2026-10-09T17:00:00+03:00",
    locations: ["neris", "zaliasis-tiltas", "snipiskes"],
    category: "events",
    sourceConfidence: 100,
    durationSec: 29,
    geo: [{ lat: 54.693, lng: 25.277, label: "Neries tvarkymas" }],
  },
  {
    id: "business-district-lunch",
    title: "Naujos pietų vietos verslo rajone",
    summary:
      "Šį rudenį tarp Šnipiškių stiklinių bokštų atsidarė keli nauji kavinės – orientuotos į darbo dienų biurų publiką.",
    sourceName: "15min",
    sourceUrl: "https://www.15min.lt/",
    publishedAt: "2026-10-05T12:00:00+03:00",
    locations: ["snipiskes", "business-district"],
    category: "news",
    sourceConfidence: 80,
    durationSec: 31,
    geo: [{ lat: 54.699, lng: 25.276, label: "Verslo rajonas" }],
  },
  {
    id: "culture-night",
    title: "Kultūros nakties maršrutai kerta Senamiestį",
    summary:
      "Šių metų Kultūros nakties programa vėl koncentruoja vakarinius renginius Senamiesčio kiemuose ir muziejuose.",
    sourceName: "Vilniaus kultūros naktis",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2026-09-20T10:00:00+03:00",
    locations: ["old-town", "cathedral", "lukiskes"],
    category: "culture",
    sourceConfidence: 95,
    durationSec: 34,
    geo: [{ lat: 54.683, lng: 25.286, label: "Kultūros naktis" }],
  },
  {
    id: "stale-politics",
    title: "Praėjusio mėnesio nacionalinė politikos apžvalga",
    summary:
      "Mėnesio senumo nacionalinė politikos santrauka be Vilniaus rajonų kampo – naudinga šviežumo filtro demonstracijai.",
    sourceName: "Bendrinė agentūra",
    sourceUrl: "https://example.com/stale",
    publishedAt: "2026-09-01T08:00:00+03:00",
    locations: [],
    category: "news",
    sourceConfidence: 60,
    durationSec: 45,
  },
  {
    id: "duplicate-bridge",
    title: "Žaliasis tiltas: dar viena trumpa pastaba",
    summary:
      "Antra trumpa pastaba apie tą patį tiltą – palikta kandidatų rinkinyje, kad parodytų dubliuojančių temų filtravimą.",
    sourceName: "Kuratorinis vietos faktas",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2025-01-10T09:00:00+03:00",
    locations: ["zaliasis-tiltas", "neris"],
    category: "history",
    sourceConfidence: 70,
    durationSec: 25,
    geo: [{ lat: 54.6918, lng: 25.2792, label: "Žaliasis tiltas (dublikatas)" }],
    curated: true,
  },
];
