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
const MAX_POINTS = 1400;

/*
  Smaller distances = more accurate drawing.

  Mobile needs a slightly larger value than desktop because
  touch events can generate a very high number of points.
*/
const MIN_POINT_DISTANCE = 1.2;
const MOBILE_MIN_POINT_DISTANCE = 1.8;

/*
  Maximum distance between rendered points.

  When the pointer moves quickly, we interpolate intermediate
  points so the line does not skip across the canvas.
*/
const MAX_SEGMENT_DISTANCE = 7;
const MOBILE_MAX_SEGMENT_DISTANCE = 9;

const PROGRESS_UPDATE_INTERVAL = 100;
const NODE_INTERVAL = 28;

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

const ambientStars = Array.from({ length: 52 }, (_, i) => ({
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

  // =========================================================
  // CANVAS
  // =========================================================

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const rectRef = useRef({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  const isMobileRef = useRef(false);

  // =========================================================
  // DRAWING DATA
  // =========================================================

  const strokesRef = useRef([]);
  const currentStrokeRef = useRef(null);

  const drawingRef = useRef(false);
  const completedRef = useRef(false);

  const pointCountRef = useRef(0);

  // =========================================================
  // PERFORMANCE
  // =========================================================

  /*
    Queue instead of keeping only one point.

    This is the biggest accuracy improvement.
    Fast movements no longer lose pointer positions.
  */
  const pointQueueRef = useRef([]);

  const pointerFrameRef = useRef(null);

  const lastProgressUpdateRef = useRef(0);
  const revealTimeoutRef = useRef(null);

  // =========================================================
  // UI STATE
  // =========================================================

  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [hint, setHint] = useState(false);
  const [starSentence, setStarSentence] = useState("");
  const [drawingImage, setDrawingImage] = useState("");

  // =========================================================
  // DEVICE
  // =========================================================

  const updateDeviceType = useCallback(() => {
    if (typeof window === "undefined") return;

    isMobileRef.current =
      window.matchMedia?.("(pointer: coarse)").matches ||
      window.innerWidth < 768;
  }, []);

  // =========================================================
  // CANVAS BACKGROUND
  // =========================================================

  const drawBackground = useCallback((ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.48,
      0,
      width * 0.5,
      height * 0.48,
      Math.max(width, height) * 0.8
    );

    gradient.addColorStop(0, "rgba(255,225,170,.055)");
    gradient.addColorStop(0.3, "rgba(255,215,160,.018)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const centerGlow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.min(width, height) * 0.42
    );

    centerGlow.addColorStop(0, "rgba(255,240,205,.035)");
    centerGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // =========================================================
  // DOT
  // =========================================================

  const drawDot = useCallback((ctx, point, glow = false) => {
    if (!ctx || !point) return;

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      point.x,
      point.y,
      glow ? 2.1 : 1.65,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "rgba(255,240,210,.92)";

    if (glow) {
      ctx.shadowColor = "rgba(255,225,170,.7)";
      ctx.shadowBlur = 8;
    }

    ctx.fill();

    ctx.restore();
  }, []);

  // =========================================================
  // FAST DRAW SEGMENT
  // =========================================================

  const drawSegment = useCallback(
    (ctx, previous, current, beforePrevious, enhanced = false) => {
      if (!ctx || !previous || !current) return;

      ctx.save();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (enhanced) {
        ctx.beginPath();

        ctx.strokeStyle = "rgba(255,220,160,.11)";
        ctx.lineWidth = 4;

        ctx.shadowColor = "rgba(255,215,150,.18)";
        ctx.shadowBlur = 8;

        if (beforePrevious) {
          const midX = (previous.x + current.x) / 2;
          const midY = (previous.y + current.y) / 2;

          ctx.moveTo(
            beforePrevious.x,
            beforePrevious.y
          );

          ctx.quadraticCurveTo(
            previous.x,
            previous.y,
            midX,
            midY
          );
        } else {
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(current.x, current.y);
        }

        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      ctx.beginPath();

      ctx.strokeStyle = "rgba(255,238,205,.9)";
      ctx.lineWidth = 1.2;

      if (beforePrevious) {
        const midX = (previous.x + current.x) / 2;
        const midY = (previous.y + current.y) / 2;

        ctx.moveTo(
          beforePrevious.x,
          beforePrevious.y
        );

        ctx.quadraticCurveTo(
          previous.x,
          previous.y,
          midX,
          midY
        );
      } else {
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(current.x, current.y);
      }

      ctx.stroke();

      ctx.restore();
    },
    []
  );

  // =========================================================
  // STAR NODE
  // =========================================================

  const drawNode = useCallback(
    (ctx, point, radius = 2.2, enhanced = false) => {
      if (!ctx || !point) return;

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        point.x,
        point.y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(255,245,220,.94)";

      if (enhanced) {
        ctx.shadowColor = "rgba(255,225,165,.7)";
        ctx.shadowBlur = 8;
      }

      ctx.fill();

      ctx.restore();
    },
    []
  );

  // =========================================================
  // FULL REDRAW
  // =========================================================

  const redrawEverything = useCallback(
    (enhanced = false) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      const rect = rectRef.current;

      drawBackground(
        ctx,
        rect.width,
        rect.height
      );

      for (const stroke of strokesRef.current) {
        if (!stroke.length) continue;

        if (stroke.length === 1) {
          drawDot(
            ctx,
            stroke[0],
            enhanced
          );

          continue;
        }

        drawDot(
          ctx,
          stroke[0],
          false
        );

        for (let i = 1; i < stroke.length; i++) {
          const previous = stroke[i - 1];
          const current = stroke[i];

          const beforePrevious =
            i > 1
              ? stroke[i - 2]
              : null;

          drawSegment(
            ctx,
            previous,
            current,
            beforePrevious,
            enhanced
          );

          if (
            i % NODE_INTERVAL === 0 ||
            i === stroke.length - 1
          ) {
            drawNode(
              ctx,
              current,
              i === stroke.length - 1
                ? 2.6
                : 1.7,
              enhanced
            );
          }
        }
      }
    },
    [
      drawBackground,
      drawDot,
      drawSegment,
      drawNode,
    ]
  );

  // =========================================================
  // RESIZE
  // =========================================================

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    updateDeviceType();

    const rect =
      canvas.getBoundingClientRect();

    /*
      Keep DPR reasonable.

      Very high DPR is one of the biggest causes of
      mobile canvas lag.
    */
    const maxDpr =
      isMobileRef.current
        ? 1.2
        : 1.6;

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      maxDpr
    );

    rectRef.current = {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
    };

    const nextWidth = Math.max(
      1,
      Math.round(rect.width * dpr)
    );

    const nextHeight = Math.max(
      1,
      Math.round(rect.height * dpr)
    );

    canvas.width = nextWidth;
    canvas.height = nextHeight;

    const ctx = canvas.getContext(
      "2d",
      {
        alpha: true,
        desynchronized: true,
      }
    );

    if (!ctx) return;

    ctxRef.current = ctx;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    redrawEverything(
      completedRef.current
    );
  }, [
    redrawEverything,
    updateDeviceType,
  ]);

  // =========================================================
  // RESIZE OBSERVER
  // =========================================================

  useEffect(() => {
    resizeCanvas();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const resizeObserver =
      new ResizeObserver(() => {
        requestAnimationFrame(
          resizeCanvas
        );
      });

    resizeObserver.observe(canvas);

    window.addEventListener(
      "resize",
      updateDeviceType,
      { passive: true }
    );

    window.addEventListener(
      "orientationchange",
      resizeCanvas,
      { passive: true }
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateDeviceType
      );

      window.removeEventListener(
        "orientationchange",
        resizeCanvas
      );

      if (pointerFrameRef.current) {
        cancelAnimationFrame(
          pointerFrameRef.current
        );
      }

      if (revealTimeoutRef.current) {
        window.clearTimeout(
          revealTimeoutRef.current
        );
      }
    };
  }, [
    resizeCanvas,
    updateDeviceType,
  ]);

  // =========================================================
  // POINTER POSITION
  // =========================================================

  const getPointerPosition = useCallback(
    (event) => {
      const rect = rectRef.current;

      return {
        x:
          event.clientX -
          rect.left,

        y:
          event.clientY -
          rect.top,
      };
    },
    []
  );

  // =========================================================
  // PROGRESS
  // =========================================================

  const updateProgress = useCallback(
    (force = false) => {
      const now = performance.now();

      if (
        !force &&
        now -
          lastProgressUpdateRef.current <
          PROGRESS_UPDATE_INTERVAL
      ) {
        return;
      }

      lastProgressUpdateRef.current = now;

      const count =
        pointCountRef.current;

      const nextProgress =
        Math.min(
          100,
          Math.round(
            (count / TARGET_POINTS) *
              100
          )
        );

      setProgress((previous) =>
        previous === nextProgress
          ? previous
          : nextProgress
      );
    },
    []
  );

  // =========================================================
  // ADD ONE POINT
  //
  // Lightweight and used by the queue processor.
  // =========================================================

  const addPointToStroke = useCallback(
    (point) => {
      if (
        !point ||
        !drawingRef.current ||
        completedRef.current
      ) {
        return;
      }

      if (
        pointCountRef.current >=
        MAX_POINTS
      ) {
        drawingRef.current = false;

        updateProgress(true);

        return;
      }

      const stroke =
        currentStrokeRef.current;

      if (!stroke) return;

      const last =
        stroke[stroke.length - 1];

      if (!last) return;

      const dx =
        point.x - last.x;

      const dy =
        point.y - last.y;

      const distanceSquared =
        dx * dx +
        dy * dy;

      const minDistance =
        isMobileRef.current
          ? MOBILE_MIN_POINT_DISTANCE
          : MIN_POINT_DISTANCE;

      const minDistanceSquared =
        minDistance *
        minDistance;

      if (
        distanceSquared <
        minDistanceSquared
      ) {
        return;
      }

      /*
        Interpolate large jumps.

        This fixes fast movement skipping.
      */
      const distance =
        Math.sqrt(
          distanceSquared
        );

      const maxSegmentDistance =
        isMobileRef.current
          ? MOBILE_MAX_SEGMENT_DISTANCE
          : MAX_SEGMENT_DISTANCE;

      const steps =
        Math.max(
          1,
          Math.ceil(
            distance /
              maxSegmentDistance
          )
        );

      const ctx =
        ctxRef.current;

      for (
        let step = 1;
        step <= steps;
        step++
      ) {
        if (
          pointCountRef.current >=
          MAX_POINTS
        ) {
          break;
        }

        const t =
          step / steps;

        const nextPoint = {
          x:
            last.x +
            dx * t,

          y:
            last.y +
            dy * t,
        };

        const currentLast =
          stroke[
            stroke.length - 1
          ];

        stroke.push(
          nextPoint
        );

        pointCountRef.current += 1;

        const index =
          stroke.length - 1;

        const beforePrevious =
          index >= 2
            ? stroke[index - 2]
            : null;

        if (ctx) {
          drawSegment(
            ctx,
            currentLast,
            nextPoint,
            beforePrevious,
            false
          );

          if (
            index %
              NODE_INTERVAL ===
            0
          ) {
            drawNode(
              ctx,
              nextPoint,
              1.8,
              false
            );
          }
        }
      }

      updateProgress();
    },
    [
      drawSegment,
      drawNode,
      updateProgress,
    ]
  );

  // =========================================================
  // PROCESS QUEUE
  //
  // Processes all collected pointer positions once per frame.
  // =========================================================

  const processPointQueue =
    useCallback(() => {
      pointerFrameRef.current =
        null;

      if (
        !drawingRef.current ||
        completedRef.current
      ) {
        pointQueueRef.current =
          [];

        return;
      }

      const queue =
        pointQueueRef.current;

      pointQueueRef.current =
        [];

      /*
        Process every collected point.

        This is much more accurate than
        processing only the newest point.
      */
      for (const point of queue) {
        addPointToStroke(point);
      }

      if (
        pointQueueRef.current.length >
        0
      ) {
        pointerFrameRef.current =
          requestAnimationFrame(
            processPointQueue
          );
      }
    }, [
      addPointToStroke,
    ]);

  // =========================================================
  // POINTER DOWN
  // =========================================================

  const handlePointerDown =
    useCallback(
      (event) => {
        if (
          completedRef.current
        ) {
          return;
        }

        event.preventDefault();

        const point =
          getPointerPosition(event);

        if (!point) return;

        drawingRef.current =
          true;

        const newStroke = [
          point,
        ];

        strokesRef.current.push(
          newStroke
        );

        currentStrokeRef.current =
          newStroke;

        pointCountRef.current += 1;

        pointQueueRef.current =
          [];

        setStarted(true);
        setHint(false);

        const ctx =
          ctxRef.current;

        if (ctx) {
          drawDot(
            ctx,
            point,
            false
          );
        }

        updateProgress(true);

        try {
          event.currentTarget.setPointerCapture(
            event.pointerId
          );
        } catch {
          // Pointer capture unsupported.
        }
      },
      [
        getPointerPosition,
        drawDot,
        updateProgress,
      ]
    );

  // =========================================================
  // POINTER MOVE
  //
  // Collect ALL useful points.
  // =========================================================

  const handlePointerMove =
    useCallback(
      (event) => {
        if (
          !drawingRef.current ||
          completedRef.current
        ) {
          return;
        }

        event.preventDefault();

        /*
          Use coalesced events when available.

          Instead of taking only the last event,
          we keep every movement point.
        */
        const nativeEvent =
          event.nativeEvent;

        const coalescedEvents =
          typeof nativeEvent
            ?.getCoalescedEvents ===
          "function"
            ? nativeEvent.getCoalescedEvents()
            : null;

        if (
          coalescedEvents &&
          coalescedEvents.length > 0
        ) {
          for (
            const coalescedEvent of
            coalescedEvents
          ) {
            pointQueueRef.current.push(
              getPointerPosition(
                coalescedEvent
              )
            );
          }
        } else {
          pointQueueRef.current.push(
            getPointerPosition(
              event
            )
          );
        }

        if (
          pointerFrameRef.current
        ) {
          return;
        }

        pointerFrameRef.current =
          requestAnimationFrame(
            processPointQueue
          );
      },
      [
        getPointerPosition,
        processPointQueue,
      ]
    );

  // =========================================================
  // FLUSH QUEUE
  // =========================================================

  const flushPointQueue =
    useCallback(() => {
      if (
        pointerFrameRef.current
      ) {
        cancelAnimationFrame(
          pointerFrameRef.current
        );

        pointerFrameRef.current =
          null;
      }

      const queue =
        pointQueueRef.current;

      pointQueueRef.current =
        [];

      for (
        const point of queue
      ) {
        addPointToStroke(point);
      }
    }, [
      addPointToStroke,
    ]);

  // =========================================================
  // POINTER UP
  // =========================================================

  const handlePointerUp =
    useCallback(
      (event) => {
        /*
          Add the final pointer position.

          This fixes the common issue where
          the final part of the line disappears.
        */
        if (
          drawingRef.current &&
          !completedRef.current
        ) {
          const finalPoint =
            getPointerPosition(event);

          if (finalPoint) {
            pointQueueRef.current.push(
              finalPoint
            );
          }
        }

        flushPointQueue();

        drawingRef.current =
          false;

        currentStrokeRef.current =
          null;

        pointQueueRef.current =
          [];

        updateProgress(true);

        try {
          event.currentTarget.releasePointerCapture(
            event.pointerId
          );
        } catch {
          // Ignore.
        }
      },
      [
        flushPointQueue,
        getPointerPosition,
        updateProgress,
      ]
    );

  // =========================================================
  // SUBMIT
  // =========================================================

  const submitConstellation =
    useCallback(() => {
      if (
        completedRef.current
      ) {
        return;
      }

      const count =
        pointCountRef.current;

      if (
        count <
        TARGET_POINTS
      ) {
        setHint(true);

        return;
      }

      completedRef.current =
        true;

      drawingRef.current =
        false;

      currentStrokeRef.current =
        null;

      pointQueueRef.current =
        [];

      updateProgress(true);

      /*
        Only now do the expensive glow redraw.
      */
      redrawEverything(true);

      const canvas =
        canvasRef.current;

      if (canvas) {
        try {
          const image =
            canvas.toDataURL(
              "image/png"
            );

          setDrawingImage(
            image
          );
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
        STAR_SENTENCES[
          randomIndex
        ]
      );

      if (
        revealTimeoutRef.current
      ) {
        window.clearTimeout(
          revealTimeoutRef.current
        );
      }

      revealTimeoutRef.current =
        window.setTimeout(() => {
          setShowReveal(true);
        }, 950);
    }, [
      redrawEverything,
      updateProgress,
    ]);

  // =========================================================
  // RESET
  // =========================================================

  const resetActivity =
    useCallback(() => {
      if (
        revealTimeoutRef.current
      ) {
        window.clearTimeout(
          revealTimeoutRef.current
        );

        revealTimeoutRef.current =
          null;
      }

      completedRef.current =
        false;

      drawingRef.current =
        false;

      strokesRef.current =
        [];

      currentStrokeRef.current =
        null;

      pointQueueRef.current =
        [];

      pointCountRef.current =
        0;

      if (
        pointerFrameRef.current
      ) {
        cancelAnimationFrame(
          pointerFrameRef.current
        );

        pointerFrameRef.current =
          null;
      }

      setStarted(false);
      setProgress(0);
      setCompleted(false);
      setShowReveal(false);
      setHint(false);
      setStarSentence("");
      setDrawingImage("");

      lastProgressUpdateRef.current =
        0;

      redrawEverything(false);
    }, [
      redrawEverything,
    ]);

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
      {/* COSMIC BACKGROUND */}

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

        {ambientStars.map(
          (star) => (
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
                  (star.id % 8) /
                    18,
                animationDelay: `${star.delay}s`,
                "--duration": `${star.duration}s`,
              }}
            />
          )
        )}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.32)_58%,rgba(0,0,0,.94)_100%)]
          "
        />
      </div>

      {/* HEADER */}

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

      {/* INTRO */}

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

      {/* PROGRESS */}

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
            {String(progress).padStart(
              3,
              "0"
            )}
            %
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

      {/* DRAWING CANVAS */}

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
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
            onPointerLeave={(event) => {
              if (
                drawingRef.current
              ) {
                handlePointerUp(event);
              }
            }}
            className="
              relative
              block
              h-[430px]
              w-full
              cursor-crosshair
              touch-none
              select-none
              [touch-action:none]
            "
            aria-label="Draw your constellation"
          />

          {!started &&
            !completed && (
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

          {started &&
            !completed && (
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

      {/* INSTRUCTIONS */}

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
          <div className="animate-[textReveal_.9s_cubic-bezier(.16,1,.3,1)_forwards]">
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

      {/* CONTROLS */}

      {!completed &&
        started && (
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
              onClick={
                submitConstellation
              }
              disabled={
                progress < 100
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
                    ? "border-amber-100/30 bg-amber-100/[0.08] text-amber-100 hover:bg-amber-100/[0.14]"
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
              onClick={
                resetActivity
              }
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

      {/* REVEAL MODAL */}

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
                    src={
                      drawingImage
                    }
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

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-20
                    bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.15)_70%,rgba(0,0,0,.65)_100%)]
                  "
                />
              </div>

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
                    "
                  />

                  RECORDED
                </span>
              </div>
            </div>

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

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/universe"
                )
              }
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

            <button
              type="button"
              onClick={
                resetActivity
              }
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

      <style>{`
        @keyframes activityTwinkle {
          0%,
          100% {
            opacity: .1;
            transform: scale(.7);
          }

          50% {
            opacity: .65;
            transform: scale(1.25);
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
              0 0 40px rgba(255,225,170,.07);
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

        @keyframes revealCard {
          0% {
            opacity: 0;
            transform:
              translateY(45px)
              scale(.92);
            filter:
              blur(10px);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-5px)
              scale(1.015);
            filter:
              blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
            filter:
              blur(0);
          }
        }

        @keyframes textReveal {
          from {
            opacity: 0;
            transform:
              translateY(12px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        canvas {
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        @media (max-width: 767px) {
          .animate-\\[activityTwinkle_var\\(--duration\\)_ease-in-out_infinite\\] {
            animation-duration: 5s !important;
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