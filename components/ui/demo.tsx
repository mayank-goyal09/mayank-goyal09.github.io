import React from "react";
import CrystalTrailBackground from "@/components/ui/crystal-trail-background";

export default function DemoOne() {
  const glow = "0 0 5px #ff6b00, 0 0 10px #ff6b00";
  return (
    <main>
      <CrystalTrailBackground>
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center select-none text-center">
          <div className="p-8 sm:p-12">
            <h1
              className="m-0 font-serif font-bold uppercase tracking-widest text-5xl sm:text-7xl text-orange-200"
              style={{ textShadow: glow }}
            >
              Crystallize
            </h1>
            <h2 className="m-0 mt-2 font-sans uppercase tracking-[.2em] text-lg sm:text-2xl text-orange-200/70">
              Ephemeral Trail
            </h2>
          </div>
          <p className="absolute bottom-10 text-orange-200/40 text-sm px-4 font-mono">
            Movement leaves a fleeting trace of light.
          </p>
        </div>
      </CrystalTrailBackground>
    </main>
  );
}
