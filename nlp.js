// nlp.js

document.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.scroll-wrapper');
    
    let isMobile = window.innerWidth <= 768;
    
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
        // Force an update on resize
        updateAnimations();
    });

    function updateAnimations() {
        wrappers.forEach(wrapper => {
            const header = wrapper.querySelector('.header-content');
            const card = wrapper.querySelector('.card-container');
            
            if (!header || !card) return;

            // Get the bounding box of the wrapper relative to the viewport
            const rect = wrapper.getBoundingClientRect();
            
            let progress = 0;
            
            // maximum distance we can scroll within the wrapper (wrapper height - viewport height)
            const maxScrollDist = wrapper.offsetHeight - window.innerHeight;
            
            // rect.top is 0 when the top of the wrapper touches the top of viewport.
            if (rect.top <= 0) {
                const scrolled = Math.abs(rect.top); 
                // Clamp progress between 0 and 1
                progress = Math.min(Math.max(scrolled / maxScrollDist, 0), 1);
            } else if (rect.top > 0) {
                progress = 0;
            }
            
            // Define our animation start and end values
            const rotateStart = 20; // degrees
            const rotateEnd = 0;
            
            const scaleStart = isMobile ? 0.7 : 1.05;
            const scaleEnd = isMobile ? 0.9 : 1;
            
            const translateYStart = 0; // pixels
            const translateYEnd = -60;

            // Linear interpolation based on progress
            const currentRotate = rotateStart + (rotateEnd - rotateStart) * progress;
            const currentScale = scaleStart + (scaleEnd - scaleStart) * progress;
            const currentTranslateY = translateYStart + (translateYEnd - translateYStart) * progress;

            // Apply transforms
            header.style.transform = `translateY(${currentTranslateY}px)`;
            card.style.transform = `scale(${currentScale}) rotateX(${currentRotate}deg)`;
        });
    }

    // Trigger update on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateAnimations);
    });

    // Initialize the animation on load
    updateAnimations();
});
