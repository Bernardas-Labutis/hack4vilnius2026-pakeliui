"use client";

import { useEffect, useState } from "react";

const stories = [
  {
    eyebrow: "Coming up in 2 min",
    title: "The green bridge with many lives",
    text: "Žaliasis tiltas has connected both banks of the Neris for centuries. The bridge you see today opened in 1952.",
    time: "0:42",
  },
  {
    eyebrow: "Near Lukiškės",
    title: "A square that keeps changing",
    text: "From market days to public celebrations, Lukiškės Square has been reinvented many times with the city around it.",
    time: "0:36",
  },
  {
    eyebrow: "Near the station",
    title: "Vilnius on the move",
    text: "The first train arrived here in 1860, putting Vilnius on the route between Saint Petersburg and Warsaw.",
    time: "0:39",
  },
];

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

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(28);
  const [storyIndex, setStoryIndex] = useState(0);
  const story = stories[storyIndex];

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 100 ? 0 : current + 0.25));
    }, 150);

    return () => window.clearInterval(timer);
  }, [playing]);

  function nextStory() {
    setStoryIndex((current) => (current + 1) % stories.length);
    setProgress(0);
    setPlaying(true);
  }

  return (
    <main>
      <section className="phone-shell">
        <header className="topbar">
          <a className="brand" href="#" aria-label="Pakeliui home">
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
            EN
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
          <div className="route-number">2G</div>
          <div>
            <p className="route-label">Your trip</p>
            <h1>Santariškės → Stotis</h1>
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
            24 min
          </div>
        </div>

        <div className="map" aria-label="Stylized route map">
          <span className="road road-one" />
          <span className="road road-two" />
          <span className="road road-three" />
          <span className="river" />
          <span className="route-line" />
          <span className="map-stop stop-one" />
          <span className="map-stop stop-two" />
          <span className="map-stop stop-three" />
          <span className="bus-marker">
            <Icon size={19}>
              <rect
                height="14"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
                width="13"
                x="5.5"
                y="3"
              />
              <path
                d="M8 7h8M8.5 17v2M15.5 17v2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </Icon>
          </span>
          <div className="location-label">
            <strong>Žaliasis tiltas</strong>
            <span>Next stop · 2 min</span>
          </div>
        </div>

        <div className="content">
          <div className="now-playing">
            <div>
              <span className="live-dot" />
              Audio journey
            </div>
            <span>
              {storyIndex + 1} of {stories.length}
            </span>
          </div>

          <article className="story-card">
            <p className="eyebrow">{story.eyebrow}</p>
            <h2>{story.title}</h2>
            <p className="story-copy">{story.text}</p>

            <div className="player">
              <button
                aria-label={playing ? "Pause audio" : "Play audio"}
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
                  aria-label="Seek audio"
                  className="progress-track"
                  onClick={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setProgress(
                      ((event.clientX - bounds.left) / bounds.width) * 100,
                    );
                  }}
                  type="button"
                >
                  <span style={{ width: `${progress}%` }} />
                </button>
                <div className="time-row">
                  <span>0:{Math.floor((progress / 100) * 42).toString().padStart(2, "0")}</span>
                  <span>{story.time}</span>
                </div>
              </div>
              <button
                aria-label="Next story"
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
          </article>

          <div className="feature-row">
            <div>
              <Icon size={18}>
                <path
                  d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </Icon>
              Stories follow your route
            </div>
            <span>Live demo</span>
          </div>
        </div>
      </section>
      <p className="desktop-note">
        A location-aware audio layer for Vilnius public transport.
      </p>
    </main>
  );
}
