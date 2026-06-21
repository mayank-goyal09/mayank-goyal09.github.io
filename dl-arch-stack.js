// ============================================
// 🏛️ ARCHITECTURAL CARD STACK ENGINE
// GSAP-powered smooth stacked card interactions
// ============================================

(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    // ─── Configuration ───
    const CONFIG = {
        // Stacked (idle) card offsets
        stack: {
            // Each card gets progressively offset
            offsets: [
                { x: 0, y: 0, rotate: -1.2 },
                { x: 12, y: 100, rotate: 0.8 },
                { x: -8, y: 195, rotate: -0.5 },
                { x: 15, y: 285, rotate: 1.0 },
                { x: -5, y: 370, rotate: -0.3 },
                { x: 10, y: 450, rotate: 0.7 },
            ]
        },
        // Expanded (active) card positions
        expanded: {
            gap: 20,       // px between cards when expanded
            scaleUp: 1.03,
        },
        // Animation
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.06,
        // Column dimming
        dimScale: 0.95,
        dimOpacity: 0.55,
    };

    // ─── State ───
    let activeCol = null;
    let leaveTimer = null;
    const columns = document.querySelectorAll('.arch-col');

    // ─── Initialize card positions (stacked layout) ───
    function initStacks() {
        columns.forEach(col => {
            const cards = col.querySelectorAll('.arch-card');
            cards.forEach((card, i) => {
                const offset = CONFIG.stack.offsets[i] || CONFIG.stack.offsets[CONFIG.stack.offsets.length - 1];
                gsap.set(card, {
                    x: offset.x,
                    y: offset.y,
                    rotation: offset.rotate,
                    scale: 1,
                    opacity: 0.85 - (i * 0.05),
                    zIndex: cards.length - i,
                });
            });
        });
    }

    // ─── Expand a column's cards ───
    function expandColumn(col) {
        const cards = col.querySelectorAll('.arch-card');
        let runningY = 0;

        cards.forEach((card, i) => {
            // Measure card height for proper spacing
            const cardHeight = card.offsetHeight;

            gsap.to(card, {
                x: 0,
                y: runningY,
                rotation: 0,
                scale: CONFIG.expanded.scaleUp,
                opacity: 1,
                zIndex: i + 1,
                duration: CONFIG.duration,
                ease: CONFIG.ease,
                delay: i * CONFIG.stagger,
            });

            runningY += cardHeight + CONFIG.expanded.gap;
        });

        // Adjust the stack container height to fit all expanded cards
        const stack = col.querySelector('.arch-col-stack');
        if (stack) {
            gsap.to(stack, {
                minHeight: runningY + 20,
                duration: CONFIG.duration,
                ease: CONFIG.ease,
            });
        }
    }

    // ─── Collapse a column's cards back to stack ───
    function collapseColumn(col) {
        const cards = col.querySelectorAll('.arch-card');

        cards.forEach((card, i) => {
            const offset = CONFIG.stack.offsets[i] || CONFIG.stack.offsets[CONFIG.stack.offsets.length - 1];

            gsap.to(card, {
                x: offset.x,
                y: offset.y,
                rotation: offset.rotate,
                scale: 1,
                opacity: 0.85 - (i * 0.05),
                zIndex: cards.length - i,
                duration: CONFIG.duration,
                ease: CONFIG.ease,
                delay: i * CONFIG.stagger,
            });
        });

        // Reset stack height
        const stack = col.querySelector('.arch-col-stack');
        if (stack) {
            gsap.to(stack, {
                minHeight: 480,
                duration: CONFIG.duration,
                ease: CONFIG.ease,
            });
        }
    }

    // ─── Activate / Deactivate column focus ───
    function activateColumn(col) {
        if (activeCol === col) return;

        // Clear any pending leave timer
        if (leaveTimer) {
            clearTimeout(leaveTimer);
            leaveTimer = null;
        }

        // Deactivate previous
        if (activeCol) {
            collapseColumn(activeCol);
            activeCol.classList.remove('is-active');
        }

        activeCol = col;

        // Set CSS states
        columns.forEach(c => {
            if (c === col) {
                c.classList.add('is-active');
                c.classList.remove('is-dimmed');
            } else {
                c.classList.remove('is-active');
                c.classList.add('is-dimmed');
            }
        });

        expandColumn(col);
    }

    function deactivateAll() {
        leaveTimer = setTimeout(() => {
            if (activeCol) {
                collapseColumn(activeCol);
                activeCol = null;
            }

            columns.forEach(c => {
                c.classList.remove('is-active', 'is-dimmed');
            });
        }, 200);
    }

    // ─── Event Listeners ───
    columns.forEach(col => {
        // Mouse enter
        col.addEventListener('mouseenter', () => {
            activateColumn(col);
        });

        // Mouse leave
        col.addEventListener('mouseleave', () => {
            deactivateAll();
        });

        // Wheel/scroll on column expands it
        col.addEventListener('wheel', (e) => {
            if (activeCol !== col) {
                activateColumn(col);
            }
        }, { passive: true });
    });

    // ─── Parallax on scroll ───
    function setupParallax() {
        columns.forEach((col, i) => {
            const direction = i % 2 === 0 ? 1 : -1;
            gsap.to(col.querySelector('.arch-col-stack'), {
                y: direction * 25,
                ease: 'none',
                scrollTrigger: {
                    trigger: col,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });
        });
    }

    // ─── Entry animation on scroll ───
    function setupScrollEntrance() {
        columns.forEach((col, i) => {
            gsap.from(col, {
                y: 80,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: col,
                    start: 'top 85%',
                    once: true,
                },
            });
        });

        // Section intro
        const intro = document.querySelector('.arch-section-intro');
        if (intro) {
            gsap.from(intro, {
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: intro,
                    start: 'top 85%',
                    once: true,
                },
            });
        }
    }

    // ─── Init ───
    function init() {
        initStacks();
        setupParallax();
        setupScrollEntrance();
    }

    // Wait for DOM and fonts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to ensure layout is computed
        requestAnimationFrame(() => requestAnimationFrame(init));
    }

})();
