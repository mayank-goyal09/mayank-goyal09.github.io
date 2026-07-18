import React from 'react';

// This is a self-contained React component that creates a "Celestial Loom" effect.
// An evolution of the "Aether Weave", this simulates a cosmic loom with a static
// grid and a dynamic shuttle weaving threads of light. The effect is achieved
// through layered procedural animations and CSS gradients.
// Custom colors and fonts are adjusted for the Agri-SMS Sentinel theme.
export const Component = () => {
    // Generate a random number within a range
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    // Tailored emerald green agricultural colors
    const colors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#047857", "#065f46", "#a7f3d0", "#d1fae5"];

    return (
        <main className="hero-section w-full h-screen relative overflow-hidden bg-slate-950">
            <div className="warp-grid"></div>

            {/* Procedurally generate multiple shuttle runs */}
            {[...Array(25)].map((_, i) => {
                const duration = random(5, 12);
                const delay = random(0, 10);
                const position = `${random(5, 95)}%`;
                const color = colors[Math.floor(random(0, colors.length))];
                
                return (
                    <div key={i} className="shuttle-run" style={{
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                    } as React.CSSProperties}>
                        <div className="shuttle" style={{
                            '--position': position,
                            '--color': color,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                        } as React.CSSProperties}></div>
                        <div className="weft-thread" style={{
                            '--position': position,
                            '--color': color,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                        } as React.CSSProperties}></div>
                    </div>
                );
            })}

            {/* The content container is empty */}
            <div className="relative z-10 text-center p-8 max-w-2xl">
            </div>
        </main>
    );
}
