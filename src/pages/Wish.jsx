import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { birthdayData } from "../data/birthdayData";

export default function Wish() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("idle");
  const [energy, setEnergy] = useState(0);
  const [stars, setStars] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const intervalRef = useRef(null);
  const modalTimeoutRef = useRef(null);

  const isHolding = phase === "charging";
  const releasing = phase === "releasing";
  const complete = showModal;

  useEffect(() => {
    const generated = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: (i * 47) % 100,
      y: (i * 83) % 100,
      size: i % 17 === 0 ? 3 : i % 5 === 0 ? 2 : 1,
      delay: (i % 20) * 0.12,
    }));

    setStars(generated);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  // =========================================================
  // WISH CHARGING
  // =========================================================

  const startWish = () => {
    if (complete || releasing || isHolding) return;

    clearInterval(intervalRef.current);

    setPhase("charging");
    setEnergy(0);

    intervalRef.current = setInterval(() => {
      setEnergy((current) => {
        const next = current + 3;

        if (next >= 100) {
          clearInterval(intervalRef.current);
          releaseWish();
          return 100;
        }

        return next;
      });
    }, 60);
  };

  const cancelWish = () => {
    if (!isHolding) return;

    clearInterval(intervalRef.current);
    setPhase("idle");
    setEnergy(0);
  };

  // =========================================================
  // COSMIC RELEASE
  // =========================================================

  const releaseWish = () => {
    clearInterval(intervalRef.current);
    clearTimeout(modalTimeoutRef.current);

    setEnergy(100);

    /*
      IMPORTANT:

      We NEVER change the phase back to "released".

      "releasing" remains active while the moon expands
      beyond the entire screen.

      This prevents the moon from snapping back.
    */

    setPhase("releasing");

    /*
      Wait for the cosmic explosion before revealing
      the modal.
    */

    modalTimeoutRef.current = setTimeout(() => {
      setShowModal(true);
    }, 3000);
  };

  const releaseInstantly = () => {
    if (complete || releasing) return;

    clearInterval(intervalRef.current);

    setEnergy(100);
    releaseWish();
  };

  return (
    <main
      className={`
        relative min-h-screen overflow-hidden bg-[#010102]
        px-6 pb-32 pt-24
        transition-all duration-[2200ms]

        ${
          releasing
            ? "scale-[1.035]"
            : ""
        }
      `}
    >
      {/* =====================================================
          COSMIC BACKGROUND
      ===================================================== */}

      <div
        className={`
          pointer-events-none fixed inset-0 -z-10 overflow-hidden

          transition-all duration-[2200ms]

          ${
            releasing
              ? "brightness-[2] saturate-[1.8]"
              : ""
          }

          ${
            showModal
              ? "brightness-[0.18] blur-[8px]"
              : ""
          }
        `}
      >
        {/* Deep space */}

        <div className="absolute inset-0 bg-[#010102]" />

        {/* Main golden nebula */}

        <div
          className={`
            absolute left-1/2 top-[42%]
            h-[750px] w-[750px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            blur-[160px]

            transition-all duration-[2200ms]

            ${
              releasing
                ? "scale-[3.5] bg-amber-100/40"
                : isHolding
                ? "scale-[1.45] bg-amber-200/12"
                : "bg-amber-200/[0.025]"
            }
          `}
        />

        {/* Blue nebula */}

        <div
          className={`
            absolute left-[20%] top-[35%]
            h-[500px] w-[500px]
            rounded-full
            blur-[180px]

            transition-all duration-[3000ms]

            ${
              releasing
                ? "scale-[3] bg-blue-200/20"
                : "bg-blue-300/[0.025]"
            }
          `}
        />

        {/* Purple secondary nebula */}

        <div
          className={`
            absolute right-[10%] top-[20%]
            h-[450px] w-[450px]
            rounded-full
            blur-[180px]

            transition-all duration-[3000ms]

            ${
              releasing
                ? "scale-[2.5] bg-purple-200/15"
                : "bg-purple-300/[0.015]"
            }
          `}
        />

        {/* Horizon */}

        <div
          className={`
            absolute bottom-[-400px]
            left-1/2
            h-[750px]
            w-[1300px]
            -translate-x-1/2
            rounded-[50%]
            border border-white/[0.035]

            transition-all duration-[2200ms]

            ${
              releasing
                ? "scale-[2.5] border-white/30"
                : ""
            }
          `}
        />

        {/* Stars */}

        {stars.map((star) => (
          <span
            key={star.id}
            className={`
              absolute
              rounded-full
              bg-white

              ${
                releasing
                  ? "animate-[starExplosion_2.8s_cubic-bezier(.16,1,.3,1)_forwards]"
                  : "animate-[twinkle_4s_ease-in-out_infinite]"
              }
            `}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.08 + (star.id % 9) / 14,
              animationDelay: `${star.delay}s`,

              "--sx": `${(star.x - 50) * 3.5}vw`,
              "--sy": `${(star.y - 50) * 3.5}vh`,
            }}
          />
        ))}

        {/* Vignette */}

        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_center,transparent_8%,rgba(0,0,0,.94)_100%)]
          "
        />

        {/* Grain */}

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            [background-image:url('data:image/svg+xml,%3Csvg
            viewBox=%220 0 180 180%22
            xmlns=%22http://www.w3.org/2000/svg%22%3E
            %3Cfilter id=%22n%22%3E
            %3CfeTurbulence
            type=%22fractalNoise%22
            baseFrequency=%22.8%22
            numOctaves=%224%22/%3E
            %3C/filter%3E
            %3Crect
            width=%22100%25%22
            height=%22100%25%22
            filter=%22url(%23n)%22
            opacity=%22.8%22/%3E
            %3C/svg%3E')]
          "
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-white/20" />

          <p className="font-mono text-[7px] uppercase tracking-[0.7em] text-white/25">
            THE LAST CONSTELLATION
          </p>

          <span className="h-px w-14 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <h1 className="mt-8 font-display text-6xl font-light leading-[0.82] tracking-[-0.06em] sm:text-8xl md:text-[9rem]">
          Make
          <br />

          <span className="text-white/20">
            a wish.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-lg font-serif text-base leading-[1.9] text-white/30 sm:text-lg">
          There is one moment left in this universe.
          <br />
          Keep something beautiful in your heart.
        </p>
      </header>

      {/* =====================================================
          MOON SYSTEM
      ===================================================== */}

      <section className="relative mx-auto mt-12 flex max-w-5xl justify-center sm:mt-16">
        <div
          className={`
            relative
            h-[390px]
            w-[390px]
            sm:h-[500px]
            sm:w-[500px]

            transition-all
            duration-[2200ms]

            ${
              releasing
                ? "scale-[1.5]"
                : ""
            }
          `}
        >
          {/* Giant orbit */}

          <div
            className={`
              absolute
              inset-0
              rounded-full
              border border-white/[0.045]

              transition-all
              duration-[1800ms]

              ${
                isHolding
                  ? "scale-110 border-amber-100/30"
                  : releasing
                  ? "scale-[4] border-white/40 opacity-0"
                  : ""
              }
            `}
          />

          {/* Rotating constellation */}

          <div
            className={`
              absolute
              inset-[8%]
              rounded-full
              border
              border-dashed
              border-white/[0.04]

              ${
                isHolding
                  ? "animate-[spin_7s_linear_infinite] border-amber-100/25"
                  : releasing
                  ? "animate-[spin_2s_linear_infinite] border-white/40"
                  : "animate-[spin_35s_linear_infinite]"
              }
            `}
          />

          <div
            className={`
              absolute
              inset-[18%]
              rounded-full
              border border-white/[0.025]

              transition-all
              duration-[1800ms]

              ${
                isHolding
                  ? "scale-110"
                  : releasing
                  ? "scale-[4] border-white/40 opacity-0"
                  : ""
              }
            `}
          />

          {/* Orbit particles */}

          {[0, 1, 2, 3, 4, 5, 6, 7].map((particle) => (
            <div
              key={particle}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `
                  rotate(${particle * 45}deg)
                  translateY(-${175 + particle * 10}px)
                `,
              }}
            >
              <div
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-white
                  shadow-[0_0_18px_white]

                  transition-all duration-700

                  ${
                    isHolding
                      ? "scale-[3.5] bg-amber-100 shadow-[0_0_35px_rgba(255,225,160,1)]"
                      : releasing
                      ? "scale-[12] opacity-0"
                      : "opacity-50"
                  }
                `}
              />
            </div>
          ))}

          {/* =================================================
              MOON
          ================================================= */}

          <div
            className={`
              absolute
              left-1/2
              top-1/2

              flex
              h-[230px]
              w-[230px]

              -translate-x-1/2
              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              sm:h-[290px]
              sm:w-[290px]

              transition-transform
              duration-[2200ms]
              ease-[cubic-bezier(.16,1,.3,1)]

              ${
                isHolding
                  ? "scale-[1.12]"
                  : releasing
                  ? "scale-[8]"
                  : ""
              }
            `}
          >
            {/* Massive aura */}

            <div
              className={`
                absolute
                inset-[-90px]
                rounded-full
                blur-[70px]

                transition-all
                duration-[1200ms]

                ${
                  isHolding
                    ? "animate-[moonAura_2s_ease-in-out_infinite] bg-amber-200/30"
                    : releasing
                    ? "animate-[finalAura_2.8s_ease-out_forwards] bg-white"
                    : "bg-amber-200/[0.045]"
                }
              `}
            />

            {/* Orbiting light */}

            <div
              className={`
                absolute
                inset-[-45px]
                rounded-full
                border border-white/[0.08]

                ${
                  isHolding
                    ? "animate-[spin_3s_linear_infinite]"
                    : releasing
                    ? "animate-[spin_0.8s_linear_infinite]"
                    : ""
                }
              `}
            >
              <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_20px_white]" />
            </div>

            {/* Energy rings */}

            {isHolding && (
              <>
                <div className="absolute inset-[-20px] rounded-full border border-amber-100/30 animate-[energyWave_1.4s_ease-out_infinite]" />

                <div className="absolute inset-[-45px] rounded-full border border-amber-100/15 animate-[energyWave_1.9s_ease-out_infinite_.3s]" />

                <div className="absolute inset-[-75px] rounded-full border border-white/10 animate-[energyWave_2.4s_ease-out_infinite_.6s]" />
              </>
            )}

            {/* =================================================
                ACTUAL MOON
            ================================================= */}

            <div
              className={`
                relative
                h-full
                w-full
                overflow-hidden
                rounded-full

                border border-white/10

                bg-[radial-gradient(circle_at_34%_24%,#fffef0_0%,#ead49c_18%,#a18b5e_40%,#514735_64%,#14120f_100%)]

                shadow-[inset_-45px_-35px_90px_rgba(0,0,0,.75),0_0_100px_rgba(255,220,150,.12)]

                ${
                  isHolding
                    ? "animate-[moonBreathing_2.5s_ease-in-out_infinite]"
                    : releasing
                    ? "animate-[moonCollapse_3s_cubic-bezier(.16,1,.3,1)_forwards]"
                    : ""
                }
              `}
            >
              {/* Surface light */}

              <div
                className={`
                  absolute
                  inset-[-40%]
                  rounded-full

                  bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,.55),transparent,rgba(255,220,150,.4),transparent)]

                  blur-[12px]

                  ${
                    isHolding
                      ? "animate-[spin_2.5s_linear_infinite]"
                      : releasing
                      ? "animate-[spin_0.7s_linear_infinite]"
                      : ""
                  }
                `}
              />

              {/* Craters */}

              <span className="absolute left-[20%] top-[28%] h-10 w-10 rounded-full bg-black/10 blur-[2px]" />

              <span className="absolute right-[18%] top-[45%] h-16 w-16 rounded-full bg-black/10 blur-[3px]" />

              <span className="absolute left-[35%] bottom-[18%] h-8 w-8 rounded-full bg-black/10 blur-[2px]" />

              <span className="absolute right-[34%] bottom-[30%] h-5 w-5 rounded-full bg-black/10 blur-[1px]" />

              <span className="absolute left-[48%] top-[18%] h-6 w-6 rounded-full bg-black/10 blur-[2px]" />

              {/* Moon shine */}

              <div className="absolute left-[8%] top-[5%] h-[50%] w-[35%] rounded-full bg-white/25 blur-[25px]" />

              {/* Energy core */}

              {isHolding && (
                <div className="absolute inset-[30%] rounded-full bg-white/20 blur-[35px] animate-[corePulse_1s_ease-in-out_infinite]" />
              )}

              {/* Explosion flash */}

              {releasing && (
                <div className="absolute inset-0 bg-white animate-[moonFlash_1.4s_ease-out_forwards]" />
              )}
            </div>

            {/* =================================================
                EXPLOSION EFFECTS
            ================================================= */}

            {releasing && (
              <>
                {/* Full screen explosion */}

                <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
                  <div className="absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_100px_50px_rgba(255,255,255,.9)] animate-[universeExplosion_2.6s_cubic-bezier(.16,1,.3,1)_forwards]" />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.95)_0%,rgba(255,230,170,.65)_8%,rgba(255,210,120,.18)_25%,transparent_65%)] animate-[cosmicFlash_2.8s_ease-out_forwards]" />
                </div>

                {/* Shockwave */}

                <div className="absolute inset-[-30px] rounded-full border-2 border-white/80 animate-[shockwave_1.3s_cubic-bezier(.16,1,.3,1)_forwards]" />

                <div className="absolute inset-[-70px] rounded-full border border-amber-100/60 animate-[shockwave_1.7s_cubic-bezier(.16,1,.3,1)_.15s_forwards]" />

                <div className="absolute inset-[-120px] rounded-full border border-white/30 animate-[shockwave_2.1s_cubic-bezier(.16,1,.3,1)_.3s_forwards]" />

                <div className="absolute inset-[-180px] rounded-full border border-white/10 animate-[shockwave_2.5s_cubic-bezier(.16,1,.3,1)_.4s_forwards]" />

                {/* Central birth star */}

                <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 animate-[birthStar_1.6s_cubic-bezier(.16,1,.3,1)_forwards]">
                  <div className="h-5 w-5 rotate-45 bg-white shadow-[0_0_100px_35px_rgba(255,255,255,.9)]" />
                </div>

                {/* Vertical beam */}

                <div className="pointer-events-none fixed left-1/2 top-1/2 z-[70] h-[120vh] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white to-transparent animate-[beam_1.7s_ease-out_forwards]" />

                {/* Horizontal beam */}

                <div className="pointer-events-none fixed left-1/2 top-1/2 z-[70] h-px w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent animate-[beam_1.7s_ease-out_forwards]" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ENERGY
      ===================================================== */}

      {!complete && (
        <section className="relative z-20 mx-auto mt-2 max-w-md text-center">
          <div className="mb-4 flex justify-between px-1">
            <span className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
              Wish energy
            </span>

            <span className="font-mono text-[6px] text-white/20">
              {String(energy).padStart(3, "0")}%
            </span>
          </div>

          <div className="relative h-[2px] overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full bg-gradient-to-r from-white/10 via-amber-100/80 to-white shadow-[0_0_25px_rgba(255,220,150,.8)] transition-all duration-100"
              style={{
                width: `${energy}%`,
              }}
            />

            {isHolding && (
              <div className="absolute inset-0 animate-[energySweep_1s_linear_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          BUTTON
      ===================================================== */}

      {!complete && !releasing && (
        <div className="relative z-20 mt-10 flex flex-col items-center">
          <button
            onMouseDown={startWish}
            onMouseUp={cancelWish}
            onMouseLeave={cancelWish}
            onTouchStart={startWish}
            onTouchEnd={cancelWish}
            onClick={() => {
              if (energy >= 80) {
                releaseInstantly();
              }
            }}
            className={`
              group
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border

              transition-all
              duration-500

              ${
                isHolding
                  ? "scale-125 border-amber-100/60 bg-amber-100/10 shadow-[0_0_100px_rgba(255,220,150,.3)]"
                  : "border-white/10 bg-white/[0.025] hover:scale-110 hover:border-white/30"
              }
            `}
          >
            <span className="absolute inset-[-8px] rounded-full border border-white/[0.05]" />

            <span
              className={`
                absolute
                inset-[-18px]
                rounded-full
                border

                ${
                  isHolding
                    ? "animate-[buttonOrbit_2s_linear_infinite] border-amber-100/20"
                    : "border-white/[0.025]"
                }
              `}
            />

            <Star
              size={18}
              strokeWidth={1}
              className={`
                transition-all
                duration-500

                ${
                  isHolding
                    ? "scale-125 fill-white text-white drop-shadow-[0_0_20px_white]"
                    : "text-white/40 group-hover:text-white"
                }
              `}
            />
          </button>

          <p className="mt-6 font-mono text-[7px] uppercase tracking-[0.45em] text-white/20">
            {isHolding
              ? "The universe is listening"
              : "Press and hold"}
          </p>

          <button
            onClick={releaseInstantly}
            className="mt-5 font-mono text-[6px] uppercase tracking-[0.35em] text-white/10 transition hover:text-white/40"
          >
            I already know my wish
          </button>
        </div>
      )}

      {/* =====================================================
          COSMIC MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-6">

          {/* Dark background ONLY */}

          <div
            className="
              absolute
              inset-0
              bg-black/80
              backdrop-blur-[30px]
              animate-[voidAppear_1.4s_ease-out_forwards]
            "
          />

          {/* Portal */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[100px] w-[100px] rounded-full border border-white/20 animate-[portalBirth_1.8s_cubic-bezier(.16,1,.3,1)_forwards]" />

            <div className="absolute inset-[-80px] rounded-full border border-white/10 animate-[portalBirth_2.3s_cubic-bezier(.16,1,.3,1)_.12s_forwards]" />

            <div className="absolute inset-[-180px] rounded-full border border-white/[0.05] animate-[portalBirth_2.8s_cubic-bezier(.16,1,.3,1)_.25s_forwards]" />

            <div className="absolute inset-[-300px] rounded-full border border-white/[0.025] animate-[portalBirth_3.3s_cubic-bezier(.16,1,.3,1)_.4s_forwards]" />
          </div>

          {/* Giant aura */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/[0.07] blur-[130px] animate-[modalAura_5s_ease-in-out_infinite]" />

          {/* Particles */}

          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white animate-[modalParticle_2s_cubic-bezier(.16,1,.3,1)_forwards]"
              style={{
                "--px": `${Math.cos(i * 0.9) * (150 + (i % 5) * 70)}px`,
                "--py": `${Math.sin(i * 0.9) * (150 + (i % 5) * 70)}px`,
                animationDelay: `${i * 0.025}s`,
              }}
            />
          ))}

          {/* =================================================
              MODAL
          ================================================= */}

          <div
            className="
              relative
              w-full
              max-w-2xl
              overflow-hidden

              rounded-[36px]

              border
              border-white/[0.13]

              bg-[#070707]/95

              p-8

              text-center

              shadow-[0_60px_200px_rgba(0,0,0,.95)]

              backdrop-blur-none

              animate-[portalModal_1.6s_cubic-bezier(.16,1,.3,1)_forwards]

              sm:p-14
            "
          >
            {/* Glass glow */}

            <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.09),transparent_40%)]" />

            {/* Moving reflection */}

            <div className="pointer-events-none absolute -left-[100%] top-0 h-full w-[40%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent animate-[glassSweep_4s_ease-in-out_1.5s_infinite]" />

            {/* Inner frame */}

            <div className="pointer-events-none absolute inset-3 rounded-[30px] border border-white/[0.04]" />

            {/* Orbit */}

            <div className="pointer-events-none absolute inset-[-100px] animate-[spin_28s_linear_infinite]">
              <div className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-white shadow-[0_0_25px_white]" />
            </div>

            {/* Corner stars */}

            <Sparkles
              className="absolute left-8 top-8 text-white/20 animate-[floatStar_3s_ease-in-out_infinite]"
              size={15}
            />

            <Sparkles
              className="absolute right-8 top-8 text-white/10 animate-[floatStar_4s_ease-in-out_infinite_reverse]"
              size={12}
            />

            {/* Top constellation */}

            <div className="relative mb-10 flex items-center justify-center gap-4 animate-[contentReveal_.9s_ease-out_.55s_both]">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />

              <Sparkles
                size={15}
                strokeWidth={1}
                className="text-white/70"
              />

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            {/* Label */}

            <p className="relative font-mono text-[7px] uppercase tracking-[0.65em] text-white/30 animate-[contentReveal_.9s_ease-out_.7s_both]">
              WISH ACCEPTED
            </p>

            {/* Title */}

            <h2
              className="
                relative
                mt-7
                font-display
                text-5xl
                leading-[0.9]
                tracking-[-0.05em]
                text-white
                sm:text-7xl

                animate-[titleReveal_1.2s_cubic-bezier(.16,1,.3,1)_.85s_both]
              "
            >
              The universe
              <br />

              <span className="text-white/25">
                heard you.
              </span>
            </h2>

            {/* Divider */}

            <div className="relative mx-auto mt-9 h-px max-w-xs overflow-hidden bg-white/[0.06]">
              <div className="h-full w-[40%] bg-white/70 animate-[dividerTravel_2s_ease-in-out_1.5s_infinite]" />
            </div>

            {/* Message */}

            <p
              className="
                relative
                mx-auto
                mt-9
                max-w-md

                font-serif
                text-lg
                italic
                leading-[1.9]

                text-white/45

                animate-[contentReveal_1s_ease-out_1.35s_both]
              "
            >
              May the things you quietly hope for
              find their way toward you.
              <br />
              Even the ones you never say aloud.
            </p>

            {/* Signature */}

            <p className="relative mt-8 font-mono text-[6px] uppercase tracking-[0.5em] text-white/15 animate-[contentReveal_1s_ease-out_1.6s_both]">
              {birthdayData.name.toUpperCase()} // THE UNIVERSE REMEMBERS
            </p>

            {/* Continue */}

            <button
              onClick={() => navigate("/celebration")}
              className="
                group
                relative
                mx-auto
                mt-10

                flex
                items-center
                gap-4

                overflow-hidden

                rounded-full

                border
                border-white/[0.1]

                bg-white/[0.03]

                px-7
                py-4

                font-mono
                text-[7px]
                uppercase
                tracking-[0.4em]

                text-white/50

                transition-all
                duration-500

                hover:scale-105
                hover:border-white/30
                hover:bg-white
                hover:text-black

                animate-[contentReveal_1s_ease-out_1.9s_both]
              "
            >
              <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-700 group-hover:translate-x-0" />

              <span className="relative">
                Continue the universe
              </span>

              <ArrowRight
                size={13}
                className="relative transition-transform group-hover:translate-x-1"
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
           BASIC
        ===================================================== */

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: .08;
            transform: scale(.6);
          }

          50% {
            opacity: .85;
            transform: scale(1.7);
          }
        }

        /* =====================================================
           MOON
        ===================================================== */

        @keyframes moonBreathing {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.035);
          }
        }

        @keyframes moonAura {
          0%, 100% {
            transform: scale(.85);
            opacity: .3;
          }

          50% {
            transform: scale(1.2);
            opacity: .8;
          }
        }

        @keyframes corePulse {
          0%, 100% {
            transform: scale(.7);
            opacity: .15;
          }

          50% {
            transform: scale(1.5);
            opacity: .7;
          }
        }

        @keyframes energyWave {
          0% {
            transform: scale(.75);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes energySweep {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(250%);
          }
        }

        /* =====================================================
           MOON EXPLOSION
        ===================================================== */

        @keyframes moonCollapse {
          0% {
            transform: scale(1);
            filter: brightness(1);
            opacity: 1;
          }

          15% {
            transform: scale(1.08);
            filter: brightness(1.8);
            opacity: 1;
          }

          30% {
            transform: scale(.85);
            filter: brightness(3);
            opacity: 1;
          }

          45% {
            transform: scale(.45);
            filter: brightness(7);
            opacity: 1;
          }

          58% {
            transform: scale(.08);
            filter: brightness(20);
            opacity: 1;
          }

          65% {
            transform: scale(.02);
            filter: brightness(50);
            opacity: 1;
          }

          75% {
            transform: scale(3);
            filter: brightness(25);
            opacity: 1;
          }

          88% {
            transform: scale(8);
            filter: brightness(12);
            opacity: .9;
          }

          100% {
            transform: scale(15);
            filter: brightness(8);
            opacity: 0;
          }
        }

        @keyframes moonFlash {
          0% {
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          55% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes finalAura {
          0% {
            transform: scale(.5);
            opacity: .2;
          }

          35% {
            transform: scale(3);
            opacity: 1;
          }

          70% {
            transform: scale(10);
            opacity: .5;
          }

          100% {
            transform: scale(30);
            opacity: 0;
          }
        }

        /* =====================================================
           FULL SCREEN EXPLOSION
        ===================================================== */

        @keyframes universeExplosion {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }

          15% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 1;
          }

          35% {
            transform: translate(-50%, -50%) scale(15);
            opacity: 1;
          }

          60% {
            transform: translate(-50%, -50%) scale(60);
            opacity: .85;
          }

          100% {
            transform: translate(-50%, -50%) scale(180);
            opacity: 0;
          }
        }

        @keyframes cosmicFlash {
          0% {
            opacity: 0;
            transform: scale(.2);
          }

          20% {
            opacity: 1;
            transform: scale(.8);
          }

          38% {
            opacity: .9;
            transform: scale(1.1);
          }

          55% {
            opacity: .45;
            transform: scale(1.4);
          }

          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        /* =====================================================
           SHOCKWAVES
        ===================================================== */

        @keyframes shockwave {
          0% {
            transform: scale(.1);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes birthStar {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(45deg);
            opacity: 0;
          }

          35% {
            transform: translate(-50%, -50%) scale(2) rotate(225deg);
            opacity: 1;
          }

          100% {
            transform: translate(-50%, -50%) scale(.2) rotate(405deg);
            opacity: 0;
          }
        }

        @keyframes beam {
          0% {
            transform: translate(-50%, -50%) scaleX(0);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translate(-50%, -50%) scaleX(1);
            opacity: 0;
          }
        }

        /* =====================================================
           STAR EXPLOSION
        ===================================================== */

        @keyframes starExplosion {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: .8;
          }

          100% {
            transform:
              translate(var(--sx), var(--sy))
              scale(0);

            opacity: 0;
          }
        }

        /* =====================================================
           BUTTON
        ===================================================== */

        @keyframes buttonOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           MODAL BACKGROUND
        ===================================================== */

        @keyframes voidAppear {
          0% {
            opacity: 0;
            backdrop-filter: blur(0);
          }

          100% {
            opacity: 1;
            backdrop-filter: blur(30px);
          }
        }

        /* =====================================================
           PORTAL
        ===================================================== */

        @keyframes portalBirth {
          0% {
            transform: scale(.05) rotate(0deg);
            opacity: 0;
          }

          40% {
            opacity: 1;
          }

          100% {
            transform: scale(4) rotate(180deg);
            opacity: 0;
          }
        }

        @keyframes modalAura {
          0%, 100% {
            transform: translate(-50%, -50%) scale(.75);
            opacity: .25;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.25);
            opacity: .65;
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
            opacity: 1;
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

        /* =====================================================
           MODAL ENTRANCE
        ===================================================== */

        @keyframes portalModal {
          0% {
            opacity: 0;

            transform:
              perspective(1600px)
              translateY(180px)
              scale(.35)
              rotateX(35deg)
              rotateZ(-4deg);

            filter: blur(18px);
          }

          25% {
            opacity: .4;

            transform:
              perspective(1600px)
              translateY(70px)
              scale(.65)
              rotateX(20deg)
              rotateZ(2deg);

            filter: blur(8px);
          }

          50% {
            opacity: 1;

            transform:
              perspective(1600px)
              translateY(-20px)
              scale(1.04)
              rotateX(-4deg)
              rotateZ(-.5deg);

            filter: blur(2px);
          }

          68% {
            transform:
              perspective(1600px)
              translateY(8px)
              scale(.985)
              rotateX(1deg)
              rotateZ(0deg);

            filter: blur(0);
          }

          82% {
            transform:
              perspective(1600px)
              translateY(-3px)
              scale(1.01)
              rotateX(0deg)
              rotateZ(0deg);
          }

          100% {
            opacity: 1;

            transform:
              perspective(1600px)
              translateY(0)
              scale(1)
              rotateX(0)
              rotateZ(0);

            filter: blur(0);
          }
        }

        /* =====================================================
           MODAL DETAILS
        ===================================================== */

        @keyframes glassSweep {
          0% {
            transform:
              translateX(-150%)
              skewX(-20deg);
          }

          50%, 100% {
            transform:
              translateX(500%)
              skewX(-20deg);
          }
        }

        @keyframes floatStar {
          0%, 100% {
            transform:
              translateY(0)
              rotate(0deg);

            opacity: .2;
          }

          50% {
            transform:
              translateY(-8px)
              rotate(45deg);

            opacity: .8;
          }
        }

        @keyframes contentReveal {
          from {
            opacity: 0;
            transform: translateY(25px);
            filter: blur(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes titleReveal {
          0% {
            opacity: 0;

            transform:
              perspective(800px)
              translateY(50px)
              rotateX(25deg)
              scale(.85);

            filter: blur(15px);
          }

          60% {
            opacity: 1;
          }

          100% {
            opacity: 1;

            transform:
              perspective(800px)
              translateY(0)
              rotateX(0)
              scale(1);

            filter: blur(0);
          }
        }

        @keyframes dividerTravel {
          0% {
            transform: translateX(-150%);
          }

          50% {
            transform: translateX(250%);
          }

          100% {
            transform: translateX(250%);
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
          }
        }
      `}</style>
    </main>
  );
}