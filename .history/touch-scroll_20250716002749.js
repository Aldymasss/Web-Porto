// Touch interaction enhancements for horizontal scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Set up touch scrolling for all sliders
    setupTouchScrolling('#recommendations-container');
    setupTouchScrolling('#slider-container');
    
    function setupTouchScrolling(containerSelector) {
        // Target the slider container
        const slider = document.querySelector(containerSelector);
        if (!slider) return;
    
    // Variables to track touch movement
    let startX;
    let scrollLeft;
    let isDown = false;
    let momentumID;
    let velocity = 0;
    let timestamp = 0;
    
    // Add touch events for better mobile experience
    slider.addEventListener('touchstart', function(e) {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        timestamp = Date.now();
        
        // Cancel momentum scrolling if user touches the slider
        if (momentumID) {
            cancelAnimationFrame(momentumID);
            momentumID = null;
        }
        
        // Add grabbing visual feedback
        slider.style.cursor = 'grabbing';
        slider.classList.add('active');
    }, { passive: true });
    
    slider.addEventListener('touchend', function() {
        isDown = false;
        
        // Calculate velocity for momentum scrolling
        const now = Date.now();
        const elapsed = now - timestamp;
        
        // Only apply momentum if touch ended quickly (like a swipe)
        if (elapsed < 150) {
            // Apply momentum scrolling
            const momentumScroll = () => {
                if (Math.abs(velocity) > 0.5) {
                    slider.scrollLeft += velocity;
                    velocity *= 0.95; // Decrease velocity with friction
                    momentumID = requestAnimationFrame(momentumScroll);
                }
            };
            momentumID = requestAnimationFrame(momentumScroll);
        }
        
        // Remove grabbing visual feedback
        slider.style.cursor = 'grab';
        slider.classList.remove('active');
    }, { passive: true });
    
    slider.addEventListener('touchmove', function(e) {
        if (!isDown) return;
        
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = x - startX;
        
        // Update velocity for momentum scrolling
        const now = Date.now();
        const elapsed = now - timestamp;
        timestamp = now;
        
        // Calculate velocity (pixels per millisecond)
        velocity = walk / elapsed * 10;
        
        // Update scroll position
        slider.scrollLeft = scrollLeft - walk;
    }, { passive: false });
});
