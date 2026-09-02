import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper,
  Sparkles,
  Orbit,
  Heart,
  ArrowRight,
  Stars,
  Rocket,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

export default function Celebration() {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5);
  const [started, setStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const celebrationStarted = countdown <= 0;

  // ==========================================================
  // DEVICE DETECTION
  // ==========================================================

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");

    const updateDevice = () => {
      setIsMobile(media.matches);
    };

    updateDevice();

    media.addEventListener("change", updateDevice);

    return () => {
      media.removeEventListener("change", updateDevice);
    };
  }, []);

  // ==========================================================
  // STABLE RANDOM GENERATOR
  // ==========================================================

  const random = (seed) => {
    const value = Math.sin(seed * 9999.91) * 10000;
    return value - Math.floor(value);
  };

  // ==========================================================
  // STARS — REDUCED FOR PERFORMANCE
  // ==========================================================

  const stars = useMemo(() => {
    const total = isMobile ? 10 : 24;

    return Array.from({ length: total }, (_, index) => ({
      id: index,
      left: 3 + random(index * 11 + 2) * 94,
      top: 4 + random(index * 17 + 7) * 90,
      size: 1 + random(index * 31 + 3) * 1.8,
      delay: random(index * 13 + 9) * 4,
      duration: 4 + random(index * 23 + 4) * 5,
      opacity: 0.2 + random(index * 19 + 8) * 0.5,
    }));
  }, [isMobile]);

  // ==========================================================
  // CONFETTI — REDUCED FOR PERFORMANCE
  // ==========================================================

  const confetti = useMemo(() => {
    const total = isMobile ? 16 : 40;

    return Array.from({ length: total }, (_, index) => ({
      id: index,
      left: random(index * 5 + 2) * 100,
      delay: random(index * 7 + 4) * 0.8,
      duration: 2.8 + random(index * 11 + 8) * 1.5,
      size: 3 + random(index * 17 + 5) * 3,
      rotation: random(index * 23 + 7) * 360,
      drift: -50 + random(index * 29 + 3) * 100,
      type: index % 4,
    }));
  }, [isMobile]);

  // ==========================================================
  // COUNTDOWN
  // ==========================================================

  useEffect(() => {
    if (!started || countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [started, countdown]);

  // ==========================================================
  // START
  // ==========================================================

  const handleStart = () => {
    setStarted(true);

    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  // ==========================================================
  // FINALE
  // ==========================================================

  const handleFinale = () => {
    if (navigator.vibrate) {
      navigator.vibrate([20, 40, 20]);
    }

    navigate("/finale");
  };

  return (
    <main className="celebration-page relative min-h-[100svh] overflow-hidden bg-[#020202] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#020202]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#151515_0%,#080808_42%,#020202_82%)]" />

        <div
          className={`aurora-layer ${
            celebrationStarted ? "aurora-active" : ""
          }`}
        />

        <div
          className={`energy-horizon ${
            celebrationStarted ? "energy-active" : ""
          }`}
        />

        <div
          className={`central-light ${
            celebrationStarted ? "central-light-active" : ""
          }`}
        />

        <div className="ambient-glow ambient-left" />
        <div className="ambient-glow ambient-right" />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.28)_65%,rgba(0,0,0,.88)_100%)]" />
      </div>

      {/* =====================================================
          STARS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <span
            key={star.id}
            className="cosmic-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          ORBITAL SYSTEM
      ====================================================== */}

      <div
        className={`orbital-system pointer-events-none absolute left-1/2 top-1/2
        h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2
        sm:h-[500px] sm:w-[500px]
        md:h-[650px] md:w-[650px]
        ${
          celebrationStarted
            ? "orbital-system-hidden"
            : "orbital-system-visible"
        }`}
      >
        <div className="absolute inset-0 rounded-full border border-white/[0.04]" />

        <div className="orbit-one absolute inset-[10%] rounded-full border border-dashed border-white/[0.045]" />

        <div className="orbit-two absolute inset-[23%] rounded-full border border-white/[0.035]" />

        <div className="absolute inset-[37%] rounded-full border border-white/[0.03]" />

        <span className="orbit-dot orbit-dot-top" />
        <span className="orbit-dot orbit-dot-right" />
        <span className="orbit-dot orbit-dot-bottom" />
        <span className="orbit-dot orbit-dot-left" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
            <Sparkles
              size={11}
              strokeWidth={1}
              className="text-white/50"
            />
          </div>

          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.55em] text-white/35">
              MEMORY UNIVERSE
            </p>

            <p className="mt-1 font-mono text-[5px] tracking-[0.35em] text-white/15">
              FINAL CELEBRATION
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="font-mono text-[6px] uppercase tracking-[0.5em] text-white/20">
            08.17.2026
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </header>

      {/* =====================================================
          CELEBRATION EFFECTS
      ====================================================== */}

      {celebrationStarted && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="celebration-ring ring-a" />
          <div className="celebration-ring ring-b" />

          {!isMobile && <div className="celebration-ring ring-c" />}

          <div className="celebration-core" />

          {!isMobile && (
            <>
              <div className="shockwave shockwave-a" />
              <div className="shockwave shockwave-b" />
            </>
          )}

          <span className="burst-particle p1" />
          <span className="burst-particle p2" />
          <span className="burst-particle p3" />
          <span className="burst-particle p4" />
          <span className="burst-particle p5" />
          <span className="burst-particle p6" />

          <div className="absolute inset-0">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={`confetti confetti-${piece.type}`}
                style={{
                  left: `${piece.left}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size * 1.5}px`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  "--drift": `${piece.drift}px`,
                  "--rotation": `${piece.rotation}deg`,
                }}
              />
            ))}
          </div>

          {!isMobile && (
            <>
              <Stars className="floating-sparkle sparkle-1" />
              <Stars className="floating-sparkle sparkle-2" />
              <Stars className="floating-sparkle sparkle-3" />
            </>
          )}
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="relative z-20 flex min-h-[100svh] items-center justify-center px-5 pb-24 pt-24">
        <div className="w-full max-w-5xl text-center">
          {/* =================================================
              INTRO
          ================================================= */}

          {!started && (
            <div className="animate-intro">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/[0.07]" />

                <div className="absolute inset-2 rounded-full border border-dashed border-white/[0.08]" />

                <div className="absolute inset-5 rounded-full bg-white/[0.025]" />

                <PartyPopper
                  size={23}
                  strokeWidth={1}
                  className="relative text-white/65"
                />

                <Sparkles
                  size={9}
                  className="absolute right-0 top-1 text-white/60"
                />
              </div>

              <p className="mt-8 font-mono text-[6px] uppercase tracking-[0.65em] text-white/30 sm:text-[7px]">
                FINAL SEQUENCE // 001
              </p>

              <h1 className="mt-6 font-display text-[4.5rem] leading-[0.78] tracking-[-0.065em] text-white sm:text-8xl md:text-[10rem]">
                READY
                <span className="text-white/15">?</span>
              </h1>

              <div className="mx-auto mt-7 h-px w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <p className="mx-auto mt-7 max-w-xs font-serif text-sm leading-[1.8] text-white/35 sm:max-w-sm sm:text-base">
                Every memory led here.
                <br />

                <span className="text-white/60">
                  One final moment remains.
                </span>
              </p>

              <button
                type="button"
                onClick={handleStart}
                className="group relative mx-auto mt-9 flex min-h-14 items-center justify-center overflow-hidden rounded-full border border-white/[0.14] bg-white/[0.035] px-7 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07] active:scale-[0.96] sm:px-9"
              >
                <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em] text-white/65">
                  ENTER THE MOMENT

                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </button>

              <div className="mt-7 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-white/[0.08]" />

                <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/15">
                  TAP TO BEGIN
                </span>

                <span className="h-px w-8 bg-white/[0.08]" />
              </div>
            </div>
          )}

          {/* =================================================
              COUNTDOWN
          ================================================= */}

          {started && !celebrationStarted && (
            <div className="animate-countdown">
              <p className="font-mono text-[6px] uppercase tracking-[0.65em] text-white/25 sm:text-[7px]">
                LIGHTING THE MEMORY UNIVERSE
              </p>

              <div className="relative mx-auto mt-7 h-[230px] w-[230px] sm:h-[340px] sm:w-[340px]">
                <div className="absolute inset-0 rounded-full border border-white/[0.07]" />

                <div className="absolute inset-[11%] rounded-full border border-dashed border-white/[0.065]" />

                <div className="absolute inset-[23%] rounded-full border border-white/[0.045]" />

                <div className="absolute inset-[35%] rounded-full border border-white/[0.035]" />

                {!isMobile && (
                  <div className="countdown-orbit absolute inset-[11%]">
                    <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.6)]" />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    key={countdown}
                    className="countdown-number font-display text-[9rem] leading-none tracking-[-0.08em] text-white sm:text-[13rem]"
                  >
                    {countdown}
                  </span>
                </div>

                {!isMobile && (
                  <Orbit
                    size={13}
                    strokeWidth={1}
                    className="absolute left-1/2 top-[-7px] -translate-x-1/2 text-white/30"
                  />
                )}
              </div>

              <p className="mt-3 font-serif text-sm italic text-white/25">
                {countdown === 5 && "Remember this moment."}
                {countdown === 4 && "The universe is waking."}
                {countdown === 3 && "Everything is aligning."}
                {countdown === 2 && "Take one breath."}
                {countdown === 1 && "Here we go."}
              </p>
            </div>
          )}

          {/* =================================================
              FINAL CELEBRATION
          ================================================= */}

          {celebrationStarted && (
            <div className="animate-final">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/[0.035]" />

                <div className="absolute inset-2 rounded-full border border-white/[0.1]" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-black sm:h-14 sm:w-14">
                  <Sparkles size={19} strokeWidth={1.2} />
                </div>
              </div>

              <p className="mt-8 font-mono text-[6px] uppercase tracking-[0.65em] text-white/40 sm:text-[7px]">
                THE MEMORY UNIVERSE IS CELEBRATING
              </p>

              <h1 className="birthday-title mt-7 font-display text-[4.3rem] leading-[0.73] tracking-[-0.075em] text-white sm:text-[7rem] md:text-[10rem]">
                HAPPY

                <br />

                <span className="relative">
                  BIRTHDAY

                  <span className="absolute -right-4 -top-5 text-lg text-white/30 sm:-right-7 sm:-top-7 sm:text-3xl">
                    ✦
                  </span>
                </span>
              </h1>

              <div className="mt-10 flex items-center justify-center gap-3 sm:mt-12 sm:gap-5">
                <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/25 sm:w-16" />

                <p className="font-serif text-3xl italic text-white/80 sm:text-5xl md:text-6xl">
                  {birthdayData.name}
                </p>

                <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/25 sm:w-16" />
              </div>

              <p className="mx-auto mt-9 max-w-xl px-2 font-serif text-[15px] leading-[1.9] text-white/45 sm:mt-10 sm:text-lg md:text-xl">
                May the next chapter bring you moments

                <br className="hidden sm:block" />

                worth remembering, people worth keeping,

                <br className="hidden sm:block" />

                and reasons to smile when you least expect them.
              </p>

              <div className="mx-auto mt-9 flex max-w-[320px] items-center justify-center gap-2 text-white/25 sm:max-w-none">
                <Heart size={9} fill="currentColor" />

                <span className="font-mono text-[5px] uppercase tracking-[0.4em] sm:text-[6px]">
                  A universe made for one beautiful moment
                </span>

                <Heart size={9} fill="currentColor" />
              </div>

              <button
                type="button"
                onClick={handleFinale}
                className="group relative mx-auto mt-10 flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.15] bg-white/[0.035] px-8 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black active:scale-[0.96] sm:px-10"
              >
                <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em] text-white/70 group-hover:text-black">
                  ENTER THE FINALE

                  <Rocket
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </button>

              <div className="mt-10 flex items-center justify-center gap-3">
                <span className="h-1 w-1 rounded-full bg-white" />

                <span className="font-mono text-[5px] tracking-[0.5em] text-white/15">
                  MEMORY 001 // COMPLETE
                </span>

                <span className="h-1 w-1 rounded-full bg-white" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap">
        <span className="h-px w-6 bg-white/[0.08] sm:w-10" />

        <span className="font-mono text-[5px] tracking-[0.5em] text-white/15">
          JENICA // 2026
        </span>

        <span className="h-px w-6 bg-white/[0.08] sm:w-10" />
      </footer>

      {/* =====================================================
          OPTIMIZED CSS
      ====================================================== */}

      <style>{`
        .celebration-page {
          isolation: isolate;
          background: #020202;
        }

        /* =====================================================
           AURORA
        ====================================================== */

        .aurora-layer {
          position: absolute;
          inset: -20%;
          opacity: 0;
          transform: scale(.9);
          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(255,255,255,.06),
              transparent 45%
            );
          transition:
            opacity 1200ms ease,
            transform 1600ms cubic-bezier(.16,1,.3,1);
        }

        .aurora-active {
          opacity: .8;
          transform: scale(1.25);
        }

        /* =====================================================
           ENERGY HORIZON
        ====================================================== */

        .energy-horizon {
          position: absolute;
          left: 50%;
          top: 58%;
          width: 45vw;
          height: 1px;

          opacity: 0;

          transform:
            translateX(-50%)
            scaleX(.2);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.4),
              white,
              rgba(255,255,255,.4),
              transparent
            );

          transition:
            transform 1200ms ease,
            opacity 600ms ease;
        }

        .energy-active {
          opacity: .65;

          transform:
            translateX(-50%)
            scaleX(3);
        }

        /* =====================================================
           CENTRAL LIGHT
        ====================================================== */

        .central-light {
          position: absolute;
          left: 50%;
          top: 50%;

          width: 220px;
          height: 220px;

          border-radius: 50%;

          opacity: .4;

          transform:
            translate(-50%, -50%)
            scale(1);

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,.12),
              rgba(255,255,255,.025) 45%,
              transparent 72%
            );

          transition:
            transform 1600ms cubic-bezier(.16,1,.3,1),
            opacity 1000ms ease;
        }

        .central-light-active {
          opacity: .8;

          transform:
            translate(-50%, -50%)
            scale(3.2);
        }

        /* =====================================================
           AMBIENT
        ====================================================== */

        .ambient-glow {
          position: absolute;

          width: 280px;
          height: 280px;

          border-radius: 50%;

          opacity: .06;

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,.08),
              transparent 70%
            );
        }

        .ambient-left {
          left: -150px;
          top: 20%;
        }

        .ambient-right {
          right: -150px;
          bottom: 15%;
        }

        /* =====================================================
           ORBIT SYSTEM
        ====================================================== */

        .orbital-system {
          transition:
            opacity 900ms ease,
            transform 1200ms cubic-bezier(.16,1,.3,1);
        }

        .orbital-system-visible {
          opacity: 1;
        }

        .orbital-system-hidden {
          opacity: 0;

          transform:
            translate(-50%, -50%)
            scale(1.25);
        }

        /* =====================================================
           INTRO
        ====================================================== */

        @keyframes intro {
          from {
            opacity: 0;
            transform: translate3d(0,20px,0);
          }

          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        .animate-intro {
          animation:
            intro 700ms cubic-bezier(.16,1,.3,1) both;
        }

        /* =====================================================
           COUNTDOWN
        ====================================================== */

        @keyframes countdownIn {
          from {
            opacity: 0;
            transform: scale(1.12);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .countdown-number {
          animation:
            countdownIn 400ms cubic-bezier(.16,1,.3,1);
        }

        @keyframes countdownOrbit {
          to {
            transform: rotate(360deg);
          }
        }

        .countdown-orbit {
          animation:
            countdownOrbit 8s linear infinite;
        }

        /* =====================================================
           FINAL
        ====================================================== */

        @keyframes finalReveal {
          from {
            opacity: 0;
            transform: translate3d(0,25px,0);
          }

          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        .animate-final {
          animation:
            finalReveal 900ms cubic-bezier(.16,1,.3,1) both;
        }

        /* =====================================================
           TITLE
        ====================================================== */

        .birthday-title {
          text-shadow:
            0 0 25px rgba(255,255,255,.05);
        }

        /* =====================================================
           ORBITS
        ====================================================== */

        @keyframes orbitOne {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitTwo {
          to {
            transform: rotate(-360deg);
          }
        }

        .orbit-one {
          animation:
            orbitOne 55s linear infinite;
        }

        .orbit-two {
          animation:
            orbitTwo 70s linear infinite;
        }

        /* =====================================================
           ORBIT DOTS
        ====================================================== */

        .orbit-dot {
          position: absolute;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.55);
        }

        .orbit-dot-top {
          left: 50%;
          top: -2px;
          transform: translateX(-50%);
        }

        .orbit-dot-right {
          right: -2px;
          top: 50%;
          transform: translateY(-50%);
        }

        .orbit-dot-bottom {
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
        }

        .orbit-dot-left {
          left: -2px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* =====================================================
           STARS
        ====================================================== */

        .cosmic-star {
          position: absolute;

          border-radius: 50%;

          background: white;

          animation:
            starPulse ease-in-out infinite;
        }

        @keyframes starPulse {
          0%,
          100% {
            transform: scale(.8);
            opacity: .5;
          }

          50% {
            transform: scale(1.35);
            opacity: 1;
          }
        }

        /* =====================================================
           CELEBRATION RINGS
        ====================================================== */

        .celebration-ring,
        .shockwave {
          position: absolute;

          left: 50%;
          top: 50%;

          border-radius: 50%;

          transform:
            translate(-50%, -50%)
            scale(.1);

          border:
            1px solid rgba(255,255,255,.2);

          animation:
            celebrationRing 1600ms ease-out forwards;
        }

        .celebration-ring {
          width: 80px;
          height: 80px;
        }

        .ring-b {
          animation-delay: .18s;
        }

        .ring-c {
          animation-delay: .35s;
        }

        @keyframes celebrationRing {
          0% {
            opacity: .7;

            transform:
              translate(-50%, -50%)
              scale(.1);
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scale(6);
          }
        }

        /* =====================================================
           SHOCKWAVE
        ====================================================== */

        .shockwave {
          width: 40px;
          height: 40px;

          border-color:
            rgba(255,255,255,.3);

          animation-duration:
            1100ms;
        }

        .shockwave-b {
          animation-delay: .3s;
        }

        /* =====================================================
           CORE
        ====================================================== */

        .celebration-core {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 90px;
          height: 90px;

          border-radius: 50%;

          background: white;

          opacity: 0;

          animation:
            coreFlash 900ms ease-out forwards;
        }

        @keyframes coreFlash {
          0% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scale(.2);
          }

          20% {
            opacity: .18;
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scale(3.5);
          }
        }

        /* =====================================================
           PARTICLES
        ====================================================== */

        .burst-particle {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: white;

          opacity: 0;

          animation:
            particleBurst 1200ms ease-out forwards;
        }

        @keyframes particleBurst {
          0% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateY(0);
          }

          15% {
            opacity: .8;
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateY(-130px)
              scale(.3);
          }
        }

        .p1 { --angle: 0deg; }
        .p2 { --angle: 60deg; }
        .p3 { --angle: 120deg; }
        .p4 { --angle: 180deg; }
        .p5 { --angle: 240deg; }
        .p6 { --angle: 300deg; }

        /* =====================================================
           CONFETTI
        ====================================================== */

        .confetti {
          position: absolute;

          top: -15px;

          opacity: 0;

          border-radius: 1px;

          animation:
            confettiFall linear forwards;
        }

        .confetti-0 {
          background: rgba(255,255,255,.9);
        }

        .confetti-1 {
          background: rgba(255,255,255,.45);
        }

        .confetti-2 {
          background: rgba(255,255,255,.7);
          border-radius: 50%;
        }

        .confetti-3 {
          background: rgba(255,255,255,.25);
        }

        @keyframes confettiFall {
          0% {
            opacity: 0;

            transform:
              translate3d(0,-10px,0)
              rotate(var(--rotation));
          }

          10% {
            opacity: .8;
          }

          100% {
            opacity: 0;

            transform:
              translate3d(
                var(--drift),
                105vh,
                0
              )
              rotate(
                calc(var(--rotation) + 360deg)
              );
          }
        }

        /* =====================================================
           SPARKLES
        ====================================================== */

        .floating-sparkle {
          position: absolute;

          width: 13px;
          height: 13px;

          color:
            rgba(255,255,255,.3);

          animation:
            floatSparkle 5s ease-in-out infinite;
        }

        .sparkle-1 {
          left: 18%;
          top: 25%;
        }

        .sparkle-2 {
          right: 18%;
          top: 30%;
          animation-delay: 1s;
        }

        .sparkle-3 {
          left: 25%;
          bottom: 20%;
          animation-delay: 2s;
        }

        @keyframes floatSparkle {
          0%,
          100% {
            opacity: .15;

            transform:
              translate3d(0,0,0)
              scale(.8);
          }

          50% {
            opacity: .55;

            transform:
              translate3d(0,-10px,0)
              scale(1);
          }
        }

        /* =====================================================
           MOBILE PERFORMANCE MODE
        ====================================================== */

        @media (max-width: 640px) {

          .ambient-glow {
            display: none;
          }

          .central-light {
            width: 170px;
            height: 170px;
          }

          .central-light-active {
            transform:
              translate(-50%, -50%)
              scale(2.5);
          }

          .aurora-layer {
            inset: -10%;
          }

          .energy-horizon {
            width: 55vw;
          }

          .orbit-one,
          .orbit-two {
            animation: none;
          }

          .cosmic-star {
            animation-duration: 6s !important;
          }

          .birthday-title {
            text-shadow: none;
          }

          .celebration-ring {
            width: 65px;
            height: 65px;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

        }
      `}</style>
    </main>
  );
}