// Touch interaction enhancements for horizontal scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Get all project grid containers for sliders
    const sliderContainers = document.querySelectorAll('.projects-grid');
    
    // Set up touch scrolling for all slider containers
    sliderContainers.forEach(slider => {
        setupTouchScrolling(slider);
    });
    
    // Show touch hint on mobile devices
    if (window.innerWidth <= 768) {
        showTouchHint();
    }
    
    function setupTouchScrolling(slider) {
        // Use the slider element directly instead of querying for it
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
    } // End of setupTouchScrolling function
    
    // Function to show touch hint
    function showTouchHint() {
        // Create touch hint element
        const touchHint = document.createElement('div');
        touchHint.className = 'touch-hint';
        touchHint.innerHTML = '<span>← Geser untuk melihat konten →</span>';
        document.body.appendChild(touchHint);
        
        // Add CSS for the touch hint
        const style = document.createElement('style');
        style.textContent = `
            .touch-hint {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(92, 105, 75, 0.85);
                color: white;
                padding: 10px 20px;
                border-radius: 30px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                animation: pulse 2s infinite;
                transition: opacity 0.5s;
            }
            
            @keyframes pulse {
                0% { transform: translateX(-50%) scale(0.95); }
                50% { transform: translateX(-50%) scale(1.05); }
                100% { transform: translateX(-50%) scale(0.95); }
            }
        `;
        document.head.appendChild(style);
        
        // Show for 3 seconds then fade out
        setTimeout(() => {
            touchHint.style.opacity = '0';
            setTimeout(() => {
                touchHint.remove();
            }, 1000);
        }, 3000);
    }
});
