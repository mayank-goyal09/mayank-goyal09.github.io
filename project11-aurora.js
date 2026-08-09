// ============================================
// 🌌 PROJECT 11: AURORA BACKGROUND CANVAS SHADER
// Multi-layered animated aurora sky effect with pulsing radial gradients & twinkling stars
// Inspired by 21st.dev / Aceternity AuroraBackground
// ============================================

(function () {
    function initAurora() {
        const canvas = document.getElementById('auroraCanvas11');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let time = 0;

        // Star field configuration
        const STAR_COUNT = 100;
        const stars = [];

        function resize() {
            const parent = canvas.parentElement;
            width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
            height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
        }

        function initStars() {
            stars.length = 0;
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.4 + 0.4,
                    baseAlpha: Math.random() * 0.6 + 0.25,
                    twinkleSpeed: Math.random() * 0.03 + 0.01,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        window.addEventListener('resize', () => {
            resize();
            initStars();
        });
        resize();
        initStars();

        // Animated radial gradient blobs simulating dynamic polar aurora light
        const auroraBlobs = [
            { xRatio: 0.25, yRatio: 0.35, rRatio: 0.55, color: '139, 92, 246', speedX: 0.0004, speedY: 0.0006, phase: 0 },
            { xRatio: 0.75, yRatio: 0.45, rRatio: 0.60, color: '99, 102, 241', speedX: 0.0005, speedY: 0.0003, phase: 2.1 },
            { xRatio: 0.50, yRatio: 0.70, rRatio: 0.65, color: '217, 70, 239', speedX: 0.0003, speedY: 0.0005, phase: 4.2 },
            { xRatio: 0.35, yRatio: 0.80, rRatio: 0.50, color: '168, 85, 247', speedX: 0.0006, speedY: 0.0004, phase: 1.4 }
        ];

        function draw() {
            time += 1;
            ctx.clearRect(0, 0, width, height);

            // 1. Deep Space Base Gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#07030e');
            bgGrad.addColorStop(0.5, '#0d051c');
            bgGrad.addColorStop(1, '#050209');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // 2. Render Pulsing & Drifting Radial Aurora Lights
            auroraBlobs.forEach((blob) => {
                const cx = (blob.xRatio + Math.sin(time * blob.speedX + blob.phase) * 0.15) * width;
                const cy = (blob.yRatio + Math.cos(time * blob.speedY + blob.phase) * 0.15) * height;
                const radius = blob.rRatio * Math.max(width, height) * (1 + Math.sin(time * 0.001 + blob.phase) * 0.12);

                const alpha = 0.30 + Math.sin(time * 0.0015 + blob.phase) * 0.08;
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                grad.addColorStop(0, `rgba(${blob.color}, ${alpha})`);
                grad.addColorStop(0.5, `rgba(${blob.color}, ${alpha * 0.35})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
            });

            // 3. Render Twinkling Stars
            stars.forEach(star => {
                star.phase += star.twinkleSpeed;
                const currentAlpha = star.baseAlpha + Math.sin(star.phase) * 0.35;
                const alphaClamped = Math.max(0.1, Math.min(1, currentAlpha));

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alphaClamped})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAurora);
    } else {
        initAurora();
    }
})();
