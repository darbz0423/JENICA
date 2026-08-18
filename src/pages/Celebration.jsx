import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper,
  Sparkles,
  Star,
  Orbit,
  Heart,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 110 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
        rotation: Math.random() * 360,
        size: 3 + Math.random() * 7,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-20px] animate-confetti rounded-sm bg-white"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 1.8}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.35 + Math.random() * 0.65,
          }}
        />
      ))}
    </div>
  );
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 45 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: "0 0 12px rgba(255,255,255,.7)",
          }}
        />
      ))}
    </div>
  );
}

function OrbitSystem() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-40 sm:h-[520px] sm:w-[520px] md:h-[700px] md:w-[700px]">
      <div className="absolute inset-0 rounded-full border border-white/[0.06]" />

      <div
        className="absolute inset-[9%] rounded-full border border-dashed border-white/[0.08]"
        style={{
          animation: "celebrationOrbit 30s linear infinite",
        }}
      />

      <div
        className="absolute inset-[20%] rounded-full border border-white/[0.05]"
        style={{
          animation: "celebrationOrbitReverse 22s linear infinite",
        }}
      />

      <div className="absolute inset-[35%] rounded-full border border-white/[0.06]" />

      <span className="absolute left-1/2 top-[-2px] h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_20px_5px_rgba(255,255,255,.5)]" />

      <span className="absolute bottom-[-2px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/50" />

      <span className="absolute left-[-2px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/50" />

      <span className="absolute right-[-2px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,.4)]" />
    </div>
  );
}

export default function Celebration() {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, countdown]);

  const celebrationStarted = countdown <= 0;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-5 pb-28 pt-20">

      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* CENTRAL LIGHT */}

        <div
          className={`absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-all duration-[2000ms] sm:h-[420px] sm:w-[420px] ${
            celebrationStarted
              ? "scale-150 bg-white/[0.12]"
              : "scale-100 bg-white/[0.035]"
          }`}
        />

        {/* TOP LIGHT */}

        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[100px]" />

        {/* SIDE LIGHTS */}

        <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-white/[0.025] blur-[100px]" />

        <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-white/[0.025] blur-[100px]" />

        <Stars />

        <OrbitSystem />
      </div>

      {/* =====================================================
          CELEBRATION BURST
      ===================================================== */}

      {celebrationStarted && (
        <>
          <Confetti />

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 animate-burst rounded-full border border-white/20 sm:h-[280px] sm:w-[280px]" />

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 animate-burst rounded-full border border-white/10 sm:h-[280px] sm:w-[280px]"
            style={{
              animationDelay: "0.35s",
            }}
          />
        </>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-20 w-full max-w-5xl text-center">

        {!started ? (

          /* =================================================
             INTRO
          ================================================= */

          <div className="animate-[fadeUp_.9s_ease-out]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.025] shadow-[0_0_60px_rgba(255,255,255,.05)] backdrop-blur-xl sm:h-20 sm:w-20">

              <div className="relative">

                <PartyPopper
                  size={24}
                  strokeWidth={1}
                  className="text-white/60 sm:h-7 sm:w-7"
                />

                <Sparkles
                  size={10}
                  className="absolute -right-4 -top-3 text-white/40"
                />

              </div>

            </div>

            <p className="mt-8 font-mono text-[7px] uppercase tracking-[0.6em] text-white/30 sm:text-[8px]">
              FINAL SEQUENCE // 001
            </p>

            <h1 className="mt-6 font-display text-6xl leading-[0.8] tracking-[-0.04em] text-white sm:text-8xl md:text-[10rem]">
              READY
              <span className="text-white/20">?</span>
            </h1>

            <p className="mx-auto mt-8 max-w-sm font-serif text-sm leading-relaxed text-white/35 sm:text-base">
              Every memory led here.
              <br />
              One final moment remains.
            </p>

            <button
              onClick={() => setStarted(true)}
              className="group relative mt-10 overflow-hidden rounded-full border border-white/[0.15] bg-white/[0.035] px-8 py-4 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-white/40 hover:bg-white hover:text-black active:scale-95"
            >

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em]">
                Enter The Moment
                <span className="text-[10px]">✦</span>
              </span>

            </button>

            <div className="mt-8 flex items-center justify-center gap-3">

              <span className="h-px w-10 bg-white/10" />

              <span className="font-mono text-[5px] tracking-[0.35em] text-white/15">
                TAP TO BEGIN
              </span>

              <span className="h-px w-10 bg-white/10" />

            </div>

          </div>

        ) : countdown > 0 ? (

          /* =================================================
             COUNTDOWN
          ================================================= */

          <div className="relative">

            <p className="font-mono text-[7px] uppercase tracking-[0.65em] text-white/30 sm:text-[8px]">
              LIGHTING THE MEMORY UNIVERSE
            </p>

            <div className="relative mx-auto mt-6 h-[220px] w-[220px] sm:h-[350px] sm:w-[350px]">

              <div className="absolute inset-0 animate-[pulseRing_1s_ease-in-out_infinite] rounded-full border border-white/[0.08]" />

              <div className="absolute inset-[12%] rounded-full border border-dashed border-white/[0.08]" />

              <div className="absolute inset-[25%] rounded-full border border-white/[0.05]" />

              <div className="absolute inset-0 flex items-center justify-center">

                <span
                  key={countdown}
                  className="animate-[countdownIn_.7s_cubic-bezier(.16,1,.3,1)] font-display text-[9rem] leading-none text-white sm:text-[14rem]"
                >
                  {countdown}
                </span>

              </div>

              <Orbit
                className="absolute left-1/2 top-[-8px] -translate-x-1/2 text-white/30"
                size={14}
                strokeWidth={1}
              />

            </div>

            <p className="mt-4 font-serif text-sm italic text-white/25">
              {countdown === 5 && "Remember this moment."}
              {countdown === 4 && "The lights are coming on."}
              {countdown === 3 && "Almost there."}
              {countdown === 2 && "One more breath."}
              {countdown === 1 && "Here we go."}
            </p>

          </div>

        ) : (

          /* =================================================
             FINAL CELEBRATION
          ================================================= */

          <div className="animate-[finalReveal_1.4s_cubic-bezier(.16,1,.3,1)]">

            {/* STAR */}

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">

              <div className="absolute inset-0 animate-ping rounded-full bg-white/[0.05]" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white text-black shadow-[0_0_50px_rgba(255,255,255,.25)] sm:h-14 sm:w-14">

                <Sparkles
                  size={20}
                  strokeWidth={1.2}
                />

              </div>

            </div>

            <p className="mt-8 font-mono text-[7px] uppercase tracking-[0.6em] text-white/40 sm:text-[8px]">
              THE MEMORY UNIVERSE IS CELEBRATING
            </p>

            {/* MAIN TITLE */}

            <h1 className="mt-7 font-display text-[4.5rem] leading-[0.72] tracking-[-0.05em] text-white sm:text-[7rem] md:text-[10rem]">

              HAPPY
              <br />

              <span className="relative">

                BIRTHDAY

                <span className="absolute -right-4 -top-5 text-xl text-white/30 sm:-right-7 sm:-top-7 sm:text-3xl">
                  ✦
                </span>

              </span>

            </h1>

            {/* NAME */}

            <div className="mt-10 flex items-center justify-center gap-4 sm:mt-12">

              <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20 sm:w-16" />

              <p className="font-serif text-3xl italic text-white/75 sm:text-5xl md:text-6xl">
                {birthdayData.name}
              </p>

              <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20 sm:w-16" />

            </div>

            {/* MESSAGE */}

            <p className="mx-auto mt-10 max-w-xl px-3 font-serif text-base leading-relaxed text-white/45 sm:text-lg md:text-xl">

              May the next chapter bring you moments

              <br className="hidden sm:block" />

              worth remembering, people worth keeping,

              <br className="hidden sm:block" />

              and reasons to smile when you least expect them.

            </p>

            {/* FINAL SIGNATURE */}

            <div className="mx-auto mt-10 flex items-center justify-center gap-2 text-white/25">

              <Heart
                size={10}
                fill="currentColor"
              />

              <span className="font-mono text-[6px] uppercase tracking-[0.4em]">
                A universe made for one beautiful moment
              </span>

              <Heart
                size={10}
                fill="currentColor"
              />

            </div>

            {/* =================================================
                FINALE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/finale")}
              className="group relative mx-auto mt-10 flex items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.15] bg-white/[0.035] px-8 py-4 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-white/40 hover:bg-white hover:text-black active:scale-95"
            >

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em]">
                FINALE
                <span className="text-[10px]">✦</span>
              </span>

            </button>

            {/* BOTTOM STATUS */}

            <div className="mt-12 flex items-center justify-center gap-3">

              <span className="h-1 w-1 animate-pulse rounded-full bg-white shadow-[0_0_10px_white]" />

              <span className="font-mono text-[5px] tracking-[0.5em] text-white/20">
                MEMORY 001 // COMPLETE
              </span>

              <span className="h-1 w-1 animate-pulse rounded-full bg-white shadow-[0_0_10px_white]" />

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          BOTTOM CINEMATIC LINE
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap opacity-40">

        <span className="h-px w-8 bg-white/10" />

        <span className="font-mono text-[5px] tracking-[0.5em] text-white/20">
          JENICA // 2026
        </span>

        <span className="h-px w-8 bg-white/10" />

      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes countdownIn {
          0% {
            opacity: 0;
            transform: scale(1.35);
            filter: blur(12px);
          }

          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(.94);
            opacity: .4;
          }

          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes celebrationOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes celebrationOrbitReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(.2);
            opacity: 1;
          }

          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }

        @keyframes finalReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(.96);
            filter: blur(12px);
          }

          60% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }

          100% {
            transform: translateY(110vh) rotate(720deg);
          }
        }

        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .animate-burst {
          animation: burst 2s cubic-bezier(.16,1,.3,1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </div>
  );
}