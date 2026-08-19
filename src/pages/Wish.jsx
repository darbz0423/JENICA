import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { birthdayData } from "../data/birthdayData";

const STAR_COUNT = 48;

const createStars = () =>
  Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: (i * 47.73) % 100,
    y: (i * 83.17) % 100,
    size:
      i % 17 === 0
        ? 2.5
        : i % 6 === 0
        ? 1.8
        : 1,
    delay: (i % 12) * 0.18,
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
  const lastEnergyRef = useRef(0);
  const pointerDownRef = useRef(false);

  const isHolding = phase === "charging";
  const releasing = phase === "releasing";
  const complete = showModal;

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      clearInterval(chargeTimerRef.current);
      clearTimeout(modalTimerRef.current);
    };
  }, []);

  /* =========================================================
     CHARGING
     ========================================================= */

  const startWish = () => {
    if (complete || releasing || pointerDownRef.current) {
      return;
    }

    pointerDownRef.current = true;

    clearInterval(chargeTimerRef.current);

    chargeStartRef.current = performance.now();
    lastEnergyRef.current = 0;

    setEnergy(0);
    setPhase("charging");

    chargeTimerRef.current = setInterval(() => {
      const elapsed =
        performance.now() - chargeStartRef.current;

      const next = Math.min(
        100,
        Math.floor((elapsed / 2400) * 100)
      );

      /*
       * Don't cause unnecessary React renders.
       * Updating roughly every 5% is enough visually
       * because the progress bar itself is CSS animated.
       */

      if (
        next !== lastEnergyRef.current &&
        (next % 4 === 0 || next >= 100)
      ) {
        lastEnergyRef.current = next;
        setEnergy(next);
      }

      if (next >= 100) {
        clearInterval(chargeTimerRef.current);
        pointerDownRef.current = false;
        releaseWish();
      }
    }, 80);
  };

  const cancelWish = () => {
    pointerDownRef.current = false;

    if (!isHolding) return;

    clearInterval(chargeTimerRef.current);

    setPhase("idle");
    setEnergy(0);
  };

  /* =========================================================
     RELEASE
  ========================================================= */

  const releaseWish = () => {
    clearInterval(chargeTimerRef.current);
    clearTimeout(modalTimerRef.current);

    setEnergy(100);
    setPhase("releasing");

    modalTimerRef.current = setTimeout(() => {
      setShowModal(true);
    }, 2400);
  };

  const releaseInstantly = () => {
    if (complete || releasing) return;

    pointerDownRef.current = false;

    clearInterval(chargeTimerRef.current);

    setEnergy(100);
    releaseWish();
  };

  /* =========================================================
     MODAL PARTICLES
     ========================================================= */

  const modalParticles = Array.from(
    { length: 18 },
    (_, i) => {
      const angle =
        (Math.PI * 2 * i) / 18;

      const distance =
        150 + (i % 4) * 65;

      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        delay: i * 0.035,
      };
    }
  );

  return (
    <main
      className={`
        relative
        min-h-[100svh]
        overflow-hidden
        bg-[#020202]
        px-5
        pb-32
        pt-20
        text-white
        selection:bg-white
        selection:text-black

        transition-transform
        duration-[1800ms]
        ease-out

        ${
          releasing
            ? "scale-[1.018]"
            : ""
        }
      `}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className={`
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden

          ${
            showModal
              ? "opacity-20"
              : "opacity-100"
          }

          transition-opacity
          duration-1000
        `}
      >
        {/* Deep space */}

        <div className="absolute inset-0 bg-[#020203]" />

        {/* Central atmosphere */}

        <div
          className={`
            absolute
            left-1/2
            top-[44%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full

            bg-amber-100/[0.035]

            blur-[90px]

            transition-transform
            duration-[1800ms]
            ease-out

            ${
              isHolding
                ? "scale-[1.25]"
                : releasing
                ? "scale-[2.8]"
                : "scale-100"
            }
          `}
        />

        {/* Small blue atmosphere */}

        <div
          className={`
            absolute
            -left-32
            top-[25%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-blue-200/[0.025]
            blur-[100px]

            ${
              releasing
                ? "scale-[2]"
                : ""
            }
          `}
        />

        {/* Purple atmosphere */}

        <div
          className={`
            absolute
            -right-32
            top-[15%]
            h-[280px]
            w-[280px]
            rounded-full
            bg-purple-200/[0.018]
            blur-[100px]

            ${
              releasing
                ? "scale-[1.8]"
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
                    ? "animate-[wishStar_1.9s_cubic-bezier(.16,1,.3,1)_forwards]"
                    : "animate-[wishTwinkle_5s_ease-in-out_infinite]"
                }
              `}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity:
                  0.15 +
                  (star.id % 7) / 14,
                animationDelay: `${star.delay}s`,
                "--sx": `${
                  (star.x - 50) * 2.8
                }vw`,
                "--sy": `${
                  (star.y - 50) * 2.8
                }vh`,
              }}
            />
          ))}
        </div>

        {/* Horizon */}

        <div
          className={`
            absolute
            bottom-[-320px]
            left-1/2
            h-[600px]
            w-[1100px]
            -translate-x-1/2
            rounded-[50%]
            border
            border-white/[0.035]

            transition-transform
            duration-[1800ms]

            ${
              releasing
                ? "scale-[2]"
                : ""
            }
          `}
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_45%,rgba(0,0,0,.9)_100%)]
          "
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20 sm:w-14" />

          <p className="font-mono text-[6px] uppercase tracking-[0.55em] text-white/25 sm:text-[7px] sm:tracking-[0.7em]">
            THE LAST CONSTELLATION
          </p>

          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/20 sm:w-14" />
        </div>

        <h1
          className="
            mt-7
            font-display
            text-[4.3rem]
            font-light
            leading-[0.82]
            tracking-[-0.065em]

            sm:mt-8
            sm:text-8xl

            md:text-[8.5rem]
          "
        >
          Make
          <br />

          <span className="text-white/[0.18]">
            a wish.
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-7
            max-w-[330px]
            font-serif
            text-sm
            leading-[1.8]
            text-white/30

            sm:mt-8
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
          MOON
      ===================================================== */}

      <section className="relative z-10 mx-auto mt-8 flex max-w-4xl justify-center sm:mt-12">
        <div
          className={`
            relative
            h-[330px]
            w-[330px]

            sm:h-[480px]
            sm:w-[480px]

            transition-transform
            duration-[1600ms]
            ease-[cubic-bezier(.16,1,.3,1)]

            ${
              releasing
                ? "scale-[1.35]"
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

              transition-all
              duration-1000

              ${
                isHolding
                  ? "scale-[1.08] border-amber-100/20"
                  : releasing
                  ? "scale-[3] opacity-0"
                  : ""
              }
            `}
          />

          {/* Dashed orbit */}

          <div
            className={`
              absolute
              inset-[8%]
              rounded-full
              border
              border-dashed
              border-white/[0.045]

              ${
                isHolding
                  ? "animate-[spin_9s_linear_infinite] border-amber-100/20"
                  : releasing
                  ? "animate-[spin_2s_linear_infinite]"
                  : "animate-[spin_40s_linear_infinite]"
              }
            `}
          />

          {/* Inner orbit */}

          <div
            className={`
              absolute
              inset-[20%]
              rounded-full
              border
              border-white/[0.025]

              transition-transform
              duration-1000

              ${
                isHolding
                  ? "scale-[1.08]"
                  : releasing
                  ? "scale-[3]"
                  : ""
              }
            `}
          />

          {/* Orbit particles */}

          {[0, 1, 2, 3, 4, 5].map(
            (particle) => (
              <div
                key={particle}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `
                    rotate(${particle * 60}deg)
                    translateY(-${145 + particle * 5}px)
                  `,
                }}
              >
                <div
                  className={`
                    h-1
                    w-1
                    rounded-full
                    bg-white
                    shadow-[0_0_12px_rgba(255,255,255,.7)]

                    transition-transform
                    duration-700

                    ${
                      isHolding
                        ? "scale-[3]"
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
              h-[190px]
              w-[190px]
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full

              sm:h-[270px]
              sm:w-[270px]

              transition-transform
              duration-[1800ms]
              ease-[cubic-bezier(.16,1,.3,1)]

              ${
                isHolding
                  ? "scale-[1.08]"
                  : releasing
                  ? "scale-[8]"
                  : ""
              }
            `}
          >
            {/* Moon aura */}

            <div
              className={`
                absolute
                inset-[-50px]
                rounded-full
                bg-amber-100/[0.12]
                blur-[55px]

                transition-transform
                duration-700

                ${
                  isHolding
                    ? "scale-[1.35]"
                    : releasing
                    ? "scale-[2.5]"
                    : "scale-100"
                }
              `}
            />

            {/* Orbiting light */}

            <div
              className={`
                absolute
                inset-[-28px]
                rounded-full
                border
                border-white/[0.09]

                ${
                  isHolding
                    ? "animate-[spin_3.5s_linear_infinite]"
                    : releasing
                    ? "animate-[spin_1s_linear_infinite]"
                    : ""
                }
              `}
            >
              <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_16px_white]" />
            </div>

            {/* Charging rings */}

            {isHolding && (
              <>
                <div className="absolute inset-[-15px] rounded-full border border-amber-100/25 animate-[energyRing_1.5s_ease-out_infinite]" />

                <div className="absolute inset-[-35px] rounded-full border border-white/10 animate-[energyRing_2s_ease-out_.3s_infinite]" />
              </>
            )}

            {/* Actual moon */}

            <div
              className={`
                relative
                h-full
                w-full
                overflow-hidden
                rounded-full
                border
                border-white/10

                bg-[radial-gradient(circle_at_32%_25%,#fffef0_0%,#ead49c_18%,#a18b5e_42%,#4b4334_66%,#12110f_100%)]

                shadow-[inset_-35px_-30px_65px_rgba(0,0,0,.78),0_0_70px_rgba(255,220,150,.12)]

                ${
                  isHolding
                    ? "animate-[moonPulse_2.4s_ease-in-out_infinite]"
                    : releasing
                    ? "animate-[moonBurst_2.2s_cubic-bezier(.16,1,.3,1)_forwards]"
                    : ""
                }
              `}
            >
              {/* Moon light */}

              <div className="absolute left-[7%] top-[4%] h-[48%] w-[34%] rounded-full bg-white/25 blur-[22px]" />

              {/* Craters */}

              <span className="absolute left-[18%] top-[27%] h-8 w-8 rounded-full bg-black/10 blur-[2px] sm:h-10 sm:w-10" />

              <span className="absolute right-[17%] top-[45%] h-12 w-12 rounded-full bg-black/10 blur-[3px] sm:h-16 sm:w-16" />

              <span className="absolute bottom-[18%] left-[34%] h-7 w-7 rounded-full bg-black/10 blur-[2px]" />

              <span className="absolute bottom-[29%] right-[32%] h-4 w-4 rounded-full bg-black/10" />

              <span className="absolute left-[47%] top-[18%] h-5 w-5 rounded-full bg-black/10 blur-[2px]" />

              {/* Energy core */}

              {isHolding && (
                <div className="absolute inset-[30%] rounded-full bg-white/20 blur-[25px] animate-[corePulse_1.1s_ease-in-out_infinite]" />
              )}

              {/* Flash */}

              {releasing && (
                <div className="absolute inset-0 bg-white animate-[moonFlash_1.1s_ease-out_forwards]" />
              )}
            </div>

            {/* =================================================
                RELEASE EFFECT
            ================================================= */}

            {releasing && (
              <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
                {/* Central light */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-5
                    w-5
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    shadow-[0_0_80px_35px_rgba(255,255,255,.85)]

                    animate-[universeBurst_2s_cubic-bezier(.16,1,.3,1)_forwards]
                  "
                />

                {/* Flash */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,.9)_0%,rgba(255,225,170,.35)_10%,transparent_55%)]

                    animate-[cosmicFlash_2s_ease-out_forwards]
                  "
                />

                {/* Horizontal light */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-px
                    w-[120vw]
                    -translate-x-1/2
                    -translate-y-1/2
                    bg-gradient-to-r
                    from-transparent
                    via-white
                    to-transparent

                    animate-[lightBeam_1.3s_ease-out_forwards]
                  "
                />

                {/* Vertical light */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[120vh]
                    w-px
                    -translate-x-1/2
                    -translate-y-1/2
                    bg-gradient-to-b
                    from-transparent
                    via-white
                    to-transparent

                    animate-[lightBeam_1.3s_ease-out_forwards]
                  "
                />

                {/* Shockwaves */}

                {[0, 1, 2].map((wave) => (
                  <div
                    key={wave}
                    className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
                    style={{
                      animation: `shockwave ${
                        1.5 + wave * 0.25
                      }s cubic-bezier(.16,1,.3,1) ${
                        wave * 0.18
                      }s forwards`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ENERGY
      ===================================================== */}

      {!complete && (
        <section className="relative z-20 mx-auto mt-1 w-full max-w-md">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/20">
              Wish energy
            </span>

            <span className="font-mono text-[6px] text-white/25">
              {String(energy).padStart(3, "0")}%
            </span>
          </div>

          <div className="relative h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="
                h-full
                bg-gradient-to-r
                from-white/10
                via-amber-100/80
                to-white

                transition-[width]
                duration-100
                ease-linear
              "
              style={{
                width: `${energy}%`,
              }}
            />

            {isHolding && (
              <div className="absolute inset-y-0 left-0 w-1/3 animate-[energySweep_1s_linear_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          BUTTON
      ===================================================== */}

      {!complete && !releasing && (
        <div className="relative z-20 mt-9 flex flex-col items-center">
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
                releaseInstantly();
              } else {
                cancelWish();
              }
            }}
            onPointerCancel={cancelWish}
            onPointerLeave={(event) => {
              /*
               * Don't cancel when a finger leaves the button
               * accidentally on mobile.
               *
               * Mouse still behaves naturally.
               */
              if (event.pointerType === "mouse") {
                cancelWish();
              }
            }}
            className={`
              group
              relative
              flex
              h-[82px]
              w-[82px]
              touch-none
              select-none
              items-center
              justify-center
              rounded-full
              border

              transition-transform
              duration-500

              ${
                isHolding
                  ? "scale-110 border-amber-100/60 bg-amber-100/[0.08] shadow-[0_0_70px_rgba(255,220,150,.22)]"
                  : "border-white/10 bg-white/[0.025]"
              }
            `}
            aria-label="Press and hold to make a wish"
          >
            {/* Outer ring */}

            <span className="pointer-events-none absolute inset-[-7px] rounded-full border border-white/[0.05]" />

            {/* Charging ring */}

            <span
              className={`
                pointer-events-none
                absolute
                inset-[-15px]
                rounded-full
                border

                ${
                  isHolding
                    ? "animate-[spin_2.5s_linear_infinite] border-amber-100/25"
                    : "border-white/[0.025]"
                }
              `}
            />

            {/* Icon */}

            <Star
              size={18}
              strokeWidth={1}
              className={`
                transition-transform
                duration-500

                ${
                  isHolding
                    ? "scale-125 fill-white text-white"
                    : "text-white/45"
                }
              `}
            />
          </button>

          <p className="mt-5 font-mono text-[6px] uppercase tracking-[0.4em] text-white/20">
            {isHolding
              ? "The universe is listening"
              : "Press and hold"}
          </p>

          <button
            type="button"
            onClick={releaseInstantly}
            className="
              mt-5
              font-mono
              text-[6px]
              uppercase
              tracking-[0.3em]
              text-white/10
              transition-colors
              hover:text-white/40
            "
          >
            I already know my wish
          </button>
        </div>
      )}

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-5">
          {/* Background */}

          <div className="absolute inset-0 bg-black/90 animate-[voidAppear_.9s_ease-out_forwards]" />

          {/* Portal */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-24 w-24 rounded-full border border-white/20 animate-[portalBirth_1.5s_cubic-bezier(.16,1,.3,1)_forwards]" />

            <div className="absolute inset-[-70px] rounded-full border border-white/10 animate-[portalBirth_1.9s_cubic-bezier(.16,1,.3,1)_.1s_forwards]" />

            <div className="absolute inset-[-150px] rounded-full border border-white/[0.05] animate-[portalBirth_2.3s_cubic-bezier(.16,1,.3,1)_.2s_forwards]" />
          </div>

          {/* Aura */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/[0.05] blur-[100px]" />

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

          {/* =================================================
              MODAL CARD
          ================================================= */}

          <div
            className="
              relative
              w-full
              max-w-xl
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.12]
              bg-[#070707]
              p-7
              text-center
              shadow-[0_40px_120px_rgba(0,0,0,.9)]

              animate-[portalModal_1.1s_cubic-bezier(.16,1,.3,1)_forwards]

              sm:rounded-[34px]
              sm:p-12
            "
          >
            {/* Top glow */}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.07] to-transparent" />

            {/* Frame */}

            <div className="pointer-events-none absolute inset-3 rounded-[23px] border border-white/[0.035]" />

            {/* Header */}

            <div className="relative mb-8 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" />

              <Sparkles
                size={14}
                strokeWidth={1}
                className="text-white/60"
              />

              <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <p className="relative font-mono text-[6px] uppercase tracking-[0.6em] text-white/25">
              WISH ACCEPTED
            </p>

            <h2
              className="
                relative
                mt-6
                font-display
                text-[3.1rem]
                leading-[0.9]
                tracking-[-0.055em]

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

            <div className="mx-auto mt-8 h-px max-w-xs overflow-hidden bg-white/[0.06]">
              <div className="h-full w-1/3 bg-white/70 animate-[dividerTravel_2s_ease-in-out_infinite]" />
            </div>

            {/* Message */}

            <p
              className="
                mx-auto
                mt-8
                max-w-sm
                font-serif
                text-base
                italic
                leading-[1.9]
                text-white/40

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

            <p className="mt-7 font-mono text-[5px] uppercase tracking-[0.45em] text-white/15">
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
                mt-9
                flex
                items-center
                gap-3
                overflow-hidden
                rounded-full
                border
                border-white/[0.1]
                bg-white/[0.03]
                px-6
                py-3.5
                font-mono
                text-[6px]
                uppercase
                tracking-[0.35em]
                text-white/50
                transition-transform
                duration-300
                active:scale-95
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
                className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:text-black"
              />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        /* =====================================================
           CORE
        ===================================================== */

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
            opacity: .65;
            transform: scale(1.25);
          }
        }

        @keyframes wishStar {
          0% {
            transform: translate3d(0,0,0) scale(1);
            opacity: .7;
          }

          100% {
            transform:
              translate3d(var(--sx), var(--sy), 0)
              scale(.1);

            opacity: 0;
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
            transform: scale(1.025);
          }
        }

        @keyframes moonBurst {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          18% {
            transform: scale(1.08);
            opacity: 1;
          }

          38% {
            transform: scale(.78);
            opacity: 1;
          }

          55% {
            transform: scale(.15);
            opacity: 1;
          }

          68% {
            transform: scale(.02);
            opacity: 1;
          }

          78% {
            transform: scale(3);
            opacity: .9;
          }

          100% {
            transform: scale(13);
            opacity: 0;
          }
        }

        @keyframes energyRing {
          0% {
            transform: scale(.75);
            opacity: 0;
          }

          25% {
            opacity: .8;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: scale(.7);
            opacity: .15;
          }

          50% {
            transform: scale(1.3);
            opacity: .6;
          }
        }

        @keyframes moonFlash {
          0% {
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          55% {
            opacity: .7;
          }

          100% {
            opacity: 0;
          }
        }

        /* =====================================================
           EXPLOSION
        ===================================================== */

        @keyframes universeBurst {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0);

            opacity: 0;
          }

          18% {
            transform:
              translate(-50%, -50%)
              scale(3);

            opacity: 1;
          }

          45% {
            transform:
              translate(-50%, -50%)
              scale(20);

            opacity: .9;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(150);

            opacity: 0;
          }
        }

        @keyframes cosmicFlash {
          0% {
            opacity: 0;
            transform: scale(.2);
          }

          18% {
            opacity: .8;
          }

          45% {
            opacity: .3;
            transform: scale(1.3);
          }

          100% {
            opacity: 0;
            transform: scale(1.8);
          }
        }

        @keyframes lightBeam {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0);

            opacity: 0;
          }

          30% {
            opacity: .8;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(1);

            opacity: 0;
          }
        }

        @keyframes shockwave {
          0% {
            transform:
              translate(-50%, -50%)
              scale(.2);

            opacity: 0;
          }

          15% {
            opacity: .8;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(18);

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
            transform: scale(.05) rotate(0deg);
            opacity: 0;
          }

          35% {
            opacity: .8;
          }

          100% {
            transform: scale(3) rotate(180deg);
            opacity: 0;
          }
        }

        @keyframes modalParticle {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0);

            opacity: 0;
          }

          25% {
            opacity: .8;
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
              translate3d(0, 50px, 0)
              scale(.92);

            filter: blur(8px);
          }

          70% {
            opacity: 1;

            transform:
              translate3d(0, -5px, 0)
              scale(1.01);

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

        @keyframes energySweep {
          from {
            transform: translateX(-120%);
          }

          to {
            transform: translateX(400%);
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
           MOBILE PERFORMANCE
        ===================================================== */

        @media (max-width: 640px) {
          /*
           * Keep the compositor workload small.
           */

          .wish-heavy-effect {
            display: none;
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