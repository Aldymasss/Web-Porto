// Simple touch scroll implementation for mobile sliders
document.addEventListener('DOMContentLoaded', function() {
    // Get all slider containers
    const sliders = document.querySelectorAll('.projects-slider');

    sliders.forEach(slider => {
        const container = slider.querySelector('.projects-grid');
        
        // Skip if no container found
        if (!container) return;
        
        // Variables to track touch events
        let startX;
        let scrollLeft;
        let isDown = false;

        // Touch event handlers
        container.addEventListener('touchstart', function(e) {
            isDown = true;
            container.classList.add('active');
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        }, { passive: true });

        container.addEventListener('touchend', function() {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('touchcancel', function() {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('touchmove', function(e) {
            if (!isDown) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            container.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    });
});
