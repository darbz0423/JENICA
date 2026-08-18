import { useEffect, useMemo, useRef, useState } from "react";
import ParticleCanvas from "../universe/ParticleCanvas";

const messages = [
  "ESTABLISHING CONNECTION TO MEMORY ARCHIVE",
  "LOCATING FRAGMENTED MEMORIES",
  "RECONSTRUCTING TEMPORAL INDEX",
  "CALIBRATING LIGHT FIELD",
  "RESTORING PHOTOGRAPHIC DATA",
  "RECONNECTING VOICE SIGNATURES",
  "REASSEMBLING LOST MOMENTS",
  "SEARCHING FOR SOMETHING IMPORTANT",
  "MEMORY CORE SYNCHRONIZED",
];

const systems = [
  ["ARCHIVE", "07"],
  ["MEMORY CORE", "ONLINE"],
  ["LIGHT ENGINE", "CALIBRATED"],
  ["SIGNAL", "STABLE"],
];

const fragments = [
  "A MOMENT WAS FOUND",
  "AN OLD LAUGH WAS DETECTED",
  "A PHOTOGRAPH REMAINS",
  "TIME LEFT A TRACE",
  "SOME MEMORIES NEVER DISAPPEAR",
  "SOMETHING IMPORTANT IS WAITING",
];

const coordinates = [
  "10°18′N 123°53′E",
  "ARCHIVE // 001",
  "TEMPORAL // 07",
  "SIGNAL // 100%",
];

export default function BootSequence({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [finished, setFinished] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [fragment, setFragment] = useState("");
  const [coordinateIndex, setCoordinateIndex] = useState(0);
  const [time, setTime] = useState(0);

  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const completeCalled = useRef(false);

  // ============================================================
  // DETERMINISTIC STAR FIELD
  // ============================================================

  const stars = useMemo(() => {
    return Array.from({ length: 130 }, (_, i) => ({
      id: i,
      x: `${(i * 43.719) % 100}%`,
      y: `${(i * 71.391) % 100}%`,
      size: 0.5 + (i % 4) * 0.45,
      delay: `${(i % 13) * 0.31}s`,
      duration: `${2.2 + (i % 6) * 0.8}s`,
    }));
  }, []);

  // ============================================================
  // FLOATING MEMORY PARTICLES
  // ============================================================

  const memoryParticles = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: `${8 + ((i * 31.7) % 84)}%`,
      y: `${12 + ((i * 47.3) % 76)}%`,
      delay: `${(i % 9) * 0.45}s`,
      duration: `${5 + (i % 5)}s`,
      size: `${1 + (i % 3)}px`,
    }));
  }, []);

  // ============================================================
  // CLOCK
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // POINTER / PARALLAX
  // MOBILE SAFE
  // ============================================================

  useEffect(() => {
    const handlePointer = (event) => {
      if (window.innerWidth < 768) return;

      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;

      setPointer({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    window.addEventListener("pointermove", handlePointer);

    return () => {
      window.removeEventListener("pointermove", handlePointer);
    };
  }, []);

  // ============================================================
  // BOOT SEQUENCE
  // ============================================================

  useEffect(() => {
    let timeout;

    const advance = (current) => {
      if (current >= messages.length - 1) {
        setIndex(messages.length - 1);
        setProgress(100);

        timeout = setTimeout(() => {
          setFinished(true);
        }, 900);

        timeout = setTimeout(() => {
          setLeaving(true);

          setTimeout(() => {
            if (!completeCalled.current) {
              completeCalled.current = true;
              onComplete?.();
            }
          }, 1500);
        }, 2900);

        return;
      }

      const next = current + 1;

      setIndex(next);

      setProgress(
        Math.round(
          (next / (messages.length - 1)) * 100
        )
      );

      timeout = setTimeout(
        () => advance(next),
        620 + Math.random() * 360
      );
    };

    timeout = setTimeout(() => advance(0), 850);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  // ============================================================
  // GLITCH ENGINE
  // ============================================================

  useEffect(() => {
    const trigger = () => {
      setGlitch(true);

      setTimeout(() => {
        setGlitch(false);
      }, 70 + Math.random() * 150);
    };

    const interval = setInterval(
      trigger,
      2200 + Math.random() * 3200
    );

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // MEMORY CORE PULSE
  // ============================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);

      setTimeout(() => {
        setPulse(false);
      }, 650);
    }, 1900);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // MEMORY FRAGMENTS
  // ============================================================

  useEffect(() => {
    if (index < 2) return;

    let hideTimer;

    const interval = setInterval(() => {
      const random =
        fragments[
          Math.floor(Math.random() * fragments.length)
        ];

      setFragment(random);

      hideTimer = setTimeout(() => {
        setFragment("");
      }, 1700);
    }, 2700);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [index]);

  // ============================================================
  // COORDINATE ROTATION
  // ============================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinateIndex((value) =>
        (value + 1) % coordinates.length
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const archiveNumber = String(
    Math.floor(progress * 37.21)
  ).padStart(4, "0");

  const systemTime = String(time).padStart(4, "0");

  return (
    <main
      className={`
        fixed inset-0 z-[100] overflow-hidden
        bg-[#010101] text-white
        transition-all duration-[1500ms] ease-[cubic-bezier(.22,1,.36,1)]
        ${
          leaving
            ? "scale-[1.16] opacity-0"
            : "scale-100 opacity-100"
        }
      `}
    >
      {/* ========================================================
          PARTICLE UNIVERSE
      ======================================================== */}

      <ParticleCanvas
        density={window.innerWidth < 768 ? 70 : 125}
        speed={0.016}
      />

      {/* ========================================================
          ATMOSPHERE
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,.07),transparent_13%,rgba(0,0,0,.72)_58%,#000_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,.025),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(255,255,255,.02),transparent_30%)]" />

      {/* ========================================================
          STARS
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `
                starPulse
                ${star.duration}s
                ease-in-out
                ${star.delay}
                infinite
              `,
            }}
          />
        ))}
      </div>

      {/* ========================================================
          FLOATING MEMORY DUST
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {memoryParticles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-white/20 blur-[1px]"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              animation: `
                memoryFloat
                ${particle.duration}s
                ease-in-out
                ${particle.delay}
                infinite
              `,
            }}
          />
        ))}
      </div>

      {/* ========================================================
          CRT SCANLINES
      ======================================================== */}

      <div
        className="pointer-events-none absolute inset-0 z-40 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,.5) 4px)",
        }}
      />

      {/* ========================================================
          SCANNER
      ======================================================== */}

      <div
        className="pointer-events-none absolute left-0 right-0 z-30 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{
          animation:
            "scanDown 6s linear infinite",
        }}
      />

      {/* ========================================================
          FILM GRAIN
      ======================================================== */}

      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ========================================================
          VIGNETTE
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle,transparent_12%,rgba(0,0,0,.3)_50%,rgba(0,0,0,.97)_100%)]" />

      {/* ========================================================
          GLITCH FLASH
      ======================================================== */}

      <div
        className={`
          pointer-events-none absolute inset-0 z-[90]
          bg-white mix-blend-screen
          transition-opacity duration-75
          ${glitch ? "opacity-[0.035]" : "opacity-0"}
        `}
      />

      {/* ========================================================
          TOP HUD
      ======================================================== */}

      <header className="absolute left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6 sm:py-5 md:px-10">
        <div className="flex items-center justify-between">

          {/* LEFT */}

          <div className="flex items-center gap-2.5 sm:gap-3">

            <div className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-white/50" />

              <span className="relative h-full w-full rounded-full bg-white" />
            </div>

            <span className="font-mono text-[7px] uppercase tracking-[0.42em] text-white/35 sm:text-[8px] sm:tracking-[0.6em]">
              MEMORY ARCHIVE
            </span>

          </div>

          {/* CENTER */}

          <div className="hidden font-mono text-[7px] tracking-[0.5em] text-white/10 md:block">
            TEMPORAL MEMORY SYSTEM
          </div>

          {/* RIGHT */}

          <div className="text-right">
            <div className="font-mono text-[7px] tracking-[0.3em] text-white/20 sm:text-[8px] sm:tracking-[0.35em]">
              ARCHIVE_07
            </div>

            <div className="mt-1 hidden font-mono text-[6px] tracking-[0.25em] text-white/10 sm:block">
              {systemTime}
            </div>
          </div>

        </div>

        {/* MOBILE HEADER LINE */}

        <div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 via-white/[0.025] to-transparent sm:hidden" />
      </header>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <div className="relative z-10 flex h-full items-center justify-center px-4 pb-4 pt-16 sm:px-6 sm:pt-20">

        <div
          className="relative w-full max-w-6xl"
          style={{
            transform: `
              translate(
                ${pointer.x * -8}px,
                ${pointer.y * -8}px
              )
            `,
          }}
        >

          {/* ====================================================
              MEMORY CORE
          ==================================================== */}

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 sm:h-[470px] sm:w-[470px] md:h-[600px] md:w-[600px]"
          >

            {/* OUTER RING */}

            <div
              className="absolute inset-0 rounded-full border border-white/[0.025]"
              style={{
                animation:
                  "rotateClockwise 40s linear infinite",
              }}
            />

            {/* DASHED RING */}

            <div
              className="absolute inset-[10%] rounded-full border border-dashed border-white/[0.035]"
              style={{
                animation:
                  "rotateReverse 25s linear infinite",
              }}
            />

            {/* INNER RING */}

            <div
              className="absolute inset-[23%] rounded-full border border-white/[0.05]"
              style={{
                animation:
                  "rotateClockwise 17s linear infinite",
              }}
            />

            {/* MICRO RING */}

            <div
              className="absolute inset-[36%] rounded-full border border-white/[0.07]"
            />

            {/* ORBIT DOTS */}

            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="absolute left-1/2 top-0 h-1 w-1 rounded-full bg-white/60"
                style={{
                  transform: `
                    rotate(${i * 60}deg)
                    translateY(-4px)
                  `,
                  transformOrigin:
                    "0 180px",
                  boxShadow:
                    "0 0 12px rgba(255,255,255,.8)",
                }}
              />
            ))}

            {/* CROSS */}

            <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.035] to-transparent" />

            <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent" />

            {/* CORE AURA */}

            <div
              className={`
                absolute left-1/2 top-1/2
                h-16 w-16
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/[0.02]
                blur-xl
                transition-transform duration-700
                ${pulse ? "scale-[2]" : "scale-100"}
              `}
            />

            {/* CORE RINGS */}

            <div
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
              style={{
                animation:
                  "corePulse 3s ease-in-out infinite",
              }}
            />

            <div
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.1]"
              style={{
                animation:
                  "corePulseReverse 2.2s ease-in-out infinite",
              }}
            />

            {/* CORE */}

            <div
              className={`
                absolute left-1/2 top-1/2
                h-3 w-3
                sm:h-4 sm:w-4
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white
                transition-transform duration-500
                ${pulse ? "scale-[1.8]" : "scale-100"}
              `}
              style={{
                boxShadow:
                  "0 0 22px 7px rgba(255,255,255,.7), 0 0 100px 30px rgba(255,255,255,.13)",
              }}
            />

          </div>

          {/* ====================================================
              TITLE
          ==================================================== */}

          <div
            className={`
              mb-5 text-center
              transition-all
              duration-[1500ms]
              sm:mb-7
              ${
                index >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }
            `}
          >

            <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">

              <span className="h-px w-5 bg-white/10 sm:w-8" />

              <span className="font-mono text-[6px] tracking-[0.45em] text-white/20 sm:text-[7px] sm:tracking-[0.65em]">
                ARCHIVE INITIALIZATION
              </span>

              <span className="h-px w-5 bg-white/10 sm:w-8" />

            </div>

            <h1
              className={`
                font-serif
                text-[clamp(2rem,11vw,5rem)]
                font-light
                leading-none
                tracking-[-0.055em]
                transition-all
                duration-200
                ${
                  glitch
                    ? "translate-x-[2px] skew-x-2"
                    : ""
                }
              `}
            >
              MEMORY
              <span className="text-white/20">
                {" "}UNIVERSE
              </span>
            </h1>

            <div className="mt-2 font-mono text-[6px] tracking-[0.4em] text-white/10 sm:mt-3 sm:text-[7px] sm:tracking-[0.55em]">
              TEMPORAL ARCHIVE // {archiveNumber}
            </div>

          </div>

          {/* ====================================================
              CONSOLE
          ==================================================== */}

          <div
            className={`
              relative mx-auto w-full
              max-w-3xl
              border border-white/[0.08]
              bg-black/35
              p-4
              backdrop-blur-xl
              transition-all
              duration-[1600ms]
              sm:p-6
              md:p-9
              ${
                index >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >

            {/* CORNERS */}

            <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-white/40 sm:h-4 sm:w-4" />

            <div className="absolute right-0 top-0 h-3 w-3 border-r border-t border-white/40 sm:h-4 sm:w-4" />

            <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/40 sm:h-4 sm:w-4" />

            <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/40 sm:h-4 sm:w-4" />

            {/* CONSOLE HEADER */}

            <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-3 sm:mb-7 sm:pb-4">

              <div className="flex items-center gap-2 sm:gap-3">

                <span className="font-mono text-[6px] tracking-[0.3em] text-white/20 sm:text-[7px] sm:tracking-[0.4em]">
                  SYSTEM
                </span>

                <span className="font-mono text-[6px] text-white/10 sm:text-[7px]">
                  /
                </span>

                <span className="font-mono text-[6px] tracking-[0.25em] text-white/30 sm:text-[7px] sm:tracking-[0.4em]">
                  BOOT_SEQUENCE
                </span>

              </div>

              <div className="font-mono text-[7px] tracking-[0.25em] text-white/30 sm:text-[8px] sm:tracking-[0.3em]">
                {String(progress).padStart(3, "0")}%
              </div>

            </div>

            {/* ==================================================
                LOGS
            ================================================== */}

            <div className="min-h-[210px] space-y-3 sm:min-h-[250px] sm:space-y-4">

              {messages.map((message, i) => {

                const active = i === index;
                const complete = i < index;
                const hidden = i > index;

                return (
                  <div
                    key={message}
                    className={`
                      flex items-center gap-2.5
                      font-mono
                      text-[7px]
                      leading-relaxed
                      tracking-[0.13em]
                      transition-all
                      duration-700
                      sm:gap-4
                      sm:text-[10px]
                      sm:tracking-[0.22em]
                      ${
                        hidden
                          ? "translate-x-4 opacity-0"
                          : "translate-x-0 opacity-100"
                      }
                    `}
                  >

                    {/* STATUS */}

                    <div className="flex w-3 shrink-0 justify-center sm:w-5">

                      {complete && (
                        <span className="text-white/20">
                          ✓
                        </span>
                      )}

                      {active && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,.8)]" />
                      )}

                    </div>

                    {/* NUMBER */}

                    <span className="hidden shrink-0 text-white/10 sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* MESSAGE */}

                    <span
                      className={`
                        min-w-0
                        transition-all
                        duration-500
                        ${
                          active
                            ? "text-white"
                            : complete
                            ? "text-white/20"
                            : "text-white/10"
                        }
                      `}
                    >
                      {message}
                    </span>

                    {/* CURSOR */}

                    {active && (
                      <span className="h-3 w-px shrink-0 animate-pulse bg-white" />
                    )}

                  </div>
                );
              })}

            </div>

            {/* ==================================================
                PROGRESS
            ================================================== */}

            <div className="mt-6 sm:mt-8">

              <div className="mb-2.5 flex items-center justify-between sm:mb-3">

                <span className="font-mono text-[6px] tracking-[0.3em] text-white/15 sm:text-[7px] sm:tracking-[0.4em]">
                  MEMORY RESTORATION
                </span>

                <span className="font-mono text-[6px] tracking-[0.25em] text-white/25 sm:text-[7px] sm:tracking-[0.3em]">
                  {String(progress).padStart(3, "0")}%
                </span>

              </div>

              <div className="relative h-[2px] overflow-hidden bg-white/[0.07]">

                <div
                  className="absolute inset-y-0 left-0 bg-white transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />

                <div
                  className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent sm:w-24"
                  style={{
                    animation:
                      "progressScan 1.5s linear infinite",
                  }}
                />

              </div>

            </div>

          </div>

          {/* ====================================================
              MEMORY FRAGMENT
          ==================================================== */}

          <div
            className={`
              mt-4 h-4 text-center
              font-mono text-[6px]
              tracking-[0.38em]
              text-white/20
              transition-all duration-700
              sm:mt-6
              sm:text-[7px]
              sm:tracking-[0.5em]
              ${
                fragment
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          >
            {fragment}
          </div>

          {/* ====================================================
              SYSTEM MODULES
          ==================================================== */}

          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-1.5 sm:mt-5 sm:gap-2 md:grid-cols-4">

            {systems.map(([name, value], i) => {

              const active = index > i;

              return (
                <div
                  key={name}
                  className={`
                    border
                    px-2.5 py-2.5
                    transition-all
                    duration-700
                    sm:px-3 sm:py-3
                    ${
                      active
                        ? "border-white/[0.1] bg-white/[0.015]"
                        : "border-white/[0.045] bg-white/[0.005]"
                    }
                  `}
                >

                  <div className="font-mono text-[5px] tracking-[0.25em] text-white/10 sm:text-[6px] sm:tracking-[0.3em]">
                    MODULE {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="mt-1.5 font-mono text-[6px] tracking-[0.14em] text-white/30 sm:mt-2 sm:text-[7px] sm:tracking-[0.18em]">
                    {name}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 sm:gap-2">

                    <span
                      className={`
                        h-1 w-1 rounded-full
                        ${
                          active
                            ? "bg-white shadow-[0_0_7px_rgba(255,255,255,.7)]"
                            : "bg-white/10"
                        }
                      `}
                    />

                    <span className="font-mono text-[5px] tracking-[0.2em] text-white/15 sm:text-[6px] sm:tracking-[0.25em]">
                      {active ? value : "WAITING"}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>

      {/* ========================================================
          MOBILE TELEMETRY
      ======================================================== */}

      <div className="absolute bottom-4 left-4 right-4 z-50 flex items-center justify-between sm:bottom-6 sm:left-6 sm:right-6 md:hidden">

        <div className="font-mono text-[5px] tracking-[0.28em] text-white/10">
          {coordinates[coordinateIndex]}
        </div>

        <div className="flex items-center gap-2">

          <span className="font-mono text-[5px] tracking-[0.25em] text-white/10">
            SIGNAL
          </span>

          <span className="h-1 w-1 animate-pulse rounded-full bg-white/40" />

        </div>

      </div>

      {/* ========================================================
          DESKTOP TELEMETRY
      ======================================================== */}

      <div className="absolute bottom-7 left-7 z-50 hidden font-mono text-[7px] tracking-[0.35em] text-white/10 md:block">

        MEMORY COORDINATES

        <br />

        <span className="text-white/20">
          10°18′N 123°53′E
        </span>

      </div>

      <div className="absolute bottom-7 right-7 z-50 hidden text-right font-mono text-[7px] tracking-[0.35em] text-white/10 md:block">

        PRESERVE WHAT MATTERS

        <br />

        <span className="text-white/20">
          EVERYTHING LEAVES A TRACE
        </span>

      </div>

      {/* ========================================================
          FINAL UNLOCK
      ======================================================== */}

      <div
        className={`
          pointer-events-none absolute inset-0 z-[80]
          flex items-center justify-center
          bg-black
          transition-opacity
          duration-[1100ms]
          ${finished ? "opacity-100" : "opacity-0"}
        `}
      >

        <div
          className={`
            px-6 text-center
            transition-all
            duration-[1400ms]
            ${
              finished
                ? "scale-100 opacity-100"
                : "scale-75 opacity-0"
            }
          `}
        >

          {/* SYMBOL */}

          <div className="mb-6 flex items-center justify-center gap-3 sm:mb-7 sm:gap-4">

            <span className="h-px w-8 bg-white/20 sm:w-12" />

            <span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_12px_rgba(255,255,255,.8)]" />

            <span className="h-px w-8 bg-white/20 sm:w-12" />

          </div>

          <div className="font-mono text-[7px] tracking-[0.65em] text-white/30 sm:text-[8px] sm:tracking-[0.8em]">
            ARCHIVE
          </div>

          <div className="mt-4 font-serif text-[2.4rem] font-light leading-none tracking-[-0.05em] sm:text-5xl md:text-6xl">
            BIRTHDAY UNIVERSE
            <span className="text-white/30">
              {" "}READY
            </span>
          </div>

          <div className="mt-5 font-mono text-[6px] tracking-[0.45em] text-white/20 sm:text-[7px] sm:tracking-[0.55em]">
            ENTERING MEMORY SPACE
          </div>

          {/* LOADING DOTS */}

          <div className="mt-7 flex justify-center gap-1.5">

            <span className="h-1 w-1 animate-pulse rounded-full bg-white/30" />

            <span
              className="h-1 w-1 animate-pulse rounded-full bg-white/50"
              style={{ animationDelay: "150ms" }}
            />

            <span
              className="h-1 w-1 animate-pulse rounded-full bg-white/70"
              style={{ animationDelay: "300ms" }}
            />

          </div>

        </div>

      </div>

      {/* ========================================================
          FINAL FLASH
      ======================================================== */}

      <div
        className={`
          pointer-events-none absolute inset-0 z-[100]
          bg-white
          transition-opacity
          duration-[1200ms]
          ${leaving ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`

        @keyframes starPulse {
          0%,
          100% {
            opacity: .06;
            transform: scale(.55);
          }

          50% {
            opacity: .75;
            transform: scale(1.45);
          }
        }

        @keyframes memoryFloat {
          0%,
          100% {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(.6);
          }

          30% {
            opacity: .25;
          }

          50% {
            opacity: .4;
            transform: translate3d(0, -14px, 0) scale(1);
          }

          75% {
            opacity: .15;
          }
        }

        @keyframes scanDown {
          0% {
            top: -5%;
            opacity: 0;
          }

          10% {
            opacity: .6;
          }

          50% {
            opacity: .12;
          }

          90% {
            opacity: .6;
          }

          100% {
            top: 105%;
            opacity: 0;
          }
        }

        @keyframes rotateClockwise {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(.72);
            opacity: .15;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.25);
            opacity: .7;
          }
        }

        @keyframes corePulseReverse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: .1;
          }

          50% {
            transform: translate(-50%, -50%) scale(.72);
            opacity: .55;
          }
        }

        @keyframes progressScan {
          from {
            transform: translateX(-120px);
          }

          to {
            transform: translateX(900px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }

      `}</style>
    </main>
  );
}