// nlp.js

document.addEventListener('DOMContentLoaded', () => {
    let isMobile = window.innerWidth <= 768;
    
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
        calculateTargets();
    });

    // Initialize an array of project objects to hold target and current progress states
    const projects = Array.from(document.querySelectorAll('.scroll-wrapper')).map(wrapper => {
        return {
            wrapper: wrapper,
            header: wrapper.querySelector('.header-content'),
            card: wrapper.querySelector('.card-container'),
            targetProgress: 0,
            currentProgress: 0
        };
    });

    // This function only computes what the progress *should* be based on scroll position
    function calculateTargets() {
        projects.forEach(p => {
            const rect = p.wrapper.getBoundingClientRect();
            const maxScrollDist = p.wrapper.offsetHeight - window.innerHeight;
            
            if (rect.top <= 0) {
                const scrolled = Math.abs(rect.top); 
                p.targetProgress = Math.min(Math.max(scrolled / maxScrollDist, 0), 1);
            } else if (rect.top > 0) {
                p.targetProgress = 0;
            } else if (rect.bottom < window.innerHeight) {
                p.targetProgress = 1;
            }
        });
    }

        // Intersection Observer for graceful Text entry (fade-up and delayed link reveals)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        projects.forEach(p => {
            const sticky = p.wrapper.querySelector('.sticky-container');
            if (sticky) observer.observe(sticky);
        });

    // Continuous rendering loop for 'buttery smooth' damping
    function render() {
        projects.forEach(p => {
            if (!p.header || !p.card) return;

            // Lerp (Linear Interpolation) factor:
            // 0.08 offers a luxurious, dampened framer-motion style delay
            // It continuously closes 8% of the gap per frame
            p.currentProgress += (p.targetProgress - p.currentProgress) * 0.08;

            // Define animation bounds
            const rotateStart = 20; 
            const rotateEnd = 0;
            
            const scaleStart = isMobile ? 0.7 : 1.05;
            const scaleEnd = isMobile ? 0.9 : 1;
            
            const translateYStart = 0;
            const translateYEnd = -60;

            // Map progress to transform values
            const currentRotate = rotateStart + (rotateEnd - rotateStart) * p.currentProgress;
            const currentScale = scaleStart + (scaleEnd - scaleStart) * p.currentProgress;
            const currentTranslateY = translateYStart + (translateYEnd - translateYStart) * p.currentProgress;

            // Apply smoothly interpolated transforms
            p.header.style.transform = `translateY(${currentTranslateY}px)`;
            p.card.style.transform = `scale(${currentScale}) rotateX(${currentRotate}deg)`;
        });

        // Loop forever
        requestAnimationFrame(render);
    }

    // Update targets whenever the user scrolls
    window.addEventListener('scroll', calculateTargets, { passive: true });

    // Kickstart the logic
    calculateTargets();
    render();
});
