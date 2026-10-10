"use client";

import { useEffect, useRef, useState } from "react";
import type { RouteMapProps } from "@/components/route-map-types";
import {
  BASEMAP,
  listBasemapTiles,
  mosaicSize,
  projectToMosaic,
} from "@/data/map-basemap";

const MAX_SCALE = 3.2;

/** Default framing captured from the preferred jury view (1G corridor). */
const DEMO_VIEW = {
  centerX: 430.5,
  centerY: 650.7,
  mosaicWidth: 473,
  mosaicHeight: 356,
};

function coverMinScale(vw: number, vh: number, mw: number, mh: number) {
  if (vw <= 0 || vh <= 0) return 0.55;
  return Math.max(vw / mw, vh / mh);
}

function clampOffset(
  offset: { x: number; y: number },
  scale: number,
  vw: number,
  vh: number,
  mw: number,
  mh: number,
) {
  const sw = mw * scale;
  const sh = mh * scale;

  let minX: number;
  let maxX: number;
  let minY: number;
  let maxY: number;

  if (sw <= vw) {
    minX = maxX = (vw - sw) / 2;
  } else {
    minX = vw - sw;
    maxX = 0;
  }

  if (sh <= vh) {
    minY = maxY = (vh - sh) / 2;
  } else {
    minY = vh - sh;
    maxY = 0;
  }

  return {
    x: Math.min(maxX, Math.max(minX, offset.x)),
    y: Math.min(maxY, Math.max(minY, offset.y)),
  };
}

/**
 * Offline static Vilnius basemap (local tiles) with pinch/scroll zoom + pan.
 * Zoom/pan are clamped so the mosaic always covers the viewport (no grey gaps).
 */
export default function RouteMap({
  stage = "idle",
  pins = [],
  routeLine = [],
  routeLabel = "1G",
}: RouteMapProps) {
  const { width, height } = mosaicSize();
  const tiles = listBasemapTiles();
  const showPins = stage !== "idle";
  const showRoute = stage === "route" || stage === "filtered";

  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const viewRef = useRef({ scale: 0.55, offset: { x: 0, y: 0 } });
  const fittedRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const pinchRef = useRef<{
    distance: number;
    scale: number;
  } | null>(null);

  useEffect(() => {
    viewRef.current = { scale, offset };
  }, [scale, offset]);

  function viewportSize() {
    const el = viewportRef.current;
    return {
      vw: el?.clientWidth ?? 0,
      vh: el?.clientHeight ?? 0,
    };
  }

  function commitView(nextScale: number, nextOffset: { x: number; y: number }) {
    const { vw, vh } = viewportSize();
    if (vw <= 0 || vh <= 0) return viewRef.current;
    const clampedScale = Math.min(
      MAX_SCALE,
      Math.max(coverMinScale(vw, vh, width, height), nextScale),
    );
    const clampedOffset = clampOffset(
      nextOffset,
      clampedScale,
      vw,
      vh,
      width,
      height,
    );
    setScale(clampedScale);
    setOffset(clampedOffset);
    return { scale: clampedScale, offset: clampedOffset };
  }

  function zoomToward(
    nextScaleRaw: number,
    focalX: number,
    focalY: number,
  ) {
    const { scale: currentScale, offset: currentOffset } = viewRef.current;
    const { vw, vh } = viewportSize();
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(coverMinScale(vw, vh, width, height), nextScaleRaw),
    );
    const worldX = (focalX - currentOffset.x) / currentScale;
    const worldY = (focalY - currentOffset.y) / currentScale;
    commitView(nextScale, {
      x: focalX - worldX * nextScale,
      y: focalY - worldY * nextScale,
    });
  }

  function applyDemoView() {
    const el = viewportRef.current;
    if (!el) return false;
    const { vw, vh } = viewportSize();
    if (vw <= 0 || vh <= 0) return false;
    const floor = coverMinScale(vw, vh, width, height);
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(
        floor,
        Math.min(vw / DEMO_VIEW.mosaicWidth, vh / DEMO_VIEW.mosaicHeight),
      ),
    );
    commitView(nextScale, {
      x: vw / 2 - DEMO_VIEW.centerX * nextScale,
      y: vh / 2 - DEMO_VIEW.centerY * nextScale,
    });
    fittedRef.current = true;
    setReady(true);
    return true;
  }

  useEffect(() => {
    // Home framing on first real layout (hard refresh / mount). Later
    // resizes only reclamp so manual pan/zoom is preserved.
    const el = viewportRef.current;
    if (!el) return;

    function syncView() {
      if (!fittedRef.current) {
        applyDemoView();
        return;
      }
      const { scale: s, offset: o } = viewRef.current;
      commitView(s, o);
    }

    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(syncView);
    });
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncView)
        : null;
    observer?.observe(el);
    return () => {
      window.cancelAnimationFrame(id);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only fit + resize clamp
  }, []);

  const pathD =
    routeLine.length > 1
      ? routeLine
          .map((point, index) => {
            const { x, y } = projectToMosaic(point[0], point[1]);
            return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(" ")
      : "";

  function onWheel(event: React.WheelEvent) {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    zoomToward(
      viewRef.current.scale * delta,
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  }

  function onPointerDown(event: React.PointerEvent) {
    if (event.pointerType === "touch" && event.isPrimary === false) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: offset.x,
      origY: offset.y,
    };
  }

  function onPointerMove(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    commitView(viewRef.current.scale, {
      x: drag.origX + (event.clientX - drag.startX),
      y: drag.origY + (event.clientY - drag.startY),
    });
  }

  function onPointerUp(event: React.PointerEvent) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function onTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { distance, scale: viewRef.current.scale };
      dragRef.current = null;
    }
  }

  function onTouchMove(event: React.TouchEvent) {
    if (event.touches.length === 2 && pinchRef.current) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const focalX = (a.clientX + b.clientX) / 2 - rect.left;
      const focalY = (a.clientY + b.clientY) / 2 - rect.top;
      const next =
        pinchRef.current.scale * (distance / pinchRef.current.distance);
      zoomToward(next, focalX, focalY);
    }
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (event.touches.length < 2) pinchRef.current = null;
  }

  // Scale stroke with inverse zoom so the line stays readable when zoomed out
  const routeStroke = Math.max(4, 8 / scale);
  const routeHalo = routeStroke + 4;
  const pinRadius = Math.max(5, 8 / Math.sqrt(scale));

  return (
    <div className="route-map">
      <div
        ref={viewportRef}
        className="route-map-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        <div
          className="route-map-world"
          style={{
            width,
            height,
            opacity: ready ? 1 : 0,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <div className="route-map-tiles" style={{ width, height }}>
            {tiles.map((tile) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${tile.x}-${tile.y}`}
                alt=""
                className="route-map-tile"
                draggable={false}
                height={BASEMAP.tileSize}
                src={tile.src}
                style={{
                  left: (tile.x - BASEMAP.x0) * BASEMAP.tileSize,
                  top: (tile.y - BASEMAP.y0) * BASEMAP.tileSize,
                }}
                width={BASEMAP.tileSize}
              />
            ))}
          </div>

          <svg
            aria-hidden="true"
            className="route-map-overlay"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            width={width}
          >
            {showRoute && pathD ? (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={routeHalo}
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke="#1a6b4d"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={routeStroke}
                />
              </>
            ) : null}

            {showPins
              ? pins.map((pin, index) => {
                  const { x, y } = projectToMosaic(pin.lat, pin.lng);
                  const dimmed = Boolean(pin.dimmed);
                  const active = Boolean(pin.active);
                  return (
                    <g
                      key={pin.id}
                      className={
                        dimmed
                          ? "route-map-pin is-dimmed"
                          : active
                            ? "route-map-pin is-active"
                            : "route-map-pin"
                      }
                      style={{
                        animationDelay: `${Math.min(index, 12) * 50}ms`,
                      }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        fill={active ? "#c8f25a" : "#1a6b4d"}
                        r={active ? pinRadius + 2 : pinRadius}
                        stroke="#fff"
                        strokeWidth="2.5"
                      />
                      {!dimmed ? (
                        <text
                          className="route-map-pin-label"
                          x={x + 11}
                          y={y + 4}
                        >
                          {pin.label.length > 22
                            ? `${pin.label.slice(0, 20)}…`
                            : pin.label}
                        </text>
                      ) : null}
                    </g>
                  );
                })
              : null}
          </svg>
        </div>
      </div>

      <div className="route-map-badge">
        {stage === "idle" && "Vilnius · offline"}
        {stage === "pins" && `Naujienos · ${pins.length}`}
        {stage === "route" && `Maršrutas ${routeLabel}`}
        {stage === "filtered" &&
          `Variklis · ${pins.filter((p) => p.active).length} atrinkta`}
        <span className="route-map-attrib">© Esri</span>
      </div>

      <div className="route-map-zoom">
        <button
          aria-label="Reset map view"
          onClick={() => {
            applyDemoView();
          }}
          title="Numatytasis vaizdas"
          type="button"
        >
          ⌂
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => {
            const { vw, vh } = viewportSize();
            zoomToward(viewRef.current.scale * 0.85, vw / 2, vh / 2);
          }}
          type="button"
        >
          −
        </button>
        <button
          aria-label="Zoom in"
          onClick={() => {
            const { vw, vh } = viewportSize();
            zoomToward(viewRef.current.scale * 1.15, vw / 2, vh / 2);
          }}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
