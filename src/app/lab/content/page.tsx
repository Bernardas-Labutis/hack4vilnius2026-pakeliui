"use client";

import Link from "next/link";
import { useState } from "react";

/** Exact shape your colleague sent (JS object literals — also accepts real JSON). */
const FRIEND_SAMPLE = `[
  {
    id: "7c9a2e41-6b83-4fd2-9c15-8e2b7a4d1f60",
    title: "Vilniaus senojo teatro scenoje – tarptautinis „Vilnius Jazz“ festivalis",
    summary:
      "2026 m. spalio 14–19 d. Vilniaus senajame teatre vyks 39-asis tarptautinis šiuolaikinio džiazo ir improvizacinės muzikos festivalis „Vilnius Jazz“. Programoje numatyti Lietuvos ir užsienio muzikantų koncertai, o nuo spalio 14 d. teatre bus eksponuojama Sigito Kondrato fotografijų paroda „Vizualinės improvizacijos“.",
    fullText:
      "Vilniaus senasis teatras taps viena pagrindinių 39-ojo tarptautinio šiuolaikinio džiazo ir improvizacinės muzikos festivalio „Vilnius Jazz“ erdvių. 2026 m. spalio 14–19 d. čia vyks koncertai, kuriuose pasirodys Lietuvos ir užsienio atlikėjai. Festivalio programą papildys Sigito Kondrato fotografijų paroda „Vizualinės improvizacijos“, atskleidžianti, kaip fotografijos priemonėmis galima perteikti muziką. Prie fotografijų numatyti QR kodai, kuriuos nuskenavę lankytojai galės išgirsti su vaizdais susijusius garsus. Spalio 12 d. festivalio programos dokumentinio kino seansas numatytas „Skalvijos“ kino teatre. Renginiai sujungs šiuolaikinį džiazą, kiną ir vizualųjį meną Vilniaus kultūrinėse erdvėse.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/kultura/12/3075146/vilnius-jazz-festivalio-dialogai-ir-kino-saleje-paskaitose-parodoje",
    publishedAt: "2026-10-07T12:45:00+03:00",
    locations: ["vilnius", "vilniaus-senasis-teatras", "skalvijos-kinoteatras"],
    category: "culture",
    sourceConfidence: 100,
    durationSec: 180,
    geo: [
      {
        lat: 54.6786,
        lng: 25.2818,
        label: "Vilniaus senasis teatras"
      },
      {
        lat: 54.6817,
        lng: 25.2758,
        label: "Skalvijos kino centras"
      }
    ]
  }
]`;

export default function ContentLabPage() {
  const [source, setSource] = useState(FRIEND_SAMPLE);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLoad() {
    setBusy(true);
    setStatus(null);
    setError(null);
    try {
      const res = await fetch("/api/lab/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const data = (await res.json()) as { error?: string; path?: string };
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setStatus(
        `Saved to ${data.path}. Open / and step the map — new pins + feed items appear after hot reload.`,
      );
    } catch {
      setError("Network error while saving");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="lab-layout">
      <header className="lab-header">
        <div>
          <p className="lab-kicker">Pakeliui lab</p>
          <h1>Upload news candidates</h1>
          <p>
            Paste your colleague&apos;s <code>[ &#123; ... &#125; ]</code> array
            (JS style or real JSON), then click <strong>Įkelti</strong>.
          </p>
        </div>
        <Link className="lab-link" href="/">
          ← Demo
        </Link>
      </header>

      <section className="lab-editor lab-editor-wide">
        <div className="lab-toolbar">
          <button
            className="lab-button"
            disabled={busy}
            onClick={() => void handleLoad()}
            type="button"
          >
            {busy ? "Saving…" : "Įkelti"}
          </button>
          <button
            className="lab-button ghost"
            onClick={() => {
              setSource(FRIEND_SAMPLE);
              setError(null);
              setStatus("Friend sample restored in the editor");
            }}
            type="button"
          >
            Reset sample
          </button>
        </div>

        <textarea
          aria-label="Candidate JSON or JS array"
          className="lab-textarea"
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          value={source}
        />

        {status ? <p className="lab-status ok">{status}</p> : null}
        {error ? <p className="lab-status err">{error}</p> : null}

        <ul className="lab-rules">
          <li>
            Open <code>/lab/content</code> → paste → <strong>Įkelti</strong>
          </li>
          <li>Then open <code>/</code> and use map stages to see pins</li>
          <li>
            Accepts unquoted JS keys (<code>id:</code>) or JSON (
            <code>&quot;id&quot;:</code>)
          </li>
        </ul>
      </section>
    </main>
  );
}
