"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MapStage } from "@/components/route-map-types";
import { mergeCandidates } from "@/data/all-candidates";
import { CATEGORY_LABELS, type CandidateItem } from "@/data/demo-content";
import { ROUTE_POLYLINES } from "@/data/route-geometry";
import {
  DURATION_OPTIONS,
  PREFERENCE_OPTIONS,
  ROUTES,
  type PreferenceMode,
} from "@/data/routes";
import {
  buildFeed,
  formatDuration,
  rejectionLabel,
  type ScoredCandidate,
} from "@/lib/feed-engine";
import {
  groqErrorMessage,
  parseGeneratedCandidates,
  requestGroqStories,
} from "@/lib/groq";
import {
  fetchNarrationAudioUrl,
  narrationText,
  ttsErrorMessage,
} from "@/lib/tts";

const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Žemėlapis…</div>,
});

const MAP_STAGES: MapStage[] = ["idle", "pins", "route", "filtered"];

function stageLabel(stage: MapStage, routeNumber: string) {
  switch (stage) {
    case "idle":
      return "Žemėlapis";
    case "pins":
      return "Naujienų taškai";
    case "route":
      return `${routeNumber} maršrutas`;
    case "filtered":
      return "Srauto atranka";
  }
}

function Icon({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-row">
      <div className="score-meta">
        <span>{label}</span>
        <strong>{value}/100</strong>
      </div>
      <div className="score-track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CandidateRow({
  entry,
  expanded,
  onToggle,
}: {
  entry: ScoredCandidate;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`candidate ${entry.selected ? "is-selected" : "is-rejected"}`}>
      <button className="candidate-header" onClick={onToggle} type="button">
        <div>
          {entry.selected ? (
            <span className="candidate-badge">#{entry.order} atrinkta</span>
          ) : (
            <span className="candidate-badge rejected">
              {entry.rejectionReason
                ? rejectionLabel(entry.rejectionReason)
                : "Atmesta"}
            </span>
          )}
          <h3>{entry.item.title}</h3>
          <p>
            {entry.item.sourceName}
            {entry.item.curated ? " · kuruota" : ""} ·{" "}
            {CATEGORY_LABELS[entry.item.category]} ·{" "}
            {formatDuration(entry.item.durationSec)}
          </p>
        </div>
        <strong className="candidate-total">{entry.scores.total}</strong>
      </button>
      {expanded ? (
        <div className="candidate-body">
          <p className="candidate-summary">{entry.item.summary}</p>
          <ScoreBar
            label="Maršruto aktualumas"
            value={entry.scores.routeRelevance}
          />
          <ScoreBar label="Šviežumas" value={entry.scores.freshness} />
          <ScoreBar
            label="Šaltinio patikimumas"
            value={entry.scores.sourceConfidence}
          />
          <ScoreBar
            label="Prioriteto atitikimas"
            value={entry.scores.preferenceFit}
          />
          <ScoreBar label="Įvairovė" value={entry.scores.diversity} />
          <ScoreBar
            label="Įvairovė × prioritetas"
            value={entry.scores.diversityPreference}
          />
          <p className="candidate-source">
            Paskelbta {entry.item.publishedAt.slice(0, 10)}
            {" · "}
            <a href={entry.item.sourceUrl} target="_blank" rel="noreferrer">
              {entry.item.sourceName}
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [preference, setPreference] = useState<PreferenceMode>("balanced");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [inspectOpen, setInspectOpen] = useState(true);
  /** undefined = follow first selected; null = collapsed; string = that row */
  const [expandedId, setExpandedId] = useState<string | null | undefined>(
    undefined,
  );
  const [showRejected, setShowRejected] = useState(false);
  const [mapStage, setMapStage] = useState<MapStage>("idle");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<CandidateItem[]>([]);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const swipeRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    active: boolean;
  } | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [audioDurationSec, setAudioDurationSec] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const route = ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
  const candidates = useMemo(
    () => mergeCandidates(generated),
    [generated],
  );

  const feed = useMemo(
    () =>
      buildFeed({
        route,
        durationMinutes,
        preference,
        candidates,
      }),
    [route, durationMinutes, preference, candidates],
  );

  const selectedIds = useMemo(
    () => new Set(feed.selected.map((entry) => entry.item.id)),
    [feed.selected],
  );

  const stories = feed.selected;
  const safeIndex = Math.min(storyIndex, Math.max(stories.length - 1, 0));
  const story = stories[safeIndex] ?? null;
  const openId =
    expandedId === undefined
      ? (feed.selected[0]?.item.id ?? null)
      : expandedId;
  const focusPinId = story?.item.id ?? openId;

  const mapPins = useMemo(
    () =>
      candidates
        .filter((item) => item.geo?.[0])
        .map((item) => {
          const point = item.geo![0];
          const selected = selectedIds.has(item.id);
          const focused =
            playing && Boolean(focusPinId && item.id === focusPinId);
          return {
            id: item.id,
            lat: point.lat,
            lng: point.lng,
            label: point.label ?? item.title,
            active: mapStage === "filtered" && selected,
            dimmed: mapStage === "filtered" && !selected && !focused,
            focused,
          };
        }),
    [candidates, focusPinId, mapStage, playing, selectedIds],
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const audio: HTMLAudioElement = el;

    function onTimeUpdate() {
      const duration = audio.duration;
      if (!duration || !Number.isFinite(duration) || duration <= 0) return;
      setAudioDurationSec(duration);
      setProgress((audio.currentTime / duration) * 100);
    }

    function onEnded() {
      if (safeIndex < stories.length - 1) {
        setStoryIndex(safeIndex + 1);
        setProgress(0);
        setAudioDurationSec(0);
        return;
      }
      setPlaying(false);
      setProgress(100);
    }

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onTimeUpdate);
    audio.addEventListener("durationchange", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onTimeUpdate);
      audio.removeEventListener("durationchange", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [safeIndex, stories.length]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const audio: HTMLAudioElement = el;

    const item = story?.item;
    if (!playing || !item) {
      audio.pause();
      return;
    }

    let cancelled = false;

    async function syncPlayback() {
      setTtsLoading(true);
      setTtsError(null);
      try {
        const url = await fetchNarrationAudioUrl(narrationText(item));
        if (cancelled) return;

        const absoluteUrl = new URL(url, window.location.href).href;
        if (audio.src !== absoluteUrl) {
          audio.src = url;
          audio.load();
          setProgress(0);
          setAudioDurationSec(0);
        }
        await audio.play();
      } catch (caught) {
        if (cancelled) return;
        setPlaying(false);
        setTtsError(ttsErrorMessage(caught));
      } finally {
        if (!cancelled) setTtsLoading(false);
      }
    }

    void syncPlayback();
    return () => {
      cancelled = true;
    };
  }, [playing, story?.item]);

  function resetPlayback() {
    audioRef.current?.pause();
    setStoryIndex(0);
    setProgress(0);
    setPlaying(false);
    setTtsError(null);
    setAudioDurationSec(0);
    setExpandedId(undefined);
  }

  function selectRoute(id: string) {
    setRouteId(id);
    resetPlayback();
  }

  function selectDuration(minutes: number) {
    setDurationMinutes(minutes);
    resetPlayback();
  }

  function selectPreference(mode: PreferenceMode) {
    setPreference(mode);
    resetPlayback();
  }

  function prevStory() {
    if (stories.length === 0) return;
    audioRef.current?.pause();
    setStoryIndex(
      (current) => (current - 1 + stories.length) % stories.length,
    );
    setProgress(0);
    setAudioDurationSec(0);
    setTtsError(null);
    setPlaying(true);
  }

  function nextStory() {
    if (stories.length === 0) return;
    audioRef.current?.pause();
    setStoryIndex((current) => (current + 1) % stories.length);
    setProgress(0);
    setAudioDurationSec(0);
    setTtsError(null);
    setPlaying(true);
  }

  function isSwipeIgnoredTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) return true;
    return Boolean(target.closest("button, a, input, textarea, select"));
  }

  function onStoryPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0 || stories.length < 2) return;
    if (isSwipeIgnoredTarget(event.target)) return;
    swipeRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      active: false,
    };
    setSwipeOffset(0);
  }

  function onStoryPointerMove(event: React.PointerEvent<HTMLElement>) {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (!swipe.active) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        swipeRef.current = null;
        setSwipeOffset(0);
        return;
      }
      swipe.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setSwipeOffset(Math.max(-88, Math.min(88, dx * 0.45)));
  }

  function finishStorySwipe(event: React.PointerEvent<HTMLElement>) {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    swipeRef.current = null;
    setSwipeOffset(0);
    if (!swipe.active || Math.abs(dx) < 56) return;
    if (dx < 0) nextStory();
    else prevStory();
  }

  function togglePlayback() {
    if (!story || ttsLoading) return;
    if (progress >= 100) {
      setProgress(0);
      setPlaying(true);
      return;
    }
    setPlaying((current) => !current);
  }

  function seekPlayback(event: React.MouseEvent<HTMLButtonElement>) {
    const audio = audioRef.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - bounds.left) / bounds.width),
    );
    setProgress(ratio * 100);
    if (audio && audio.duration && Number.isFinite(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
    }
  }

  function setMapStageStep(next: MapStage) {
    setMapStage(next);
    if (next === "filtered") {
      resetPlayback();
    }
  }

  async function generateRouteProfile() {
    if (generating) return;

    setGenerateError(null);
    setGenerating(true);
    try {
      const articles = candidates
        .filter((item) => item.sourceUrl.trim())
        .map((item) => ({
          title: item.title,
          sourceUrl: item.sourceUrl.trim(),
          sourceName: item.sourceName,
        }));
      const json = await requestGroqStories(articles);
      console.log(json);
      const incoming = parseGeneratedCandidates(json);
      const nextGenerated = [...generated];
      for (const item of incoming) {
        const index = nextGenerated.findIndex((entry) => entry.id === item.id);
        if (index >= 0) nextGenerated[index] = item;
        else nextGenerated.push(item);
      }
      setGenerated(nextGenerated);

      const nextFeed = buildFeed({
        route,
        durationMinutes,
        preference,
        candidates: mergeCandidates(nextGenerated),
      });
      const added = incoming[0];
      const selectedIndex = nextFeed.selected.findIndex(
        (entry) => entry.item.id === added.id,
      );
      setInspectOpen(true);
      setExpandedId(added.id);
      setProgress(0);
      setPlaying(false);
      if (selectedIndex >= 0) {
        setShowRejected(false);
        setStoryIndex(selectedIndex);
      } else {
        setShowRejected(true);
      }
    } catch (caught) {
      console.log(caught);
      setGenerateError(groqErrorMessage(caught));
    } finally {
      setGenerating(false);
    }
  }

  function advanceMapStage() {
    if (mapStage === "filtered") {
      setSheetOpen(true);
      setStoryIndex(0);
      setProgress(0);
      setAudioDurationSec(0);
      setTtsError(null);
      setExpandedId(undefined);
      setPlaying(true);
      return;
    }
    const index = MAP_STAGES.indexOf(mapStage);
    const next = MAP_STAGES[Math.min(index + 1, MAP_STAGES.length - 1)];
    setMapStageStep(next);
  }

  const totalSec = audioDurationSec > 0 ? audioDurationSec : null;
  const elapsedSec =
    totalSec != null ? Math.floor((progress / 100) * totalSec) : 0;

  return (
    <main className="demo-layout">
      <section className={`phone-shell ${sheetOpen ? "sheet-expanded" : ""}`}>
        {/* Keep mounted so playback + progress listeners work before the sheet opens. */}
        <audio ref={audioRef} preload="none" />
        <header className="topbar">
          <a className="brand" href="#" aria-label="Pakeliui pradžia">
            <span className="brand-mark">
              <Icon size={22}>
                <path
                  d="M5 18c2.2-5.4 5.3-9.3 10.7-12M8 18c1.6-3.4 3.8-6 7.4-8.2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle cx="16.8" cy="5.2" fill="currentColor" r="2" />
              </Icon>
            </span>
            Pakeliui
          </a>
          <button className="language-button" type="button">
            LT
            <Icon size={14}>
              <path
                d="m7 9 5 5 5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </Icon>
          </button>
        </header>

        <div className="route-summary">
          {mapStage === "route" || mapStage === "filtered" ? (
            <div className="route-number">{route.number}</div>
          ) : (
            <div className="route-number is-placeholder" aria-hidden="true">
              ··
            </div>
          )}
          <div>
            <p className="route-label">Jūsų kelionė</p>
            <h1>
              {mapStage === "route" || mapStage === "filtered"
                ? `${route.from} → ${route.to}`
                : "Vilnius"}
            </h1>
          </div>
          <div className="trip-time">
            <Icon size={18}>
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 8v4l2.5 1.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </Icon>
            {durationMinutes} min. srautas
          </div>
        </div>

        <div className="phone-map-area" aria-label="Maršruto žemėlapis">
          <RouteMap
            pins={mapPins}
            routeLabel={route.number}
            routeLine={ROUTE_POLYLINES[route.id] ?? ROUTE_POLYLINES["1g"]}
            stage={mapStage}
          />
        </div>

        <div className={`phone-sheet ${sheetOpen ? "is-open" : "is-collapsed"}`}>
          <button
            className="sheet-handle"
            onClick={() => setSheetOpen((open) => !open)}
            type="button"
          >
            <span className="sheet-handle-bar" />
            {sheetOpen ? "Suskleisti" : "Išskleisti"}
          </button>

          <div className="map-stage-bar">
            <div className="map-stage-pills">
              {MAP_STAGES.map((stage) => (
                <button
                  key={stage}
                  className={
                    mapStage === stage ? "stage-pill active" : "stage-pill"
                  }
                  onClick={() => setMapStageStep(stage)}
                  type="button"
                >
                  {stageLabel(stage, route.number)}
                </button>
              ))}
            </div>
            <button
              className="stage-next"
              onClick={advanceMapStage}
              type="button"
            >
              Toliau
            </button>
          </div>

          {sheetOpen ? (
            <div className="content">
              <div className="now-playing">
                <div>
                  <span className="live-dot" />
                  {mapStage === "filtered"
                    ? "Atrinktas srautas"
                    : "Sugeneruotas srautas"}
                </div>
                <span>
                  {stories.length === 0
                    ? "0 istorijų"
                    : `${safeIndex + 1} iš ${stories.length}`}
                </span>
              </div>

              {story ? (
                <article
                  className={`story-card${swipeOffset !== 0 ? " is-swiping" : ""}`}
                  onPointerCancel={finishStorySwipe}
                  onPointerDown={onStoryPointerDown}
                  onPointerMove={onStoryPointerMove}
                  onPointerUp={finishStorySwipe}
                  style={{
                    transform:
                      swipeOffset !== 0
                        ? `translateX(${swipeOffset}px)`
                        : undefined,
                  }}
                >
                  <p className="eyebrow">
                    {CATEGORY_LABELS[story.item.category]} · balas{" "}
                    {story.scores.total}
                  </p>
                  <h2>{story.item.title}</h2>
                  <p className="story-copy">{story.item.summary}</p>
                  <p className="story-meta">
                    Paskelbta {story.item.publishedAt.slice(0, 10)}
                    {" · "}
                    <a
                      href={story.item.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {story.item.sourceName}
                    </a>
                  </p>

                  <div className="player">
                    <button
                      aria-label="Ankstesnė istorija"
                      className="skip-button"
                      onClick={prevStory}
                      type="button"
                    >
                      <Icon size={22}>
                        <path
                          d="M7 7v10M17 7l-7 5 7 5V7Z"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </Icon>
                    </button>
                    <button
                      aria-label={
                        ttsLoading
                          ? "Kraunamas garsas"
                          : playing
                            ? "Pristabdyti garsą"
                            : "Groti garsą"
                      }
                      className="play-button"
                      disabled={ttsLoading}
                      onClick={togglePlayback}
                      type="button"
                    >
                      {ttsLoading ? (
                        <Icon size={24}>
                          <circle
                            cx="12"
                            cy="12"
                            r="8"
                            stroke="currentColor"
                            strokeDasharray="36 20"
                            strokeWidth="2.5"
                          />
                        </Icon>
                      ) : playing ? (
                        <Icon size={24}>
                          <path
                            d="M9 7v10M15 7v10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                          />
                        </Icon>
                      ) : (
                        <Icon size={24}>
                          <path d="m9 7 9 5-9 5V7Z" fill="currentColor" />
                        </Icon>
                      )}
                    </button>
                    <div className="progress-wrap">
                      <button
                        aria-label="Peršokti garsą"
                        className="progress-track"
                        onClick={seekPlayback}
                        type="button"
                      >
                        <span style={{ width: `${progress}%` }} />
                      </button>
                      <div className="time-row">
                        <span>
                          {totalSec != null ? formatDuration(elapsedSec) : "0:00"}
                        </span>
                        <span>
                          {totalSec != null ? formatDuration(totalSec) : "-"}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-label="Kita istorija"
                      className="skip-button"
                      onClick={nextStory}
                      type="button"
                    >
                      <Icon size={22}>
                        <path
                          d="m7 7 7 5-7 5V7ZM17 7v10"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </Icon>
                    </button>
                  </div>
                  <p className="demo-audio-note">
                    {ttsError
                      ? ttsError
                      : ttsLoading
                        ? "Generuojamas garsas…"
                        : story.item.fullText?.trim()
                          ? "Groja pilną straipsnio tekstą"
                          : "Groja santrauką — pilno teksto nėra"}
                  </p>
                </article>
              ) : (
                <article className="story-card">
                  <h2>Šiam biudžetui istorijų nerasta</h2>
                  <p className="story-copy">
                    Pabandykite ilgesnę kelionės trukmę arba kitą prioritetą.
                  </p>
                </article>
              )}
            </div>
          ) : (
            <p className="sheet-collapsed-hint">
              {stageLabel(mapStage, route.number)}
              {story ? ` · ${story.item.title}` : ""}
            </p>
          )}
        </div>
      </section>

      <aside className="engine-panel">
        <div className="engine-intro">
          <p className="engine-kicker">Pakeliui srauto atranka</p>
          <h2>Kaip sudarėme jūsų srautą</h2>
          <p>
            Vienas bendras turinio rinkinys. Pakeiskite maršrutą, trukmę ar
            prioritetą — reitingavimas iš naujo sudaro grojaraštį ir paaiškina
            kiekvieną sprendimą.
          </p>
        </div>

        <div className="controls">
          <div className="step-block">
            <button
              className="step-button"
              disabled={generating}
              onClick={generateRouteProfile}
              type="button"
            >
              Pridėti naujieną
            </button>
            {generateError ? (
              <p className="step-error" role="alert">
                {generateError}
              </p>
            ) : null}
          </div>
          <fieldset>
            <legend>1. Maršruto profilis</legend>
            <div className="choice-grid">
              {ROUTES.map((option) => (
                <button
                  key={option.id}
                  className={routeId === option.id ? "choice active" : "choice"}
                  onClick={() => selectRoute(option.id)}
                  type="button"
                >
                  <strong>
                    {option.number} · {option.label}
                  </strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>2. Kelionės trukmė</legend>
            <div className="pill-row">
              {DURATION_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  className={
                    durationMinutes === minutes ? "pill active" : "pill"
                  }
                  onClick={() => selectDuration(minutes)}
                  type="button"
                >
                  {minutes} min.
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>3. Turinio prioritetas</legend>
            <div className="pill-row wrap">
              {PREFERENCE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={
                    preference === option.id ? "pill active" : "pill"
                  }
                  onClick={() => selectPreference(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="stat-grid">
          <div>
            <span>Kandidatai</span>
            <strong>{feed.candidatesFound}</strong>
          </div>
          <div>
            <span>Atrinkta</span>
            <strong>{feed.storiesSelected}</strong>
          </div>
          <div>
            <span>Atmesta</span>
            <strong>{feed.filteredOut}</strong>
          </div>
          <div>
            <span>Apytiksl. garsas</span>
            <strong>{formatDuration(feed.estimatedAudioSec)}</strong>
          </div>
        </div>

        <button
          className="inspect-toggle"
          onClick={() => setInspectOpen((open) => !open)}
          type="button"
        >
          {inspectOpen ? "Slėpti analizę" : "Rodyti analizę"}
        </button>

        {inspectOpen ? (
          <div className="inspection">
            <div className="inspection-tabs">
              <button
                className={!showRejected ? "tab active" : "tab"}
                onClick={() => setShowRejected(false)}
                type="button"
              >
                Atrinkta ({feed.storiesSelected})
              </button>
              <button
                className={showRejected ? "tab active" : "tab"}
                onClick={() => setShowRejected(true)}
                type="button"
              >
                Atmesta ({feed.filteredOut})
              </button>
            </div>

            <div className="candidate-list">
              {(showRejected ? feed.rejected : feed.selected).map((entry) => (
                <CandidateRow
                  key={entry.item.id}
                  entry={entry}
                  expanded={openId === entry.item.id}
                  onToggle={() =>
                    setExpandedId((current) =>
                      current === entry.item.id ? null : entry.item.id,
                    )
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        <p className="engine-footnote">
          Balai apskaičiuojami deterministiškai: maršruto aktualumas 40 %,
          šviežumas 25 %, šaltinio patikimumas 20 %, įvairovė × prioritetas 15 %.
          Turinys — kuruota demo momentinė kopija, ne gyvas viso miesto rinkimas.
        </p>
      </aside>
    </main>
  );
}
