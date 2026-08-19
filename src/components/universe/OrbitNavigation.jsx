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
import { useEffect, useRef, useState } from "react";

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
  const navigating = useRef(false);

  // ============================================================
  // ESCAPE
  // ============================================================

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpen]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavigate = (path, index) => {
    if (navigating.current) return;

    navigating.current = true;
    setPressed(index);

    // Very short tactile response.
    setTimeout(() => {
      navigate(path);
      setOpen(false);
      setPressed(null);
      navigating.current = false;
    }, 120);
  };

  const toggleMenu = () => {
    setOpen((value) => !value);
  };

  return (
    <>
      {/* ========================================================
          MOBILE-FIRST BACKDROP

          No backdrop blur on mobile.
          Blur is expensive because it forces large areas to
          be continuously composited.
      ======================================================== */}

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`
          fixed inset-0 z-[80]
          bg-black/70
          transition-opacity duration-300
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ========================================================
          NAVIGATION CONTAINER
      ======================================================== */}

      <div
        className="
          fixed
          bottom-[max(12px,env(safe-area-inset-bottom))]
          left-1/2
          z-[100]
          w-[calc(100%-20px)]
          max-w-[380px]
          -translate-x-1/2
        "
      >
        {/* ======================================================
            MENU PANEL
        ====================================================== */}

        <div
          className={`
            absolute
            bottom-[calc(100%+9px)]
            left-0
            right-0

            origin-bottom

            transition-[opacity,transform]
            duration-300
            ease-[cubic-bezier(.22,1,.36,1)]

            ${
              open
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-2 scale-[0.985] opacity-0"
            }
          `}
        >
          {/* ====================================================
              PANEL
          ==================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.12]
              bg-[#050505]
              shadow-[0_20px_60px_rgba(0,0,0,.75)]
            "
          >
            {/* TOP LINE */}

            <div
              className="
                absolute
                left-5
                right-5
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/50
                to-transparent
              "
            />

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
              className="
                flex
                h-12
                items-center
                justify-between
                border-b
                border-white/[0.07]
                px-4
              "
            >
              <div className="flex items-center gap-3">
                {/* CORE */}

                <div
                  className="
                    relative
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                  "
                >
                  <span
                    className="
                      absolute
                      h-5
                      w-5
                      rotate-45
                      border
                      border-white/20
                    "
                  />

                  <span
                    className="
                      absolute
                      h-2.5
                      w-2.5
                      rotate-45
                      border
                      border-white/10
                    "
                  />

                  <span
                    className="
                      relative
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-white
                      shadow-[0_0_10px_rgba(255,255,255,.8)]
                    "
                  />
                </div>

                <div>
                  <div
                    className="
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.4em]
                      text-white/70
                    "
                  >
                    Memory Map
                  </div>

                  <div
                    className="
                      mt-1
                      font-mono
                      text-[5px]
                      tracking-[0.3em]
                      text-white/20
                    "
                  >
                    EIGHT DESTINATIONS
                  </div>
                </div>
              </div>

              {/* STATUS */}

              <div className="flex items-center gap-2">
                <span
                  className="
                    font-mono
                    text-[5px]
                    tracking-[0.3em]
                    text-white/20
                  "
                >
                  ONLINE
                </span>

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-white
                    shadow-[0_0_8px_rgba(255,255,255,.8)]
                  "
                />
              </div>
            </div>

            {/* ==================================================
                DESTINATIONS
            ================================================== */}

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
                    type="button"
                    disabled={navigating.current}
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
                      min-h-[76px]
                      flex-col
                      items-center
                      justify-center
                      overflow-hidden

                      bg-[#070707]

                      px-2
                      py-3

                      text-center

                      transition-[background-color,transform]
                      duration-150

                      active:scale-[0.97]

                      ${
                        isPressed
                          ? "bg-white"
                          : "hover:bg-[#0d0d0d]"
                      }

                      sm:min-h-[70px]
                      sm:py-2
                      sm:transition-all
                      sm:duration-300
                    `}
                  >
                    {/* MOBILE PRESS FLASH */}

                    <span
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        bg-white
                        transition-opacity
                        duration-100
                        ${
                          isPressed
                            ? "opacity-100"
                            : "opacity-0"
                        }
                      `}
                    />

                    {/* DESKTOP HOVER LIGHT */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        hidden
                        bg-gradient-to-br
                        from-white/[0.08]
                        via-transparent
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-300
                        sm:block
                        sm:group-hover:opacity-100
                      "
                    />

                    {/* LEFT ACTIVE LINE */}

                    <span
                      className={`
                        absolute
                        bottom-0
                        left-0
                        top-0
                        w-[2px]
                        origin-center
                        bg-white

                        transition-transform
                        duration-200

                        ${
                          isPressed
                            ? "scale-y-100"
                            : "scale-y-0"
                        }

                        sm:group-hover:scale-y-100
                      `}
                    />

                    {/* NUMBER */}

                    <span
                      className={`
                        absolute
                        right-2
                        top-2
                        font-mono
                        text-[5px]
                        tracking-[0.15em]

                        ${
                          isPressed
                            ? "text-black/30"
                            : "text-white/15"
                        }

                        sm:group-hover:text-white/60
                      `}
                    >
                      {destination.code}
                    </span>

                    {/* ICON */}

                    <span
                      className={`
                        relative
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        border

                        transition-[transform,background-color,border-color,color,box-shadow]
                        duration-200

                        ${
                          isPressed
                            ? "border-black/20 bg-black text-white"
                            : "border-white/[0.10] bg-white/[0.015] text-white/45"
                        }

                        sm:h-7
                        sm:w-7
                        sm:group-hover:-translate-y-0.5
                        sm:group-hover:border-white/40
                        sm:group-hover:bg-white
                        sm:group-hover:text-black
                        sm:group-hover:shadow-[0_0_16px_rgba(255,255,255,.15)]
                      `}
                    >
                      <Icon
                        size={13}
                        strokeWidth={1.5}
                      />
                    </span>

                    {/* LABEL */}

                    <span
                      className={`
                        relative
                        mt-2
                        font-mono
                        text-[6px]
                        uppercase
                        tracking-[0.18em]

                        ${
                          isPressed
                            ? "text-black"
                            : "text-white/55"
                        }

                        sm:mt-1.5
                        sm:group-hover:text-white
                      `}
                    >
                      {destination.label}
                    </span>

                    {/* DESCRIPTION */}

                    <span
                      className={`
                        relative
                        mt-1
                        hidden
                        font-mono
                        text-[4px]
                        tracking-[0.18em]
                        text-white/15

                        sm:block
                        sm:group-hover:text-white/30
                      `}
                    >
                      {destination.description}
                    </span>

                    {/* DESKTOP ARROW */}

                    <ArrowUpRight
                      size={8}
                      strokeWidth={1}
                      className="
                        absolute
                        bottom-2
                        right-2
                        hidden
                        text-white/10
                        transition-all
                        duration-300
                        sm:block
                        sm:group-hover:-translate-y-0.5
                        sm:group-hover:translate-x-0.5
                        sm:group-hover:text-white/60
                      "
                    />

                    {/* CORNER */}

                    <span
                      className={`
                        absolute
                        bottom-0
                        right-0
                        h-3
                        w-3
                        border-b
                        border-r

                        ${
                          isPressed
                            ? "border-black/25"
                            : "border-white/[0.08]"
                        }

                        sm:group-hover:border-white/30
                      `}
                    />
                  </button>
                );
              })}
            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div
              className="
                flex
                h-8
                items-center
                justify-between
                border-t
                border-white/[0.07]
                px-4
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-white/60
                    shadow-[0_0_6px_rgba(255,255,255,.5)]
                  "
                />

                <span
                  className="
                    font-mono
                    text-[4px]
                    tracking-[0.28em]
                    text-white/20
                  "
                >
                  MEMORY SYSTEM ONLINE
                </span>
              </div>

              <span
                className="
                  font-mono
                  text-[4px]
                  tracking-[0.25em]
                  text-white/10
                "
              >
                08 / 08
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM DOCK
        ====================================================== */}

        <div
          className={`
            relative
            flex
            h-12
            w-full
            overflow-hidden
            rounded-xl
            border
            shadow-[0_12px_45px_rgba(0,0,0,.65)]

            transition-[background-color,border-color,color]
            duration-300

            ${
              open
                ? "border-white/20 bg-white text-black"
                : "border-white/[0.12] bg-[#050505] text-white"
            }
          `}
        >
          {/* TOP HIGHLIGHT */}

          <span
            className={`
              pointer-events-none
              absolute
              left-4
              right-4
              top-0
              h-px
              ${
                open
                  ? "bg-black/20"
                  : "bg-white/20"
              }
            `}
          />

          {/* ====================================================
              CORE BUTTON
          ==================================================== */}

          <button
            type="button"
            onClick={toggleMenu}
            className="
              relative
              flex
              w-12
              shrink-0
              items-center
              justify-center
              border-r
              border-white/10
              active:scale-95
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
                h-6
                w-6
                rotate-45
                rounded-[5px]
                border

                transition-transform
                duration-300

                ${
                  open
                    ? "border-black/25 rotate-[135deg]"
                    : "border-white/20"
                }
              `}
            />

            <span
              className={`
                relative
                h-1.5
                w-1.5
                rounded-full

                ${
                  open
                    ? "bg-black"
                    : "bg-white shadow-[0_0_10px_white]"
                }
              `}
            />
          </button>

          {/* ====================================================
              INFO
          ==================================================== */}

          <button
            type="button"
            onClick={toggleMenu}
            className="
              flex
              min-w-0
              flex-1
              items-center
              justify-between
              px-3
              text-left
              active:opacity-70
            "
          >
            <div className="min-w-0">
              <div
                className={`
                  truncate
                  font-mono
                  text-[6px]
                  uppercase
                  tracking-[0.38em]

                  ${
                    open
                      ? "text-black/70"
                      : "text-white/60"
                  }
                `}
              >
                {open
                  ? "MEMORY MAP"
                  : "MEMORY UNIVERSE"}
              </div>

              <div
                className={`
                  mt-1
                  truncate
                  font-mono
                  text-[4px]
                  tracking-[0.3em]

                  ${
                    open
                      ? "text-black/25"
                      : "text-white/20"
                  }
                `}
              >
                {open
                  ? "SELECT A DESTINATION"
                  : "ARCHIVE // 001"}
              </div>
            </div>

            {/* STATIC SIGNAL */}

            <div className="ml-3 flex items-end gap-[2px]">
              {[1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className={`
                    w-[2px]
                    rounded-full
                    ${
                      open
                        ? "bg-black/35"
                        : "bg-white/30"
                    }
                  `}
                  style={{
                    height: `${3 + bar}px`,
                  }}
                />
              ))}
            </div>
          </button>

          {/* ====================================================
              INDEX
          ==================================================== */}

          <div
            className={`
              flex
              w-10
              shrink-0
              items-center
              justify-center
              border-l
              border-white/10

              font-mono
              text-[5px]
              tracking-[0.2em]

              ${
                open
                  ? "text-black/25"
                  : "text-white/20"
              }
            `}
          >
            08
          </div>
        </div>
      </div>

      {/* ========================================================
          REDUCED MOTION
      ======================================================== */}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}