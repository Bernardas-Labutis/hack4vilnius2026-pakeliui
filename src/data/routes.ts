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
};

export const ROUTES: RouteProfile[] = [
  {
    id: "1g",
    number: "1G",
    from: "Stotis",
    to: "Santariškės",
    label: "Stotis–Kalvarijų g.–Santariškės",
    description:
      "Eina per Stotį, Kalvarijų g., Šnipiškes ir Santariškes.",
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
  },
  {
    id: "2g",
    number: "2G",
    from: "Santariškės",
    to: "Stotis",
    label: "Laisvės pr. koridorius",
    description:
      "Eina per Pašilaičius, Justiniškes, Šeškinę ir Karoliniškes Laisvės prospektu.",
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
