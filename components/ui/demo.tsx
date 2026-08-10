'use client';

import DigitStream from "@/components/ui/digit-stream";

const settings = {
  particleCount: 1790,
  speed: 0.67,
  flowStrength: 0.66,
  disperseStrength: 2,
  idleDim: 0.6,
  snakeAmplitude: 0.5,
  color: '#ebeeff',
  background: '#000000',
  colorfulSparks: true,
};

// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO
export default function DemoOne(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return <DigitStream {...s} />;
}
