// 🚀 SpaceX Custom Cursor (Symmetrical Alignment, Nozzle-Aligned Particle Stream & Scroll Warp)
(() => {
  // Only initialize once
  if (document.getElementById("spacex-cursor")) return;

  const initCursor = () => {
    // 1. Suppress native cursors globally & reset any SVG rotation overrides
    const globalStyle = document.createElement("style");
    globalStyle.textContent = `
      html, body, a, button, input, select, textarea, [role="button"], .explore-btn, .home-btn, .skill-tile, .card-inner {
        cursor: none !important;
      }
      #spacex-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 34px;
        height: 34px;
        pointer-events: none;
        z-index: 10000000;
        transform-origin: 50% 50%;
        will-change: transform;
        transition: filter 0.15s ease-out;
      }
      #spacex-cursor svg {
        width: 100%;
        height: 100%;
        transform: none !important;
        overflow: visible;
      }
      .spacex-star-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        z-index: 9999999;
        transform-origin: 50% 50%;
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(globalStyle);

    // 2. Create and inject the cursor element dynamically (100x100 Symmetrical ViewBox Grid)
    const cursor = document.createElement("div");
    cursor.id = "spacex-cursor";
    cursor.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <filter id="rocket-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow id="shadow-primary" dx="0" dy="0" stdDeviation="4" flood-color="#00eaff" flood-opacity="0.85"/>
        </filter>
        <g filter="url(#rocket-glow)">
          <!-- Engine flame outer (transform-box: fill-box guarantees 100% symmetric scaling from nozzle center X=50) -->
          <path id="rocket-flame-main" d="M 40 72 Q 50 96 60 72 Z" fill="#ff4d00" opacity="0.95" style="transform-box: fill-box; transform-origin: 50% 0%; transition: fill 0.2s;" />
          <!-- Engine flame inner core -->
          <path id="rocket-flame-inner" d="M 45 72 Q 50 88 55 72 Z" fill="#ffea00" style="transform-box: fill-box; transform-origin: 50% 0%; transition: fill 0.2s;" />
          <!-- Rocket Body (Starship style) -->
          <path d="M 50 8 C 65 26 65 54 65 72 L 35 72 C 35 54 35 26 50 8 Z" fill="#ffffff" />
          <!-- Fins (Symmetric 20 to 80) -->
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
    const shadowPrimary = cursor.querySelector("#shadow-primary");

    // 3. Coordinate, angle, scale & velocity tracking
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

    // Track mouse coordinates
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Track scroll velocity for dynamic thruster & hyper-jump warp stretch
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.08, 2.5); // Cap velocity scale
      lastScrollY = currentScrollY;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrollVelocity = 0;
      }, 100);
    }, { passive: true });

    // Track hover states globally
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
        if (shadowPrimary) {
          shadowPrimary.setAttribute("flood-color", "#a855f7");
          shadowPrimary.setAttribute("stdDeviation", "7");
        }
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      if (isInteractive(e.target)) {
        isHovering = false;
        targetScale = 1.0;
        cursor.classList.remove("hovering");
        if (flameMain) flameMain.setAttribute("fill", "#ff4d00");
        if (flameInner) flameInner.setAttribute("fill", "#ffea00");
        if (shadowPrimary) {
          shadowPrimary.setAttribute("flood-color", "#00eaff");
          shadowPrimary.setAttribute("stdDeviation", "4");
        }
      }
    }, { passive: true });

    // Stardust particle spawner aligned perfectly with nozzle vector
    const particleColors = ["#00eaff", "#a855f7", "#c084fc", "#ffea00", "#38bdf8"];
    function spawnParticle(nozzleX, nozzleY, nozzleAngleRad, speedFactor) {
      const particle = document.createElement("div");
      particle.className = "spacex-star-particle";
      const size = Math.random() * 3.5 + 2;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 8px ${color}`;
      
      // Center particle at nozzle position
      particle.style.left = `${nozzleX - size / 2}px`;
      particle.style.top = `${nozzleY - size / 2}px`;

      document.body.appendChild(particle);

      // Particle drifts straight backwards out of rear nozzle with narrow ±12° cone spread
      const coneSpread = (Math.random() * 24 - 12) * (Math.PI / 180);
      const driftAngleRad = nozzleAngleRad + coneSpread;
      const moveDist = 18 + Math.random() * 25 * speedFactor;
      
      const deltaX = Math.cos(driftAngleRad) * moveDist;
      const deltaY = Math.sin(driftAngleRad) * moveDist;

      let opacity = 1;
      const startTime = performance.now();
      const duration = 350 + Math.random() * 200;

      function stepParticle(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        opacity = 1 - progress;

        const currentDx = deltaX * progress;
        const currentDy = deltaY * progress;
        const currentScale = 1 - progress * 0.5;

        particle.style.transform = `translate3d(${currentDx}px, ${currentDy}px, 0) scale(${currentScale})`;
        particle.style.opacity = opacity;

        if (progress < 1) {
          requestAnimationFrame(stepParticle);
        } else {
          particle.remove();
        }
      }
      requestAnimationFrame(stepParticle);
    }

    let particleCounter = 0;

    // Main animation loop
    function animate() {
      // Smooth translation (Interpolation / Lerp)
      const lerpFactor = 0.18;
      cursorX += (mouseX - cursorX) * lerpFactor;
      cursorY += (mouseY - cursorY) * lerpFactor;

      // Calculate dynamic rotation based on movement vector
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      const distance = Math.hypot(dx, dy);

      if (distance > 1.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        let angleDiff = targetAngle - angle;

        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;

        angle += angleDiff * 0.25;
      }

      // Smooth scaling transition
      currentScale += (targetScale - currentScale) * 0.2;

      // Symmetrical Longitudinal Stretch
      const activeSpeed = Math.max(distance * 0.05, scrollVelocity);
      let scaleX = currentScale * (1 - Math.min(activeSpeed * 0.04, 0.12));
      let scaleY = currentScale * (1 + Math.min(activeSpeed * 0.10, 0.30));

      if (isHovering) {
        scaleX = currentScale * 1.1;
        scaleY = currentScale * 1.1;
      }

      // Dynamic Flame SVG Length Expansion
      if (flameMain) {
        const flameStretch = 1 + activeSpeed * 0.5 + (isHovering ? 0.4 : 0);
        flameMain.style.transform = `scaleY(${flameStretch})`;
        if (flameInner) flameInner.style.transform = `scaleY(${flameStretch * 0.9})`;
      }

      // Spawn stardust trail particles aligned EXACTLY with the rear nozzle direction
      particleCounter++;
      if (activeSpeed > 0.35 && particleCounter % 3 === 0) {
        // Nozzle is at angle + 90 degrees in standard screen trig coordinates
        const nozzleAngleRad = (angle + 90) * (Math.PI / 180);
        const nozzleX = cursorX + Math.cos(nozzleAngleRad) * 14;
        const nozzleY = cursorY + Math.sin(nozzleAngleRad) * 14;
        spawnParticle(nozzleX, nozzleY, nozzleAngleRad, activeSpeed);
      }

      // Apply transforms: Center cursor (17px offset), rotate and scale smoothly
      cursor.style.transform = `translate3d(${cursorX - 17}px, ${cursorY - 17}px, 0) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

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
