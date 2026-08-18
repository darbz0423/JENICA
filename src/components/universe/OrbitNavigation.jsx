import {
  ArrowUpRight,
  BookOpen,
  CircleDot,
  FileText,
  Gift,
  Images,
  Moon,
  Star,
  Gamepad2,
} from "lucide-react";
import { useEffect, useState } from "react";

const destinations = [
  {
    path: "/universe",
    label: "Orbit",
    code: "01",
    description: "THE CENTER",
    icon: CircleDot,
  },
  {
    path: "/memories",
    label: "Memories",
    code: "02",
    description: "FRAGMENTS",
    icon: Star,
  },
  {
    path: "/gallery",
    label: "Gallery",
    code: "03",
    description: "VISUAL ARCHIVE",
    icon: Images,
  },
  {
    path: "/letters",
    label: "Letters",
    code: "04",
    description: "WORDS LEFT BEHIND",
    icon: FileText,
  },
  {
    path: "/journal",
    label: "Journal",
    code: "05",
    description: "PRIVATE LOG",
    icon: BookOpen,
  },
  {
    path: "/wish",
    label: "Wish",
    code: "06",
    description: "MAKE A WISH",
    icon: Moon,
  },
  {
    path: "/memorygame",
    label: "Memory Game",
    code: "07",
    description: "PLAY THE MEMORY",
    icon: Gamepad2,
  },
  {
    path: "/celebration",
    label: "Celebrate",
    code: "08",
    description: "THE MOMENT",
    icon: Gift,
  },
];

export default function OrbitNavigation({
  navigate,
  open,
  setOpen,
}) {
  const [pressed, setPressed] = useState(null);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [setOpen]);

  const handleNavigate = (path, index) => {
    setPressed(index);

    setTimeout(() => {
      navigate(path);
      setOpen(false);
      setPressed(null);
    }, 220);
  };

  return (
    <>
      {/* =====================================================
          ATMOSPHERIC BACKDROP
      ===================================================== */}

      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-[80]
          bg-black/55
          backdrop-blur-[3px]
          transition-all duration-500
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-20px)] max-w-[350px] -translate-x-1/2 sm:bottom-6">

        {/* ===================================================
            MENU PANEL
        =================================================== */}

        <div
          className={`
            absolute
            bottom-[calc(100%+10px)]
            left-1/2
            w-full
            -translate-x-1/2
            origin-bottom
            transition-all
            duration-500
            ease-[cubic-bezier(.16,1,.3,1)]
            ${
              open
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-4 scale-[0.96] opacity-0"
            }
          `}
        >

          {/* OUTER GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-8
              bg-white/[0.025]
              blur-3xl
            "
          />

          {/* =================================================
              PANEL
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[15px]
              border border-white/[0.12]
              bg-[#030303]/95
              shadow-[0_25px_90px_rgba(0,0,0,.9)]
              backdrop-blur-2xl
            "
          >

            {/* TOP ENERGY LINE */}

            <div
              className="
                absolute
                left-6
                right-6
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/60
                to-transparent
              "
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                flex
                h-10
                items-center
                justify-between
                border-b border-white/[0.07]
                px-3
              "
            >

              <div className="flex items-center gap-2.5">

                {/* CORE */}

                <div className="relative h-5 w-5">

                  <span
                    className="
                      absolute
                      inset-0
                      rotate-45
                      border border-white/20
                    "
                  />

                  <span
                    className="
                      absolute
                      inset-[6px]
                      rotate-45
                      border border-white/10
                    "
                  />

                  <span
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      h-1
                      w-1
                      -translate-x-1/2
                      -translate-y-1/2
                      bg-white
                      shadow-[0_0_12px_white]
                    "
                  />

                </div>

                <div>

                  <div
                    className="
                      font-mono
                      text-[6px]
                      uppercase
                      tracking-[0.45em]
                      text-white/70
                    "
                  >
                    Memory Map
                  </div>

                  <div
                    className="
                      mt-0.5
                      font-mono
                      text-[4px]
                      tracking-[0.3em]
                      text-white/20
                    "
                  >
                    EIGHT DESTINATIONS
                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className="flex items-center gap-1.5">

                <span
                  className="
                    hidden
                    font-mono
                    text-[4px]
                    tracking-[0.3em]
                    text-white/20
                    sm:block
                  "
                >
                  ONLINE
                </span>

                <span
                  className="
                    h-1
                    w-1
                    animate-pulse
                    rounded-full
                    bg-white
                    shadow-[0_0_8px_white]
                  "
                />

              </div>

            </div>

            {/* =================================================
                PERFECT 4 × 2 GRID
            ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-px
                bg-white/[0.045]
                p-px
                sm:grid-cols-4
              "
            >

              {destinations.map((destination, index) => {
                const Icon = destination.icon;

                const isPressed = pressed === index;

                return (
                  <button
                    key={destination.path}
                    onClick={() =>
                      handleNavigate(
                        destination.path,
                        index
                      )
                    }
                    className={`
                      group
                      relative
                      flex
                      h-[64px]
                      flex-col
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[#050505]
                      px-2
                      transition-all
                      duration-300

                      sm:h-[62px]

                      active:scale-[0.96]

                      ${
                        isPressed
                          ? "bg-white text-black"
                          : ""
                      }
                    `}
                  >

                    {/* =================================================
                        MOBILE TOUCH FLASH
                    ================================================= */}

                    <span
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        bg-white
                        transition-opacity
                        duration-200
                        ${
                          isPressed
                            ? "opacity-100"
                            : "opacity-0"
                        }
                      `}
                    />

                    {/* =================================================
                        DESKTOP HOVER GLOW
                    ================================================= */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        hidden
                        bg-gradient-to-br
                        from-white/[0.12]
                        via-white/[0.035]
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                        sm:block
                      "
                    />

                    {/* =================================================
                        DESKTOP SCAN
                    ================================================= */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-0
                        hidden
                        h-px
                        w-full
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/80
                        to-transparent
                        transition-transform
                        duration-500
                        group-hover:translate-x-full
                        sm:block
                      "
                    />

                    {/* =================================================
                        ACTIVE SIDE LIGHT
                    ================================================= */}

                    <span
                      className={`
                        absolute
                        bottom-0
                        left-0
                        top-0
                        w-px
                        bg-white
                        shadow-[0_0_12px_white]
                        transition-transform
                        duration-300

                        ${
                          isPressed
                            ? "scale-y-100"
                            : "scale-y-0"
                        }

                        sm:group-hover:scale-y-100
                      `}
                    />

                    {/* =================================================
                        NUMBER
                    ================================================= */}

                    <span
                      className={`
                        absolute
                        right-1.5
                        top-1.5
                        font-mono
                        text-[4px]
                        tracking-[0.15em]
                        transition-colors
                        duration-300

                        ${
                          isPressed
                            ? "text-black/40"
                            : "text-white/15"
                        }

                        sm:text-white/10
                        sm:group-hover:text-white/60
                      `}
                    >
                      {destination.code}
                    </span>

                    {/* =================================================
                        ICON
                    ================================================= */}

                    <span
                      className={`
                        relative
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-[5px]
                        border
                        transition-all
                        duration-300

                        ${
                          isPressed
                            ? "border-black/20 bg-black text-white"
                            : "border-white/[0.1] text-white/45"
                        }

                        sm:group-hover:-translate-y-0.5
                        sm:group-hover:border-white/50
                        sm:group-hover:bg-white
                        sm:group-hover:text-black
                        sm:group-hover:shadow-[0_0_18px_rgba(255,255,255,.2)]
                      `}
                    >

                      <Icon
                        size={11}
                        strokeWidth={1.5}
                      />

                    </span>

                    {/* =================================================
                        LABEL
                    ================================================= */}

                    <span
                      className={`
                        relative
                        mt-1.5
                        font-mono
                        text-[5px]
                        uppercase
                        tracking-[0.2em]
                        transition-all
                        duration-300

                        ${
                          isPressed
                            ? "text-black"
                            : "text-white/50"
                        }

                        sm:group-hover:text-white
                      `}
                    >
                      {destination.label}
                    </span>

                    {/* =================================================
                        DESKTOP ARROW
                    ================================================= */}

                    <ArrowUpRight
                      size={7}
                      strokeWidth={1}
                      className="
                        absolute
                        bottom-1.5
                        right-1.5
                        hidden
                        text-white/10
                        transition-all
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:text-white/70
                        sm:block
                      "
                    />

                    {/* =================================================
                        MOBILE CORNER
                    ================================================= */}

                    <span
                      className={`
                        absolute
                        bottom-0
                        right-0
                        h-2.5
                        w-2.5
                        border-b
                        border-r
                        transition-all
                        duration-300

                        ${
                          isPressed
                            ? "border-black/30"
                            : "border-white/[0.08]"
                        }

                        sm:group-hover:border-white/40
                      `}
                    />

                  </button>
                );
              })}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                flex
                h-6
                items-center
                justify-between
                border-t border-white/[0.07]
                px-3
              "
            >

              <div className="flex items-center gap-1.5">

                <span
                  className="
                    h-1
                    w-1
                    animate-pulse
                    rounded-full
                    bg-white/60
                  "
                />

                <span
                  className="
                    font-mono
                    text-[4px]
                    tracking-[0.25em]
                    text-white/15
                  "
                >
                  MEMORY SYSTEM ONLINE
                </span>

              </div>

              <span
                className="
                  font-mono
                  text-[4px]
                  tracking-[0.2em]
                  text-white/10
                "
              >
                08
              </span>

            </div>

          </div>
        </div>

        {/* =====================================================
            COMPACT DOCK
        ===================================================== */}

        <div
          className={`
            relative
            flex
            h-9
            w-full
            overflow-hidden
            rounded-[9px]
            border
            backdrop-blur-2xl
            shadow-[0_12px_40px_rgba(0,0,0,.7)]
            transition-all
            duration-500

            ${
              open
                ? "border-white/25 bg-white text-black"
                : "border-white/[0.12] bg-black/85 text-white"
            }
          `}
        >

          {/* AMBIENT SWEEP */}

          {!open && (
            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-1/2
                w-1/4
                skew-x-[-20deg]
                bg-gradient-to-r
                from-transparent
                via-white/[0.08]
                to-transparent
                animate-[dockSweep_5s_linear_infinite]
              "
            />
          )}

          {/* CORE */}

          <button
            onClick={() => setOpen((value) => !value)}
            className="
              relative
              flex
              w-9
              shrink-0
              items-center
              justify-center
              border-r border-white/10
              active:bg-white/10
            "
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
          >

            <span
              className={`
                absolute
                h-3.5
                w-3.5
                rounded-[3px]
                border
                transition-all
                duration-500

                ${
                  open
                    ? "rotate-45 border-black/30"
                    : "border-white/20"
                }
              `}
            />

            <span
              className={`
                relative
                h-1
                w-1

                ${
                  open
                    ? "bg-black"
                    : "bg-white shadow-[0_0_10px_white]"
                }
              `}
            />

          </button>

          {/* INFO */}

          <button
            onClick={() => setOpen((value) => !value)}
            className="
              flex
              flex-1
              items-center
              justify-between
              px-2.5
              text-left
              active:opacity-70
            "
          >

            <div>

              <div
                className={`
                  font-mono
                  text-[5px]
                  uppercase
                  tracking-[0.35em]

                  ${
                    open
                      ? "text-black/70"
                      : "text-white/55"
                  }
                `}
              >
                {open
                  ? "MEMORY MAP"
                  : "MEMORY UNIVERSE"}
              </div>

              <div
                className={`
                  mt-0.5
                  font-mono
                  text-[3.5px]
                  tracking-[0.28em]

                  ${
                    open
                      ? "text-black/25"
                      : "text-white/15"
                  }
                `}
              >
                {open
                  ? "TOUCH A DESTINATION"
                  : "ARCHIVE // 001"}
              </div>

            </div>

            {/* SIGNAL */}

            <div className="flex items-end gap-[2px]">

              {[1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className={`
                    w-px
                    ${
                      open
                        ? "bg-black/40"
                        : "bg-white/35"
                    }
                  `}
                  style={{
                    height: `${3 + bar}px`,
                    animation: `signal ${
                      0.6 + bar * 0.12
                    }s ease-in-out infinite alternate`,
                  }}
                />
              ))}

            </div>

          </button>

          {/* INDEX */}

          <div
            className={`
              flex
              w-7
              items-center
              justify-center
              border-l border-white/10
              font-mono
              text-[4px]
              tracking-[0.2em]

              ${
                open
                  ? "text-black/25"
                  : "text-white/15"
              }
            `}
          >
            08
          </div>

        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes dockSweep {
          0% {
            transform: translateX(-200%);
          }

          100% {
            transform: translateX(700%);
          }
        }

        @keyframes signal {
          0% {
            transform: scaleY(.35);
            opacity: .25;
          }

          100% {
            transform: scaleY(1);
            opacity: .9;
          }
        }
      `}</style>
    </>
  );
}