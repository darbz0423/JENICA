import { useEffect, useRef, useState } from "react";
import ParticleCanvas from "./ParticleCanvas";

export default function UniverseBackground({
  celebration = false,
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const mobile =
      window.matchMedia("(max-width: 767px)").matches ||
      "ontouchstart" in window;

    setIsMobile(mobile);

    // Mobile gets a completely different atmosphere.
    // No expensive pointer tracking.
    if (mobile) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointer = (event) => {
      targetX =
        (event.clientX / window.innerWidth - 0.5) * 2;

      targetY =
        (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;

      setMouse({
        x: currentX,
        y: currentY,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener(
      "pointermove",
      handlePointer,
      { passive: true }
    );

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointer
      );

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="
        fixed
        inset-0
        -z-10
        overflow-hidden
        bg-[#020203]
      "
    >
      {/* =====================================================
          DEEP SPACE BASE
      ===================================================== */}

      <div className="absolute inset-0 bg-[#020203]" />

      {/* =====================================================
          BACKGROUND WORLD
      ===================================================== */}

      <div
        className="
          absolute
          inset-[-12%]
          will-change-transform
          transition-transform
          duration-[1600ms]
          ease-out
        "
        style={{
          transform: isMobile
            ? "translate3d(0,0,0)"
            : `translate3d(
                ${mouse.x * -14}px,
                ${mouse.y * -14}px,
                0
              ) scale(1.04)`,
        }}
      >
        {/* =================================================
            PRIMARY MEMORY NEBULA
        ================================================= */}

        <div
          className={`
            absolute
            inset-0
            ${
              celebration
                ? `
                  bg-[radial-gradient(
                    ellipse_at_50%_48%,
                    rgba(255,170,80,.15),
                    transparent_28%
                  ),
                  radial-gradient(
                    ellipse_at_15%_25%,
                    rgba(255,80,140,.09),
                    transparent_30%
                  ),
                  radial-gradient(
                    ellipse_at_85%_75%,
                    rgba(255,190,70,.07),
                    transparent_28%
                  )]
                `
                : `
                  bg-[radial-gradient(
                    ellipse_at_50%_42%,
                    rgba(110,95,150,.16),
                    transparent_30%
                  ),
                  radial-gradient(
                    ellipse_at_15%_80%,
                    rgba(90,70,130,.07),
                    transparent_28%
                  ),
                  radial-gradient(
                    ellipse_at_90%_20%,
                    rgba(130,110,170,.055),
                    transparent_26%
                  )]
                `
            }
          `}
        />

        {/* =================================================
            CINEMATIC LIGHT CORE
        ================================================= */}

        <div
          className="
            absolute
            left-1/2
            top-[43%]
            h-[45vw]
            w-[45vw]
            min-h-[280px]
            min-w-[280px]
            max-h-[700px]
            max-w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/[0.018]
            blur-[100px]
          "
        />

        {/* =================================================
            DIAGONAL MEMORY LIGHT
        ================================================= */}

        <div
          className="
            absolute
            -left-[20%]
            top-[20%]
            h-[1px]
            w-[140%]
            rotate-[-18deg]
            bg-gradient-to-r
            from-transparent
            via-white/[0.055]
            to-transparent
            blur-[1px]
          "
        />

        <div
          className="
            absolute
            -left-[20%]
            top-[68%]
            h-[1px]
            w-[140%]
            rotate-[14deg]
            bg-gradient-to-r
            from-transparent
            via-white/[0.035]
            to-transparent
          "
        />

        {/* =================================================
            DISTANT HORIZON
        ================================================= */}

        <div
          className="
            absolute
            bottom-[-15%]
            left-1/2
            h-[40vh]
            w-[120vw]
            -translate-x-1/2
            rounded-[50%]
            bg-[radial-gradient(
              ellipse,
              rgba(255,255,255,.035),
              transparent_65%
            )]
            blur-3xl
          "
        />

        {/* =================================================
            FILM GRAIN
        ================================================= */}

        <div
          className="
            universe-noise
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
          "
        />

        {/* =================================================
            VERY SUBTLE GRID
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)]
            [background-size:80px_80px]
            [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]
          "
        />
      </div>

      {/* =====================================================
          FLOATING PARTICLE FIELD
      ===================================================== */}

      <ParticleCanvas
        density={
          celebration
            ? isMobile
              ? 80
              : 220
            : isMobile
              ? 65
              : 150
        }
        speed={
          celebration
            ? isMobile
              ? 0.35
              : 0.6
            : isMobile
              ? 0.08
              : 0.18
        }
        celebration={celebration}
      />

      {/* =====================================================
          SOFT STARS / DISTANT DUST
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-[12%]
            top-[18%]
            h-[2px]
            w-[2px]
            rounded-full
            bg-white/40
            shadow-[0_0_12px_3px_rgba(255,255,255,.18)]
            animate-[starPulse_5s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            right-[18%]
            top-[31%]
            h-[1px]
            w-[1px]
            rounded-full
            bg-white/60
            shadow-[0_0_10px_3px_rgba(255,255,255,.2)]
            animate-[starPulse_7s_ease-in-out_1s_infinite]
          "
        />

        <div
          className="
            absolute
            left-[26%]
            bottom-[25%]
            h-[1px]
            w-[1px]
            rounded-full
            bg-white/50
            shadow-[0_0_9px_2px_rgba(255,255,255,.15)]
            animate-[starPulse_6s_ease-in-out_2s_infinite]
          "
        />

        <div
          className="
            absolute
            right-[9%]
            bottom-[18%]
            h-[2px]
            w-[2px]
            rounded-full
            bg-white/30
            shadow-[0_0_12px_3px_rgba(255,255,255,.12)]
            animate-[starPulse_8s_ease-in-out_3s_infinite]
          "
        />
      </div>

      {/* =====================================================
          CELEBRATION AURA
      ===================================================== */}

      {celebration && (
        <>
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[70vw]
              w-[70vw]
              max-h-[900px]
              max-w-[900px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-orange-200/[0.035]
              animate-[celebrationPulse_6s_ease-in-out_infinite]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[45vw]
              w-[45vw]
              max-h-[600px]
              max-w-[600px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-white/[0.025]
              animate-[celebrationPulse_5s_ease-in-out_1s_infinite]
            "
          />
        </>
      )}

      {/* =====================================================
          CINEMATIC VIGNETTE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-20
          bg-[radial-gradient(
            ellipse_at_center,
            transparent_35%,
            rgba(0,0,0,.28)_65%,
            rgba(0,0,0,.78)_100%
          )]
        "
      />

      {/* =====================================================
          MOBILE CINEMATIC EDGE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-20
          opacity-70
          sm:hidden
          bg-[linear-gradient(
            to_bottom,
            rgba(0,0,0,.25),
            transparent_18%,
            transparent_78%,
            rgba(0,0,0,.4)
          )]
        "
      />

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes starPulse {
          0%, 100% {
            opacity: .15;
            transform: scale(.7);
          }

          50% {
            opacity: .8;
            transform: scale(1.4);
          }
        }

        @keyframes celebrationPulse {
          0%, 100% {
            transform:
              translate(-50%, -50%)
              scale(.94);
            opacity: .25;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.04);
            opacity: .7;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}