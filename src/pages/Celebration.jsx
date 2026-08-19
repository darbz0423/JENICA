import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper,
  Sparkles,
  Orbit,
  Heart,
  ArrowRight,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

export default function Celebration() {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [started, countdown]);

  const celebrationStarted = countdown <= 0;

  return (
    <main className="celebration-page relative min-h-[100svh] overflow-hidden bg-[#030303] text-white">

      {/* =====================================================
          PERFORMANCE FRIENDLY ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Base atmosphere */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#151515_0%,#070707_35%,#030303_75%)]" />

        {/* Central glow */}

        <div
          className={`absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-[1800ms] sm:h-[380px] sm:w-[380px] ${
            celebrationStarted
              ? "scale-[2.2]"
              : "scale-100"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.12) 0%, rgba(255,255,255,.035) 35%, transparent 70%)",
          }}
        />

        {/* Small atmospheric lights */}

        <div className="absolute left-[-15%] top-[25%] h-48 w-48 rounded-full bg-white/[0.018] blur-[70px] sm:h-72 sm:w-72" />

        <div className="absolute right-[-15%] bottom-[20%] h-48 w-48 rounded-full bg-white/[0.018] blur-[70px] sm:h-72 sm:w-72" />

        {/* =================================================
            STARS
        ================================================= */}

        <div className="celebration-stars absolute inset-0">

          <i className="star star-1" />
          <i className="star star-2" />
          <i className="star star-3" />
          <i className="star star-4" />
          <i className="star star-5" />
          <i className="star star-6" />
          <i className="star star-7" />
          <i className="star star-8" />
          <i className="star star-9" />
          <i className="star star-10" />
          <i className="star star-11" />
          <i className="star star-12" />

        </div>

        {/* =================================================
            ORBITAL SYSTEM
        ================================================= */}

        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 sm:h-[500px] sm:w-[500px] md:h-[700px] md:w-[700px]">

          <div className="absolute inset-0 rounded-full border border-white/[0.045]" />

          <div className="orbit-one absolute inset-[10%] rounded-full border border-dashed border-white/[0.055]" />

          <div className="orbit-two absolute inset-[23%] rounded-full border border-white/[0.035]" />

          <div className="absolute inset-[38%] rounded-full border border-white/[0.045]" />

          <span className="orbit-dot orbit-dot-top" />
          <span className="orbit-dot orbit-dot-right" />
          <span className="orbit-dot orbit-dot-bottom" />
          <span className="orbit-dot orbit-dot-left" />

        </div>

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.45)_65%,rgba(0,0,0,.92)_100%)]" />

        {/* Top/bottom cinematic fade */}

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        {/* Subtle grain */}

        <div className="grain absolute inset-0 opacity-[0.035]" />

      </div>

      {/* =====================================================
          TOP HUD
      ===================================================== */}

      <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
            <Sparkles
              size={11}
              strokeWidth={1}
              className="text-white/45"
            />
          </div>

          <div>

            <p className="font-mono text-[6px] uppercase tracking-[0.55em] text-white/30">
              MEMORY UNIVERSE
            </p>

            <p className="mt-1 font-mono text-[5px] tracking-[0.35em] text-white/15">
              CELEBRATION PROTOCOL
            </p>

          </div>

        </div>

        <div className="hidden items-center gap-3 sm:flex">

          <span className="font-mono text-[6px] uppercase tracking-[0.5em] text-white/15">
            08.17.2026
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-white/40 shadow-[0_0_12px_rgba(255,255,255,.5)]" />

        </div>

      </header>

      {/* =====================================================
          CELEBRATION BURST
      ===================================================== */}

      {celebrationStarted && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10">

          <div className="celebration-ring ring-a" />
          <div className="celebration-ring ring-b" />
          <div className="celebration-ring ring-c" />

          <div className="celebration-core" />

          {/* Lightweight particles */}

          <span className="burst-particle p1" />
          <span className="burst-particle p2" />
          <span className="burst-particle p3" />
          <span className="burst-particle p4" />
          <span className="burst-particle p5" />
          <span className="burst-particle p6" />
          <span className="burst-particle p7" />
          <span className="burst-particle p8" />

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

              {/* Icon */}

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">

                <div className="absolute inset-0 rounded-full border border-white/[0.08]" />

                <div className="absolute inset-2 rounded-full border border-dashed border-white/[0.08]" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.035] sm:h-14 sm:w-14">

                  <PartyPopper
                    size={21}
                    strokeWidth={1}
                    className="text-white/60 sm:h-6 sm:w-6"
                  />

                </div>

                <Sparkles
                  size={9}
                  className="absolute right-0 top-1 text-white/45"
                />

              </div>

              <p className="mt-8 font-mono text-[6px] uppercase tracking-[0.65em] text-white/30 sm:text-[7px]">
                FINAL SEQUENCE // 001
              </p>

              {/* Main heading */}

              <h1 className="mt-6 font-display text-[4.5rem] leading-[0.78] tracking-[-0.065em] text-white sm:text-8xl md:text-[10rem]">

                READY
                <span className="text-white/15">?</span>

              </h1>

              <div className="mx-auto mt-7 h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <p className="mx-auto mt-7 max-w-xs font-serif text-sm leading-[1.8] text-white/35 sm:max-w-sm sm:text-base">

                Every memory led here.

                <br />

                <span className="text-white/55">
                  One final moment remains.
                </span>

              </p>

              {/* CTA */}

              <button
                type="button"
                onClick={() => setStarted(true)}
                className="group relative mx-auto mt-9 flex min-h-14 items-center justify-center overflow-hidden rounded-full border border-white/[0.14] bg-white/[0.035] px-7 transition-transform duration-300 active:scale-[0.96] sm:px-9"
              >

                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em] text-white/60">

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

                {/* Rings */}

                <div className="absolute inset-0 rounded-full border border-white/[0.07]" />

                <div className="absolute inset-[11%] rounded-full border border-dashed border-white/[0.065]" />

                <div className="absolute inset-[23%] rounded-full border border-white/[0.045]" />

                <div className="absolute inset-[35%] rounded-full border border-white/[0.035]" />

                {/* Rotating marker */}

                <div className="countdown-orbit absolute inset-[11%]">

                  <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,.8)]" />

                </div>

                {/* Number */}

                <div className="absolute inset-0 flex items-center justify-center">

                  <span
                    key={countdown}
                    className="countdown-number font-display text-[9rem] leading-none tracking-[-0.08em] text-white sm:text-[13rem]"
                  >
                    {countdown}
                  </span>

                </div>

                {/* Tiny icon */}

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

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">

                <div className="absolute inset-0 rounded-full bg-white/[0.035]" />

                <div className="absolute inset-2 rounded-full border border-white/[0.08]" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-[0_0_60px_rgba(255,255,255,.22)] sm:h-14 sm:w-14">

                  <Sparkles
                    size={19}
                    strokeWidth={1.2}
                  />

                </div>

              </div>

              {/* Label */}

              <p className="mt-8 font-mono text-[6px] uppercase tracking-[0.65em] text-white/35 sm:text-[7px]">
                THE MEMORY UNIVERSE IS CELEBRATING
              </p>

              {/* TITLE */}

              <h1 className="mt-7 font-display text-[4.3rem] leading-[0.73] tracking-[-0.075em] text-white sm:text-[7rem] md:text-[10rem]">

                HAPPY

                <br />

                <span className="relative">

                  BIRTHDAY

                  <span className="absolute -right-4 -top-5 text-lg text-white/25 sm:-right-7 sm:-top-7 sm:text-3xl">
                    ✦
                  </span>

                </span>

              </h1>

              {/* NAME */}

              <div className="mt-10 flex items-center justify-center gap-3 sm:mt-12 sm:gap-5">

                <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/20 sm:w-16" />

                <p className="font-serif text-3xl italic text-white/75 sm:text-5xl md:text-6xl">
                  {birthdayData.name}
                </p>

                <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/20 sm:w-16" />

              </div>

              {/* MESSAGE */}

              <p className="mx-auto mt-9 max-w-xl px-2 font-serif text-[15px] leading-[1.9] text-white/40 sm:mt-10 sm:text-lg md:text-xl">

                May the next chapter bring you moments

                <br className="hidden sm:block" />

                worth remembering, people worth keeping,

                <br className="hidden sm:block" />

                and reasons to smile when you least expect them.

              </p>

              {/* SIGNATURE */}

              <div className="mx-auto mt-9 flex max-w-[320px] items-center justify-center gap-2 text-white/20 sm:max-w-none">

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

              {/* BUTTON */}

              <button
                type="button"
                onClick={() => navigate("/finale")}
                className="group relative mx-auto mt-10 flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.14] bg-white/[0.035] px-8 transition-all duration-300 active:scale-[0.96] sm:px-10"
              >

                <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.45em] text-white/60 group-hover:text-black">

                  ENTER THE FINALE

                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </span>

              </button>

              {/* STATUS */}

              <div className="mt-10 flex items-center justify-center gap-3">

                <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_10px_white]" />

                <span className="font-mono text-[5px] tracking-[0.5em] text-white/15">
                  MEMORY 001 // COMPLETE
                </span>

                <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_10px_white]" />

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

        /* ===================================================
           INTRO
        =================================================== */

        @keyframes intro {

          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .animate-intro {
          animation: intro 900ms cubic-bezier(.16,1,.3,1) both;
        }


        /* ===================================================
           COUNTDOWN
        =================================================== */

        @keyframes countdownIn {

          0% {
            opacity: 0;
            transform: scale(1.3);
          }

          100% {
            opacity: 1;
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


        /* ===================================================
           FINAL REVEAL
        =================================================== */

        @keyframes finalReveal {

          0% {
            opacity: 0;
            transform: translateY(24px) scale(.97);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }

        .animate-final {
          animation:
            finalReveal 1100ms cubic-bezier(.16,1,.3,1) both;
        }


        /* ===================================================
           ORBITS
        =================================================== */

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


        /* ===================================================
           ORBIT DOTS
        =================================================== */

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


        /* ===================================================
           STARS
        =================================================== */

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 999px;
          background: white;
          opacity: .25;
          animation:
            starPulse 4s ease-in-out infinite;
        }

        @keyframes starPulse {

          0%,
          100% {
            opacity: .12;
            transform: scale(.7);
          }

          50% {
            opacity: .65;
            transform: scale(1.4);
          }

        }

        .star-1 {
          left: 8%;
          top: 18%;
          animation-delay: -.4s;
        }

        .star-2 {
          left: 17%;
          top: 72%;
          animation-delay: -1.7s;
        }

        .star-3 {
          left: 29%;
          top: 14%;
          animation-delay: -2.2s;
        }

        .star-4 {
          left: 41%;
          top: 82%;
          animation-delay: -1s;
        }

        .star-5 {
          left: 53%;
          top: 11%;
          animation-delay: -3s;
        }

        .star-6 {
          left: 66%;
          top: 24%;
          animation-delay: -.8s;
        }

        .star-7 {
          left: 78%;
          top: 70%;
          animation-delay: -2.5s;
        }

        .star-8 {
          left: 91%;
          top: 18%;
          animation-delay: -1.2s;
        }

        .star-9 {
          left: 84%;
          top: 48%;
          animation-delay: -3.3s;
        }

        .star-10 {
          left: 11%;
          top: 43%;
          animation-delay: -2.8s;
        }

        .star-11 {
          left: 37%;
          top: 35%;
          animation-delay: -1.4s;
        }

        .star-12 {
          left: 73%;
          top: 86%;
          animation-delay: -.5s;
        }


        /* ===================================================
           CELEBRATION RINGS
        =================================================== */

        .celebration-ring {
          position: absolute;
          left: 0;
          top: 0;
          width: 100px;
          height: 100px;
          transform:
            translate(-50%, -50%)
            scale(.2);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.16);
          animation:
            celebrationRing 2s cubic-bezier(.16,1,.3,1) forwards;
        }

        .ring-b {
          animation-delay: .18s;
        }

        .ring-c {
          animation-delay: .36s;
        }

        @keyframes celebrationRing {

          0% {
            opacity: .8;
            transform:
              translate(-50%, -50%)
              scale(.15);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(6);
          }

        }


        /* ===================================================
           CORE FLASH
        =================================================== */

        .celebration-core {
          position: absolute;
          left: 0;
          top: 0;
          width: 90px;
          height: 90px;
          transform:
            translate(-50%, -50%)
            scale(.2);
          border-radius: 999px;
          background: white;
          filter: blur(25px);
          opacity: 0;
          animation:
            coreFlash 1.1s ease-out forwards;
        }

        @keyframes coreFlash {

          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(.2);
          }

          20% {
            opacity: .35;
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(3);
          }

        }


        /* ===================================================
           LIGHTWEIGHT BURST PARTICLES
        =================================================== */

        .burst-particle {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: white;
          opacity: 0;
          animation:
            particleBurst 1.5s cubic-bezier(.16,1,.3,1) forwards;
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
            opacity: .8;
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateY(-180px)
              scale(.1);
          }

        }

        .p1 {
          --angle: 0deg;
        }

        .p2 {
          --angle: 45deg;
        }

        .p3 {
          --angle: 90deg;
        }

        .p4 {
          --angle: 135deg;
        }

        .p5 {
          --angle: 180deg;
        }

        .p6 {
          --angle: 225deg;
        }

        .p7 {
          --angle: 270deg;
        }

        .p8 {
          --angle: 315deg;
        }


        /* ===================================================
           GRAIN
        =================================================== */

        .grain {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
        }


        /* ===================================================
           MOBILE OPTIMIZATION
        =================================================== */

        @media (max-width: 640px) {

          .orbit-one {
            animation-duration: 45s;
          }

          .orbit-two {
            animation-duration: 60s;
          }

          .star {
            animation-duration: 5s;
          }

        }


        /* ===================================================
           REDUCED MOTION
        =================================================== */

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