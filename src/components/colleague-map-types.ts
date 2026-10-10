export type MapStage = "idle" | "pins" | "route" | "filtered";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** Bright when selected by the feed engine */
  active?: boolean;
  /** Faded when outside corridor / not selected */
  dimmed?: boolean;
};

export type ColleagueMapProps = {
  stage?: MapStage;
  pins?: MapPin[];
  /** WGS84 [lat, lng] polyline for the prepared route */
  routeLine?: [number, number][];
  routeLabel?: string;
};
