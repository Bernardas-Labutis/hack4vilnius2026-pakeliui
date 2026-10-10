"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MapStage } from "@/components/colleague-map-types";
import { mergeCandidates } from "@/data/all-candidates";
import type { CandidateItem } from "@/data/demo-content";
import { CATEGORY_LABELS } from "@/data/demo-content";
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

const RouteMap = dynamic(() => import("@/components/ColleagueMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Žemėlapis…</div>,
});

const MAP_STAGES: MapStage[] = ["idle", "pins", "route", "filtered"];

const STAGE_LABELS: Record<MapStage, string> = {
  idle: "Žemėlapis",
  pins: "Naujienų taškai",
  route: "1G maršrutas",
  filtered: "Variklio atranka",
};

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

  const mapPins = useMemo(
    () =>
      candidates
        .filter((item) => item.geo?.[0])
        .map((item) => {
          const point = item.geo![0];
          const selected = selectedIds.has(item.id);
          return {
            id: item.id,
            lat: point.lat,
            lng: point.lng,
            label: point.label ?? item.title,
            active: mapStage === "filtered" && selected,
            dimmed: mapStage === "filtered" && !selected,
          };
        }),
    [candidates, mapStage, selectedIds],
  );

  const stories = feed.selected;
  const safeIndex = Math.min(storyIndex, Math.max(stories.length - 1, 0));
  const story = stories[safeIndex] ?? null;
  const openId =
    expandedId === undefined
      ? (feed.selected[0]?.item.id ?? null)
      : expandedId;

  useEffect(() => {
    if (!playing || !story) return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          if (safeIndex < stories.length - 1) {
            setStoryIndex(safeIndex + 1);
            return 0;
          }
          setPlaying(false);
          return 100;
        }
        return current + 15 / story.item.durationSec;
      });
    }, 150);

    return () => window.clearInterval(timer);
  }, [playing, story, safeIndex, stories.length]);

  function resetPlayback() {
    setStoryIndex(0);
    setProgress(0);
    setPlaying(false);
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

  function nextStory() {
    if (stories.length === 0) return;
    setStoryIndex((current) => (current + 1) % stories.length);
    setProgress(0);
    setPlaying(true);
  }

  function setMapStageStep(next: MapStage) {
    if (next === "route" || next === "filtered") {
      // Jury walkthrough uses 1G corridor for the route overlay story.
      if (routeId !== "modern") {
        setRouteId("modern");
        resetPlayback();
      }
    }
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
    const index = MAP_STAGES.indexOf(mapStage);
    const next = MAP_STAGES[Math.min(index + 1, MAP_STAGES.length - 1)];
    setMapStageStep(next);
  }

  const elapsedSec = story
    ? Math.floor((progress / 100) * story.item.durationSec)
    : 0;

  return (
    <main className="demo-layout">
      <section className={`phone-shell ${sheetOpen ? "sheet-expanded" : ""}`}>
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
          <div className="route-number">{route.number}</div>
          <div>
            <p className="route-label">Jūsų kelionė</p>
            <h1>
              {route.from} → {route.to}
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
            routeLine={ROUTE_POLYLINES[route.id] ?? ROUTE_POLYLINES.modern}
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
            {sheetOpen ? "Suskleisti" : "Išskleisti grotuvą / etapus"}
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
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
            <button
              className="stage-next"
              disabled={mapStage === "filtered"}
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
                    ? "Variklio srautas"
                    : "Sugeneruotas srautas"}
                </div>
                <span>
                  {stories.length === 0
                    ? "0 istorijų"
                    : `${safeIndex + 1} iš ${stories.length}`}
                </span>
              </div>

              {story ? (
                <article className="story-card">
                  <p className="eyebrow">
                    {CATEGORY_LABELS[story.item.category]} · balas{" "}
                    {story.scores.total}
                  </p>
                  <h2>{story.item.title}</h2>
                  <p className="story-copy">{story.item.summary}</p>

                  <div className="player">
                    <button
                      aria-label={playing ? "Pristabdyti garsą" : "Groti garsą"}
                      className="play-button"
                      onClick={() => setPlaying((current) => !current)}
                      type="button"
                    >
                      {playing ? (
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
                        onClick={(event) => {
                          const bounds =
                            event.currentTarget.getBoundingClientRect();
                          setProgress(
                            ((event.clientX - bounds.left) / bounds.width) *
                              100,
                          );
                        }}
                        type="button"
                      >
                        <span style={{ width: `${progress}%` }} />
                      </button>
                      <div className="time-row">
                        <span>{formatDuration(elapsedSec)}</span>
                        <span>{formatDuration(story.item.durationSec)}</span>
                      </div>
                    </div>
                    <button
                      aria-label="Kita istorija"
                      className="next-button"
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
                    Demo peržiūra — įrašytas garsas dar nepridėtas
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
              {STAGE_LABELS[mapStage]}
              {story ? ` · ${story.item.title}` : ""}
            </p>
          )}
        </div>
      </section>

      <aside className="engine-panel">
        <div className="engine-intro">
          <p className="engine-kicker">Pakeliui srauto variklis</p>
          <h2>Kaip sudarėme jūsų srautą</h2>
          <p>
            Vienas bendras turinio rinkinys. Pakeiskite maršrutą, trukmę ar
            prioritetą — reitingavimo variklis iš naujo sudaro grojaraštį ir
            paaiškina kiekvieną sprendimą.
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
          Turinys — kuruota demo momentinė kopija, ne gyvas viso miesto rinkimas.{" "}
          <Link href="/lab/content">Turinio lab →</Link>
          {" · "}
          <Link href="/lab/map">Žemėlapio TSX lab →</Link>
        </p>
      </aside>
    </main>
  );
}
