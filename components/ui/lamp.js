/* lamp.js */

document.addEventListener('DOMContentLoaded', () => {
    const lampContainer = document.querySelector('.lamp-container');
    const beamLeft = document.querySelector('.lamp-beam-left');
    const beamRight = document.querySelector('.lamp-beam-right');
    const glowPill = document.querySelector('.lamp-glow-pill');
    const glowLine = document.querySelector('.lamp-glow-line');

    if (!lampContainer) return;

    // Verify initial values to ensure we can transition smoothly
    if (beamLeft) beamLeft.style.width = '15rem';
    if (beamRight) beamRight.style.width = '15rem';
    if (glowPill) glowPill.style.width = '8rem';
    if (glowLine) glowLine.style.width = '15rem';

    // Intersection Observer to run the animation when it enters the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class that enables the graphic wrapper opacity and translateY animation
                lampContainer.classList.add('in-view');

                // Let the transition trigger shortly after
                setTimeout(() => {
                    if (beamLeft) beamLeft.style.width = '30rem';
                    if (beamRight) beamRight.style.width = '30rem';
                    if (glowPill) glowPill.style.width = '16rem';
                    if (glowLine) glowLine.style.width = '30rem';
                }, 300); // Mimics the 0.3s delay in the framer-motion React counterpart
            } else {
                // Reset state when it leaves view, allowing re-trigger
                lampContainer.classList.remove('in-view');
                if (beamLeft) beamLeft.style.width = '15rem';
                if (beamRight) beamRight.style.width = '15rem';
                if (glowPill) glowPill.style.width = '8rem';
                if (glowLine) glowLine.style.width = '15rem';
            }
        });
    }, { threshold: 0.15 });

    observer.observe(lampContainer);

    // ==========================================================================
    // HIGH-FIDELITY ANIMATED VOLUMETRIC CLOUDS (HTML5 CANVAS VERSION)
    // ==========================================================================
    const project6Bg = document.getElementById('project-6-bg');
    const canvas = project6Bg ? project6Bg.querySelector('.lamp-clouds-canvas') : null;
    if (!canvas || !project6Bg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = project6Bg.clientWidth || window.innerWidth;
    let height = canvas.height = project6Bg.clientHeight || window.innerHeight;

    // Use ResizeObserver to dynamically resize the canvas to its container size, preventing 0-size initialization bugs!
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            // Get actual border box dimensions
            width = canvas.width = entry.contentRect.width || project6Bg.clientWidth || window.innerWidth;
            height = canvas.height = entry.contentRect.height || project6Bg.clientHeight || window.innerHeight;
        }
    });
    resizeObserver.observe(project6Bg);

    // Staggered premium palette matching the smokey reference image:
    // Large warm golden, amber, and bronze radial gradient particles
    const cloudColors = [
        { r: 180, g: 105, b: 0 },   // Volumetric amber
        { r: 139, g: 74, b: 2 },     // Deep copper bronze
        { r: 234, g: 170, b: 5 },    // Shimmering gold aura
        { r: 217, g: 140, b: 4 },    // warm honey gold
        { r: 156, g: 60, b: 8 }      // Rich bronze reddish amber
    ];

    const particles = [];
    const numParticles = 14; // Volumetric density increased for rich smokey depth

    for (let i = 0; i < numParticles; i++) {
        const colorObj = cloudColors[i % cloudColors.length];
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.16, // Slow drifting velocities
            vy: (Math.random() - 0.5) * 0.16,
            baseRadius: 180 + Math.random() * 120, // Significantly larger to blend smoothly
            pulseSpeed: 0.0006 + Math.random() * 0.0006,
            pulseAngle: Math.random() * Math.PI * 2,
            color: colorObj,
            baseAlpha: 0.24 + Math.random() * 0.22 // High-fidelity opacity stops to ensure high visibility
        });
    }

    function animateClouds() {
        ctx.clearRect(0, 0, width, height);

        // Render clouds smoothly whenever the card is in viewport (in-view class set by observer)
        const nuanceProgress = lampContainer.classList.contains('in-view') ? 1.0 : 0.0;

        particles.forEach(p => {
            // Update drifting positions
            p.x += p.vx;
            p.y += p.vy;

            // Bounce cloud puffs smoothly off card boundaries to keep them contained
            if (p.x < -150) { p.x = -150; p.vx *= -1; }
            if (p.x > width + 150) { p.x = width + 150; p.vx *= -1; }
            if (p.y < -150) { p.y = -150; p.vy *= -1; }
            if (p.y > height + 150) { p.y = height + 150; p.vy *= -1; }

            // Slowly pulse phase angle
            p.pulseAngle += p.pulseSpeed;

            // Pulsating volumetric scale
            const radiusPulse = Math.sin(p.pulseAngle) * 35;
            const currentRadius = p.baseRadius + radiusPulse;
            
            // Pulsating organic opacity
            const alphaPulse = Math.sin(p.pulseAngle * 1.4) * 0.04;
            const currentAlpha = Math.max(0, (p.baseAlpha + alphaPulse) * nuanceProgress);

            if (currentAlpha > 0.001) {
                // High-fidelity radial gradient simulating volumetric smoke
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
                grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`);
                grad.addColorStop(0.35, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.48})`);
                grad.addColorStop(0.7, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.14})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestAnimationFrame(animateClouds);
    }

    animateClouds();
});
