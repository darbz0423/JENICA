import {
  ArrowUpRight,
  CircleDot,
  FileText,
  Gift,
  Images,
  Moon,
  Sparkles,
  Star,
  Gamepad2,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
    path: "/create",
    label: "Create",
    code: "05",
    description: "SOMETHING MADE FOR YOU",
    icon: Sparkles,
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

/*
==============================================================
DESTINATION ITEM

React.memo prevents all 8 buttons from unnecessarily rendering
when only one pressed item changes.
==============================================================
*/

const DestinationItem = memo(function DestinationItem({
  destination,
  index,
  pressed,
  disabled,
  onNavigate,
}) {
  const Icon = destination.icon;
  const isPressed = pressed === index;

  const handleClick = useCallback(() => {
    if (disabled) return;

    onNavigate(destination.path, index);
  }, [
    disabled,
    destination.path,
    index,
    onNavigate,
  ]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Go to ${destination.label}`}
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

        touch-manipulation

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
        sm:duration-200
      `}
    >
      {/* ======================================================
          PRESS FLASH
      ====================================================== */}

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

      {/* ======================================================
          DESKTOP LIGHT
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          inset-0
          hidden

          bg-gradient-to-br
          from-white/[0.06]
          via-transparent
          to-transparent

          opacity-0

          transition-opacity
          duration-200

          sm:block
          sm:group-hover:opacity-100
        "
      />

      {/* ======================================================
          ACTIVE EDGE
      ====================================================== */}

      <span
        className={`
          absolute
          bottom-0
          left-0
          top-0

          w-[2px]
          bg-white

          transition-transform
          duration-150

          ${
            isPressed
              ? "scale-y-100"
              : "scale-y-0"
          }

          sm:group-hover:scale-y-100
        `}
      />

      {/* ======================================================
          NUMBER
      ====================================================== */}

      <span
        className={`
          absolute
          right-2
          top-2

          font-mono
          text-[5px]
          tracking-[0.15em]

          transition-colors
          duration-150

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

      {/* ======================================================
          ICON
      ====================================================== */}

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

          transition-[transform,background-color,border-color,color]
          duration-150

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
        `}
      >
        <Icon
          size={13}
          strokeWidth={1.5}
        />
      </span>

      {/* ======================================================
          LABEL
      ====================================================== */}

      <span
        className={`
          relative
          mt-2

          font-mono
          text-[6px]
          uppercase
          tracking-[0.18em]

          transition-colors
          duration-150

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

      {/* ======================================================
          DESCRIPTION
      ====================================================== */}

      <span
        className="
          relative
          mt-1
          hidden

          font-mono
          text-[4px]
          tracking-[0.18em]
          text-white/15

          transition-colors
          duration-150

          sm:block
          sm:group-hover:text-white/30
        "
      >
        {destination.description}
      </span>

      {/* ======================================================
          DESKTOP ARROW
      ====================================================== */}

      <ArrowUpRight
        size={8}
        strokeWidth={1}
        className="
          absolute
          bottom-2
          right-2

          hidden

          text-white/10

          transition-transform
          duration-200

          sm:block
          sm:group-hover:-translate-y-0.5
          sm:group-hover:translate-x-0.5
        "
      />

      {/* ======================================================
          CORNER
      ====================================================== */}

      <span
        className={`
          absolute
          bottom-0
          right-0

          h-3
          w-3

          border-b
          border-r

          transition-colors
          duration-150

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
});

/*
==============================================================
MAIN COMPONENT
==============================================================
*/

export default function OrbitNavigation({
  navigate,
  open,
  setOpen,
}) {
  const [pressed, setPressed] = useState(null);

  const navigating = useRef(false);
  const navigationTimer = useRef(null);

  /*
  ============================================================
  ESCAPE
  ============================================================
  */

  useEffect(() => {
    const handleKey = (event) => {
      if (
        event.key === "Escape" &&
        open
      ) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [
    open,
    setOpen,
  ]);

  /*
  ============================================================
  CLEANUP
  ============================================================
  */

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(
          navigationTimer.current
        );
      }
    };
  }, []);

  /*
  ============================================================
  NAVIGATION

  Small delay remains for tactile feedback,
  but navigation is locked immediately.
  ============================================================
  */

  const handleNavigate = useCallback(
    (path, index) => {
      if (navigating.current) return;

      navigating.current = true;

      setPressed(index);

      /*
      Short feedback before route change.
      */

      navigationTimer.current = setTimeout(() => {
        /*
        Close immediately before route rendering.
        This prevents the navigation panel from
        being rendered during the next page mount.
        */

        setOpen(false);

        /*
        Clear visual state without another
        unnecessary synchronous render before navigation.
        */

        requestAnimationFrame(() => {
          navigate(path);

          setPressed(null);
          navigating.current = false;
        });
      }, 90);
    },
    [
      navigate,
      setOpen,
    ]
  );

  /*
  ============================================================
  TOGGLE
  ============================================================
  */

  const toggleMenu = useCallback(() => {
    if (navigating.current) return;

    setOpen((value) => !value);
  }, [setOpen]);

  /*
  ============================================================
  CLOSE
  ============================================================
  */

  const closeMenu = useCallback(() => {
    if (!open) return;

    setOpen(false);
  }, [
    open,
    setOpen,
  ]);

  return (
    <>
      {/* ======================================================
          BACKDROP

          Opacity only = GPU-friendly.
          No backdrop blur.
      ====================================================== */}

      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`
          fixed
          inset-0
          z-[80]

          bg-black/70

          transition-opacity
          duration-200

          will-change-[opacity]

          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ======================================================
          NAVIGATION CONTAINER
      ====================================================== */}

      <div
        className="
          fixed

          bottom-[max(12px,env(safe-area-inset-bottom))]
          left-1/2

          z-[100]

          w-[calc(100%-20px)]
          max-w-[380px]

          -translate-x-1/2

          touch-manipulation
        "
      >
        {/* ====================================================
            MENU PANEL
        ==================================================== */}

        <div
          className={`
            absolute

            bottom-[calc(100%+9px)]
            left-0
            right-0

            origin-bottom

            transition-[opacity,transform]
            duration-200
            ease-[cubic-bezier(.22,1,.36,1)]

            will-change-[transform,opacity]

            ${
              open
                ? `
                  pointer-events-auto
                  translate-y-0
                  scale-100
                  opacity-100
                `
                : `
                  pointer-events-none
                  translate-y-2
                  scale-[0.985]
                  opacity-0
                `
            }
          `}
        >
          <div
            className="
              relative
              overflow-hidden

              rounded-2xl

              border
              border-white/[0.12]

              bg-[#050505]

              shadow-[0_18px_50px_rgba(0,0,0,.7)]
            "
          >
            {/* ==================================================
                TOP LINE
            ================================================== */}

            <div
              className="
                absolute
                left-5
                right-5
                top-0

                h-px

                bg-gradient-to-r
                from-transparent
                via-white/40
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

                      shadow-[0_0_8px_rgba(255,255,255,.7)]
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

                    shadow-[0_0_7px_rgba(255,255,255,.7)]
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
              {destinations.map(
                (
                  destination,
                  index
                ) => (
                  <DestinationItem
                    key={destination.path}
                    destination={destination}
                    index={index}
                    pressed={pressed}
                    disabled={navigating.current}
                    onNavigate={handleNavigate}
                  />
                )
              )}
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

            shadow-[0_10px_35px_rgba(0,0,0,.6)]

            transition-[background-color,border-color,color]
            duration-200

            ${
              open
                ? "border-white/20 bg-white text-black"
                : "border-white/[0.12] bg-[#050505] text-white"
            }
          `}
        >
          {/* TOP LINE */}

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
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
            className="
              relative

              flex
              w-12
              shrink-0

              items-center
              justify-center

              border-r
              border-white/10

              touch-manipulation

              active:scale-95
            "
          >
            <span
              className={`
                absolute

                h-6
                w-6

                rotate-45

                rounded-[5px]

                border

                transition-[transform,border-color]
                duration-200

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

                transition-colors
                duration-200

                ${
                  open
                    ? "bg-black"
                    : "bg-white shadow-[0_0_8px_white]"
                }
              `}
            />
          </button>

          {/* ====================================================
              INFO BUTTON
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

              touch-manipulation

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

                  transition-colors
                  duration-200

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

                  transition-colors
                  duration-200

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

            {/* SIGNAL */}

            <div className="ml-3 flex items-end gap-[2px]">
              {[4, 5, 6, 7].map(
                (height) => (
                  <span
                    key={height}
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
                      height: `${height}px`,
                    }}
                  />
                )
              )}
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

              transition-colors
              duration-200

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
          PERFORMANCE + REDUCED MOTION
      ======================================================== */}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (hover: none) {
          .group:hover {
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}