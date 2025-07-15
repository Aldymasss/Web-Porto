// Horizontal auto-scrolling functionality for Menu Project section
document.addEventListener('DOMContentLoaded', function() {
    // Set up auto-scrolling for the slider-menu
    const sliderMenu = document.getElementById('slider-menu');
    if (!sliderMenu) return;
    
    const scrollContainer = sliderMenu.querySelector('#slider-container');
    if (!scrollContainer) return;
    
    let scrollDirection = -1; // -1 for right-to-left, 1 for left-to-right
    let scrollInterval = null;
    let isPaused = false;
    let scrollSpeed = 0.8; // Pixels per frame - reduced for smoother scrolling    // Start auto-scrolling
    function startAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        
        // Initialize position
        // For RTL, we start at the left (which is actually the right side of the content in RTL)
        scrollContainer.scrollLeft = 0;
        
        scrollInterval = setInterval(() => {
            if (isPaused) return;
            
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            
            // Increase scroll position for right-to-left movement
            // With RTL, scrollLeft behavior can be different across browsers
            // For consistent behavior, we'll check and handle both scenarios
            
            // For most browsers with RTL, scrollLeft starts at 0 (right) and goes negative
            if (scrollContainer.scrollLeft <= 0 && scrollContainer.scrollLeft > -maxScroll) {
                // Still has space to scroll to the left
                scrollContainer.scrollLeft -= scrollSpeed;
            } 
            // For browsers that use positive values in RTL mode
            else if (scrollContainer.scrollLeft >= 0 && scrollContainer.scrollLeft < maxScroll) {
                scrollContainer.scrollLeft += scrollSpeed;
            }
            // If we've reached the end, reset smoothly to the beginning
            else {
                // Reset scroll position to start scrolling again
                const resetScroll = () => {
                    scrollContainer.style.scrollBehavior = 'auto';
                    scrollContainer.scrollLeft = 0;
                    setTimeout(() => {
                        scrollContainer.style.scrollBehavior = 'smooth';
                    }, 50);
                };
                
                setTimeout(resetScroll, 1500); // Wait a bit at the end before resetting
            }
        }, 16); // ~60fps
    }
    
    // Pause scrolling when hovering
    scrollContainer.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Pause scrolling when touching (for mobile)
    scrollContainer.addEventListener('touchstart', () => {
        isPaused = true;
    });
    
    scrollContainer.addEventListener('touchend', () => {
        // Resume after a small delay to allow tapping items
        setTimeout(() => {
            isPaused = false;
        }, 1000);
    });    // Handle slider button clicks
    const prevBtn = sliderMenu.querySelector('.slider-btn.prev');
    const nextBtn = sliderMenu.querySelector('.slider-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // Get the width of one card plus its margin
            const cardWidth = scrollContainer.querySelector('.project-card').offsetWidth + 16; // 16px for margin
            
            // Scroll right (which visually goes left in RTL)
            scrollContainer.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
            // Pause auto-scrolling briefly after button click
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 2000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Get the width of one card plus its margin
            const cardWidth = scrollContainer.querySelector('.project-card').offsetWidth + 16; // 16px for margin
            
            // Scroll left (which visually goes right in RTL)            scrollContainer.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
            // Pause auto-scrolling briefly after button click
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 2000);
        });
    }
    
    // Start auto-scrolling after a short delay
    setTimeout(startAutoScroll, 1000);
});
