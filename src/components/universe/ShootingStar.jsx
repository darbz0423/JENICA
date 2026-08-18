import { useEffect, useRef, useState } from "react";

export default function ShootingStar({ onWish }) {
  const [star, setStar] = useState(null);
  const [hovered, setHovered] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
    ============================================================
      WAIT BEFORE SPAWNING
    ============================================================
    */

    const initialDelay = reducedMotion
      ? 10000
      : 12000 + Math.random() * 18000;

    timerRef.current = setTimeout(() => {
      spawnStar();
    }, initialDelay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  /*
  ==============================================================
    SPAWN
  ============================================================== 
  */

  const spawnStar = () => {
    const mobile = window.innerWidth < 768;

    /*
      Keep the shooting star inside a safe visual area.
      This prevents it from appearing underneath navigation.
    */

    const x = 18 + Math.random() * 62;
    const y = 12 + Math.random() * 45;

    const angle =
      mobile
        ? -18 - Math.random() * 10
        : -14 - Math.random() * 18;

    setStar({
      x,
      y,
      angle,
      id: Date.now(),
    });

    /*
      Automatically disappear.
    */

    timerRef.current = setTimeout(() => {
      setStar(null);

      /*
        Schedule the next appearance.
      */

      timerRef.current = setTimeout(() => {
        spawnStar();
      }, 18000 + Math.random() * 22000);
    }, mobile ? 3200 : 4000);
  };

  /*
  ==============================================================
    CLICK
  ============================================================== 
  */

  const handleWish = () => {
    onWish?.();

    setStar(null);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      spawnStar();
    }, 22000 + Math.random() * 18000);
  };

  if (!star) return null;

  return (
    <button
      onClick={handleWish}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Make a wish"
      className="
        fixed
        z-[70]
        h-16
        w-32
        cursor-pointer
        touch-manipulation
        outline-none
      "
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        transform: `rotate(${star.angle}deg)`,
      }}
    >
      {/* =====================================================
          ATMOSPHERIC GLOW
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-16
          w-16
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.035]
          blur-2xl
          animate-[starAtmosphere_2.4s_ease-in-out_infinite]
        "
      />

      {/* =====================================================
          LONG SOFT TRAIL
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[15px]
          top-1/2
          h-px
          w-[105px]
          -translate-y-1/2
          bg-gradient-to-l
          from-white/70
          via-white/15
          to-transparent
          opacity-80
          animate-[starTrail_1.8s_ease-out_forwards]
        "
      />

      {/* =====================================================
          SECONDARY TRAIL
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[23px]
          top-[47%]
          h-px
          w-[75px]
          bg-gradient-to-l
          from-white/35
          to-transparent
          blur-[1px]
          animate-[starTrailSoft_2s_ease-out_forwards]
        "
      />

      {/* =====================================================
          MICRO TRAIL PARTICLES
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[55px]
          top-[44%]
          h-[2px]
          w-[2px]
          rounded-full
          bg-white/40
          shadow-[0_0_8px_white]
          animate-[starParticle_1.8s_ease-out_infinite]
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          right-[72px]
          top-[56%]
          h-[1px]
          w-[1px]
          rounded-full
          bg-white/30
          animate-[starParticle_2.2s_ease-out_infinite]
        "
      />

      {/* =====================================================
          STAR HEAD GLOW
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[9px]
          top-1/2
          h-7
          w-7
          -translate-y-1/2
          rounded-full
          bg-white/10
          blur-md
          animate-[starGlow_1.5s_ease-in-out_infinite]
        "
      />

      {/* =====================================================
          STAR HEAD
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[14px]
          top-1/2
          flex
          h-3
          w-3
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-[0_0_8px_2px_rgba(255,255,255,.75),0_0_24px_6px_rgba(255,255,255,.25)]
          animate-[starPulse_1.2s_ease-in-out_infinite]
        "
      />

      {/* =====================================================
          FOUR POINT STAR
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[15px]
          top-1/2
          h-6
          w-6
          -translate-y-1/2
          rotate-45
          border
          border-white/20
          opacity-70
          animate-[starRotate_5s_linear_infinite]
        "
      />

      {/* =====================================================
          STAR FLARE
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-[10px]
          top-1/2
          h-px
          w-7
          -translate-y-1/2
          bg-white
          opacity-70
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          right-[23px]
          top-1/2
          h-7
          w-px
          -translate-y-1/2
          bg-gradient-to-b
          from-transparent
          via-white/70
          to-transparent
        "
      />

      {/* =====================================================
          WISH LABEL
      ====================================================== */}

      <span
        className={`
          pointer-events-none
          absolute
          right-0
          top-full
          mt-1
          whitespace-nowrap
          font-mono
          text-[5px]
          uppercase
          tracking-[0.45em]
          text-white/50
          transition-all
          duration-500
          ${
            hovered
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }
        `}
      >
        Make a Wish
      </span>

      {/* =====================================================
          MOBILE LABEL
      ====================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          right-0
          top-full
          mt-1
          whitespace-nowrap
          font-mono
          text-[5px]
          uppercase
          tracking-[0.4em]
          text-white/20
          sm:hidden
        "
      >
        ✦ TAP TO WISH
      </span>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`

        @keyframes starAtmosphere {
          0%,
          100% {
            opacity: .25;
            transform: translate(-50%, -50%) scale(.8);
          }

          50% {
            opacity: .7;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes starGlow {
          0%,
          100% {
            opacity: .35;
            transform: translateY(-50%) scale(.75);
          }

          50% {
            opacity: .9;
            transform: translateY(-50%) scale(1.15);
          }
        }

        @keyframes starPulse {
          0%,
          100% {
            transform: translateY(-50%) scale(.75);
          }

          50% {
            transform: translateY(-50%) scale(1.15);
          }
        }

        @keyframes starRotate {
          from {
            transform:
              translateY(-50%)
              rotate(45deg);
          }

          to {
            transform:
              translateY(-50%)
              rotate(405deg);
          }
        }

        @keyframes starTrail {
          0% {
            opacity: 0;
            transform: translateX(35px);
          }

          30% {
            opacity: .9;
          }

          100% {
            opacity: .35;
            transform: translateX(0);
          }
        }

        @keyframes starTrailSoft {
          0% {
            opacity: 0;
            transform: translateX(25px);
          }

          35% {
            opacity: .7;
          }

          100% {
            opacity: .1;
            transform: translateX(0);
          }
        }

        @keyframes starParticle {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }

          30% {
            opacity: .7;
          }

          100% {
            opacity: 0;
            transform: translateX(-20px);
          }
        }

      `}</style>
    </button>
  );
}