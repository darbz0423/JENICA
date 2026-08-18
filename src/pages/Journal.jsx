import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

export default function Journal() {
  const pages = birthdayData.journal || [];
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState("next");

  const current = pages[page];

  if (!current) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <BookOpen
            size={28}
            strokeWidth={1}
            className="mx-auto mb-6 text-white/20"
          />

          <p className="font-serif text-xl italic text-white/40">
            This journal is waiting for its first page.
          </p>
        </div>
      </div>
    );
  }

  const goPrevious = () => {
    if (page === 0) return;

    setDirection("previous");
    setPage((value) => Math.max(0, value - 1));
  };

  const goNext = () => {
    if (page === pages.length - 1) return;

    setDirection("next");
    setPage((value) =>
      Math.min(pages.length - 1, value + 1)
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-40 pt-28 sm:px-8 sm:pt-32">

      {/* =========================================================
          ATMOSPHERIC LIGHT
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.025]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            left-[15%]
            top-[25%]
            h-[180px]
            w-[180px]
            rounded-full
            bg-white/[0.018]
            blur-[90px]
          "
        />

        <div
          className="
            absolute
            right-[10%]
            bottom-[15%]
            h-[220px]
            w-[220px]
            rounded-full
            bg-white/[0.015]
            blur-[100px]
          "
        />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="mx-auto max-w-6xl">

        <div className="flex items-center gap-3">

          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
            <BookOpen
              size={12}
              strokeWidth={1.2}
              className="text-white/50"
            />
          </span>

          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.45em] text-white/35">
              PERSONAL JOURNAL
            </p>

            <p className="mt-1 font-mono text-[5px] uppercase tracking-[0.3em] text-white/15">
              MEMORY ARCHIVE // {String(current.page).padStart(2, "0")}
            </p>
          </div>

        </div>

        <div className="mt-8 flex items-end justify-between gap-5">

          <div>

            <h1 className="font-display text-6xl leading-[0.8] tracking-[-0.04em] sm:text-8xl md:text-9xl">
              Pages
            </h1>

            <p className="mt-6 max-w-md font-serif text-base leading-relaxed text-white/35 sm:text-lg">
              A collection of ordinary moments that
              somehow became worth remembering.
            </p>

          </div>

          <div className="hidden pb-2 text-right sm:block">
            <p className="font-mono text-[6px] tracking-[0.35em] text-white/15">
              ARCHIVE
            </p>

            <p className="mt-2 font-mono text-xs tracking-[0.2em] text-white/30">
              {String(page + 1).padStart(2, "0")} /{" "}
              {String(pages.length).padStart(2, "0")}
            </p>
          </div>

        </div>

      </header>

      {/* =========================================================
          JOURNAL AREA
      ========================================================= */}

      <section className="mx-auto mt-14 max-w-6xl sm:mt-20">

        <div className="relative">

          {/* BACK SHADOW PAGES */}

          <div
            className="
              absolute
              inset-x-4
              bottom-[-7px]
              top-3
              rounded-[4px]
              border
              border-white/[0.05]
              bg-[#bdb5a7]
              opacity-30
              shadow-2xl
            "
          />

          <div
            className="
              absolute
              inset-x-2
              bottom-[-4px]
              top-1
              rounded-[4px]
              border
              border-white/[0.05]
              bg-[#d4ccbe]
              opacity-50
            "
          />

          {/* =====================================================
              MAIN PAPER
          ===================================================== */}

          <div
            key={current.page}
            className={`
              relative
              overflow-hidden
              rounded-[3px]
              bg-[#eee8dc]
              text-black
              shadow-[0_40px_120px_rgba(0,0,0,.65)]
              ${
                direction === "next"
                  ? "animate-journal-next"
                  : "animate-journal-prev"
              }
            `}
          >

            {/* PAPER TEXTURE */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.08]
                mix-blend-multiply
                journal-paper
              "
            />

            {/* TOP PAPER EDGE */}

            <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-px bg-black/10" />

            {/* =================================================
                DESKTOP SPREAD
            ================================================= */}

            <div className="grid min-h-[560px] md:min-h-[680px] md:grid-cols-[1.05fr_.95fr]">

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div className="group relative min-h-[330px] overflow-hidden md:min-h-0">

                <img
                  src={current.image}
                  alt={current.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-[1400ms]
                    ease-out
                    group-hover:scale-[1.035]
                  "
                />

                {/* IMAGE CINEMA GRADING */}

                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/35" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* IMAGE NUMBER */}

                <div className="absolute left-5 top-5 flex items-center gap-2">

                  <span className="h-px w-5 bg-white/50" />

                  <span className="font-mono text-[6px] tracking-[0.35em] text-white/60">
                    FRAME {String(current.page).padStart(2, "0")}
                  </span>

                </div>

                {/* IMAGE DATE */}

                <div className="absolute bottom-5 left-5">

                  <p className="font-mono text-[7px] uppercase tracking-[0.35em] text-white/55">
                    {current.date}
                  </p>

                </div>

                {/* IMAGE CORNER */}

                <div className="absolute bottom-5 right-5 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/10 backdrop-blur-md">
                  <Sparkles
                    size={10}
                    strokeWidth={1}
                    className="text-white/60"
                  />
                </div>

              </div>

              {/* =================================================
                  WRITING
              ================================================= */}

              <div className="relative flex flex-col justify-between p-7 sm:p-10 md:p-14 lg:p-16">

                {/* SMALL HEADER */}

                <div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={11}
                        strokeWidth={1.2}
                        className="text-black/30"
                      />

                      <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-black/35">
                        {current.date}
                      </span>

                    </div>

                    <span className="font-mono text-[6px] tracking-[0.25em] text-black/20">
                      {String(current.page).padStart(2, "0")}
                    </span>

                  </div>

                  <div className="mt-7 h-px w-10 bg-black/15" />

                  {/* TITLE */}

                  <h2 className="mt-7 max-w-lg font-serif text-4xl leading-[0.95] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                    {current.title}
                  </h2>

                  {/* BODY */}

                  <p className="mt-8 max-w-xl whitespace-pre-line font-serif text-[17px] leading-[1.85] text-black/55 sm:text-lg md:mt-10 md:text-xl">
                    {current.text}
                  </p>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-12">

                  <div className="mb-5 h-px bg-black/10" />

                  <div className="flex items-end justify-between">

                    <div>

                      <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-black/25">
                        MEMORY JOURNAL
                      </p>

                      <p className="mt-1 font-serif text-xs italic text-black/25">
                        Kept for a reason.
                      </p>

                    </div>

                    <div className="font-serif text-xl text-black/20">
                      ✦
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* PAPER SPINE */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                top-0
                hidden
                w-px
                bg-black/10
                md:left-[52.5%]
                md:block
              "
            />

          </div>
        </div>

        {/* =========================================================
            PAGE CONTROLS
        ========================================================= */}

        <div className="mt-8 flex items-center justify-between">

          {/* PREVIOUS */}

          <button
            onClick={goPrevious}
            disabled={page === 0}
            className="
              group
              flex
              items-center
              gap-3
              rounded-full
              border
              border-white/[0.09]
              bg-white/[0.02]
              px-4
              py-2.5
              font-mono
              text-[7px]
              uppercase
              tracking-[0.3em]
              text-white/35
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-white/25
              hover:bg-white/[0.06]
              hover:text-white
              disabled:pointer-events-none
              disabled:opacity-15
              sm:px-5
            "
          >
            <ChevronLeft
              size={12}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="hidden sm:block">
              Previous
            </span>

            <span className="sm:hidden">
              Prev
            </span>
          </button>

          {/* PAGE INDICATOR */}

          <div className="flex items-center gap-3">

            <span className="font-mono text-[7px] tracking-[0.3em] text-white/20">
              {String(page + 1).padStart(2, "0")}
            </span>

            <div className="flex gap-1.5">

              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(
                      index > page ? "next" : "previous"
                    );
                    setPage(index);
                  }}
                  aria-label={`Go to page ${index + 1}`}
                  className={`
                    h-[2px]
                    rounded-full
                    transition-all
                    duration-500
                    ${
                      index === page
                        ? "w-7 bg-white"
                        : "w-2 bg-white/15 hover:bg-white/40"
                    }
                  `}
                />
              ))}

            </div>

            <span className="font-mono text-[7px] tracking-[0.3em] text-white/20">
              {String(pages.length).padStart(2, "0")}
            </span>

          </div>

          {/* NEXT */}

          <button
            onClick={goNext}
            disabled={page === pages.length - 1}
            className="
              group
              flex
              items-center
              gap-3
              rounded-full
              border
              border-white/[0.09]
              bg-white/[0.02]
              px-4
              py-2.5
              font-mono
              text-[7px]
              uppercase
              tracking-[0.3em]
              text-white/35
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-white/25
              hover:bg-white/[0.06]
              hover:text-white
              disabled:pointer-events-none
              disabled:opacity-15
              sm:px-5
            "
          >
            <span className="hidden sm:block">
              Next
            </span>

            <span className="sm:hidden">
              Next
            </span>

            <ChevronRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

        </div>

        {/* =========================================================
            BOTTOM ARCHIVE STATUS
        ========================================================= */}

        <div className="mt-12 flex items-center justify-center gap-3">

          <span className="h-px w-8 bg-white/10" />

          <span className="font-mono text-[5px] uppercase tracking-[0.5em] text-white/15">
            MEMORY ARCHIVE // PAGE {String(page + 1).padStart(2, "0")}
          </span>

          <span className="h-px w-8 bg-white/10" />

        </div>

      </section>

      {/* =========================================================
          ANIMATIONS
      ========================================================= */}

      <style>{`

        .journal-paper {
          background-image:
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,.025) 0px,
              rgba(0,0,0,.025) 1px,
              transparent 1px,
              transparent 4px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,.015) 0px,
              rgba(0,0,0,.015) 1px,
              transparent 1px,
              transparent 5px
            );
        }

        @keyframes journalNext {
          from {
            opacity: 0;
            transform: translateX(25px) rotate(.4deg);
          }

          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes journalPrev {
          from {
            opacity: 0;
            transform: translateX(-25px) rotate(-.4deg);
          }

          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        .animate-journal-next {
          animation: journalNext .7s cubic-bezier(.22,1,.36,1);
        }

        .animate-journal-prev {
          animation: journalPrev .7s cubic-bezier(.22,1,.36,1);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-journal-next,
          .animate-journal-prev {
            animation: none;
          }
        }

      `}</style>
    </main>
  );
}