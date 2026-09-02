import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  X,
  ScanLine,
  Camera,
  MoveHorizontal,
  Sparkles,
  CircleDot,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { birthdayData } from "../data/birthdayData";

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({
    x: 50,
    y: 35,
  });
  const [viewerDirection, setViewerDirection] = useState(0);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const selectedRef = useRef(null);
  const viewerHistoryActiveRef = useRef(false);
  const historyLockRef = useRef(false);
  const mountedRef = useRef(true);

  const touchStartRef = useRef({
    x: 0,
    y: 0,
    time: 0,
  });

  const touchLastRef = useRef({
    x: 0,
    y: 0,
  });

  const photos = birthdayData.gallery || [];

  /*
   * ============================================================
   * COMPONENT MOUNT
   * ============================================================
   */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

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
   * SELECTED INDEX
   * ============================================================
   */

  const selectedIndex = useMemo(() => {
    if (!selected) return -1;

    return photos.findIndex(
      (photo) => photo.id === selected.id
    );
  }, [selected, photos]);

  /*
   * ============================================================
   * PROTECTED GALLERY HISTORY
   *
   * This page becomes a protected main page.
   *
   * Back priority:
   *
   * 1. Viewer open -> close viewer
   * 2. Viewer closed -> remain on Gallery
   *
   * ============================================================
   */

  useEffect(() => {
    const currentState = window.history.state;

    if (!currentState?.galleryProtected) {
      window.history.replaceState(
        {
          ...(currentState || {}),
          galleryProtected: true,
          galleryBase: true,
        },
        "",
        window.location.href
      );
    }
  }, []);

  /*
   * ============================================================
   * OPEN PHOTO
   *
   * Push exactly ONE history state for the viewer.
   * Navigating between photos does NOT push more states.
   *
   * ============================================================
   */

  const openPhoto = useCallback((photo) => {
    if (!photo) return;

    setViewerDirection(0);
    setSwipeOffset(0);
    setIsViewerReady(false);

    setSelected(photo);

    requestAnimationFrame(() => {
      if (mountedRef.current) {
        setIsViewerReady(true);
      }
    });

    if (!viewerHistoryActiveRef.current) {
      viewerHistoryActiveRef.current = true;

      window.history.pushState(
        {
          ...(window.history.state || {}),
          galleryProtected: true,
          galleryViewer: true,
          photoId: photo.id,
        },
        "",
        window.location.href
      );
    }
  }, []);

  /*
   * ============================================================
   * CLOSE VIEWER
   *
   * Clicking close should remove the temporary viewer state.
   *
   * Browser Back / swipe-back is handled separately by popstate.
   *
   * ============================================================
   */

  const closePhoto = useCallback(() => {
    if (!selectedRef.current) return;

    setIsViewerReady(false);
    setSwipeOffset(0);
    setSelected(null);

    if (
      viewerHistoryActiveRef.current &&
      !historyLockRef.current
    ) {
      viewerHistoryActiveRef.current = false;
      historyLockRef.current = true;

      window.history.back();

      window.setTimeout(() => {
        historyLockRef.current = false;
      }, 100);
    }
  }, []);

  /*
   * ============================================================
   * CHANGE PHOTO
   *
   * Replaces the current viewer history state.
   * Does not create duplicate history entries.
   *
   * ============================================================
   */

  const goToPhoto = useCallback(
    (nextIndex, direction = 1) => {
      if (!photos.length) return;

      const normalizedIndex =
        ((nextIndex % photos.length) + photos.length) %
        photos.length;

      const nextPhoto = photos[normalizedIndex];

      if (!nextPhoto) return;

      setViewerDirection(direction);
      setSwipeOffset(0);
      setSelected(nextPhoto);

      if (viewerHistoryActiveRef.current) {
        window.history.replaceState(
          {
            ...(window.history.state || {}),
            galleryProtected: true,
            galleryViewer: true,
            photoId: nextPhoto.id,
          },
          "",
          window.location.href
        );
      }
    },
    [photos]
  );

  const nextPhoto = useCallback(
    (event) => {
      event?.stopPropagation();

      if (!photos.length || selectedIndex < 0) return;

      goToPhoto(selectedIndex + 1, 1);
    },
    [photos.length, selectedIndex, goToPhoto]
  );

  const previousPhoto = useCallback(
    (event) => {
      event?.stopPropagation();

      if (!photos.length || selectedIndex < 0) return;

      goToPhoto(selectedIndex - 1, -1);
    },
    [photos.length, selectedIndex, goToPhoto]
  );

  /*
   * ============================================================
   * PROTECTED BROWSER BACK / MOBILE SWIPE-BACK
   *
   * This is the important navigation logic.
   *
   * If photo viewer is open:
   *     Back -> close viewer -> remain Gallery
   *
   * If Gallery is already visible:
   *     Back -> consume navigation -> remain Gallery
   *
   * ============================================================
   */

  useEffect(() => {
    const handlePopState = () => {
      /*
       * PRIORITY 1:
       *
       * A photo viewer is open.
       *
       * Browser Back / Android Back /
       * iPhone swipe-back should ONLY close viewer.
       */

      if (selectedRef.current) {
        viewerHistoryActiveRef.current = false;

        setIsViewerReady(false);
        setSwipeOffset(0);
        setSelected(null);

        return;
      }

      /*
       * PRIORITY 2:
       *
       * Gallery itself is protected.
       *
       * Restore the current Gallery route/state.
       */

      if (historyLockRef.current) return;

      historyLockRef.current = true;

      window.history.pushState(
        {
          ...(window.history.state || {}),
          galleryProtected: true,
          galleryBase: true,
        },
        "",
        window.location.href
      );

      window.setTimeout(() => {
        historyLockRef.current = false;
      }, 80);
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
   * VIEWER KEYBOARD
   * ============================================================
   */

  useEffect(() => {
    if (!selected) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowLeft") {
        previousPhoto();
      }

      if (event.key === "ArrowRight") {
        nextPhoto();
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [
    selected,
    closePhoto,
    previousPhoto,
    nextPhoto,
  ]);

  /*
   * ============================================================
   * MOBILE PHOTO SWIPE
   *
   * Swipe LEFT  -> Next photo
   * Swipe RIGHT -> Previous photo
   *
   * ============================================================
   */

  const handleTouchStart = (event) => {
    if (!event.touches?.length) return;

    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    touchLastRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    setIsSwiping(true);
  };

  const handleTouchMove = (event) => {
    if (!isSwiping) return;

    const touch = event.touches?.[0];

    if (!touch) return;

    touchLastRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const deltaX =
      touch.clientX - touchStartRef.current.x;

    const deltaY =
      touch.clientY - touchStartRef.current.y;

    /*
     * Only use horizontal movement.
     */

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();

      setSwipeOffset(deltaX * 0.7);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;

    const deltaX =
      touchLastRef.current.x -
      touchStartRef.current.x;

    const elapsed =
      Date.now() -
      touchStartRef.current.time;

    const velocity =
      Math.abs(deltaX) / Math.max(elapsed, 1);

    const shouldChangePhoto =
      Math.abs(deltaX) > 70 ||
      velocity > 0.55;

    setIsSwiping(false);
    setSwipeOffset(0);

    if (!shouldChangePhoto) return;

    if (deltaX < 0) {
      nextPhoto();
    } else {
      previousPhoto();
    }
  };

  /*
   * ============================================================
   * DESKTOP CURSOR ATMOSPHERE
   * ============================================================
   */

  const handlePointerMove = (event) => {
    if (window.innerWidth < 1024) return;

    setCursor({
      x:
        (event.clientX /
          window.innerWidth) *
        100,

      y:
        (event.clientY /
          window.innerHeight) *
        100,
    });
  };

  /*
   * ============================================================
   * EDITORIAL PHOTO LAYOUTS
   * ============================================================
   */

  const layouts = [
    "lg:col-span-5 lg:col-start-1",
    "lg:col-span-4 lg:col-start-8 lg:mt-32",
    "lg:col-span-4 lg:col-start-3 lg:mt-16",
    "lg:col-span-5 lg:col-start-8",
    "lg:col-span-4 lg:col-start-1 lg:mt-28",
    "lg:col-span-5 lg:col-start-6 lg:mt-12",
  ];

  const rotations = [
    "-rotate-[1.2deg]",
    "rotate-[1deg]",
    "-rotate-[0.7deg]",
    "rotate-[1.4deg]",
    "-rotate-[1deg]",
    "rotate-[0.6deg]",
  ];

  const viewerProgress =
    selectedIndex >= 0 && photos.length
      ? ((selectedIndex + 1) /
          photos.length) *
        100
      : 0;

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020202]
        px-5
        pb-40
        pt-24
        text-white
        sm:px-8
        sm:pt-32
        lg:px-10
      "
      onPointerMove={handlePointerMove}
    >
      {/* ======================================================
          BACKGROUND UNIVERSE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#020202]" />

        {/* Desktop cursor glow */}

        <div
          className="
            absolute
            hidden
            h-[420px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-300/[0.035]
            blur-[120px]
            transition-[left,top]
            duration-[1000ms]
            ease-out
            lg:block
          "
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
          }}
        />

        {/* Main atmosphere */}

        <div
          className="
            absolute
            left-1/2
            top-[25%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            bg-violet-300/[0.018]
            blur-[140px]
            sm:h-[700px]
            sm:w-[700px]
          "
        />

        <div
          className="
            absolute
            -left-48
            top-[60%]
            hidden
            h-[500px]
            w-[500px]
            rounded-full
            bg-amber-100/[0.015]
            blur-[130px]
            sm:block
          "
        />

        <div
          className="
            absolute
            -right-48
            top-[15%]
            hidden
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-300/[0.014]
            blur-[130px]
            sm:block
          "
        />

        <div className="gallery-grid absolute inset-0 opacity-[0.018]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_18%,rgba(0,0,0,.78)_100%)]" />

        <div className="gallery-noise absolute inset-0 opacity-[0.018]" />

        <div className="absolute left-0 right-0 top-0 h-56 bg-gradient-to-b from-black via-black/40 to-transparent" />
      </div>

      {/* ======================================================
          TOP IDENTIFIER
      ====================================================== */}

      <header className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rotate-45 border border-white/[0.14]" />

              <span className="absolute h-3 w-3 rotate-45 border border-white/[0.08]" />

              <span className="relative h-1 w-1 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,.8)]" />
            </div>

            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.55em] text-white/35">
                VISUAL MEMORY ARCHIVE
              </p>

              <p className="mt-1 font-mono text-[5px] uppercase tracking-[0.4em] text-white/10">
                MEMORY UNIVERSE // 001
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/15">
              COLLECTION STATUS
            </p>

            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="h-1 w-1 animate-pulse rounded-full bg-violet-200/70 shadow-[0_0_12px_rgba(196,181,253,.8)]" />

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/30">
                PRESERVED
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            HERO
        ==================================================== */}

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-white/20" />

                <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/15">
                  ARCHIVE 001 / PERSONAL COLLECTION
                </p>
              </div>

              <h1
                className="
                  mt-6
                  max-w-5xl
                  font-display
                  text-[4.4rem]
                  leading-[0.76]
                  tracking-[-0.07em]
                  text-white
                  sm:text-[7rem]
                  md:text-[8rem]
                  lg:text-[9.5rem]
                "
              >
                Photo
                <span className="text-white/[0.08]">
                  graphs.
                </span>
              </h1>

              <div className="mt-8 max-w-xl">
                <p className="font-serif text-[17px] leading-[1.8] text-white/30 sm:text-xl">
                  Some moments disappear the second
                  they happen. Others stay somewhere
                  inside us.
                </p>

                <p className="mt-2 font-serif text-[17px] italic leading-[1.8] text-white/55 sm:text-xl">
                  These are the ones worth keeping.
                </p>
              </div>
            </div>

            <div className="flex items-end gap-8 sm:gap-12">
              <div>
                <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
                  FRAMES
                </p>

                <p className="mt-1 font-display text-4xl leading-none text-white/60 sm:text-5xl">
                  {String(photos.length).padStart(
                    2,
                    "0"
                  )}
                </p>
              </div>

              <div>
                <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
                  FORMAT
                </p>

                <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.3em] text-white/35">
                  ANALOG MEMORY
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 flex items-center gap-4 sm:mt-20">
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />

            <div className="flex items-center gap-3">
              <ScanLine
                size={9}
                strokeWidth={1}
                className="text-white/20"
              />

              <span className="font-mono text-[5px] uppercase tracking-[0.5em] text-white/15">
                MEMORY FIELD
              </span>
            </div>

            <span className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent" />
          </div>
        </div>
      </header>

      {/* ======================================================
          MEMORY FIELD
      ====================================================== */}

      <section className="relative mx-auto mt-20 max-w-7xl sm:mt-28 lg:mt-32">
        <div className="pointer-events-none absolute left-1/2 top-[40%] hidden h-[800px] w-[800px] -translate-x-1/2 rounded-full border border-white/[0.018] lg:block" />

        <div className="pointer-events-none absolute left-1/2 top-[40%] hidden h-[560px] w-[560px] -translate-x-1/2 rounded-full border border-dashed border-white/[0.012] lg:block" />

        <div
          className="
            grid
            grid-cols-1
            gap-16
            sm:grid-cols-2
            sm:gap-x-6
            sm:gap-y-20
            lg:grid-cols-12
            lg:gap-x-8
            lg:gap-y-32
          "
        >
          {photos.map((photo, index) => {
            const isHovered =
              hovered === index;

            return (
              <article
                key={photo.id}
                className={`
                  relative
                  ${layouts[
                    index % layouts.length
                  ]}
                `}
              >
                {/* Memory index */}

                <div
                  className={`
                    absolute
                    -top-8
                    left-0
                    z-30
                    flex
                    items-center
                    gap-2
                    transition-all
                    duration-500
                    ${
                      isHovered
                        ? "translate-x-2 opacity-100"
                        : "opacity-40"
                    }
                  `}
                >
                  <CircleDot
                    size={7}
                    strokeWidth={1}
                    className="text-white/20"
                  />

                  <span className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/20">
                    MEMORY
                  </span>

                  <span className="font-display text-lg leading-none text-white/20">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                {/* Photo */}

                <button
                  type="button"
                  onClick={() => openPhoto(photo)}
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
                    block
                    w-full
                    text-left
                    ${rotations[
                      index % rotations.length
                    ]}
                    ${
                      isHovered
                        ? "z-30 lg:scale-[1.025] lg:rotate-0"
                        : "z-10"
                    }
                    transition-transform
                    duration-700
                    ease-[cubic-bezier(.22,1,.36,1)]
                  `}
                >
                  {/* Glow */}

                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -inset-8
                      rounded-[40px]
                      bg-violet-200/[0.025]
                      blur-3xl
                      transition-opacity
                      duration-700
                      ${
                        isHovered
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />

                  {/* Polaroid */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[3px]
                      border
                      border-black/10
                      bg-[#e9e6df]
                      p-2
                      pb-20
                      shadow-[0_25px_70px_rgba(0,0,0,.65)]
                      transition-shadow
                      duration-700
                      sm:p-3
                      sm:pb-24
                      lg:group-hover:shadow-[0_35px_100px_rgba(0,0,0,.85)]
                    "
                  >
                    <div className="paper-noise pointer-events-none absolute inset-0 opacity-[0.045]" />

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/30 to-transparent opacity-30" />

                    {/* Image */}

                    <div className="relative aspect-[4/5] overflow-hidden bg-black">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        loading={
                          index < 2
                            ? "eager"
                            : "lazy"
                        }
                        decoding="async"
                        draggable="false"
                        className={`
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-[1400ms]
                          ease-[cubic-bezier(.22,1,.36,1)]
                          ${
                            isHovered
                              ? "lg:scale-[1.08]"
                              : "scale-100"
                          }
                        `}
                      />

                      {/* Image overlay */}

                      <div
                        className={`
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/75
                          via-transparent
                          to-black/25
                          transition-opacity
                          duration-700
                          ${
                            isHovered
                              ? "opacity-30"
                              : "opacity-60"
                          }
                        `}
                      />

                      {/* Film frame */}

                      <div
                        className={`
                          pointer-events-none
                          absolute
                          inset-3
                          border
                          transition-all
                          duration-700
                          ${
                            isHovered
                              ? "border-white/35"
                              : "border-white/0"
                          }
                        `}
                      />

                      {/* Scan */}

                      <span
                        className={`
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          h-px
                          w-full
                          bg-gradient-to-r
                          from-transparent
                          via-white/70
                          to-transparent
                          ${
                            isHovered
                              ? "animate-photoScan"
                              : "opacity-0"
                          }
                        `}
                      />

                      {/* Center focus */}

                      <div
                        className={`
                          pointer-events-none
                          absolute
                          left-1/2
                          top-1/2
                          -translate-x-1/2
                          -translate-y-1/2
                          transition-all
                          duration-500
                          ${
                            isHovered
                              ? "scale-100 opacity-100"
                              : "scale-75 opacity-0"
                          }
                        `}
                      >
                        <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-white/50" />

                        <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-white/50" />

                        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
                      </div>

                      {/* Frame number */}

                      <div className="absolute right-3 top-3">
                        <span className="font-mono text-[5px] tracking-[0.3em] text-white/35">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>

                      {/* Camera indicator */}

                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Camera
                          size={9}
                          strokeWidth={1}
                          className="text-white/30"
                        />

                        <span className="font-mono text-[5px] tracking-[0.25em] text-white/30">
                          ARCHIVE
                        </span>
                      </div>
                    </div>

                    {/* Polaroid information */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        flex
                        items-end
                        justify-between
                        px-4
                        pb-4
                        sm:px-5
                        sm:pb-5
                      "
                    >
                      <div>
                        <p className="font-serif text-sm text-black/75 sm:text-base">
                          {photo.title}
                        </p>

                        <p className="mt-1 font-mono text-[5px] uppercase tracking-[0.35em] text-black/30">
                          {photo.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-[5px] uppercase tracking-[0.25em] text-black/20">
                          FRAME
                        </p>

                        <p className="font-display text-xl leading-none text-black/20">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Frame corners */}

                    <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-black/10" />

                    <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-black/10" />

                    <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-black/10" />

                    <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-black/10" />
                  </div>

                  {/* Open memory */}

                  <div
                    className={`
                      absolute
                      -bottom-10
                      left-1/2
                      -translate-x-1/2
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ${
                        isHovered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-2 opacity-0"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2 font-mono text-[5px] uppercase tracking-[0.4em] text-white/40">
                      Open memory

                      <ArrowUpRight
                        size={9}
                        strokeWidth={1}
                      />
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ======================================================
          ARCHIVE END
      ====================================================== */}

      <footer className="relative mx-auto mt-36 max-w-7xl sm:mt-48">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-white/[0.06]" />

          <div className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08]">
              <span className="font-display text-[10px] tracking-[-0.05em] text-white/25">
                KD
              </span>
            </div>

            <p className="mt-4 font-mono text-[5px] uppercase tracking-[0.5em] text-white/15">
              END OF ARCHIVE
            </p>

            <p className="mt-2 font-serif text-sm italic text-white/20">
              Some memories deserve another look.
            </p>
          </div>

          <span className="h-px flex-1 bg-white/[0.06]" />
        </div>
      </footer>

      {/* ======================================================
          MOBILE HINT
      ====================================================== */}

      <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">
        <span className="h-px w-8 bg-white/[0.06]" />

        <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/10">
          Tap a photograph
        </span>

        <span className="h-px w-8 bg-white/[0.06]" />
      </div>

      {/* ======================================================
          CINEMATIC PHOTO VIEWER
      ====================================================== */}

      {selected && (
        <div
          className={`
            fixed
            inset-0
            z-[300]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-[#010101]
            p-3
            transition-opacity
            duration-500
            sm:p-8
            ${
              isViewerReady
                ? "opacity-100"
                : "opacity-0"
            }
          `}
          onClick={closePhoto}
        >
          {/* ==================================================
              VIEWER BACKGROUND
          ================================================== */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              src={selected.image}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                scale-110
                object-cover
                opacity-[0.045]
                blur-3xl
              "
            />

            <div className="absolute inset-0 bg-black/90" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,.08),transparent_45%)]" />

            <div className="viewer-noise absolute inset-0 opacity-[0.025]" />

            {/* Orbital glow */}

            <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.018]" />

            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.012]" />
          </div>

          {/* ==================================================
              TOP BAR
          ================================================== */}

          <div
            className="
              absolute
              left-4
              right-4
              top-4
              z-[320]
              flex
              items-start
              justify-between
              sm:left-8
              sm:right-8
              sm:top-8
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <Sparkles
                  size={9}
                  strokeWidth={1}
                  className="text-violet-200/35"
                />

                <p className="font-mono text-[5px] uppercase tracking-[0.5em] text-white/20">
                  MEMORY ARCHIVE
                </p>
              </div>

              <p className="mt-3 max-w-[220px] font-display text-xl leading-none text-white/75 sm:max-w-none sm:text-3xl">
                {selected.title}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-1 w-1 animate-pulse rounded-full bg-violet-200/60" />

                <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                  FRAME{" "}
                  {String(
                    selectedIndex + 1
                  ).padStart(2, "0")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closePhoto();
              }}
              className="
                group
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/50
                text-white/40
                backdrop-blur-xl
                transition-all
                duration-500
                hover:rotate-90
                hover:border-white/30
                hover:bg-white
                hover:text-black
                active:scale-90
              "
              aria-label="Close photo"
            >
              <X
                size={16}
                strokeWidth={1.2}
              />
            </button>
          </div>

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div
            className="
              relative
              flex
              max-h-[78vh]
              max-w-[90vw]
              items-center
              justify-center
              sm:max-h-[80vh]
              sm:max-w-[86vw]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: "pan-y",
            }}
          >
            {/* Image glow */}

            <div className="pointer-events-none absolute -inset-10 rounded-full bg-violet-200/[0.025] blur-3xl" />

            {/* Image */}

            <img
              src={selected.image}
              alt={selected.title}
              decoding="async"
              draggable="false"
              className={`
                relative
                max-h-[76vh]
                max-w-[90vw]
                select-none
                object-contain
                shadow-[0_40px_120px_rgba(0,0,0,.95)]
                transition-all
                duration-500
                ease-[cubic-bezier(.22,1,.36,1)]
                sm:max-h-[74vh]
                sm:max-w-[82vw]
                ${
                  isViewerReady
                    ? "scale-100 opacity-100"
                    : "scale-[.96] opacity-0"
                }
              `}
              style={{
                transform: `translateX(${swipeOffset}px)`,
              }}
            />

            {/* Film corners */}

            <span className="pointer-events-none absolute -left-2 -top-2 h-7 w-7 border-l border-t border-white/25 sm:-left-4 sm:-top-4 sm:h-10 sm:w-10" />

            <span className="pointer-events-none absolute -right-2 -top-2 h-7 w-7 border-r border-t border-white/25 sm:-right-4 sm:-top-4 sm:h-10 sm:w-10" />

            <span className="pointer-events-none absolute -bottom-2 -left-2 h-7 w-7 border-b border-l border-white/25 sm:-bottom-4 sm:-left-4 sm:h-10 sm:w-10" />

            <span className="pointer-events-none absolute -bottom-2 -right-2 h-7 w-7 border-b border-r border-white/25 sm:-bottom-4 sm:-right-4 sm:h-10 sm:w-10" />

            {/* Scan line */}

            <span className="pointer-events-none absolute left-0 top-0 h-px w-full animate-viewerScan bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          {/* ==================================================
              PREVIOUS
          ================================================== */}

          {photos.length > 1 && (
            <button
              type="button"
              onClick={previousPhoto}
              className="
                group
                absolute
                left-3
                top-1/2
                z-[320]
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white/35
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-white/30
                hover:bg-white
                hover:text-black
                active:scale-90
                sm:left-8
              "
              aria-label="Previous photo"
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </button>
          )}

          {/* ==================================================
              NEXT
          ================================================== */}

          {photos.length > 1 && (
            <button
              type="button"
              onClick={nextPhoto}
              className="
                group
                absolute
                right-3
                top-1/2
                z-[320]
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white/35
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-white/30
                hover:bg-white
                hover:text-black
                active:scale-90
                sm:right-8
              "
              aria-label="Next photo"
            >
              <ArrowRight
                size={16}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          )}

          {/* ==================================================
              BOTTOM HUD
          ================================================== */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              z-[320]
              w-[min(88vw,420px)]
              -translate-x-1/2
              text-center
              sm:bottom-8
            "
          >
            <p className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/20">
              {selected.date}
            </p>

            {/* Progress */}

            <div className="mt-4 h-px w-full overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-violet-300/20 via-white/60 to-violet-300/20 transition-all duration-700"
                style={{
                  width: `${viewerProgress}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-white/10" />

              <span className="font-mono text-[6px] tracking-[0.4em] text-white/35">
                {String(
                  selectedIndex + 1
                ).padStart(2, "0")}
                {" / "}
                {String(
                  photos.length
                ).padStart(2, "0")}
              </span>

              <span className="h-px w-8 bg-white/10" />
            </div>
          </div>

          {/* ==================================================
              MOBILE SWIPE HINT
          ================================================== */}

          <div className="absolute bottom-7 left-1/2 z-[320] hidden -translate-x-1/2 items-center gap-2 sm:hidden">
            <MoveHorizontal
              size={11}
              strokeWidth={1}
              className="text-white/15"
            />

            <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/15">
              SWIPE TO EXPLORE
            </span>
          </div>

          {/* Desktop keyboard hint */}

          <div className="absolute bottom-7 right-8 hidden items-center gap-2 sm:flex">
            <Maximize2
              size={9}
              strokeWidth={1}
              className="text-white/15"
            />

            <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/15">
              ARROWS TO NAVIGATE • ESC TO CLOSE
            </span>
          </div>
        </div>
      )}

      {/* ======================================================
          CSS
      ====================================================== */}

      <style>{`
        @keyframes photoScan {
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

        @keyframes viewerScan {
          0% {
            transform: translateY(-20%);
            opacity: 0;
          }

          15% {
            opacity: 0.45;
          }

          50% {
            opacity: 0.2;
          }

          85% {
            opacity: 0.45;
          }

          100% {
            transform: translateY(120%);
            opacity: 0;
          }
        }

        .animate-photoScan {
          animation:
            photoScan 1.15s
            cubic-bezier(.22,1,.36,1);
        }

        .animate-viewerScan {
          animation:
            viewerScan 3.5s linear infinite;
        }

        .gallery-grid {
          background-image:
            linear-gradient(
              rgba(255,255,255,.22) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.22) 1px,
              transparent 1px
            );

          background-size:
            80px 80px;
        }

        .gallery-noise {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
        }

        .paper-noise {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E");
        }

        .viewer-noise {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='v'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23v)' opacity='.55'/%3E%3C/svg%3E");
        }

        @media (max-width: 767px) {
          .gallery-grid {
            background-size:
              55px 55px;
          }

          .gallery-noise,
          .viewer-noise {
            display: none;
          }

          .paper-noise {
            opacity: .025;
          }

          .animate-viewerScan {
            animation-duration:
              5s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-photoScan,
          .animate-viewerScan {
            animation: none;
          }

          *,
          *::before,
          *::after {
            scroll-behavior:
              auto !important;

            transition-duration:
              0.01ms !important;

            animation-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}