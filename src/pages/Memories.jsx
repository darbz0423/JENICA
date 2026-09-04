import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

const HISTORY_KEY = "__memoryUniverseMemories";
const PAGE_STATE = "page";
const VIEWER_STATE = "viewer";

export default function Memories() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  /*
   * ============================================================
   * REFS
   * ============================================================
   */

  const selectedRef = useRef(null);

  /*
   * Prevent duplicate viewer history entries.
   */
  const viewerHistoryActiveRef = useRef(false);

  /*
   * Used when the viewer is closed through browser history.
   */
  const closingFromHistoryRef = useRef(false);

  /*
   * Used when we intentionally call history.back().
   */
  const programmaticBackRef = useRef(false);

  /*
   * Prevent duplicate protected-page restoration.
   */
  const restoringPageRef = useRef(false);

  /*
   * Prevent rapid duplicate opens.
   */
  const openingRef = useRef(false);

  /*
   * Keeps navigation protection active only while mounted.
   */
  const mountedRef = useRef(false);

  const memories = birthdayData.memories || [];

  /*
   * ============================================================
   * KEEP SELECTED REF SYNCHRONIZED
   * ============================================================
   */

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  /*
   * ============================================================
   * MOBILE VIEWPORT OVERFLOW PROTECTION
   *
   * Large fixed background glows, transforms, blur effects,
   * images, and animations can create horizontal overflow on
   * real mobile browsers.
   *
   * This prevents the empty horizontal space / sideways page.
   * ============================================================
   */

  useEffect(() => {
    const previousHtmlOverflowX =
      document.documentElement.style.overflowX;

    const previousBodyOverflowX =
      document.body.style.overflowX;

    const previousHtmlWidth =
      document.documentElement.style.width;

    const previousBodyWidth =
      document.body.style.width;

    document.documentElement.style.overflowX =
      "hidden";

    document.body.style.overflowX =
      "hidden";

    document.documentElement.style.width =
      "100%";

    document.body.style.width =
      "100%";

    return () => {
      document.documentElement.style.overflowX =
        previousHtmlOverflowX;

      document.body.style.overflowX =
        previousBodyOverflowX;

      document.documentElement.style.width =
        previousHtmlWidth;

      document.body.style.width =
        previousBodyWidth;
    };
  }, []);

  /*
   * ============================================================
   * HISTORY HELPERS
   * ============================================================
   */

  const getPageState = () => ({
    ...(window.history.state || {}),
    [HISTORY_KEY]: true,
    type: PAGE_STATE,
    viewerOpen: false,
  });

  const getViewerState = (memory) => ({
    ...(window.history.state || {}),
    [HISTORY_KEY]: true,
    type: VIEWER_STATE,
    viewerOpen: true,
    memoryId: memory?.id ?? null,
  });

  /*
   * ============================================================
   * CREATE / NORMALIZE PROTECTED PAGE STATE
   * ============================================================
   */

  useEffect(() => {
    mountedRef.current = true;

    const currentState =
      window.history.state || {};

    if (
      !currentState[HISTORY_KEY] ||
      currentState.type !== PAGE_STATE ||
      currentState.viewerOpen
    ) {
      window.history.replaceState(
        {
          ...currentState,
          [HISTORY_KEY]: true,
          type: PAGE_STATE,
          viewerOpen: false,
        },
        "",
        window.location.href
      );
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /*
   * ============================================================
   * BODY SCROLL LOCK
   * ============================================================
   */

  useEffect(() => {
    if (!selected) return;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousBodyOverscroll =
      document.body.style.overscrollBehavior;

    const previousHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;

    document.body.style.overflow =
      "hidden";

    document.body.style.overscrollBehavior =
      "none";

    document.documentElement.style.overscrollBehavior =
      "none";

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.body.style.overscrollBehavior =
        previousBodyOverscroll;

      document.documentElement.style.overscrollBehavior =
        previousHtmlOverscroll;
    };
  }, [selected]);

  /*
   * ============================================================
   * OPEN MEMORY
   * ============================================================
   */

  const openMemory = (memory) => {
    if (!memory) return;

    /*
     * If another memory is already open,
     * replace the visible content without
     * adding another history entry.
     */

    if (selectedRef.current) {
      setSelected(memory);

      window.history.replaceState(
        getViewerState(memory),
        "",
        window.location.href
      );

      return;
    }

    /*
     * Prevent rapid double-click history pushes.
     */

    if (openingRef.current) return;

    openingRef.current = true;

    setSelected(memory);

    /*
     * Push exactly one viewer state.
     */

    window.history.pushState(
      getViewerState(memory),
      "",
      window.location.href
    );

    viewerHistoryActiveRef.current = true;

    window.setTimeout(() => {
      openingRef.current = false;
    }, 50);
  };

  /*
   * ============================================================
   * CLOSE MEMORY
   * ============================================================
   */

  const closeMemory = () => {
    if (!selectedRef.current) return;

    setSelected(null);
    selectedRef.current = null;

    /*
     * Already closing from popstate.
     */

    if (closingFromHistoryRef.current) {
      closingFromHistoryRef.current = false;
      viewerHistoryActiveRef.current = false;

      return;
    }

    const currentState =
      window.history.state || {};

    /*
     * If currently on the viewer history state,
     * return to the page state.
     */

    if (
      currentState[HISTORY_KEY] &&
      currentState.type === VIEWER_STATE &&
      currentState.viewerOpen &&
      viewerHistoryActiveRef.current
    ) {
      programmaticBackRef.current = true;

      window.history.back();

      window.setTimeout(() => {
        programmaticBackRef.current = false;
      }, 150);
    }

    viewerHistoryActiveRef.current = false;
  };

  /*
   * ============================================================
   * POPSTATE PROTECTION
   *
   * PRIORITY:
   *
   * 1. Viewer open → close viewer.
   * 2. Protected Memories page → stay on page.
   * ============================================================
   */

  useEffect(() => {
    const handlePopState = (event) => {
      if (!mountedRef.current) return;

      const nextState =
        event.state || {};

      const currentViewer =
        selectedRef.current;

      /*
       * ========================================================
       * CASE 1 — VIEWER OPEN
       *
       * Back / swipe-back closes viewer first.
       * ========================================================
       */

      if (currentViewer) {
        closingFromHistoryRef.current =
          true;

        setSelected(null);

        selectedRef.current = null;

        viewerHistoryActiveRef.current =
          false;

        return;
      }

      /*
       * ========================================================
       * CASE 2 — PROGRAMMATIC CLOSE
       *
       * The close button already called history.back().
       * ========================================================
       */

      if (programmaticBackRef.current) {
        viewerHistoryActiveRef.current =
          false;

        return;
      }

      /*
       * ========================================================
       * CASE 3 — RETURNED TO OUR PAGE STATE
       * ========================================================
       */

      if (
        nextState[HISTORY_KEY] &&
        nextState.type === PAGE_STATE &&
        !nextState.viewerOpen
      ) {
        setSelected(null);

        selectedRef.current = null;

        viewerHistoryActiveRef.current =
          false;

        return;
      }

      /*
       * ========================================================
       * CASE 4 — USER TRIED TO LEAVE MEMORIES
       *
       * Restore protected page.
       * ========================================================
       */

      if (restoringPageRef.current) return;

      restoringPageRef.current =
        true;

      setSelected(null);

      selectedRef.current = null;

      window.history.pushState(
        getPageState(),
        "",
        window.location.href
      );

      viewerHistoryActiveRef.current =
        false;

      window.setTimeout(() => {
        restoringPageRef.current =
          false;
      }, 150);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  /*
   * ============================================================
   * KEYBOARD SUPPORT
   * ============================================================
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        selectedRef.current
      ) {
        closeMemory();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

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
   *
   * Only closes the opened viewer.
   * ============================================================
   */

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event) => {
      if (!selectedRef.current) return;

      const touch =
        event.touches?.[0];

      if (!touch) return;

      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (event) => {
      if (!selectedRef.current) return;

      const touch =
        event.changedTouches?.[0];

      if (!touch) return;

      const deltaX =
        touch.clientX - startX;

      const deltaY =
        touch.clientY - startY;

      const startedNearLeftEdge =
        startX <= 45;

      const horizontal =
        Math.abs(deltaX) >
        Math.abs(deltaY);

      const validSwipe =
        startedNearLeftEdge &&
        horizontal &&
        deltaX > 100;

      if (validSwipe) {
        closeMemory();
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
    <main
      className="
        relative
        min-h-[100svh]
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        overflow-y-hidden
        px-5
        pb-40
        pt-28
        md:px-12
        md:pt-32
      "
    >
      {/* =========================================================
          CINEMATIC BACKGROUND
      ========================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-30
          w-screen
          max-w-[100vw]
          overflow-hidden
          bg-[#020202]
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-[25%]
            h-[min(700px,120vw)]
            w-[min(700px,120vw)]
            -translate-x-1/2
            rounded-full
            bg-white/[0.025]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            -left-60
            top-[40%]
            h-[min(500px,100vw)]
            w-[min(500px,100vw)]
            rounded-full
            bg-amber-300/[0.025]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -right-60
            top-[15%]
            h-[min(500px,100vw)]
            w-[min(500px,100vw)]
            rounded-full
            bg-violet-400/[0.025]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.18]
            [background-image:radial-gradient(circle,rgba(255,255,255,.45)_0.5px,transparent_0.7px)]
            [background-size:80px_80px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)]
            [background-size:100px_100px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.9)_100%)]
          "
        />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative mx-auto w-full min-w-0 max-w-6xl">
        <div className="flex min-w-0 items-center gap-4">
          <span className="h-px w-8 shrink-0 bg-gradient-to-r from-transparent to-white/20 sm:w-12" />

          <p
            className="
              min-w-0
              font-mono
              text-[7px]
              uppercase
              tracking-[0.45em]
              text-white/30
              sm:tracking-[0.6em]
            "
          >
            MEMORY MUSEUM / 01
          </p>

          <span className="h-px w-8 shrink-0 bg-gradient-to-l from-transparent to-white/20 sm:w-12" />
        </div>

        <div className="relative mt-7 min-w-0">
          <h1
            className="
              min-w-0
              break-words
              font-display
              text-6xl
              font-light
              leading-[.82]
              tracking-[-0.055em]
              sm:text-8xl
              md:text-[9.5rem]
            "
          >
            Memories
            <br />

            <span className="text-white/[0.22]">
              are places.
            </span>
          </h1>

          <div
            className="
              absolute
              right-[5%]
              top-1/2
              hidden
              h-28
              w-28
              -translate-y-1/2
              rounded-full
              border
              border-white/[0.06]
              md:block
            "
          >
            <div
              className="
                absolute
                inset-4
                rounded-full
                border
                border-dashed
                border-white/[0.07]
                animate-[spin_25s_linear_infinite]
              "
            />

            <Sparkles
              size={14}
              strokeWidth={1}
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                text-white/30
              "
            />
          </div>
        </div>

        <div className="mt-9 flex min-w-0 items-center gap-4">
          <p
            className="
              max-w-xl
              font-serif
              text-lg
              leading-[1.8]
              text-white/35
              sm:text-xl
            "
          >
            Click one.
            <br className="sm:hidden" /> Don't just look at it.

            <span className="text-white/60">
              {" "}Enter it.
            </span>
          </p>
        </div>

        <div className="mt-10 flex min-w-0 items-center gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 shadow-[0_0_15px_rgba(255,255,255,.8)]" />

            <span
              className="
                font-mono
                text-[6px]
                uppercase
                tracking-[0.35em]
                text-white/20
                sm:tracking-[0.4em]
              "
            >
              ARCHIVE ONLINE
            </span>
          </div>

          <span className="h-px w-8 shrink-0 bg-white/[0.06]" />

          <span
            className="
              min-w-0
              font-mono
              text-[6px]
              tracking-[0.25em]
              text-white/15
              sm:tracking-[0.3em]
            "
          >
            {String(memories.length).padStart(
              2,
              "0"
            )}{" "}
            FRAGMENTS
          </span>
        </div>
      </header>

      {/* =========================================================
          MEMORY CONSTELLATION
      ========================================================= */}

      <section className="relative mx-auto mt-20 w-full min-w-0 max-w-6xl md:mt-28">
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[35%]
            hidden
            h-[850px]
            w-[850px]
            -translate-x-1/2
            rounded-full
            border
            border-white/[0.018]
            md:block
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[35%]
            hidden
            h-[600px]
            w-[600px]
            -translate-x-1/2
            rounded-full
            border
            border-dashed
            border-white/[0.018]
            md:block
            animate-[spin_60s_linear_infinite]
          "
        />

        <div className="grid w-full min-w-0 max-w-full gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-28">
          {memories.map((memory, index) => {
            const isHovered =
              hovered === index;

            return (
              <button
                key={memory.id}
                type="button"
                onClick={() =>
                  openMemory(memory)
                }
                onMouseEnter={() =>
                  setHovered(index)
                }
                onMouseLeave={() =>
                  setHovered(null)
                }
                onFocus={() =>
                  setHovered(index)
                }
                onBlur={() =>
                  setHovered(null)
                }
                className={`
                  group
                  relative
                  w-full
                  min-w-0
                  max-w-full
                  text-left
                  ${
                    index % 2 === 1
                      ? "md:translate-y-24"
                      : ""
                  }
                `}
              >
                <div
                  className={`
                    relative
                    w-full
                    min-w-0
                    max-w-full
                    overflow-hidden
                    rounded-[3px]
                    border
                    border-white/[0.08]
                    bg-[#080808]
                    shadow-[0_30px_100px_rgba(0,0,0,.45)]
                    transition-all
                    duration-700
                    ${
                      isHovered
                        ? "md:-translate-y-3 md:border-white/[0.18] md:shadow-[0_40px_120px_rgba(0,0,0,.7)]"
                        : ""
                    }
                  `}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="
                        block
                        h-full
                        w-full
                        max-w-full
                        scale-[1.01]
                        object-cover
                        grayscale-[25%]
                        transition-all
                        duration-[1800ms]
                        ease-out
                        group-hover:scale-110
                        group-hover:grayscale-0
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-b
                        from-black/10
                        via-transparent
                        to-black/90
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -left-[80%]
                        top-0
                        h-full
                        w-[45%]
                        skew-x-[-20deg]
                        bg-gradient-to-r
                        from-transparent
                        via-white/[0.12]
                        to-transparent
                        transition-all
                        duration-[1400ms]
                        group-hover:left-[130%]
                      "
                    />

                    <div
                      className="
                        absolute
                        left-4
                        right-4
                        top-4
                        flex
                        min-w-0
                        items-center
                        justify-between
                        sm:left-6
                        sm:right-6
                        sm:top-6
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-white/10
                          bg-black/30
                          px-3
                          py-2
                          backdrop-blur-md
                        "
                      >
                        <CalendarDays
                          size={9}
                          strokeWidth={1}
                          className="shrink-0 text-white/40"
                        />

                        <span
                          className="
                            truncate
                            font-mono
                            text-[7px]
                            tracking-[0.2em]
                            text-white/50
                            sm:tracking-[0.25em]
                          "
                        >
                          {memory.date}
                        </span>
                      </div>

                      <span
                        className="
                          ml-3
                          shrink-0
                          font-mono
                          text-[7px]
                          tracking-[0.3em]
                          text-white/30
                        "
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 min-w-0 p-6 sm:p-7">
                      <div className="flex min-w-0 items-end justify-between gap-4 sm:gap-5">
                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              font-mono
                              text-[7px]
                              uppercase
                              tracking-[0.35em]
                              text-white/30
                              transition-colors
                              group-hover:text-white/60
                              sm:tracking-[0.4em]
                            "
                          >
                            {memory.category ||
                              "MEMORY"}
                          </p>

                          <h2
                            className="
                              mt-3
                              break-words
                              font-display
                              text-3xl
                              font-light
                              leading-none
                              text-white/90
                              transition-all
                              duration-500
                              group-hover:text-white
                              sm:text-4xl
                            "
                          >
                            {memory.title}
                          </h2>
                        </div>

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-black/20
                            backdrop-blur-md
                            transition-all
                            duration-500
                            group-hover:border-white/40
                            group-hover:bg-white
                            group-hover:text-black
                          "
                        >
                          <ArrowUpRight
                            size={15}
                            strokeWidth={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      justify-between
                      border-t
                      border-white/[0.06]
                      px-6
                      py-4
                    "
                  >
                    <span
                      className="
                        font-mono
                        text-[6px]
                        uppercase
                        tracking-[0.35em]
                        text-white/15
                      "
                    >
                      ENTER MEMORY
                    </span>

                    <ChevronRight
                      size={11}
                      strokeWidth={1}
                      className="
                        shrink-0
                        text-white/15
                        transition-all
                        duration-500
                        group-hover:translate-x-1
                        group-hover:text-white/60
                      "
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          END MARKER
      ========================================================= */}

      <div className="mx-auto mt-28 flex w-full min-w-0 max-w-6xl items-center gap-4">
        <span className="h-px min-w-0 flex-1 bg-white/[0.05]" />

        <div className="flex shrink-0 items-center gap-3">
          <Sparkles
            size={10}
            strokeWidth={1}
            className="text-white/20"
          />

          <span
            className="
              font-mono
              text-[5px]
              uppercase
              tracking-[0.35em]
              text-white/15
              sm:text-[6px]
              sm:tracking-[0.5em]
            "
          >
            Every memory leaves a trace
          </span>
        </div>

        <span className="h-px min-w-0 flex-1 bg-white/[0.05]" />
      </div>

      {/* =========================================================
          MEMORY VIEWER
      ========================================================= */}

      {selected && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            w-full
            max-w-[100vw]
            overflow-x-hidden
            overflow-y-auto
            bg-[#010101]/95
            p-3
            backdrop-blur-2xl
            overscroll-contain
            sm:p-6
          "
          onClick={closeMemory}
        >
          <div
            className="
              pointer-events-none
              fixed
              left-1/2
              top-1/2
              h-[min(700px,120vw)]
              w-[min(700px,120vw)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-white/[0.025]
              blur-[150px]
            "
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeMemory();
            }}
            aria-label="Close memory"
            className="
              fixed
              right-4
              top-4
              z-30
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/50
              text-white/40
              backdrop-blur-xl
              transition-all
              duration-300
              hover:rotate-90
              hover:border-white/30
              hover:bg-white
              hover:text-black
              active:scale-90
              sm:right-8
              sm:top-8
            "
          >
            <X
              size={16}
              strokeWidth={1}
            />
          </button>

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              relative
              mx-auto
              my-10
              grid
              w-full
              min-w-0
              max-w-6xl
              overflow-hidden
              rounded-[3px]
              border
              border-white/10
              bg-[#070707]
              shadow-[0_50px_180px_rgba(0,0,0,.8)]
              md:my-16
              md:grid-cols-[1.15fr_.85fr]
            "
          >
            <div className="relative min-h-[48svh] w-full min-w-0 overflow-hidden md:min-h-[75vh]">
              <img
                src={selected.image}
                alt={selected.title}
                draggable="false"
                className="
                  block
                  h-full
                  w-full
                  max-w-full
                  object-cover
                  transition-transform
                  duration-[2000ms]
                  hover:scale-[1.02]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/50
                  via-transparent
                  to-black/10
                "
              />

              <div className="absolute bottom-6 left-6">
                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-black/30
                    px-4
                    py-2
                    font-mono
                    text-[6px]
                    uppercase
                    tracking-[0.35em]
                    text-white/40
                    backdrop-blur-md
                    sm:tracking-[0.4em]
                  "
                >
                  MEMORY{" "}
                  {String(
                    selected.id
                  ).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div
              className="
                relative
                flex
                min-w-0
                flex-col
                justify-center
                p-7
                sm:p-12
                md:p-14
                lg:p-20
              "
            >
              <div className="relative min-w-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-px w-8 shrink-0 bg-white/20" />

                  <p
                    className="
                      truncate
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.4em]
                      text-white/30
                    "
                  >
                    {selected.date}
                  </p>
                </div>

                <h2
                  className="
                    mt-7
                    break-words
                    font-display
                    text-5xl
                    font-light
                    leading-[0.9]
                    tracking-[-0.04em]
                    text-white
                    sm:text-6xl
                  "
                >
                  {selected.title}
                </h2>

                <div className="my-10 flex min-w-0 items-center gap-4">
                  <span className="h-px min-w-0 flex-1 bg-white/[0.08]" />

                  <Sparkles
                    size={11}
                    strokeWidth={1}
                    className="shrink-0 text-white/25"
                  />

                  <span className="h-px min-w-0 flex-1 bg-white/[0.08]" />
                </div>

                <p
                  className="
                    break-words
                    font-serif
                    text-xl
                    leading-[1.9]
                    text-white/50
                    sm:text-2xl
                  "
                >
                  {selected.description}
                </p>

                <div className="mt-12 border-t border-white/[0.08] pt-6">
                  <div className="flex min-w-0 items-center justify-between gap-5">
                    <div className="min-w-0">
                      <p
                        className="
                          font-mono
                          text-[6px]
                          uppercase
                          tracking-[0.35em]
                          text-white/20
                        "
                      >
                        ARCHIVE ENTRY
                      </p>

                      <p
                        className="
                          mt-2
                          font-mono
                          text-[8px]
                          tracking-[0.2em]
                          text-white/35
                        "
                      >
                        MEMORY #
                        {String(
                          selected.id
                        ).padStart(2, "0")}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.08]
                        text-white/20
                      "
                    >
                      <Sparkles
                        size={13}
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex min-w-0 items-center gap-3 md:hidden">
                  <span className="h-px min-w-0 flex-1 bg-white/[0.08]" />

                  <span
                    className="
                      shrink-0
                      font-mono
                      text-[5px]
                      uppercase
                      tracking-[0.25em]
                      text-white/20
                    "
                  >
                    Swipe back to close
                  </span>

                  <span className="h-px min-w-0 flex-1 bg-white/[0.08]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        html,
        body {
          max-width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 640px) {
          img {
            max-width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}