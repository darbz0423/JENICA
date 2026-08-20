import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper,
  Sparkles,
  Orbit,
  Heart,
  ArrowRight,
  Stars,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

export default function Celebration() {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5);
  const [started, setStarted] = useState(false);

  const celebrationStarted = countdown <= 0;

  // --------------------------------------------------
  // CONFETTI PARTICLES
  // --------------------------------------------------

  const confetti = useMemo(() => {
    return Array.from({ length: 75 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 1.8,
      duration: 3.5 + Math.random() * 3,
      size: 3 + Math.random() * 5,
      rotation: Math.random() * 360,
      drift: -120 + Math.random() * 240,
      type: index % 3,
    }));
  }, []);

  // --------------------------------------------------
  // COUNTDOWN
  // --------------------------------------------------

  useEffect(() => {
    if (!started || countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [started, countdown]);

  return (
    <main className="celebration-page relative min-h-[100svh] overflow-hidden bg-[#020202] text-white">

      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Deep space background */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#171717_0%,#080808_32%,#020202_75%)]" />

        {/* Cinematic light */}

        <div
          className={`absolute left-1/2 top-1/2 h-[240px] w-[240px]
          -translate-x-1/2 -translate-y-1/2 rounded-full
          transition-all duration-[2200ms] ease-out
          sm:h-[420px] sm:w-[420px]
          ${
            celebrationStarted
              ? "scale-[3.5] opacity-100"
              : "scale-100 opacity-70"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.16) 0%, rgba(255,255,255,.055) 30%, transparent 72%)",
          }}
        />

        {/* Left ambient glow */}

        <div className="absolute -left-32 top-[20%] h-72 w-72 rounded-full bg-white/[0.025] blur-[90px]" />

        {/* Right ambient glow */}

        <div className="absolute -right-32 bottom-[20%] h-72 w-72 rounded-full bg-white/[0.025] blur-[90px]" />

        {/* Top cinematic gradient */}

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent" />

        {/* Bottom cinematic gradient */}

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,.28)_55%,rgba(0,0,0,.92)_100%)]" />

        {/* Grain */}

        <div className="grain absolute inset-0 opacity-[0.035]" />
      </div>


      {/* =====================================================
          STARS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="cosmic-star"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${8 + Math.random() * 84}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

      </div>


      {/* =====================================================
          ORBITAL SYSTEM
      ===================================================== */}

      <div
        className={`pointer-events-none absolute left-1/2 top-1/2
        h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2
        transition-all duration-[2000ms]
        sm:h-[520px] sm:w-[520px]
        md:h-[700px] md:w-[700px]
        ${
          celebrationStarted
            ? "scale-[1.5] opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        <div className="absolute inset-0 rounded-full border border-white/[0.045]" />

        <div className="orbit-one absolute inset-[10%] rounded-full border border-dashed border-white/[0.055]" />

        <div className="orbit-two absolute inset-[23%] rounded-full border border-white/[0.035]" />

        <div className="absolute inset-[38%] rounded-full border border-white/[0.045]" />

        <span className="orbit-dot orbit-dot-top" />
        <span className="orbit-dot orbit-dot-right" />
        <span className="orbit-dot orbit-dot-bottom" />
        <span className="orbit-dot orbit-dot-left" />
      </div>


      {/* =====================================================
          TOP HUD
      ===================================================== */}

      <header className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">

        <div className="flex items-center gap-3">

          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">

            <Sparkles
              size={11}
              strokeWidth={1}
              className="text-white/50"
            />

            <span className="absolute inset-0 animate-ping rounded-full border border-white/10" />

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

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 shadow-[0_0_14px_rgba(255,255,255,.7)]" />

        </div>

      </header>


      {/* =====================================================
          CELEBRATION EXPLOSION
      ===================================================== */}

      {celebrationStarted && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">

          {/* Giant rings */}

          <div className="celebration-ring ring-a" />
          <div className="celebration-ring ring-b" />
          <div className="celebration-ring ring-c" />

          {/* Central flash */}

          <div className="celebration-core" />

          {/* Radial rays */}

          <div className="light-ray ray-1" />
          <div className="light-ray ray-2" />
          <div className="light-ray ray-3" />
          <div className="light-ray ray-4" />
          <div className="light-ray ray-5" />
          <div className="light-ray ray-6" />
          <div className="light-ray ray-7" />
          <div className="light-ray ray-8" />

          {/* Burst particles */}

          <span className="burst-particle p1" />
          <span className="burst-particle p2" />
          <span className="burst-particle p3" />
          <span className="burst-particle p4" />
          <span className="burst-particle p5" />
          <span className="burst-particle p6" />
          <span className="burst-particle p7" />
          <span className="burst-particle p8" />

          {/* Confetti */}

          <div className="absolute inset-0">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={`confetti confetti-${piece.type}`}
                style={{
                  left: `${piece.left}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size * 1.7}px`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  "--drift": `${piece.drift}px`,
                  "--rotation": `${piece.rotation}deg`,
                }}
              />
            ))}
          </div>

          {/* Floating sparkle symbols */}

          <Stars className="floating-sparkle sparkle-1" />
          <Stars className="floating-sparkle sparkle-2" />
          <Stars className="floating-sparkle sparkle-3" />
          <Stars className="floating-sparkle sparkle-4" />

        </div>
      )}


      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="relative z-20 flex min-h-[100svh] items-center justify-center px-5 pb-24 pt-24">

        <div className="w-full max-w-5xl text-center">


          {/* =================================================
              INTRO
          ================================================= */}

          {!started && (
            <div className="animate-intro">

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

                <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-white/[0.07]" />

                <div className="absolute inset-2 rounded-full border border-dashed border-white/[0.08]" />

                <div className="absolute inset-5 rounded-full bg-white/[0.025] shadow-[0_0_40px_rgba(255,255,255,.04)]" />

                <PartyPopper
                  size={23}
                  strokeWidth={1}
                  className="relative text-white/65"
                />

                <Sparkles
                  size={9}
                  className="absolute right-0 top-1 animate-pulse text-white/60"
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
                onClick={() => setStarted(true)}
                className="group relative mx-auto mt-9 flex min-h-14 items-center justify-center overflow-hidden rounded-full border border-white/[0.14] bg-white/[0.035] px-7 shadow-[0_0_40px_rgba(255,255,255,.025)] transition-all duration-500 hover:border-white/30 hover:bg-white/[0.07] active:scale-[0.96] sm:px-9"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

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

                <div className="countdown-orbit absolute inset-[11%]">
                  <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,.8)]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">

                  <span
                    key={countdown}
                    className="countdown-number font-display text-[9rem] leading-none tracking-[-0.08em] text-white sm:text-[13rem]"
                  >
                    {countdown}
                  </span>

                </div>

                <Orbit
                  size={13}
                  strokeWidth={1}
                  className="absolute left-1/2 top-[-7px] -translate-x-1/2 text-white/30"
                />

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

              {/* Core */}

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

                <div className="absolute inset-0 animate-pulse rounded-full bg-white/[0.035]" />

                <div className="absolute inset-2 rounded-full border border-white/[0.1]" />

                <div className="absolute inset-0 rounded-full border border-white/[0.04] animate-[spin_12s_linear_infinite]" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-[0_0_70px_rgba(255,255,255,.28)] sm:h-14 sm:w-14">

                  <Sparkles
                    size={19}
                    strokeWidth={1.2}
                  />

                </div>

              </div>


              {/* Label */}

              <p className="mt-8 font-mono text-[6px] uppercase tracking-[0.65em] text-white/40 sm:text-[7px]">
                THE MEMORY UNIVERSE IS CELEBRATING
              </p>


              {/* Main title */}

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


              {/* Name */}

              <div className="mt-10 flex items-center justify-center gap-3 sm:mt-12 sm:gap-5">

                <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/25 sm:w-16" />

                <p className="font-serif text-3xl italic text-white/80 sm:text-5xl md:text-6xl">
                  {birthdayData.name}
                </p>

                <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/25 sm:w-16" />

              </div>


              {/* Message */}

              <p className="mx-auto mt-9 max-w-xl px-2 font-serif text-[15px] leading-[1.9] text-white/45 sm:mt-10 sm:text-lg md:text-xl">

                May the next chapter bring you moments

                <br className="hidden sm:block" />

                worth remembering, people worth keeping,

                <br className="hidden sm:block" />

                and reasons to smile when you least expect them.

              </p>


              {/* Signature */}

              <div className="mx-auto mt-9 flex max-w-[320px] items-center justify-center gap-2 text-white/25 sm:max-w-none">

                <Heart
                  size={9}
                  fill="currentColor"
                />

                <span className="font-mono text-[5px] uppercase tracking-[0.4em] sm:text-[6px]">
                  A universe made for one beautiful moment
                </span>

                <Heart
                  size={9}
                  fill="currentColor"
                />

              </div>


              {/* Finale button */}

              <button
                type="button"
                onClick={() => navigate("/finale")}
                className="group relative mx-auto mt-10 flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.15] bg-white/[0.035] px-8 shadow-[0_0_50px_rgba(255,255,255,.025)] transition-all duration-500 hover:border-white/40 hover:bg-white hover:text-black active:scale-[0.96] sm:px-10"
              >

                <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />

                <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em] text-white/70 group-hover:text-black">

                  ENTER THE FINALE

                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </span>

              </button>


              {/* Status */}

              <div className="mt-10 flex items-center justify-center gap-3">

                <span className="h-1 w-1 animate-pulse rounded-full bg-white shadow-[0_0_10px_white]" />

                <span className="font-mono text-[5px] tracking-[0.5em] text-white/15">
                  MEMORY 001 // COMPLETE
                </span>

                <span className="h-1 w-1 animate-pulse rounded-full bg-white shadow-[0_0_10px_white]" />

              </div>

            </div>
          )}

        </div>
      </section>


      {/* =====================================================
          BOTTOM HUD
      ===================================================== */}

      <footer className="pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap">

        <span className="h-px w-6 bg-white/[0.08] sm:w-10" />

        <span className="font-mono text-[5px] tracking-[0.5em] text-white/15">
          JENICA // 2026
        </span>

        <span className="h-px w-6 bg-white/[0.08] sm:w-10" />

      </footer>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        /* =================================================
           INTRO
        ================================================= */

        @keyframes intro {
          from {
            opacity: 0;
            transform: translateY(28px) scale(.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-intro {
          animation:
            intro 1000ms cubic-bezier(.16,1,.3,1) both;
        }


        /* =================================================
           COUNTDOWN
        ================================================= */

        @keyframes countdownIn {
          0% {
            opacity: 0;
            transform: scale(1.35);
            filter: blur(8px);
          }

          70% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            transform: scale(1);
          }
        }

        .countdown-number {
          animation:
            countdownIn 600ms cubic-bezier(.16,1,.3,1);
        }


        @keyframes countdownOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .countdown-orbit {
          animation:
            countdownOrbit 5s linear infinite;
        }


        /* =================================================
           FINAL REVEAL
        ================================================= */

        @keyframes finalReveal {
          0% {
            opacity: 0;
            transform: translateY(35px) scale(.94);
            filter: blur(8px);
          }

          60% {
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-final {
          animation:
            finalReveal 1400ms cubic-bezier(.16,1,.3,1) both;
        }


        /* =================================================
           BIRTHDAY TITLE
        ================================================= */

        @keyframes titleGlow {
          0%,
          100% {
            text-shadow:
              0 0 0 rgba(255,255,255,0);
          }

          50% {
            text-shadow:
              0 0 45px rgba(255,255,255,.12),
              0 0 100px rgba(255,255,255,.05);
          }
        }

        .birthday-title {
          animation:
            titleGlow 4s ease-in-out infinite;
        }


        /* =================================================
           ORBITS
        ================================================= */

        @keyframes orbitOne {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitTwo {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .orbit-one {
          animation:
            orbitOne 34s linear infinite;
        }

        .orbit-two {
          animation:
            orbitTwo 46s linear infinite;
        }


        /* =================================================
           ORBIT DOTS
        ================================================= */

        .orbit-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255,255,255,.55);
          box-shadow:
            0 0 14px rgba(255,255,255,.4);
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


        /* =================================================
           STARS
        ================================================= */

        .cosmic-star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 999px;
          background: white;
          opacity: .15;
          animation:
            starPulse 4s ease-in-out infinite;
        }

        @keyframes starPulse {
          0%,
          100% {
            opacity: .08;
            transform: scale(.6);
          }

          50% {
            opacity: .75;
            transform: scale(1.8);
            box-shadow:
              0 0 10px rgba(255,255,255,.7);
          }
        }


        /* =================================================
           CELEBRATION RINGS
        ================================================= */

        .celebration-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 80px;
          height: 80px;

          transform:
            translate(-50%, -50%)
            scale(.1);

          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.2);

          animation:
            celebrationRing 2.4s cubic-bezier(.16,1,.3,1) forwards;
        }

        .ring-b {
          animation-delay: .16s;
        }

        .ring-c {
          animation-delay: .32s;
        }

        @keyframes celebrationRing {
          0% {
            opacity: .8;

            transform:
              translate(-50%, -50%)
              scale(.1);
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scale(8);
          }
        }


        /* =================================================
           CORE FLASH
        ================================================= */

        .celebration-core {
          position: absolute;
          left: 50%;
          top: 50%;

          width: 100px;
          height: 100px;

          transform:
            translate(-50%, -50%)
            scale(.1);

          border-radius: 999px;
          background: white;
          filter: blur(28px);

          opacity: 0;

          animation:
            coreFlash 1.3s ease-out forwards;
        }

        @keyframes coreFlash {
          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(.1);
          }

          18% {
            opacity: .45;
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scale(4);
          }
        }


        /* =================================================
           LIGHT RAYS
        ================================================= */

        .light-ray {
          position: absolute;
          left: 50%;
          top: 50%;

          width: 2px;
          height: 45vh;

          transform-origin: center bottom;

          background:
            linear-gradient(
              to top,
              rgba(255,255,255,.35),
              transparent
            );

          opacity: 0;

          animation:
            rayBurst 1.4s cubic-bezier(.16,1,.3,1) forwards;
        }

        .ray-1 { transform: translate(-50%, -100%) rotate(0deg); }
        .ray-2 { transform: translate(-50%, -100%) rotate(45deg); }
        .ray-3 { transform: translate(-50%, -100%) rotate(90deg); }
        .ray-4 { transform: translate(-50%, -100%) rotate(135deg); }
        .ray-5 { transform: translate(-50%, -100%) rotate(180deg); }
        .ray-6 { transform: translate(-50%, -100%) rotate(225deg); }
        .ray-7 { transform: translate(-50%, -100%) rotate(270deg); }
        .ray-8 { transform: translate(-50%, -100%) rotate(315deg); }

        @keyframes rayBurst {
          0% {
            opacity: 0;
            height: 0;
          }

          20% {
            opacity: .5;
          }

          100% {
            opacity: 0;
            height: 45vh;
          }
        }


        /* =================================================
           BURST PARTICLES
        ================================================= */

        .burst-particle {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 4px;
          height: 4px;

          border-radius: 999px;

          background: white;

          opacity: 0;

          animation:
            particleBurst 1.7s cubic-bezier(.16,1,.3,1) forwards;
        }

        @keyframes particleBurst {
          0% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateY(0)
              scale(.5);
          }

          15% {
            opacity: .9;
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateY(-190px)
              scale(.05);
          }
        }

        .p1 { --angle: 0deg; }
        .p2 { --angle: 45deg; }
        .p3 { --angle: 90deg; }
        .p4 { --angle: 135deg; }
        .p5 { --angle: 180deg; }
        .p6 { --angle: 225deg; }
        .p7 { --angle: 270deg; }
        .p8 { --angle: 315deg; }


        /* =================================================
           CONFETTI
        ================================================= */

        .confetti {
          position: absolute;
          top: -20px;

          border-radius: 1px;

          opacity: 0;

          animation:
            confettiFall linear forwards;
        }

        .confetti-0 {
          background: rgba(255,255,255,.9);
          box-shadow: 0 0 8px rgba(255,255,255,.35);
        }

        .confetti-1 {
          background: rgba(255,255,255,.45);
        }

        .confetti-2 {
          background: rgba(255,255,255,.7);
          border-radius: 50%;
        }

        @keyframes confettiFall {
          0% {
            opacity: 0;
            transform:
              translate3d(0,-20px,0)
              rotate(var(--rotation));
          }

          8% {
            opacity: .9;
          }

          100% {
            opacity: 0;

            transform:
              translate3d(
                var(--drift),
                110vh,
                0
              )
              rotate(calc(var(--rotation) + 720deg));
          }
        }


        /* =================================================
           FLOATING SPARKLES
        ================================================= */

        .floating-sparkle {
          position: absolute;

          width: 15px;
          height: 15px;

          color: rgba(255,255,255,.35);

          animation:
            floatSparkle 4s ease-in-out infinite;
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
          animation-delay: 1.8s;
        }

        .sparkle-4 {
          right: 25%;
          bottom: 25%;
          animation-delay: 2.5s;
        }

        @keyframes floatSparkle {
          0%,
          100% {
            opacity: .15;
            transform:
              translateY(0)
              rotate(0deg)
              scale(.7);
          }

          50% {
            opacity: .7;
            transform:
              translateY(-18px)
              rotate(90deg)
              scale(1.15);
          }
        }


        /* =================================================
           GRAIN
        ================================================= */

        .grain {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 640px) {

          .orbit-one {
            animation-duration: 45s;
          }

          .orbit-two {
            animation-duration: 60s;
          }

          .cosmic-star {
            animation-duration: 5s;
          }

          .light-ray {
            height: 32vh;
          }

          .floating-sparkle {
            width: 11px;
            height: 11px;
          }

        }


        /* =================================================
           REDUCED MOTION
        ================================================= */

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