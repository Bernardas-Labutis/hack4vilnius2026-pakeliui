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
    id: "old-town",
    number: "2G",
    from: "Santariškės",
    to: "Stotis",
    label: "Senamiestis ir kultūra",
    description: "Eina palei Nerį, Lukiškes ir Senamiesčio kultūros koridorių.",
    tripMinutes: 24,
    corridor: [
      "neris",
      "zaliasis-tiltas",
      "lukiskes",
      "old-town",
      "cathedral",
      "gediminas",
      "stotis",
      "vilnius-centre",
    ],
  },
  {
    id: "modern",
    number: "1G",
    from: "Stotis",
    to: "Santariškės",
    label: "1G · Stotis–Kalvarijų g.–Santariškės",
    description:
      "Tikras JUDU 1G koridorius: Stotis, Kalvarijų g., Šnipiškės, Santariškės.",
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
