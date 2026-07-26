// project4-beams.js
// Vanilla JS port of BeamsBackground (React canvas component)
// Adapted with red/rose/crimson hues for the Beep-for-Abuse project card

const initBeamsBackground = () => {
    const container = document.querySelector('#project-4-bg');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.filter = 'blur(15px)';
    container.insertBefore(canvas, container.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const MINIMUM_BEAMS = 20;
    const TOTAL_BEAMS = Math.floor(MINIMUM_BEAMS * 1.5);
    let beams = [];
    let animationFrameId = 0;

    function createBeam(w, h) {
        const angle = -35 + Math.random() * 10;
        return {
            x: Math.random() * w * 1.5 - w * 0.25,
            y: Math.random() * h * 1.5 - h * 0.25,
            width: 30 + Math.random() * 60,
            length: h * 2.5,
            angle: angle,
            speed: 0.6 + Math.random() * 1.2,
            opacity: 0.12 + Math.random() * 0.16,
            // Hue range: reds, roses, crimsons (340-380 wraps to 340-20)
            hue: 340 + Math.random() * 40,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03
        };
    }

    function resetBeam(beam, index) {
        const column = index % 3;
        const spacing = canvas.width / 3;

        beam.y = canvas.height + 100;
        beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
        beam.width = 100 + Math.random() * 100;
        beam.speed = 0.5 + Math.random() * 0.4;
        beam.hue = 340 + (index * 40) / TOTAL_BEAMS;
        beam.opacity = 0.2 + Math.random() * 0.1;
        return beam;
    }

    function drawBeam(beam) {
        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);

        // Pulsing opacity for that alive, breathing feel
        const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2);

        const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
        const h = beam.hue % 360;

        gradient.addColorStop(0, `hsla(${h}, 85%, 55%, 0)`);
        gradient.addColorStop(0.1, `hsla(${h}, 85%, 55%, ${pulsingOpacity * 0.5})`);
        gradient.addColorStop(0.4, `hsla(${h}, 85%, 55%, ${pulsingOpacity})`);
        gradient.addColorStop(0.6, `hsla(${h}, 85%, 55%, ${pulsingOpacity})`);
        gradient.addColorStop(0.9, `hsla(${h}, 85%, 55%, ${pulsingOpacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${h}, 85%, 55%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
        ctx.restore();
    }

    function updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);

        // Re-initialize beams on resize
        beams = Array.from({ length: TOTAL_BEAMS }, () =>
            createBeam(rect.width, rect.height)
        );
    }

    let isVisible = true;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationFrameId) {
                animationFrameId = requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.05 });

    observer.observe(canvas);
    canvas.style.filter = 'blur(35px)';

    function animate() {
        if (!isVisible) {
            animationFrameId = null;
            return;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        beams.forEach((beam, index) => {
            beam.y -= beam.speed;
            beam.pulse += beam.pulseSpeed;

            if (beam.y + beam.length < -100) {
                resetBeam(beam, index);
            }

            drawBeam(beam);
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    let canvasWidth = 0;
    let canvasHeight = 0;

    function updateCanvasSize() {
        const rect = container.getBoundingClientRect();
        canvasWidth = rect.width;
        canvasHeight = rect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    animationFrameId = requestAnimationFrame(animate);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBeamsBackground);
} else {
    initBeamsBackground();
}
