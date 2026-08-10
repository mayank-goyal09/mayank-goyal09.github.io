// digit-stream.js - Vanilla JS Canvas Adapter for Digit Stream background of Project 04 (Beep-for-Abuse)
(function () {
  const settings = {
    particleCount: 1790,
    speed: 0.74,
    flowStrength: 0.75,
    disperseStrength: 2,
    idleDim: 0.54,
    snakeAmplitude: 0.53,
    color: '#ebeeff',
    background: '#000000',
    colorfulSparks: true,
  };

  const TAU = Math.PI * 2;
  const WAVES = 2.4;
  const WAVES2 = 5.5;
  const PHASE = -0.35;
  const PHASE2 = 0.2;
  const WAVESY = 3;
  const AMPY = 0.02;
  const IDLE_MS = 160;

  function pathPoint(t, amp) {
    const amp2 = amp * 0.37;
    return {
      x: 0.5 + amp * Math.sin((t * WAVES + PHASE) * TAU) + amp2 * Math.sin((t * WAVES2 + PHASE2) * TAU),
      y: -0.06 + t * 1.12 + AMPY * Math.sin(t * WAVESY * TAU),
    };
  }

  function pathTangent(t, amp) {
    const e = 0.001;
    const a = pathPoint(Math.max(0, t - e), amp);
    const b = pathPoint(Math.min(1, t + e), amp);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const randDigit = () =>
    Math.random() < 0.5 ? (Math.random() < 0.5 ? '7' : '0') : String(Math.floor(Math.random() * 10));

  function spawn() {
    const wide = Math.random() < 0.28;
    const t = Math.random();
    return {
      t,
      off: wide ? rand(-0.16, 0.16) : rand(-0.03, 0.03),
      speed: rand(0.0001, 0.0004),
      size: Math.round(rand(7, 13)),
      hue: rand(190, 320),
      colorful: Math.random() < 0.3 && t < 0.55,
      life: rand(0.5, 1),
      wAmp: rand(0.02, 0.1),
      wFreq: rand(1.5, 5),
      wPhase: rand(0, TAU),
      ch: randDigit(),
      dAx: rand(0.06, 0.24) * (Math.random() < 0.5 ? -1 : 1),
      dAy: rand(0.02, 0.09) * (Math.random() < 0.5 ? -1 : 1),
      dFx: rand(0.3, 1.1),
      dFy: rand(0.3, 1.1),
      dPx: rand(0, TAU),
      dPy: rand(0, TAU),
    };
  }

  function hexToRgb(hex, fb) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fb;
  }

  function initDigitStream() {
    const container = document.getElementById('project-4-bg');
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    container.insertBefore(canvas, container.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dims = { w: 0, h: 0 };
    const particles = [];
    let bright = 1;
    let disperse = 0;
    let drift = 0;
    let flow = 0;
    let lastActivity = 0;

    const targetCount = Math.max(1, Math.round(settings.particleCount));
    for (let i = 0; i < targetCount; i++) {
      particles.push(spawn());
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const r = container.getBoundingClientRect();
      dims.w = r.width;
      dims.h = r.height;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let lastScrollY = window.scrollY;
    const bump = (delta) => {
      flow += delta * 0.0007 * settings.flowStrength;
      lastActivity = performance.now();
    };

    const onScroll = () => {
      bump(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
    };
    const onWheel = (e) => bump(e.deltaY);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) {
          raf = requestAnimationFrame(frame);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);

    let raf = 0;
    const frame = () => {
      if (!isVisible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);

      const { w, h } = dims;
      if (!w || !h) return;

      const amp = settings.snakeAmplitude * 0.3;
      const speedK = settings.speed / 0.4;
      const idle = performance.now() - lastActivity > IDLE_MS;

      bright += ((idle ? settings.idleDim : 1) - bright) * (idle ? 0.03 : 0.12);
      disperse += ((idle ? 1 : 0) - disperse) * (idle ? 0.01 : 0.06);
      drift += 0.02;

      const disp = disperse * settings.disperseStrength;
      const dt = drift;
      const [cr, cg, cb] = hexToRgb(settings.color, [235, 238, 255]);
      const [br, bg2, bb] = hexToRgb(settings.background, [0, 0, 0]);

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(${br},${bg2},${bb},0.14)`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const spark = settings.colorfulSparks;
      for (const pt of particles) {
        pt.t += pt.speed * speedK;
        if (pt.t >= 1) pt.t -= 1;
        if (Math.random() < 0.003) pt.ch = randDigit();

        let et = pt.t + flow;
        et -= Math.floor(et);

        const c = pathPoint(et, amp);
        const tan = pathTangent(et, amp);
        const wander = pt.wAmp * Math.sin(et * pt.wFreq * TAU + pt.wPhase);
        const totalOff = pt.off + wander;

        const wx = disp * pt.dAx * Math.sin(dt * pt.dFx + pt.dPx);
        const wy = disp * pt.dAy * Math.sin(dt * pt.dFy + pt.dPy);

        const x = (c.x + -tan.y * totalOff + wx) * w;
        const y = (c.y + tan.x * totalOff + wy) * h;

        const coreFade = 1 - Math.min(1, Math.abs(totalOff) / 0.22);
        const alpha = (0.25 * coreFade * pt.life + 0.02) * bright;

        ctx.font = `${pt.size}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
        ctx.fillStyle = spark && pt.colorful
          ? `hsla(${pt.hue}, 60%, 66%, ${alpha})`
          : `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fillText(pt.ch, x, y);
      }
    };

    raf = requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDigitStream);
  } else {
    initDigitStream();
  }
})();
