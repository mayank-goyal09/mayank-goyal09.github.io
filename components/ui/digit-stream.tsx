'use client';

import { useEffect, useRef } from 'react';

export interface DigitStreamProps {
  particleCount?: number;
  speed?: number;
  flowStrength?: number;
  disperseStrength?: number;
  idleDim?: number;
  snakeAmplitude?: number;
  color?: string;
  background?: string;
  colorfulSparks?: boolean;
  className?: string;
}

const DEFAULTS = {
  particleCount: 750,
  speed: 0.4,
  flowStrength: 0.5,
  disperseStrength: 1,
  idleDim: 0.6,
  snakeAmplitude: 0.5,
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

function pathPoint(t: number, amp: number) {
  const amp2 = amp * 0.37;
  return {
    x: 0.5 + amp * Math.sin((t * WAVES + PHASE) * TAU) + amp2 * Math.sin((t * WAVES2 + PHASE2) * TAU),
    y: -0.06 + t * 1.12 + AMPY * Math.sin(t * WAVESY * TAU),
  };
}
function pathTangent(t: number, amp: number) {
  const e = 0.001;
  const a = pathPoint(Math.max(0, t - e), amp);
  const b = pathPoint(Math.min(1, t + e), amp);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

interface Particle {
  t: number; off: number; speed: number; size: number;
  hue: number; colorful: boolean; life: number;
  wAmp: number; wFreq: number; wPhase: number; ch: string;
  dAx: number; dAy: number; dFx: number; dFy: number; dPx: number; dPy: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randDigit = () =>
  Math.random() < 0.5 ? (Math.random() < 0.5 ? '7' : '0') : String(Math.floor(Math.random() * 10));

function spawn(): Particle {
  const wide = Math.random() < 0.65;
  const t = Math.random();
  return {
    t,
    off: wide ? rand(-0.4, 0.4) : rand(-0.1, 0.1),
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

function hexToRgb(hex: string, fb: [number, number, number]): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fb;
}

export function DigitStream(props: DigitStreamProps) {
  const p = { ...DEFAULTS, ...props };
  const propsRef = useRef(p);
  propsRef.current = p;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dims = useRef({ w: 0, h: 0 });
  const particles = useRef<Particle[]>([]);
  const bright = useRef(1);
  const disperse = useRef(0);
  const drift = useRef(0);
  const flow = useRef(0);
  const lastActivity = useRef(0);

  useEffect(() => {
    const arr = particles.current;
    const target = Math.max(1, Math.round(propsRef.current.particleCount));
    while (arr.length < target) arr.push(spawn());
    if (arr.length > target) arr.length = target;
  }, [props.particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dims.current = { w: r.width, h: r.height };
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    if (particles.current.length === 0) {
      particles.current = Array.from(
        { length: Math.max(1, Math.round(propsRef.current.particleCount)) },
        spawn,
      );
    }

    let lastScrollY = window.scrollY;
    const bump = (delta: number) => {
      flow.current += delta * 0.0007 * propsRef.current.flowStrength;
      lastActivity.current = performance.now();
    };
    const onScroll = () => { bump(window.scrollY - lastScrollY); lastScrollY = window.scrollY; };
    const onWheel = (e: WheelEvent) => bump(e.deltaY);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const c2 = ctxRef.current;
      if (!c2) return;
      const { w, h } = dims.current;
      if (!w || !h) return;
      const P = propsRef.current;
      const amp = P.snakeAmplitude * 0.3;
      const speedK = P.speed / 0.4;
      const idle = performance.now() - lastActivity.current > IDLE_MS;
      bright.current += ((idle ? P.idleDim : 1) - bright.current) * (idle ? 0.03 : 0.12);
      disperse.current += ((idle ? 1 : 0) - disperse.current) * (idle ? 0.01 : 0.06);
      drift.current += 0.02;
      const disp = disperse.current * P.disperseStrength;
      const dt = drift.current;
      const [cr, cg, cb] = hexToRgb(P.color, [235, 238, 255]);
      const [br, bg2, bb] = hexToRgb(P.background, [0, 0, 0]);

      c2.globalCompositeOperation = 'source-over';
      c2.fillStyle = `rgba(${br},${bg2},${bb},0.14)`;
      c2.fillRect(0, 0, w, h);

      c2.globalCompositeOperation = 'lighter';
      c2.textAlign = 'center';
      c2.textBaseline = 'middle';
      const spark = P.colorfulSparks;
      for (const pt of particles.current) {
        pt.t += pt.speed * speedK;
        if (pt.t >= 1) pt.t -= 1;
        if (Math.random() < 0.003) pt.ch = randDigit();
        let et = pt.t + flow.current;
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
        const alpha = (0.25 * coreFade * pt.life + 0.02) * bright.current;
        c2.font = `${pt.size}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
        c2.fillStyle = spark && pt.colorful
          ? `hsla(${pt.hue}, 60%, 66%, ${alpha})`
          : `rgba(${cr},${cg},${cb},${alpha})`;
        c2.fillText(pt.ch, x, y);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <section
      className={`relative h-screen w-full overflow-hidden ${props.className ?? ''}`}
      style={{ backgroundColor: p.background }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </section>
  );
}

export default DigitStream;
