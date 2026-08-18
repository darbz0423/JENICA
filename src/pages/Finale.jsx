import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Heart,
  RotateCcw,
  Star,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { useNavigate } from "react-router-dom";

export default function Finale() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 900),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 4700),
      setTimeout(() => setPhase(4), 6900),
      setTimeout(() => setPhase(5), 9000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;

      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // =====================================================
  // REPLAY THE UNIVERSE
  // Returns completely to the opening page.
  // =====================================================
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

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020202] text-white selection:bg-white selection:text-black">

      {/* =====================================================
          CINEMATIC BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="absolute inset-0 bg-[#020202]" />

        <div
          className={`absolute left-1/2 top-1/2 h-[75vw] w-[75vw] max-h-[1000px] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] transition-all duration-[6000ms] ${
            phase >= 3
              ? "scale-100 opacity-100 bg-white/[0.045]"
              : "scale-75 opacity-40 bg-white/[0.02]"
          }`}
        />

        <div
          className={`absolute left-1/2 top-[58%] h-[50vw] w-[50vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/[0.045] blur-[150px] transition-all duration-[7000ms] ${
            phase >= 4
              ? "scale-125 opacity-100"
              : "scale-50 opacity-0"
          }`}
        />

        <div
          className={`absolute left-[15%] top-[20%] h-[300px] w-[300px] rounded-full bg-indigo-300/[0.025] blur-[120px] transition-opacity duration-[5000ms] ${
            phase >= 2 ? "opacity-100" : "opacity-30"
          }`}
        />

        {/* STARS */}

        {[
          [5, 12, 1],
          [11, 76, 2],
          [17, 31, 1],
          [23, 88, 1],
          [29, 17, 2],
          [36, 67, 1],
          [43, 10, 1],
          [49, 91, 2],
          [55, 27, 1],
          [61, 78, 1],
          [67, 14, 2],
          [73, 58, 1],
          [79, 87, 1],
          [84, 24, 2],
          [89, 69, 1],
          [95, 39, 1],
          [7, 45, 1],
          [93, 9, 2],
          [38, 43, 1],
          [58, 51, 1],
        ].map(([x, y, size], index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `finaleStar ${
                2 + (index % 4)
              }s ease-in-out infinite alternate`,
              animationDelay: `${index * 0.18}s`,
            }}
          />
        ))}

        {/* GIANT ORBITAL RINGS */}

        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025] animate-[finaleOrbit_55s_linear_infinite]" />

        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.018] animate-[finaleOrbitReverse_40s_linear_infinite]" />

        <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.018]" />

        {/* VIGNETTE */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.3)_55%,rgba(0,0,0,.92)_100%)]" />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="finale-noise absolute inset-0 opacity-[0.028]" />

      </div>

      {/* =====================================================
          TOP CINEMATIC HUD
          ===================================================== */}

      <div
        className={`fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-6 transition-all duration-[1800ms] md:px-10 ${
          phase >= 1
            ? "translate-y-0 opacity-100"
            : "-translate-y-5 opacity-0"
        }`}
      >

        <div className="flex items-center gap-3">

          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">

            <Star
              size={10}
              strokeWidth={1}
              className="text-white/40"
            />

          </div>

          <div>

            <p className="font-mono text-[6px] uppercase tracking-[0.5em] text-white/25">
              MEMORY UNIVERSE
            </p>

            <p className="mt-1 font-mono text-[5px] tracking-[0.3em] text-white/10">
              FINAL TRANSMISSION
            </p>

          </div>

        </div>

        <div className="hidden items-center gap-3 sm:flex">

          <span className="font-mono text-[6px] tracking-[0.4em] text-white/15">
            ARCHIVE COMPLETE
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-white/30 shadow-[0_0_10px_rgba(255,255,255,.4)]" />

        </div>

      </div>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-5 pb-20 pt-28 md:px-10">

        {/* INTRO */}

        <div
          className={`relative z-20 text-center transition-all duration-[1800ms] ${
            phase >= 1
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >

          <div className="mb-5 flex items-center justify-center gap-4">

            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />

            <Sparkles
              size={12}
              strokeWidth={1}
              className="text-white/35"
            />

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />

          </div>

          <p className="font-mono text-[7px] uppercase tracking-[0.7em] text-white/25 md:text-[8px]">
            THE LAST MEMORY
          </p>

          <p className="mt-5 font-serif text-xl italic text-white/55 md:text-3xl">
            Before this universe fades...
          </p>

        </div>

        {/* =================================================
            CENTRAL MEMORY MONUMENT
            ================================================= */}

        <div
          className={`relative mt-12 w-full max-w-5xl transition-all duration-[2600ms] md:mt-16 ${
            phase >= 2
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-12 scale-[0.92] opacity-0"
          }`}
        >

          <div
            className={`absolute -inset-16 rounded-[60px] bg-white/[0.035] blur-[100px] transition-all duration-[5000ms] ${
              phase >= 4
                ? "scale-110 opacity-100"
                : "scale-75 opacity-40"
            }`}
          />

          {/* LEFT LABEL */}

          <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 -translate-x-full lg:block">

            <div className="flex items-center gap-4">

              <div className="text-right">

                <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/20">
                  MEMORY
                </p>

                <p className="mt-1 font-mono text-[5px] tracking-[0.3em] text-white/10">
                  RESTORED
                </p>

              </div>

              <span className="h-px w-16 bg-gradient-to-r from-white/20 to-transparent" />

            </div>

          </div>

          {/* RIGHT LABEL */}

          <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 translate-x-full lg:block">

            <div className="flex items-center gap-4">

              <span className="h-px w-16 bg-gradient-to-l from-white/20 to-transparent" />

              <div>

                <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/20">
                  FOREVER
                </p>

                <p className="mt-1 font-mono text-[5px] tracking-[0.3em] text-white/10">
                  REMEMBERED
                </p>

              </div>

            </div>

          </div>

          {/* IMAGE */}

          <div
            className="group relative mx-auto max-w-4xl"
            style={{
              transform: `perspective(1400px) rotateX(${
                mouse.y * -1.5
              }deg) rotateY(${mouse.x * 1.5}deg)`,
              transition: "transform 700ms ease-out",
            }}
          >

            <div className="absolute -inset-4 rounded-[30px] bg-white/[0.025] blur-2xl transition-all duration-1000 group-hover:bg-white/[0.05]" />

            <div className="relative rounded-[26px] border border-white/[0.12] bg-white/[0.025] p-[5px] shadow-[0_50px_160px_rgba(0,0,0,.9)] backdrop-blur-xl">

              <div className="relative overflow-hidden rounded-[21px] bg-black">

                <div className="relative aspect-[16/9]">

                  <img
                    src={birthdayData.memories[0]?.image}
                    alt="A meaningful memory"
                    className={`h-full w-full object-cover transition-all duration-[9000ms] ${
                      phase >= 4
                        ? "scale-110 opacity-100"
                        : "scale-100 opacity-75"
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.45)_100%)]" />

                  <div className="absolute inset-y-0 -left-[40%] w-[25%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent animate-[memorySweep_9s_ease-in-out_infinite]" />

                  <span className="absolute left-5 top-5 h-8 w-8 border-l border-t border-white/40" />

                  <span className="absolute right-5 top-5 h-8 w-8 border-r border-t border-white/40" />

                  <span className="absolute bottom-5 left-5 h-8 w-8 border-b border-l border-white/40" />

                  <span className="absolute bottom-5 right-5 h-8 w-8 border-b border-r border-white/40" />

                  <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">

                    <div className="text-left">

                      <div className="flex items-center gap-2">

                        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />

                        <p className="font-mono text-[6px] uppercase tracking-[0.5em] text-white/55">
                          MEMORY 001
                        </p>

                      </div>

                      <p className="mt-2 font-serif text-xs italic text-white/45 sm:text-sm">
                        A moment worth keeping.
                      </p>

                    </div>

                    <p className="font-mono text-[6px] tracking-[0.4em] text-white/35">
                      08.17
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SECOND MESSAGE
            ================================================= */}

        <div
          className={`relative z-20 mt-14 text-center transition-all duration-[2200ms] md:mt-20 ${
            phase >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >

          <p className="font-mono text-[6px] uppercase tracking-[0.65em] text-white/20 md:text-[7px]">
            ONE THING I WANT YOU TO REMEMBER
          </p>

          <p className="mt-6 font-serif text-2xl leading-[1.35] text-white/65 sm:text-3xl md:text-5xl">

            Some people pass through our lives.

            <br />

            <span className="text-white/35">
              Some moments stay.
            </span>

          </p>

        </div>

        {/* =================================================
            MAIN MESSAGE
            ================================================= */}

        <div
          className={`relative z-20 mt-20 w-full text-center transition-all duration-[2800ms] md:mt-28 ${
            phase >= 4
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-10 scale-[0.94] opacity-0"
          }`}
        >

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[120px]" />

          <div className="relative">

            <p className="font-mono text-[6px] uppercase tracking-[0.75em] text-white/20 md:text-[7px]">
              THE UNIVERSE REMEMBERS
            </p>

            <h1 className="mx-auto mt-8 max-w-6xl px-2 font-display text-5xl leading-[0.85] tracking-[-0.065em] text-white sm:text-6xl md:text-8xl lg:text-[8.5rem]">
              {birthdayData.finalMessage}
            </h1>

            <div className="mx-auto mt-10 flex items-center justify-center gap-4">

              <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/20 md:w-24" />

              <div className="relative">

                <div className="absolute inset-0 rounded-full bg-white blur-md opacity-30" />

                <span className="relative block h-1.5 w-1.5 rounded-full bg-white/70" />

              </div>

              <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/20 md:w-24" />

            </div>

          </div>

        </div>

        {/* =================================================
            FINAL PERSONAL REVEAL
            ================================================= */}

        <div
          className={`relative z-20 mt-24 flex w-full flex-col items-center text-center transition-all duration-[3000ms] md:mt-32 ${
            phase >= 5
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
        >

          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-10" />

            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] backdrop-blur-xl">

              <Heart
                size={13}
                strokeWidth={1}
                className="text-white/45"
              />

            </div>

          </div>

          <p className="mt-7 font-mono text-[6px] uppercase tracking-[0.7em] text-white/20">
            THIS UNIVERSE WAS MADE FOR
          </p>

          <h2 className="mt-5 font-display text-5xl leading-none tracking-[-0.05em] text-white sm:text-6xl md:text-8xl">

            {birthdayData.name}

            <span className="text-white/20">
              .
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-lg px-5 font-serif text-sm italic leading-[1.9] text-white/35 sm:text-base md:text-lg">

            And if you ever forget how far you've come,

            <br />

            <span className="text-white/50">
              come back here.
            </span>

          </p>

          <div className="mt-12 flex items-center gap-4">

            <span className="h-px w-10 bg-white/[0.08] sm:w-16" />

            <Sparkles
              size={10}
              strokeWidth={1}
              className="text-white/20"
            />

            <span className="h-px w-10 bg-white/[0.08] sm:w-16" />

          </div>

          <p className="mt-6 font-mono text-[6px] uppercase tracking-[0.75em] text-white/15">
            THE END IS ONLY ANOTHER BEGINNING
          </p>

          {/* =================================================
              REPLAY BUTTON
              ================================================= */}

          <button
            type="button"
            onClick={handleReplay}
            className="
              group
              relative
              z-50
              mt-9
              flex
              cursor-pointer
              items-center
              gap-4
              overflow-hidden
              rounded-full
              border
              border-white/[0.12]
              bg-white/[0.025]
              px-7
              py-3.5
              font-mono
              text-[7px]
              uppercase
              tracking-[0.4em]
              text-white/40
              backdrop-blur-xl
              transition-all
              duration-700
              hover:border-white/30
              hover:bg-white
              hover:text-black
              hover:shadow-[0_0_70px_rgba(255,255,255,.12)]
              active:scale-95
            "
          >

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <RotateCcw
              size={10}
              className="relative transition-transform duration-700 group-hover:-rotate-180"
            />

            <span className="relative">
              Replay the Universe
            </span>

            <ArrowRight
              size={11}
              className="relative transition-transform duration-500 group-hover:translate-x-1"
            />

          </button>

          <div className="h-28" />

        </div>

      </section>

      {/* =====================================================
          BOTTOM HUD
          ===================================================== */}

      <div
        className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pb-5 transition-all duration-[2500ms] ${
          phase >= 5
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0"
        }`}
      >

        <div className="flex items-center gap-3">

          <span className="font-mono text-[5px] uppercase tracking-[0.55em] text-white/10">
            MEMORY ARCHIVE
          </span>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <span className="font-mono text-[5px] tracking-[0.4em] text-white/10">
            001 / ∞
          </span>

        </div>

      </div>

      {/* =====================================================
          ANIMATIONS
          ===================================================== */}

      <style>{`

        @keyframes finaleStar {
          0% {
            opacity: .08;
            transform: scale(.6);
          }

          50% {
            opacity: .35;
          }

          100% {
            opacity: .8;
            transform: scale(1.5);
          }
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

        @keyframes memorySweep {

          0% {
            transform:
              translateX(-120%)
              skewX(-20deg);

            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          45% {
            opacity: .6;
          }

          70% {
            opacity: 0;
          }

          100% {
            transform:
              translateX(600%)
              skewX(-20deg);

            opacity: 0;
          }

        }

        .finale-noise {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
        }

        @media (max-width: 768px) {

          @keyframes finaleStar {

            0% {
              opacity: .05;
              transform: scale(.7);
            }

            100% {
              opacity: .55;
              transform: scale(1.2);
            }

          }

        }

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