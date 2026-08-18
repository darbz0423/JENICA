import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Circle,
  Crosshair,
  Orbit,
  Radio,
  Sparkles,
} from "lucide-react";

import { birthdayData } from "../../data/birthdayData";
import ParticleCanvas from "../universe/ParticleCanvas";

const STAR_COUNT = 85;

export default function Opening({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [activated, setActivated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [signal, setSignal] = useState(98);
  const [isTouch, setIsTouch] = useState(false);

  const enterTimer = useRef(null);

  // ============================================================
  // CINEMATIC TIMELINE
  // ============================================================

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 350),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 2100),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 4300),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // ============================================================
  // MEMORY RESTORATION PROGRESS
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(timer);
          return 100;
        }

        const jump =
          current < 30
            ? 2
            : current < 70
            ? 1
            : 0.5;

        return Math.min(100, current + jump);
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // SIGNAL FLUCTUATION
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setSignal(96 + Math.floor(Math.random() * 5));
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // DEVICE DETECTION
  // ============================================================

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setIsTouch(media.matches);
    };

    update();
    media.addEventListener?.("change", update);

    return () => {
      media.removeEventListener?.("change", update);
    };
  }, []);

  // ============================================================
  // DESKTOP PARALLAX
  // ============================================================

  useEffect(() => {
    if (isTouch) return;

    let frame;

    const handleMouseMove = (event) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const x =
          (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
          (event.clientY / window.innerHeight - 0.5) * 2;

        setMouse({
          x: Math.max(-1, Math.min(1, x)),
          y: Math.max(-1, Math.min(1, y)),
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [isTouch]);

  // ============================================================
  // PROCEDURAL STARS
  // ============================================================

  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      left: `${(i * 47.173 + 8) % 100}%`,
      top: `${(i * 73.917 + 4) % 100}%`,
      size:
        i % 9 === 0
          ? 2
          : i % 3 === 0
          ? 1.4
          : 0.8,
      delay: `${(i % 15) * 0.33}s`,
      duration: `${3 + (i % 7)}s`,
      opacity: 0.12 + (i % 5) * 0.08,
    }));
  }, []);

  // ============================================================
  // MEMORY FRAGMENTS
  // ============================================================

  const fragments = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      angle: i * (360 / 14),
      distance:
        105 +
        (i % 4) * 19,
      size:
        i % 5 === 0
          ? 4
          : i % 2 === 0
          ? 2
          : 1,
      delay: `${i * -0.25}s`,
    }));
  }, []);

  // ============================================================
  // ENTER PORTAL
  // ============================================================

  const handleEnter = () => {
    if (activated) return;

    setActivated(true);
    setPhase(6);

    enterTimer.current = setTimeout(() => {
      onEnter?.();
    }, 1450);
  };

  useEffect(() => {
    return () => {
      if (enterTimer.current) {
        clearTimeout(enterTimer.current);
      }
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      className={`
        fixed inset-0 z-[90]
        overflow-hidden
        bg-[#010101]
        text-white
        transition-all
        duration-[1400ms]
        ease-[cubic-bezier(.16,1,.3,1)]
        ${
          activated
            ? "scale-[1.16] opacity-0"
            : "scale-100 opacity-100"
        }
      `}
    >
      {/* ========================================================
          PARTICLE FIELD
      ========================================================= */}

      <div
        className={`
          absolute inset-0
          transition-opacity duration-[1800ms]
          ${
            phase >= 1
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >
        <ParticleCanvas
          density={isTouch ? 65 : 130}
          speed={0.018}
        />
      </div>

      {/* ========================================================
          DEEP SPACE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[75vw]
            w-[75vw]
            max-h-[720px]
            max-w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/[0.025]
            blur-[100px]
            animate-[breathing_7s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            left-[-20%]
            top-[15%]
            h-[45vw]
            w-[45vw]
            rounded-full
            bg-white/[0.012]
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            bottom-[-15%]
            right-[-15%]
            h-[50vw]
            w-[50vw]
            rounded-full
            bg-white/[0.012]
            blur-[120px]
          "
        />
      </div>

      {/* ========================================================
          STARS
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `
                starTwinkle
                ${star.duration}
                ease-in-out
                ${star.delay}
                infinite
              `,
            }}
          />
        ))}
      </div>

      {/* ========================================================
          CONSTELLATION GRID
      ========================================================= */}

      <svg
        className={`
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          transition-all
          duration-[3000ms]
          ${
            phase >= 3
              ? "scale-100 opacity-100"
              : "scale-[1.15] opacity-0"
          }
        `}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="memoryLine"
            x1="0"
            x2="1"
          >
            <stop
              offset="0"
              stopColor="white"
              stopOpacity="0"
            />

            <stop
              offset="0.5"
              stopColor="white"
              stopOpacity=".13"
            />

            <stop
              offset="1"
              stopColor="white"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <line
          x1="5"
          y1="50"
          x2="95"
          y2="50"
          stroke="url(#memoryLine)"
          strokeWidth=".06"
        />

        <line
          x1="50"
          y1="5"
          x2="50"
          y2="95"
          stroke="url(#memoryLine)"
          strokeWidth=".06"
        />

        <circle
          cx="50"
          cy="50"
          r="31"
          fill="none"
          stroke="white"
          strokeOpacity=".025"
          strokeWidth=".08"
          strokeDasharray=".4 1"
        />

        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke="white"
          strokeOpacity=".018"
          strokeWidth=".08"
          strokeDasharray=".2 1.5"
        />
      </svg>

      {/* ========================================================
          FILM GRAIN
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[5]
          opacity-[0.045]
          mix-blend-screen
        "
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ========================================================
          SCANLINES
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[6]
          opacity-[0.018]
        "
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent 0px,transparent 5px,rgba(255,255,255,.7) 6px)",
        }}
      />

      {/* ========================================================
          CINEMATIC SCANNER
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          z-[7]
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/30
          to-transparent
          animate-[scanner_9s_linear_infinite]
        "
      />

      {/* ========================================================
          VIGNETTE
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[8]
          bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.18)_42%,rgba(0,0,0,.78)_82%,#000_100%)]
        "
      />

      {/* ========================================================
          TOP HUD
      ========================================================= */}

      <header
        className={`
          absolute
          left-0
          right-0
          top-0
          z-30
          flex
          items-start
          justify-between
          px-4
          py-5
          sm:px-6
          md:px-10
          transition-all
          duration-[1400ms]
          ${
            phase >= 1
              ? "translate-y-0 opacity-100"
              : "-translate-y-6 opacity-0"
          }
        `}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
              <span className="relative h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.8)]" />
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-white/40 sm:text-[8px]">
              MEMORY UNIVERSE
            </span>
          </div>

          <div className="mt-2 hidden font-mono text-[6px] tracking-[0.35em] text-white/15 sm:block">
            CONNECTION ESTABLISHED
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-[7px] tracking-[0.35em] text-white/25">
            ARCHIVE_001
          </div>

          <div className="mt-2 font-mono text-[6px] tracking-[0.25em] text-white/10">
            SIGNAL {signal}%
          </div>
        </div>
      </header>

      {/* ========================================================
          CORE ENGINE
      ========================================================= */}

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="
            relative
            h-[min(92vw,480px)]
            w-[min(92vw,480px)]
            sm:h-[520px]
            sm:w-[520px]
            md:h-[680px]
            md:w-[680px]
            transition-transform
            duration-700
            ease-out
          "
          style={{
            transform: `
              translate(
                ${mouse.x * -9}px,
                ${mouse.y * -9}px
              )
              rotateX(${mouse.y * -1.5}deg)
              rotateY(${mouse.x * 1.5}deg)
            `,
          }}
        >
          {/* OUTER ATMOSPHERE */}

          <div
            className={`
              absolute
              inset-0
              rounded-full
              border
              border-white/[0.025]
              ${
                phase >= 1
                  ? "scale-100 opacity-100"
                  : "scale-50 opacity-0"
              }
              transition-all
              duration-[2500ms]
            `}
          />

          {/* ORBIT 1 */}

          <div
            className={`
              absolute
              inset-[8%]
              rounded-full
              border
              border-white/[0.055]
              ${
                phase >= 1
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0"
              }
              transition-all
              duration-[2400ms]
            `}
            style={{
              animation:
                "orbit 24s linear infinite",
            }}
          />

          {/* ORBIT 2 */}

          <div
            className={`
              absolute
              inset-[17%]
              rounded-full
              border
              border-dashed
              border-white/[0.07]
              ${
                phase >= 2
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0"
              }
              transition-all
              duration-[2600ms]
            `}
            style={{
              animation:
                "orbitReverse 18s linear infinite",
            }}
          />

          {/* ORBIT 3 */}

          <div
            className={`
              absolute
              inset-[28%]
              rounded-full
              border
              border-white/[0.08]
              ${
                phase >= 2
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0"
              }
              transition-all
              duration-[2800ms]
            `}
            style={{
              animation:
                "orbit 13s linear infinite",
            }}
          />

          {/* ORBIT 4 */}

          <div
            className={`
              absolute
              inset-[39%]
              rounded-full
              border
              border-white/[0.035]
              ${
                phase >= 3
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0"
              }
              transition-all
              duration-[3000ms]
            `}
          />

          {/* ORBITING MEMORY FRAGMENTS */}

          <div
            className={`
              absolute
              inset-[8%]
              ${
                phase >= 2
                  ? "opacity-100"
                  : "opacity-0"
              }
              transition-opacity
              duration-[1800ms]
            `}
            style={{
              animation:
                "orbit 24s linear infinite",
            }}
          >
            {fragments.map((fragment) => (
              <span
                key={fragment.id}
                className="absolute left-1/2 top-1/2 rounded-full bg-white"
                style={{
                  width: `${fragment.size}px`,
                  height: `${fragment.size}px`,
                  transform: `
                    rotate(${fragment.angle}deg)
                    translateY(-${fragment.distance}px)
                  `,
                  boxShadow:
                    "0 0 12px rgba(255,255,255,.8)",
                  animation: `
                    fragmentPulse
                    2.5s
                    ease-in-out
                    ${fragment.delay}
                    infinite
                  `,
                }}
              />
            ))}
          </div>

          {/* CROSSHAIRS */}

          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.045] to-transparent" />

          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />

          {/* CORE */}

          <div
            className={`
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              ${
                phase >= 2
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0"
              }
              transition-all
              duration-[1800ms]
            `}
          >
            {/* MASSIVE AURA */}

            <div
              className="
                absolute
                -inset-28
                rounded-full
                bg-white/[0.018]
                blur-[70px]
                animate-[coreBreath_4s_ease-in-out_infinite]
              "
            />

            {/* OUTER PULSE */}

            <div
              className="
                absolute
                -inset-16
                rounded-full
                border
                border-white/[0.045]
                animate-[corePulse_3.5s_ease-in-out_infinite]
              "
            />

            {/* SECOND PULSE */}

            <div
              className="
                absolute
                -inset-9
                rounded-full
                border
                border-white/[0.1]
                animate-[corePulseReverse_2.2s_ease-in-out_infinite]
              "
            />

            {/* CORE */}

            <div
              className="
                relative
                h-3
                w-3
                rounded-full
                bg-white
                shadow-[
                  0_0_20px_5px_rgba(255,255,255,.9),
                  0_0_80px_20px_rgba(255,255,255,.3),
                  0_0_180px_40px_rgba(255,255,255,.08)
                ]
              "
            />

            {/* CORE CROSS */}

            <div className="absolute left-1/2 top-1/2 h-32 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <div className="absolute left-1/2 top-1/2 h-px w-32 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* ROTATING SYMBOL */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              animate-[orbitReverse_30s_linear_infinite]
            "
          >
            <div className="relative h-[240px] w-[240px] sm:h-[300px] sm:w-[300px]">
              <Sparkles
                className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 text-white/20"
              />

              <Circle
                className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 text-white/20"
              />

              <Crosshair
                className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 text-white/15"
              />

              <Orbit
                className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 text-white/15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN CINEMATIC MESSAGE
      ========================================================= */}

      <section
        className="
          absolute
          inset-0
          z-20
          flex
          items-center
          justify-center
          px-5
          text-center
          sm:px-8
        "
      >
        <div
          className="w-full max-w-5xl"
          style={{
            transform: `
              translate(
                ${mouse.x * 3}px,
                ${mouse.y * 3}px
              )
            `,
          }}
        >
          {/* TRANSMISSION */}

          <div
            className={`
              mb-6
              transition-all
              duration-[1400ms]
              sm:mb-8
              ${
                phase >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-7 opacity-0"
              }
            `}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-5 bg-white/15 sm:w-10" />

              <span className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/25 sm:text-[7px] sm:tracking-[0.7em]">
                TRANSMISSION RECEIVED
              </span>

              <div className="h-px w-5 bg-white/15 sm:w-10" />
            </div>
          </div>

          {/* MAIN MESSAGE */}

          <h1
            className={`
              font-serif
              text-[clamp(2.25rem,11vw,6.5rem)]
              font-light
              leading-[0.94]
              tracking-[-0.045em]
              text-white
              transition-all
              duration-[1800ms]
              ${
                phase >= 2
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-10 scale-[0.94] opacity-0"
              }
            `}
          >
            {birthdayData.intro.lines[0]}
          </h1>

          {/* COORDINATES */}

          <div
            className={`
              mt-5
              font-mono
              text-[6px]
              tracking-[0.35em]
              text-white/15
              transition-all
              duration-[1400ms]
              sm:mt-7
              sm:text-[7px]
              sm:tracking-[0.6em]
              ${
                phase >= 2
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          >
            MEMORY COORDINATES // 10°18′N 123°53′E
          </div>

          {/* DIVIDER */}

          <div className="my-6 flex items-center justify-center gap-3 sm:my-8 sm:gap-4">
            <div
              className={`
                h-px
                bg-white/15
                transition-all
                duration-[1600ms]
                ${
                  phase >= 2
                    ? "w-10 sm:w-20"
                    : "w-0"
                }
              `}
            />

            <div
              className={`
                h-1
                w-1
                rotate-45
                border
                border-white/30
                transition-all
                duration-[1600ms]
                ${
                  phase >= 2
                    ? "scale-100"
                    : "scale-0"
                }
              `}
            />

            <div
              className={`
                h-px
                bg-white/15
                transition-all
                duration-[1600ms]
                ${
                  phase >= 2
                    ? "w-10 sm:w-20"
                    : "w-0"
                }
              `}
            />
          </div>

          {/* SECOND MESSAGE */}

          <p
            className={`
              mx-auto
              max-w-3xl
              font-serif
              text-base
              italic
              leading-relaxed
              text-white/45
              transition-all
              duration-[1800ms]
              sm:text-xl
              md:text-3xl
              ${
                phase >= 3
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >
            {birthdayData.intro.lines[1]}
          </p>

          {/* ====================================================
              ENTER PORTAL
          ==================================================== */}

          <div
            className={`
              mt-10
              transition-all
              duration-[1500ms]
              sm:mt-14
              ${
                phase >= 5
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-8 opacity-0"
              }
            `}
          >
            <button
              type="button"
              onClick={handleEnter}
              disabled={activated}
              aria-label="Enter the Memory Universe"
              className="
                group
                relative
                mx-auto
                flex
                min-h-[54px]
                items-center
                justify-center
                gap-4
                overflow-hidden
                border
                border-white/15
                bg-black/40
                px-7
                py-4
                backdrop-blur-xl
                transition-all
                duration-500
                active:scale-[0.96]
                hover:border-white
                hover:bg-white
                hover:text-black
                sm:px-10
                sm:py-5
              "
            >
              {/* SWEEP */}

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-white
                  transition-transform
                  duration-700
                  group-hover:translate-x-0
                "
              />

              {/* GLOW */}

              <span
                className="
                  absolute
                  -inset-12
                  -z-10
                  rounded-full
                  bg-white/10
                  opacity-0
                  blur-3xl
                  transition-opacity
                  duration-700
                  group-hover:opacity-100
                "
              />

              <span className="relative z-10 font-mono text-[8px] uppercase tracking-[0.38em] sm:text-[9px] sm:tracking-[0.45em]">
                Enter the Universe
              </span>

              <ArrowRight
                size={14}
                className="
                  relative
                  z-10
                  transition-transform
                  duration-500
                  group-hover:translate-x-2
                "
              />
            </button>

            <div className="mt-4 font-mono text-[6px] uppercase tracking-[0.5em] text-white/15 sm:text-[7px]">
              ACCESS MEMORY ARCHIVE
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MOBILE TELEMETRY
      ========================================================= */}

      <div
        className={`
          absolute
          bottom-20
          left-4
          right-4
          z-30
          flex
          items-center
          justify-center
          gap-5
          transition-all
          duration-[1600ms]
          sm:hidden
          ${
            phase >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          }
        `}
      >
        <div className="flex items-center gap-2 font-mono text-[6px] tracking-[0.25em] text-white/20">
          <Radio size={9} />
          SIGNAL {signal}%
        </div>

        <div className="h-2 w-px bg-white/10" />

        <div className="font-mono text-[6px] tracking-[0.25em] text-white/20">
          ARCHIVE {Math.round(progress)}%
        </div>

        <div className="h-2 w-px bg-white/10" />

        <div className="font-mono text-[6px] tracking-[0.25em] text-white/20">
          001 / ∞
        </div>
      </div>

      {/* ========================================================
          DESKTOP LEFT TELEMETRY
      ========================================================= */}

      <aside
        className={`
          absolute
          left-6
          top-1/2
          z-30
          hidden
          -translate-y-1/2
          transition-all
          duration-[1800ms]
          md:block
          ${
            phase >= 3
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          }
        `}
      >
        <div className="space-y-7 font-mono">
          <Telemetry
            label="SIGNAL"
            value={`● ${signal}%`}
          />

          <Telemetry
            label="MEMORY"
            value="001 / ∞"
          />

          <Telemetry
            label="RESTORATION"
            value={`${Math.round(progress)}%`}
          />
        </div>
      </aside>

      {/* ========================================================
          DESKTOP RIGHT MESSAGE
      ========================================================= */}

      <aside
        className={`
          absolute
          right-6
          top-1/2
          z-30
          hidden
          -translate-y-1/2
          flex-col
          items-center
          gap-5
          transition-all
          duration-[1800ms]
          md:flex
          ${
            phase >= 3
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }
        `}
      >
        <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <span className="[writing-mode:vertical-rl] font-mono text-[7px] tracking-[0.55em] text-white/20">
          EVERYTHING IMPORTANT LEAVES A TRACE
        </span>

        <div className="h-24 w-px bg-gradient-to-t from-transparent via-white/20 to-transparent" />
      </aside>

      {/* ========================================================
          BOTTOM BRAND
      ========================================================= */}

      <footer className="absolute bottom-5 left-0 right-0 z-30 flex flex-col items-center">
        <ChevronDown
          size={13}
          className={`
            mb-3
            text-white/20
            transition-all
            duration-1000
            ${
              phase >= 5
                ? "animate-bounce opacity-100"
                : "opacity-0"
            }
          `}
        />

        <span className="font-mono text-[6px] uppercase tracking-[0.55em] text-white/15 sm:text-[7px] sm:tracking-[0.7em]">
          ✦ MEMORY UNIVERSE ✦
        </span>
      </footer>

      {/* ========================================================
          ENTER FLASH
      ========================================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-[200]
          bg-white
          transition-opacity
          duration-[700ms]
          ${
            activated
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* ========================================================
          PORTAL EXPLOSION
      ========================================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-[190]
          h-10
          w-10
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-white
          transition-all
          duration-[1300ms]
          ease-[cubic-bezier(.16,1,.3,1)]
          ${
            activated
              ? "scale-[80] opacity-0"
              : "scale-100 opacity-0"
          }
        `}
      />

      {/* ========================================================
          FINAL BLACK SHUTTER
      ========================================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-[210]
          bg-black
          transition-opacity
          duration-[1400ms]
          ${
            activated
              ? "opacity-70"
              : "opacity-0"
          }
        `}
      />

      {/* ========================================================
          ANIMATIONS
      ========================================================= */}

      <style>{`
        @keyframes starTwinkle {
          0%,
          100% {
            opacity: .08;
            transform: scale(.65);
          }

          50% {
            opacity: .9;
            transform: scale(1.6);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fragmentPulse {
          0%,
          100% {
            opacity: .25;
            scale: .7;
          }

          50% {
            opacity: 1;
            scale: 1.6;
          }
        }

        @keyframes coreBreath {
          0%,
          100% {
            transform: scale(.75);
            opacity: .3;
          }

          50% {
            transform: scale(1.2);
            opacity: .75;
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: scale(.65);
            opacity: .1;
          }

          50% {
            transform: scale(1.35);
            opacity: .75;
          }
        }

        @keyframes corePulseReverse {
          0%,
          100% {
            transform: scale(1.2);
            opacity: .1;
          }

          50% {
            transform: scale(.7);
            opacity: .65;
          }
        }

        @keyframes breathing {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(.85);
            opacity: .3;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: .8;
          }
        }

        @keyframes scanner {
          0% {
            transform: translateY(-10vh);
            opacity: 0;
          }

          10% {
            opacity: .5;
          }

          50% {
            opacity: .15;
          }

          90% {
            opacity: .5;
          }

          100% {
            transform: translateY(110vh);
            opacity: 0;
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

function Telemetry({ label, value }) {
  return (
    <div>
      <div className="text-[7px] tracking-[0.4em] text-white/15">
        {label}
      </div>

      <div className="mt-1 font-mono text-[8px] tracking-[0.3em] text-white/40">
        {value}
      </div>
    </div>
  );
}