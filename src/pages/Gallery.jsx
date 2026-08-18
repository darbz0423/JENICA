import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { birthdayData } from "../data/birthdayData";

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  const photos = birthdayData.gallery || [];

  const selectedIndex = selected
    ? photos.findIndex((photo) => photo.id === selected.id)
    : -1;

  useEffect(() => {
    if (!selected) return;

    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") {
        setSelected(null);
      }

      if (event.key === "ArrowLeft") {
        setSelected((current) => {
          if (!current || photos.length === 0) return current;

          const index = photos.findIndex(
            (photo) => photo.id === current.id
          );

          return photos[
            index <= 0 ? photos.length - 1 : index - 1
          ];
        });
      }

      if (event.key === "ArrowRight") {
        setSelected((current) => {
          if (!current || photos.length === 0) return current;

          const index = photos.findIndex(
            (photo) => photo.id === current.id
          );

          return photos[
            index >= photos.length - 1 ? 0 : index + 1
          ];
        });
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected, photos]);

  const openPhoto = (photo) => {
    setSelected(photo);
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

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#030303] px-5 pb-44 pt-28 text-white sm:px-8 sm:pt-36"
      onPointerMove={(event) => {
        if (window.innerWidth < 768) return;

        setCursor({
          x: (event.clientX / window.innerWidth) * 100,
          y: (event.clientY / window.innerHeight) * 100,
        });
      }}
    >
      {/* =========================================================
          LIVING BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10">

        {/* cursor light */}

        <div
          className="absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.018] blur-[110px] transition-all duration-[1200ms]"
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
          }}
        />

        {/* central atmosphere */}

        <div className="absolute left-1/2 top-[35%] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-violet-200/[0.018] blur-[150px]" />

        <div className="absolute -left-48 top-[60%] h-[500px] w-[500px] rounded-full bg-amber-100/[0.015] blur-[130px]" />

        <div className="absolute -right-48 top-[15%] h-[500px] w-[500px] rounded-full bg-blue-200/[0.015] blur-[130px]" />

        {/* grid */}

        <div className="absolute inset-0 opacity-[0.025] gallery-grid" />

        {/* vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.72)_100%)]" />

        {/* film grain */}

        <div className="absolute inset-0 opacity-[0.025] gallery-noise" />

      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative mx-auto max-w-7xl">

        <div className="flex items-center gap-3">

          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-white/20" />
            <span className="relative h-1 w-1 rounded-full bg-white/60" />
          </span>

          <span className="font-mono text-[7px] uppercase tracking-[0.55em] text-white/30">
            VISUAL MEMORY ARCHIVE
          </span>

        </div>

        <div className="mt-7 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">

          <div>

            <p className="font-mono text-[6px] tracking-[0.4em] text-white/15">
              ARCHIVE 001 / PERSONAL COLLECTION
            </p>

            <h1 className="mt-5 font-display text-[clamp(4rem,11vw,10rem)] leading-[0.78] tracking-[-0.055em]">
              Photographs
              <span className="text-white/10">.</span>
            </h1>

            <p className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-white/35 sm:text-xl">
              Some moments disappear the second they happen.
              Others stay somewhere inside us.
              <br />
              <span className="text-white/55">
                These are the ones worth keeping.
              </span>
            </p>

          </div>

          {/* archive information */}

          <div className="flex items-end gap-10 md:pb-2">

            <div>
              <p className="font-mono text-[6px] tracking-[0.35em] text-white/20">
                FRAMES
              </p>

              <p className="mt-1 font-display text-4xl text-white/60">
                {String(photos.length).padStart(2, "0")}
              </p>
            </div>

            <div>
              <p className="font-mono text-[6px] tracking-[0.35em] text-white/20">
                STATUS
              </p>

              <p className="mt-2 flex items-center gap-2 font-mono text-[6px] tracking-[0.25em] text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
                PRESERVED
              </p>
            </div>

          </div>

        </div>

        {/* cinematic divider */}

        <div className="mt-16 flex items-center gap-5">

          <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />

          <span className="font-mono text-[6px] tracking-[0.5em] text-white/15">
            ↓ MEMORY FIELD
          </span>

          <span className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent" />

        </div>

      </header>

      {/* =========================================================
          MEMORY FIELD
      ========================================================= */}

      <section className="relative mx-auto mt-20 max-w-7xl">

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">

          {photos.map((photo, index) => {

            /*
              Editorial layout.

              Instead of making every card identical,
              certain memories become visually dominant.
            */

            const layouts = [
              "lg:col-span-5 lg:col-start-1",
              "lg:col-span-4 lg:col-start-8 lg:mt-24",
              "lg:col-span-4 lg:col-start-3 lg:mt-10",
              "lg:col-span-5 lg:col-start-8",
              "lg:col-span-4 lg:col-start-1 lg:mt-20",
              "lg:col-span-5 lg:col-start-6 lg:mt-8",
            ];

            const rotations = [
              "-rotate-[1.5deg]",
              "rotate-[1.2deg]",
              "-rotate-[0.8deg]",
              "rotate-[1.8deg]",
              "-rotate-[1.2deg]",
              "rotate-[0.7deg]",
            ];

            const isHovered = hovered === index;

            return (
              <article
                key={photo.id}
                className={`relative ${layouts[index % layouts.length]}`}
              >

                {/* memory number */}

                <div
                  className={`absolute -top-7 left-0 z-20 transition-all duration-500 ${
                    isHovered
                      ? "translate-x-2 opacity-100"
                      : "opacity-50"
                  }`}
                >
                  <span className="font-mono text-[6px] tracking-[0.35em] text-white/20">
                    MEMORY
                  </span>

                  <span className="ml-2 font-display text-lg text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* card */}

                <button
                  onClick={() => openPhoto(photo)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className={`group relative block w-full text-left transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] ${rotations[index % rotations.length]} ${
                    isHovered
                      ? "z-30 scale-[1.035] rotate-0"
                      : "z-10"
                  }`}
                >

                  {/* ambient glow */}

                  <div
                    className={`absolute -inset-8 rounded-[40px] bg-white/[0.035] blur-3xl transition-all duration-1000 ${
                      isHovered
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />

                  {/* paper */}

                  <div className="relative overflow-hidden rounded-[4px] border border-black/10 bg-[#e8e5df] p-2 pb-20 shadow-[0_35px_100px_rgba(0,0,0,.7)] sm:p-3 sm:pb-24">

                    {/* paper grain */}

                    <div className="pointer-events-none absolute inset-0 opacity-[0.07] paper-noise" />

                    {/* photo */}

                    <div className="relative aspect-[4/5] overflow-hidden bg-black">

                      <img
                        src={photo.image}
                        alt={photo.title}
                        loading="lazy"
                        className={`h-full w-full object-cover transition-all duration-[1600ms] ${
                          isHovered
                            ? "scale-110 grayscale-0"
                            : "scale-100 grayscale-[20%]"
                        }`}
                      />

                      {/* cinematic tint */}

                      <div
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          isHovered
                            ? "opacity-20"
                            : "opacity-50"
                        } bg-gradient-to-t from-black via-transparent to-black/30`}
                      />

                      {/* focus brackets */}

                      <div
                        className={`absolute inset-4 border transition-all duration-700 ${
                          isHovered
                            ? "border-white/30"
                            : "border-white/0"
                        }`}
                      />

                      {/* moving scan */}

                      <span
                        className={`absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/80 to-transparent ${
                          isHovered
                            ? "animate-photoScan"
                            : ""
                        }`}
                      />

                      {/* center crosshair */}

                      <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                          isHovered
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0"
                        }`}
                      >
                        <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-white/40" />
                        <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-white/40" />
                      </div>

                    </div>

                    {/* card metadata */}

                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-4 sm:px-5 sm:pb-5">

                      <div>

                        <p className="font-serif text-sm text-black/75 sm:text-base">
                          {photo.title}
                        </p>

                        <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.3em] text-black/30">
                          {photo.date}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-mono text-[5px] tracking-[0.25em] text-black/20">
                          FRAME
                        </p>

                        <p className="font-display text-xl leading-none text-black/20">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                      </div>

                    </div>

                    {/* corners */}

                    <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-black/10" />
                    <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-black/10" />

                  </div>

                  {/* hover command */}

                  <div
                    className={`absolute -bottom-11 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${
                      isHovered
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono text-[6px] uppercase tracking-[0.35em] text-white/40">
                      Open memory
                      <ArrowUpRight size={9} />
                    </span>
                  </div>

                </button>

              </article>
            );
          })}

        </div>

      </section>

      {/* =========================================================
          END OF ARCHIVE
      ========================================================= */}

      <footer className="relative mx-auto mt-36 max-w-7xl">

        <div className="flex items-center gap-4">

          <span className="h-px flex-1 bg-white/[0.06]" />

          <div className="text-center">

            <p className="font-mono text-[6px] tracking-[0.45em] text-white/15">
              END OF ARCHIVE
            </p>

            <p className="mt-2 font-serif text-sm italic text-white/20">
              Some memories deserve another look.
            </p>

          </div>

          <span className="h-px flex-1 bg-white/[0.06]" />

        </div>

      </footer>

      {/* =========================================================
          CINEMATIC VIEWER
      ========================================================= */}

      {selected && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#010101]/[0.98] p-4 backdrop-blur-2xl sm:p-8"
          onClick={() => setSelected(null)}
        >

          {/* background image */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            <img
              src={selected.image}
              alt=""
              className="h-full w-full scale-110 object-cover opacity-[0.035] blur-3xl"
            />

            <div className="absolute inset-0 bg-black/80" />

          </div>

          {/* top bar */}

          <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">

            <div>

              <p className="font-mono text-[6px] uppercase tracking-[0.5em] text-white/20">
                MEMORY ARCHIVE
              </p>

              <p className="mt-2 font-display text-xl text-white/70">
                {selected.title}
              </p>

            </div>

            <button
              onClick={() => setSelected(null)}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/40 transition-all duration-500 hover:rotate-90 hover:border-white/30 hover:bg-white hover:text-black"
              aria-label="Close"
            >
              <X size={15} />
            </button>

          </div>

          {/* image */}

          <div
            className="relative flex max-h-[75vh] max-w-[88vw] items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="absolute -inset-10 rounded-full bg-white/[0.02] blur-3xl" />

            <img
              src={selected.image}
              alt={selected.title}
              className="relative max-h-[72vh] max-w-[86vw] object-contain shadow-[0_50px_150px_rgba(0,0,0,.9)]"
            />

            {/* frame corners */}

            <span className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-white/20" />
            <span className="absolute -right-3 -top-3 h-8 w-8 border-r border-t border-white/20" />
            <span className="absolute -bottom-3 -left-3 h-8 w-8 border-b border-l border-white/20" />
            <span className="absolute -bottom-3 -right-3 h-8 w-8 border-b border-r border-white/20" />

          </div>

          {/* previous */}

          <button
            onClick={previousPhoto}
            className="group absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/30 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black sm:left-8"
            aria-label="Previous"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>

          {/* next */}

          <button
            onClick={nextPhoto}
            className="group absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/30 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black sm:right-8"
            aria-label="Next"
          >
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          {/* bottom metadata */}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center sm:bottom-8">

            <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/20">
              {selected.date}
            </p>

            <div className="mt-2 flex items-center justify-center gap-4">

              <span className="h-px w-8 bg-white/10" />

              <span className="font-mono text-[6px] tracking-[0.35em] text-white/30">
                {String(selectedIndex + 1).padStart(2, "0")}{" "}
                /{" "}
                {String(photos.length).padStart(2, "0")}
              </span>

              <span className="h-px w-8 bg-white/10" />

            </div>

          </div>

          {/* keyboard hint */}

          <div className="absolute bottom-7 right-8 hidden items-center gap-2 sm:flex">

            <Maximize2
              size={9}
              className="text-white/15"
            />

            <span className="font-mono text-[5px] tracking-[0.3em] text-white/15">
              ESC TO CLOSE
            </span>

          </div>

        </div>
      )}

      {/* =========================================================
          CSS
      ========================================================= */}

      <style>{`

        @keyframes photoScan {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        .animate-photoScan {
          animation: photoScan 1.2s cubic-bezier(.22,1,.36,1);
        }

        .gallery-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .gallery-noise {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
        }

        .paper-noise {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E");
        }

        @media (max-width: 767px) {

          .gallery-grid {
            background-size: 50px 50px;
            opacity: .5;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .animate-photoScan {
            animation: none;
          }

        }

      `}</style>
    </main>
  );
}