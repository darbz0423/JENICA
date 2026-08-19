import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Heart,
  RotateCcw,
  Star,
  Circle,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { useNavigate } from "react-router-dom";

export default function Finale() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState(0);
  const sceneRef = useRef(null);

  /*
   * ============================================================
   * CINEMATIC SEQUENCE
   * ============================================================
   */
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 700),
      window.setTimeout(() => setPhase(2), 1900),
      window.setTimeout(() => setPhase(3), 3500),
      window.setTimeout(() => setPhase(4), 5200),
      window.setTimeout(() => setPhase(5), 7000),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, []);

  /*
   * ============================================================
   * DESKTOP PARALLAX
   *
   * Important:
   * We DO NOT store mouse coordinates in React state.
   * That would cause the entire component to rerender
   * dozens/hundreds of times per second.
   *
   * Instead, we directly update CSS variables.
   * ============================================================
   */
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    if (!media.matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (sceneRef.current) {
        sceneRef.current.style.setProperty(
          "--mx",
          `${currentX.toFixed(2)}deg`
        );

        sceneRef.current.style.setProperty(
          "--my",
          `${currentY.toFixed(2)}deg`
        );
      }

      raf = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      targetX =
        ((event.clientX / window.innerWidth) - 0.5) * 3;

      targetY =
        ((event.clientY / window.innerHeight) - 0.5) * -3;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      cancelAnimationFrame(raf);
    };
  }, []);

  /*
   * ============================================================
   * REPLAY
   * ============================================================
   */
  const handleReplay = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    navigate("/", {
      replace: true,
    });
  };

  /*
   * ============================================================
   * STAR FIELD
   * Deliberately small.
   * We don't want hundreds of animated DOM nodes.
   * ============================================================
   */
  const stars = [
    [7, 14, 1],
    [15, 31, 1],
    [24, 10, 2],
    [31, 72, 1],
    [40, 22, 1],
    [48, 83, 1],
    [57, 14, 1],
    [65, 63, 2],
    [73, 28, 1],
    [81, 76, 1],
    [90, 18, 1],
    [94, 55, 2],
    [12, 87, 1],
    [27, 52, 1],
    [38, 91, 1],
    [54, 44, 1],
    [68, 92, 1],
    [77, 48, 1],
    [87, 88, 1],
    [96, 35, 1],
  ];

  return (
    <main
      ref={sceneRef}
      className="
        finale-page
        relative
        min-h-[100svh]
        overflow-x-hidden
        bg-[#010101]
        text-white
        selection:bg-white
        selection:text-black
      "
      style={{
        "--mx": "0deg",
        "--my": "0deg",
      }}
    >
      {/* ======================================================
          BACKGROUND
          ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden
        "
      >
        {/* Base */}
        <div className="absolute inset-0 bg-[#010101]" />

        {/* Soft central light */}
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
            bg-white/[0.025]
            blur-[80px]
            transition-all
            duration-[4000ms]
            md:h-[700px]
            md:w-[700px]
            md:blur-[110px]
            ${
              phase >= 3
                ? "scale-110 opacity-100"
                : "scale-75 opacity-40"
            }
          `}
        />

        {/* Warm memory glow */}
        <div
          className={`
            absolute
            left-1/2
            top-[62%]
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-amber-100/[0.035]
            blur-[75px]
            transition-all
            duration-[5000ms]
            md:h-[500px]
            md:w-[500px]
            md:blur-[100px]
            ${
              phase >= 4
                ? "scale-125 opacity-100"
                : "scale-50 opacity-0"
            }
          `}
        />

        {/* Small blue atmospheric glow */}
        <div
          className={`
            absolute
            left-[8%]
            top-[18%]
            h-[220px]
            w-[220px]
            rounded-full
            bg-indigo-300/[0.025]
            blur-[70px]
            transition-opacity
            duration-[3000ms]
            ${
              phase >= 2
                ? "opacity-100"
                : "opacity-20"
            }
          `}
        />

        {/* ==================================================
            STAR FIELD
            ================================================== */}

        <div className="absolute inset-0">
          {stars.map(([x, y, size], index) => (
            <span
              key={index}
              className="finale-star absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${index * 0.22}s`,
              }}
            />
          ))}
        </div>

        {/* ==================================================
            ORBIT SYSTEM
            ================================================== */}

        <div
          className="
            finale-orbit
            absolute
            left-1/2
            top-[45%]
            h-[420px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.035]
            md:h-[760px]
            md:w-[760px]
          "
        />

        <div
          className="
            finale-orbit-reverse
            absolute
            left-1/2
            top-[45%]
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-dashed
            border-white/[0.025]
            md:h-[560px]
            md:w-[560px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[45%]
            h-[180px]
            w-[180px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.025]
            md:h-[390px]
            md:w-[390px]
          "
        />

        {/* ==================================================
            VIGNETTE
            ================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,.25)_55%,rgba(0,0,0,.94)_100%)]
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-40
            bg-gradient-to-b
            from-black
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-48
            bg-gradient-to-t
            from-black
            via-black/70
            to-transparent
          "
        />

        <div className="finale-noise absolute inset-0 opacity-[0.018]" />
      </div>

      {/* ======================================================
          TOP HUD
          ====================================================== */}

      <header
        className={`
          fixed
          left-0
          right-0
          top-0
          z-50
          flex
          items-center
          justify-between
          px-5
          py-5
          transition-all
          duration-[1400ms]
          sm:px-7
          md:px-10
          ${
            phase >= 1
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.035]
              backdrop-blur-md
            "
          >
            <Star
              size={11}
              strokeWidth={1}
              className="text-white/50"
            />
          </div>

          <div>
            <p
              className="
                font-mono
                text-[7px]
                uppercase
                tracking-[0.45em]
                text-white/30
              "
            >
              MEMORY UNIVERSE
            </p>

            <p
              className="
                mt-1
                font-mono
                text-[5px]
                tracking-[0.3em]
                text-white/15
              "
            >
              FINAL TRANSMISSION
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span
            className="
              font-mono
              text-[6px]
              tracking-[0.35em]
              text-white/15
            "
          >
            ARCHIVE COMPLETE
          </span>

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-white/40
              shadow-[0_0_12px_rgba(255,255,255,.4)]
            "
          />
        </div>
      </header>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[100svh]
          w-full
          max-w-[1500px]
          flex-col
          items-center
          px-4
          pb-20
          pt-28
          sm:px-6
          md:px-10
          md:pt-32
        "
      >
        {/* ====================================================
            INTRO
            ==================================================== */}

        <div
          className={`
            relative
            z-20
            text-center
            transition-all
            duration-[1600ms]
            ${
              phase >= 1
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >
          <div className="mb-5 flex items-center justify-center gap-3 sm:gap-4">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20 sm:w-12" />

            <Sparkles
              size={12}
              strokeWidth={1}
              className="text-white/40"
            />

            <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20 sm:w-12" />
          </div>

          <p
            className="
              font-mono
              text-[7px]
              uppercase
              tracking-[0.65em]
              text-white/25
              sm:text-[8px]
            "
          >
            THE LAST MEMORY
          </p>

          <p
            className="
              mt-5
              font-serif
              text-lg
              italic
              text-white/50
              sm:text-2xl
              md:text-3xl
            "
          >
            Before this universe fades...
          </p>
        </div>

        {/* ====================================================
            MEMORY MONUMENT
            ==================================================== */}

        <div
          className={`
            relative
            mt-10
            w-full
            max-w-5xl
            transition-all
            duration-[1900ms]
            sm:mt-12
            md:mt-16
            ${
              phase >= 2
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-10 scale-[0.96] opacity-0"
            }
          `}
        >
          {/* Ambient frame glow */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-6
              rounded-[40px]
              bg-white/[0.025]
              blur-[60px]
              sm:-inset-10
            "
          />

          {/* ==================================================
              DESKTOP SIDE LABELS
              ================================================== */}

          <div className="absolute -left-5 top-1/2 hidden -translate-x-full -translate-y-1/2 lg:block">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p
                  className="
                    font-mono
                    text-[6px]
                    uppercase
                    tracking-[0.45em]
                    text-white/20
                  "
                >
                  MEMORY
                </p>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[5px]
                    tracking-[0.3em]
                    text-white/10
                  "
                >
                  RESTORED
                </p>
              </div>

              <span className="h-px w-14 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </div>

          <div className="absolute -right-5 top-1/2 hidden translate-x-full -translate-y-1/2 lg:block">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-gradient-to-l from-white/20 to-transparent" />

              <div>
                <p
                  className="
                    font-mono
                    text-[6px]
                    uppercase
                    tracking-[0.45em]
                    text-white/20
                  "
                >
                  FOREVER
                </p>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[5px]
                    tracking-[0.3em]
                    text-white/10
                  "
                >
                  REMEMBERED
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              IMAGE
              ================================================== */}

          <div
            className="
              finale-photo
              group
              relative
              mx-auto
              max-w-4xl
            "
          >
            <div
              className="
                absolute
                -inset-3
                rounded-[30px]
                bg-white/[0.025]
                blur-2xl
              "
            />

            <div
              className="
                relative
                rounded-[24px]
                border
                border-white/[0.12]
                bg-white/[0.025]
                p-1
                shadow-[0_30px_100px_rgba(0,0,0,.85)]
                backdrop-blur-md
                sm:rounded-[28px]
                sm:p-[5px]
              "
            >
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[20px]
                  bg-black
                  sm:rounded-[23px]
                "
              >
                <div className="relative aspect-[4/5] sm:aspect-[16/9]">
                  <img
                    src={birthdayData.memories[0]?.image}
                    alt="A meaningful memory"
                    loading="eager"
                    decoding="async"
                    className={`
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-[8000ms]
                      ease-out
                      ${
                        phase >= 4
                          ? "scale-105"
                          : "scale-100"
                      }
                    `}
                  />

                  {/* Cinematic grade */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black
                      via-black/10
                      to-black/20
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.5)_100%)]
                    "
                  />

                  {/* Mobile cinematic light */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      -left-[70%]
                      w-[45%]
                      skew-x-[-18deg]
                      bg-gradient-to-r
                      from-transparent
                      via-white/[0.08]
                      to-transparent
                      animate-[memorySweep_10s_ease-in-out_infinite]
                    "
                  />

                  {/* Corner brackets */}

                  <span className="absolute left-4 top-4 h-6 w-6 border-l border-t border-white/35 sm:left-5 sm:top-5 sm:h-8 sm:w-8" />

                  <span className="absolute right-4 top-4 h-6 w-6 border-r border-t border-white/35 sm:right-5 sm:top-5 sm:h-8 sm:w-8" />

                  <span className="absolute bottom-4 left-4 h-6 w-6 border-b border-l border-white/35 sm:bottom-5 sm:left-5 sm:h-8 sm:w-8" />

                  <span className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-white/35 sm:bottom-5 sm:right-5 sm:h-8 sm:w-8" />

                  {/* Image metadata */}

                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between sm:bottom-6 sm:left-7 sm:right-7">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,.5)]" />

                        <p
                          className="
                            font-mono
                            text-[6px]
                            uppercase
                            tracking-[0.45em]
                            text-white/55
                          "
                        >
                          MEMORY 001
                        </p>
                      </div>

                      <p
                        className="
                          mt-2
                          font-serif
                          text-xs
                          italic
                          text-white/45
                          sm:text-sm
                        "
                      >
                        A moment worth keeping.
                      </p>
                    </div>

                    <p
                      className="
                        font-mono
                        text-[6px]
                        tracking-[0.35em]
                        text-white/30
                      "
                    >
                      08.17
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile archive label */}

          <div className="mt-4 flex items-center justify-between px-2 lg:hidden">
            <span
              className="
                font-mono
                text-[5px]
                uppercase
                tracking-[0.45em]
                text-white/15
              "
            >
              MEMORY RESTORED
            </span>

            <span
              className="
                font-mono
                text-[5px]
                uppercase
                tracking-[0.4em]
                text-white/15
              "
            >
              ARCHIVE 001
            </span>
          </div>
        </div>

        {/* ====================================================
            SECOND MESSAGE
            ==================================================== */}

        <div
          className={`
            relative
            z-20
            mt-14
            text-center
            transition-all
            duration-[1900ms]
            sm:mt-16
            md:mt-20
            ${
              phase >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-7 opacity-0"
            }
          `}
        >
          <p
            className="
              font-mono
              text-[6px]
              uppercase
              tracking-[0.55em]
              text-white/20
              sm:text-[7px]
            "
          >
            ONE THING I WANT YOU TO REMEMBER
          </p>

          <p
            className="
              mt-6
              px-4
              font-serif
              text-[1.65rem]
              leading-[1.28]
              text-white/65
              sm:text-3xl
              md:text-5xl
            "
          >
            Some people pass through our lives.
            <br />
            <span className="text-white/30">
              Some moments stay.
            </span>
          </p>
        </div>

        {/* ====================================================
            MAIN MESSAGE
            ==================================================== */}

        <div
          className={`
            relative
            z-20
            mt-20
            w-full
            text-center
            transition-all
            duration-[2200ms]
            sm:mt-24
            md:mt-28
            ${
              phase >= 4
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-[0.96] opacity-0"
            }
          `}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[70px] md:h-64 md:blur-[100px]" />

          <div className="relative">
            <p
              className="
                font-mono
                text-[6px]
                uppercase
                tracking-[0.65em]
                text-white/20
                sm:text-[7px]
              "
            >
              THE UNIVERSE REMEMBERS
            </p>

            <h1
              className="
                mx-auto
                mt-7
                max-w-6xl
                px-4
                font-display
                text-[3.4rem]
                leading-[0.86]
                tracking-[-0.07em]
                text-white
                sm:text-6xl
                md:text-8xl
                lg:text-[8rem]
              "
            >
              {birthdayData.finalMessage}
            </h1>

            <div className="mx-auto mt-9 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20 sm:w-20" />

              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white blur-md opacity-30" />

                <span className="relative block h-1.5 w-1.5 rounded-full bg-white/70" />
              </div>

              <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/20 sm:w-20" />
            </div>
          </div>
        </div>

        {/* ====================================================
            FINAL REVEAL
            ==================================================== */}

        <div
          className={`
            relative
            z-20
            mt-24
            flex
            w-full
            flex-col
            items-center
            text-center
            transition-all
            duration-[2400ms]
            sm:mt-28
            md:mt-32
            ${
              phase >= 5
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }
          `}
        >
          {/* Heart */}

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-10" />

            <div
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                backdrop-blur-md
              "
            >
              <Heart
                size={14}
                strokeWidth={1}
                className="text-white/50"
              />
            </div>
          </div>

          <p
            className="
              mt-7
              font-mono
              text-[6px]
              uppercase
              tracking-[0.65em]
              text-white/20
            "
          >
            THIS UNIVERSE WAS MADE FOR
          </p>

          <h2
            className="
              mt-5
              max-w-full
              break-words
              px-4
              font-display
              text-[3.4rem]
              leading-none
              tracking-[-0.06em]
              text-white
              sm:text-6xl
              md:text-8xl
            "
          >
            {birthdayData.name}
            <span className="text-white/20">.</span>
          </h2>

          <p
            className="
              mx-auto
              mt-8
              max-w-md
              px-6
              font-serif
              text-sm
              italic
              leading-[1.8]
              text-white/35
              sm:text-base
              md:text-lg
            "
          >
            And if you ever forget how far you've come,
            <br />
            <span className="text-white/50">
              come back here.
            </span>
          </p>

          {/* Divider */}

          <div className="mt-11 flex items-center gap-4">
            <span className="h-px w-8 bg-white/[0.08] sm:w-16" />

            <Sparkles
              size={10}
              strokeWidth={1}
              className="text-white/25"
            />

            <span className="h-px w-8 bg-white/[0.08] sm:w-16" />
          </div>

          <p
            className="
              mt-6
              px-4
              font-mono
              text-[6px]
              uppercase
              tracking-[0.65em]
              text-white/15
            "
          >
            THE END IS ONLY ANOTHER BEGINNING
          </p>

          {/* ==================================================
              REPLAY
              ================================================== */}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay the Universe"
            className="
              group
              relative
              z-50
              mt-9
              flex
              min-h-[48px]
              cursor-pointer
              items-center
              gap-3
              overflow-hidden
              rounded-full
              border
              border-white/[0.12]
              bg-white/[0.025]
              px-6
              py-3.5
              font-mono
              text-[7px]
              uppercase
              tracking-[0.35em]
              text-white/45
              backdrop-blur-md
              transition-all
              duration-500
              hover:border-white/30
              hover:bg-white
              hover:text-black
              hover:shadow-[0_0_50px_rgba(255,255,255,.1)]
              active:scale-95
              sm:px-7
            "
          >
            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/20
                to-transparent
                transition-transform
                duration-700
                group-hover:translate-x-full
              "
            />

            <RotateCcw
              size={11}
              className="
                relative
                transition-transform
                duration-700
                group-hover:-rotate-180
              "
            />

            <span className="relative">
              Replay the Universe
            </span>

            <ArrowRight
              size={11}
              className="
                relative
                transition-transform
                duration-500
                group-hover:translate-x-1
              "
            />
          </button>

          <div className="h-24 sm:h-28" />
        </div>
      </section>

      {/* ======================================================
          BOTTOM HUD
          ====================================================== */}

      <div
        className={`
          fixed
          bottom-0
          left-0
          right-0
          z-40
          flex
          items-center
          justify-center
          pb-4
          transition-all
          duration-[1800ms]
          sm:pb-5
          ${
            phase >= 5
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <span
            className="
              font-mono
              text-[5px]
              uppercase
              tracking-[0.5em]
              text-white/10
            "
          >
            MEMORY ARCHIVE
          </span>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <span
            className="
              font-mono
              text-[5px]
              tracking-[0.35em]
              text-white/10
            "
          >
            001 / ∞
          </span>
        </div>
      </div>

      {/* ======================================================
          CSS
          ====================================================== */}

      <style>{`
        /*
         * ======================================================
         * STAR ANIMATION
         * ======================================================
         */

        .finale-star {
          opacity: 0.12;
          transform: scale(0.8);
          animation: finaleStar 3.5s ease-in-out infinite alternate;
          will-change: opacity, transform;
        }

        @keyframes finaleStar {
          0% {
            opacity: 0.06;
            transform: scale(0.75);
          }

          100% {
            opacity: 0.55;
            transform: scale(1.25);
          }
        }

        /*
         * ======================================================
         * ORBITS
         * ======================================================
         */

        .finale-orbit {
          animation:
            finaleOrbit 65s linear infinite;
          will-change: transform;
        }

        .finale-orbit-reverse {
          animation:
            finaleOrbitReverse 48s linear infinite;
          will-change: transform;
        }

        @keyframes finaleOrbit {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes finaleOrbitReverse {
          from {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }
        }

        /*
         * ======================================================
         * MEMORY IMAGE
         * ======================================================
         */

        .finale-photo {
          transform:
            perspective(1400px)
            rotateX(var(--my))
            rotateY(var(--mx));

          transition:
            transform 700ms cubic-bezier(.2,.8,.2,1);

          will-change: transform;
        }

        /*
         * ======================================================
         * LIGHT SWEEP
         * ======================================================
         */

        @keyframes memorySweep {
          0% {
            transform:
              translateX(-120%)
              skewX(-18deg);

            opacity: 0;
          }

          12% {
            opacity: 0.8;
          }

          38% {
            opacity: 0.35;
          }

          55% {
            opacity: 0;
          }

          100% {
            transform:
              translateX(500%)
              skewX(-18deg);

            opacity: 0;
          }
        }

        /*
         * ======================================================
         * FILM GRAIN
         * ======================================================
         */

        .finale-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /*
         * ======================================================
         * MOBILE PERFORMANCE
         * ======================================================
         */

        @media (max-width: 1023px) {
          .finale-photo {
            transform: none !important;
          }

          .finale-orbit {
            animation-duration: 90s;
          }

          .finale-orbit-reverse {
            animation-duration: 70s;
          }
        }

        /*
         * ======================================================
         * SMALL PHONES
         * ======================================================
         */

        @media (max-width: 480px) {
          .finale-star {
            animation-duration: 4.5s;
          }

          .finale-orbit {
            opacity: 0.7;
          }

          .finale-orbit-reverse {
            opacity: 0.45;
          }
        }

        /*
         * ======================================================
         * REDUCED MOTION
         * ======================================================
         */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }

          .finale-photo {
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}