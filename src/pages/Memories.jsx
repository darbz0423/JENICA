import { useState } from "react";
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

  const memories = birthdayData.memories || [];

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

          {/* floating ornament */}

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

        {/* archive status */}

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

        {/* orbital rings */}

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
                onClick={() => setSelected(memory)}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
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

                {/* =================================================
                    CARD
                ================================================= */}

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[3px]
                    border
                    border-white/[0.08]
                    bg-[#080808]
                    shadow-[0_30px_100px_rgba(0,0,0,.45)]
                    transition-all
                    duration-700
                    group-hover:-translate-y-3
                    group-hover:border-white/[0.18]
                    group-hover:shadow-[0_40px_120px_rgba(0,0,0,.7)]
                  "
                >

                  {/* image */}

                  <div className="relative aspect-[4/5] overflow-hidden">

                    <img
                      src={memory.image}
                      alt={memory.title}
                      loading="lazy"
                      decoding="async"
                      className="
                        h-full
                        w-full
                        object-cover
                        grayscale-[25%]
                        scale-[1.01]
                        transition-all
                        duration-[1800ms]
                        ease-out
                        group-hover:scale-110
                        group-hover:grayscale-0
                      "
                    />

                    {/* cinematic image tint */}

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

                    {/* image shine */}

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

                    {/* top metadata */}

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
                        0{index + 1}
                      </span>

                    </div>

                    {/* center focus */}

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

                    {/* bottom content */}

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

                  {/* =================================================
                      CARD FOOTER
                  ================================================= */}

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
          onClick={() => setSelected(null)}
        >

          {/* background glow */}

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

          {/* close */}

          <button
            onClick={() => setSelected(null)}
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
              hover:border-white/30
              hover:bg-white
              hover:text-black
              sm:right-8
              sm:top-8
            "
          >
            <X size={16} strokeWidth={1} />
          </button>

          {/* viewer */}

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

            {/* image */}

            <div className="relative min-h-[55vh] overflow-hidden md:min-h-[75vh]">

              <img
                src={selected.image}
                alt={selected.title}
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

            {/* information */}

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

              {/* vertical glow */}

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
                        MEMORY #{String(selected.id).padStart(2, "0")}
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
      `}</style>

    </main>
  );
}