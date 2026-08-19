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

  const mainRef = useRef(null);
  const completeCalled = useRef(false);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // STAR FIELD
  // ============================================================

  const stars = useMemo(() => {
    const count = isMobile ? 42 : 85;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${(i * 47.31) % 100}%`,
      y: `${(i * 73.17) % 100}%`,
      size: 0.6 + (i % 3) * 0.4,
      delay: `${(i % 12) * 0.4}s`,
      duration: `${3 + (i % 5) * 0.8}s`,
    }));
  }, [isMobile]);

  // ============================================================
  // MEMORY PARTICLES
  // ============================================================

  const memoryParticles = useMemo(() => {
    const count = isMobile ? 8 : 18;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${10 + ((i * 37.2) % 80)}%`,
      y: `${14 + ((i * 51.4) % 72)}%`,
      delay: `${(i % 8) * 0.6}s`,
      duration: `${5 + (i % 4)}s`,
      size: `${1 + (i % 2)}px`,
    }));
  }, [isMobile]);

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
  // DESKTOP PARALLAX
  // ============================================================

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const element = mainRef.current;

    if (!element) return;

    let frame = null;

    const handlePointer = (event) => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        const x =
          (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
          (event.clientY / window.innerHeight - 0.5) * 2;

        element.style.setProperty(
          "--pointer-x",
          `${Math.max(-1, Math.min(1, x)) * -7}px`
        );

        element.style.setProperty(
          "--pointer-y",
          `${Math.max(-1, Math.min(1, y)) * -7}px`
        );

        frame = null;
      });
    };

    window.addEventListener("pointermove", handlePointer, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointer);

      if (frame) cancelAnimationFrame(frame);
    };
  }, [isMobile, reducedMotion]);

  // ============================================================
  // BOOT SEQUENCE
  // ============================================================

  useEffect(() => {
    let timeout;
    let finishTimeout;
    let leaveTimeout;
    let completeTimeout;

    const advance = (current) => {
      if (current >= messages.length - 1) {
        setIndex(messages.length - 1);
        setProgress(100);

        finishTimeout = setTimeout(() => {
          setFinished(true);
        }, 850);

        leaveTimeout = setTimeout(() => {
          setLeaving(true);

          completeTimeout = setTimeout(() => {
            if (!completeCalled.current) {
              completeCalled.current = true;
              onComplete?.();
            }
          }, 1300);
        }, 2800);

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
        reducedMotion
          ? 350
          : 560 + Math.random() * 300
      );
    };

    timeout = setTimeout(
      () => advance(0),
      reducedMotion ? 150 : 700
    );

    return () => {
      clearTimeout(timeout);
      clearTimeout(finishTimeout);
      clearTimeout(leaveTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, reducedMotion]);

  // ============================================================
  // GLITCH
  // ============================================================

  useEffect(() => {
    if (reducedMotion) return;

    const trigger = () => {
      setGlitch(true);

      const timeout = setTimeout(() => {
        setGlitch(false);
      }, isMobile ? 70 : 110);

      return timeout;
    };

    const interval = setInterval(
      trigger,
      isMobile
        ? 4200 + Math.random() * 3500
        : 2600 + Math.random() * 3200
    );

    return () => clearInterval(interval);
  }, [isMobile, reducedMotion]);

  // ============================================================
  // CORE PULSE
  // ============================================================

  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setPulse(true);

      const timeout = setTimeout(() => {
        setPulse(false);
      }, 600);

      return () => clearTimeout(timeout);
    }, 2100);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // ============================================================
  // MEMORY FRAGMENTS
  // ============================================================

  useEffect(() => {
    if (index < 2 || reducedMotion) return;

    let hideTimer;

    const interval = setInterval(() => {
      const random =
        fragments[
          Math.floor(Math.random() * fragments.length)
        ];

      setFragment(random);

      hideTimer = setTimeout(() => {
        setFragment("");
      }, 1600);
    }, isMobile ? 3600 : 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [index, isMobile, reducedMotion]);

  // ============================================================
  // COORDINATES
  // ============================================================

  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setCoordinateIndex(
        (value) =>
          (value + 1) % coordinates.length
      );
    }, isMobile ? 2600 : 1900);

    return () => clearInterval(interval);
  }, [isMobile, reducedMotion]);

  const archiveNumber = String(
    Math.floor(progress * 37.21)
  ).padStart(4, "0");

  const systemTime = String(time).padStart(4, "0");

  return (
    <main
      className={`
        fixed inset-0 z-[100]
        overflow-hidden
        bg-[#020202]
        text-white
        transition-all
        duration-[1400ms]
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          leaving
            ? "scale-[1.12] opacity-0"
            : "scale-100 opacity-100"
        }
      `}
    >

      {/* ========================================================
          UNIVERSE
      ======================================================== */}

      <ParticleCanvas
        density={isMobile ? 22 : 90}
        speed={isMobile ? 0.006 : 0.012}
      />

      {/* ========================================================
          ATMOSPHERE
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.085),transparent_15%,rgba(0,0,0,.7)_58%,#000_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.025),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.02),transparent_25%)]" />

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
              animation: reducedMotion
                ? "none"
                : `starPulse ${star.duration} ease-in-out ${star.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ========================================================
          MEMORY DUST
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {memoryParticles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              animation: reducedMotion
                ? "none"
                : `memoryFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ========================================================
          CINEMATIC LIGHT
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[260px]
          w-[260px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.035]
          blur-[60px]
          sm:h-[420px]
          sm:w-[420px]
          sm:blur-[90px]
        "
      />

      {/* ========================================================
          SCANNER
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          z-30
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/30
          to-transparent
        "
        style={{
          animation: reducedMotion
            ? "none"
            : "scanDown 7s linear infinite",
        }}
      />

      {/* ========================================================
          VIGNETTE
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle,transparent_10%,rgba(0,0,0,.28)_48%,rgba(0,0,0,.96)_100%)]" />

      {/* ========================================================
          GLITCH FLASH
      ======================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-[90]
          bg-white
          mix-blend-screen
          transition-opacity
          duration-75
          ${
            glitch
              ? "opacity-[0.035]"
              : "opacity-0"
          }
        `}
      />

      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <header className="absolute left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 md:px-10">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2.5">

            <div className="relative h-1.5 w-1.5 sm:h-2 sm:w-2">

              <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />

              <span className="absolute inset-0 rounded-full bg-white" />

            </div>

            <span className="font-mono text-[7px] tracking-[0.42em] text-white/35 sm:text-[8px] sm:tracking-[0.6em]">
              MEMORY ARCHIVE
            </span>

          </div>

          <div className="hidden font-mono text-[7px] tracking-[0.6em] text-white/[0.08] md:block">
            TEMPORAL MEMORY SYSTEM
          </div>

          <div className="text-right">

            <div className="font-mono text-[7px] tracking-[0.3em] text-white/25 sm:text-[8px]">
              ARCHIVE_07
            </div>

            <div className="mt-1 hidden font-mono text-[6px] tracking-[0.25em] text-white/10 sm:block">
              {systemTime}
            </div>

          </div>

        </div>

        <div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 via-white/[0.02] to-transparent sm:hidden" />

      </header>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <div className="relative z-10 flex h-full items-center justify-center px-4 pb-8 pt-16 sm:px-6 sm:pt-20">

        <div
          ref={mainRef}
          className="relative w-full max-w-6xl"
          style={{
            transform:
              "translate3d(var(--pointer-x,0px),var(--pointer-y,0px),0)",
            willChange: isMobile
              ? "auto"
              : "transform",
          }}
        >

          {/* ====================================================
              MEMORY PORTAL
          ==================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[44%]
              h-[300px]
              w-[300px]
              -translate-x-1/2
              -translate-y-1/2
              sm:top-1/2
              sm:h-[470px]
              sm:w-[470px]
              md:h-[590px]
              md:w-[590px]
            "
          >

            {/* OUTER ORBIT */}

            <div
              className="absolute inset-0 rounded-full border border-white/[0.025]"
              style={{
                animation: reducedMotion
                  ? "none"
                  : "rotateClockwise 42s linear infinite",
              }}
            />

            {/* SECOND ORBIT */}

            <div
              className="absolute inset-[8%] rounded-full border border-dashed border-white/[0.045]"
              style={{
                animation: reducedMotion
                  ? "none"
                  : "rotateReverse 27s linear infinite",
              }}
            />

            {/* THIRD ORBIT */}

            <div
              className="absolute inset-[19%] rounded-full border border-white/[0.05]"
              style={{
                animation: reducedMotion
                  ? "none"
                  : "rotateClockwise 18s linear infinite",
              }}
            />

            {/* INNER ORBIT */}

            <div className="absolute inset-[32%] rounded-full border border-white/[0.08]" />

            {/* DIAGONAL RING */}

            <div
              className="absolute inset-[26%] rounded-full border border-white/[0.025]"
              style={{
                transform: "rotate(35deg) scaleY(.38)",
              }}
            />

            {/* ORBIT DOTS */}

            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute left-1/2 top-0 h-1 w-1 rounded-full bg-white/70"
                style={{
                  transform: `
                    rotate(${i * 90}deg)
                    translateY(-3px)
                  `,
                  transformOrigin:
                    "0 150px",
                  boxShadow:
                    "0 0 10px rgba(255,255,255,.8)",
                }}
              />
            ))}

            {/* CROSSHAIR */}

            <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.035] to-transparent" />

            <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent" />

            {/* CORE AURA */}

            <div
              className={`
                absolute
                left-1/2
                top-1/2
                h-20
                w-20
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/[0.025]
                blur-xl
                transition-transform
                duration-700
                ${
                  pulse
                    ? "scale-[2.4]"
                    : "scale-100"
                }
              `}
            />

            {/* CORE RING */}

            <div
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
              style={{
                animation: reducedMotion
                  ? "none"
                  : "corePulse 3s ease-in-out infinite",
              }}
            />

            {/* CORE */}

            <div
              className={`
                absolute
                left-1/2
                top-1/2
                h-3
                w-3
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white
                transition-transform
                duration-500
                sm:h-4
                sm:w-4
                ${
                  pulse
                    ? "scale-[1.8]"
                    : "scale-100"
                }
              `}
              style={{
                boxShadow:
                  "0 0 18px 6px rgba(255,255,255,.7), 0 0 80px 25px rgba(255,255,255,.12)",
              }}
            />

          </div>

          {/* ====================================================
              TITLE
          ==================================================== */}

          <div
            className={`
              relative
              z-20
              mb-5
              text-center
              transition-all
              duration-[1200ms]
              sm:mb-7
              ${
                index >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }
            `}
          >

            <div className="mb-3 flex items-center justify-center gap-2.5 sm:mb-4 sm:gap-3">

              <span className="h-px w-6 bg-white/10 sm:w-10" />

              <span className="font-mono text-[6px] tracking-[0.48em] text-white/25 sm:text-[7px] sm:tracking-[0.65em]">
                ARCHIVE INITIALIZATION
              </span>

              <span className="h-px w-6 bg-white/10 sm:w-10" />

            </div>

            <h1
              className={`
                font-serif
                text-[clamp(2.3rem,12vw,5.3rem)]
                font-light
                leading-[.88]
                tracking-[-0.065em]
                ${
                  glitch
                    ? "translate-x-[2px] skew-x-2"
                    : ""
                }
              `}
            >
              MEMORY
              <span className="text-white/[0.22]">
                {" "}UNIVERSE
              </span>
            </h1>

            <div className="mt-3 font-mono text-[6px] tracking-[0.42em] text-white/10 sm:mt-4 sm:text-[7px]">
              TEMPORAL ARCHIVE // {archiveNumber}
            </div>

          </div>

          {/* ====================================================
              CONSOLE
          ==================================================== */}

          <div
            className={`
              relative
              z-30
              mx-auto
              w-full
              max-w-3xl
              overflow-hidden
              border
              border-white/[0.08]
              bg-black/50
              p-4
              transition-all
              duration-[1300ms]
              sm:p-6
              md:p-9
              ${
                isMobile
                  ? ""
                  : "backdrop-blur-xl"
              }
              ${
                index >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-7 opacity-0"
              }
            `}
          >

            {/* TOP LIGHT */}

            <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* CORNERS */}

            <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-white/40 sm:h-4 sm:w-4" />

            <div className="absolute right-0 top-0 h-3 w-3 border-r border-t border-white/40 sm:h-4 sm:w-4" />

            <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/40 sm:h-4 sm:w-4" />

            <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/40 sm:h-4 sm:w-4" />

            {/* HEADER */}

            <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-3 sm:mb-7 sm:pb-4">

              <div className="flex items-center gap-2">

                <span className="h-1 w-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,.6)]" />

                <span className="font-mono text-[6px] tracking-[0.3em] text-white/25 sm:text-[7px]">
                  SYSTEM
                </span>

                <span className="font-mono text-[6px] text-white/10">
                  /
                </span>

                <span className="font-mono text-[6px] tracking-[0.28em] text-white/35 sm:text-[7px]">
                  BOOT_SEQUENCE
                </span>

              </div>

              <span className="font-mono text-[7px] tracking-[0.3em] text-white/30 sm:text-[8px]">
                {String(progress).padStart(3, "0")}%
              </span>

            </div>

            {/* LOGS */}

            <div className="min-h-[204px] space-y-3 sm:min-h-[250px] sm:space-y-4">

              {messages.map((message, i) => {

                const active = i === index;
                const complete = i < index;
                const hidden = i > index;

                return (
                  <div
                    key={message}
                    className={`
                      flex
                      items-center
                      gap-2
                      font-mono
                      text-[7px]
                      leading-relaxed
                      tracking-[0.11em]
                      transition-all
                      duration-500
                      sm:gap-4
                      sm:text-[10px]
                      sm:tracking-[0.2em]
                      ${
                        hidden
                          ? "translate-x-3 opacity-0"
                          : "translate-x-0 opacity-100"
                      }
                    `}
                  >

                    <div className="flex w-3 shrink-0 justify-center sm:w-5">

                      {complete && (
                        <span className="text-white/25">
                          ✓
                        </span>
                      )}

                      {active && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.8)]" />
                      )}

                    </div>

                    <span className="hidden shrink-0 text-white/[0.08] sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`
                        min-w-0
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

                    {active && (
                      <span className="h-3 w-px shrink-0 animate-pulse bg-white" />
                    )}

                  </div>
                );
              })}

            </div>

            {/* PROGRESS */}

            <div className="mt-6 sm:mt-8">

              <div className="mb-2.5 flex items-center justify-between">

                <span className="font-mono text-[6px] tracking-[0.3em] text-white/15 sm:text-[7px]">
                  MEMORY RESTORATION
                </span>

                <span className="font-mono text-[6px] tracking-[0.25em] text-white/25 sm:text-[7px]">
                  {String(progress).padStart(3, "0")}%
                </span>

              </div>

              <div className="relative h-[2px] overflow-hidden bg-white/[0.07]">

                <div
                  className="absolute inset-y-0 left-0 bg-white transition-[width] duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />

                {!reducedMotion && (
                  <div
                    className="
                      absolute
                      inset-y-0
                      w-16
                      bg-gradient-to-r
                      from-transparent
                      via-white/60
                      to-transparent
                    "
                    style={{
                      animation:
                        "progressScan 1.7s linear infinite",
                    }}
                  />
                )}

              </div>

            </div>

          </div>

          {/* ====================================================
              MEMORY FRAGMENT
          ==================================================== */}

          <div
            className={`
              relative
              z-30
              mx-auto
              mt-4
              h-4
              max-w-3xl
              text-center
              font-mono
              text-[6px]
              tracking-[0.4em]
              text-white/20
              transition-opacity
              duration-500
              sm:mt-5
              sm:text-[7px]
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

          <div className="relative z-30 mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-1.5 sm:mt-5 sm:grid-cols-4 sm:gap-2">

            {systems.map(([name, value], i) => {

              const active = index > i;

              return (
                <div
                  key={name}
                  className={`
                    border
                    px-2.5
                    py-2.5
                    transition-all
                    duration-700
                    sm:px-3
                    sm:py-3
                    ${
                      active
                        ? "border-white/[0.1] bg-white/[0.018]"
                        : "border-white/[0.045] bg-white/[0.004]"
                    }
                  `}
                >

                  <div className="font-mono text-[5px] tracking-[0.25em] text-white/10 sm:text-[6px]">
                    MODULE {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="mt-1.5 font-mono text-[6px] tracking-[0.14em] text-white/30 sm:text-[7px]">
                    {name}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">

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

                    <span className="font-mono text-[5px] tracking-[0.2em] text-white/15 sm:text-[6px]">
                      {active
                        ? value
                        : "WAITING"}
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
          pointer-events-none
          absolute
          inset-0
          z-[80]
          flex
          items-center
          justify-center
          bg-black
          transition-opacity
          duration-[1000ms]
          ${
            finished
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >

        <div
          className={`
            px-6
            text-center
            transition-all
            duration-[1200ms]
            ${
              finished
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0"
            }
          `}
        >

          <div className="mb-7 flex items-center justify-center gap-3">

            <span className="h-px w-8 bg-white/20 sm:w-14" />

            <span className="h-1.5 w-1.5 rotate-45 bg-white shadow-[0_0_14px_rgba(255,255,255,.8)]" />

            <span className="h-px w-8 bg-white/20 sm:w-14" />

          </div>

          <div className="font-mono text-[7px] tracking-[0.7em] text-white/30 sm:text-[8px]">
            ARCHIVE
          </div>

          <div className="mt-4 font-serif text-[2.45rem] font-light leading-[.9] tracking-[-0.055em] sm:text-5xl md:text-6xl">
            BIRTHDAY
            <br className="sm:hidden" />
            {" "}UNIVERSE
            <span className="text-white/25">
              {" "}READY
            </span>
          </div>

          <div className="mt-5 font-mono text-[6px] tracking-[0.5em] text-white/20 sm:text-[7px]">
            ENTERING MEMORY SPACE
          </div>

          <div className="mt-7 flex justify-center gap-1.5">

            <span className="h-1 w-1 animate-pulse rounded-full bg-white/30" />

            <span
              className="h-1 w-1 animate-pulse rounded-full bg-white/50"
              style={{
                animationDelay: "150ms",
              }}
            />

            <span
              className="h-1 w-1 animate-pulse rounded-full bg-white/70"
              style={{
                animationDelay: "300ms",
              }}
            />

          </div>

        </div>

      </div>

      {/* ========================================================
          FINAL FLASH
      ======================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-[100]
          bg-white
          transition-opacity
          duration-[1100ms]
          ${
            leaving
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`

        @keyframes starPulse {
          0%,
          100% {
            opacity: .05;
            transform: scale(.55);
          }

          50% {
            opacity: .7;
            transform: scale(1.3);
          }
        }

        @keyframes memoryFloat {
          0%,
          100% {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }

          35% {
            opacity: .25;
          }

          55% {
            opacity: .45;
            transform: translate3d(0, -12px, 0);
          }

          80% {
            opacity: .1;
          }
        }

        @keyframes scanDown {
          0% {
            top: -5%;
            opacity: 0;
          }

          12% {
            opacity: .45;
          }

          50% {
            opacity: .08;
          }

          90% {
            opacity: .35;
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
            transform:
              translate(-50%, -50%)
              scale(.7);
            opacity: .15;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.3);
            opacity: .65;
          }
        }

        @keyframes progressScan {
          from {
            transform: translate3d(-100px, 0, 0);
          }

          to {
            transform: translate3d(850px, 0, 0);
          }
        }

        @media (max-width: 767px) {

          /*
           * MOBILE PERFORMANCE
           *
           * Avoid expensive backdrop filters and huge shadows.
           */

          body {
            overscroll-behavior: none;
          }

          * {
            -webkit-tap-highlight-color: transparent;
          }
        }

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }

        }

      `}</style>
    </main>
  );
}