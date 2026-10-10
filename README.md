# Pakeliui

A mobile-first Hack4Vilnius 2026 demo: a location-aware audio companion that
builds a journey-length feed from a shared content pool using an explainable
ranking engine.

## Authors

This project was done by **Gabriele Čiuladaitė**, **Mantas Pimpė**, and
**Bernardas Labutis**.

The demo is intentionally scoped for reliability:

- Two prepared Vilnius route profiles
- One curated content snapshot (municipal, tourism, news-style sources)
- Deterministic scoring — not a live city-wide crawl
- Playback is a **demo preview** until narration files are added under `public/audio/`

## Run locally

Install [Node.js 20.9 or newer](https://nodejs.org/), then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What judges should see

1. Open the Feed Engine panel beside the phone UI.
2. Note the shared candidate pool size (Candidates).
3. Select **Old Town & cultural sites**, generate the feed, expand a selected story.
4. Switch to **Modern neighbourhoods & local updates** — selected stories and scores change.
5. Change duration (3 / 10 / 20 min) or preference (recent / balanced / evergreen).
6. Inspect rejected items for reasons: irrelevant, stale, duplicate, duration budget.

## Scoring formula

```text
total =
  routeRelevance      × 0.40 +
  freshness           × 0.25 +
  sourceConfidence    × 0.20 +
  diversityPreference × 0.15

diversityPreference = 0.6 × preferenceFit + 0.4 × diversity
```

- **Route relevance** — overlap between item location tags and the route corridor
- **Freshness** — exponential decay with category-specific half-lives
- **Source confidence** — pre-assigned trust for the publisher (not a truth score)
- **Preference fit** — boosts news vs evergreen based on the selected profile
- **Diversity** — penalises repeating the same category / topic in the playlist

Selection fills a duration budget, then recalculates diversity after each pick.

## Project layout

| Path | Role |
| --- | --- |
| `src/data/routes.ts` | Two route corridors + duration/preference options |
| `src/data/demo-content.ts` | Shared candidate pool with sources and tags |
| `src/lib/feed-engine.ts` | Scoring, selection, rejection reasons |
| `src/app/page.tsx` | Phone player + algorithm inspection UI |
| `public/audio/` | Optional pre-recorded narration clips |

## Adding narration audio

1. Record short clips (about 20–40 seconds) for selected stories.
2. Save as `public/audio/<item-id>.mp3`.
3. Set `audioSrc: "/audio/<item-id>.mp3"` on the matching item in `demo-content.ts`.

Until files exist, the player remains a timed demo preview.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected **Next.js** defaults and select **Deploy**.

No environment variables are required for this demo.

## Suggested next steps

- Snapshot official RSS/API feeds into the candidate pool before demos.
- Add MapLibre + real GTFS geometry for corridor matching.
- Generate Lithuanian narration and cache audio for jury day.
- Label sponsored items clearly if B2G licensing adds partners later.
