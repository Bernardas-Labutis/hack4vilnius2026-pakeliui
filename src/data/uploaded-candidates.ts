import type { CandidateItem } from "./demo-content";

/**
 * Candidates pasted via /lab/content.
 * Replaced when you click Įkelti on the content lab page.
 */
export const UPLOADED_CANDIDATES: CandidateItem[] = [
  {
    id: "7c9a2e41-6b83-4fd2-9c15-8e2b7a4d1f60",
    title: "Vilniaus senojo teatro scenoje – tarptautinis „Vilnius Jazz“ festivalis",
    summary:
      "2026 m. spalio 14–19 d. Vilniaus senajame teatre vyks 39-asis tarptautinis šiuolaikinio džiazo ir improvizacinės muzikos festivalis „Vilnius Jazz“. Programoje numatyti Lietuvos ir užsienio muzikantų koncertai, o nuo spalio 14 d. teatre bus eksponuojama Sigito Kondrato fotografijų paroda „Vizualinės improvizacijos“.",
    fullText:
      "Vilniaus senasis teatras taps viena pagrindinių 39-ojo tarptautinio šiuolaikinio džiazo ir improvizacinės muzikos festivalio „Vilnius Jazz“ erdvių. 2026 m. spalio 14–19 d. čia vyks koncertai, kuriuose pasirodys Lietuvos ir užsienio atlikėjai. Festivalio programą papildys Sigito Kondrato fotografijų paroda „Vizualinės improvizacijos“, atskleidžianti, kaip fotografijos priemonėmis galima perteikti muziką. Prie fotografijų numatyti QR kodai, kuriuos nuskenavę lankytojai galės išgirsti su vaizdais susijusius garsus. Spalio 12 d. festivalio programos dokumentinio kino seansas numatytas „Skalvijos“ kino teatre. Renginiai sujungs šiuolaikinį džiazą, kiną ir vizualųjį meną Vilniaus kultūrinėse erdvėse.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/kultura/12/3075146/vilnius-jazz-festivalio-dialogai-ir-kino-saleje-paskaitose-parodoje",
    publishedAt: "2026-10-07T12:45:00+03:00",
    locations: ["vilnius", "vilniaus-senasis-teatras", "skalvijos-kinoteatras"],
    category: "culture",
    sourceConfidence: 100,
    durationSec: 180,
    geo: [
      {
        lat: 54.6786,
        lng: 25.2818,
        label: "Vilniaus senasis teatras"
      },
      {
        lat: 54.6817,
        lng: 25.2758,
        label: "Skalvijos kino centras"
      }
    ]
  }
];
