import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  X,
  ScanLine,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { birthdayData } from "../data/birthdayData";

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({ x: 50, y: 35 });

  const photos = birthdayData.gallery || [];

  const selectedIndex = useMemo(() => {
    if (!selected) return -1;

    return photos.findIndex(
      (photo) => photo.id === selected.id
    );
  }, [selected, photos]);

  /*
   * ============================================================
   * VIEWER / KEYBOARD
   * ============================================================
   */

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") {
        setSelected(null);
      }

      if (event.key === "ArrowLeft") {
        setSelected((current) => {
          if (!current || !photos.length) return current;

          const index = photos.findIndex(
            (photo) => photo.id === current.id
          );

          return photos[
            index <= 0
              ? photos.length - 1
              : index - 1
          ];
        });
      }

      if (event.key === "ArrowRight") {
        setSelected((current) => {
          if (!current || !photos.length) return current;

          const index = photos.findIndex(
            (photo) => photo.id === current.id
          );

          return photos[
            index >= photos.length - 1
              ? 0
              : index + 1
          ];
        });
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected, photos]);

  /*
   * ============================================================
   * CURSOR ATMOSPHERE
   *
   * Desktop only.
   * Mobile does not run this effect.
   * ============================================================
   */

  const handlePointerMove = (event) => {
    if (window.innerWidth < 1024) return;

    setCursor({
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100,
    });
  };

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const openPhoto = (photo) => {
    setSelected(photo);
  };

  const closePhoto = () => {
    setSelected(null);
  };

  const nextPhoto = (event) => {
    event?.stopPropagation();

    if (!photos.length) return;

    setSelected(
      photos[
        selectedIndex >= photos.length - 1
          ? 0
          : selectedIndex + 1
      ]
    );
  };

  const previousPhoto = (event) => {
    event?.stopPropagation();

    if (!photos.length) return;

    setSelected(
      photos[
        selectedIndex <= 0
          ? photos.length - 1
          : selectedIndex - 1
      ]
    );
  };

  /*
   * ============================================================
   * EDITORIAL LAYOUT
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
      {/* ========================================================
          BACKGROUND UNIVERSE
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        {/* Base */}

        <div className="absolute inset-0 bg-[#020202]" />

        {/* Desktop cursor atmosphere */}

        <div
          className="
            absolute
            hidden
            h-[380px]
            w-[380px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/[0.025]
            blur-[100px]
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

        {/* Central atmosphere */}

        <div
          className="
            absolute
            left-1/2
            top-[30%]
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-violet-300/[0.012]
            blur-[120px]
            sm:h-[650px]
            sm:w-[650px]
          "
        />

        {/* Left atmosphere */}

        <div
          className="
            absolute
            -left-48
            top-[60%]
            hidden
            h-[400px]
            w-[400px]
            rounded-full
            bg-amber-100/[0.012]
            blur-[110px]
            sm:block
          "
        />

        {/* Right atmosphere */}

        <div
          className="
            absolute
            -right-48
            top-[15%]
            hidden
            h-[400px]
            w-[400px]
            rounded-full
            bg-blue-200/[0.01]
            blur-[110px]
            sm:block
          "
        />

        {/* Grid */}

        <div className="absolute inset-0 gallery-grid opacity-[0.018]" />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_30%,transparent_18%,rgba(0,0,0,.72)_100%)]
          "
        />

        {/* Noise */}

        <div className="absolute inset-0 gallery-noise opacity-[0.018]" />

        {/* Top cinematic shadow */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-48
            bg-gradient-to-b
            from-black
            to-transparent
            opacity-70
          "
        />

      </div>

      {/* ========================================================
          TOP IDENTIFIER
      ======================================================== */}

      <header className="relative mx-auto max-w-7xl">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="relative flex h-7 w-7 items-center justify-center">

              <span
                className="
                  absolute
                  inset-0
                  rotate-45
                  border
                  border-white/[0.12]
                "
              />

              <span className="relative h-1 w-1 rounded-full bg-white/70" />

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

              <span className="h-1 w-1 animate-pulse rounded-full bg-white/60" />

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/30">
                PRESERVED
              </span>

            </div>

          </div>

        </div>

        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="mt-16 sm:mt-20 lg:mt-24">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/15">
                ARCHIVE 001 / PERSONAL COLLECTION
              </p>

              <h1
                className="
                  mt-5
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
                Photographs
                <span className="text-white/[0.08]">.</span>
              </h1>

              <div className="mt-8 max-w-xl">

                <p
                  className="
                    font-serif
                    text-[17px]
                    leading-[1.8]
                    text-white/30
                    sm:text-xl
                  "
                >
                  Some moments disappear the second
                  they happen.
                  Others stay somewhere inside us.
                </p>

                <p
                  className="
                    mt-2
                    font-serif
                    text-[17px]
                    italic
                    leading-[1.8]
                    text-white/55
                    sm:text-xl
                  "
                >
                  These are the ones worth keeping.
                </p>

              </div>

            </div>

            {/* Archive stats */}

            <div className="flex items-end gap-8 sm:gap-12">

              <div>

                <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
                  FRAMES
                </p>

                <p className="mt-1 font-display text-4xl leading-none text-white/55 sm:text-5xl">
                  {String(photos.length).padStart(2, "0")}
                </p>

              </div>

              <div>

                <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
                  TYPE
                </p>

                <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.3em] text-white/35">
                  MEMORIES
                </p>

              </div>

            </div>

          </div>

          {/* Cinematic divider */}

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

      {/* ========================================================
          MEMORY FIELD
      ======================================================== */}

      <section className="relative mx-auto mt-20 max-w-7xl sm:mt-28 lg:mt-32">

        {/* Desktop orbital rings */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[40%]
            hidden
            h-[800px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            border
            border-white/[0.018]
            lg:block
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[40%]
            hidden
            h-[560px]
            w-[560px]
            -translate-x-1/2
            rounded-full
            border
            border-dashed
            border-white/[0.012]
            lg:block
          "
        />

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

            const isHovered = hovered === index;

            return (
              <article
                key={photo.id}
                className={`
                  relative
                  ${layouts[index % layouts.length]}
                `}
              >

                {/* ==================================================
                    MEMORY INDEX
                ================================================== */}

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

                  <span className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/20">
                    MEMORY
                  </span>

                  <span className="font-display text-lg leading-none text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>

                {/* ==================================================
                    PHOTO BUTTON
                ================================================== */}

                <button
                  type="button"
                  onClick={() => openPhoto(photo)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  className={`
                    group
                    relative
                    block
                    w-full
                    text-left
                    ${rotations[index % rotations.length]}
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

                  {/* Ambient glow */}

                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -inset-6
                      rounded-[30px]
                      bg-white/[0.025]
                      blur-2xl
                      transition-opacity
                      duration-700
                      ${
                        isHovered
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />

                  {/* =================================================
                      POLAROID FRAME
                  ================================================= */}

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
                      sm:p-3
                      sm:pb-24
                    "
                  >

                    {/* Paper texture */}

                    <div className="pointer-events-none absolute inset-0 paper-noise opacity-[0.045]" />

                    {/* Paper highlight */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        top-0
                        h-20
                        bg-gradient-to-b
                        from-white/30
                        to-transparent
                        opacity-30
                      "
                    />

                    {/* =================================================
                        PHOTO
                    ================================================= */}

                    <div
                      className="
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        bg-black
                      "
                    >

                      <img
                        src={photo.image}
                        alt={photo.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        draggable="false"
                        className={`
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-[1200ms]
                          ease-[cubic-bezier(.22,1,.36,1)]
                          ${
                            isHovered
                              ? "lg:scale-[1.06]"
                              : "scale-100"
                          }
                        `}
                      />

                      {/* Cinematic gradient */}

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
                              ? "border-white/30"
                              : "border-white/0"
                          }
                        `}
                      />

                      {/* Top scan line */}

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

                        <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-white/50" />

                        <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-white/50" />

                      </div>

                      {/* Frame number */}

                      <div className="absolute right-3 top-3">

                        <span className="font-mono text-[5px] tracking-[0.3em] text-white/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        POLAROID META
                    ================================================= */}

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
                          {String(index + 1).padStart(2, "0")}
                        </p>

                      </div>

                    </div>

                    {/* Frame corners */}

                    <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-black/10" />

                    <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-black/10" />

                    <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-black/10" />

                    <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-black/10" />

                  </div>

                  {/* =================================================
                      OPEN MEMORY
                  ================================================= */}

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

      {/* ========================================================
          ARCHIVE END
      ======================================================== */}

      <footer className="relative mx-auto mt-36 max-w-7xl sm:mt-48">

        <div className="flex items-center gap-4">

          <span className="h-px flex-1 bg-white/[0.06]" />

          <div className="text-center">

            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08]">

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

      {/* ========================================================
          MOBILE MEMORY HINT
      ======================================================== */}

      <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">

        <span className="h-px w-8 bg-white/[0.06]" />

        <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/10">
          Tap a photograph
        </span>

        <span className="h-px w-8 bg-white/[0.06]" />

      </div>

      {/* ========================================================
          CINEMATIC VIEWER
      ======================================================== */}

      {selected && (
        <div
          className="
            fixed
            inset-0
            z-[300]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-[#010101]
            p-3
            sm:p-8
          "
          onClick={closePhoto}
        >

          {/* ======================================================
              VIEWER BACKDROP
          ====================================================== */}

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
                opacity-[0.035]
                blur-2xl
              "
            />

            <div className="absolute inset-0 bg-black/90" />

            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.045),transparent_45%)]
              "
            />

            <div className="absolute inset-0 viewer-noise opacity-[0.025]" />

          </div>

          {/* ======================================================
              TOP BAR
          ====================================================== */}

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

              <p className="font-mono text-[5px] uppercase tracking-[0.5em] text-white/20">
                MEMORY ARCHIVE
              </p>

              <p className="mt-2 max-w-[200px] font-display text-xl leading-none text-white/70 sm:max-w-none sm:text-2xl">
                {selected.title}
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="h-1 w-1 rounded-full bg-white/40" />

                <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                  FRAME{" "}
                  {String(selectedIndex + 1).padStart(2, "0")}
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={closePhoto}
              className="
                group
                flex
                h-10
                w-10
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
              aria-label="Close"
            >
              <X
                size={15}
                strokeWidth={1.2}
              />
            </button>

          </div>

          {/* ======================================================
              MAIN IMAGE
          ====================================================== */}

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
            onClick={(event) => event.stopPropagation()}
          >

            {/* Image glow */}

            <div className="pointer-events-none absolute -inset-8 rounded-full bg-white/[0.025] blur-3xl" />

            {/* Image */}

            <img
              src={selected.image}
              alt={selected.title}
              decoding="async"
              draggable="false"
              className="
                relative
                max-h-[76vh]
                max-w-[90vw]
                object-contain
                shadow-[0_40px_120px_rgba(0,0,0,.95)]
                sm:max-h-[74vh]
                sm:max-w-[82vw]
              "
            />

            {/* Film corners */}

            <span className="absolute -left-2 -top-2 h-7 w-7 border-l border-t border-white/25 sm:-left-4 sm:-top-4 sm:h-10 sm:w-10" />

            <span className="absolute -right-2 -top-2 h-7 w-7 border-r border-t border-white/25 sm:-right-4 sm:-top-4 sm:h-10 sm:w-10" />

            <span className="absolute -bottom-2 -left-2 h-7 w-7 border-b border-l border-white/25 sm:-bottom-4 sm:-left-4 sm:h-10 sm:w-10" />

            <span className="absolute -bottom-2 -right-2 h-7 w-7 border-b border-r border-white/25 sm:-bottom-4 sm:-right-4 sm:h-10 sm:w-10" />

          </div>

          {/* ======================================================
              PREVIOUS
          ====================================================== */}

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

          {/* ======================================================
              NEXT
          ====================================================== */}

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

          {/* ======================================================
              BOTTOM INFORMATION
          ====================================================== */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              z-[320]
              -translate-x-1/2
              text-center
              sm:bottom-8
            "
          >

            <p className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/20">
              {selected.date}
            </p>

            <div className="mt-3 flex items-center justify-center gap-4">

              <span className="h-px w-8 bg-white/10" />

              <span className="font-mono text-[6px] tracking-[0.4em] text-white/35">
                {String(selectedIndex + 1).padStart(2, "0")}
                {" / "}
                {String(photos.length).padStart(2, "0")}
              </span>

              <span className="h-px w-8 bg-white/10" />

            </div>

          </div>

          {/* ======================================================
              DESKTOP KEYBOARD
          ====================================================== */}

          <div className="absolute bottom-7 right-8 hidden items-center gap-2 sm:flex">

            <Maximize2
              size={9}
              strokeWidth={1}
              className="text-white/15"
            />

            <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/15">
              ESC TO CLOSE
            </span>

          </div>

        </div>
      )}

      {/* ========================================================
          CSS
      ======================================================== */}

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

        .animate-photoScan {
          animation: photoScan 1.15s cubic-bezier(.22,1,.36,1);
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

          background-size: 80px 80px;
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
            background-size: 55px 55px;
          }

          .gallery-noise {
            display: none;
          }

          .viewer-noise {
            display: none;
          }

          .paper-noise {
            opacity: .025;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-photoScan {
            animation: none;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}