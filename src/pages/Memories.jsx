import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

export default function Memories() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  /*
   * ============================================================
   * PROTECTED NAVIGATION REFS
   * ============================================================
   */

  const selectedRef = useRef(null);
  const isClosingFromPopState = useRef(false);
  const hasProtectedHistoryState = useRef(false);
  const isRestoringHistory = useRef(false);

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
   * CREATE PROTECTED MAIN PAGE HISTORY STATE
   *
   * This creates one controlled state for the Memories page.
   * It prevents accidental Back navigation from immediately
   * leaving the current route.
   * ============================================================
   */

  useEffect(() => {
    const currentState = window.history.state || {};

    if (!currentState.__memoryUniverseMemoriesPage) {
      window.history.replaceState(
        {
          ...currentState,
          __memoryUniverseMemoriesPage: true,
          __memoryUniverseViewerOpen: false,
        },
        "",
        window.location.href
      );
    }

    hasProtectedHistoryState.current = true;

    return () => {
      hasProtectedHistoryState.current = false;
    };
  }, []);

  /*
   * ============================================================
   * LOCK BODY SCROLL WHILE VIEWER IS OPEN
   * ============================================================
   */

  useEffect(() => {
    if (!selected) return;

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
  }, [selected]);

  /*
   * ============================================================
   * OPEN MEMORY
   *
   * A history state is pushed only when opening the viewer.
   * This allows Back/swipe-back to close the viewer instead
   * of leaving the Memories page.
   * ============================================================
   */

  const openMemory = (memory) => {
    if (!memory) return;

    setSelected(memory);

    window.history.pushState(
      {
        ...(window.history.state || {}),
        __memoryUniverseMemoriesPage: true,
        __memoryUniverseViewerOpen: true,
        __memoryUniverseMemoryId: memory.id,
      },
      "",
      window.location.href
    );
  };

  /*
   * ============================================================
   * CLOSE MEMORY
   *
   * Normal close button should return to the protected page state
   * without creating duplicate history entries.
   * ============================================================
   */

  const closeMemory = () => {
    if (!selectedRef.current) return;

    const currentState = window.history.state || {};

    setSelected(null);

    if (
      currentState.__memoryUniverseViewerOpen &&
      !isClosingFromPopState.current
    ) {
      isRestoringHistory.current = true;
      window.history.back();

      window.setTimeout(() => {
        isRestoringHistory.current = false;
      }, 100);
    }

    isClosingFromPopState.current = false;
  };

  /*
   * ============================================================
   * BACK / SWIPE-BACK / BROWSER HISTORY PROTECTION
   *
   * Priority:
   *
   * 1. If a memory viewer is open:
   *    Back closes it.
   *
   * 2. If the viewer is already closed:
   *    Back is consumed and the user stays on Memories.
   *
   * Works with:
   * - Browser Back
   * - Android Back gesture
   * - Android hardware/system Back
   * - iPhone browser swipe-back
   * - Browser history navigation
   * ============================================================
   */

  useEffect(() => {
    const handlePopState = (event) => {
      const currentViewer = selectedRef.current;

      /*
       * ========================================================
       * VIEWER IS OPEN
       *
       * Browser Back/swipe-back closes the viewer only.
       * User stays on Memories.
       * ========================================================
       */

      if (currentViewer) {
        isClosingFromPopState.current = true;

        setSelected(null);

        return;
      }

      /*
       * ========================================================
       * MAIN PAGE PROTECTION
       *
       * No viewer is open.
       * Restore the protected Memories page history state.
       * ========================================================
       */

      if (isRestoringHistory.current) {
        return;
      }

      const state = event.state || {};

      /*
       * If navigation reached a state outside this protected page,
       * immediately restore the Memories page state.
       */

      if (!state.__memoryUniverseMemoriesPage) {
        window.history.pushState(
          {
            ...(window.history.state || {}),
            __memoryUniverseMemoriesPage: true,
            __memoryUniverseViewerOpen: false,
          },
          "",
          window.location.href
        );

        return;
      }

      /*
       * If we returned to the protected Memories state,
       * ensure the viewer remains closed.
       */

      if (!state.__memoryUniverseViewerOpen) {
        setSelected(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
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
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * ============================================================
   * TOUCH / MOBILE EDGE SWIPE PROTECTION
   *
   * Prevents accidental horizontal browser navigation gestures
   * from interfering while the memory viewer is active.
   * The actual browser Back action is still handled by popstate.
   * ============================================================
   */

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event) => {
      if (!selectedRef.current) return;

      const touch = event.touches[0];

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (event) => {
      if (!selectedRef.current) return;

      const touch = event.changedTouches[0];

      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      /*
       * Right swipe from the left side of the screen.
       * Acts as an additional mobile close interaction.
       */

      const startedNearLeftEdge = touchStartX <= 45;
      const isHorizontalSwipe =
        Math.abs(deltaX) > Math.abs(deltaY);

      if (
        startedNearLeftEdge &&
        isHorizontalSwipe &&
        deltaX > 90
      ) {
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
        {/* Main atmosphere */}

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

        {/* Warm glow */}

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

        {/* Violet glow */}

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

        {/* Subtle star field */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.18]
            [background-image:radial-gradient(circle,rgba(255,255,255,.45)_0.5px,transparent_0.7px)]
            [background-size:80px_80px]
          "
        />

        {/* Fine grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)]
            [background-size:100px_100px]
          "
        />

        {/* Vignette */}

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
            <br className="sm:hidden" />
            {" "}Don't just look at it.
            <span className="text-white/60">
              {" "}Enter it.
            </span>
          </p>
        </div>

        {/* Archive status */}

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
        {/* Orbital rings */}

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
                  {/* Image */}

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

                    {/* Cinematic image tint */}

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

                    {/* Image shine */}

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

                    {/* Top metadata */}

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

                    {/* Center focus */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        flex
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className="
                          absolute
                          h-20
                          w-20
                          rounded-full
                          border
                          border-white/0
                          transition-all
                          duration-700
                          group-hover:h-28
                          group-hover:w-28
                          group-hover:border-white/20
                        "
                      />

                      <span
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/0
                          bg-white/0
                          text-white/0
                          backdrop-blur-md
                          transition-all
                          duration-500
                          group-hover:border-white/20
                          group-hover:bg-black/30
                          group-hover:text-white
                        "
                      >
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1}
                        />
                      </span>
                    </div>

                    {/* Bottom content */}

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

                  {/* Card footer */}

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
            sm:p-6
          "
          onClick={closeMemory}
        >
          {/* Background glow */}

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

          {/* Close */}

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

          {/* Viewer */}

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
            {/* Image */}

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

            {/* Information */}

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
              <div
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-1/2
                  h-80
                  w-40
                  -translate-y-1/2
                  rounded-full
                  bg-white/[0.025]
                  blur-[100px]
                "
              />

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

                {/* Mobile swipe hint */}

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

      {/* =========================================================
          ANIMATIONS
      ========================================================= */}

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