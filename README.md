# Pakeliui

A mobile-first sample for Hack4Vilnius 2026: a location-aware audio
companion that turns a Vilnius public-transport route into a short city story.

The sample uses mocked route and story data, so it works without API keys. The
audio-player interaction is simulated and ready to be replaced with generated
or pre-recorded audio.

## Run locally

Install [Node.js 20.9 or newer](https://nodejs.org/), then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected **Next.js** defaults and select **Deploy**.

No environment variables are needed for this sample.

## Suggested next steps

- Replace the stylized map with MapLibre and real GTFS route geometry.
- Add curated route facts and local-news sources.
- Generate scripts and speech in server-side route handlers.
- Cache generated audio for a fast and reliable jury demo.
