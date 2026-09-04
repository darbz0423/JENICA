import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Feather,
  Heart,
  Lock,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

const HISTORY_KEY = "__memoryUniverseLetters";

export default function Letters() {
  const [opened, setOpened] = useState(null);
  const [activeCard, setActiveCard] = useState(0);

  /*
   * ============================================================
   * PROTECTED NAVIGATION REFS
   * ============================================================
   */

  const openedRef = useRef(null);
  const isUnmountingRef = useRef(false);
  const isRestoringRef = useRef(false);
  const isClosingFromPopRef = useRef(false);

  const letters = birthdayData.letters || [];

  /*
   * ============================================================
   * KEEP OPENED REF SYNCHRONIZED
   * ============================================================
   */

  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  /*
   * ============================================================
   * CREATE PROTECTED LETTERS PAGE STATE
   * ============================================================
   */

  useEffect(() => {
    isUnmountingRef.current = false;

    const currentState = window.history.state || {};
    const currentLettersState = currentState[HISTORY_KEY];

    if (!currentLettersState?.base) {
      window.history.replaceState(
        {
          ...currentState,
          [HISTORY_KEY]: {
            base: true,
            guard: false,
            modal: false,
          },
        },
        "",
        window.location.href
      );
    }

    const stateAfterBase = window.history.state || {};
    const lettersStateAfterBase = stateAfterBase[HISTORY_KEY];

    if (!lettersStateAfterBase?.guard) {
      window.history.pushState(
        {
          ...stateAfterBase,
          [HISTORY_KEY]: {
            base: true,
            guard: true,
            modal: false,
          },
        },
        "",
        window.location.href
      );
    }

    return () => {
      isUnmountingRef.current = true;
    };
  }, []);

  /*
   * ============================================================
   * PROTECTED BACK / SWIPE-BACK NAVIGATION
   *
   * PRIORITY:
   * 1. Close open letter.
   * 2. Restore Letters guard.
   * ============================================================
   */

  useEffect(() => {
    const handlePopState = (event) => {
      if (isUnmountingRef.current) return;

      const currentOpened = openedRef.current;
      const state = event.state || {};
      const lettersState = state[HISTORY_KEY];

      /*
       * --------------------------------------------------------
       * PRIORITY 1 — MODAL OPEN
       * --------------------------------------------------------
       */

      if (currentOpened) {
        isClosingFromPopRef.current = true;

        setOpened(null);
        openedRef.current = null;

        window.setTimeout(() => {
          if (isUnmountingRef.current) return;

          const currentState = window.history.state || {};
          const currentLettersState = currentState[HISTORY_KEY];

          if (!currentLettersState?.guard) {
            isRestoringRef.current = true;

            window.history.pushState(
              {
                ...currentState,
                [HISTORY_KEY]: {
                  base: true,
                  guard: true,
                  modal: false,
                },
              },
              "",
              window.location.href
            );

            window.setTimeout(() => {
              isRestoringRef.current = false;
            }, 50);
          }

          isClosingFromPopRef.current = false;
        }, 0);

        return;
      }

      /*
       * --------------------------------------------------------
       * PRIORITY 2 — MAIN PAGE PROTECTION
       * --------------------------------------------------------
       */

      if (isRestoringRef.current) return;

      if (!lettersState?.guard) {
        isRestoringRef.current = true;

        window.history.pushState(
          {
            ...state,
            [HISTORY_KEY]: {
              base: true,
              guard: true,
              modal: false,
            },
          },
          "",
          window.location.href
        );

        window.setTimeout(() => {
          isRestoringRef.current = false;
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /*
   * ============================================================
   * LOCK BODY SCROLL
   * ============================================================
   */

  useEffect(() => {
    if (!opened) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior =
      document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior =
        previousOverscrollBehavior;
    };
  }, [opened]);

  /*
   * ============================================================
   * OPEN LETTER
   * ============================================================
   */

  const openLetter = (letter, index) => {
    if (!letter) return;
    if (openedRef.current) return;

    setActiveCard(index);
    setOpened(letter);
    openedRef.current = letter;

    const currentState = window.history.state || {};

    window.history.pushState(
      {
        ...currentState,
        [HISTORY_KEY]: {
          base: true,
          guard: true,
          modal: true,
          letterId: letter.id,
        },
      },
      "",
      window.location.href
    );

    if (navigator.vibrate) {
      navigator.vibrate([8, 25, 10]);
    }
  };

  /*
   * ============================================================
   * CLOSE LETTER
   * ============================================================
   */

  const closeLetter = () => {
    if (!openedRef.current) return;

    const currentState = window.history.state || {};
    const lettersState = currentState[HISTORY_KEY];

    if (
      lettersState?.modal &&
      !isClosingFromPopRef.current
    ) {
      window.history.back();
      return;
    }

    setOpened(null);
    openedRef.current = null;
    isClosingFromPopRef.current = false;
  };

  /*
   * ============================================================
   * KEYBOARD SUPPORT
   * ============================================================
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        openedRef.current
      ) {
        closeLetter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /*
   * ============================================================
   * MOBILE EDGE SWIPE
   * ============================================================
   */

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event) => {
      if (!openedRef.current) return;

      const touch = event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (event) => {
      if (!openedRef.current) return;

      const touch = event.changedTouches[0];

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      const startedNearLeftEdge = startX <= 45;

      const isHorizontal =
        Math.abs(deltaX) > Math.abs(deltaY);

      if (
        startedNearLeftEdge &&
        isHorizontal &&
        deltaX > 90
      ) {
        closeLetter();
      }
    };

    window.addEventListener(
      "touchstart",
      handleTouchStart,
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020202] px-4 pb-32 pt-24 text-white selection:bg-white selection:text-black sm:px-6 sm:pt-28 md:px-10 md:pb-40 md:pt-32">
      {/* =========================================================
          CINEMATIC ANIMATION SYSTEM
      ========================================================= */}

      <style>{`
        @keyframes lettersFloat {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(1);
          }
          50% {
            transform: translate3d(-50%, calc(-50% - 30px), 0) scale(1.08);
          }
        }

        @keyframes lettersDrift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(35px, -28px, 0);
          }
        }

        @keyframes lettersScan {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes lettersReveal {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes paperReveal {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.55;
          }
        }

        .letters-reveal {
          animation: lettersReveal 1s cubic-bezier(.16,1,.3,1) both;
        }

        .letters-reveal-delay {
          animation: lettersReveal 1s .12s cubic-bezier(.16,1,.3,1) both;
        }

        .paper-reveal {
          animation: paperReveal .8s cubic-bezier(.16,1,.3,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* =========================================================
          CINEMATIC BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#020202]" />

        {/* Central cinematic bloom */}
        <div
          className="absolute left-1/2 top-[38%] h-[520px] w-[520px] rounded-full bg-white/[0.025] blur-[120px]"
          style={{
            animation:
              "lettersFloat 14s ease-in-out infinite",
          }}
        />

        {/* Violet atmosphere */}
        <div
          className="absolute -left-40 top-[18%] h-[420px] w-[420px] rounded-full bg-violet-500/[0.025] blur-[130px]"
          style={{
            animation:
              "lettersDrift 16s ease-in-out infinite",
          }}
        />

        {/* Warm archive atmosphere */}
        <div
          className="absolute -right-40 top-[52%] h-[440px] w-[440px] rounded-full bg-amber-200/[0.018] blur-[140px]"
          style={{
            animation:
              "lettersDrift 19s ease-in-out infinite reverse",
          }}
        />

        {/* Deep vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,transparent_0%,rgba(0,0,0,.2)_42%,rgba(0,0,0,.82)_100%)]" />

        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(rgba(255,255,255,.65)_0.45px,transparent_0.45px)] [background-size:5px_5px]" />

        {/* Analog scanlines */}
        <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:100%_5px]" />

        {/* Slow cinematic scan */}
        <div
          className="absolute left-0 right-0 h-[35vh] bg-gradient-to-b from-transparent via-white/[0.015] to-transparent"
          style={{
            animation:
              "lettersScan 18s linear infinite",
          }}
        />
      </div>

      {/* =========================================================
          TOP NAV
      ========================================================= */}

      <div className="letters-reveal mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-white/[0.1]" />

            <span className="absolute -inset-2 rounded-full border border-white/[0.035]" />

            <Mail
              size={13}
              strokeWidth={1}
              className="relative text-white/50"
            />
          </div>

          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.5em] text-white/30">
              MEMORY UNIVERSE
            </p>

            <p className="mt-1 font-mono text-[5px] tracking-[0.35em] text-white/12">
              PRIVATE CORRESPONDENCE ARCHIVE
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/20">
            CORRESPONDENCE
          </span>

          <span
            className="h-1 w-1 rounded-full bg-white/40"
            style={{
              animation:
                "pulseGlow 2.5s ease-in-out infinite",
            }}
          />

          <span className="font-mono text-[5px] tracking-[0.3em] text-white/15">
            {String(letters.length).padStart(2, "0")} FRAGMENTS
          </span>
        </div>
      </div>

      {/* =========================================================
          HERO
      ========================================================= */}

      <header className="letters-reveal-delay relative mx-auto max-w-5xl pt-20 text-center sm:pt-24 md:pt-28">
        <div className="mx-auto mb-10 flex h-16 w-16 items-center justify-center">
          <div className="relative flex h-11 w-11 items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-white/[0.15]" />

            <span className="absolute -inset-3 rounded-full border border-dashed border-white/[0.06]" />

            <span className="absolute -inset-6 rounded-full border border-white/[0.025]" />

            <Feather
              size={16}
              strokeWidth={1}
              className="relative rotate-[-12deg] text-white/55"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/30 sm:w-20" />

          <span className="font-mono text-[6px] uppercase tracking-[0.6em] text-white/30">
            LETTERS FROM THE HEART
          </span>

          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/30 sm:w-20" />
        </div>

        <h1 className="mt-10 font-display text-[5rem] leading-[0.72] tracking-[-0.075em] text-white sm:text-8xl md:text-[10rem]">
          Words
          <br />

          <span className="relative inline-block text-white/[0.18]">
            for you.

            <span className="absolute bottom-[-12px] left-1/2 h-px w-[65%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
        </h1>

        <p className="mx-auto mt-12 max-w-md px-3 font-serif text-[15px] leading-[2] text-white/40 sm:text-lg">
          Three little pieces of my heart,
          <br />
          preserved between moments,
          <br />
          written only for you.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="h-1 w-1 rounded-full bg-white/60 shadow-[0_0_12px_rgba(255,255,255,.8)]" />

          <span className="font-mono text-[5px] uppercase tracking-[0.55em] text-white/18">
            SEALED WITH LOVE
          </span>

          <Heart
            size={8}
            fill="currentColor"
            className="text-white/25"
          />
        </div>
      </header>

      {/* =========================================================
          LETTER CARDS
      ========================================================= */}

      <section className="relative mx-auto mt-20 max-w-7xl sm:mt-24 md:mt-32">
        {/* Orbital archive geometry */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.018] md:block" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.025] md:block" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03] md:block" />

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {letters.map((letter, index) => {
            const isActive =
              activeCard === index;

            return (
              <article
                key={letter.id}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[26px]
                  border
                  bg-[#070707]
                  transition-all
                  duration-700
                  hover:-translate-y-2
                  hover:shadow-[0_35px_90px_rgba(0,0,0,.6)]
                  ${
                    isActive
                      ? "border-white/[0.18]"
                      : "border-white/[0.075]"
                  }
                `}
              >
                {/* Card light */}

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,.09),transparent_42%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-48 w-48 rounded-full bg-white/[0.025] blur-[55px] transition-all duration-700 group-hover:bg-white/[0.055]" />

                {/* Archive number */}

                <div className="pointer-events-none absolute bottom-[-40px] right-[-10px] font-display text-[10rem] leading-none tracking-[-0.1em] text-white/[0.018] transition-all duration-700 group-hover:text-white/[0.04]">
                  0{index + 1}
                </div>

                <div className="relative flex min-h-[455px] flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <span className="absolute inset-0 rotate-45 border border-white/[0.1] transition-all duration-700 group-hover:scale-110 group-hover:border-white/[0.2]" />

                      <Mail
                        size={15}
                        strokeWidth={1}
                        className="relative text-white/45"
                      />
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[6px] tracking-[0.35em] text-white/12">
                        ARCHIVE
                      </span>

                      <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/30">
                        0{index + 1}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center gap-2.5">
                    <span className="h-1 w-1 rounded-full bg-white/45" />

                    <span className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/22">
                      PRIVATE LETTER
                    </span>
                  </div>

                  <h2 className="mt-6 max-w-[280px] font-serif text-[2.15rem] leading-[0.94] tracking-[-0.035em] text-white/88 transition-all duration-500 group-hover:text-white sm:text-[2.4rem]">
                    {letter.title}
                  </h2>

                  <p className="mt-6 max-w-[270px] font-serif text-sm italic leading-[1.8] text-white/28 transition-colors duration-500 group-hover:text-white/50">
                    {letter.subtitle}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-7 flex items-center gap-3">
                      <span className="h-px w-12 bg-white/[0.09]" />

                      <div className="relative">
                        <span className="absolute inset-[-8px] rounded-full bg-white/[0.04] blur-md" />

                        <Sparkles
                          size={10}
                          strokeWidth={1}
                          className="relative text-white/25"
                        />
                      </div>

                      <span className="h-px flex-1 bg-white/[0.06]" />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openLetter(
                          letter,
                          index
                        )
                      }
                      className="relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-4 text-left transition-all duration-500 hover:border-white/[0.22] hover:bg-white/[0.07] active:scale-[0.98]"
                    >
                      <span className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-white/[0.06] to-transparent transition-transform duration-500 group-hover:translate-y-0" />

                      <span className="relative flex items-center gap-3">
                        <Lock
                          size={10}
                          strokeWidth={1}
                          className="text-white/30"
                        />

                        <span className="font-mono text-[6px] uppercase tracking-[0.4em] text-white/40">
                          Open this letter
                        </span>
                      </span>

                      <ArrowUpRight
                        size={14}
                        strokeWidth={1}
                        className="relative text-white/30 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          CINEMATIC DIVIDER
      ========================================================= */}

      <div className="mx-auto mt-20 flex max-w-5xl items-center justify-center gap-5 sm:mt-24">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.08]" />

        <div className="relative text-center">
          <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-xl" />

          <Heart
            size={12}
            fill="currentColor"
            className="relative mx-auto text-white/25"
          />

          <p className="mt-4 font-mono text-[5px] uppercase tracking-[0.55em] text-white/13">
            Written only for you
          </p>
        </div>

        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.08]" />
      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="mx-auto mt-14 max-w-xl text-center sm:mt-20">
        <p className="font-serif text-[15px] italic leading-[2] text-white/25 sm:text-lg">
          Some words are meant to be read once.
          <br />
          Some are meant to become part of you.
          <br />
          And some are meant to be kept forever.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-white/[0.07]" />

          <span className="font-mono text-[5px] tracking-[0.5em] text-white/12">
            MEMORY ARCHIVE // LOVE
          </span>

          <span className="h-px w-10 bg-white/[0.07]" />
        </div>
      </footer>

      {/* =========================================================
          LETTER MODAL
      ========================================================= */}

      {opened && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#010101]/96 px-3 py-5 backdrop-blur-sm sm:px-5 sm:py-8"
          onClick={closeLetter}
        >
          {/* Cinematic modal atmosphere */}

          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.065),transparent_42%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(0,0,0,.1),rgba(0,0,0,.9))]" />

            <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(rgba(255,255,255,.6)_0.45px,transparent_0.45px)] [background-size:5px_5px]" />
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={closeLetter}
            aria-label="Close letter"
            className="fixed right-4 top-4 z-[120] flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-black/70 text-white/45 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white hover:text-black active:scale-90 sm:right-7 sm:top-7"
          >
            <X
              size={16}
              strokeWidth={1.2}
            />
          </button>

          {/* Archive info */}

          <div className="fixed left-4 top-5 z-[120] sm:left-7 sm:top-7">
            <p className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/25">
              LOVE ARCHIVE
            </p>

            <p className="mt-1 font-mono text-[6px] tracking-[0.3em] text-white/12">
              LETTER 0{opened.id} / 0
              {letters.length}
            </p>
          </div>

          {/* Letter */}

          <article
            onClick={(event) =>
              event.stopPropagation()
            }
            className="paper-reveal relative mx-auto my-16 max-w-3xl overflow-hidden rounded-[2px] bg-[#eee7d9] text-[#171512] shadow-[0_40px_150px_rgba(0,0,0,.9)] sm:my-24 sm:rounded-[3px]"
          >
            {/* Paper edges */}

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

            {/* Paper grain */}

            <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:radial-gradient(#000_0.5px,transparent_0.5px)] [background-size:6px_6px]" />

            {/* Paper lighting */}

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.8),transparent_42%)]" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,.025),transparent_30%,rgba(255,255,255,.18)_55%,transparent_80%)]" />

            <div className="relative px-6 py-14 sm:px-12 sm:py-20 md:px-20 md:py-24">
              {/* Letter header */}

              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Heart
                      size={9}
                      fill="currentColor"
                      className="text-black/30"
                    />

                    <p className="font-mono text-[6px] uppercase tracking-[0.55em] text-black/35">
                      PRIVATE CORRESPONDENCE
                    </p>
                  </div>

                  <p className="mt-3 font-mono text-[5px] uppercase tracking-[0.4em] text-black/20">
                    MEMORY UNIVERSE // LETTER 0
                    {opened.id}
                  </p>
                </div>

                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                  <span className="absolute inset-0 rotate-45 border border-black/[0.12]" />

                  <Feather
                    size={16}
                    strokeWidth={1}
                    className="relative rotate-[-15deg] text-black/30"
                  />
                </div>
              </div>

              <div className="mt-14 flex items-center gap-3">
                <span className="h-px w-10 bg-black/15" />

                <span className="font-mono text-[6px] uppercase tracking-[0.4em] text-black/25">
                  Written from the heart
                </span>
              </div>

              <h2 className="mt-9 max-w-2xl font-serif text-[3rem] leading-[0.9] tracking-[-0.045em] sm:text-6xl md:text-7xl">
                {opened.title}
              </h2>

              <p className="mt-6 max-w-xl font-serif text-base italic leading-[1.8] text-black/45 sm:text-lg">
                {opened.subtitle}
              </p>

              {/* Divider */}

              <div className="my-14 flex items-center gap-5 sm:my-16">
                <span className="h-px flex-1 bg-black/12" />

                <div className="relative flex h-8 w-8 items-center justify-center">
                  <span className="absolute inset-0 rotate-45 border border-black/12" />

                  <Heart
                    size={9}
                    fill="currentColor"
                    className="relative text-black/30"
                  />
                </div>

                <span className="h-px flex-1 bg-black/12" />
              </div>

              {/* Letter text */}

              <div className="whitespace-pre-line font-serif text-[17px] leading-[2.05] tracking-[0.006em] text-black/65 sm:text-[19px] sm:leading-[2.15] md:text-xl">
                {opened.text}
              </div>

              {/* Closing divider */}

              <div className="mt-20 flex items-center gap-4">
                <span className="h-px w-12 bg-black/12" />

                <Sparkles
                  size={10}
                  strokeWidth={1}
                  className="text-black/25"
                />

                <span className="h-px flex-1 bg-black/12" />
              </div>

              {/* Signature */}

              <div className="mt-12">
                <p className="font-serif text-sm italic text-black/35">
                  With all the love that words can hold,
                </p>

                <p className="mt-5 font-serif text-2xl italic tracking-[-0.02em] text-black/60 sm:text-3xl">
                  {opened.signature}
                </p>
              </div>

              {/* Seal */}

              <div className="mt-16 flex justify-end">
                <div className="relative flex h-[72px] w-[72px] rotate-[-8deg] items-center justify-center rounded-full border border-black/15">
                  <span className="absolute inset-2 rounded-full border border-dashed border-black/15" />

                  <span className="absolute inset-[10px] rounded-full border border-black/[0.06]" />

                  <span className="font-serif text-2xl italic tracking-[-0.05em] text-black/30">
                    KD
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Mobile cinematic hint */}

          <div className="relative z-10 mb-8 flex justify-center md:hidden">
            <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/20">
              Swipe from edge or tap outside to close
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
          MOBILE HINT
      ========================================================= */}

      <div className="mt-14 flex items-center justify-center gap-3 md:hidden">
        <span className="h-px w-8 bg-white/[0.06]" />

        <span className="font-mono text-[5px] uppercase tracking-[0.5em] text-white/12">
          Tap a letter to open
        </span>

        <span className="h-px w-8 bg-white/[0.06]" />
      </div>
    </main>
  );
}