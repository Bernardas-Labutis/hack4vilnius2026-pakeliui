export type ContentCategory =
  | "news"
  | "culture"
  | "history"
  | "events"
  | "transport"
  | "evergreen"
  | "music"
  | "sports"
  | "crime"
  | "science";

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  news: "naujienos",
  culture: "kultūra",
  history: "istorija",
  events: "renginiai",
  transport: "transportas",
  evergreen: "amžina",
  music: "muzika",
  sports: "sportas",
  crime: "kriminalai",
  science: "mokslas",
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
    title: "Žaliasis tiltas – kelionės į Šnipiškes pradžia",
    summary:
      "Go Vilnius pasakoja, kaip pirmasis tiltas per Nerį atvėrė dešinįjį krantą: nuo XVI a. Hozijaus statinio iki žalios spalvos, kuri tiltui prigijo po 1766 m. rekonstrukcijos.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/marsrutai/pasivaiksiojimas-po-snipiskes/zaliasis-tiltas",
    publishedAt: "2025-06-01T09:00:00+03:00",
    locations: ["zaliasis-tiltas", "neris", "vilnius-centre"],
    category: "history",
    sourceConfidence: 95,
    durationSec: 42,
    geo: [{ lat: 54.6915, lng: 25.2788, label: "Žaliasis tiltas" }],
    curated: true,
  },
  {
    id: "lukiskes-prison",
    title: "Lukiškių kalėjimas 2.0 – kalėjimas, tapęs kultūros erdve",
    summary:
      "Go Vilnius kviečia į Lukiškių kalėjimą 2.0: dienos ir nakties ekskursijos, menininkų studijos ir erdvės, kur filmavo „Stranger Things“.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/lankytinos-vietos/lukiskiu-kalejimas",
    publishedAt: "2025-08-12T11:00:00+03:00",
    locations: ["lukiskes", "vilnius-centre"],
    category: "culture",
    sourceConfidence: 100,
    durationSec: 38,
    geo: [{ lat: 54.6908, lng: 25.2685, label: "Lukiškių kalėjimas" }],
    curated: true,
  },
  {
    id: "white-bridge",
    title: "Kodėl Baltasis tiltas toks ilgas?",
    summary:
      "Go Vilnius paaiškina 240 m Baltojo tilto ilgį: XX a. vizijose čia planuota sala Neryje, o šiandien žalia zona prie tilto – viena mėgstamiausių vasaros erdvių.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/marsrutai/pasivaiksiojimas-po-snipiskes/baltasis-tiltas",
    publishedAt: "2025-07-01T10:00:00+03:00",
    locations: ["neris", "lukiskes", "vilnius-centre"],
    category: "history",
    sourceConfidence: 95,
    durationSec: 36,
    geo: [{ lat: 54.6897, lng: 25.2735, label: "Baltasis tiltas" }],
    curated: true,
  },
  {
    id: "cathedral-belfry",
    title: "Vilniaus katedros varpinė – panorama ir varpai",
    summary:
      "Go Vilnius: 52 m varpinėje – varpų ekspozicija, senasis miesto laikrodis ir vaizdas į Katedros aikštę bei tris katedros skulptūras.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/lankytinos-vietos/vilniaus-katedros-varpine",
    publishedAt: "2025-09-01T08:00:00+03:00",
    locations: ["cathedral", "old-town", "gediminas"],
    category: "evergreen",
    sourceConfidence: 100,
    durationSec: 40,
    geo: [{ lat: 54.6857, lng: 25.2872, label: "Katedros varpinė" }],
    curated: true,
  },
  {
    id: "gediminas-tower",
    title: "Gedimino pilies bokštas ir miesto panorama",
    summary:
      "Go Vilnius kviečia į lankomiausią LNM padalinį: istorinė ekspozicija bokšte ir apžvalgos aikštelė su raudonais Senamiesčio stogais.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/lankytinos-vietos/gedimino-pilies-bokstas",
    publishedAt: "2025-04-15T12:00:00+03:00",
    locations: ["gediminas", "old-town"],
    category: "culture",
    sourceConfidence: 100,
    durationSec: 38,
    geo: [{ lat: 54.6867, lng: 25.2907, label: "Gedimino bokštas" }],
    curated: true,
  },
  {
    id: "bernardine-garden",
    title: "Bernardinų sodas – oazė prie pilies kalno",
    summary:
      "Go Vilnius pristato Bernardinų sodą tarp Gedimino bokšto ir Vilnelės: botanikos ekspozicija, fontanas ir seniausias Vilniaus ąžuolas.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/lankytinos-vietos/bernardinu-sodas",
    publishedAt: "2025-05-01T09:00:00+03:00",
    locations: ["old-town", "gediminas", "vilnius-centre"],
    category: "evergreen",
    sourceConfidence: 100,
    durationSec: 35,
    geo: [{ lat: 54.6839, lng: 25.2975, label: "Bernardinų sodas" }],
    curated: true,
  },
  {
    id: "st-anne",
    title: "Šv. Onos bažnyčia – Vilniaus gotikos simbolis",
    summary:
      "Go Vilnius apie Šv. Onos ir Bernardinų kompleksą: vėlyvosios gotikos šedevras Senamiestyje ir legenda apie Napoleoną, norėjusį bažnyčią nusinešti į Paryžių.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/lankytinos-vietos/sv-onos-ir-bernardinu-kompleksas",
    publishedAt: "2025-03-20T10:00:00+03:00",
    locations: ["old-town"],
    category: "evergreen",
    sourceConfidence: 100,
    durationSec: 37,
    geo: [{ lat: 54.6831, lng: 25.2935, label: "Šv. Onos bažnyčia" }],
    curated: true,
  },
  {
    id: "vilnius-days",
    title: "„Vilniaus dienos“: Katedros aikštė, Lukiškės ir Neries krantinė",
    summary:
      "LRT: didžiausia miesto šventė užpildo Katedros aikštę, Gedimino prospektą, Lukiškių aikštę ir Neries krantinę prie Baltojo tilto – nuo knygų iki koncertų.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/laisvalaikis/13/3041308/vilniaus-dienos-ka-svarbu-zinoti-pries-prasidedant-didziausiai-miesto-sventei",
    publishedAt: "2026-09-03T12:00:00+03:00",
    locations: ["cathedral", "old-town", "lukiskes", "neris"],
    category: "events",
    sourceConfidence: 100,
    durationSec: 45,
    geo: [{ lat: 54.6855, lng: 25.2878, label: "Katedros aikštė" }],
  },
  {
    id: "river-festival",
    title: "Upės festivalis: Neries pakrantės prisipildo muzikos",
    summary:
      "LRT: pirmą kartą Vilniuje – Upės festivalis nuo Vingio iki Žirmūnų tilto; prie Baltojo tilto – sportas, koncertas ir veiklos prie vandens.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/laisvalaikis/13/2955209/pirma-karta-vilniuje-upes-festivalis-neries-pakrantes-prisipildys-muzikos-ir-pramogu",
    publishedAt: "2026-06-09T13:12:00+03:00",
    locations: ["neris", "zaliasis-tiltas", "lukiskes"],
    category: "events",
    sourceConfidence: 100,
    durationSec: 40,
    geo: [{ lat: 54.6902, lng: 25.2758, label: "Neries krantinė" }],
  },
  {
    id: "unesco-old-town",
    title: "Kai Senamiestis pateko į UNESCO sąrašą",
    summary:
      "LRT primena, kodėl Vilniaus istorinis centras tapo pirmuoju Lietuvos objektu UNESCO pasaulio paveldo sąraše – ir ką tai reiškė valstybei.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/kultura/12/2504880/lietuva-tapo-matoma-ka-reiske-vilniaus-senamiescio-itraukimas-i-unesco-sarasa",
    publishedAt: "2024-11-10T09:00:00+03:00",
    locations: ["old-town"],
    category: "history",
    sourceConfidence: 95,
    durationSec: 42,
    geo: [{ lat: 54.682, lng: 25.288, label: "Senamiestis" }],
    curated: true,
  },
  {
    id: "kristupas-summer",
    title: "Kristupo vasaros festivalis 2026 – ir ant Neries",
    summary:
      "Go Vilnius: du vasaros mėnesius per daugiau nei 40 renginių – klasika, džiazas ir eksperimentai salėse, parkuose ir laive prie Neries pakrantės.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/rekomenduojame/vilniaus-renginiai-2026",
    publishedAt: "2026-05-15T10:00:00+03:00",
    locations: ["neris", "old-town", "vilnius-centre"],
    category: "events",
    sourceConfidence: 95,
    durationSec: 34,
    geo: [{ lat: 54.6885, lng: 25.2765, label: "Neries pakrantė" }],
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
    id: "seskine-square",
    title: "Šeškinėje atidaryta atnaujinta centrinė aikštė",
    summary:
      "LRT: sutvarkyta daugiau kaip 6000 kv. m Šeškinės centrinės aikštės – suolai, želdiniai ir bendruomenės šventė; meras kalbėjo apie rajono atgimimą.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/verslas/4/2689441/sostines-seskines-rajone-atidaryta-atnaujinta-centrine-aikste",
    publishedAt: "2025-09-23T11:59:00+03:00",
    locations: ["seskine", "laisves-pr", "northern-vilnius"],
    category: "news",
    sourceConfidence: 100,
    durationSec: 36,
    geo: [{ lat: 54.7128, lng: 25.2505, label: "Šeškinės aikštė" }],
  },
  {
    id: "seskine-clinic",
    title: "Šeškinės poliklinika atvėrė Vaikų raidos centrą",
    summary:
      "LRT: naujose patalpose prekybos centre „Pikas“ – vaikų ir paauglių psichikos sveikatos bei ankstyvosios raidos reabilitacijos paslaugos.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/sveikata/682/2958166/seskines-poliklinika-atvere-naujas-patalpas-sieks-didinti-paslaugu-prieinamuma-vaikams",
    publishedAt: "2026-06-12T12:11:00+03:00",
    locations: ["seskine", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    durationSec: 34,
    geo: [{ lat: 54.7115, lng: 25.2552, label: "Šeškinės poliklinika" }],
  },
  {
    id: "pasilaiciai-square",
    title: "Pašilaičiuose atnaujinta viešoji erdvė Medeinos g.",
    summary:
      "LRT: tarp daugiabučių atverta sutvarkyta erdvė – takai, želdiniai, vieta ūkininkų prekybai; atidaryme – JUDU edukacijos ir ekskursija po Pašilaičius.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/laisvalaikis/13/2911277/pasilaiciuose-atnaujinta-viesoji-erdve-bendruomenes-laukia-svente",
    publishedAt: "2026-04-27T15:22:00+03:00",
    locations: ["pasilaiciai", "laisves-pr", "northern-vilnius"],
    category: "events",
    sourceConfidence: 100,
    durationSec: 32,
    geo: [{ lat: 54.7245, lng: 25.2185, label: "Pašilaičiai · Medeinos g." }],
  },
  {
    id: "pasilaiciai-complex",
    title: "Pašilaičiuose – naujas būsto, sporto ir komercijos kvartalas",
    summary:
      "LRT: „Rewo“ Leičių g. planuoja apie 670 butų, darželį, sporto klubą ir bendruomenės erdves prie Perkūnkiemio gatvės.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/verslas/4/2627024/sostines-pasilaiciuose-iskils-naujas-busto-sporto-ir-komercinis-kompleksas",
    publishedAt: "2025-11-18T10:00:00+03:00",
    locations: ["pasilaiciai", "laisves-pr"],
    category: "news",
    sourceConfidence: 95,
    durationSec: 35,
    geo: [{ lat: 54.7282, lng: 25.2128, label: "Pašilaičiai · Leičių g." }],
  },
  {
    id: "justiniskes-school",
    title: "Justiniškėse – leidimas „Vyturio“ mokyklos rekonstrukcijai",
    summary:
      "LRT: Taikos g. 189 mokykla augs iki A++ energinės klasės; po rekonstrukcijos – apie 384 mokiniai, sporto salė ir priedanga.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/svietimas/45/2814230/isduotas-statybos-leidimas-mokyklos-justiniskese-rekonstrukcijai",
    publishedAt: "2026-01-22T13:01:00+03:00",
    locations: ["justiniskes", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    durationSec: 33,
    geo: [{ lat: 54.7168, lng: 25.2265, label: "Justiniškės · Vyturio mokykla" }],
  },
  {
    id: "karoliniskes-orchard",
    title: "Karoliniškių obelyne – saulės gultai su vaizdu į TV bokštą",
    summary:
      "LRT: gyventojos idėja dalyvaujamajame biudžete pavertė pievą poilsio oaze – besisukantys gultai ir panorama į televizijos bokštą.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/laisvalaikis/13/2996178/paprasta-gyventojos-ideja-pieva-karoliniskiu-obelyne-paverte-tikra-poilsio-oaze",
    publishedAt: "2026-07-18T11:00:00+03:00",
    locations: ["karoliniskes", "laisves-pr"],
    category: "events",
    sourceConfidence: 100,
    durationSec: 34,
    geo: [{ lat: 54.6895, lng: 25.2148, label: "Karoliniškių obelynas" }],
  },
  {
    id: "karoliniskes-traffic-park",
    title: "Karoliniškėse – saugaus eismo erdvė vaikams",
    summary:
      "LRT: prie Sietyno ir V. Maciulevičiaus g. planuojama aikštelė su žiedinėmis sankryžomis, šviesoforais ir poilsio zonomis – atverti 2027 m.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/eismas/7/2952130/sostine-uz-0-89-mln-euru-irengs-saugaus-eismo-edukacijai-skirta-erdve-vaikams",
    publishedAt: "2026-06-06T17:33:00+03:00",
    locations: ["karoliniskes", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    durationSec: 32,
    geo: [{ lat: 54.6848, lng: 25.2215, label: "Karoliniškių šlaitai" }],
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
      "Antra pastaba apie tą patį tiltą – palikta, kad parodytų dubliuojančių temų filtravimą greta Go Vilnius Žaliojo tilto istorijos.",
    sourceName: "Go Vilnius",
    sourceUrl:
      "https://www.govilnius.lt/aplankykite/marsrutai/pasivaiksiojimas-po-snipiskes/zaliasis-tiltas",
    publishedAt: "2025-01-10T09:00:00+03:00",
    locations: ["zaliasis-tiltas", "neris"],
    category: "history",
    sourceConfidence: 70,
    durationSec: 25,
    geo: [{ lat: 54.6918, lng: 25.2792, label: "Žaliasis tiltas (dublikatas)" }],
    curated: true,
  },
  {
    id: "7c9a2e41-6b83-4fd2-9c15-8e2b7a4d1f60",
    title:
      "Vilniaus senojo teatro scenoje – tarptautinis „Vilnius Jazz“ festivalis",
    summary:
      "LRT: 2026 m. spalio 14–19 d. Vilniaus senajame teatre – 39-asis „Vilnius Jazz“; koncertai ir Sigito Kondrato paroda „Vizualinės improvizacijos“.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/kultura/12/3075146/vilnius-jazz-festivalio-dialogai-ir-kino-saleje-paskaitose-parodoje",
    publishedAt: "2026-10-07T12:45:00+03:00",
    locations: [
      "old-town",
      "vilnius-centre",
      "vilniaus-senasis-teatras",
      "skalvijos-kinoteatras",
      "stotis",
    ],
    category: "music",
    sourceConfidence: 100,
    durationSec: 48,
    geo: [
      {
        lat: 54.6786,
        lng: 25.2818,
        label: "Vilniaus senasis teatras",
      },
    ],
  },
  {
    id: "550a1c8e-9f3e-4b2d-bc3e-2d5f5e7c4d7b",
    title:
      "Sovietmečiu išdarkytas pastatas atgijo antram gyvenimui: tapo vienu brangiausių sostinėje",
    summary:
      "Šiandien Kražių kolonijoje, šalia Lukiškių aikštės, atgaivė vienas senų pastatų, kurio interjerą atkūrė verslininkė Inga Malinauskienė. Pastatas, išskirtinis architektūros perlas, dabar tampa viena iš vertingiausių Vilniaus būsto kolekcijų.",
    fullText:
      "Pačioje Vilniaus širdyje, šalia Lukiškių aikštės, esanti Kražių kolonija – vienas pirmųjų miesto mikrorajonų, statytų daugiau nei prieš šimtą metų, filantropo Juozapo Montvilos užsakymu. Nedidelis kvartalas iki šiol išlaikė senojo Vilniaus dvasią: tylūs kiemeliai, puošnūs fasadai ir namai, kurie slepia čia gyvenusios inteligentijos paslaptis. Šiandien vienas iš kolonijos perlų išgyvena tikrą atgimimą: sovietmečiu išdarkytas ir į mažus butus padalytas namas buvo atkurtas beveik nuo pamatų. Pastatą restauruoja verslininkė Inga Malinauskienė, kuri kartu su vyru šešerius metus stengėsi, kad griuvena virtęs architektūros perlas vėl sužibėtų. Šeimininkų dėka Kražių kolonija tapo valstybės saugomu objektu, čia restauruoti autentiški laiptai, originalūs turėklai, šimtametis parketas, lubų lipdiniai, marmurinės palangės. Išskirtinio būsto Vilniaus centre interjeras išlaiko namo charakterį ir autentiškumą, tačiau integruoja šiuolaikines technologijas. Pastatas, tapęs vienu brangiausių sostinėje, yra įdomus pavyzdys, kaip senas architektūros stilius gali prisijungti prie šiandienos gyvenimo poreikių.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/laisvalaikis/13/2963170/sovietmeciu-isdarkytas-pastatas-atgijo-antram-gyvenimui-tapo-vienu-brangiausiu-sostineje",
    publishedAt: "2026-07-04T11:01:00+03:00",
    locations: ["old-town", "krauzyk-kolonija"],
    category: "culture",
    sourceConfidence: 100,
    durationSec: 180,
    geo: [
      {
        lat: 54.679,
        lng: 25.27,
        label: "Kražių kolonija",
      },
    ],
    curated: true,
  },
  {
    id: "f3a1c9e7-4d2b-4f6b-9b2a-3e1d6b1c7e4a",
    title: "Vilniuje atsiras trys naujos viešojo transporto stotelės",
    summary:
      "Tris naujos stotelės Vilniuje – „Riovonių“, „Lapių“ ir „Voverių“ – suteiks patogumo gyventojams ir bus įrengtos nuo šv. 10‑ąją.",
    fullText:
      "Vilniuje atsiras trys naujos viešojo transporto stotelės – Riovonių, Lapių ir Voverių – nuo šiandien, pranešė savivaldybės įmonė „Judu“. Nuo šeštadienio bus įvesta 119 maršruto autobusu, 123 maršrutas bus įtrauktas iki Riovonių. Taip pat bus atnaujinti 118 ir 122 maršrutai, kurie bus veikiantys dažniau. Visi šie pakeitimai skirti gerinti viešojo transporto paslaugas ir padaryti kelionę patogesnę gyventojams.",
    sourceName: "LRT",
    sourceUrl:
      "https://www.lrt.lt/naujienos/eismas/7/3078008/vilniuje-atsiras-trys-naujos-viesojo-transporto-stoteles",
    publishedAt: "2026-10-10T06:48:00+03:00",
    locations: ["vilnius-centre", "new-town", "stotis"],
    category: "transport",
    sourceConfidence: 100,
    durationSec: 180,
    geo: [
      {
        lat: 54.6872,
        lng: 25.2797,
        label: "Riovonių stotelė",
      },
    ],
    curated: true,
  },
  {
    id: "snipiskes-concert",
    title: "Vasaros koncertai Šnipiškių krantinėje",
    summary:
      "Prie Neries planuojama atvira koncertų serija – vietiniai ir svečių atlikėjai, orientuoti į vakarinius miestiečių pasivaikščiojimus.",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/",
    publishedAt: "2026-09-28T16:00:00+03:00",
    locations: ["snipiskes", "neris", "business-district"],
    category: "music",
    sourceConfidence: 90,
    durationSec: 34,
    geo: [{ lat: 54.6975, lng: 25.2755, label: "Šnipiškių krantinė" }],
  },
  {
    id: "kalvariju-run",
    title: "Kalvarijų gatvėje – bendruomenės bėgimas",
    summary:
      "Sekmadienį Kalvarijų g. koridoriumi vyks mėgėjų bėgimas: trumpi ir ilgesni nuotoliai, registracija prie turgaus aikštės.",
    sourceName: "15min",
    sourceUrl: "https://www.15min.lt/",
    publishedAt: "2026-10-04T10:30:00+03:00",
    locations: ["kalvariju", "northern-vilnius"],
    category: "sports",
    sourceConfidence: 85,
    durationSec: 30,
    geo: [{ lat: 54.7065, lng: 25.2745, label: "Kalvarijų g." }],
  },
  {
    id: "seskine-arena-sports",
    title: "Šeškinėje – vaikų krepšinio turnyras",
    summary:
      "Savaitgalį Šeškinės sporto salėje – rajono mokyklų krepšinio turnyras; organizatoriai kviečia šeimas stebėti rungtynes nemokamai.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/",
    publishedAt: "2026-10-03T14:00:00+03:00",
    locations: ["seskine", "laisves-pr"],
    category: "sports",
    sourceConfidence: 90,
    durationSec: 32,
    geo: [{ lat: 54.7135, lng: 25.2485, label: "Šeškinės sporto salė" }],
  },
  {
    id: "stotis-theft-alert",
    title: "Policija įspėja dėl kišenvagių prie stoties",
    summary:
      "Vilniaus apskrities VPK: padaugėjo kišenvagysčių geležinkelio stoties prieigose – prašoma saugoti rankines ir telefonus minioje.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/",
    publishedAt: "2026-10-09T08:20:00+03:00",
    locations: ["stotis", "new-town"],
    category: "crime",
    sourceConfidence: 95,
    durationSec: 29,
    geo: [{ lat: 54.6708, lng: 25.2815, label: "Stoties prieigos" }],
  },
  {
    id: "pasilaiciai-scam",
    title: "Pašilaičiuose – įspėjimas dėl netikrų kurjerių",
    summary:
      "Gyventojai praneša apie sukčius, apsimetančius siuntų kurjeriais prie daugiabučių; policija rekomenduoja netikėti skubiais prašymais sumokėti.",
    sourceName: "15min",
    sourceUrl: "https://www.15min.lt/",
    publishedAt: "2026-10-07T11:10:00+03:00",
    locations: ["pasilaiciai", "laisves-pr", "northern-vilnius"],
    category: "crime",
    sourceConfidence: 90,
    durationSec: 31,
    geo: [{ lat: 54.7258, lng: 25.2165, label: "Pašilaičiai" }],
  },
  {
    id: "santariskes-research",
    title: "Santariškėse – naujas medicinos tyrimų centras",
    summary:
      "Pristatytas planas plėsti biomedicinos laboratorijas Santariškių klinikų miestelyje – daugiau vietos klinikiniams tyrimams ir studentų praktikoms.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/",
    publishedAt: "2026-10-02T09:40:00+03:00",
    locations: ["santariskes", "northern-vilnius"],
    category: "science",
    sourceConfidence: 95,
    durationSec: 36,
    geo: [{ lat: 54.7512, lng: 25.2795, label: "Santariškės" }],
  },
  {
    id: "neris-air-sensors",
    title: "Prie Neries – nauji oro kokybės jutikliai",
    summary:
      "Miestas diegia papildomus smulkiųjų kietųjų dalelių jutiklius palei Nerį; duomenys bus vieši realiuoju laiku miesto atvirųjų duomenų portale.",
    sourceName: "Vilniaus miestas",
    sourceUrl: "https://vilnius.lt/",
    publishedAt: "2026-10-06T15:15:00+03:00",
    locations: ["neris", "snipiskes", "vilnius-centre"],
    category: "science",
    sourceConfidence: 92,
    durationSec: 33,
    geo: [{ lat: 54.6938, lng: 25.2772, label: "Neries krantinė" }],
  },
];
