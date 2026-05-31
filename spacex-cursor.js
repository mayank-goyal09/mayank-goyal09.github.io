// 🚀 SpaceX Custom Cursor (Ultra-smooth, Dynamic Trailing & Hover Broadening)
(() => {
  // Only initialize once
  if (document.getElementById("spacex-cursor")) return;

  const initCursor = () => {
    // 1. Create and inject the cursor element dynamically
    const cursor = document.createElement("div");
    cursor.id = "spacex-cursor";
    cursor.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <filter id="rocket-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00eaff" flood-opacity="0.8"/>
        </filter>
        <g filter="url(#rocket-glow)">
          <!-- Rocket Body (Starship style) -->
          <path d="M 50 10 C 65 30 65 60 65 80 L 35 80 C 35 60 35 30 50 10 Z" fill="#ffffff" />
          <!-- Fins -->
          <path d="M 35 60 L 20 85 L 35 80 Z" fill="#cbd5e1" />
          <path d="M 65 60 L 80 85 L 65 80 Z" fill="#cbd5e1" />
          <!-- Window -->
          <ellipse cx="50" cy="35" rx="4" ry="6" fill="#020617" />
          <ellipse cx="50" cy="34" rx="2" ry="3" fill="#00eaff" opacity="0.8" />
          <!-- Engine flame -->
          <path class="rocket-flame" d="M 40 80 Q 50 110 60 80 Z" fill="#ff4d00" opacity="0.9" />
          <path class="rocket-flame-inner" d="M 45 80 Q 50 100 55 80 Z" fill="#ffea00" />
        </g>
      </svg>
    `;
    
    // Add z-index and basic CSS styles inline to ensure it floats on top of absolutely everything
    cursor.style.position = "fixed";
    cursor.style.top = "0";
    cursor.style.left = "0";
    cursor.style.width = "32px";
    cursor.style.height = "32px";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "10000000"; // Enormous z-index so it floats above chatbots & elements!
    cursor.style.transformOrigin = "center center";
    cursor.style.willChange = "transform";
    
    document.body.appendChild(cursor);

    // 2. Trailing and rotation calculations
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    let angle = 0;
    let currentScale = 1;
    let targetScale = 1;

    // Track mouse coordinates
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Track hover states globally (Event Delegation for stellar performance)
    document.addEventListener("mouseover", (e) => {
      const target = e.target;
      if (target && (
        target.closest("a") || 
        target.closest("button") || 
        target.closest("[data-liquid-button]") ||
        target.closest(".skill-tile") ||
        target.closest(".ai-orb") ||
        target.closest(".cosmic-orb") ||
        target.closest(".project-card") ||
        target.closest(".channel-icon") ||
        target.closest(".experience-card") ||
        target.closest(".home-btn") ||
        target.closest(".explore-btn") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      )) {
        targetScale = 1.35;
        cursor.classList.add("hovering");
      }
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target;
      if (target && (
        target.closest("a") || 
        target.closest("button") || 
        target.closest("[data-liquid-button]") ||
        target.closest(".skill-tile") ||
        target.closest(".ai-orb") ||
        target.closest(".cosmic-orb") ||
        target.closest(".project-card") ||
        target.closest(".channel-icon") ||
        target.closest(".experience-card") ||
        target.closest(".home-btn") ||
        target.closest(".explore-btn") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      )) {
        targetScale = 1.0;
        cursor.classList.remove("hovering");
      }
    });

    // Main animation loop using RequestAnimationFrame
    function animate() {
      // Smooth translation (Interpolation / Lerp)
      const lerpFactor = 0.16; 
      cursorX += (mouseX - cursorX) * lerpFactor;
      cursorY += (mouseY - cursorY) * lerpFactor;

      // Calculate dynamic rotation based on the movement vector (cursor to mouse)
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      const distance = Math.hypot(dx, dy);

      // Only update the angle if the movement is significant to prevent idle jitter
      if (distance > 1.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        
        // Interpolate angle to avoid sudden 360 degree snap flips
        let angleDiff = targetAngle - angle;
        
        // Normalize angle difference to (-180, 180)
        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;
        
        angle += angleDiff * 0.25; // Smooth angle transitions
      }

      // Smooth scaling transition
      currentScale += (targetScale - currentScale) * 0.2;

      // Calculate uniform or non-uniform scaling (making it a bit broader on hover!)
      let scaleX = currentScale;
      let scaleY = currentScale;
      
      if (cursor.classList.contains("hovering")) {
        scaleX = currentScale * 1.15; // 15% wider to make it broader and more clickable!
        scaleY = currentScale * 0.95; // Slightly flatter for a stable thrust-heavy profile
      }

      // Apply transforms: Center cursor (16px offset), rotate and scale smoothly
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
