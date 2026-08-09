// ============================================
// 🌌 PROJECT 11: AURORA BACKGROUND CANVAS SHADER
// Exact implementation of 21st.dev AuroraBackground Component
// gradientColors: ["rgba(99,102,241,0.2)", "rgba(139,92,246,0.2)"]
// pulseDuration: 8s | starCount: 80
// ============================================

(function () {
    function initAurora() {
        const canvas = document.getElementById('auroraCanvas11');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let time = 0;

        // Star count matching demoProps: 80 stars
        const STAR_COUNT = 80;
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
                    radius: Math.random() * 1.2 + 0.4,
                    baseAlpha: Math.random() * 0.5 + 0.2,
                    twinkleSpeed: (Math.random() * 0.02 + 0.01),
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

        // Exact gradient colors from 21st.dev AuroraBackgroundProps:
        // rgba(99,102,241,0.2) and rgba(139,92,246,0.2)
        const auroraBlobs = [
            { xRatio: 0.35, yRatio: 0.40, rRatio: 0.65, color: '99, 102, 241', baseAlpha: 0.20, speed: 0.0007, phase: 0 },
            { xRatio: 0.65, yRatio: 0.50, rRatio: 0.70, color: '139, 92, 246', baseAlpha: 0.22, speed: 0.0005, phase: 2.5 },
            { xRatio: 0.45, yRatio: 0.65, rRatio: 0.60, color: '168, 85, 247', baseAlpha: 0.18, speed: 0.0006, phase: 4.0 }
        ];

        function draw() {
            time += 1;
            ctx.clearRect(0, 0, width, height);

            // 1. Deep Dark Base Background (#06020a / #050209)
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#06020a');
            bgGrad.addColorStop(0.5, '#0b0416');
            bgGrad.addColorStop(1, '#050209');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // 2. Render 8s Pulsing & Floating Radial Gradients matching 21st.dev
            auroraBlobs.forEach((blob) => {
                // 8s pulse period (~480 frames at 60fps)
                const pulse = Math.sin((time / 480) * Math.PI * 2 + blob.phase);
                const cx = (blob.xRatio + pulse * 0.08) * width;
                const cy = (blob.yRatio + Math.cos((time / 480) * Math.PI * 2 + blob.phase) * 0.08) * height;
                const radius = blob.rRatio * Math.max(width, height) * (1 + pulse * 0.08);
                const currentAlpha = blob.baseAlpha + pulse * 0.05;

                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                grad.addColorStop(0, `rgba(${blob.color}, ${currentAlpha})`);
                grad.addColorStop(0.5, `rgba(${blob.color}, ${currentAlpha * 0.4})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
            });

            // 3. Render 80 Twinkling Stars
            stars.forEach(star => {
                star.phase += star.twinkleSpeed;
                const currentAlpha = star.baseAlpha + Math.sin(star.phase) * 0.3;
                const alphaClamped = Math.max(0.08, Math.min(0.95, currentAlpha));

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alphaClamped})`;
                ctx.shadowBlur = 3;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
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
