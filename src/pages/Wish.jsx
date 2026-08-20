import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { birthdayData } from "../data/birthdayData";

const STAR_COUNT = 72;
const CHARGE_DURATION = 2400;

const createStars = () =>
  Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: (i * 47.73 + 3) % 100,
    y: (i * 83.17 + 7) % 100,
    size:
      i % 19 === 0
        ? 2.8
        : i % 7 === 0
        ? 1.8
        : i % 3 === 0
        ? 1.3
        : 0.8,
    delay: (i % 16) * 0.18,
    duration: 3.5 + (i % 7) * 0.7,
  }));

export default function Wish() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("idle");
  const [energy, setEnergy] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [stars] = useState(createStars);

  const chargeTimerRef = useRef(null);
  const modalTimerRef = useRef(null);
  const chargeStartRef = useRef(0);
  const lastEnergyRef = useRef(-1);
  const pointerDownRef = useRef(false);
  const completedRef = useRef(false);

  const isHolding = phase === "charging";
  const releasing = phase === "releasing";
  const complete = showModal;

  const modalParticles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 28;
        const distance = 130 + (i % 7) * 55;

        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          delay: i * 0.025,
        };
      }),
    []
  );

  useEffect(() => {
    return () => {
      clearInterval(chargeTimerRef.current);
      clearTimeout(modalTimerRef.current);
    };
  }, []);

  /* ============================================================
     RESET / CLEANUP
  ============================================================ */

  const clearTimers = () => {
    clearInterval(chargeTimerRef.current);
    clearTimeout(modalTimerRef.current);
  };

  /* ============================================================
     WISH CHARGING
  ============================================================ */

  const startWish = () => {
    if (complete || releasing || pointerDownRef.current) {
      return;
    }

    pointerDownRef.current = true;
    completedRef.current = false;

    clearInterval(chargeTimerRef.current);

    chargeStartRef.current = performance.now();
    lastEnergyRef.current = -1;

    setEnergy(0);
    setPhase("charging");

    chargeTimerRef.current = setInterval(() => {
      const elapsed =
        performance.now() - chargeStartRef.current;

      const progress = Math.min(
        100,
        Math.floor(
          (elapsed / CHARGE_DURATION) * 100
        )
      );

      if (
        progress !== lastEnergyRef.current &&
        (progress % 2 === 0 || progress >= 100)
      ) {
        lastEnergyRef.current = progress;
        setEnergy(progress);
      }

      if (progress >= 100) {
        clearInterval(chargeTimerRef.current);

        pointerDownRef.current = false;

        if (!completedRef.current) {
          completedRef.current = true;
          releaseWish();
        }
      }
    }, 40);
  };

  const cancelWish = () => {
    pointerDownRef.current = false;

    if (!isHolding) {
      return;
    }

    clearInterval(chargeTimerRef.current);

    setPhase("idle");
    setEnergy(0);
  };

  /* ============================================================
     RELEASE
  ============================================================ */

  const releaseWish = () => {
    clearInterval(chargeTimerRef.current);
    clearTimeout(modalTimerRef.current);

    pointerDownRef.current = false;

    setEnergy(100);
    setPhase("releasing");

    modalTimerRef.current = setTimeout(() => {
      setShowModal(true);
    }, 2300);
  };

  /* ============================================================
     CHARGE RING
  ============================================================ */

  const progressDegrees = Math.min(100, energy) * 3.6;

  return (
    <main
      className={`
        relative
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-[#010101]
        px-4
        pb-10
        pt-9
        text-white
        selection:bg-white
        selection:text-black

        transition-transform
        duration-[1800ms]
        ease-[cubic-bezier(.16,1,.3,1)]

        sm:px-5
        sm:pb-16
        sm:pt-14

        ${
          releasing
            ? "scale-[1.018]"
            : ""
        }
      `}
    >
      {/* =====================================================
          COSMIC BACKGROUND
      ===================================================== */}

      <div
        className={`
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden

          transition-opacity
          duration-1000

          ${
            showModal
              ? "opacity-10"
              : "opacity-100"
          }
        `}
      >
        {/* Base */}

        <div className="absolute inset-0 bg-[#010101]" />

        {/* Central nebula */}

        <div
          className={`
            absolute
            left-1/2
            top-[43%]
            h-[320px]
            w-[320px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full

            bg-[radial-gradient(circle,rgba(255,225,170,.08)_0%,rgba(255,210,140,.025)_35%,transparent_70%)]

            blur-[40px]

            sm:h-[420px]
            sm:w-[420px]

            sm:blur-[45px]

            transition-transform
            duration-[1800ms]
            ease-[cubic-bezier(.16,1,.3,1)]

            ${
              isHolding
                ? "scale-[1.7]"
                : releasing
                ? "scale-[5]"
                : "scale-100"
            }
          `}
        />

        {/* Gold atmosphere */}

        <div
          className={`
            absolute
            left-1/2
            top-[45%]
            h-[220px]
            w-[220px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-amber-100/[0.025]
            blur-[70px]

            sm:h-[280px]
            sm:w-[280px]
            sm:blur-[80px]

            ${
              isHolding
                ? "scale-[1.8]"
                : releasing
                ? "scale-[4]"
                : ""
            }
          `}
        />

        {/* Blue haze */}

        <div
          className={`
            absolute
            -left-32
            top-[20%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-blue-300/[0.018]
            blur-[100px]

            sm:h-[380px]
            sm:w-[380px]

            ${
              releasing
                ? "scale-[3]"
                : ""
            }
          `}
        />

        {/* Purple haze */}

        <div
          className={`
            absolute
            -right-40
            bottom-[8%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-purple-300/[0.014]
            blur-[110px]

            sm:h-[420px]
            sm:w-[420px]

            ${
              releasing
                ? "scale-[3]"
                : ""
            }
          `}
        />

        {/* Stars */}

        <div className="absolute inset-0">
          {stars.map((star) => (
            <span
              key={star.id}
              className={`
                absolute
                rounded-full
                bg-white

                ${
                  releasing
                    ? "animate-[wishStar_2s_cubic-bezier(.16,1,.3,1)_forwards]"
                    : "animate-[wishTwinkle_var(--duration)_ease-in-out_infinite]"
                }
              `}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity:
                  0.12 +
                  (star.id % 8) / 15,
                animationDelay: `${star.delay}s`,
                "--duration": `${star.duration}s`,
                "--sx": `${(star.x - 50) * 3}vw`,
                "--sy": `${(star.y - 50) * 3}vh`,
              }}
            />
          ))}
        </div>

        {/* Shooting stars */}

        <div className="absolute left-[18%] top-[24%] h-px w-16 rotate-[35deg] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shootingStar_7s_ease-in-out_infinite]" />

        <div className="absolute right-[14%] top-[37%] h-px w-20 rotate-[-35deg] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shootingStar_9s_ease-in-out_2s_infinite]" />

        {/* Horizon */}

        <div
          className={`
            absolute
            bottom-[-360px]
            left-1/2
            h-[650px]
            w-[1200px]
            -translate-x-1/2
            rounded-[50%]
            border
            border-white/[0.035]

            transition-transform
            duration-[1800ms]

            ${
              releasing
                ? "scale-[2.5]"
                : ""
            }
          `}
        />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.28)_60%,rgba(0,0,0,.95)_100%)]" />

        {/* Film grain */}

        <div className="absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.5%22/%3E%3C/svg%3E')]" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <span className="h-px w-7 bg-gradient-to-r from-transparent to-white/20 sm:w-14" />

          <p className="font-mono text-[6px] uppercase tracking-[0.34em] text-white/35 sm:text-[8px] sm:tracking-[0.7em]">
            THE LAST CONSTELLATION
          </p>

          <span className="h-px w-7 bg-gradient-to-l from-transparent to-white/20 sm:w-14" />
        </div>

        <h1
          className="
            mt-7
            font-display
            text-[4rem]
            font-light
            leading-[0.8]
            tracking-[-0.075em]

            sm:mt-10
            sm:text-8xl

            md:text-[8.8rem]
          "
        >
          Make
          <br />

          <span className="text-white/[0.2] transition-all duration-1000">
            a wish.
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-6
            max-w-[300px]
            font-serif
            text-[13px]
            leading-[1.75]
            text-white/35

            sm:mt-9
            sm:max-w-lg
            sm:text-lg
          "
        >
          There is one moment left
          in this universe.
          <br />
          Keep something beautiful
          in your heart.
        </p>
      </header>

      {/* =====================================================
          MOON / UNIVERSE CORE
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          mt-1
          flex
          max-w-4xl
          justify-center

          sm:mt-8
        "
      >
        <div
          className={`
            relative
            h-[285px]
            w-[285px]

            xs:h-[305px]
            xs:w-[305px]

            sm:h-[480px]
            sm:w-[480px]

            transition-transform
            duration-[1600ms]
            ease-[cubic-bezier(.16,1,.3,1)]

            ${
              releasing
                ? "scale-[1.3]"
                : ""
            }
          `}
        >
          {/* Outer orbit */}

          <div
            className={`
              absolute
              inset-0
              rounded-full
              border
              border-white/[0.045]

              ${
                isHolding
                  ? "scale-[1.07] border-amber-100/20"
                  : releasing
                  ? "scale-[3] opacity-0"
                  : ""
              }

              transition-all
              duration-1000
            `}
          />

          {/* Large orbit */}

          <div
            className={`
              absolute
              inset-[6%]
              rounded-full
              border
              border-dashed
              border-white/[0.05]

              ${
                isHolding
                  ? "animate-[spin_7s_linear_infinite] border-amber-100/25"
                  : releasing
                  ? "animate-[spin_1.2s_linear_infinite]"
                  : "animate-[spin_35s_linear_infinite]"
              }
            `}
          />

          {/* Second orbit */}

          <div
            className={`
              absolute
              inset-[17%]
              rounded-full
              border
              border-white/[0.035]

              ${
                isHolding
                  ? "scale-[1.08]"
                  : releasing
                  ? "scale-[3]"
                  : ""
              }

              transition-transform
              duration-1000
            `}
          />

          {/* Orbit points */}

          {[0, 1, 2, 3, 4, 5, 6, 7].map(
            (particle) => (
              <div
                key={particle}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `
                    rotate(${particle * 45}deg)
                    translateY(-${118 + (particle % 3) * 7}px)
                  `,
                }}
              >
                <div
                  className={`
                    h-1
                    w-1
                    rounded-full
                    bg-white
                    shadow-[0_0_14px_rgba(255,255,255,.8)]

                    transition-all
                    duration-700

                    ${
                      isHolding
                        ? "scale-[3] bg-amber-100"
                        : releasing
                        ? "scale-[8] opacity-0"
                        : "opacity-50"
                    }
                  `}
                />
              </div>
            )
          )}

          {/* =================================================
              MOON
          ================================================= */}

          <div
            className={`
              absolute
              left-1/2
              top-1/2
              flex
              h-[155px]
              w-[155px]
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full

              xs:h-[170px]
              xs:w-[170px]

              sm:h-[270px]
              sm:w-[270px]

              transition-transform
              duration-[1800ms]
              ease-[cubic-bezier(.16,1,.3,1)]

              ${
                isHolding
                  ? "scale-[1.08]"
                  : releasing
                  ? "scale-[7]"
                  : ""
              }
            `}
          >
            {/* Aura */}

            <div
              className={`
                absolute
                inset-[-50px]
                rounded-full

                bg-[radial-gradient(circle,rgba(255,235,190,.22),rgba(255,210,140,.06),transparent_70%)]

                blur-[30px]

                sm:inset-[-60px]
                sm:blur-[35px]

                transition-transform
                duration-700

                ${
                  isHolding
                    ? "scale-[1.5]"
                    : releasing
                    ? "scale-[3]"
                    : ""
                }
              `}
            />

            {/* Orbiting light */}

            <div
              className={`
                absolute
                inset-[-25px]
                rounded-full
                border
                border-white/[0.1]

                sm:inset-[-30px]

                ${
                  isHolding
                    ? "animate-[spin_3s_linear_infinite]"
                    : releasing
                    ? "animate-[spin_.7s_linear_infinite]"
                    : ""
                }
              `}
            >
              <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_18px_white]" />
            </div>

            {/* Energy rings */}

            {isHolding && (
              <>
                <div className="absolute inset-[-12px] rounded-full border border-amber-100/30 animate-[energyRing_1.4s_ease-out_infinite]" />

                <div className="absolute inset-[-30px] rounded-full border border-white/10 animate-[energyRing_2s_ease-out_.25s_infinite]" />

                <div className="absolute inset-[-52px] rounded-full border border-amber-100/[0.08] animate-[energyRing_2.7s_ease-out_.5s_infinite]" />
              </>
            )}

            {/* Moon */}

            <div
              className={`
                relative
                h-full
                w-full
                overflow-hidden
                rounded-full
                border
                border-white/10

                bg-[radial-gradient(circle_at_30%_24%,#fffef3_0%,#f0dba6_18%,#aa9160_40%,#554a37_65%,#0e0d0b_100%)]

                shadow-[inset_-40px_-35px_75px_rgba(0,0,0,.8),inset_20px_15px_35px_rgba(255,255,255,.16),0_0_90px_rgba(255,220,150,.16)]

                ${
                  isHolding
                    ? "animate-[moonPulse_2.2s_ease-in-out_infinite]"
                    : releasing
                    ? "animate-[moonBurst_2.2s_cubic-bezier(.16,1,.3,1)_forwards]"
                    : ""
                }
              `}
            >
              {/* Light */}

              <div className="absolute left-[5%] top-[3%] h-[48%] w-[38%] rounded-full bg-white/30 blur-[24px]" />

              {/* Craters */}

              <span className="absolute left-[18%] top-[27%] h-7 w-7 rounded-full bg-black/10 blur-[2px] sm:h-10 sm:w-10" />

              <span className="absolute right-[17%] top-[43%] h-10 w-10 rounded-full bg-black/10 blur-[3px] sm:h-16 sm:w-16" />

              <span className="absolute bottom-[18%] left-[33%] h-6 w-6 rounded-full bg-black/10 blur-[2px] sm:h-7 sm:w-7" />

              <span className="absolute bottom-[29%] right-[31%] h-4 w-4 rounded-full bg-black/10" />

              <span className="absolute left-[47%] top-[18%] h-4 w-4 rounded-full bg-black/10 blur-[2px] sm:h-5 sm:w-5" />

              <span className="absolute left-[62%] top-[64%] h-5 w-5 rounded-full bg-black/[0.08] blur-[2px] sm:h-6 sm:w-6" />

              {/* Energy core */}

              {isHolding && (
                <div className="absolute inset-[28%] rounded-full bg-white/25 blur-[26px] animate-[corePulse_1s_ease-in-out_infinite]" />
              )}

              {/* Flash */}

              {releasing && (
                <div className="absolute inset-0 bg-white animate-[moonFlash_1s_ease-out_forwards]" />
              )}
            </div>

            {/* =================================================
                RELEASE EXPLOSION
            ================================================= */}

            {releasing && (
              <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
                {/* Core */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-4
                    w-4
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white

                    shadow-[0_0_100px_40px_rgba(255,255,255,.95)]

                    animate-[universeBurst_2s_cubic-bezier(.16,1,.3,1)_forwards]
                  "
                />

                {/* Flash */}

                <div
                  className="
                    absolute
                    inset-0

                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,.95)_0%,rgba(255,225,170,.45)_8%,transparent_55%)]

                    animate-[cosmicFlash_2s_ease-out_forwards]
                  "
                />

                {/* Horizontal beam */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-px
                    w-[140vw]
                    -translate-x-1/2
                    -translate-y-1/2
                    bg-gradient-to-r
                    from-transparent
                    via-white
                    to-transparent

                    animate-[lightBeam_1.25s_ease-out_forwards]
                  "
                />

                {/* Vertical beam */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[140vh]
                    w-px
                    -translate-x-1/2
                    -translate-y-1/2
                    bg-gradient-to-b
                    from-transparent
                    via-white
                    to-transparent

                    animate-[lightBeam_1.25s_ease-out_forwards]
                  "
                />

                {/* Shockwaves */}

                {[0, 1, 2, 3].map(
                  (wave) => (
                    <div
                      key={wave}
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        h-10
                        w-10
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        border
                        border-white/40
                      "
                      style={{
                        animation: `shockwave ${
                          1.4 + wave * 0.28
                        }s cubic-bezier(.16,1,.3,1) ${
                          wave * 0.15
                        }s forwards`,
                      }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          WISH ENERGY
      ===================================================== */}

      {!complete && (
        <section
          className="
            relative
            z-20
            mx-auto
            mt-[-8px]
            w-full
            max-w-[330px]

            sm:mt-0
            sm:max-w-md
          "
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-white/30">
              Wish energy
            </span>

            <span
              className={`
                font-mono
                text-[7px]
                tracking-[0.2em]
                transition-colors

                ${
                  isHolding
                    ? "text-amber-100/70"
                    : "text-white/25"
                }
              `}
            >
              {String(energy).padStart(3, "0")}%
            </span>
          </div>

          <div className="relative h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-white/20
                via-amber-100
                to-white

                shadow-[0_0_15px_rgba(255,225,170,.45)]

                transition-[width]
                duration-75
                ease-linear
              "
              style={{
                width: `${energy}%`,
              }}
            />

            {isHolding && (
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent animate-[energySweep_.9s_linear_infinite]" />
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          HOLD INTERACTION
      ===================================================== */}

      {!complete && !releasing && (
        <section
          className="
            relative
            z-20
            mt-7
            flex
            flex-col
            items-center

            sm:mt-10
          "
        >
          {/* Button */}

          <div className="relative">
            {/* Progress ring */}

            <svg
              className="
                pointer-events-none
                absolute
                -inset-[13px]
                h-[108px]
                w-[108px]
                -rotate-90

                sm:-inset-[18px]
                sm:h-[128px]
                sm:w-[128px]
              "
              viewBox="0 0 128 128"
            >
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="rgba(255,255,255,.06)"
                strokeWidth="1"
              />

              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="rgba(255,235,190,.85)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="364.4"
                strokeDashoffset={
                  364.4 -
                  (364.4 * progressDegrees) /
                    360
                }
                className="transition-[stroke-dashoffset] duration-75 ease-linear"
                style={{
                  filter: isHolding
                    ? "drop-shadow(0 0 8px rgba(255,225,170,.5))"
                    : "none",
                }}
              />
            </svg>

            {/* Outer glow */}

            <div
              className={`
                pointer-events-none
                absolute
                inset-[-20px]
                rounded-full

                transition-all
                duration-700

                ${
                  isHolding
                    ? "bg-amber-100/[0.08] blur-[25px] scale-110"
                    : "bg-transparent"
                }
              `}
            />

            {/* Main button */}

            <button
              type="button"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture?.(
                  event.pointerId
                );

                startWish();
              }}
              onPointerUp={() => {
                if (energy >= 96) {
                  pointerDownRef.current = false;
                  completedRef.current = true;
                  releaseWish();
                } else {
                  cancelWish();
                }
              }}
              onPointerCancel={cancelWish}
              onPointerLeave={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  isHolding
                ) {
                  cancelWish();
                }
              }}
              className={`
                group
                relative
                flex
                h-[78px]
                w-[78px]
                touch-none
                select-none
                items-center
                justify-center
                rounded-full
                border
                overflow-hidden

                transition-all
                duration-500

                sm:h-[82px]
                sm:w-[82px]

                ${
                  isHolding
                    ? "scale-110 border-amber-100/60 bg-amber-100/[0.1] shadow-[0_0_80px_rgba(255,220,150,.28)]"
                    : "border-white/[0.14] bg-white/[0.035] shadow-[0_15px_60px_rgba(0,0,0,.5)]"
                }
              `}
              aria-label="Press and hold to make a wish"
            >
              {/* Inner light */}

              <span
                className={`
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-full

                  bg-[radial-gradient(circle,rgba(255,255,255,.08),transparent_65%)]

                  transition-opacity

                  ${
                    isHolding
                      ? "opacity-100"
                      : "opacity-0"
                  }
                `}
              />

              <Star
                size={19}
                strokeWidth={1.1}
                className={`
                  relative
                  z-10

                  transition-all
                  duration-500

                  ${
                    isHolding
                      ? "scale-125 fill-white text-white drop-shadow-[0_0_12px_white]"
                      : "text-white/55"
                  }
                `}
              />
            </button>
          </div>

          {/* =================================================
              BIG VISIBLE INSTRUCTION
          ================================================= */}

          <div className="mt-6 text-center sm:mt-7">
            <p
              className={`
                font-mono
                text-[10px]
                font-medium
                uppercase
                tracking-[0.36em]

                transition-all
                duration-500

                sm:text-xs
                sm:tracking-[0.42em]

                ${
                  isHolding
                    ? "scale-105 text-amber-100/90"
                    : "text-white/65"
                }
              `}
            >
              {isHolding
                ? "KEEP HOLDING"
                : "PRESS & HOLD"}
            </p>

            <p
              className={`
                mt-2
                font-serif
                text-[10px]
                italic
                tracking-wide
                transition-opacity
                duration-500

                sm:text-xs

                ${
                  isHolding
                    ? "text-white/45"
                    : "text-white/25"
                }
              `}
            >
              {isHolding
                ? `${energy}% — let the universe listen`
                : "hold until the light is complete"}
            </p>
          </div>

          {/* Tiny visual cue */}

          {!isHolding && (
            <div className="mt-4 flex flex-col items-center gap-1 text-white/20 sm:mt-5">
              <ChevronDown
                size={12}
                strokeWidth={1}
                className="animate-bounce"
              />
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          WISH ACCEPTED MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-5">
          {/* Void */}

          <div className="absolute inset-0 bg-black/95 animate-[voidAppear_.9s_ease-out_forwards]" />

          {/* Portal */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-20 w-20 rounded-full border border-white/25 animate-[portalBirth_1.5s_cubic-bezier(.16,1,.3,1)_forwards] sm:h-24 sm:w-24" />

            <div className="absolute inset-[-60px] rounded-full border border-white/10 animate-[portalBirth_1.9s_cubic-bezier(.16,1,.3,1)_.1s_forwards] sm:inset-[-70px]" />

            <div className="absolute inset-[-130px] rounded-full border border-white/[0.05] animate-[portalBirth_2.3s_cubic-bezier(.16,1,.3,1)_.2s_forwards] sm:inset-[-150px]" />

            <div className="absolute inset-[-200px] rounded-full border border-white/[0.025] animate-[portalBirth_2.7s_cubic-bezier(.16,1,.3,1)_.3s_forwards] sm:inset-[-230px]" />
          </div>

          {/* Aura */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/[0.055] blur-[100px] sm:h-[450px] sm:w-[450px] sm:blur-[110px]" />

          {/* Particles */}

          {modalParticles.map(
            (particle) => (
              <span
                key={particle.id}
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-1
                  w-1
                  rounded-full
                  bg-white

                  shadow-[0_0_8px_white]

                  animate-[modalParticle_1.8s_cubic-bezier(.16,1,.3,1)_forwards]
                "
                style={{
                  "--px": `${particle.x}px`,
                  "--py": `${particle.y}px`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            )
          )}

          {/* Card */}

          <div
            className="
              relative
              w-full
              max-w-[calc(100vw-32px)]
              overflow-hidden
              rounded-[26px]
              border
              border-white/[0.13]
              bg-[#060606]
              p-6
              text-center

              shadow-[0_40px_140px_rgba(0,0,0,.95)]

              animate-[portalModal_1.1s_cubic-bezier(.16,1,.3,1)_forwards]

              sm:max-w-xl
              sm:rounded-[36px]
              sm:p-12
            "
          >
            {/* Top glow */}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.08] to-transparent sm:h-36" />

            {/* Frame */}

            <div className="pointer-events-none absolute inset-3 rounded-[21px] border border-white/[0.035] sm:rounded-[25px]" />

            {/* Header */}

            <div className="relative mb-7 flex items-center justify-center gap-3 sm:mb-8">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20 sm:w-10" />

              <Sparkles
                size={14}
                strokeWidth={1}
                className="text-white/70"
              />

              <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20 sm:w-10" />
            </div>

            <p className="relative font-mono text-[6px] uppercase tracking-[0.5em] text-white/30 sm:text-[7px] sm:tracking-[0.6em]">
              WISH ACCEPTED
            </p>

            <h2
              className="
                relative
                mt-5
                font-display
                text-[2.65rem]
                font-light
                leading-[0.9]
                tracking-[-0.06em]

                sm:mt-6
                sm:text-6xl
              "
            >
              The universe
              <br />

              <span className="text-white/25">
                heard you.
              </span>
            </h2>

            {/* Divider */}

            <div className="mx-auto mt-7 h-px max-w-xs overflow-hidden bg-white/[0.06] sm:mt-8">
              <div className="h-full w-1/3 bg-white/80 animate-[dividerTravel_2s_ease-in-out_infinite]" />
            </div>

            {/* Message */}

            <p
              className="
                mx-auto
                mt-7
                max-w-sm
                font-serif
                text-[14px]
                italic
                leading-[1.85]
                text-white/45

                sm:mt-8
                sm:text-lg
              "
            >
              May the things you quietly
              hope for find their way
              toward you.
              <br />
              Even the ones you never
              say aloud.
            </p>

            {/* Signature */}

            <p className="mt-6 font-mono text-[5px] uppercase tracking-[0.4em] text-white/20 sm:mt-7 sm:text-[6px] sm:tracking-[0.45em]">
              {birthdayData.name.toUpperCase()}{" "}
              // THE UNIVERSE REMEMBERS
            </p>

            {/* Continue */}

            <button
              type="button"
              onClick={() =>
                navigate("/celebration")
              }
              className="
                group
                relative
                mx-auto
                mt-8
                flex
                items-center
                gap-3
                overflow-hidden
                rounded-full
                border
                border-white/[0.12]
                bg-white/[0.035]
                px-6
                py-3.5

                font-mono
                text-[6px]
                uppercase
                tracking-[0.3em]
                text-white/55

                transition-all
                duration-300

                active:scale-95
                hover:border-white/25
                hover:bg-white/[0.06]

                sm:mt-9
                sm:px-7
                sm:py-4
                sm:text-[7px]
                sm:tracking-[0.35em]
              "
            >
              <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />

              <span className="relative z-10 transition-colors group-hover:text-black">
                Continue the universe
              </span>

              <ArrowRight
                size={12}
                className="
                  relative
                  z-10
                  transition-all
                  group-hover:translate-x-1
                  group-hover:text-black
                "
              />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           STARS
        ===================================================== */

        @keyframes wishTwinkle {
          0%,
          100% {
            opacity: .12;
            transform: scale(.7);
          }

          50% {
            opacity: .75;
            transform: scale(1.35);
          }
        }

        @keyframes wishStar {
          0% {
            transform:
              translate3d(0,0,0)
              scale(1);

            opacity: .8;
          }

          100% {
            transform:
              translate3d(var(--sx),var(--sy),0)
              scale(.05);

            opacity: 0;
          }
        }

        @keyframes shootingStar {
          0%,
          70%,
          100% {
            opacity: 0;
            transform:
              translate3d(-40px,-20px,0)
              rotate(35deg);
          }

          75% {
            opacity: .6;
          }

          82% {
            opacity: 0;
            transform:
              translate3d(100px,50px,0)
              rotate(35deg);
          }
        }

        /* =====================================================
           MOON
        ===================================================== */

        @keyframes moonPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.035);
          }
        }

        @keyframes moonBurst {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          15% {
            transform: scale(1.08);
            opacity: 1;
          }

          35% {
            transform: scale(.8);
          }

          52% {
            transform: scale(.12);
          }

          68% {
            transform: scale(.02);
          }

          78% {
            transform: scale(3);
            opacity: .9;
          }

          100% {
            transform: scale(14);
            opacity: 0;
          }
        }

        @keyframes energyRing {
          0% {
            transform: scale(.7);
            opacity: 0;
          }

          25% {
            opacity: .85;
          }

          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: scale(.65);
            opacity: .15;
          }

          50% {
            transform: scale(1.4);
            opacity: .75;
          }
        }

        @keyframes moonFlash {
          0% {
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          50% {
            opacity: .75;
          }

          100% {
            opacity: 0;
          }
        }

        /* =====================================================
           COSMIC EXPLOSION
        ===================================================== */

        @keyframes universeBurst {
          0% {
            transform:
              translate(-50%,-50%)
              scale(0);

            opacity: 0;
          }

          18% {
            transform:
              translate(-50%,-50%)
              scale(3);

            opacity: 1;
          }

          45% {
            transform:
              translate(-50%,-50%)
              scale(20);

            opacity: .95;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scale(160);

            opacity: 0;
          }
        }

        @keyframes cosmicFlash {
          0% {
            opacity: 0;
            transform: scale(.2);
          }

          18% {
            opacity: .9;
          }

          45% {
            opacity: .35;
            transform: scale(1.3);
          }

          100% {
            opacity: 0;
            transform: scale(1.9);
          }
        }

        @keyframes lightBeam {
          0% {
            transform:
              translate(-50%,-50%)
              scale(0);

            opacity: 0;
          }

          25% {
            opacity: .9;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scale(1);

            opacity: 0;
          }
        }

        @keyframes shockwave {
          0% {
            transform:
              translate(-50%,-50%)
              scale(.2);

            opacity: 0;
          }

          15% {
            opacity: .9;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scale(20);

            opacity: 0;
          }
        }

        /* =====================================================
           MODAL
        ===================================================== */

        @keyframes voidAppear {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes portalBirth {
          0% {
            transform:
              scale(.05)
              rotate(0deg);

            opacity: 0;
          }

          35% {
            opacity: .85;
          }

          100% {
            transform:
              scale(3)
              rotate(180deg);

            opacity: 0;
          }
        }

        @keyframes modalParticle {
          0% {
            transform:
              translate(-50%,-50%)
              scale(0);

            opacity: 0;
          }

          25% {
            opacity: .9;
          }

          100% {
            transform:
              translate(
                calc(-50% + var(--px)),
                calc(-50% + var(--py))
              )
              scale(0);

            opacity: 0;
          }
        }

        @keyframes portalModal {
          0% {
            opacity: 0;

            transform:
              translate3d(0,50px,0)
              scale(.9);

            filter: blur(10px);
          }

          70% {
            opacity: 1;

            transform:
              translate3d(0,-5px,0)
              scale(1.015);

            filter: blur(0);
          }

          100% {
            opacity: 1;

            transform:
              translate3d(0,0,0)
              scale(1);

            filter: blur(0);
          }
        }

        /* =====================================================
           ENERGY BAR
        ===================================================== */

        @keyframes energySweep {
          from {
            transform: translateX(-140%);
          }

          to {
            transform: translateX(420%);
          }
        }

        @keyframes dividerTravel {
          0% {
            transform: translateX(-150%);
          }

          50%,
          100% {
            transform: translateX(350%);
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}