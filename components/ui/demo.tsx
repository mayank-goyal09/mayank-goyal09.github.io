'use client';

import DigitStream from "@/components/ui/digit-stream";

const settings = {
  particleCount: 1790,
  speed: 0.74,
  flowStrength: 0.75,
  disperseStrength: 2,
  idleDim: 0.54,
  snakeAmplitude: 0.53,
  color: '#8b0000',
  background: '#000000',
  colorfulSparks: true,
}; 

// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO
export default function DemoOne(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return <DigitStream {...s} />;
}
