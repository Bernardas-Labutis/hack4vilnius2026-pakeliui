"use client";

import { useEffect, useRef, useState } from "react";
import type { ColleagueMapProps } from "@/components/colleague-map-types";
import {
  BASEMAP,
  listBasemapTiles,
  mosaicSize,
  projectToMosaic,
} from "@/data/map-basemap";

const MIN_SCALE = 0.35;
const MAX_SCALE = 3.2;

/** Default framing captured from the preferred jury view (1G corridor). */
const DEMO_VIEW = {
  centerX: 430.5,
  centerY: 650.7,
  mosaicWidth: 473,
  mosaicHeight: 356,
};

/**
 * Offline static Vilnius basemap (local OSM tiles) with pinch/scroll zoom + pan.
 * Pins and route use the same WGS84 → mosaic projection.
 */
export default function ColleagueMap({
  stage = "idle",
  pins = [],
  routeLine = [],
  routeLabel = "1G",
}: ColleagueMapProps) {
  const { width, height } = mosaicSize();
  const tiles = listBasemapTiles();
  const showPins = stage !== "idle";
  const showRoute = stage === "route" || stage === "filtered";

  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
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

  function applyDemoView() {
    const el = viewportRef.current;
    if (!el) return;
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(
        MIN_SCALE,
        Math.min(
          el.clientWidth / DEMO_VIEW.mosaicWidth,
          el.clientHeight / DEMO_VIEW.mosaicHeight,
        ),
      ),
    );
    setScale(nextScale);
    setOffset({
      x: el.clientWidth / 2 - DEMO_VIEW.centerX * nextScale,
      y: el.clientHeight / 2 - DEMO_VIEW.centerY * nextScale,
    });
  }

  useEffect(() => {
    // Apply once the viewport has layout; don't re-fit on later resizes
    // so manual pan/zoom is preserved.
    const id = window.requestAnimationFrame(() => applyDemoView());
    return () => window.cancelAnimationFrame(id);
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
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setScale((current) =>
      Math.min(MAX_SCALE, Math.max(MIN_SCALE, current * delta)),
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
    setOffset({
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
      pinchRef.current = { distance, scale };
      dragRef.current = null;
    }
  }

  function onTouchMove(event: React.TouchEvent) {
    if (event.touches.length === 2 && pinchRef.current) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const next =
        pinchRef.current.scale * (distance / pinchRef.current.distance);
      setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)));
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
    <div className="colleague-map">
      <div
        ref={viewportRef}
        className="colleague-map-viewport"
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
          className="colleague-map-world"
          style={{
            width,
            height,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <div className="colleague-map-tiles" style={{ width, height }}>
            {tiles.map((tile) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${tile.x}-${tile.y}`}
                alt=""
                className="colleague-map-tile"
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
            className="colleague-map-overlay"
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
                          ? "colleague-pin is-dimmed"
                          : active
                            ? "colleague-pin is-active"
                            : "colleague-pin"
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
                          className="colleague-pin-label"
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

      <div className="colleague-map-badge">
        {stage === "idle" && "Vilnius · offline"}
        {stage === "pins" && `Naujienos · ${pins.length}`}
        {stage === "route" && `Maršrutas ${routeLabel}`}
        {stage === "filtered" &&
          `Variklis · ${pins.filter((p) => p.active).length} atrinkta`}
        <span className="colleague-map-attrib">© Esri</span>
      </div>

      <div className="colleague-map-zoom">
        <button
          aria-label="Reset map view"
          onClick={applyDemoView}
          title="Numatytasis vaizdas"
          type="button"
        >
          ⌂
        </button>
        <button
          aria-label="Zoom out"
          onClick={() =>
            setScale((s) => Math.max(MIN_SCALE, Number((s * 0.85).toFixed(2))))
          }
          type="button"
        >
          −
        </button>
        <button
          aria-label="Zoom in"
          onClick={() =>
            setScale((s) => Math.min(MAX_SCALE, Number((s * 1.15).toFixed(2))))
          }
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
