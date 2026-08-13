// 🚀 SpaceX Custom Cursor (Ultra-High Performance Canvas Pool & Zero-Lag Architecture)
(() => {
  // Only initialize once (Verification comment for git push)
  if (document.getElementById("spacex-cursor")) return;

  const initCursor = () => {
    // 1. Suppress native cursors globally & inject high-performance styles
    const globalStyle = document.createElement("style");
    globalStyle.textContent = `
      html, body, a, button, input, select, textarea, [role="button"], .explore-btn, .home-btn, .skill-tile, .card-inner {
        cursor: none !important;
      }
      #spacex-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 32px;
        height: 32px;
        pointer-events: none;
        z-index: 10000000;
        transform-origin: 50% 50%;
        will-change: transform;
        filter: drop-shadow(0 0 5px rgba(0, 234, 255, 0.75));
        transition: filter 0.15s ease-out;
      }
      #spacex-cursor.hovering {
        filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.95)) drop-shadow(0 0 18px rgba(0, 234, 255, 0.8));
      }
      #spacex-cursor svg {
        width: 100%;
        height: 100%;
        transform: none !important;
        overflow: visible;
      }
      #spacex-particle-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999999;
      }
    `;
    document.head.appendChild(globalStyle);

    // 2. Inject single high-performance overlay canvas for particles
    const particleCanvas = document.createElement("canvas");
    particleCanvas.id = "spacex-particle-canvas";
    document.body.appendChild(particleCanvas);

    const ctx = particleCanvas.getContext("2d", { alpha: true });

    function resizeParticleCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener("resize", resizeParticleCanvas, { passive: true });

    // 3. Create and inject cursor DOM element (Symmetrical 100x100 ViewBox)
    const cursor = document.createElement("div");
    cursor.id = "spacex-cursor";
    cursor.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <g>
          <!-- Engine flame outer -->
          <path id="rocket-flame-main" d="M 40 72 Q 50 96 60 72 Z" fill="#ff4d00" opacity="0.95" style="transform-box: fill-box; transform-origin: 50% 0%; transition: fill 0.2s;" />
          <!-- Engine flame inner core -->
          <path id="rocket-flame-inner" d="M 45 72 Q 50 88 55 72 Z" fill="#ffea00" style="transform-box: fill-box; transform-origin: 50% 0%; transition: fill 0.2s;" />
          <!-- Rocket Body -->
          <path d="M 50 8 C 65 26 65 54 65 72 L 35 72 C 35 54 35 26 50 8 Z" fill="#ffffff" />
          <!-- Fins -->
          <path d="M 35 54 L 20 78 L 35 72 Z" fill="#cbd5e1" />
          <path d="M 65 54 L 80 78 L 65 72 Z" fill="#cbd5e1" />
          <!-- Window -->
          <ellipse cx="50" cy="30" rx="4" ry="6" fill="#020617" />
          <ellipse cx="50" cy="29" rx="2" ry="3" fill="#00eaff" opacity="0.9" />
        </g>
      </svg>
    `;

    document.body.appendChild(cursor);

    const flameMain = cursor.querySelector("#rocket-flame-main");
    const flameInner = cursor.querySelector("#rocket-flame-inner");

    // 4. Coordinates, angles, scaling & velocity tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    let angle = 0;
    let currentScale = 1;
    let targetScale = 1;

    let isHovering = false;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let scrollTimer = null;

    // Passive mouse tracker
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Passive throttled scroll tracker
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.06, 2.0);
      lastScrollY = currentScrollY;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrollVelocity = 0;
      }, 80);
    }, { passive: true });

    // Event delegation for hover states
    const isInteractive = (el) => {
      if (!el) return false;
      return el.closest("a, button, [data-liquid-button], .skill-tile, .ai-orb, .cosmic-orb, .project-card, .channel-icon, .experience-card, .home-btn, .explore-btn, input, textarea, select");
    };

    document.addEventListener("mouseover", (e) => {
      if (isInteractive(e.target)) {
        isHovering = true;
        targetScale = 1.3;
        cursor.classList.add("hovering");
        if (flameMain) flameMain.setAttribute("fill", "#a855f7");
        if (flameInner) flameInner.setAttribute("fill", "#00eaff");
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      if (isInteractive(e.target)) {
        isHovering = false;
        targetScale = 1.0;
        cursor.classList.remove("hovering");
        if (flameMain) flameMain.setAttribute("fill", "#ff4d00");
        if (flameInner) flameInner.setAttribute("fill", "#ffea00");
      }
    }, { passive: true });

    // 5. Pre-allocated Canvas Particle Pool (Capped at 25 particles, Zero DOM Nodes)
    const particleColors = ["#00eaff", "#a855f7", "#c084fc", "#ffea00", "#38bdf8"];
    const particles = [];
    const maxParticles = 25;

    function addParticle(nozzleX, nozzleY, nozzleAngleRad, speedFactor) {
      if (particles.length >= maxParticles) {
        particles.shift(); // Reuse memory
      }
      const coneSpread = (Math.random() * 20 - 10) * (Math.PI / 180);
      const driftAngle = nozzleAngleRad + coneSpread;
      const speed = 12 + Math.random() * 18 * speedFactor;

      particles.push({
        x: nozzleX,
        y: nozzleY,
        vx: Math.cos(driftAngle) * speed,
        vy: Math.sin(driftAngle) * speed,
        size: Math.random() * 2.5 + 1.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        life: 1.0,
        decay: 0.05 + Math.random() * 0.04
      });
    }

    function updateAndDrawParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * 0.06;
        p.y += p.vy * 0.06;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let frameCount = 0;

    // 6. Unified 60fps RequestAnimationFrame Loop
    function animate() {
      // Smooth lerp movement
      const lerpFactor = 0.22;
      cursorX += (mouseX - cursorX) * lerpFactor;
      cursorY += (mouseY - cursorY) * lerpFactor;

      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      const distance = Math.hypot(dx, dy);

      if (distance > 1.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        let angleDiff = targetAngle - angle;

        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;

        angle += angleDiff * 0.28;
      }

      currentScale += (targetScale - currentScale) * 0.22;

      const activeSpeed = Math.max(distance * 0.05, scrollVelocity);
      let scaleX = currentScale * (1 - Math.min(activeSpeed * 0.04, 0.12));
      let scaleY = currentScale * (1 + Math.min(activeSpeed * 0.10, 0.30));

      if (isHovering) {
        scaleX = currentScale * 1.1;
        scaleY = currentScale * 1.1;
      }

      // Dynamic Flame SVG Length Expansion
      if (flameMain) {
        const flameStretch = 1 + activeSpeed * 0.4 + (isHovering ? 0.3 : 0);
        flameMain.style.transform = `scaleY(${flameStretch})`;
        if (flameInner) flameInner.style.transform = `scaleY(${flameStretch * 0.9})`;
      }

      // Add particles to pool during motion
      frameCount++;
      if (activeSpeed > 0.35 && frameCount % 3 === 0) {
        const nozzleAngleRad = (angle + 90) * (Math.PI / 180);
        const nozzleX = cursorX + Math.cos(nozzleAngleRad) * 14;
        const nozzleY = cursorY + Math.sin(nozzleAngleRad) * 14;
        addParticle(nozzleX, nozzleY, nozzleAngleRad, activeSpeed);
      }

      // Draw all canvas particles
      updateAndDrawParticles();

      // Position rocket cursor
      cursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

      requestAnimationFrame(animate);
    }

    animate();
  };

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCursor);
  } else {
    initCursor();
  }
})();
