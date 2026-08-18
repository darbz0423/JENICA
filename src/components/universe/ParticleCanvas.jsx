import { useEffect, useRef } from "react";

export default function ParticleCanvas({
  density = 100,
  speed = 0.2,
  celebration = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) return;

    let animationFrame;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let particles = [];
    let shootingStars = [];

    let mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mobile = window.matchMedia(
      "(max-width: 767px)"
    ).matches;

    /*
    ============================================================
      PERFORMANCE PROFILE
    ============================================================
    */

    const particleCount = reducedMotion
      ? Math.min(Math.round(density * 0.18), 25)
      : mobile
        ? Math.min(Math.round(density * 0.5), 65)
        : Math.min(Math.round(density * 1.05), 160);

    const motionMultiplier = reducedMotion
      ? 0
      : mobile
        ? 0.65
        : 1;

    /*
    ============================================================
      RESIZE
    ============================================================
    */

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createParticles();
    }

    /*
    ============================================================
      PARTICLE CREATION
    ============================================================
    */

    function createParticles() {
      particles = Array.from(
        { length: particleCount },
        () => {
          const depth = Math.random();

          return {
            x: Math.random() * width,
            y: Math.random() * height,

            /*
              Tiny particles dominate the field.
            */

            size:
              depth > 0.82
                ? Math.random() * 1.5 + 0.7
                : Math.random() * 0.9 + 0.15,

            depth,

            alpha:
              depth > 0.8
                ? Math.random() * 0.45 + 0.3
                : Math.random() * 0.35 + 0.08,

            velocityX:
              (Math.random() - 0.5) *
              speed *
              (0.4 + depth),

            velocityY:
              (Math.random() - 0.5) *
              speed *
              (0.4 + depth),

            phase:
              Math.random() *
              Math.PI *
              2,

            twinkle:
              Math.random() * 0.025 +
              0.004,

            type:
              Math.random() > 0.91
                ? "star"
                : Math.random() > 0.72
                  ? "dust"
                  : "point",
          };
        }
      );
    }

    /*
    ============================================================
      SHOOTING STAR
    ============================================================
    */

    function createShootingStar() {
      if (reducedMotion) return;

      if (shootingStars.length >= (mobile ? 1 : 2)) {
        return;
      }

      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.45,

        length: mobile
          ? Math.random() * 35 + 25
          : Math.random() * 65 + 35,

        speed: mobile
          ? Math.random() * 5 + 4
          : Math.random() * 7 + 5,

        alpha: 0,

        life: 0,

        maxLife: mobile
          ? 35
          : 45,

        angle:
          Math.PI *
          (0.12 + Math.random() * 0.08),
      });
    }

    /*
    ============================================================
      DRAW PARTICLE
    ============================================================
    */

    function drawParticle(particle) {
      const pulse =
        Math.sin(particle.phase) *
        particle.twinkle;

      const alpha = Math.max(
        0.02,
        particle.alpha + pulse
      );

      /*
        Mouse parallax only on desktop.
      */

      let px = particle.x;
      let py = particle.y;

      if (!mobile && mouse.active) {
        const parallax =
          particle.depth * 3;

        px +=
          (mouse.x - width / 2) /
          width *
          parallax;

        py +=
          (mouse.y - height / 2) /
          height *
          parallax;
      }

      /*
      ------------------------------------------------------------
        STAR
      ------------------------------------------------------------
      */

      if (particle.type === "star") {
        const glowSize =
          particle.size * 5;

        const gradient =
          ctx.createRadialGradient(
            px,
            py,
            0,
            px,
            py,
            glowSize
          );

        if (celebration) {
          gradient.addColorStop(
            0,
            `rgba(255,220,150,${alpha * 0.8})`
          );

          gradient.addColorStop(
            1,
            "rgba(255,210,120,0)"
          );
        } else {
          gradient.addColorStop(
            0,
            `rgba(255,255,255,${alpha * 0.7})`
          );

          gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
          );
        }

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
          px,
          py,
          glowSize,
          0,
          Math.PI * 2
        );

        ctx.fill();

        /*
          Tiny four-point star.
        */

        ctx.save();

        ctx.translate(px, py);

        ctx.globalAlpha = alpha;

        ctx.beginPath();

        ctx.moveTo(0, -particle.size * 3);
        ctx.lineTo(
          particle.size * 0.65,
          -particle.size * 0.65
        );

        ctx.lineTo(
          particle.size * 3,
          0
        );

        ctx.lineTo(
          particle.size * 0.65,
          particle.size * 0.65
        );

        ctx.lineTo(
          0,
          particle.size * 3
        );

        ctx.lineTo(
          -particle.size * 0.65,
          particle.size * 0.65
        );

        ctx.lineTo(
          -particle.size * 3,
          0
        );

        ctx.lineTo(
          -particle.size * 0.65,
          -particle.size * 0.65
        );

        ctx.closePath();

        ctx.fillStyle = celebration
          ? "#ffe0a8"
          : "#ffffff";

        ctx.fill();

        ctx.restore();

        return;
      }

      /*
      ------------------------------------------------------------
        DUST
      ------------------------------------------------------------
      */

      if (particle.type === "dust") {
        ctx.beginPath();

        ctx.arc(
          px,
          py,
          particle.size * 0.7,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = celebration
          ? `rgba(255,220,160,${alpha * 0.45})`
          : `rgba(255,255,255,${alpha * 0.35})`;

        ctx.fill();

        return;
      }

      /*
      ------------------------------------------------------------
        NORMAL POINT
      ------------------------------------------------------------
      */

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = celebration
        ? `rgba(255,220,160,${alpha})`
        : `rgba(255,255,255,${alpha})`;

      ctx.fill();
    }

    /*
    ============================================================
      DRAW SHOOTING STARS
    ============================================================
    */

    function drawShootingStar(star) {
      const progress =
        star.life / star.maxLife;

      /*
        Fade in → bright → fade out.
      */

      let alpha;

      if (progress < 0.2) {
        alpha = progress / 0.2;
      } else {
        alpha =
          1 -
          (progress - 0.2) / 0.8;
      }

      const endX =
        star.x -
        Math.cos(star.angle) *
          star.length;

      const endY =
        star.y -
        Math.sin(star.angle) *
          star.length;

      const gradient =
        ctx.createLinearGradient(
          star.x,
          star.y,
          endX,
          endY
        );

      gradient.addColorStop(
        0,
        `rgba(255,255,255,${alpha})`
      );

      gradient.addColorStop(
        0.3,
        `rgba(255,255,255,${alpha * 0.35})`
      );

      gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.moveTo(
        star.x,
        star.y
      );

      ctx.lineTo(
        endX,
        endY
      );

      ctx.strokeStyle = gradient;

      ctx.lineWidth = mobile
        ? 0.7
        : 1;

      ctx.stroke();

      /*
        Head.
      */

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        mobile ? 0.9 : 1.2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(255,255,255,${alpha})`;

      ctx.fill();
    }

    /*
    ============================================================
      UPDATE
    ============================================================
    */

    function updateParticles() {
      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x +=
            particle.velocityX *
            motionMultiplier;

          particle.y +=
            particle.velocityY *
            motionMultiplier;

          /*
            Slow breathing motion.
          */

          particle.phase +=
            particle.twinkle *
            2;

          /*
            Very subtle organic drift.
          */

          particle.x +=
            Math.sin(
              particle.phase * 0.7
            ) *
            0.025;

          particle.y +=
            Math.cos(
              particle.phase * 0.5
            ) *
            0.02;
        }

        /*
        ----------------------------------------------------------
          WRAP
        ----------------------------------------------------------
        */

        if (particle.x < -10) {
          particle.x = width + 10;
        }

        if (particle.x > width + 10) {
          particle.x = -10;
        }

        if (particle.y < -10) {
          particle.y = height + 10;
        }

        if (particle.y > height + 10) {
          particle.y = -10;
        }
      }

      /*
      ------------------------------------------------------------
        SHOOTING STARS
      ------------------------------------------------------------
      */

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        star.x +=
          Math.cos(star.angle) *
          star.speed;

        star.y +=
          Math.sin(star.angle) *
          star.speed;

        star.life++;

        if (
          star.life >= star.maxLife ||
          star.x > width + 100 ||
          star.y > height + 100
        ) {
          shootingStars.splice(i, 1);
        }
      }
    }

    /*
    ============================================================
      MAIN LOOP
    ============================================================
    */

    let frame = 0;

    function draw() {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      updateParticles();

      /*
        Draw subtle depth layers.
      */

      for (const particle of particles) {
        drawParticle(particle);
      }

      /*
        Shooting stars above particles.
      */

      for (const star of shootingStars) {
        drawShootingStar(star);
      }

      /*
        Occasionally create a shooting star.
        Less frequent on mobile.
      */

      if (
        !reducedMotion &&
        frame % (mobile ? 900 : 650) === 0 &&
        Math.random() > 0.35
      ) {
        createShootingStar();
      }

      frame++;

      animationFrame =
        requestAnimationFrame(draw);
    }

    /*
    ============================================================
      MOUSE INTERACTION
    ============================================================
    */

    function handlePointerMove(event) {
      if (mobile) return;

      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function handlePointerLeave() {
      mouse.active = false;
    }

    /*
    ============================================================
      INITIALIZE
    ============================================================
    */

    resize();

    window.addEventListener(
      "resize",
      resize,
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    window.addEventListener(
      "blur",
      handlePointerLeave
    );

    draw();

    /*
    ============================================================
      CLEANUP
    ============================================================
    */

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "blur",
        handlePointerLeave
      );
    };
  }, [density, speed, celebration]);

  return (
    <canvas
      ref={canvasRef}
      className="
        pointer-events-none
        fixed
        inset-0
        z-10
        h-full
        w-full
        opacity-80
      "
      aria-hidden="true"
    />
  );
}