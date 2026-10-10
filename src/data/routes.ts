export type PreferenceMode = "recent" | "balanced" | "evergreen";

export type RouteProfile = {
  id: string;
  number: string;
  from: string;
  to: string;
  label: string;
  description: string;
  tripMinutes: number;
  /** Neighbourhood / landmark tags used for geographic matching */
  corridor: string[];
  /**
   * Location tags in passenger ride order (from → to).
   * Used to sort the audio feed along the journey.
   */
  rideOrder: string[];
  /** Approximate WGS84 terminals used to orient the GTFS polyline */
  fromGeo: [number, number];
  toGeo: [number, number];
};

export const ROUTES: RouteProfile[] = [
  {
    id: "1g",
    number: "1G",
    from: "Santariškės",
    to: "Stotis",
    label: "Santariškės–Kalvarijų g.–Stotis",
    description:
      "Per Santariškes, Kalvarijų g., Šnipiškes ir Stotį.",
    tripMinutes: 22,
    corridor: [
      "snipiskes",
      "neris",
      "business-district",
      "kalvariju",
      "northern-vilnius",
      "stotis",
      "new-town",
      "santariskes",
    ],
    // Santariškės → Kalvarijų → Šnipiškės → centras → Stotis
    rideOrder: [
      "santariskes",
      "northern-vilnius",
      "kalvariju",
      "business-district",
      "snipiskes",
      "zaliasis-tiltas",
      "neris",
      "lukiskes",
      "vilnius-centre",
      "new-town",
      "stotis",
    ],
    fromGeo: [54.752, 25.28],
    toGeo: [54.6705, 25.284],
  },
  {
    id: "2g",
    number: "2G",
    from: "Santariškės",
    to: "Stotis",
    label: "Laisvės pr. koridorius",
    description:
      "Per Pašilaičius, Justiniškes, Šeškinę ir Karoliniškes Laisvės prospektu.",
    tripMinutes: 24,
    corridor: [
      "pasilaiciai",
      "justiniskes",
      "seskine",
      "karoliniskes",
      "laisves-pr",
      "santariskes",
      "stotis",
    ],
    // Santariškės → Pašilaičiai → Justiniškės → Šeškinė → Karoliniškės → Stotis
    rideOrder: [
      "santariskes",
      "pasilaiciai",
      "justiniskes",
      "seskine",
      "karoliniskes",
      "laisves-pr",
      "stotis",
      "new-town",
      "vilnius-centre",
    ],
    fromGeo: [54.752, 25.28],
    toGeo: [54.6705, 25.284],
  },
];

export const DURATION_OPTIONS = [3, 10, 20] as const;

export const PREFERENCE_OPTIONS: {
  id: PreferenceMode;
  label: string;
}[] = [
  { id: "recent", label: "Prioritetas naujienoms" },
  { id: "balanced", label: "Subalansuotas srautas" },
  { id: "evergreen", label: "Prioritetas amžinoms istorijoms" },
];
