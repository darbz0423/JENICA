import { useEffect, useState } from "react";
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

export default function Letters() {
  const [opened, setOpened] = useState(null);
  const [activeCard, setActiveCard] = useState(0);

  const letters = birthdayData.letters || [];

  // Lock body scroll while a letter is open.
  useEffect(() => {
    if (!opened) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened]);

  // Keyboard support.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpened(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openLetter = (letter, index) => {
    setActiveCard(index);
    setOpened(letter);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] px-4 pb-32 pt-24 text-white sm:px-6 sm:pt-28 md:px-10 md:pb-40 md:pt-32">

      {/* =========================================================
          PERFORMANCE-FRIENDLY BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        {/* Base */}

        <div className="absolute inset-0 bg-[#030303]" />

        {/* Soft central atmosphere */}

        <div
          className="
            absolute
            left-1/2
            top-[32%]
            h-[420px]
            w-[420px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.018]
            blur-[90px]
          "
        />

        {/* Warm glow */}

        <div
          className="
            absolute
            -right-40
            top-[48%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-amber-200/[0.018]
            blur-[90px]
          "
        />

        {/* Violet glow */}

        <div
          className="
            absolute
            -left-40
            top-[20%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-violet-300/[0.015]
            blur-[90px]
          "
        />

        {/* Fine vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_35%,transparent_20%,rgba(0,0,0,.7)_100%)]
          "
        />

        {/* Subtle film texture */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px)]
            [background-size:100%_6px]
          "
        />
      </div>

      {/* =========================================================
          TOP NAV / ARCHIVE LABEL
      ========================================================= */}

      <div className="mx-auto flex max-w-7xl items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.09]
              bg-white/[0.025]
            "
          >
            <Mail
              size={13}
              strokeWidth={1}
              className="text-white/45"
            />
          </div>

          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.45em] text-white/25">
              MEMORY UNIVERSE
            </p>

            <p className="mt-1 font-mono text-[5px] tracking-[0.3em] text-white/10">
              PRIVATE ARCHIVE
            </p>
          </div>

        </div>

        <div className="hidden items-center gap-3 sm:flex">

          <span className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/15">
            CORRESPONDENCE
          </span>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <span className="font-mono text-[5px] tracking-[0.3em] text-white/10">
            {String(letters.length).padStart(2, "0")} FRAGMENTS
          </span>

        </div>

      </div>

      {/* =========================================================
          HERO
      ========================================================= */}

      <header className="relative mx-auto max-w-5xl pt-16 text-center sm:pt-20 md:pt-24">

        {/* Small orbital mark */}

        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center">

          <div className="relative flex h-10 w-10 items-center justify-center">

            <span
              className="
                absolute
                inset-0
                rotate-45
                border
                border-white/[0.12]
              "
            />

            <span
              className="
                absolute
                -inset-2
                rounded-full
                border
                border-dashed
                border-white/[0.06]
              "
            />

            <Feather
              size={15}
              strokeWidth={1}
              className="relative rotate-[-12deg] text-white/45"
            />

          </div>

        </div>

        {/* Eyebrow */}

        <div className="flex items-center justify-center gap-3">

          <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20 sm:w-14" />

          <span className="font-mono text-[6px] uppercase tracking-[0.55em] text-white/25">
            LETTERS FROM THE HEART
          </span>

          <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20 sm:w-14" />

        </div>

        {/* Main title */}

        <h1
          className="
            mt-8
            font-display
            text-[4.6rem]
            leading-[0.76]
            tracking-[-0.065em]
            text-white
            sm:text-8xl
            md:text-[9.5rem]
          "
        >
          Words
          <br />

          <span className="text-white/20">
            for you.
          </span>
        </h1>

        {/* Subtitle */}

        <p
          className="
            mx-auto
            mt-9
            max-w-md
            px-3
            font-serif
            text-[15px]
            leading-[1.9]
            text-white/35
            sm:text-lg
          "
        >
          Three little pieces of my heart,
          <br />
          written for the person who means so much to me.
        </p>

        {/* Archive status */}

        <div className="mt-8 flex items-center justify-center gap-3">

          <span className="h-1 w-1 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,.5)]" />

          <span className="font-mono text-[5px] uppercase tracking-[0.5em] text-white/15">
            SEALED WITH LOVE
          </span>

          <Heart
            size={8}
            fill="currentColor"
            className="text-white/20"
          />

        </div>

      </header>

      {/* =========================================================
          LETTER CARDS
      ========================================================= */}

      <section className="relative mx-auto mt-16 max-w-7xl sm:mt-20 md:mt-28">

        {/* Desktop constellation */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025] md:block" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.018] md:block" />

        {/* Cards */}

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">

          {letters.map((letter, index) => {

            const isActive = activeCard === index;

            return (
              <article
                key={letter.id}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[22px]
                  border
                  bg-[#080808]
                  transition-transform
                  duration-500
                  ${
                    isActive
                      ? "border-white/[0.15]"
                      : "border-white/[0.07]"
                  }
                `}
              >

                {/* =================================================
                    CARD TOP LIGHT
                ================================================= */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-6
                    right-6
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-white/30
                    to-transparent
                    opacity-50
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* =================================================
                    INNER ATMOSPHERE
                ================================================= */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-[-80px]
                    top-[-80px]
                    h-40
                    w-40
                    rounded-full
                    bg-white/[0.025]
                    blur-[45px]
                  "
                />

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="relative flex min-h-[430px] flex-col p-6 sm:p-7">

                  {/* Header row */}

                  <div className="flex items-start justify-between">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-[14px]
                        border
                        border-white/[0.09]
                        bg-white/[0.025]
                        transition-all
                        duration-500
                        group-hover:border-white/[0.18]
                        group-hover:bg-white/[0.06]
                      "
                    >
                      <Mail
                        size={15}
                        strokeWidth={1}
                        className="text-white/40"
                      />
                    </div>

                    <div className="text-right">

                      <span className="font-mono text-[6px] tracking-[0.3em] text-white/10">
                        ARCHIVE
                      </span>

                      <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-white/25">
                        0{index + 1}
                      </p>

                    </div>

                  </div>

                  {/* Status */}

                  <div className="mt-10 flex items-center gap-2">

                    <span className="h-1 w-1 rounded-full bg-white/40" />

                    <span className="font-mono text-[6px] uppercase tracking-[0.4em] text-white/20">
                      PRIVATE LETTER
                    </span>

                  </div>

                  {/* Title */}

                  <h2
                    className="
                      mt-5
                      max-w-[270px]
                      font-serif
                      text-[2rem]
                      leading-[0.98]
                      tracking-[-0.025em]
                      text-white/85
                      transition-colors
                      duration-500
                      group-hover:text-white
                      sm:text-[2.2rem]
                    "
                  >
                    {letter.title}
                  </h2>

                  {/* Subtitle */}

                  <p
                    className="
                      mt-5
                      max-w-[260px]
                      font-serif
                      text-sm
                      italic
                      leading-[1.7]
                      text-white/25
                      transition-colors
                      duration-500
                      group-hover:text-white/45
                    "
                  >
                    {letter.subtitle}
                  </p>

                  {/* Decorative quote */}

                  <div className="mt-auto">

                    <div className="mb-6 flex items-center gap-3">

                      <span className="h-px w-10 bg-white/[0.08]" />

                      <Sparkles
                        size={9}
                        strokeWidth={1}
                        className="text-white/20"
                      />

                      <span className="h-px flex-1 bg-white/[0.05]" />

                    </div>

                    {/* CTA */}

                    <button
                      type="button"
                      onClick={() => openLetter(letter, index)}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-white/[0.025]
                        px-4
                        py-3.5
                        text-left
                        transition-all
                        duration-300
                        hover:border-white/[0.2]
                        hover:bg-white/[0.06]
                        active:scale-[0.98]
                      "
                    >

                      <span className="flex items-center gap-2.5">

                        <Lock
                          size={10}
                          strokeWidth={1}
                          className="text-white/25"
                        />

                        <span className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/35">
                          Open this letter
                        </span>

                      </span>

                      <ArrowUpRight
                        size={13}
                        strokeWidth={1}
                        className="
                          text-white/25
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                        "
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
          BETWEEN SECTION
      ========================================================= */}

      <div className="mx-auto mt-16 flex max-w-5xl items-center justify-center gap-4 sm:mt-20">

        <span className="h-px flex-1 bg-white/[0.05]" />

        <div className="text-center">

          <Heart
            size={11}
            fill="currentColor"
            className="mx-auto text-white/20"
          />

          <p className="mt-3 font-mono text-[5px] uppercase tracking-[0.5em] text-white/10">
            Written only for you
          </p>

        </div>

        <span className="h-px flex-1 bg-white/[0.05]" />

      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="mx-auto mt-12 max-w-xl text-center sm:mt-16">

        <p className="font-serif text-sm italic leading-[1.8] text-white/20 sm:text-base">
          Some words are meant to be read once.
          <br />
          Some are meant to be kept forever.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">

          <span className="h-px w-8 bg-white/[0.06]" />

          <span className="font-mono text-[5px] tracking-[0.45em] text-white/10">
            MEMORY ARCHIVE // LOVE
          </span>

          <span className="h-px w-8 bg-white/[0.06]" />

        </div>

      </footer>

      {/* =========================================================
          LETTER MODAL
      ========================================================= */}

      {opened && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            overflow-y-auto
            bg-[#010101]/95
            px-3
            py-5
            sm:px-5
            sm:py-8
          "
          onClick={() => setOpened(null)}
        >

          {/* =====================================================
              MODAL BACKGROUND
          ===================================================== */}

          <div className="pointer-events-none fixed inset-0">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.045),transparent_45%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.15),rgba(0,0,0,.8))]" />

          </div>

          {/* =====================================================
              CLOSE BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={() => setOpened(null)}
            aria-label="Close letter"
            className="
              fixed
              right-4
              top-4
              z-[120]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.12]
              bg-black/70
              text-white/45
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-white/30
              hover:bg-white
              hover:text-black
              active:scale-90
              sm:right-7
              sm:top-7
            "
          >
            <X
              size={15}
              strokeWidth={1.2}
            />
          </button>

          {/* =====================================================
              MODAL COUNTER
          ===================================================== */}

          <div className="fixed left-4 top-5 z-[120] sm:left-7 sm:top-7">

            <p className="font-mono text-[5px] uppercase tracking-[0.4em] text-white/20">
              LOVE ARCHIVE
            </p>

            <p className="mt-1 font-mono text-[6px] tracking-[0.25em] text-white/10">
              LETTER 0{opened.id} / 0{letters.length}
            </p>

          </div>

          {/* =====================================================
              PAPER
          ===================================================== */}

          <article
            onClick={(event) => event.stopPropagation()}
            className="
              relative
              mx-auto
              my-14
              max-w-3xl
              overflow-hidden
              rounded-[2px]
              bg-[#eee7d9]
              text-[#171512]
              shadow-[0_30px_100px_rgba(0,0,0,.8)]
              sm:my-20
              sm:rounded-[3px]
            "
          >

            {/* =================================================
                PAPER EDGE
            ================================================= */}

            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            {/* =================================================
                PAPER GRAIN
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.045]
                [background-image:radial-gradient(#000_0.5px,transparent_0.5px)]
                [background-size:6px_6px]
              "
            />

            {/* =================================================
                PAPER LIGHT
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,.55),transparent_45%)]
              "
            />

            {/* =================================================
                PAPER CONTENT
            ================================================= */}

            <div
              className="
                relative
                px-6
                py-12
                sm:px-12
                sm:py-16
                md:px-20
                md:py-20
              "
            >

              {/* =================================================
                  LETTER HEADER
              ================================================= */}

              <div className="flex items-start justify-between gap-6">

                <div>

                  <div className="flex items-center gap-2">

                    <Heart
                      size={9}
                      fill="currentColor"
                      className="text-black/25"
                    />

                    <p className="font-mono text-[6px] uppercase tracking-[0.5em] text-black/30">
                      PRIVATE CORRESPONDENCE
                    </p>

                  </div>

                  <p className="mt-2 font-mono text-[5px] uppercase tracking-[0.35em] text-black/15">
                    MEMORY UNIVERSE // LETTER 0{opened.id}
                  </p>

                </div>

                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">

                  <span className="absolute inset-0 rotate-45 border border-black/[0.09]" />

                  <Feather
                    size={15}
                    strokeWidth={1}
                    className="rotate-[-15deg] text-black/25"
                  />

                </div>

              </div>

              {/* =================================================
                  DATE / PERSONAL NOTE
              ================================================= */}

              <div className="mt-12 flex items-center gap-3">

                <span className="h-px w-8 bg-black/10" />

                <span className="font-mono text-[6px] uppercase tracking-[0.35em] text-black/20">
                  Written from the heart
                </span>

              </div>

              {/* =================================================
                  TITLE
              ================================================= */}

              <h2
                className="
                  mt-8
                  max-w-2xl
                  font-serif
                  text-[2.7rem]
                  leading-[0.92]
                  tracking-[-0.035em]
                  sm:text-5xl
                  md:text-6xl
                "
              >
                {opened.title}
              </h2>

              {/* Subtitle */}

              <p
                className="
                  mt-5
                  max-w-xl
                  font-serif
                  text-base
                  italic
                  leading-[1.7]
                  text-black/40
                  sm:text-lg
                "
              >
                {opened.subtitle}
              </p>

              {/* =================================================
                  ORNAMENT
              ================================================= */}

              <div className="my-12 flex items-center gap-4 sm:my-14">

                <span className="h-px flex-1 bg-black/10" />

                <div className="relative flex h-7 w-7 items-center justify-center">

                  <span className="absolute inset-0 rotate-45 border border-black/10" />

                  <Heart
                    size={9}
                    fill="currentColor"
                    className="relative text-black/25"
                  />

                </div>

                <span className="h-px flex-1 bg-black/10" />

              </div>

              {/* =================================================
                  LETTER BODY
              ================================================= */}

              <div
                className="
                  whitespace-pre-line
                  font-serif
                  text-[17px]
                  leading-[2]
                  tracking-[0.005em]
                  text-black/65
                  sm:text-[19px]
                  sm:leading-[2.05]
                  md:text-xl
                "
              >
                {opened.text}
              </div>

              {/* =================================================
                  FINAL ORNAMENT
              ================================================= */}

              <div className="mt-16 flex items-center gap-4">

                <span className="h-px w-10 bg-black/10" />

                <Sparkles
                  size={10}
                  strokeWidth={1}
                  className="text-black/20"
                />

                <span className="h-px flex-1 bg-black/10" />

              </div>

              {/* =================================================
                  SIGNATURE
              ================================================= */}

              <div className="mt-10">

                <p className="font-serif text-sm italic text-black/30">
                  With all the love that words can hold,
                </p>

                <p className="mt-4 font-serif text-xl italic text-black/55 sm:text-2xl">
                  {opened.signature}
                </p>

              </div>

              {/* =================================================
                  KD WATERMARK
              ================================================= */}

              <div className="mt-14 flex justify-end">

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

                  <span className="font-serif text-xl italic tracking-[-0.05em] text-black/25">
                    KD
                  </span>

                </div>

              </div>

            </div>

          </article>

        </div>
      )}

      {/* =========================================================
          MOBILE HINT
      ========================================================= */}

      <div className="mt-12 flex items-center justify-center gap-3 md:hidden">

        <span className="h-px w-8 bg-white/[0.05]" />

        <span className="font-mono text-[5px] uppercase tracking-[0.45em] text-white/10">
          Tap a letter to open
        </span>

        <span className="h-px w-8 bg-white/[0.05]" />

      </div>

    </main>
  );
}