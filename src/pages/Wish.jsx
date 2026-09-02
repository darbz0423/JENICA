import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { birthdayData } from "../data/birthdayData";

/* ============================================================
   PERFORMANCE CONFIG
============================================================ */

const getIsMobile = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
};

const MOBILE_STAR_COUNT = 20;
const DESKTOP_STAR_COUNT = 48;

const CHARGE_DURATION = 2400;

/* ============================================================
   STAR GENERATOR
============================================================ */

const createStars = (isMobile) => {
  const count = isMobile
    ? MOBILE_STAR_COUNT
    : DESKTOP_STAR_COUNT;

  return Array.from(
    { length: count },
    (_, i) => ({
      id: i,

      x: (i * 47.73 + 3) % 100,

      y: (i * 83.17 + 7) % 100,

      size:
        i % 19 === 0
          ? 2.2
          : i % 7 === 0
          ? 1.5
          : 0.8,

      delay:
        (i % 12) * 0.2,

      duration:
        4 +
        (i % 5) * 0.8,
    })
  );
};

/* ============================================================
   COMPONENT
============================================================ */

export default function Wish() {
  const navigate = useNavigate();

  const [isMobile] =
    useState(getIsMobile);

  const [phase, setPhase] =
    useState("idle");

  const [energy, setEnergy] =
    useState(0);

  const [showModal, setShowModal] =
    useState(false);

  const stars = useMemo(
    () => createStars(isMobile),
    [isMobile]
  );

  const chargeFrameRef =
    useRef(null);

  const modalTimerRef =
    useRef(null);

  const chargeStartRef =
    useRef(0);

  const lastEnergyRef =
    useRef(-1);

  const pointerDownRef =
    useRef(false);

  const completedRef =
    useRef(false);

  const releaseStartedRef =
    useRef(false);

  const phaseRef =
    useRef("idle");

  const isHolding =
    phase === "charging";

  const releasing =
    phase === "releasing";

  const complete =
    showModal;

  /* ============================================================
     MODAL PARTICLES
  ============================================================ */

  const modalParticles =
    useMemo(() => {
      const count =
        isMobile
          ? 10
          : 18;

      return Array.from(
        { length: count },
        (_, i) => {
          const angle =
            (Math.PI * 2 * i) /
            count;

          const distance =
            isMobile
              ? 80 +
                (i % 4) * 24
              : 110 +
                (i % 5) * 38;

          return {
            id: i,

            x:
              Math.cos(angle) *
              distance,

            y:
              Math.sin(angle) *
              distance,

            delay:
              i * 0.035,
          };
        }
      );
    }, [isMobile]);

  /* ============================================================
     PHASE SYNC
  ============================================================ */

  useEffect(() => {
    phaseRef.current =
      phase;
  }, [phase]);

  /* ============================================================
     CLEANUP
  ============================================================ */

  const clearTimers =
    useCallback(() => {
      if (
        chargeFrameRef.current
      ) {
        cancelAnimationFrame(
          chargeFrameRef.current
        );

        chargeFrameRef.current =
          null;
      }

      if (
        modalTimerRef.current
      ) {
        clearTimeout(
          modalTimerRef.current
        );

        modalTimerRef.current =
          null;
      }
    }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  /* ============================================================
     RELEASE WISH
  ============================================================ */

  const releaseWish =
    useCallback(() => {
      if (
        releaseStartedRef.current
      ) {
        return;
      }

      releaseStartedRef.current =
        true;

      if (
        chargeFrameRef.current
      ) {
        cancelAnimationFrame(
          chargeFrameRef.current
        );

        chargeFrameRef.current =
          null;
      }

      pointerDownRef.current =
        false;

      setEnergy(100);

      setPhase(
        "releasing"
      );

      modalTimerRef.current =
        setTimeout(() => {
          setShowModal(true);
        }, 2100);
    }, []);

  /* ============================================================
     WISH CHARGING
  ============================================================ */

  const startWish =
    useCallback(() => {
      if (
        showModal ||
        releaseStartedRef.current ||
        pointerDownRef.current
      ) {
        return;
      }

      pointerDownRef.current =
        true;

      completedRef.current =
        false;

      lastEnergyRef.current =
        -1;

      chargeStartRef.current =
        performance.now();

      setEnergy(0);

      setPhase(
        "charging"
      );

      const updateCharge =
        (time) => {
          if (
            !pointerDownRef.current
          ) {
            return;
          }

          const elapsed =
            time -
            chargeStartRef.current;

          const progress =
            Math.min(
              100,
              Math.floor(
                (
                  elapsed /
                  CHARGE_DURATION
                ) * 100
              )
            );

          /*
           * IMPORTANT:
           * Reduce React renders.
           * Updating every frame causes lag.
           */

          if (
            progress !==
              lastEnergyRef.current &&
            (
              progress % 4 === 0 ||
              progress >= 100
            )
          ) {
            lastEnergyRef.current =
              progress;

            setEnergy(
              progress
            );
          }

          if (
            progress >= 100
          ) {
            pointerDownRef.current =
              false;

            completedRef.current =
              true;

            releaseWish();

            return;
          }

          chargeFrameRef.current =
            requestAnimationFrame(
              updateCharge
            );
        };

      chargeFrameRef.current =
        requestAnimationFrame(
          updateCharge
        );
    }, [
      releaseWish,
      showModal,
    ]);

  /* ============================================================
     CANCEL WISH
  ============================================================ */

  const cancelWish =
    useCallback(() => {
      pointerDownRef.current =
        false;

      if (
        phaseRef.current !==
        "charging"
      ) {
        return;
      }

      if (
        chargeFrameRef.current
      ) {
        cancelAnimationFrame(
          chargeFrameRef.current
        );

        chargeFrameRef.current =
          null;
      }

      setPhase(
        "idle"
      );

      setEnergy(0);

      lastEnergyRef.current =
        -1;
    }, []);

  /* ============================================================
     PROGRESS
  ============================================================ */

  const progressOffset =
    364.4 -
    (
      364.4 *
      energy
    ) /
      100;

  /* ============================================================
     RENDER
  ============================================================ */

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
        duration-[1200ms]
        ease-[cubic-bezier(.16,1,.3,1)]

        sm:px-5
        sm:pb-16
        sm:pt-14

        ${
          releasing
            ? "scale-[1.01]"
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
          duration-700

          ${
            showModal
              ? "opacity-[0.08]"
              : "opacity-100"
          }
        `}
      >

        <div className="absolute inset-0 bg-[#010101]" />

        {/* =================================================
            CENTRAL NEBULA
        ================================================= */}

        <div
          className={`
            absolute
            left-1/2
            top-[43%]

            h-[240px]
            w-[240px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-[radial-gradient(circle,rgba(255,225,170,.07)_0%,rgba(255,210,140,.02)_38%,transparent_70%)]

            blur-[18px]

            sm:h-[340px]
            sm:w-[340px]
            sm:blur-[35px]

            transition-transform
            duration-[1200ms]
            ease-[cubic-bezier(.16,1,.3,1)]

            ${
              isHolding
                ? "scale-[1.45] will-change-transform"
                : releasing
                ? "scale-[3.5] will-change-transform"
                : ""
            }
          `}
        />

        {/* =================================================
            GOLD ATMOSPHERE
        ================================================= */}

        {!isMobile && (
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

              bg-amber-100/[0.018]

              blur-[55px]

              transition-transform
              duration-700

              ${
                isHolding
                  ? "scale-[1.5]"
                  : releasing
                  ? "scale-[2.8]"
                  : ""
              }
            `}
          />
        )}

        {/* =================================================
            DESKTOP ATMOSPHERE ONLY
        ================================================= */}

        {!isMobile && (
          <>
            <div
              className={`
                absolute
                -left-32
                top-[20%]

                h-[300px]
                w-[300px]

                rounded-full

                bg-blue-300/[0.012]

                blur-[70px]

                transition-transform
                duration-[1200ms]

                ${
                  releasing
                    ? "scale-[2]"
                    : ""
                }
              `}
            />

            <div
              className={`
                absolute
                -right-40
                bottom-[8%]

                h-[320px]
                w-[320px]

                rounded-full

                bg-purple-300/[0.01]

                blur-[80px]

                transition-transform
                duration-[1200ms]

                ${
                  releasing
                    ? "scale-[2]"
                    : ""
                }
              `}
            />
          </>
        )}

        {/* =================================================
            STARS
        ================================================= */}

        <div className="absolute inset-0">

          {stars.map(
            (star) => (
              <span
                key={star.id}
                className={`
                  absolute
                  rounded-full
                  bg-white

                  ${
                    releasing
                      ? "animate-[wishStar_1.5s_cubic-bezier(.16,1,.3,1)_forwards]"
                      : !isMobile &&
                        star.id % 3 === 0
                      ? "animate-[wishTwinkle_var(--duration)_ease-in-out_infinite]"
                      : ""
                  }
                `}
                style={{
                  left:
                    `${star.x}%`,

                  top:
                    `${star.y}%`,

                  width:
                    `${star.size}px`,

                  height:
                    `${star.size}px`,

                  opacity:
                    0.15 +
                    (star.id % 6) /
                      14,

                  animationDelay:
                    `${star.delay}s`,

                  "--duration":
                    `${star.duration}s`,

                  "--sx":
                    `${
                      (star.x - 50) *
                      2.2
                    }vw`,

                  "--sy":
                    `${
                      (star.y - 50) *
                      2.2
                    }vh`,
                }}
              />
            )
          )}

        </div>

        {/* Desktop shooting stars */}

        {!isMobile && (
          <div className="absolute left-[18%] top-[24%] h-px w-14 rotate-[35deg] bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shootingStar_9s_ease-in-out_infinite]" />
        )}

        {/* Horizon */}

        {!isMobile && (
          <div
            className={`
              absolute
              bottom-[-360px]
              left-1/2

              h-[650px]
              w-[1000px]

              -translate-x-1/2

              rounded-[50%]

              border
              border-white/[0.025]

              transition-transform
              duration-[1400ms]

              ${
                releasing
                  ? "scale-[1.8]"
                  : ""
              }
            `}
          />
        )}

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.25)_60%,rgba(0,0,0,.92)_100%)]" />

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

          <span className="text-white/[0.2]">
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
          UNIVERSE CORE
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
            duration-[1200ms]
            ease-[cubic-bezier(.16,1,.3,1)]

            ${
              releasing
                ? "scale-[1.15] will-change-transform"
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
              border-white/[0.04]

              transition-all
              duration-700

              ${
                isHolding
                  ? "scale-[1.04] border-amber-100/15"
                  : releasing
                  ? "scale-[2] opacity-0"
                  : ""
              }
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
              border-white/[0.04]

              ${
                isHolding
                  ? "animate-[spin_9s_linear_infinite]"
                  : !isMobile
                  ? "animate-[spin_45s_linear_infinite]"
                  : ""
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
              border-white/[0.03]

              transition-transform
              duration-700

              ${
                isHolding
                  ? "scale-[1.05]"
                  : releasing
                  ? "scale-[2]"
                  : ""
              }
            `}
          />

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
              duration-[1400ms]

              ${
                isHolding
                  ? "scale-[1.05]"
                  : releasing
                  ? "scale-[5]"
                  : ""
              }
            `}
          >

            {/* Aura */}

            <div
              className={`
                absolute
                inset-[-28px]

                rounded-full

                bg-[radial-gradient(circle,rgba(255,235,190,.16),rgba(255,210,140,.04),transparent_70%)]

                blur-[14px]

                sm:inset-[-45px]
                sm:blur-[28px]

                transition-transform
                duration-700

                ${
                  isHolding
                    ? "scale-[1.25]"
                    : releasing
                    ? "scale-[2]"
                    : ""
                }
              `}
            />

            {/* Energy rings */}

            {isHolding && (
              <div className="absolute inset-[-12px] rounded-full border border-amber-100/25 animate-[energyRing_1.6s_ease-out_infinite]" />
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

                shadow-[inset_-30px_-25px_55px_rgba(0,0,0,.8),inset_15px_10px_25px_rgba(255,255,255,.13),0_0_55px_rgba(255,220,150,.12)]

                ${
                  isHolding
                    ? "animate-[moonPulse_2.4s_ease-in-out_infinite]"
                    : releasing
                    ? "animate-[moonBurst_2s_cubic-bezier(.16,1,.3,1)_forwards]"
                    : ""
                }
              `}
            >

              <div className="absolute left-[5%] top-[3%] h-[48%] w-[38%] rounded-full bg-white/25 blur-[14px]" />

              <span className="absolute left-[18%] top-[27%] h-7 w-7 rounded-full bg-black/10 blur-[2px] sm:h-10 sm:w-10" />

              <span className="absolute right-[17%] top-[43%] h-10 w-10 rounded-full bg-black/10 blur-[3px] sm:h-16 sm:w-16" />

              <span className="absolute bottom-[18%] left-[33%] h-6 w-6 rounded-full bg-black/10 blur-[2px]" />

              {isHolding && (
                <div className="absolute inset-[32%] rounded-full bg-white/20 blur-[14px] animate-[corePulse_1.3s_ease-in-out_infinite]" />
              )}

              {releasing && (
                <div className="absolute inset-0 bg-white animate-[moonFlash_.8s_ease-out_forwards]" />
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SIMPLE RELEASE FLASH
      ===================================================== */}

      {releasing && (
        <div className="pointer-events-none fixed inset-0 z-[80]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.85)_0%,rgba(255,225,170,.3)_10%,transparent_55%)] animate-[cosmicFlash_1.8s_ease-out_forwards]" />

          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_55px_20px_rgba(255,255,255,.8)] animate-[universeBurst_1.8s_cubic-bezier(.16,1,.3,1)_forwards]" />

          {!isMobile && (
            <div className="absolute left-1/2 top-1/2 h-px w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent animate-[lightBeam_1s_ease-out_forwards]" />
          )}

        </div>
      )}

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

                ${
                  isHolding
                    ? "text-amber-100/70"
                    : "text-white/25"
                }
              `}
            >
              {String(energy).padStart(
                3,
                "0"
              )}
              %
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

                shadow-[0_0_10px_rgba(255,225,170,.3)]

                transition-[width]
                duration-100
                ease-linear
              "
              style={{
                width:
                  `${energy}%`,
              }}
            />

          </div>

        </section>
      )}

      {/* =====================================================
          HOLD INTERACTION
      ===================================================== */}

      {!complete &&
        !releasing && (
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
                    progressOffset
                  }
                  className="transition-[stroke-dashoffset] duration-100 ease-linear"
                />

              </svg>

              {/* Glow */}

              {isHolding && (
                <div className="pointer-events-none absolute inset-[-15px] rounded-full bg-amber-100/[0.06] blur-[15px]" />
              )}

              {/* Button */}

              <button
                type="button"
                onPointerDown={(
                  event
                ) => {
                  event.currentTarget
                    .setPointerCapture?.(
                      event.pointerId
                    );

                  startWish();
                }}
                onPointerUp={() => {
                  if (
                    energy >= 96 ||
                    completedRef.current
                  ) {
                    pointerDownRef.current =
                      false;

                    releaseWish();
                  } else {
                    cancelWish();
                  }
                }}
                onPointerCancel={
                  cancelWish
                }
                onPointerLeave={(
                  event
                ) => {
                  if (
                    event.pointerType ===
                      "mouse" &&
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

                  overflow-hidden
                  rounded-full

                  border

                  transition-all
                  duration-300

                  active:scale-95

                  sm:h-[82px]
                  sm:w-[82px]

                  ${
                    isHolding
                      ? "scale-105 border-amber-100/60 bg-amber-100/[0.1] shadow-[0_0_40px_rgba(255,220,150,.2)]"
                      : "border-white/[0.14] bg-white/[0.035] shadow-[0_12px_40px_rgba(0,0,0,.4)]"
                  }
                `}
                aria-label="Press and hold to make a wish"
              >

                <Star
                  size={19}
                  strokeWidth={1.1}
                  className={`
                    relative
                    z-10

                    transition-all
                    duration-300

                    ${
                      isHolding
                        ? "scale-125 fill-white text-white"
                        : "text-white/55"
                    }
                  `}
                />

              </button>

            </div>

            {/* Instruction */}

            <div className="mt-6 text-center sm:mt-7">

              <p
                className={`
                  font-mono
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.36em]

                  transition-colors
                  duration-300

                  sm:text-xs
                  sm:tracking-[0.42em]

                  ${
                    isHolding
                      ? "text-amber-100/90"
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

            {!isHolding && (
              <ChevronDown
                size={12}
                strokeWidth={1}
                className="mt-4 animate-bounce text-white/20 sm:mt-5"
              />
            )}

          </section>
        )}

      {/* =====================================================
          WISH ACCEPTED MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-5">

          <div className="absolute inset-0 bg-black/95 animate-[voidAppear_.7s_ease-out_forwards]" />

          {/* Particles */}

          {!isMobile &&
            modalParticles.map(
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

                    animate-[modalParticle_1.5s_cubic-bezier(.16,1,.3,1)_forwards]
                  "
                  style={{
                    "--px":
                      `${particle.x}px`,

                    "--py":
                      `${particle.y}px`,

                    animationDelay:
                      `${particle.delay}s`,
                  }}
                />
              )
            )}

          {/* CARD */}

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

              shadow-[0_25px_70px_rgba(0,0,0,.9)]

              animate-[portalModal_.8s_cubic-bezier(.16,1,.3,1)_forwards]

              sm:max-w-xl
              sm:rounded-[36px]
              sm:p-12
            "
          >

            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.07] to-transparent" />

            <div className="relative mb-7 flex items-center justify-center gap-3 sm:mb-8">

              <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />

              <Sparkles
                size={14}
                strokeWidth={1}
                className="text-white/70"
              />

              <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />

            </div>

            <p className="relative font-mono text-[6px] uppercase tracking-[0.5em] text-white/30">
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

            <div className="mx-auto mt-7 h-px max-w-xs bg-white/[0.06] sm:mt-8" />

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

            <p className="mt-6 font-mono text-[5px] uppercase tracking-[0.4em] text-white/20 sm:mt-7 sm:text-[6px]">
              {birthdayData.name.toUpperCase()}
              {" "}
              // THE UNIVERSE REMEMBERS
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/celebration"
                )
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
          OPTIMIZED ANIMATIONS
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

        @keyframes wishTwinkle {
          0%,
          100% {
            opacity: .15;
            transform: scale(.8);
          }

          50% {
            opacity: .7;
            transform: scale(1.2);
          }
        }

        @keyframes wishStar {
          from {
            transform:
              translate3d(0,0,0)
              scale(1);

            opacity: .7;
          }

          to {
            transform:
              translate3d(
                var(--sx),
                var(--sy),
                0
              )
              scale(.1);

            opacity: 0;
          }
        }

        @keyframes shootingStar {
          0%,
          75%,
          100% {
            opacity: 0;
            transform:
              translate3d(-30px,-15px,0)
              rotate(35deg);
          }

          80% {
            opacity: .5;
          }

          88% {
            opacity: 0;
            transform:
              translate3d(80px,40px,0)
              rotate(35deg);
          }
        }

        @keyframes moonPulse {
          0%,
          100% {
            transform:
              scale(1);
          }

          50% {
            transform:
              scale(1.025);
          }
        }

        @keyframes moonBurst {
          0% {
            transform:
              scale(1);

            opacity: 1;
          }

          40% {
            transform:
              scale(.7);
          }

          65% {
            transform:
              scale(.05);
          }

          100% {
            transform:
              scale(10);

            opacity: 0;
          }
        }

        @keyframes energyRing {
          0% {
            transform:
              scale(.75);

            opacity: 0;
          }

          30% {
            opacity: .7;
          }

          100% {
            transform:
              scale(1.35);

            opacity: 0;
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform:
              scale(.7);

            opacity: .15;
          }

          50% {
            transform:
              scale(1.25);

            opacity: .55;
          }
        }

        @keyframes moonFlash {
          0% {
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes universeBurst {
          0% {
            transform:
              translate(-50%,-50%)
              scale(0);

            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scale(100);

            opacity: 0;
          }
        }

        @keyframes cosmicFlash {
          0% {
            opacity: 0;
          }

          20% {
            opacity: .8;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes lightBeam {
          0% {
            transform:
              translate(-50%,-50%)
              scaleX(0);

            opacity: 0;
          }

          30% {
            opacity: .8;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scaleX(1);

            opacity: 0;
          }
        }

        @keyframes voidAppear {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
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
            opacity: .7;
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
          from {
            opacity: 0;

            transform:
              translate3d(0,35px,0)
              scale(.94);
          }

          to {
            opacity: 1;

            transform:
              translate3d(0,0,0)
              scale(1);
          }
        }

        @media (max-width: 767px) {
          *,
          *::before,
          *::after {
            -webkit-tap-highlight-color:
              transparent;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          *,
          *::before,
          *::after {
            animation-duration:
              .01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              .01ms !important;

            scroll-behavior:
              auto !important;
          }
        }
      `}</style>

    </main>
  );
}