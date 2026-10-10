"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { ColleagueMapProps } from "@/components/colleague-map-types";
import { getAllCandidates } from "@/data/all-candidates";
import { ROUTE_POLYLINES } from "@/data/route-geometry";

const PreviewMap = dynamic<ColleagueMapProps>(
  () => import("@/components/ColleagueMap"),
  {
    ssr: false,
    loading: () => <div className="lab-preview-loading">Kraunama…</div>,
  },
);

const SAMPLE_NOTICE = `// Įklijuokite kolegos TSX čia.
// Reikia: export default function ... (arba export default Component)
// Jei naudoja maplibre/leaflet — pirmiausia npm install tų paketų.
`;

export default function MapLabPage() {
  const [source, setSource] = useState(SAMPLE_NOTICE);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<ColleagueMapProps["stage"]>("pins");

  async function loadCurrent() {
    try {
      const res = await fetch("/api/lab/colleague-map");
      const data = (await res.json()) as { source?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Nepavyko nuskaityti failo");
        return;
      }
      if (data.source) setSource(data.source);
      setError(null);
      setStatus("Nuskaitytas dabartinis ColleagueMap.tsx");
    } catch {
      setError("Nepavyko nuskaityti ColleagueMap.tsx");
    }
  }

  async function handleLoad() {
    setBusy(true);
    setStatus(null);
    setError(null);
    try {
      const res = await fetch("/api/lab/colleague-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const data = (await res.json()) as { error?: string; path?: string };
      if (!res.ok) {
        setError(data.error ?? "Įkėlimas nepavyko");
        return;
      }
      setStatus(`Įrašyta į ${data.path}. Peržiūra atnaujinama…`);
      // Give Turbopack a moment to pick up the write, then remount.
      window.setTimeout(() => {
        setRevision((current) => current + 1);
        setStatus(`Įrašyta į ${data.path}. Peržiūra atnaujinta.`);
      }, 600);
    } catch {
      setError("Tinklo klaida įrašant failą");
    } finally {
      setBusy(false);
    }
  }

  const pins = getAllCandidates()
    .filter((item) => item.geo?.[0])
    .map((item) => ({
      id: item.id,
      lat: item.geo![0].lat,
      lng: item.geo![0].lng,
      label: item.geo![0].label ?? item.title,
      active:
        stage === "filtered" &&
        item.locations.some((loc) =>
          [
            "snipiskes",
            "neris",
            "business-district",
            "kalvariju",
            "northern-vilnius",
            "stotis",
            "new-town",
          ].includes(loc),
        ),
      dimmed:
        stage === "filtered" &&
        !item.locations.some((loc) =>
          [
            "snipiskes",
            "neris",
            "business-district",
            "kalvariju",
            "northern-vilnius",
            "stotis",
            "new-town",
          ].includes(loc),
        ),
    }));

  return (
    <main className="lab-layout">
      <header className="lab-header">
        <div>
          <p className="lab-kicker">Pakeliui lab</p>
          <h1>Žemėlapio TSX įkėlimas</h1>
          <p>
            Įklijuokite kolegos komponentą, spauskite <strong>Įkelti</strong> —
            failas įrašomas į <code>src/components/ColleagueMap.tsx</code> ir
            rodomas telefono rėmelyje.
          </p>
        </div>
        <div className="lab-header-links">
          <Link className="lab-link" href="/lab/content">
            Turinio lab
          </Link>
          <Link className="lab-link" href="/">
            ← Demo
          </Link>
        </div>
      </header>

      <div className="lab-grid">
        <section className="lab-editor">
          <div className="lab-toolbar">
            <button
              className="lab-button"
              disabled={busy}
              onClick={() => void handleLoad()}
              type="button"
            >
              {busy ? "Įkeliama…" : "Įkelti"}
            </button>
            <button
              className="lab-button ghost"
              onClick={() => {
                setStatus(null);
                void loadCurrent();
              }}
              type="button"
            >
              Nuskaityti failą
            </button>
          </div>
          <textarea
            aria-label="Colleague map TSX"
            className="lab-textarea"
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
            value={source}
          />
          {status ? <p className="lab-status ok">{status}</p> : null}
          {error ? <p className="lab-status err">{error}</p> : null}
          <ul className="lab-rules">
            <li>Privaloma: <code>export default</code> React komponentas</li>
            <li>
              Pasirenkama: props tipas iš{" "}
              <code>colleague-map-types.ts</code> (<code>stage</code>,{" "}
              <code>pins</code>, <code>routeLine</code>)
            </li>
            <li>
              Jei importuojate maplibre/leaflet — įdiekite paketą prieš
              įkeldami
            </li>
            <li>Veikia tik <code>npm run dev</code> aplinkoje</li>
          </ul>
        </section>

        <section className="lab-preview">
          <div className="lab-stage-row">
            {(
              [
                ["idle", "Tuščias"],
                ["pins", "Taškai"],
                ["route", "1G"],
                ["filtered", "Variklis"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                className={stage === id ? "pill active" : "pill"}
                onClick={() => setStage(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="phone-shell lab-phone">
            <div className="lab-phone-top">Pakeliui · žemėlapio peržiūra</div>
            <div className="map lab-map-slot">
              <PreviewMap
                key={revision}
                pins={pins}
                routeLabel="1G"
                routeLine={ROUTE_POLYLINES.modern}
                stage={stage}
              />
            </div>
            <p className="lab-phone-note">
              revision {revision} · stage {stage}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
