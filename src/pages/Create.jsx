import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  Star,
  WandSparkles,
  Send,
  MousePointer2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TARGET_POINTS = 120;
const MAX_POINTS = 900;

const STAR_SENTENCES = [
  "A quiet star made for the moments that are impossible to forget.",
  "Your star feels like a memory that refused to disappear.",
  "Some stars are meant to be seen. Yours is meant to be remembered.",
  "A little imperfect, a little mysterious, and completely yours.",
  "Your constellation looks like a story that has not finished being told.",
  "This star carries the kind of light that only memories can create.",
  "You did not draw a perfect star. You created something personal.",
  "Every point is a moment. Every line is something worth keeping.",
  "Your star feels like a small piece of yourself left in the universe.",
  "Somewhere between chaos and beauty, you made this.",
  "This is what happens when a memory becomes a constellation.",
  "Your star does not need to be perfect. It only needs to belong to you.",
  "A strange little constellation with one important quality: it is yours.",
  "You left behind a light that someone could always find again.",
  "Maybe the universe needed exactly this star.",
];

const ambientStars = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  x: (i * 47.73 + 3) % 100,
  y: (i * 83.17 + 7) % 100,
  size:
    i % 23 === 0
      ? 3
      : i % 9 === 0
      ? 2
      : i % 4 === 0
      ? 1.2
      : 0.7,
  delay: (i % 18) * 0.2,
  duration: 3.2 + (i % 8) * 0.65,
}));

export default function Create() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);

  const strokesRef = useRef([]);
  const currentStrokeRef = useRef(null);

  const drawingRef = useRef(false);
  const completedRef = useRef(false);

  const animationFrameRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [hint, setHint] = useState(false);
  const [starSentence, setStarSentence] = useState("");

  // =========================================================
  // Stores an image of the user's finished constellation.
  // =========================================================

  const [drawingImage, setDrawingImage] = useState("");

  // =========================================================
  // HELPERS
  // =========================================================

  const getAllPoints = () => {
    return strokesRef.current.flat();
  };

  const getPointCount = () => {
    return strokesRef.current.reduce(
      (total, stroke) => total + stroke.length,
      0
    );
  };

  // =========================================================
  // CANVAS SETUP
  // =========================================================

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw();
  }, []);

  // =========================================================
  // BACKGROUND
  // =========================================================

  const drawBackground = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.48,
      0,
      width * 0.5,
      height * 0.48,
      Math.max(width, height) * 0.8
    );

    gradient.addColorStop(
      0,
      "rgba(255,225,170,.065)"
    );

    gradient.addColorStop(
      0.25,
      "rgba(255,215,160,.025)"
    );

    gradient.addColorStop(
      0.6,
      "rgba(90,100,160,.012)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const centerGlow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.min(width, height) * 0.45
    );

    centerGlow.addColorStop(
      0,
      "rgba(255,240,205,.045)"
    );

    centerGlow.addColorStop(
      0.45,
      "rgba(255,220,170,.012)"
    );

    centerGlow.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);
  };

  // =========================================================
  // SMOOTH STROKE
  // =========================================================

  const drawSmoothStroke = (ctx, points) => {
    if (!points || points.length === 0) return;

    if (points.length === 1) {
      const point = points[0];

      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);

      ctx.fillStyle = "rgba(255,240,210,.95)";
      ctx.shadowColor = "rgba(255,225,170,.95)";
      ctx.shadowBlur = 14;

      ctx.fill();

      ctx.shadowBlur = 0;

      return;
    }

    if (points.length === 2) {
      ctx.beginPath();

      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);

      ctx.stroke();

      return;
    }

    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const midpointX =
        (current.x + next.x) / 2;

      const midpointY =
        (current.y + next.y) / 2;

      ctx.quadraticCurveTo(
        current.x,
        current.y,
        midpointX,
        midpointY
      );
    }

    const secondLast =
      points[points.length - 2];

    const last =
      points[points.length - 1];

    ctx.quadraticCurveTo(
      secondLast.x,
      secondLast.y,
      last.x,
      last.y
    );

    ctx.stroke();
  };

  // =========================================================
  // CONSTELLATION
  // =========================================================

  const drawConstellation = (ctx) => {
    const strokes = strokesRef.current;

    if (!strokes.length) return;

    // Glow underlay

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle =
      "rgba(255,220,160,.13)";

    ctx.lineWidth = 7;

    ctx.shadowColor =
      "rgba(255,215,150,.35)";

    ctx.shadowBlur = 18;

    strokes.forEach((stroke) => {
      drawSmoothStroke(ctx, stroke);
    });

    ctx.restore();

    // Main hand-drawn ink

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle =
      "rgba(255,238,205,.78)";

    ctx.lineWidth = 1.15;

    ctx.shadowColor =
      "rgba(255,220,160,.75)";

    ctx.shadowBlur = 9;

    strokes.forEach((stroke) => {
      drawSmoothStroke(ctx, stroke);
    });

    ctx.restore();

    // Thin highlight

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle =
      "rgba(255,255,255,.28)";

    ctx.lineWidth = 0.45;

    strokes.forEach((stroke) => {
      drawSmoothStroke(ctx, stroke);
    });

    ctx.restore();

    // Star nodes

    strokes.forEach((stroke) => {
      stroke.forEach((point, index) => {
        const isFirst = index === 0;

        const isEnd =
          index === stroke.length - 1;

        const isMajor =
          index % 18 === 0;

        if (
          !isFirst &&
          !isEnd &&
          !isMajor
        ) {
          return;
        }

        const radius = isEnd
          ? 3.3
          : isMajor
          ? 2.1
          : 1.15;

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = isEnd
          ? "rgba(255,255,255,.98)"
          : "rgba(255,239,205,.82)";

        ctx.shadowColor =
          "rgba(255,225,165,.95)";

        ctx.shadowBlur = isEnd
          ? 25
          : 11;

        ctx.fill();

        ctx.shadowBlur = 0;

        if (isMajor || isEnd) {
          ctx.save();

          ctx.strokeStyle = isEnd
            ? "rgba(255,245,220,.45)"
            : "rgba(255,235,195,.2)";

          ctx.lineWidth = 0.45;

          ctx.beginPath();

          ctx.moveTo(
            point.x - radius * 3,
            point.y
          );

          ctx.lineTo(
            point.x + radius * 3,
            point.y
          );

          ctx.moveTo(
            point.x,
            point.y - radius * 3
          );

          ctx.lineTo(
            point.x,
            point.y + radius * 3
          );

          ctx.stroke();

          ctx.restore();
        }
      });
    });

    // Last point aura

    const allPoints = getAllPoints();

    const last =
      allPoints[allPoints.length - 1];

    if (!last) return;

    const aura = ctx.createRadialGradient(
      last.x,
      last.y,
      0,
      last.x,
      last.y,
      65
    );

    aura.addColorStop(
      0,
      "rgba(255,245,220,.22)"
    );

    aura.addColorStop(
      0.2,
      "rgba(255,225,170,.09)"
    );

    aura.addColorStop(
      1,
      "rgba(255,225,170,0)"
    );

    ctx.fillStyle = aura;

    ctx.fillRect(
      last.x - 70,
      last.y - 70,
      140,
      140
    );
  };

  // =========================================================
  // PARTICLES
  // =========================================================

  const drawParticles = (ctx) => {
    if (!drawingRef.current) return;

    const allPoints = getAllPoints();

    const last =
      allPoints[allPoints.length - 1];

    if (!last) return;

    const now = Date.now();

    for (let i = 0; i < 12; i++) {
      const angle =
        (Math.PI * 2 * i) / 12;

      const radius =
        9 +
        Math.sin(
          now / 240 + i * 1.7
        ) * 5;

      const x =
        last.x +
        Math.cos(angle) * radius;

      const y =
        last.y +
        Math.sin(angle) * radius;

      const size =
        0.45 +
        Math.sin(
          now / 180 + i
        ) * 0.25;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        Math.max(0.2, size),
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(255,235,190,.55)";

      ctx.shadowColor =
        "rgba(255,225,170,.5)";

      ctx.shadowBlur = 5;

      ctx.fill();

      ctx.shadowBlur = 0;
    }
  };

  // =========================================================
  // DRAW
  // =========================================================

  const draw = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    drawBackground(
      ctx,
      rect.width,
      rect.height
    );

    drawConstellation(ctx);

    drawParticles(ctx);

    if (drawingRef.current) {
      animationFrameRef.current =
        requestAnimationFrame(draw);
    }
  }, []);

  // =========================================================
  // RESIZE
  // =========================================================

  useEffect(() => {
    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [resizeCanvas]);

  // =========================================================
  // POINTER POSITION
  // =========================================================

  const getPointerPosition = (event) => {
    const canvas =
      canvasRef.current;

    if (!canvas) return null;

    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  };

  // =========================================================
  // PROGRESS
  // =========================================================

  const updateProgress = () => {
    const count =
      getPointCount();

    const nextProgress =
      Math.min(
        100,
        Math.round(
          (count / TARGET_POINTS) *
            100
        )
      );

    setProgress(nextProgress);
  };

  // =========================================================
  // POINTER DOWN
  // =========================================================

  const handlePointerDown = (event) => {
    if (completedRef.current) {
      return;
    }

    event.preventDefault();

    const point =
      getPointerPosition(event);

    if (!point) return;

    drawingRef.current = true;

    const newStroke = [point];

    strokesRef.current.push(
      newStroke
    );

    currentStrokeRef.current =
      newStroke;

    setStarted(true);
    setHint(false);

    updateProgress();

    try {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Ignore unsupported pointer capture.
    }

    draw();
  };

  // =========================================================
  // POINTER MOVE
  // =========================================================

  const handlePointerMove = (event) => {
    if (
      !drawingRef.current ||
      completedRef.current
    ) {
      return;
    }

    event.preventDefault();

    const currentStroke =
      currentStrokeRef.current;

    if (!currentStroke) return;

    if (
      getPointCount() >= MAX_POINTS
    ) {
      drawingRef.current = false;

      updateProgress();
      draw();

      return;
    }

    const point =
      getPointerPosition(event);

    if (!point) return;

    const last =
      currentStroke[
        currentStroke.length - 1
      ];

    if (last) {
      const distance =
        Math.hypot(
          point.x - last.x,
          point.y - last.y
        );

      if (distance < 2.5) {
        return;
      }
    }

    currentStroke.push(point);

    updateProgress();

    draw();
  };

  // =========================================================
  // POINTER UP
  // =========================================================

  const handlePointerUp = (event) => {
    drawingRef.current = false;

    currentStrokeRef.current = null;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Ignore unsupported pointer capture.
    }

    draw();
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const submitConstellation = () => {
    if (completedRef.current) {
      return;
    }

    const count =
      getPointCount();

    if (count < TARGET_POINTS) {
      setHint(true);
      return;
    }

    completeActivity();
  };

  // =========================================================
  // COMPLETE
  // =========================================================

  const completeActivity = () => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;

    drawingRef.current = false;
    currentStrokeRef.current = null;

    // Capture the finished constellation.

    const canvas = canvasRef.current;

    if (canvas) {
      try {
        const image =
          canvas.toDataURL("image/png");

        setDrawingImage(image);
      } catch (error) {
        console.error(
          "Unable to capture constellation:",
          error
        );
      }
    }

    setProgress(100);
    setCompleted(true);

    const randomIndex =
      Math.floor(
        Math.random() *
          STAR_SENTENCES.length
      );

    setStarSentence(
      STAR_SENTENCES[randomIndex]
    );

    draw();

    window.setTimeout(() => {
      setShowReveal(true);
    }, 950);
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetActivity = () => {
    completedRef.current = false;
    drawingRef.current = false;

    strokesRef.current = [];
    currentStrokeRef.current = null;

    setStarted(false);
    setProgress(0);
    setCompleted(false);
    setShowReveal(false);
    setHint(false);
    setStarSentence("");

    setDrawingImage("");

    draw();
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main
      className="
        relative
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-[#010101]
        px-4
        pb-14
        pt-8
        text-white
        sm:px-8
        sm:pt-12
      "
    >
      {/* =====================================================
          COSMIC BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#010101]" />

        <div
          className="
            absolute
            left-1/2
            top-[48%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[radial-gradient(circle,rgba(255,225,170,.06),rgba(255,210,140,.018)_35%,transparent_72%)]
            blur-[75px]
          "
        />

        <div
          className="
            absolute
            -left-40
            top-[12%]
            h-[430px]
            w-[430px]
            rounded-full
            bg-blue-300/[0.018]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            -right-44
            bottom-[2%]
            h-[480px]
            w-[480px]
            rounded-full
            bg-purple-300/[0.016]
            blur-[140px]
          "
        />

        {ambientStars.map((star) => (
          <span
            key={star.id}
            className="
              absolute
              rounded-full
              bg-white
              animate-[activityTwinkle_var(--duration)_ease-in-out_infinite]
            "
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity:
                0.12 +
                (star.id % 8) / 18,
              animationDelay: `${star.delay}s`,
              "--duration": `${star.duration}s`,
            }}
          />
        ))}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.32)_58%,rgba(0,0,0,.94)_100%)]
          "
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
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
                border-white/[0.1]
                bg-white/[0.025]
                shadow-[0_0_25px_rgba(255,225,170,.03)]
              "
            >
              <Star
                size={13}
                strokeWidth={1}
                className="text-white/55"
              />
            </div>

            <div>
              <p
                className="
                  font-mono
                  text-[7px]
                  uppercase
                  tracking-[0.42em]
                  text-white/35
                "
              >
                CREATE
              </p>

              <p
                className="
                  mt-1
                  font-mono
                  text-[5px]
                  uppercase
                  tracking-[0.3em]
                  text-white/15
                "
              >
                THE CONSTELLATION
              </p>
            </div>
          </div>

          <div className="text-right">
            <p
              className="
                font-mono
                text-[5px]
                uppercase
                tracking-[0.4em]
                text-white/20
              "
            >
              MEMORY UNIVERSE
            </p>

            <p
              className="
                mt-1
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-white/30
              "
            >
              05 / 06
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="relative z-10 mx-auto mt-14 max-w-4xl text-center sm:mt-20">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />

          <Sparkles
            size={13}
            strokeWidth={1}
            className="text-white/45"
          />

          <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <p
          className="
            font-mono
            text-[7px]
            uppercase
            tracking-[0.55em]
            text-white/30
          "
        >
          SOMETHING ONLY YOU CAN CREATE
        </p>

        <h1
          className="
            mt-6
            font-display
            text-[3.5rem]
            font-light
            leading-[0.82]
            tracking-[-0.07em]
            sm:text-7xl
            md:text-8xl
          "
        >
          Leave a star
          <br />
          <span className="text-white/20">
            behind.
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-7
            max-w-[340px]
            font-serif
            text-[14px]
            leading-[1.8]
            text-white/35
            sm:max-w-lg
            sm:text-lg
          "
        >
          Draw something the universe
          has never seen before.
          <br />
          It doesn't have to be perfect.
          <br />
          It only has to be yours.
        </p>
      </section>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <section className="relative z-10 mx-auto mt-9 max-w-md sm:mt-12">
        <div className="mb-2 flex items-center justify-between">
          <span
            className="
              font-mono
              text-[6px]
              uppercase
              tracking-[0.4em]
              text-white/20
            "
          >
            CONSTELLATION ENERGY
          </span>

          <span
            className={`
              font-mono
              text-[7px]
              tracking-[0.2em]
              transition-colors
              ${
                progress >= 100
                  ? "text-amber-100"
                  : progress > 0
                  ? "text-white/55"
                  : "text-white/20"
              }
            `}
          >
            {String(progress).padStart(3, "0")}%
          </span>
        </div>

        <div
          className="
            relative
            h-[2px]
            overflow-hidden
            rounded-full
            bg-white/[0.07]
          "
        >
          <div
            className="
              absolute
              inset-y-0
              left-0
              rounded-full
              bg-gradient-to-r
              from-white/20
              via-amber-100
              to-white
              shadow-[0_0_18px_rgba(255,225,170,.55)]
              transition-[width]
              duration-150
              ease-out
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </section>

      {/* =====================================================
          DRAWING CANVAS
      ===================================================== */}

      <section className="relative z-10 mx-auto mt-7 max-w-5xl sm:mt-10">
        <div
          className={`
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.09]
            bg-white/[0.012]
            shadow-[0_30px_120px_rgba(0,0,0,.65)]
            transition-all
            duration-700

            ${
              started
                ? "border-amber-100/[0.18] shadow-[0_30px_150px_rgba(255,220,150,.07)]"
                : ""
            }

            ${
              completed
                ? "border-white/20"
                : ""
            }
          `}
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-2
              rounded-[23px]
              border
              border-white/[0.025]
            "
          />

          <span className="pointer-events-none absolute left-5 top-5 h-2 w-2 border-l border-t border-white/20" />

          <span className="pointer-events-none absolute right-5 top-5 h-2 w-2 border-r border-t border-white/20" />

          <span className="pointer-events-none absolute bottom-5 left-5 h-2 w-2 border-b border-l border-white/20" />

          <span className="pointer-events-none absolute bottom-5 right-5 h-2 w-2 border-b border-r border-white/20" />

          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="
              relative
              block
              h-[430px]
              w-full
              cursor-crosshair
              touch-none
              select-none
              sm:h-[560px]
              md:h-[650px]
            "
            aria-label="Draw your constellation"
          />

          {/* CENTER GUIDE */}

          {!started && !completed && (
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                flex
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
                text-center
              "
            >
              <div
                className="
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/[0.1]
                  bg-white/[0.025]
                  shadow-[0_0_60px_rgba(255,225,170,.04)]
                  animate-[guidePulse_2.5s_ease-in-out_infinite]
                "
              >
                <WandSparkles
                  size={18}
                  strokeWidth={1}
                  className="text-white/45"
                />
              </div>

              <p
                className="
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[0.38em]
                  text-white/45
                "
              >
                Touch the universe
              </p>

              <p
                className="
                  mt-2
                  max-w-[230px]
                  font-serif
                  text-[11px]
                  italic
                  leading-relaxed
                  text-white/20
                "
              >
                Draw freely. Lift your finger
                whenever you want.
              </p>
            </div>
          )}

          {/* ACTIVE STATUS */}

          {started && !completed && (
            <div
              className="
                pointer-events-none
                absolute
                bottom-5
                left-1/2
                flex
                -translate-x-1/2
                items-center
                gap-2
                whitespace-nowrap
                rounded-full
                border
                border-white/[0.08]
                bg-black/45
                px-4
                py-2
                backdrop-blur-md
              "
            >
              <MousePointer2
                size={9}
                strokeWidth={1}
                className="text-amber-100/40"
              />

              <p
                className="
                  font-mono
                  text-[6px]
                  uppercase
                  tracking-[0.35em]
                  text-white/40
                "
              >
                Lift & draw somewhere new
              </p>
            </div>
          )}

          {/* COMPLETION GLOW */}

          {completed && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-44
                  w-44
                  rounded-full
                  bg-white/[0.04]
                  blur-[45px]
                  animate-[completionGlow_2s_ease-out_forwards]
                "
              />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          INSTRUCTIONS
      ===================================================== */}

      <section className="relative z-10 mx-auto mt-7 max-w-md text-center">
        {!completed ? (
          <>
            <p
              className={`
                font-mono
                text-[9px]
                uppercase
                tracking-[0.4em]
                transition-all
                duration-500
                ${
                  started
                    ? "text-amber-100/75"
                    : "text-white/40"
                }
              `}
            >
              {started
                ? progress >= 70
                  ? "THE CONSTELLATION IS AWAKENING"
                  : "KEEP CREATING"
                : "DRAW YOUR OWN CONSTELLATION"}
            </p>

            <p
              className={`
                mt-2
                font-serif
                text-[11px]
                italic
                transition-all
                duration-500
                ${
                  hint
                    ? "text-amber-100/65"
                    : "text-white/20"
                }
              `}
            >
              {hint
                ? "Keep drawing a little more before submitting."
                : started
                ? "Lift your finger anytime and begin another stroke."
                : "Use your finger on mobile or your mouse on desktop."}
            </p>
          </>
        ) : (
          <div
            className="
              animate-[textReveal_.9s_cubic-bezier(.16,1,.3,1)_forwards]
            "
          >
            <p
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.5em]
                text-amber-100/75
              "
            >
              CONSTELLATION COMPLETE
            </p>

            <p
              className="
                mt-3
                font-serif
                text-sm
                italic
                text-white/35
              "
            >
              Your star has been recorded
              in the universe.
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      {!completed && started && (
        <div
          className="
            relative
            z-10
            mx-auto
            mt-7
            flex
            flex-col
            items-center
            gap-4
          "
        >
          <button
            type="button"
            onClick={submitConstellation}
            disabled={
              getPointCount() < TARGET_POINTS
            }
            className={`
              group
              relative
              flex
              items-center
              gap-3
              overflow-hidden
              rounded-full
              border
              px-7
              py-4
              font-mono
              text-[7px]
              uppercase
              tracking-[0.35em]
              transition-all
              duration-300
              ${
                progress >= 100
                  ? "border-amber-100/30 bg-amber-100/[0.08] text-amber-100 hover:bg-amber-100/[0.14] hover:shadow-[0_0_35px_rgba(255,225,170,.12)]"
                  : "cursor-not-allowed border-white/[0.07] bg-white/[0.02] text-white/20"
              }
              active:scale-95
            `}
          >
            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-white
                transition-transform
                duration-500
                group-hover:translate-x-0
              "
            />

            <Send
              size={11}
              strokeWidth={1.2}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            />

            <span
              className="
                relative
                z-10
                transition-colors
                group-hover:text-black
              "
            >
              {progress >= 100
                ? "Submit constellation"
                : "Keep drawing"}
            </span>
          </button>

          <button
            type="button"
            onClick={resetActivity}
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[6px]
              uppercase
              tracking-[0.35em]
              text-white/20
              transition-colors
              duration-300
              hover:text-white/50
            "
          >
            <RotateCcw
              size={10}
              strokeWidth={1}
            />

            Start over
          </button>
        </div>
      )}

      {/* =====================================================
          REVEAL MODAL
      ===================================================== */}

      {showReveal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/95
            p-4
            py-8
            animate-[voidAppear_.8s_ease-out_forwards]
            sm:p-6
          "
        >
          {/* Ambient glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[650px]
              w-[650px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-amber-100/[0.045]
              blur-[120px]
            "
          />

          {/* Portal rings */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <div
              className="
                h-24
                w-24
                rounded-full
                border
                border-white/20
                animate-[portalRing_2s_cubic-bezier(.16,1,.3,1)_forwards]
              "
            />

            <div
              className="
                absolute
                inset-[-60px]
                rounded-full
                border
                border-white/[0.08]
                animate-[portalRing_2.3s_cubic-bezier(.16,1,.3,1)_.15s_forwards]
              "
            />

            <div
              className="
                absolute
                inset-[-120px]
                rounded-full
                border
                border-white/[0.04]
                animate-[portalRing_2.6s_cubic-bezier(.16,1,.3,1)_.3s_forwards]
              "
            />
          </div>

          {/* MODAL CARD */}

          <div
            className="
              relative
              my-auto
              w-full
              max-w-md
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.12]
              bg-[#060606]
              px-5
              py-7
              text-center
              shadow-[0_40px_150px_rgba(0,0,0,.95)]
              animate-[revealCard_1s_cubic-bezier(.16,1,.3,1)_forwards]
              sm:px-10
              sm:py-10
            "
          >
            {/* Card light */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-40
                bg-gradient-to-b
                from-white/[0.08]
                to-transparent
              "
            />

            {/* YOUR DRAWING */}

            <div
              className="
                relative
                mx-auto
                w-full
                overflow-hidden
                rounded-[24px]
                border
                border-amber-100/[0.14]
                bg-[#020202]
                shadow-[0_0_80px_rgba(255,225,170,.08)]
              "
            >
              {/* Glow behind image */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-56
                  w-56
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-amber-100/[0.08]
                  blur-[70px]
                "
              />

              {/* Image */}

              <div
                className="
                  relative
                  aspect-[4/3]
                  w-full
                  overflow-hidden
                  bg-black
                "
              >
                {drawingImage ? (
                  <img
                    src={drawingImage}
                    alt="Your constellation"
                    className="
                      relative
                      z-10
                      h-full
                      w-full
                      object-contain
                      opacity-95
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.4em]
                      text-white/20
                    "
                  >
                    CONSTELLATION
                  </div>
                )}

                {/* Vignette */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-20
                    bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.15)_70%,rgba(0,0,0,.65)_100%)]
                  "
                />

                {/* Top reflection */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    z-30
                    h-20
                    bg-gradient-to-b
                    from-white/[0.07]
                    to-transparent
                  "
                />

                {/* Corners */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-4
                    z-40
                    h-3
                    w-3
                    border-l
                    border-t
                    border-amber-100/30
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-4
                    z-40
                    h-3
                    w-3
                    border-r
                    border-t
                    border-amber-100/30
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    bottom-4
                    left-4
                    z-40
                    h-3
                    w-3
                    border-b
                    border-l
                    border-amber-100/30
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    bottom-4
                    right-4
                    z-40
                    h-3
                    w-3
                    border-b
                    border-r
                    border-amber-100/30
                  "
                />
              </div>

              {/* Image metadata */}

              <div
                className="
                  relative
                  z-30
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/[0.06]
                  px-4
                  py-3
                "
              >
                <span
                  className="
                    font-mono
                    text-[5px]
                    uppercase
                    tracking-[0.4em]
                    text-white/25
                  "
                >
                  YOUR CONSTELLATION
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    font-mono
                    text-[5px]
                    uppercase
                    tracking-[0.3em]
                    text-amber-100/45
                  "
                >
                  <span
                    className="
                      h-1
                      w-1
                      rounded-full
                      bg-amber-100
                      shadow-[0_0_8px_rgba(255,225,170,.8)]
                    "
                  />

                  RECORDED
                </span>
              </div>
            </div>

            {/* TITLE */}

            <p
              className="
                relative
                mt-7
                font-mono
                text-[7px]
                uppercase
                tracking-[0.6em]
                text-white/30
              "
            >
              MEMORY UNIVERSE
            </p>

            <h2
              className="
                relative
                mt-5
                font-display
                text-[3rem]
                font-light
                leading-[0.86]
                tracking-[-0.06em]
                sm:text-5xl
              "
            >
              You made
              <br />
              <span className="text-white/25">
                a new star.
              </span>
            </h2>

            <div
              className="
                mx-auto
                mt-6
                h-px
                w-20
                bg-gradient-to-r
                from-transparent
                via-white/25
                to-transparent
              "
            />

            {/* STAR MESSAGE */}

            <div
              className="
                relative
                mx-auto
                mt-7
                max-w-sm
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.018]
                px-5
                py-5
              "
            >
              <p
                className="
                  font-mono
                  text-[5px]
                  uppercase
                  tracking-[0.45em]
                  text-white/20
                "
              >
                YOUR STAR SAYS
              </p>

              <p
                className="
                  mt-4
                  font-serif
                  text-[15px]
                  italic
                  leading-[1.8]
                  text-white/50
                "
              >
                {starSentence}
              </p>
            </div>

            {/* Recorded status */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-amber-100
                  shadow-[0_0_10px_rgba(255,225,170,.8)]
                "
              />

              <span
                className="
                  font-mono
                  text-[5px]
                  uppercase
                  tracking-[0.35em]
                  text-white/20
                "
              >
                STAR RECORDED
              </span>
            </div>

            {/* =================================================
                CONTINUE → UNIVERSE
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/universe")}
              className="
                group
                relative
                mx-auto
                mt-8
                flex
                items-center
                gap-3
                overflow-hidden
                rounded-full
                border
                border-white/[0.13]
                bg-white/[0.035]
                px-7
                py-4
                font-mono
                text-[7px]
                uppercase
                tracking-[0.35em]
                text-white/55
                transition-all
                duration-300
                hover:border-white/25
                hover:bg-white/[0.06]
                active:scale-95
              "
            >
              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-white
                  transition-transform
                  duration-500
                  group-hover:translate-x-0
                "
              />

              <span
                className="
                  relative
                  z-10
                  transition-colors
                  group-hover:text-black
                "
              >
                Continue
              </span>

              <ArrowRight
                size={12}
                className="
                  relative
                  z-10
                  transition-all
                  group-hover:translate-x-1
                  group-hover:text-black
                "
              />
            </button>

            {/* Create another */}

            <button
              type="button"
              onClick={resetActivity}
              className="
                relative
                mt-5
                font-mono
                text-[6px]
                uppercase
                tracking-[0.35em]
                text-white/15
                transition-colors
                hover:text-white/40
              "
            >
              Create another
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes activityTwinkle {
          0%,
          100% {
            opacity: .1;
            transform: scale(.7);
          }

          50% {
            opacity: .7;
            transform: scale(1.35);
          }
        }

        @keyframes guidePulse {
          0%,
          100% {
            transform: scale(.96);
            box-shadow:
              0 0 0 rgba(255,225,170,0);
          }

          50% {
            transform: scale(1.04);
            box-shadow:
              0 0 45px rgba(255,225,170,.08);
          }
        }

        @keyframes completionGlow {
          0% {
            transform: scale(.3);
            opacity: 0;
          }

          35% {
            transform: scale(1.5);
            opacity: 1;
          }

          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes voidAppear {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes portalRing {
          0% {
            transform: scale(.1);
            opacity: 0;
          }

          30% {
            opacity: .8;
          }

          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes revealCard {
          0% {
            opacity: 0;
            transform:
              translateY(45px)
              scale(.92);
            filter: blur(10px);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-5px)
              scale(1.015);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes textReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ringPulse {
          0%,
          100% {
            transform: scale(.9);
            opacity: .2;
          }

          50% {
            transform: scale(1.15);
            opacity: .6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}