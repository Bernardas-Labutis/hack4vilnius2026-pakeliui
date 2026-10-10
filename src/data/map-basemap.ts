/**
 * Offline OSM tile mosaic covering Vilnius urban area.
 * Zoom 12, Web Mercator. Served from public/maps/tiles — no network at runtime.
 */
export const BASEMAP = {
  z: 12,
  x0: 2334,
  x1: 2337,
  y0: 1299,
  y1: 1303,
  tileSize: 256,
  tilePath: "/maps/tiles",
} as const;

export function mosaicSize() {
  const width = (BASEMAP.x1 - BASEMAP.x0 + 1) * BASEMAP.tileSize;
  const height = (BASEMAP.y1 - BASEMAP.y0 + 1) * BASEMAP.tileSize;
  return { width, height };
}

/** WGS84 → pixel on the stitched mosaic (origin top-left of tile x0,y0). */
export function projectToMosaic(lat: number, lng: number) {
  const n = 2 ** BASEMAP.z;
  const worldX = ((lng + 180) / 360) * n * BASEMAP.tileSize;
  const rad = (lat * Math.PI) / 180;
  const worldY =
    ((1 -
      Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) /
      2) *
    n *
    BASEMAP.tileSize;

  return {
    x: worldX - BASEMAP.x0 * BASEMAP.tileSize,
    y: worldY - BASEMAP.y0 * BASEMAP.tileSize,
  };
}

export function listBasemapTiles() {
  const tiles: { x: number; y: number; src: string }[] = [];
  for (let x = BASEMAP.x0; x <= BASEMAP.x1; x++) {
    for (let y = BASEMAP.y0; y <= BASEMAP.y1; y++) {
      tiles.push({
        x,
        y,
        src: `${BASEMAP.tilePath}/${BASEMAP.z}-${x}-${y}.png`,
      });
    }
  }
  return tiles;
}
