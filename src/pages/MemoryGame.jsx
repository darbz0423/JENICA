import { useEffect, useMemo, useRef, useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
  Clock3,
  Target,
  Lock,
  ScanLine,
  Star,
  Infinity,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remaining
  ).padStart(2, "0")}`;
}

export default function MemoryGame() {


  const source = birthdayData.memories.slice(0, 6);

  const createCards = () =>
    shuffle(
      source.flatMap((memory) => [
        {
          id: `${memory.id}-a`,
          pair: memory.id,
          image: memory.image,
          title: memory.title,
        },
        {
          id: `${memory.id}-b`,
          pair: memory.id,
          image: memory.image,
          title: memory.title,
        },
      ])
    );

  const [cards, setCards] = useState(createCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [celebrating, setCelebrating] = useState(null);

  const timerRef = useRef(null);

  const complete = matched.length === source.length;

  const progress = useMemo(() => {
    if (!source.length) return 0;

    return Math.round(
      (matched.length / source.length) * 100
    );
  }, [matched.length, source.length]);

  const accuracy = useMemo(() => {
    if (!moves) return 100;

    return Math.max(
      0,
      Math.round(((moves - mistakes) / moves) * 100)
    );
  }, [moves, mistakes]);

  /*
  ============================================================
  TIMER
  ============================================================
  */

  useEffect(() => {
    if (!started || complete) return;

    timerRef.current = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [started, complete]);

  /*
  ============================================================
  MATCH CHECK
  ============================================================
  */

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [first, second] = flipped;

    setMoves((value) => value + 1);
    setIsChecking(true);

    if (first.pair === second.pair) {
      setCombo((value) => {
        const next = value + 1;

        setBestCombo((best) =>
          Math.max(best, next)
        );

        return next;
      });

      setCelebrating(first.pair);

      const timer = setTimeout(() => {
        setMatched((current) => [
          ...current,
          first.pair,
        ]);

        setFlipped([]);
        setIsChecking(false);
        setCelebrating(null);
      }, 700);

      return () => clearTimeout(timer);
    }

    setCombo(0);
    setMistakes((value) => value + 1);

    const timer = setTimeout(() => {
      setFlipped([]);
      setIsChecking(false);
    }, 1150);

    return () => clearTimeout(timer);
  }, [flipped]);

  /*
  ============================================================
  CHOOSE CARD
  ============================================================
  */

  const choose = (card) => {
    if (!started) {
      setStarted(true);
    }

    if (
      isChecking ||
      flipped.length >= 2 ||
      flipped.some(
        (item) => item.id === card.id
      ) ||
      matched.includes(card.pair)
    ) {
      return;
    }

    setFlipped((current) => [
      ...current,
      card,
    ]);
  };

  /*
  ============================================================
  RESET
  ============================================================
  */

  const resetGame = () => {
    clearInterval(timerRef.current);

    setCards(createCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStarted(false);
    setIsChecking(false);
    setSeconds(0);
    setCombo(0);
    setBestCombo(0);
    setMistakes(0);
    setCelebrating(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010102] px-4 pb-40 pt-24 text-white sm:px-6 md:px-10 md:pt-28">

      {/* ======================================================
          ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="
            absolute
            left-1/2
            top-[38%]
            h-[700px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-violet-500/[0.045]
            blur-[170px]
            animate-[nebula_12s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -left-64
            top-[45%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/[0.025]
            blur-[150px]
            animate-[float_15s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -right-64
            top-[18%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-amber-300/[0.025]
            blur-[160px]
            animate-[float_18s_ease-in-out_infinite_reverse]
          "
        />

        {Array.from({ length: 90 }).map(
          (_, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(index * 47) % 100}%`,
                top: `${(index * 73) % 100}%`,
                width:
                  index % 9 === 0
                    ? "2px"
                    : "1px",
                height:
                  index % 9 === 0
                    ? "2px"
                    : "1px",
                opacity:
                  0.08 +
                  ((index * 17) % 65) / 100,
                animation:
                  index % 7 === 0
                    ? `twinkle ${
                        2 + (index % 4)
                      }s ease-in-out infinite alternate`
                    : "none",
              }}
            />
          )
        )}

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
            [background-size:70px_70px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.9)_100%)]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(to_bottom,rgba(255,255,255,.3)_1px,transparent_1px)]
            [background-size:100%_6px]
          "
        />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* TOP STATUS */}

        <div className="mb-10 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">

              <span className="absolute inset-1 rounded-full border border-dashed border-white/10 animate-[spin_12s_linear_infinite]" />

              <ScanLine
                size={12}
                strokeWidth={1}
                className="text-white/50"
              />

            </div>

            <div>

              <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/35">
                MEMORY UNIVERSE
              </p>

              <p className="mt-1 font-mono text-[5px] tracking-[0.25em] text-white/10">
                ARCHIVE // PROTOCOL 07
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />

            <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
              SYSTEM ONLINE
            </span>

          </div>

        </div>

        {/* ====================================================
            HERO
        ==================================================== */}

        <header className="text-center">

          <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">

            <span className="absolute inset-0 rounded-full border border-white/[0.07] animate-[spin_20s_linear_infinite]" />

            <span className="absolute -inset-3 rotate-45 rounded-xl border border-dashed border-white/[0.04] animate-[spin_26s_linear_infinite_reverse]" />

            <span className="absolute -inset-6 rounded-full border border-white/[0.025]" />

            <div className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_25px_white]" />

            <Sparkles
              size={16}
              strokeWidth={1}
              className="text-white/50"
            />

          </div>

          <div className="flex items-center justify-center gap-4">

            <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />

            <p className="font-mono text-[6px] uppercase tracking-[0.65em] text-white/30">
              MEMORY RETRIEVAL PROTOCOL
            </p>

            <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />

          </div>

          <h1 className="mt-8 font-display text-[4.5rem] leading-[0.78] tracking-[-0.07em] sm:text-8xl md:text-[9.5rem]">

            Find

            <br />

            <span className="relative text-white/20">

              them.

              <span className="absolute -bottom-3 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            </span>

          </h1>

          <p className="mx-auto mt-9 max-w-lg font-serif text-base leading-[1.8] text-white/30 sm:text-lg">

            Six memories were fragmented.

            <br />

            Find their reflections and restore
            the archive.

          </p>

        </header>

        {/* ====================================================
            HUD
        ==================================================== */}

        <section className="mt-14">

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">

            <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="grid grid-cols-2 md:grid-cols-4">

              <HudItem
                icon={Zap}
                label="MOVES"
                value={String(moves).padStart(2, "0")}
              />

              <HudItem
                icon={Clock3}
                label="TIME"
                value={formatTime(seconds)}
              />

              <HudItem
                icon={Target}
                label="ACCURACY"
                value={`${accuracy}%`}
              />

              <HudItem
                icon={Star}
                label="RESTORED"
                value={`${matched.length}/${source.length}`}
              />

            </div>

            <div className="border-t border-white/[0.06] px-5 py-4 sm:px-7">

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/20">
                    ARCHIVE RESTORATION
                  </span>

                  <span className="h-1 w-1 rounded-full bg-white/20" />

                  <span className="font-mono text-[5px] text-white/10">
                    {progress}%
                  </span>

                </div>

                {combo > 1 && (
                  <span className="animate-pulse font-mono text-[5px] uppercase tracking-[0.3em] text-white/50">
                    {combo}× MEMORY CHAIN
                  </span>
                )}

              </div>

              <div className="relative h-[3px] overflow-hidden rounded-full bg-white/[0.05]">

                <div
                  className="h-full rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,.7)] transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            GAME
        ==================================================== */}

        <section className="relative mt-8 sm:mt-10">

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.018] md:block" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.015] animate-[spin_80s_linear_infinite] md:block" />

          <div className="relative grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-4">

            {cards.map((card, index) => {

              const isFlipped =
                flipped.some(
                  (item) => item.id === card.id
                ) ||
                matched.includes(card.pair);

              const isMatched =
                matched.includes(card.pair);

              const isCelebrating =
                celebrating === card.pair;

              return (
                <button
                  key={card.id}
                  onClick={() => choose(card)}
                  disabled={
                    isChecking ||
                    isMatched
                  }
                  aria-label={
                    isFlipped
                      ? card.title
                      : "Hidden memory"
                  }
                  className="group relative aspect-[3/4] [perspective:1400px]"
                >

                  <div
                    className={`
                      relative
                      h-full
                      w-full
                      [transform-style:preserve-3d]
                      transition-transform
                      duration-700
                      ease-[cubic-bezier(.16,1,.3,1)]
                      ${
                        isFlipped
                          ? "[transform:rotateY(180deg)]"
                          : ""
                      }
                    `}
                  >

                    {/* BACK */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/[0.09]
                        bg-[#060607]
                        [backface-visibility:hidden]
                        transition-all
                        duration-500
                        group-hover:border-white/[0.2]
                        group-hover:shadow-[0_20px_60px_rgba(0,0,0,.5)]
                      "
                    >

                      <div className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-[1200ms] group-hover:translate-x-[350%]" />

                      <div className="absolute inset-2 rounded-xl border border-white/[0.025] sm:inset-3" />

                      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 sm:h-28 sm:w-28">

                        <span className="absolute inset-0 rounded-full border border-white/[0.045] animate-[spin_14s_linear_infinite]" />

                        <span className="absolute inset-3 rounded-full border border-dashed border-white/[0.06] animate-[spin_9s_linear_infinite_reverse]" />

                        <span className="absolute inset-7 rotate-45 rounded-lg border border-white/[0.08] transition-all duration-700 group-hover:rotate-90 group-hover:scale-110 group-hover:border-white/20" />

                        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 shadow-[0_0_25px_rgba(255,255,255,.15)] transition-all duration-500 group-hover:bg-white/50 group-hover:shadow-[0_0_35px_rgba(255,255,255,.7)]" />

                      </div>

                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-xl text-white/25 transition-all duration-500 group-hover:scale-150 group-hover:text-white/80">
                        ✦
                      </span>

                      <span className="absolute bottom-3 left-3 font-mono text-[5px] tracking-[0.3em] text-white/10 sm:bottom-4 sm:left-4">
                        MEMORY_{String(index + 1).padStart(2, "0")}
                      </span>

                      <Lock
                        size={9}
                        strokeWidth={1}
                        className="absolute right-3 top-3 text-white/10 transition-colors group-hover:text-white/30 sm:right-4 sm:top-4"
                      />

                      <span className="absolute bottom-3 right-3 hidden font-mono text-[5px] uppercase tracking-[0.2em] text-white/10 transition-colors group-hover:text-white/40 sm:block">
                        ACCESS
                      </span>

                    </div>

                    {/* FRONT */}

                    <div
                      className={`
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-black
                        [backface-visibility:hidden]
                        [transform:rotateY(180deg)]
                        ${
                          isMatched
                            ? "border-white/40 shadow-[0_0_45px_rgba(255,255,255,.16)]"
                            : "border-white/[0.12]"
                        }
                        ${
                          isCelebrating
                            ? "animate-[matchPulse_.7s_ease-out]"
                            : ""
                        }
                      `}
                    >

                      <img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        decoding="async"
                        className={`
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-[1400ms]
                          ${
                            isMatched
                              ? "scale-110"
                              : "group-hover:scale-105"
                          }
                        `}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/10" />

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,.45)_100%)]" />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          right-0
                          top-0
                          h-px
                          bg-gradient-to-r
                          from-transparent
                          via-white/50
                          to-transparent
                          animate-[scan_3s_linear_infinite]
                        "
                      />

                      {isMatched && (
                        <>
                          <div className="absolute inset-0 bg-white/[0.045]" />

                          <div className="absolute inset-3 rounded-xl border border-white/20" />

                          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-md">

                            <Sparkles
                              size={11}
                              className="text-white"
                            />

                          </div>
                        </>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3 text-left sm:p-4">

                        <p className="font-mono text-[5px] uppercase tracking-[0.35em] text-white/40">
                          MEMORY RESTORED
                        </p>

                        <p className="mt-1 truncate font-serif text-xs text-white/90 sm:text-sm">
                          {card.title}
                        </p>

                      </div>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        </section>

        {/* ====================================================
            INSTRUCTION
        ==================================================== */}

        {!complete && (
          <div className="mx-auto mt-10 max-w-xl">

            <div className="flex items-center gap-4">

              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />

              <div className="text-center">

                <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/20">

                  {started
                    ? isChecking
                      ? "ANALYZING MEMORY..."
                      : "MEMORIES ARE WAITING"
                    : "TAP A FRAGMENT TO BEGIN"}

                </p>

                {bestCombo > 1 && (
                  <p className="mt-2 font-mono text-[5px] tracking-[0.3em] text-white/10">
                    BEST CHAIN // {bestCombo}×
                  </p>
                )}

              </div>

              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />

            </div>

          </div>
        )}

      </div>

      {/* ======================================================
          ✦ CINEMATIC COMPLETION EXPERIENCE
      ====================================================== */}

      {complete && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black/80
            p-4
            backdrop-blur-2xl
            animate-[finaleIn_.9s_cubic-bezier(.16,1,.3,1)]
          "
        >

          {/* ==================================================
              COSMIC BACKGROUND
          ================================================== */}

          <div className="pointer-events-none absolute inset-0">

            {/* giant glow */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[700px]
                w-[700px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/[0.035]
                blur-[120px]
                animate-[finaleGlow_5s_ease-in-out_infinite]
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[450px]
                w-[450px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-white/[0.035]
                animate-[finaleOrbit_30s_linear_infinite]
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[600px]
                w-[600px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-dashed
                border-white/[0.025]
                animate-[finaleOrbit_45s_linear_infinite_reverse]
              "
            />

            {/* stars */}

            {Array.from({ length: 55 }).map(
              (_, index) => (
                <span
                  key={index}
                  className="
                    absolute
                    rounded-full
                    bg-white
                    animate-[finaleStar_2s_ease-in-out_infinite_alternate]
                  "
                  style={{
                    left: `${(index * 37) % 100}%`,
                    top: `${(index * 61) % 100}%`,
                    width:
                      index % 8 === 0
                        ? "3px"
                        : "1px",
                    height:
                      index % 8 === 0
                        ? "3px"
                        : "1px",
                    opacity:
                      0.1 +
                      ((index * 13) % 50) / 100,
                    animationDelay: `${
                      (index % 9) * 0.25
                    }s`,
                  }}
                />
              )
            )}

            {/* cinematic lines */}

            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

            <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />

          </div>

          {/* ==================================================
              MODAL
          ================================================== */}

          <div
            className="
              relative
              z-10
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[2rem]
              border
              border-white/[0.12]
              bg-[#050506]/90
              p-7
              text-center
              shadow-[0_0_120px_rgba(255,255,255,.08),0_50px_150px_rgba(0,0,0,.9)]
              backdrop-blur-3xl
              sm:p-12
              animate-[finaleCard_.9s_cubic-bezier(.16,1,.3,1)]
            "
          >

            {/* top scanning beam */}

            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[finaleScan_2.5s_linear_infinite]" />

            {/* corner decorations */}

            <span className="absolute left-5 top-5 h-10 w-10 border-l border-t border-white/15" />

            <span className="absolute right-5 top-5 h-10 w-10 border-r border-t border-white/15" />

            <span className="absolute bottom-5 left-5 h-10 w-10 border-b border-l border-white/15" />

            <span className="absolute bottom-5 right-5 h-10 w-10 border-b border-r border-white/15" />

            {/* ==================================================
                CORE
            ================================================== */}

            <div className="relative mx-auto flex h-32 w-32 items-center justify-center">

              {/* outer rings */}

              <div className="absolute inset-0 rounded-full border border-white/[0.08] animate-[spin_18s_linear_infinite]" />

              <div className="absolute -inset-4 rounded-full border border-dashed border-white/[0.05] animate-[spin_24s_linear_infinite_reverse]" />

              <div className="absolute -inset-8 rounded-full border border-white/[0.025]" />

              {/* orbital dots */}

              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_15px_white]" />

              <span className="absolute bottom-2 right-5 h-1 w-1 rounded-full bg-white/70 shadow-[0_0_10px_white]" />

              <span className="absolute bottom-5 left-4 h-1 w-1 rounded-full bg-white/50" />

              {/* center */}

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/[0.025] shadow-[0_0_80px_rgba(255,255,255,.12)]">

                <div className="absolute inset-2 rounded-full border border-dashed border-white/10 animate-[spin_8s_linear_infinite]" />

                <Trophy
                  size={28}
                  strokeWidth={1}
                  className="relative text-white/85"
                />

              </div>

            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <div className="mt-8 flex items-center justify-center gap-3">

              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/25" />

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_15px_rgba(110,231,183,.9)]" />

                <p className="font-mono text-[6px] uppercase tracking-[0.6em] text-white/40">
                  ARCHIVE RESTORED
                </p>

              </div>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/25" />

            </div>

            {/* ==================================================
                TITLE
            ================================================== */}

            <h2 className="mt-7 font-display text-[4rem] leading-[0.8] tracking-[-0.07em] sm:text-7xl">

              You found

              <br />

              <span className="relative text-white/25">

                them all.

                <span className="absolute -bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              </span>

            </h2>

            <p className="mx-auto mt-8 max-w-md font-serif text-base italic leading-[1.8] text-white/35 sm:text-lg">

              Six fragments.
              Twelve photographs.
              <br />

              One universe restored.

            </p>

            {/* ==================================================
                100% RESTORED
            ================================================== */}

            <div className="mx-auto mt-9 max-w-md">

              <div className="mb-3 flex items-center justify-between">

                <span className="font-mono text-[5px] uppercase tracking-[0.35em] text-white/20">
                  MEMORY INTEGRITY
                </span>

                <span className="font-mono text-[7px] text-white/60">
                  100%
                </span>

              </div>

              <div className="relative h-[3px] overflow-hidden rounded-full bg-white/[0.06]">

                <div className="absolute inset-0 bg-white/80 shadow-[0_0_25px_white] animate-[restoreBar_1.5s_cubic-bezier(.16,1,.3,1)_forwards]" />

              </div>

            </div>

            {/* ==================================================
                RESULTS
            ================================================== */}

            <div className="mx-auto mt-8 grid max-w-md grid-cols-3 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">

              <FinalStat
                label="TIME"
                value={formatTime(seconds)}
              />

              <FinalStat
                label="MOVES"
                value={moves}
              />

              <FinalStat
                label="ACCURACY"
                value={`${accuracy}%`}
              />

            </div>

            <div className="mt-4 flex items-center justify-center gap-2">

              <Infinity
                size={10}
                strokeWidth={1}
                className="text-white/20"
              />

              <span className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/15">
                BEST MEMORY CHAIN // {bestCombo}×
              </span>

            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              {/* REPLAY */}

              <button
                onClick={resetGame}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  border
                  border-white/[0.1]
                  bg-white/[0.025]
                  px-6
                  py-4
                  font-mono
                  text-[7px]
                  uppercase
                  tracking-[0.35em]
                  text-white/35
                  transition-all
                  duration-500
                  hover:border-white/25
                  hover:bg-white/[0.06]
                  hover:text-white
                  sm:w-auto
                "
              >

                <RotateCcw
                  size={11}
                  className="transition-transform duration-500 group-hover:-rotate-180"
                />

                PLAY AGAIN

              </button>

            </div>

            {/* footer */}

            <div className="mt-8 flex items-center justify-center gap-2">

              <Sparkles
                size={9}
                strokeWidth={1}
                className="text-white/15"
              />

              <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/15">
                THE ARCHIVE REMEMBERS EVERYTHING
              </span>

              <Sparkles
                size={9}
                strokeWidth={1}
                className="text-white/15"
              />

            </div>

          </div>

        </div>
      )}

      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes twinkle {
          from {
            opacity: .08;
            transform: scale(.8);
          }

          to {
            opacity: .7;
            transform: scale(1.5);
          }
        }

        @keyframes nebula {
          0%,
          100% {
            transform: translate(-50%, 0) scale(1);
          }

          50% {
            transform: translate(-50%, -30px) scale(1.08);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(50px, -40px, 0);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          10% {
            opacity: .7;
          }

          90% {
            opacity: .7;
          }

          100% {
            transform: translateY(400px);
            opacity: 0;
          }
        }

        @keyframes matchPulse {
          0% {
            transform: rotateY(180deg) scale(.95);
            filter: brightness(1);
          }

          40% {
            transform: rotateY(180deg) scale(1.04);
            filter: brightness(1.5);
          }

          100% {
            transform: rotateY(180deg) scale(1);
            filter: brightness(1);
          }
        }

        /* =====================================================
           FINALE ANIMATIONS
        ===================================================== */

        @keyframes finaleIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }

          to {
            opacity: 1;
            backdrop-filter: blur(20px);
          }
        }

        @keyframes finaleCard {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(.88);
            filter: blur(12px);
          }

          60% {
            opacity: 1;
            transform: translateY(-5px) scale(1.015);
            filter: blur(0);
          }

          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes finaleGlow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(.9);
            opacity: .35;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: .7;
          }
        }

        @keyframes finaleOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes finaleStar {
          from {
            transform: scale(.5);
            opacity: .15;
          }

          to {
            transform: scale(1.8);
            opacity: .9;
          }
        }

        @keyframes finaleScan {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes restoreBar {
          from {
            width: 0%;
          }

          to {
            width: 100%;
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

/*
==============================================================
HUD ITEM
==============================================================
*/

function HudItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="relative flex items-center gap-3 border-b border-white/[0.05] p-4 last:border-b-0 sm:p-5 md:border-b-0 md:border-r md:last:border-r-0">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">

        <Icon
          size={12}
          strokeWidth={1}
          className="text-white/35"
        />

      </div>

      <div>

        <p className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
          {label}
        </p>

        <p className="mt-1 font-mono text-sm text-white/70">
          {value}
        </p>

      </div>

    </div>
  );
}

/*
==============================================================
FINAL STAT
==============================================================
*/

function FinalStat({
  label,
  value,
}) {
  return (
    <div className="relative py-4">

      <p className="font-mono text-[5px] uppercase tracking-[0.35em] text-white/20">
        {label}
      </p>

      <p className="mt-2 font-mono text-sm text-white/70">
        {value}
      </p>

    </div>
  );
}