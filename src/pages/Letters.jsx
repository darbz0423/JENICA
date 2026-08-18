import { useState } from "react";
import {
  ArrowUpRight,
  Feather,
  Lock,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

export default function Letters() {
  const [opened, setOpened] = useState(null);
  const [hovered, setHovered] = useState(null);

  const letters = birthdayData.letters || [];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-40 pt-28 md:pt-32">

      {/* =========================================================
          DEEP SPACE ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#020202]">

        {/* Central light */}

        <div
          className="
            absolute
            left-1/2
            top-[35%]
            h-[650px]
            w-[650px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.025]
            blur-[150px]
          "
        />

        {/* Violet atmosphere */}

        <div
          className="
            absolute
            -left-40
            top-[25%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-violet-500/[0.025]
            blur-[140px]
          "
        />

        {/* Warm atmosphere */}

        <div
          className="
            absolute
            -right-40
            bottom-[10%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-amber-300/[0.02]
            blur-[150px]
          "
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.8)_100%)]
          "
        />

        {/* Film lines */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,.15)_50%)]
            bg-[length:100%_4px]
          "
        />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative mx-auto max-w-6xl text-center">

        {/* orbital decoration */}

        <div className="mx-auto mb-8 flex items-center justify-center">

          <div className="relative flex h-12 w-12 items-center justify-center">

            <span
              className="
                absolute
                inset-0
                rotate-45
                border
                border-white/[0.12]
                transition-transform
                duration-[1200ms]
                hover:rotate-90
              "
            />

            <span
              className="
                absolute
                inset-2
                rounded-full
                border
                border-white/[0.08]
              "
            />

            <Mail
              size={14}
              strokeWidth={1}
              className="relative text-white/50"
            />

            <span
              className="
                absolute
                -inset-3
                rounded-full
                border
                border-dashed
                border-white/[0.04]
                animate-[spin_20s_linear_infinite]
              "
            />

          </div>

        </div>

        <div className="flex items-center justify-center gap-4">

          <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />

          <p
            className="
              font-mono
              text-[7px]
              uppercase
              tracking-[0.6em]
              text-white/30
            "
          >
            MEMORY ARCHIVE // 004
          </p>

          <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />

        </div>

        <h1
          className="
            mt-8
            font-display
            text-6xl
            leading-[0.78]
            tracking-[-0.05em]
            sm:text-8xl
            md:text-[9rem]
          "
        >
          Things
          <br />
          <span className="text-white/25">
            unsaid.
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-9
            max-w-md
            font-serif
            text-base
            leading-[1.8]
            text-white/30
            sm:text-lg
          "
        >
          Not everything meaningful needs
          to be spoken aloud.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">

          <span className="h-1 w-1 rounded-full bg-white/50 shadow-[0_0_10px_white]" />

          <span
            className="
              font-mono
              text-[6px]
              tracking-[0.5em]
              text-white/15
            "
          >
            THREE FRAGMENTS // ONE STORY
          </span>

          <span className="h-1 w-1 rounded-full bg-white/20" />

        </div>

      </header>

      {/* =========================================================
          LETTER CONSTELLATION
      ========================================================= */}

      <section
        className="
          relative
          mx-auto
          mt-20
          max-w-6xl
          md:mt-28
        "
      >

        {/* central constellation */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            hidden
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.025]
            md:block
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            hidden
            h-[360px]
            w-[360px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-dashed
            border-white/[0.025]
            md:block
            animate-[spin_35s_linear_infinite]
          "
        />

        <div
          className="
            grid
            gap-5
            md:grid-cols-3
          "
        >

          {letters.map((letter, index) => {

            const isHovered = hovered === index;

            return (
              <button
                key={letter.id}
                onClick={() => setOpened(letter)}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className="
                  group
                  relative
                  min-h-[390px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-[#070707]/90
                  p-7
                  text-left
                  backdrop-blur-xl
                  transition-all
                  duration-700
                  md:min-h-[430px]
                "
                style={{
                  transform:
                    isHovered
                      ? "translateY(-10px)"
                      : "translateY(0)",
                }}
              >

                {/* =================================================
                    CARD GLOW
                ================================================= */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -inset-20
                    rounded-full
                    bg-white/[0.04]
                    blur-[70px]
                    opacity-0
                    transition-opacity
                    duration-700
                    group-hover:opacity-100
                  "
                />

                {/* =================================================
                    MOVING LIGHT
                ================================================= */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -left-full
                    top-0
                    h-full
                    w-1/2
                    skew-x-[-20deg]
                    bg-gradient-to-r
                    from-transparent
                    via-white/[0.06]
                    to-transparent
                    transition-transform
                    duration-[1200ms]
                    group-hover:left-[140%]
                  "
                />

                {/* =================================================
                    TOP BORDER
                ================================================= */}

                <span
                  className="
                    absolute
                    left-6
                    right-6
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-white/30
                    to-transparent
                    opacity-40
                    transition-all
                    duration-700
                    group-hover:left-2
                    group-hover:right-2
                    group-hover:opacity-100
                  "
                />

                {/* =================================================
                    NUMBER
                ================================================= */}

                <div className="absolute right-6 top-6">

                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.3em]
                      text-white/10
                      transition-colors
                      group-hover:text-white/50
                    "
                  >
                    0{index + 1}
                  </span>

                </div>

                {/* =================================================
                    ENVELOPE ICON
                ================================================= */}

                <div
                  className="
                    relative
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.09]
                    bg-white/[0.025]
                    text-white/35
                    transition-all
                    duration-700
                    group-hover:rotate-6
                    group-hover:border-white/40
                    group-hover:bg-white
                    group-hover:text-black
                    group-hover:shadow-[0_0_35px_rgba(255,255,255,.15)]
                  "
                >

                  <Mail
                    size={15}
                    strokeWidth={1.2}
                  />

                  <span
                    className="
                      absolute
                      -inset-2
                      rounded-xl
                      border
                      border-white/[0.025]
                      transition-all
                      duration-700
                      group-hover:-inset-3
                      group-hover:border-white/[0.08]
                    "
                  />

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="relative mt-12">

                  <p
                    className="
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.4em]
                      text-white/20
                      transition-colors
                      group-hover:text-white/50
                    "
                  >
                    SEALED LETTER
                  </p>

                  <h2
                    className="
                      mt-5
                      max-w-[230px]
                      font-serif
                      text-3xl
                      leading-[1.02]
                      text-white/80
                      transition-all
                      duration-500
                      group-hover:text-white
                    "
                  >
                    {letter.title}
                  </h2>

                  <p
                    className="
                      mt-5
                      max-w-[220px]
                      font-serif
                      text-sm
                      italic
                      leading-[1.7]
                      text-white/25
                      transition-colors
                      duration-500
                      group-hover:text-white/50
                    "
                  >
                    {letter.subtitle}
                  </p>

                </div>

                {/* =================================================
                    SECRET MESSAGE
                ================================================= */}

                <div
                  className="
                    absolute
                    bottom-24
                    left-7
                    right-7
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:translate-y-0
                    group-hover:opacity-100
                    translate-y-2
                  "
                >

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={9}
                      className="text-white/40"
                    />

                    <span
                      className="
                        font-mono
                        text-[6px]
                        uppercase
                        tracking-[0.3em]
                        text-white/30
                      "
                    >
                      Something is waiting inside
                    </span>

                  </div>

                </div>

                {/* =================================================
                    BOTTOM
                ================================================= */}

                <div
                  className="
                    absolute
                    bottom-7
                    left-7
                    right-7
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.06]
                    pt-5
                  "
                >

                  <div className="flex items-center gap-2">

                    <Lock
                      size={9}
                      strokeWidth={1}
                      className="
                        text-white/15
                        transition-colors
                        group-hover:text-white/50
                      "
                    />

                    <span
                      className="
                        font-mono
                        text-[6px]
                        uppercase
                        tracking-[0.3em]
                        text-white/15
                        transition-colors
                        group-hover:text-white/50
                      "
                    >
                      Open archive
                    </span>

                  </div>

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1}
                    className="
                      text-white/15
                      transition-all
                      duration-500
                      group-hover:-translate-y-1
                      group-hover:translate-x-1
                      group-hover:text-white
                    "
                  />

                </div>

              </button>
            );
          })}

        </div>
      </section>

      {/* =========================================================
          BOTTOM SIGNATURE
      ========================================================= */}

      <div
        className="
          mx-auto
          mt-16
          flex
          max-w-6xl
          items-center
          gap-4
        "
      >

        <span className="h-px flex-1 bg-white/[0.04]" />

        <span
          className="
            font-mono
            text-[6px]
            uppercase
            tracking-[0.5em]
            text-white/10
          "
        >
          Some words deserve to survive
        </span>

        <span className="h-px flex-1 bg-white/[0.04]" />

      </div>

      {/* =========================================================
          LETTER VIEWER
      ========================================================= */}

      {opened && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            overflow-y-auto
            bg-[#010101]/95
            px-4
            py-8
            backdrop-blur-2xl
            sm:px-6
            sm:py-12
          "
          onClick={() => setOpened(null)}
        >

          {/* background glow */}

          <div
            className="
              pointer-events-none
              fixed
              left-1/2
              top-1/2
              h-[600px]
              w-[600px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-white/[0.025]
              blur-[130px]
            "
          />

          {/* close */}

          <button
            onClick={() => setOpened(null)}
            aria-label="Close letter"
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
              bg-black/60
              text-white/40
              backdrop-blur-xl
              transition-all
              hover:border-white/30
              hover:bg-white
              hover:text-black
              sm:right-8
              sm:top-8
            "
          >
            <X size={16} strokeWidth={1} />
          </button>

          {/* =====================================================
              PAPER
          ===================================================== */}

          <article
            onClick={(event) => event.stopPropagation()}
            className="
              relative
              mx-auto
              my-16
              max-w-3xl
              overflow-hidden
              rounded-[3px]
              bg-[#ebe4d6]
              text-black
              shadow-[0_50px_150px_rgba(0,0,0,.8)]
              sm:my-20
            "
          >

            {/* paper grain */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.055]
                [background-image:radial-gradient(#000_0.5px,transparent_0.5px)]
                [background-size:5px_5px]
              "
            />

            {/* paper glow */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.35),transparent_50%)]
              "
            />

            {/* paper top */}

            <div
              className="
                relative
                h-1
                bg-gradient-to-r
                from-transparent
                via-black/20
                to-transparent
              "
            />

            <div
              className="
                relative
                px-7
                py-14
                sm:px-14
                sm:py-20
                md:px-20
              "
            >

              {/* HEADER */}

              <div className="flex items-start justify-between">

                <div>

                  <p
                    className="
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.5em]
                      text-black/30
                    "
                  >
                    MEMORY UNIVERSE
                  </p>

                  <p
                    className="
                      mt-2
                      font-mono
                      text-[6px]
                      tracking-[0.3em]
                      text-black/15
                    "
                  >
                    PRIVATE CORRESPONDENCE // 0{opened.id}
                  </p>

                </div>

                <Feather
                  size={20}
                  strokeWidth={1}
                  className="rotate-[-15deg] text-black/20"
                />

              </div>

              {/* TITLE */}

              <h2
                className="
                  mt-16
                  max-w-2xl
                  font-serif
                  text-4xl
                  leading-[0.95]
                  tracking-[-0.025em]
                  sm:text-5xl
                  md:text-6xl
                "
              >
                {opened.title}
              </h2>

              <p
                className="
                  mt-5
                  font-serif
                  text-lg
                  italic
                  text-black/40
                "
              >
                {opened.subtitle}
              </p>

              {/* ORNAMENT */}

              <div className="my-14 flex items-center gap-4">

                <span className="h-px flex-1 bg-black/10" />

                <div
                  className="
                    flex
                    h-7
                    w-7
                    rotate-45
                    items-center
                    justify-center
                    border
                    border-black/10
                  "
                >
                  <span className="-rotate-45 font-serif text-xs text-black/30">
                    ✦
                  </span>
                </div>

                <span className="h-px flex-1 bg-black/10" />

              </div>

              {/* BODY */}

              <div
                className="
                  whitespace-pre-line
                  font-serif
                  text-lg
                  leading-[2]
                  text-black/65
                  sm:text-xl
                  sm:leading-[2.05]
                "
              >
                {opened.text}
              </div>

              {/* SIGNATURE */}

              <div className="mt-16">

                <span className="block h-px w-16 bg-black/15" />

                <p
                  className="
                    mt-5
                    font-serif
                    text-lg
                    italic
                    text-black/45
                  "
                >
                  {opened.signature}
                </p>

              </div>

              {/* SEAL */}

              <div className="mt-16 flex justify-end">

                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    rotate-[-8deg]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/10
                  "
                >

                  <span
                    className="
                      absolute
                      inset-2
                      rounded-full
                      border
                      border-dashed
                      border-black/10
                    "
                  />

                  <span className="font-serif text-xl text-black/25">
                    KD
                  </span>

                </div>

              </div>

            </div>
          </article>

        </div>
      )}

      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div className="mt-10 text-center md:hidden">

        <div className="flex items-center justify-center gap-2">

          <span className="h-px w-8 bg-white/[0.05]" />

          <span
            className="
              font-mono
              text-[6px]
              uppercase
              tracking-[0.4em]
              text-white/10
            "
          >
            Tap a fragment
          </span>

          <span className="h-px w-8 bg-white/[0.05]" />

        </div>

      </div>

      {/* =========================================================
          ANIMATION
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