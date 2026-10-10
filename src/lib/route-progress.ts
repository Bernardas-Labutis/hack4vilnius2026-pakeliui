import type { CandidateItem } from "@/data/demo-content";
import type { RouteProfile } from "@/data/routes";
import { ROUTE_POLYLINES } from "@/data/route-geometry";

/** Approximate metres per degree at Vilnius latitude (~54.7°). */
const METRES_PER_DEG_LAT = 111_320;
const METRES_PER_DEG_LNG = 64_600;

function toLocalMetres(lat: number, lng: number, originLat: number, originLng: number) {
  return {
    x: (lng - originLng) * METRES_PER_DEG_LNG,
    y: (lat - originLat) * METRES_PER_DEG_LAT,
  };
}

function dist2(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function terminalDistance(
  point: [number, number],
  terminal: [number, number],
): number {
  const p = toLocalMetres(point[0], point[1], terminal[0], terminal[1]);
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

/**
 * Orient a GTFS polyline so it runs from the route's `from` terminal
 * toward `to` (e.g. 2G: Santariškės → Stotis).
 */
export function orientPolylineForRoute(
  polyline: [number, number][],
  route: Pick<RouteProfile, "fromGeo" | "toGeo">,
): [number, number][] {
  if (polyline.length < 2) return polyline;
  const start = polyline[0];
  const end = polyline[polyline.length - 1];
  const forward =
    terminalDistance(start, route.fromGeo) +
    terminalDistance(end, route.toGeo);
  const reverse =
    terminalDistance(end, route.fromGeo) +
    terminalDistance(start, route.toGeo);
  return reverse < forward ? [...polyline].reverse() : polyline;
}

/**
 * Distance along a WGS84 [lat, lng] polyline from the start to the
 * nearest point on the line to (lat, lng).
 */
export function progressAlongPolyline(
  lat: number,
  lng: number,
  polyline: [number, number][],
): number {
  if (polyline.length === 0) return Number.POSITIVE_INFINITY;
  if (polyline.length === 1) {
    const [plat, plng] = polyline[0];
    const p = toLocalMetres(lat, lng, plat, plng);
    return Math.sqrt(p.x * p.x + p.y * p.y);
  }

  const [oLat, oLng] = polyline[0];
  const point = toLocalMetres(lat, lng, oLat, oLng);

  let bestDist2 = Number.POSITIVE_INFINITY;
  let bestAlong = 0;
  let travelled = 0;

  for (let i = 0; i < polyline.length - 1; i++) {
    const a = toLocalMetres(polyline[i][0], polyline[i][1], oLat, oLng);
    const b = toLocalMetres(polyline[i + 1][0], polyline[i + 1][1], oLat, oLng);
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const abLen2 = abx * abx + aby * aby;
    const segLen = Math.sqrt(abLen2);

    let t = 0;
    if (abLen2 > 0) {
      t = ((point.x - a.x) * abx + (point.y - a.y) * aby) / abLen2;
      t = Math.max(0, Math.min(1, t));
    }

    const cx = a.x + t * abx;
    const cy = a.y + t * aby;
    const d2 = dist2(point.x, point.y, cx, cy);

    if (d2 < bestDist2) {
      bestDist2 = d2;
      bestAlong = travelled + t * segLen;
    }

    travelled += segLen;
  }

  return bestAlong;
}

/** Earliest ride-order index among the item's location tags. */
export function rideOrderIndex(item: CandidateItem, rideOrder: string[]): number {
  let best = Number.POSITIVE_INFINITY;
  for (const loc of item.locations) {
    const index = rideOrder.indexOf(loc);
    if (index >= 0 && index < best) best = index;
  }
  return best;
}

/**
 * Sort key for playback along from → to.
 * Prefer distance on the oriented GTFS polyline when a pin exists; otherwise
 * fall back to district rideOrder tags.
 */
export function storyProgressAlongRoute(
  item: CandidateItem,
  route: RouteProfile,
): number {
  const raw = ROUTE_POLYLINES[route.id] ?? [];
  const polyline = orientPolylineForRoute(raw, route);
  const geo = item.geo?.[0];
  if (geo && polyline.length > 0) {
    return progressAlongPolyline(geo.lat, geo.lng, polyline);
  }
  const district = rideOrderIndex(item, route.rideOrder);
  return Number.isFinite(district) ? district * 1_000 : Number.POSITIVE_INFINITY;
}
