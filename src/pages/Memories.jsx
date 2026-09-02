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
   * Prevents duplicate viewer history entries.
   */
  const viewerHistoryActiveRef = useRef(false);

  /*
   * Used when the viewer is being closed through popstate.
   */
  const closingFromHistoryRef = useRef(false);

  /*
   * Used when we intentionally call history.back().
   */
  const programmaticBackRef = useRef(false);

  /*
   * Prevents duplicate page restoration.
   */
  const restoringPageRef = useRef(false);

  /*
   * Prevents multiple rapid open actions.
   */
  const openingRef = useRef(false);

  /*
   * Used to keep the route protection active.
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
   *
   * The current Memories route always has a stable protected
   * history state.
   * ============================================================
   */

  useEffect(() => {
    mountedRef.current = true;

    const currentState = window.history.state || {};

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

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscroll =
      document.body.style.overscrollBehavior;

    const previousHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior =
        previousBodyOverscroll;

      document.documentElement.style.overscrollBehavior =
        previousHtmlOverscroll;
    };
  }, [selected]);

  /*
   * ============================================================
   * OPEN MEMORY
   *
   * Only one viewer history state is allowed.
   * ============================================================
   */

  const openMemory = (memory) => {
    if (!memory) return;

    /*
     * If another memory is already open, simply replace the
     * visible content without creating another history entry.
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
     * Prevent accidental rapid double-click history pushes.
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
   *
   * Priority:
   *
   * 1. Close UI immediately.
   * 2. If viewer history exists, return to the page state.
   * 3. Do not push duplicate history states.
   * ============================================================
   */

  const closeMemory = () => {
    if (!selectedRef.current) return;

    setSelected(null);

    /*
     * If popstate already closed the viewer, do not call back again.
     */

    if (closingFromHistoryRef.current) {
      closingFromHistoryRef.current = false;
      viewerHistoryActiveRef.current = false;

      return;
    }

    const currentState = window.history.state || {};

    /*
     * Only go back if we are currently on our viewer state.
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
   * Priority:
   *
   * 1. Viewer open:
   *    Browser Back / swipe-back closes viewer.
   *
   * 2. Main page:
   *    Back navigation is consumed.
   *
   * This protects the current Memories route.
   * ============================================================
   */

  useEffect(() => {
    const handlePopState = (event) => {
      if (!mountedRef.current) return;

      const nextState = event.state || {};
      const currentViewer = selectedRef.current;

      /*
       * ========================================================
       * CASE 1 — VIEWER IS OPEN
       *
       * Any Back action closes the viewer first.
       * ========================================================
       */

      if (currentViewer) {
        closingFromHistoryRef.current = true;

        setSelected(null);

        viewerHistoryActiveRef.current = false;

        /*
         * We are now expected to be on the page history state.
         */

        return;
      }

      /*
       * ========================================================
       * CASE 2 — PROGRAMMATIC CLOSE
       *
       * The close button called history.back().
       * The resulting page state is correct, so do nothing.
       * ========================================================
       */

      if (programmaticBackRef.current) {
        viewerHistoryActiveRef.current = false;

        return;
      }

      /*
       * ========================================================
       * CASE 3 — RETURNED TO OUR PROTECTED PAGE
       *
       * Ensure the viewer stays closed.
       * ========================================================
       */

      if (
        nextState[HISTORY_KEY] &&
        nextState.type === PAGE_STATE &&
        !nextState.viewerOpen
      ) {
        setSelected(null);

        viewerHistoryActiveRef.current = false;

        return;
      }

      /*
       * ========================================================
       * CASE 4 — USER TRIED TO LEAVE MEMORIES
       *
       * Consume the navigation and restore the protected page.
       *
       * We push only one replacement state and avoid loops.
       * ========================================================
       */

      if (restoringPageRef.current) return;

      restoringPageRef.current = true;

      setSelected(null);

      window.history.pushState(
        getPageState(),
        "",
        window.location.href
      );

      viewerHistoryActiveRef.current = false;

      window.setTimeout(() => {
        restoringPageRef.current = false;
      }, 150);
    };

    window.addEventListener("popstate", handlePopState);

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
      if (event.key === "Escape" && selectedRef.current) {
        closeMemory();
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
   *
   * This is only an additional close interaction.
   * Browser history gestures are still handled through popstate.
   * ============================================================
   */

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event) => {
      if (!selectedRef.current) return;

      const touch = event.touches?.[0];

      if (!touch) return;

      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (event) => {
      if (!selectedRef.current) return;

      const touch = event.changedTouches?.[0];

      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      const startedNearLeftEdge = startX <= 45;

      const horizontal =
        Math.abs(deltaX) > Math.abs(deltaY);

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
    <main className="relative min-h-screen overflow-hidden px-5 pb-40 pt-28 md:px-12 md:pt-32">
      {/* =========================================================
          CINEMATIC BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden bg-[#020202]">
        <div
          className="
            absolute
            left-1/2
            top-[25%]
            h-[700px]
            w-[700px]
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
            h-[500px]
            w-[500px]
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
            h-[500px]
            w-[500px]
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

      <header className="relative mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />

          <p
            className="
              font-mono
              text-[7px]
              uppercase
              tracking-[0.6em]
              text-white/30
            "
          >
            MEMORY MUSEUM / 01
          </p>

          <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <div className="relative mt-7">
          <h1
            className="
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

        <div className="mt-9 flex items-center gap-4">
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

        <div className="mt-10 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 shadow-[0_0_15px_rgba(255,255,255,.8)]" />

            <span
              className="
                font-mono
                text-[6px]
                uppercase
                tracking-[0.4em]
                text-white/20
              "
            >
              ARCHIVE ONLINE
            </span>
          </div>

          <span className="h-px w-8 bg-white/[0.06]" />

          <span
            className="
              font-mono
              text-[6px]
              tracking-[0.3em]
              text-white/15
            "
          >
            {String(memories.length).padStart(2, "0")} FRAGMENTS
          </span>
        </div>
      </header>

      {/* =========================================================
          MEMORY CONSTELLATION
      ========================================================= */}

      <section className="relative mx-auto mt-20 max-w-6xl md:mt-28">
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

        <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-28">
          {memories.map((memory, index) => {
            const isHovered = hovered === index;

            return (
              <button
                key={memory.id}
                type="button"
                onClick={() => openMemory(memory)}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                className={`
                  group
                  relative
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
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="
                        h-full
                        w-full
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
                        left-6
                        right-6
                        top-6
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div
                        className="
                          flex
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
                          className="text-white/40"
                        />

                        <span
                          className="
                            font-mono
                            text-[7px]
                            tracking-[0.25em]
                            text-white/50
                          "
                        >
                          {memory.date}
                        </span>
                      </div>

                      <span
                        className="
                          font-mono
                          text-[7px]
                          tracking-[0.3em]
                          text-white/30
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <div className="flex items-end justify-between gap-5">
                        <div>
                          <p
                            className="
                              font-mono
                              text-[7px]
                              uppercase
                              tracking-[0.4em]
                              text-white/30
                              transition-colors
                              group-hover:text-white/60
                            "
                          >
                            {memory.category || "MEMORY"}
                          </p>

                          <h2
                            className="
                              mt-3
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

      <div className="mx-auto mt-28 flex max-w-6xl items-center gap-4">
        <span className="h-px flex-1 bg-white/[0.05]" />

        <div className="flex items-center gap-3">
          <Sparkles
            size={10}
            strokeWidth={1}
            className="text-white/20"
          />

          <span
            className="
              font-mono
              text-[6px]
              uppercase
              tracking-[0.5em]
              text-white/15
            "
          >
            Every memory leaves a trace
          </span>
        </div>

        <span className="h-px flex-1 bg-white/[0.05]" />
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
            overflow-y-auto
            bg-[#010101]/95
            p-4
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
              h-[700px]
              w-[700px]
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
              right-5
              top-5
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
            <X size={16} strokeWidth={1} />
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            className="
              relative
              mx-auto
              my-12
              grid
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
            <div className="relative min-h-[55vh] overflow-hidden md:min-h-[75vh]">
              <img
                src={selected.image}
                alt={selected.title}
                draggable="false"
                className="
                  h-full
                  w-full
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
                    tracking-[0.4em]
                    text-white/40
                    backdrop-blur-md
                  "
                >
                  MEMORY {String(selected.id).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div
              className="
                relative
                flex
                flex-col
                justify-center
                p-8
                sm:p-12
                md:p-14
                lg:p-20
              "
            >
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-white/20" />

                  <p
                    className="
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.45em]
                      text-white/30
                    "
                  >
                    {selected.date}
                  </p>
                </div>

                <h2
                  className="
                    mt-7
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

                <div className="my-10 flex items-center gap-4">
                  <span className="h-px flex-1 bg-white/[0.08]" />

                  <Sparkles
                    size={11}
                    strokeWidth={1}
                    className="text-white/25"
                  />

                  <span className="h-px flex-1 bg-white/[0.08]" />
                </div>

                <p
                  className="
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="
                          font-mono
                          text-[6px]
                          uppercase
                          tracking-[0.4em]
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
                        {String(selected.id).padStart(2, "0")}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-10
                        w-10
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

                <div className="mt-10 flex items-center gap-3 md:hidden">
                  <span className="h-px flex-1 bg-white/[0.08]" />

                  <span
                    className="
                      font-mono
                      text-[5px]
                      uppercase
                      tracking-[0.35em]
                      text-white/20
                    "
                  >
                    Swipe back to close
                  </span>

                  <span className="h-px flex-1 bg-white/[0.08]" />
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