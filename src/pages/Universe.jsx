import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Camera,
  Clock3,
  Gamepad2,
  Moon,
  Sparkles,
  Star,
} from "lucide-react";
import { birthdayData } from "../data/birthdayData";

const destinations = [
  {
    number: "01",
    title: "Memories",
    subtitle: "FRAGMENTS OF TIME",
    description: "Enter places made from moments that refused to disappear.",
    path: "/memories",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Photographs",
    subtitle: "VISUAL ARCHIVE",
    description: "Every photograph is a portal to somewhere you once existed.",
    path: "/gallery",
    icon: Camera,
  },
  {
    number: "03",
    title: "Time",
    subtitle: "PRIVATE LOG",
    description: "Turn through the pages of everything that happened.",
    path: "/journal",
    icon: Clock3,
  },
  {
    number: "04",
    title: "Memory Game",
    subtitle: "RESTORE THE ARCHIVE",
    description: "Find the hidden pairs and bring the memories back together.",
    path: "/game",
    icon: Gamepad2,
  },
];

export default function Universe() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);

    return () => clearTimeout(timer);
  }, []);

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010102] text-white">

      {/* =====================================================
          DEEP SPACE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">

        {/* Absolute black foundation */}

        <div className="absolute inset-0 bg-[#010102]" />

        {/* Primary cosmic atmosphere */}

        <div
          className="
            absolute
            left-1/2
            top-[40%]
            h-[1000px]
            w-[1000px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/[0.018]
            blur-[190px]
            animate-[cosmicBreath_12s_ease-in-out_infinite]
          "
        />

        {/* Warm memory nebula */}

        <div
          className="
            absolute
            left-[15%]
            top-[15%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-amber-200/[0.018]
            blur-[190px]
            animate-[nebulaDrift_18s_ease-in-out_infinite]
          "
        />

        {/* Violet atmosphere */}

        <div
          className="
            absolute
            -left-[280px]
            top-[25%]
            h-[750px]
            w-[750px]
            rounded-full
            bg-violet-400/[0.028]
            blur-[200px]
            animate-[floatSlow_16s_ease-in-out_infinite]
          "
        />

        {/* Cyan atmosphere */}

        <div
          className="
            absolute
            -right-[280px]
            bottom-[0%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-cyan-300/[0.022]
            blur-[200px]
            animate-[floatSlow_21s_ease-in-out_infinite_reverse]
          "
        />

        {/* Golden memory glow */}

        <div
          className="
            absolute
            left-1/2
            top-[45%]
            h-[450px]
            w-[450px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-amber-100/[0.025]
            blur-[120px]
            animate-[goldPulse_7s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            STARFIELD
        ================================================= */}

        <div className="absolute inset-0">

          {Array.from({ length: 160 }).map((_, index) => {
            const size =
              index % 19 === 0
                ? 3
                : index % 7 === 0
                ? 2
                : 1;

            return (
              <span
                key={index}
                className="
                  absolute
                  rounded-full
                  bg-white
                  animate-[starPulse_var(--duration)_ease-in-out_infinite]
                "
                style={{
                  left: `${(index * 47 + index * index * 3) % 100}%`,
                  top: `${(index * 71 + index * 13) % 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity:
                    0.05 + ((index * 17) % 70) / 100,
                  "--duration": `${2 + (index % 7)}s`,
                  animationDelay: `${(index % 15) * -0.5}s`,
                }}
              />
            );
          })}

        </div>

        {/* Larger distant stars */}

        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={`bright-${index}`}
            className="
              absolute
              h-[2px]
              w-[2px]
              rounded-full
              bg-white
              shadow-[0_0_12px_rgba(255,255,255,.8)]
              animate-[starFlicker_5s_ease-in-out_infinite]
            "
            style={{
              left: `${(index * 29 + 11) % 100}%`,
              top: `${(index * 43 + 7) % 100}%`,
              animationDelay: `${index * -0.7}s`,
            }}
          />
        ))}

        {/* =================================================
            ORBITAL SYSTEM
        ================================================= */}

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[1100px]
            w-[1100px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.018]
            animate-[spin_110s_linear_infinite]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[900px]
            w-[900px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.03]
            animate-[spin_75s_linear_infinite_reverse]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.035]
            [transform:translate(-50%,-50%)_rotateX(68deg)]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-dashed
            border-white/[0.045]
            animate-[spin_45s_linear_infinite_reverse]
          "
        />

        {/* Orbital node */}

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            animate-[spin_45s_linear_infinite]
          "
        >
          <span
            className="
              absolute
              left-1/2
              top-0
              h-1.5
              w-1.5
              rounded-full
              bg-white
              shadow-[0_0_20px_rgba(255,255,255,.9)]
            "
          />
        </div>

        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.014]
            [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)]
            [background-size:90px_90px]
            animate-[gridDrift_30s_linear_infinite]
          "
        />

        {/* Perspective horizon */}

        <div
          className="
            absolute
            bottom-[-45%]
            left-1/2
            h-[900px]
            w-[1800px]
            -translate-x-1/2
            rounded-[50%]
            border
            border-white/[0.025]
            [transform:translateX(-50%)_perspective(700px)_rotateX(68deg)]
          "
        />

        {/* Scan lines */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.012]
            [background-image:linear-gradient(to_bottom,rgba(255,255,255,.4)_1px,transparent_1px)]
            [background-size:100%_5px]
          "
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,.82)_72%,#000_100%)]
          "
        />

        {/* Cinematic top/bottom shadows */}

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 to-transparent" />

      </div>

      {/* =====================================================
          TOP SYSTEM BAR
      ===================================================== */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-0
          z-10
          border-b
          border-white/[0.06]
          bg-black/[0.08]
          backdrop-blur-xl
          transition-all
          duration-1000
          ${
            loaded
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }
        `}
      >

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">

          <div className="flex items-center gap-3">

            <div className="relative flex h-5 w-5 items-center justify-center">

              <span
                className="
                  absolute
                  inset-0
                  rotate-45
                  border
                  border-white/20
                  animate-[spin_12s_linear_infinite]
                "
              />

              <span
                className="
                  absolute
                  inset-[5px]
                  rotate-45
                  border
                  border-white/[0.08]
                "
              />

              <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_12px_white]" />

            </div>

            <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-white/35">
              Memory Universe
            </span>

          </div>

          <div className="flex items-center gap-4">

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.35em] text-white/20 sm:block">
              ARCHIVE // 001
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.35em] text-white/20 sm:block">
              SYSTEM ONLINE
            </span>

            <span className="relative flex h-2 w-2 items-center justify-center">

              <span className="absolute h-2 w-2 animate-ping rounded-full bg-white/30" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_white]" />

            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative flex min-h-[100svh] items-center justify-center px-5 pb-32 pt-28 sm:px-8">

        <div className="relative w-full max-w-7xl">

          {/* Side archive */}

          <div
            className={`
              absolute
              -left-2
              top-1/2
              hidden
              -translate-y-1/2
              xl:block
              transition-all
              duration-1000
              delay-300
              ${
                loaded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-5 opacity-0"
              }
            `}
          >

            <div className="flex flex-col gap-8">

              <div>

                <p className="font-mono text-[6px] tracking-[0.35em] text-white/15">
                  ARCHIVE
                </p>

                <p className="mt-2 font-mono text-[9px] tracking-[0.3em] text-white/45">
                  001
                </p>

              </div>

              <div className="relative h-20 w-px overflow-hidden bg-gradient-to-b from-white/30 to-transparent">

                <span className="absolute left-0 top-0 h-8 w-px animate-[verticalSignal_3s_ease-in-out_infinite] bg-white" />

              </div>

              <div className="writing-mode-vertical font-mono text-[6px] tracking-[0.4em] text-white/15">
                EVERYTHING REMEMBERED
              </div>

            </div>

          </div>

          {/* Center */}

          <div className="relative z-10 mx-auto max-w-5xl text-center">

            {/* CORE */}

            <div
              className={`
                mb-9
                flex
                justify-center
                transition-all
                duration-[1400ms]
                ${
                  loaded
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-8 scale-75 opacity-0"
                }
              `}
            >

              <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">

                {/* Outer orbit */}

                <span
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-white/[0.08]
                    shadow-[0_0_60px_rgba(255,255,255,.025)]
                    animate-[spin_25s_linear_infinite]
                  "
                />

                {/* Outer orbit marker */}

                <span
                  className="
                    absolute
                    left-1/2
                    top-[-3px]
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-white
                    shadow-[0_0_15px_white]
                  "
                />

                {/* Square */}

                <span
                  className="
                    absolute
                    inset-5
                    rotate-45
                    border
                    border-white/[0.1]
                    animate-[spin_18s_linear_infinite_reverse]
                  "
                />

                {/* Inner square */}

                <span
                  className="
                    absolute
                    inset-8
                    rotate-45
                    border
                    border-white/[0.04]
                  "
                />

                {/* Inner orbit */}

                <span
                  className="
                    absolute
                    inset-[35%]
                    rounded-full
                    border
                    border-dashed
                    border-white/20
                    animate-[spin_10s_linear_infinite]
                  "
                />

                {/* Core glow */}

                <span
                  className="
                    absolute
                    h-8
                    w-8
                    rounded-full
                    bg-white/[0.12]
                    blur-[14px]
                    animate-[coreGlow_3s_ease-in-out_infinite]
                  "
                />

                <span
                  className="
                    absolute
                    h-3
                    w-3
                    rounded-full
                    bg-white
                    blur-[3px]
                    animate-pulse
                  "
                />

                <Star
                  size={24}
                  strokeWidth={1}
                  className="relative text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,.6)]"
                />

              </div>

            </div>

            {/* Label */}

            <div
              className={`
                flex
                items-center
                justify-center
                gap-4
                transition-all
                duration-1000
                delay-300
                ${
                  loaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }
              `}
            >

              <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-white/30" />

              <p className="font-mono text-[7px] uppercase tracking-[0.65em] text-white/35">
                Personal Memory Archive
              </p>

              <span className="h-px w-10 bg-gradient-to-l from-transparent via-white/20 to-white/30" />

            </div>

            {/* NAME */}

            <h1
              className={`
                relative
                mt-9
                font-display
                text-[clamp(4rem,13vw,11rem)]
                font-light
                leading-[0.78]
                tracking-[-0.07em]
                transition-all
                duration-[1500ms]
                delay-500
                ${
                  loaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }
              `}
            >

              {/* Ghost glow */}

              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  text-white/[0.035]
                  blur-[20px]
                "
              >
                {birthdayData.name}
              </span>

              <span className="relative">
                {birthdayData.name}
              </span>

            </h1>

            {/* Description */}

            <p
              className={`
                mx-auto
                mt-10
                max-w-2xl
                font-serif
                text-lg
                leading-[1.8]
                text-white/40
                transition-all
                duration-1000
                delay-700
                sm:text-xl
                md:text-2xl
                ${
                  loaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }
              `}
            >
              A universe built from photographs,
              little moments, forgotten thoughts,
              and everything that was too beautiful
              to let disappear.
            </p>

            {/* CTA */}

            <div
              className={`
                mt-12
                transition-all
                duration-1000
                delay-[900ms]
                ${
                  loaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }
              `}
            >

              <button
                onClick={() => goTo("/memories")}
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  gap-5
                  overflow-hidden
                  rounded-full
                  border
                  border-white/[0.13]
                  bg-white/[0.025]
                  px-7
                  py-4
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[0.35em]
                  text-white/55
                  shadow-[0_0_0_1px_rgba(255,255,255,.01),0_15px_50px_rgba(0,0,0,.3)]
                  backdrop-blur-md
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:border-white/40
                  hover:bg-white
                  hover:text-black
                  hover:shadow-[0_0_60px_rgba(255,255,255,.15)]
                "
              >

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <span className="relative">
                  Begin Exploring
                </span>

                <ArrowDown
                  size={13}
                  className="relative transition-transform duration-500 group-hover:translate-y-1"
                />

              </button>

            </div>

          </div>

          {/* Right status */}

          <div
            className={`
              absolute
              right-0
              top-1/2
              hidden
              -translate-y-1/2
              xl:block
              transition-all
              duration-1000
              delay-300
              ${
                loaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-5 opacity-0"
              }
            `}
          >

            <div className="text-right">

              <p className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
                Coordinates
              </p>

              <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/40">
                08.18.2026
              </p>

              <div className="relative ml-auto mt-5 h-20 w-px overflow-hidden bg-gradient-to-b from-transparent via-white/30 to-transparent">

                <span className="absolute left-0 top-0 h-6 w-px animate-[verticalSignal_2.5s_ease-in-out_infinite] bg-white" />

              </div>

              <div className="mt-5 flex items-center justify-end gap-2">

                <span className="font-mono text-[6px] tracking-[0.3em] text-white/15">
                  SIGNAL
                </span>

                <span className="relative flex h-2 w-2 items-center justify-center">

                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-white/20" />

                  <span className="relative h-1 w-1 rounded-full bg-white" />

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Scroll indicator */}

        <button
          onClick={() =>
            document
              .getElementById("destinations")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
          className="
            group
            absolute
            bottom-10
            left-1/2
            flex
            -translate-x-1/2
            flex-col
            items-center
            gap-3
            text-white/20
            transition-all
            hover:translate-y-1
            hover:text-white/60
          "
        >

          <span className="font-mono text-[6px] uppercase tracking-[0.4em]">
            Enter Archive
          </span>

          <div className="relative h-10 w-px overflow-hidden bg-white/[0.1]">

            <span className="absolute left-0 top-0 h-4 w-px animate-[scrollSignal_2s_ease-in-out_infinite] bg-gradient-to-b from-white to-transparent" />

          </div>

        </button>

      </section>

      {/* =====================================================
          DESTINATION ARCHIVE
      ===================================================== */}

      <section
        id="destinations"
        className="relative mx-auto max-w-7xl px-5 pb-44 sm:px-8"
      >

        {/* Section header */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="font-mono text-[7px] uppercase tracking-[0.5em] text-white/20">
              Choose A Destination
            </p>

            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-6xl">
              Where to next?
            </h2>

          </div>

          <p className="hidden max-w-[180px] text-right font-mono text-[6px] leading-relaxed tracking-[0.2em] text-white/20 md:block">
            EVERY DESTINATION CONTAINS A DIFFERENT VERSION OF TIME.
          </p>

        </div>

        {/* Destination grid */}

        <div
          className="
            grid
            grid-cols-1
            gap-px
            overflow-hidden
            border
            border-white/[0.08]
            bg-white/[0.08]
            md:grid-cols-2
          "
        >

          {destinations.map((destination, index) => {
            const Icon = destination.icon;
            const isActive = active === index;

            return (
              <button
                key={destination.path}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => goTo(destination.path)}
                className="
                  group
                  relative
                  min-h-[330px]
                  overflow-hidden
                  bg-[#030304]
                  p-7
                  text-left
                  transition-all
                  duration-700
                  hover:bg-white/[0.035]
                  sm:p-10
                "
              >

                {/* Ambient glow */}

                <div
                  className={`
                    absolute
                    -right-24
                    -top-24
                    h-72
                    w-72
                    rounded-full
                    bg-white/[0.045]
                    blur-[100px]
                    transition-all
                    duration-1000
                    ${
                      isActive
                        ? "scale-125 opacity-100"
                        : "scale-75 opacity-0"
                    }
                  `}
                />

                {/* Secondary glow */}

                <div
                  className={`
                    absolute
                    bottom-[-120px]
                    left-[-100px]
                    h-72
                    w-72
                    rounded-full
                    bg-violet-300/[0.025]
                    blur-[100px]
                    transition-all
                    duration-1000
                    ${
                      isActive
                        ? "scale-125 opacity-100"
                        : "scale-75 opacity-0"
                    }
                  `}
                />

                {/* Number */}

                <span
                  className="
                    absolute
                    right-7
                    top-7
                    font-mono
                    text-[7px]
                    tracking-[0.3em]
                    text-white/15
                    transition
                    duration-500
                    group-hover:text-white/50
                    sm:right-10
                    sm:top-10
                  "
                >
                  {destination.number}
                </span>

                {/* Top line */}

                <span
                  className="
                    absolute
                    left-0
                    right-0
                    top-0
                    h-px
                    origin-left
                    scale-x-0
                    bg-gradient-to-r
                    from-white
                    via-white/50
                    to-transparent
                    transition-transform
                    duration-700
                    group-hover:scale-x-100
                  "
                />

                {/* Side line */}

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    top-0
                    w-px
                    origin-bottom
                    scale-y-0
                    bg-gradient-to-t
                    from-transparent
                    via-white/40
                    to-transparent
                    transition-transform
                    duration-700
                    group-hover:scale-y-100
                  "
                />

                {/* Icon */}

                <div
                  className="
                    relative
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    border
                    border-white/[0.08]
                    bg-white/[0.02]
                    text-white/35
                    shadow-[inset_0_0_20px_rgba(255,255,255,.01)]
                    transition-all
                    duration-500
                    group-hover:-translate-y-1
                    group-hover:rotate-[-3deg]
                    group-hover:border-white/40
                    group-hover:bg-white
                    group-hover:text-black
                    group-hover:shadow-[0_0_45px_rgba(255,255,255,.16)]
                  "
                >

                  <Icon size={17} strokeWidth={1.3} />

                </div>

                {/* Content */}

                <div className="absolute bottom-8 left-7 right-7 sm:bottom-10 sm:left-10 sm:right-10">

                  <p className="font-mono text-[6px] uppercase tracking-[0.4em] text-white/20 transition duration-500 group-hover:text-white/45">
                    {destination.subtitle}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-4">

                    <h3 className="font-display text-4xl tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-1 sm:text-5xl">
                      {destination.title}
                    </h3>

                    <ArrowUpRight
                      size={18}
                      strokeWidth={1}
                      className="
                        mb-2
                        shrink-0
                        text-white/20
                        transition-all
                        duration-500
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        group-hover:text-white
                      "
                    />

                  </div>

                  <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-white/30 transition duration-500 group-hover:text-white/50">
                    {destination.description}
                  </p>

                </div>

                {/* Corner detail */}

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-8
                    w-8
                    border-l
                    border-t
                    border-white/[0.08]
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:h-12
                    group-hover:w-12
                    group-hover:border-white/30
                    group-hover:opacity-100
                  "
                />

                <span
                  className="
                    absolute
                    right-0
                    top-0
                    h-8
                    w-8
                    border-r
                    border-t
                    border-white/[0.05]
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:h-12
                    group-hover:w-12
                    group-hover:border-white/20
                    group-hover:opacity-100
                  "
                />

              </button>
            );
          })}

        </div>

        {/* Bottom system */}

        <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">

          <div className="flex items-center gap-3">

            <Moon
              size={11}
              strokeWidth={1}
              className="text-white/20"
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/20">
              Memory system active
            </span>

          </div>

          <span className="font-mono text-[6px] tracking-[0.3em] text-white/15">
            04 DESTINATIONS
          </span>

        </div>

      </section>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(50px, -40px, 0);
          }
        }

        @keyframes cosmicBreath {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              scale(.9);
            opacity: .65;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.08);
            opacity: 1;
          }
        }

        @keyframes nebulaDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(.9);
          }

          50% {
            transform: translate3d(70px, -40px, 0) scale(1.1);
          }
        }

        @keyframes goldPulse {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              scale(.75);
            opacity: .2;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.2);
            opacity: .65;
          }
        }

        @keyframes starPulse {
          0%,
          100% {
            transform: scale(.65);
            opacity: .15;
          }

          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        @keyframes starFlicker {
          0%,
          100% {
            transform: scale(.5);
            opacity: .15;
          }

          20% {
            opacity: .8;
          }

          35% {
            transform: scale(1.8);
            opacity: 1;
          }

          55% {
            opacity: .2;
          }
        }

        @keyframes coreGlow {
          0%,
          100% {
            transform: scale(.7);
            opacity: .35;
          }

          50% {
            transform: scale(1.5);
            opacity: .8;
          }
        }

        @keyframes gridDrift {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(90px, 90px, 0);
          }
        }

        @keyframes verticalSignal {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          70% {
            opacity: .8;
          }

          100% {
            transform: translateY(100px);
            opacity: 0;
          }
        }

        @keyframes scrollSignal {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translateY(45px);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

      `}</style>

    </main>
  );
}